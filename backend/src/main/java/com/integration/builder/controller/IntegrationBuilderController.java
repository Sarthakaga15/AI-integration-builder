package com.integration.builder.controller;

import com.integration.builder.dto.*;
import com.integration.builder.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "http://localhost:5173") // Allow frontend access
public class IntegrationBuilderController {

    private static final Logger logger = LoggerFactory.getLogger(IntegrationBuilderController.class);

    @Autowired
    private DocumentationFetcherService docFetcher;

    @Autowired
    private AICodeGeneratorService codeGenerator;

    @Autowired
    private SandboxExecutorService sandboxExecutor;

    @PostMapping("/generate")
    public ResponseEntity<GeneratedCode> generateIntegration(
            @RequestBody GenerationRequest request) {

        logger.info("Received generation request for URL: {}", request.getApiDocUrl());

        try {
            // 1. Fetch API documentation
            logger.info("Fetching documentation...");
            String apiDoc = docFetcher.fetchDocumentation(request.getApiDocUrl());
            logger.info("Documentation fetched successfully. Length: {} chars", apiDoc.length());

            // 2. Generate code using AI
            logger.info("Sending to AI for code generation...");
            GeneratedCode code = codeGenerator.generateIntegration(
                    apiDoc,
                    request.getOptions());
            logger.info("Code generation completed successfully.");

            return ResponseEntity.ok(code);
        } catch (Exception e) {
            logger.error("Unexpected error during generation", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/sandbox/test")
    public ResponseEntity<TestResult> testInSandbox(
            @RequestBody SandboxTestRequest request) {

        logger.info("Received sandbox test request");
        TestResult result = sandboxExecutor.executeSandboxTest(
                request.getCode(),
                request.getTestConfig());
        logger.info("Sandbox test completed with status: {}", result.getStatus());

        return ResponseEntity.ok(result);
    }
}
