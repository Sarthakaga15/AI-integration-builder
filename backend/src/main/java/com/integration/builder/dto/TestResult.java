package com.integration.builder.dto;

import lombok.Data;

@Data
public class TestResult {
    private String status;
    private Long responseTime;
    private String sampleResponse;
    private String errorMessage;
}
