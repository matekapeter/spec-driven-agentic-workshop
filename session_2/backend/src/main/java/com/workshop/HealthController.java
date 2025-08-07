package com.workshop;

import com.workshop.common.dto.HealthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        log.debug("Health check requested");
        HealthResponse response = new HealthResponse("UP");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<String> index() {
        log.debug("Root endpoint accessed");
        return ResponseEntity.ok("🚀 Workshop Backend API v1.0");
    }
}