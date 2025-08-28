package com.healthapp.backend;


import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

import org.apache.tika.Tika;
import org.apache.tika.exception.TikaException;
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
import org.w3c.dom.NodeList;
import org.xml.sax.InputSource;

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

    // Endpoint to process a case when user consents to share with Department of Social Services
    @PostMapping(value = "/processCase", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> processCase(@RequestBody Map<String, Object> body, @RequestHeader(value = "X-Session-Id", required = false) String sessionId) {
        try {
            logger.info("/processCase called for sessionId={}", sessionId);
            // Expect a consent flag in the payload: either "consentDSS":"yes" or boolean true under key "consentDSS"
            Object consentObj = body.get("consentDSS");
            boolean consent = false;
            if (consentObj instanceof Boolean) consent = (Boolean) consentObj;
            else if (consentObj instanceof String) consent = "yes".equalsIgnoreCase(((String) consentObj).trim());

            if (!consent) {
                logger.warn("processCase called without consent; payload={}", body);
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new JSONObject().put("error", "consent required").toString());
            }

            // Generate a case id and (for now) log the full payload. Replace with real processing as needed.
            String caseId = UUID.randomUUID().toString();
            logger.info("Processing case {} payload: {}", caseId, body.toString());

            // Attempt to read a processCase template stored in src/assets/processCase.txt (may contain XML)
            String templateContent = null;
            try {
                // Resolve path relative to backend module directory
                Path p = Paths.get("src", "assets", "processCase1.txt");
                if (Files.exists(p)) {
                    byte[] bytes = Files.readAllBytes(p);
                    templateContent = new String(bytes, StandardCharsets.UTF_8);
                } else {
                    // Try repository-root relative path (in case working dir differs)
                    Path p2 = Paths.get("..", "src", "assets", "processCase1.txt");
                    if (Files.exists(p2)) {
                        templateContent = new String(Files.readAllBytes(p2), StandardCharsets.UTF_8);
                    }
                }
            } catch (Exception ioe) {
                logger.warn("Could not read processCase template: {}", ioe.getMessage());
                templateContent = null;
            }

            // Return a JSON response indicating the case was queued/processed and include template if found
            JSONObject resp = new JSONObject();
            resp.put("caseId", caseId);
            resp.put("status", "queued");
            resp.put("sessionId", sessionId == null ? JSONObject.NULL : sessionId);
            System.out.println("processCase template content: " + templateContent);
            if (templateContent != null) {
                resp.put("processCaseTemplate", templateContent);

                // Parse XML and extract caseIndividualDetail -> individualDetail fields
                try {
                    DocumentBuilderFactory dbFactory = DocumentBuilderFactory.newInstance();
                    dbFactory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
                    DocumentBuilder dBuilder = dbFactory.newDocumentBuilder();
                    InputSource isrc = new InputSource(new StringReader(templateContent));
                    org.w3c.dom.Document xmlDoc = dBuilder.parse(isrc);
                    xmlDoc.getDocumentElement().normalize();

                    NodeList caseIndList = xmlDoc.getElementsByTagName("caseIndividualDetail");
                    JSONObject primaryObj = null;
                    org.json.JSONArray dependents = new org.json.JSONArray();
                    for (int i = 0; i < caseIndList.getLength(); i++) {
                        org.w3c.dom.Node caseNode = caseIndList.item(i);
                        if (caseNode.getNodeType() != org.w3c.dom.Node.ELEMENT_NODE) continue;
                        org.w3c.dom.Element caseElem = (org.w3c.dom.Element) caseNode;
                        NodeList indivList = caseElem.getElementsByTagName("individualDetail");
                        if (indivList.getLength() == 0) continue;
                        org.w3c.dom.Element indivElem = (org.w3c.dom.Element) indivList.item(0);

                        String firstName = getTagValue(indivElem, "firstName");
                        String lastName = getTagValue(indivElem, "lastName");
                        String gender = getTagValue(indivElem, "genderCode");
                        String dob = getTagValue(indivElem, "dob");
                        // normalize DOB to MM/dd/yyyy if possible (input often YYYY-MM-dd)
                        String formattedDob = dob;
                        if (dob != null && !dob.isEmpty()) {
                            try {
                                java.time.format.DateTimeFormatter inputFmt = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
                                java.time.format.DateTimeFormatter outFmt = java.time.format.DateTimeFormatter.ofPattern("MM/dd/yyyy");
                                java.time.LocalDate ld = java.time.LocalDate.parse(dob, inputFmt);
                                formattedDob = ld.format(outFmt);
                            } catch (Exception e) {
                                try {
                                    // fallback to ISO parse
                                    java.time.LocalDate ld = java.time.LocalDate.parse(dob);
                                    formattedDob = ld.format(java.time.format.DateTimeFormatter.ofPattern("MM/dd/yyyy"));
                                } catch (Exception ex) {
                                    // leave as-is if parsing fails
                                    formattedDob = dob;
                                }
                            }
                        }
                        // SSN may be nested under <ssnDetail><ssn>...</ssn></ssnDetail>
                        String ssn = null;
                        try {
                            NodeList ssnDetails = indivElem.getElementsByTagName("ssnDetail");
                            if (ssnDetails != null && ssnDetails.getLength() > 0) {
                                org.w3c.dom.Node sd = ssnDetails.item(0);
                                if (sd.getNodeType() == org.w3c.dom.Node.ELEMENT_NODE) {
                                    org.w3c.dom.Element sdElem = (org.w3c.dom.Element) sd;
                                    ssn = getTagValue(sdElem, "ssn");
                                }
                            }
                        } catch (Exception ignore) {
                        }
                        // fallback: try direct ssn tag variants
                        if (ssn == null || ssn.isEmpty()) {
                            ssn = getTagValue(indivElem, "SSN");
                            if (ssn == null || ssn.isEmpty()) ssn = getTagValue(indivElem, "ssn");
                        }
                        String primaryStatus = getTagValue(indivElem, "primaryStatusInd");
                        boolean isPrimary = "true".equalsIgnoreCase(primaryStatus) || "yes".equalsIgnoreCase(primaryStatus) || "1".equals(primaryStatus);

                        JSONObject ind = new JSONObject();
                        ind.put("firstName", firstName == null ? "" : firstName);
                        ind.put("lastName", lastName == null ? "" : lastName);
                        ind.put("genderCode", gender == null ? "" : gender);
                        ind.put("dob", formattedDob == null ? "" : formattedDob);
                        ind.put("ssn", ssn == null ? "" : ssn);
                        if (isPrimary && primaryObj == null) {
                            primaryObj = ind;
                        } else {
                            dependents.put(ind);
                        }
                    }
                    if (primaryObj != null) resp.put("primary", primaryObj);
                    if (dependents.length() > 0) resp.put("dependents", dependents);

                    // If caller provided a household in the request body, merge parsed individuals into it
                    try {
                        Object hhObj = body.get("household");
                        JSONObject incomingHH = null;
                        if (hhObj instanceof Map) {
                            incomingHH = new JSONObject((Map<?,?>) hhObj);
                        } else if (hhObj instanceof String) {
                            try {
                                incomingHH = new JSONObject((String) hhObj);
                            } catch (Exception se) {
                                // ignore parse error and leave incomingHH null
                            }
                        }
                        if (incomingHH != null) {

                            // Ensure dependents array exists in incoming household
                            org.json.JSONArray incomingDependents = incomingHH.has("dependents") && incomingHH.get("dependents") instanceof org.json.JSONArray
                                    ? incomingHH.getJSONArray("dependents")
                                    : (incomingHH.has("dependents") ? new org.json.JSONArray(incomingHH.get("dependents")) : new org.json.JSONArray());

                            // Helper to find and merge by SSN in primary, spouse, dependents
                            java.util.function.BiConsumer<JSONObject, JSONObject> mergePerson = (target, src) -> {
                                if (target == null || src == null) return;
                                if (src.has("firstName")) target.put("firstName", src.optString("firstName", target.optString("firstName", "")));
                                if (src.has("lastName")) target.put("lastName", src.optString("lastName", target.optString("lastName", "")));
                                if (src.has("dob")) target.put("dob", src.optString("dob", target.optString("dob", "")));
                                if (src.has("genderCode")) target.put("gender", src.optString("genderCode", target.optString("gender", "")));
                                if (src.has("ssn")) target.put("ssn", src.optString("ssn", target.optString("ssn", "")));
                                else if (src.has("SSN")) target.put("ssn", src.optString("SSN", target.optString("ssn", "")));
                            };

                            // Helper to search dependents array by SSN
                            java.util.function.Function<String, Integer> findDependentIndex = (ssn) -> {
                                if (ssn == null || ssn.isEmpty()) return -1;
                                for (int di = 0; di < incomingDependents.length(); di++) {
                                    org.json.JSONObject d = incomingDependents.getJSONObject(di);
                                    String dssn = d.optString("ssn", "");
                                    if (dssn != null && !dssn.isEmpty() && dssn.equals(ssn)) return di;
                                }
                                return -1;
                            };

                            // Merge primary if present
                            if (primaryObj != null) {
                                        String pSSN = primaryObj.optString("ssn", "").trim();
                                boolean mergedPrimary = false;
                                if (incomingHH.has("primary") && !incomingHH.isNull("primary")) {
                                    org.json.JSONObject inPrimary = incomingHH.getJSONObject("primary");
                                    String inPssn = inPrimary.optString("ssn", "");
                                    if (pSSN.length() > 0 && pSSN.equals(inPssn)) {
                                        mergePerson.accept(inPrimary, primaryObj);
                                        mergedPrimary = true;
                                    }
                                }
                                if (!mergedPrimary) {
                                    // If incoming has no primary or primary is empty, set it
                                    boolean hasPrimary = incomingHH.has("primary") && !incomingHH.isNull("primary") && (
                                            (incomingHH.getJSONObject("primary").optString("firstName", "").length() > 0) ||
                                                    (incomingHH.getJSONObject("primary").optString("ssn", "").length() > 0)
                                    );
                                    if (!hasPrimary) {
                                        // normalize keys
                                        org.json.JSONObject newPrimary = new org.json.JSONObject();
                                        newPrimary.put("firstName", primaryObj.optString("firstName", ""));
                                        newPrimary.put("lastName", primaryObj.optString("lastName", ""));
                                        newPrimary.put("dob", primaryObj.optString("dob", ""));
                                        newPrimary.put("gender", primaryObj.optString("genderCode", ""));
                                        newPrimary.put("ssn", primaryObj.optString("ssn", ""));
                                        incomingHH.put("primary", newPrimary);
                                    } else {
                                        // add as dependent
                                        org.json.JSONObject dep = new org.json.JSONObject();
                                        dep.put("id", UUID.randomUUID().toString());
                                        dep.put("firstName", primaryObj.optString("firstName", ""));
                                        dep.put("lastName", primaryObj.optString("lastName", ""));
                                        dep.put("dob", primaryObj.optString("dob", ""));
                                        dep.put("gender", primaryObj.optString("genderCode", ""));
                                        dep.put("ssn", primaryObj.optString("ssn", ""));
                                        incomingDependents.put(dep);
                                    }
                                }
                            }

                            // Merge dependents
                            for (int di = 0; di < dependents.length(); di++) {
                                org.json.JSONObject parsedDep = dependents.getJSONObject(di);
                                String dSSN = parsedDep.optString("ssn", "").trim();
                                boolean merged = false;
                                if (dSSN.length() > 0) {
                                    // match primary
                                    if (incomingHH.has("primary") && !incomingHH.isNull("primary")) {
                                        org.json.JSONObject inPrimary = incomingHH.getJSONObject("primary");
                                        if (dSSN.equals(inPrimary.optString("ssn", "").trim())) {
                                            mergePerson.accept(inPrimary, parsedDep);
                                            merged = true;
                                        }
                                    }
                                    // match spouse
                                    if (!merged && incomingHH.has("spouse") && !incomingHH.isNull("spouse")) {
                                        org.json.JSONObject inSpouse = incomingHH.getJSONObject("spouse");
                                        if (dSSN.equals(inSpouse.optString("ssn", "").trim())) {
                                            mergePerson.accept(inSpouse, parsedDep);
                                            merged = true;
                                        }
                                    }
                                    // match dependents
                                    if (!merged) {
                                        int idx = findDependentIndex.apply(dSSN);
                                        if (idx != -1) {
                                            org.json.JSONObject target = incomingDependents.getJSONObject(idx);
                                            mergePerson.accept(target, parsedDep);
                                            merged = true;
                                        }
                                    }
                                }
                                if (!merged) {
                                    org.json.JSONObject newDep = new org.json.JSONObject();
                                    newDep.put("id", UUID.randomUUID().toString());
                                    newDep.put("firstName", parsedDep.optString("firstName", ""));
                                    newDep.put("lastName", parsedDep.optString("lastName", ""));
                                    newDep.put("dob", parsedDep.optString("dob", ""));
                                    newDep.put("gender", parsedDep.optString("genderCode", ""));
                                    newDep.put("ssn", parsedDep.optString("ssn", ""));
                                    incomingDependents.put(newDep);
                                }
                            }

                            // attach dependents array back to incomingHH
                            incomingHH.put("dependents", incomingDependents);

                            // If spouse exists but contains no meaningful data, remove it
                            try {
                                if (incomingHH.has("spouse") && !incomingHH.isNull("spouse")) {
                                    org.json.JSONObject spouseObj = incomingHH.getJSONObject("spouse");
                                    boolean hasData = false;
                                    String[] checkKeys = new String[]{"firstName", "lastName", "ssn", "dob", "gender", "citizen"};
                                    for (String k : checkKeys) {
                                        if (spouseObj.has(k) && spouseObj.optString(k, "").trim().length() > 0) {
                                            hasData = true;
                                            break;
                                        }
                                    }
                                    // also consider boolean flags like applyForCoverage or citizen
                                    if (!hasData) {
                                        if (spouseObj.has("applyForCoverage") && spouseObj.optBoolean("applyForCoverage", false)) {
                                            hasData = true;
                                        }
                                        if (spouseObj.has("citizen") && (spouseObj.optBoolean("citizen", false))) {
                                            hasData = true;
                                        }
                                    }
                                    if (!hasData) {
                                        incomingHH.remove("spouse");
                                    }
                                }
                            } catch (Exception ignore) {
                            }

                            resp.put("mergedHousehold", incomingHH);
                        }
                    } catch (Exception mergeEx) {
                        logger.warn("Failed to merge parsed individuals into incoming household: {}", mergeEx.getMessage());
                    }
                } catch (Exception parseEx) {
                    logger.warn("Failed to parse processCase template XML: {}", parseEx.getMessage());
                }
            }
            return ResponseEntity.ok(resp.toString());
        } catch (Exception ex) {
            logger.error("Error in processCase: {}", ex.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new JSONObject().put("error", ex.getMessage()).toString());
        }
        
    }

    // Helper to safely get child element text
    private static String getTagValue(org.w3c.dom.Element parent, String tagName) {
        NodeList nl = parent.getElementsByTagName(tagName);
        if (nl == null || nl.getLength() == 0) return null;
        org.w3c.dom.Node n = nl.item(0);
        if (n == null) return null;
        return n.getTextContent();
    }

}
