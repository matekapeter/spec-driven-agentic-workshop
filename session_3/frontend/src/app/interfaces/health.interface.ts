export interface HealthResponse {
  status: string;
  database?: string;
  timestamp: string;
}

export interface HealthStatus {
  isHealthy: boolean;
  message: string;
  lastChecked?: Date;
}
