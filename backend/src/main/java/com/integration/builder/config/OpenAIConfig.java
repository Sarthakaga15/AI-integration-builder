package com.integration.builder.config;

import com.theokanning.openai.service.OpenAiService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAIConfig {

    @Value("${openai.api.key}")
    private String apiKey;

    @Bean
    public OpenAiService openAiService() {
        // Fallback or check if key is present
        if (apiKey == null || apiKey.isEmpty() || apiKey.equals("YOUR_OPENAI_API_KEY")) {
            // Return a dummy service or handle error gracefully in production
            // For now, we assume the user will set it.
            // If we return null, autowiring will fail.
            // Let's just return new OpenAiService("dummy") if it's missing to allow
            // startup,
            // but calls will fail.
            return new OpenAiService("dummy");
        }
        return new OpenAiService(apiKey);
    }
}
