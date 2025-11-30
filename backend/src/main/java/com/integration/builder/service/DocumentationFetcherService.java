package com.integration.builder.service;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.springframework.stereotype.Service;
import java.io.IOException;

@Service
public class DocumentationFetcherService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(DocumentationFetcherService.class);

    public String fetchDocumentation(String url) {
        logger.info("Connecting to URL: {}", url);
        try {
            // Use Jsoup to fetch and parse HTML
            Document doc = Jsoup.connect(url)
                    .timeout(10000)
                    .ignoreHttpErrors(true)
                    .get();

            String content = doc.select("article, .documentation, .api-docs, body").text();
            logger.debug("Fetched content length: {}", content.length());
            return content;

        } catch (Exception e) {
            logger.warn("Failed to fetch documentation from URL: {}. Using MOCK documentation instead. Error: {}", url,
                    e.getMessage());
            return getMockDocumentation();
        }
    }

    private String getMockDocumentation() {
        return """
                # Calendly API Documentation

                Base URL: https://api.calendly.com
                Authentication: Bearer <token>

                ## Get Current User
                GET /users/me
                Returns basic information about the authenticated user.

                Response:
                {
                  "resource": {
                    "avatar_url": "https://...",
                    "created_at": "2020-01-01T00:00:00Z",
                    "email": "test@example.com",
                    "name": "John Doe"
                  }
                }
                """;
    }
}
