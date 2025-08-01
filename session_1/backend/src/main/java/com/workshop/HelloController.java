package com.workshop;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

	@GetMapping("/")
	public String index() {
		return "👋";
	}

	@GetMapping("/api/health")
	public String health() {
		return "{\"🚀\":\"UP\",\"⏱️\":\"" + System.currentTimeMillis() + "\"}";
	}

}