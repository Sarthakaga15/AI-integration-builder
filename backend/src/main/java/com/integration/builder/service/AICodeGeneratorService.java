package com.integration.builder.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.integration.builder.dto.GeneratedCode;
import com.integration.builder.dto.GenerationOptions;
import com.theokanning.openai.completion.chat.ChatCompletionRequest;
import com.theokanning.openai.completion.chat.ChatMessage;
import com.theokanning.openai.completion.chat.ChatCompletionResult;
import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AICodeGeneratorService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AICodeGeneratorService.class);

    @Autowired
    private OpenAiService openAiService;

    @Autowired
    private ObjectMapper objectMapper;

    public GeneratedCode generateIntegration(String apiDoc, GenerationOptions options) {

        logger.info("Preparing prompt for AI generation...");
        // String prompt = buildPrompt(apiDoc, options);
        // logger.debug("Prompt length: {}", prompt.length());

        // ChatCompletionRequest request = ChatCompletionRequest.builder()
        // .model("gpt-4-turbo-preview")
        // .messages(List.of(
        // new ChatMessage("system", "You are an expert API integration engineer."),
        // new ChatMessage("user", prompt)
        // ))
        // .temperature(0.3)
        // .maxTokens(4000)
        // .build();

        // logger.info("Calling OpenAI API...");
        // ChatCompletionResult result = openAiService.createChatCompletion(request);
        // String generatedCodeJson =
        // result.getChoices().get(0).getMessage().getContent();
        // logger.info("Received response from OpenAI. Parsing JSON...");

        // return parseGeneratedCode(generatedCodeJson);

        logger.info("Returning MOCK response for demonstration.");
        return getMockGeneratedCode();
    }

    private GeneratedCode getMockGeneratedCode() {
        GeneratedCode code = new GeneratedCode();

        GeneratedCode.FileContent clientFile = new GeneratedCode.FileContent();
        clientFile.setFilename("ApiClient.java");
        clientFile.setContent("""
                package com.integration.generated;

                import org.springframework.stereotype.Service;
                import org.springframework.web.client.RestTemplate;
                import org.springframework.beans.factory.annotation.Value;
                import org.slf4j.Logger;
                import org.slf4j.LoggerFactory;
                import java.util.List;

                /**
                 * Generated API Client for integration.
                 */
                @Service
                public class ApiClient {

                    private static final Logger logger = LoggerFactory.getLogger(ApiClient.class);
                    private final RestTemplate restTemplate;
                    private final String baseUrl;
                    private final String apiKey;

                    public ApiClient(RestTemplate restTemplate,
                                     @Value("${api.base.url}") String baseUrl,
                                     @Value("${api.key}") String apiKey) {
                        this.restTemplate = restTemplate;
                        this.baseUrl = baseUrl;
                        this.apiKey = apiKey;
                    }

                    public UserResponse getUser(String userId) {
                        logger.info("Fetching user with ID: {}", userId);
                        String url = baseUrl + "/users/" + userId;
                        // Add headers for auth if needed
                        return restTemplate.getForObject(url, UserResponse.class);
                    }
                }
                """);

        GeneratedCode.FileContent dtoFile = new GeneratedCode.FileContent();
        dtoFile.setFilename("UserResponse.java");
        dtoFile.setContent("""
                package com.integration.generated;

                import lombok.Data;

                @Data
                public class UserResponse {
                    private String id;
                    private String name;
                    private String email;
                    private String status;
                }
                """);

        GeneratedCode.FileContent configFile = new GeneratedCode.FileContent();
        configFile.setFilename("AppConfig.java");
        configFile.setContent("""
                package com.integration.generated;

                import org.springframework.context.annotation.Bean;
                import org.springframework.context.annotation.Configuration;
                import org.springframework.web.client.RestTemplate;

                @Configuration
                public class AppConfig {

                    @Bean
                    public RestTemplate restTemplate() {
                        return new RestTemplate();
                    }
                }
                """);

        code.setFiles(List.of(clientFile, dtoFile, configFile));
        code.setDependencies(List.of("spring-boot-starter-web", "org.projectlombok:lombok"));
        code.setInstructions("""
                1. Copy the generated files to your source directory.
                2. Add the listed dependencies to your pom.xml.
                3. Configure 'api.base.url' and 'api.key' in your application.properties.
                4. Inject ApiClient into your services to start making calls.
                """);

        return code;
    }

    private String buildPrompt(String apiDocContent, GenerationOptions options) {
        return """
                You are an expert software engineer specializing in API integrations.

                I will provide you with API documentation. Generate production-ready Java code that includes:

                1. API Client class with all necessary methods
                2. Authentication setup (Bearer token, API key, or OAuth2)
                3. Methods to retrieve users and usage data
                4. Comprehensive error handling with retries
                5. Pagination support (handle all pages)
                6. Structured logging (SLF4J)

                Requirements:
                - Use Spring Boot 3.x and Java 17
                - Use RestTemplate or WebClient for HTTP calls
                - Include JavaDoc comments
                - Follow clean code principles
                - Handle rate limiting with exponential backoff
                - Parse JSON responses using Jackson

                API Documentation:
                %s

                Generate complete, executable code. Include:
                - Main API client class
                - Configuration class
                - Model/DTO classes for responses
                - Service class with business logic

                Format the response as JSON with this structure:
                {
                  "files": [
                    {
                      "filename": "CalendlyClient.java",
                      "content": "package com.integration..."
                    }
                  ],
                  "dependencies": ["spring-boot-starter-web", ...],
                  "instructions": "How to use this code..."
                }
                """.formatted(apiDocContent);
    }

    private GeneratedCode parseGeneratedCode(String json) {
        try {
            // Clean up markdown code blocks if present
            if (json.contains("```json")) {
                json = json.substring(json.indexOf("```json") + 7);
                if (json.contains("```")) {
                    json = json.substring(0, json.indexOf("```"));
                }
            } else if (json.startsWith("```")) {
                json = json.substring(3);
                if (json.endsWith("```")) {
                    json = json.substring(0, json.length() - 3);
                }
            }
            return objectMapper.readValue(json, GeneratedCode.class);
        } catch (Exception e) {
            e.printStackTrace();
            // Return empty or error
            GeneratedCode error = new GeneratedCode();
            error.setInstructions("Error parsing generated code: " + e.getMessage());
            return error;
        }
    }
}
