package com.integration.builder.dto;

import lombok.Data;
import java.util.List;

@Data
public class GeneratedCode {
    private List<FileContent> files;
    private List<String> dependencies;
    private String instructions;

    @Data
    public static class FileContent {
        private String filename;
        private String content;
    }
}
