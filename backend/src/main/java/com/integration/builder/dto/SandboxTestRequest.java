package com.integration.builder.dto;

import lombok.Data;
import java.util.Map;

@Data
public class SandboxTestRequest {
    private String code;
    private Map<String, String> testConfig;
}
