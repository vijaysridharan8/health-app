package com.healthapp.backend;


import org.springframework.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;
import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;
import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class DocumentController {
    private static final Logger logger = LoggerFactory.getLogger(DocumentController.class);

    @Value("${OPENAI_API_KEY}")
    private String openaiApiKey;

    // Store document text in memory for each session (simple demo, not for production)
    private Map<String, String> sessionDocumentText = new ConcurrentHashMap<>();

    // New endpoint: analyze file and pre-populate data
    @PostMapping(value = "/uploadDoc", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadDoc(@RequestParam("file") MultipartFile file, @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        System.out.println("Test log");
        logger.info("/uploadDoc called");
        if (file.isEmpty()) {
            logger.warn("No file uploaded");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded");
        }
        logger.info("File received: {} (size: {} bytes)", file.getOriginalFilename(), file.getSize());
        String extractedText;
        try {
            Tika tika = new Tika();
            extractedText = tika.parseToString(file.getInputStream());
            logger.info("Text extracted from document ({} chars)", extractedText.length());
        } catch (IOException | TikaException e) {
            logger.error("Failed to extract text from document: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to extract text from document");
        }

        // Store extracted text for chat use
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
            logger.info("Generated new sessionId: {}", sessionId);
        }
        sessionDocumentText.put(sessionId, extractedText);
        logger.info("Stored extracted text for sessionId: {}", sessionId);

        // Pre-populate data fields from extracted text (simple demo)
        // In a real scenario, use NLP or regex to extract fields
        JSONObject prePopulated = new JSONObject();
        prePopulated.put("First Name", "");
        prePopulated.put("Last Name", "");
        prePopulated.put("SSN", "");
        prePopulated.put("Address Line 1", "");
        prePopulated.put("Address Line 2", "");
        prePopulated.put("City", "");
        prePopulated.put("State", "");
        prePopulated.put("Zip", "");
        prePopulated.put("Income", "");
        prePopulated.put("Deductions", "");
        JSONObject spouse = new JSONObject();
        spouse.put("First Name", "");
        spouse.put("Last Name", "");
        spouse.put("SSN", "");
        prePopulated.put("Spouse", spouse);
        prePopulated.put("Dependents", new org.json.JSONArray());

        // For demo, just return the extracted text and empty fields
        JSONObject result = new JSONObject();
        result.put("fields", prePopulated);
        result.put("rawText", extractedText);

        logger.info("Returning pre-populated fields and raw text for sessionId: {}", sessionId);
        return ResponseEntity.ok()
            .header("X-Session-Id", sessionId)
            .header("Access-Control-Expose-Headers", "X-Session-Id")
            .body(result.toString());
    }


    // (other endpoints like /upload and /chat go here)

    // Original /upload endpoint
    @PostMapping(value = "/upload", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> uploadDocument(@RequestParam("file") MultipartFile file, @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded");
        }
        String extractedText;
        try {
            Tika tika = new Tika();
            extractedText = tika.parseToString(file.getInputStream());
        } catch (IOException | TikaException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to extract text from document");
        }

        // Store extracted text for chat use
        if (sessionId == null || sessionId.isEmpty()) {
            sessionId = UUID.randomUUID().toString();
        }
        sessionDocumentText.put(sessionId, extractedText);

        // Prepare prompt for LLM
        String prompt = "Extract the following fields from this document and return as JSON with the following structure: " +
                "{\n  'First Name': string,\n  'Last Name': string,\n  'SSN': string,\n  'Address Line 1': string,\n  'Address Line 2': string,\n  'City': string,\n  'State': string,\n  'Zip': string,\n  'Income': string,\n  'Deductions': string,\n  'Spouse': { 'First Name': string, 'Last Name': string, 'SSN': string },\n  'Dependents': [ { 'First Name': string, 'Last Name': string, 'SSN': string, 'Relationship': string, 'Age': string } ]\n}" +
                "\nIf any field is missing, leave it blank. Document:\n" + extractedText;

        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("OpenAI API key not set");
        }
        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "https://api.openai.com/v1/chat/completions";
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", new org.json.JSONArray()
            .put(new JSONObject().put("role", "user").put("content", prompt)));
        requestBody.put("max_tokens", 256);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(requestBody.toString(), headers);
        String llmResponse;
        try {
            org.springframework.http.ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("LLM API error: " + response.getBody());
            }
            JSONObject respJson = new JSONObject(response.getBody());
            llmResponse = respJson.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error calling LLM: " + e.getMessage());
        }

        // Try to parse the LLM response as JSON
        try {
            JSONObject fields = new JSONObject(llmResponse);
            return ResponseEntity.ok()
            .header("X-Session-Id", sessionId)
            .header("Access-Control-Expose-Headers", "X-Session-Id")
            .body(fields.toString());

        } catch (Exception e) {
            return ResponseEntity.ok().header("X-Session-Id", sessionId).body(llmResponse);
        }
    }

    // /chat endpoint
    @PostMapping(value = "/chat", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> chatWithDocument(@RequestBody Map<String, String> body, @RequestHeader(value = "X-Session-Id") String sessionId) {
        String question = body.get("question");
        if (sessionId == null || !sessionDocumentText.containsKey(sessionId)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No document uploaded for this session");
        }
        String docText = sessionDocumentText.get(sessionId);
        String prompt = "Given the following document, answer the user's question as accurately as possible.\nDocument:\n" + docText + "\nQuestion: " + question;

        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("OpenAI API key not set");
        }
        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "https://api.openai.com/v1/chat/completions";
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", new org.json.JSONArray()
            .put(new JSONObject().put("role", "user").put("content", prompt)));
        requestBody.put("max_tokens", 256);

        org.springframework.http.HttpHeaders headers = new org.springframework.http.HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(openaiApiKey);

        org.springframework.http.HttpEntity<String> entity = new org.springframework.http.HttpEntity<>(requestBody.toString(), headers);
        String llmResponse;
        try {
            org.springframework.http.ResponseEntity<String> response = restTemplate.postForEntity(apiUrl, entity, String.class);
            if (!response.getStatusCode().is2xxSuccessful()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("LLM API error: " + response.getBody());
            }
            JSONObject respJson = new JSONObject(response.getBody());
            llmResponse = respJson.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error calling LLM: " + e.getMessage());
        }
        return ResponseEntity.ok(new JSONObject().put("answer", llmResponse).toString());
    }

}
