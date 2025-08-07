export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface HealthStatus {
  isHealthy: boolean;
  message: string;
  lastChecked?: Date;
}
