package com.healthapp.backend;


import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

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
        logger.info("/uploadDoc called");
        if (file.isEmpty()) {
            logger.warn("No file uploaded");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No file uploaded");
        }
        logger.info("File received: {} (size: {} bytes)", file.getOriginalFilename(), file.getSize());
        String extractedText = "";
        try (InputStream is = file.getInputStream()) {
            Tika tika = new Tika();
            extractedText = tika.parseToString(is);
            logger.info("Text extracted from document ({} chars)", extractedText.length());
            System.out.println("Extracted Document Text:\n" + extractedText);
        } catch (IOException | TikaException e) {
            logger.error("Failed to extract text from document: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to extract text from document");
        }

        // Detect PDF form code for filing status (e.g. c1_3: 1/3/4) and build a hint for the LLM
        String filingHint = "";
        try {
            Pattern p = Pattern.compile("c1_3\\s*:\\s*(\\d)", Pattern.CASE_INSENSITIVE);
            Matcher m = p.matcher(extractedText);
            if (m.find()) {
                String code = m.group(1);
                if ("1".equals(code)) {
                    filingHint = "Note: The document contains 'c1_3: 1' — treat filing status as Single and set tax status for primary and spouse to 'Single'.";
                } else if ("3".equals(code)) {
                    filingHint = "Note: The document contains 'c1_3: 3' — treat filing status as Married Filing Jointly and set tax status for primary and spouse to 'Married Filing Jointly'.";
                } else if ("4".equals(code)) {
                    filingHint = "Note: The document contains 'c1_3: 4' — treat filing status as Married Filing Separately and set tax status for primary and spouse to 'Married Filing Separately'.";
                }
            }
        } catch (Exception ex) {
            // non-fatal — leave filingHint empty
        }
        // Call OpenAI ChatGPT to extract structured data
        if (openaiApiKey == null || openaiApiKey.isEmpty()) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("OpenAI API key not set");
        }
    String prompt = "Extract the following fields from this document and return as JSON with the following structure: " +
    "{\\n  'First Name': string,\\n  'Last Name': string,\\n  'SSN': string,\\n  'Address Line 1': string,\\n  'Address Line 2': string,\\n  'City': string,\\n  'State': string,\\n  'Zip': string,\\n  'Phone Number': string,\\n  'Alternate Phone Number': string,\\n  'Spouse': { 'First Name': string, 'Last Name': string, 'SSN': string },\\n  'Dependents': [ { 'First Name': string, 'Last Name': string, 'SSN': string, 'Relationship': string, 'Age': string } ],\\n  'tax': [ { 'name': string, 'taxStatus': string, 'reconciledPremiumTaxCredits': boolean } ],\\n  'income': [ { 'ownerName': string, 'amount': string, 'frequency': string, 'companyType': string } ]\\n}" +
    "\\nIf any field is missing, leave it blank. Return strictly valid JSON using the exact keys shown (use empty strings or false for missing values)." +
    (filingHint.isEmpty() ? "" : "\\n" + filingHint) +
    "\\nDocument:\n" + extractedText;

        RestTemplate restTemplate = new RestTemplate();
        String apiUrl = "https://api.openai.com/v1/chat/completions";
        JSONObject requestBody = new JSONObject();
        requestBody.put("model", "gpt-3.5-turbo");
        requestBody.put("messages", new org.json.JSONArray()
                .put(new JSONObject().put("role", "user").put("content", prompt)));
        requestBody.put("max_tokens", 512);

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
            JSONObject result = new JSONObject();
            result.put("fields", fields);
            result.put("rawText", extractedText);
            return ResponseEntity.ok()
                    .header("X-Session-Id", sessionId)
                    .header("Access-Control-Expose-Headers", "X-Session-Id")
                    .body(result.toString());
        } catch (Exception e) {
            return ResponseEntity.ok().header("X-Session-Id", sessionId).body(llmResponse);
        }
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

        // Detect c1_3 in this older /upload flow as well and add filing hint
        String filingHint = "";
        try {
            Pattern p = Pattern.compile("c1_3\\s*:\\s*(\\d)", Pattern.CASE_INSENSITIVE);
            Matcher m = p.matcher(extractedText);
            if (m.find()) {
                String code = m.group(1);
                if ("1".equals(code)) {
                    filingHint = "Note: The document contains 'c1_3: 1' — treat filing status as Single and set tax status for primary and spouse to 'Single'.";
                } else if ("3".equals(code)) {
                    filingHint = "Note: The document contains 'c1_3: 3' — treat filing status as Married Filing Jointly and set tax status for primary and spouse to 'Married Filing Jointly'.";
                } else if ("4".equals(code)) {
                    filingHint = "Note: The document contains 'c1_3: 4' — treat filing status as Married Filing Separately and set tax status for primary and spouse to 'Married Filing Separately'.";
                }
            }
        } catch (Exception ex) {
            // ignore
        }

        // Prepare prompt for LLM
        String prompt = "Extract the following fields from this document and return as JSON with the following structure: " +
                "{\n  'First Name': string,\n  'Last Name': string,\n  'SSN': string,\n  'Address Line 1': string,\n  'Address Line 2': string,\n  'City': string,\n  'State': string,\n  'Zip': string,\n  'Spouse': { 'First Name': string, 'Last Name': string, 'SSN': string },\n  'Dependents': [ { 'First Name': string, 'Last Name': string, 'SSN': string, 'Relationship': string, 'Age': string } ],\n  'Phone Number': string,\n  'Alternate Phone Number': string,\n  'tax': [ { 'name': string, 'taxStatus': string, 'reconciledPremiumTaxCredits': boolean } ],\n  'income': [ { 'ownerName': string, 'amount': string, 'frequency': string, 'companyType': string } ]\n}" +
                "\nIf any field is missing, leave it blank. Return strictly valid JSON using the exact keys shown (use empty strings or false for missing values)." +
                (filingHint.isEmpty() ? "" : "\n" + filingHint) +
                "\nDocument:\n" + extractedText;

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
