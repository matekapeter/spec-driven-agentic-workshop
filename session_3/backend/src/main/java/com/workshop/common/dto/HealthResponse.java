package com.workshop.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.Instant;

public class HealthResponse {
    private String status;
    private String database;
    
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", timezone = "UTC")
    private Instant timestamp;

    public HealthResponse() {
        this.timestamp = Instant.now();
    }

    public HealthResponse(String status) {
        this();
        this.status = status;
    }

    public HealthResponse(String status, String database) {
        this();
        this.status = status;
        this.database = database;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDatabase() {
        return database;
    }

    public void setDatabase(String database) {
        this.database = database;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }
}
