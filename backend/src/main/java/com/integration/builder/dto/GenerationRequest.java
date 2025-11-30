package com.integration.builder.dto;

import lombok.Data;

@Data
public class GenerationRequest {
    private String apiDocUrl;
    private GenerationOptions options;
}
