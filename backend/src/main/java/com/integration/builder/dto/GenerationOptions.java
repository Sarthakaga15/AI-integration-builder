package com.integration.builder.dto;

import lombok.Data;

@Data
public class GenerationOptions {
    private boolean includeAuth;
    private boolean includePagination;
    private boolean includeErrorHandling;
}
