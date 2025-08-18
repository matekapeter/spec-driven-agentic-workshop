package com.workshop;

import com.workshop.common.dto.HealthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@RestController
@RequestMapping("/api/v1")
public class HealthController {
    private static final Logger log = LoggerFactory.getLogger(HealthController.class);
    
    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<HealthResponse> health() {
        log.debug("Health check requested");
        
        String dbStatus = "DOWN";
        try (Connection connection = dataSource.getConnection()) {
            if (connection != null && connection.isValid(5)) {
                dbStatus = "UP";
            }
        } catch (SQLException e) {
            log.error("Database health check failed", e);
        }
        
        String overallStatus = "UP".equals(dbStatus) ? "UP" : "DOWN";
        HealthResponse response = new HealthResponse(overallStatus, dbStatus);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/")
    public ResponseEntity<String> index() {
        log.debug("Root endpoint accessed");
        return ResponseEntity.ok("🚀 Workshop Backend API v1.0");
    }
}