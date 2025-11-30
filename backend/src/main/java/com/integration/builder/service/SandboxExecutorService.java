package com.integration.builder.service;

import com.integration.builder.dto.TestResult;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
public class SandboxExecutorService {

    public TestResult executeSandboxTest(String code, Map<String, String> config) {
        // Mock implementation for now
        // In a real implementation, this would spin up a Docker container
        TestResult result = new TestResult();
        result.setStatus("SUCCESS");
        result.setResponseTime(234L);
        result.setSampleResponse("{\"status\": \"ok\", \"message\": \"Mock response from sandbox\"}");
        return result;
    }
}
