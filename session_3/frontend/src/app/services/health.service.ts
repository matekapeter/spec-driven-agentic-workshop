import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { HealthResponse, HealthStatus } from '../interfaces/health.interface';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  private readonly baseUrl = '/api/v1';

  constructor(private http: HttpClient) {}

  checkHealth(): Observable<HealthStatus> {
    return this.http.get<HealthResponse>(`${this.baseUrl}/health`).pipe(
      map(response => {
        const isHealthy = response.status === 'UP';
        const dbStatus = response.database ? ` | DB: ${response.database}` : '';
        return {
          isHealthy: isHealthy,
          message: isHealthy ? `🚀 Backend Connected ${dbStatus}` : `⚠️ Backend Issues ${dbStatus}`,
          lastChecked: new Date()
        };
      }),
      catchError((error: any) => {
        console.error('Health check failed:', error);
        return of({
          isHealthy: false,
          message: error.status === 0 ? '💀 Backend Offline' : '⚠️ Backend Error',
          lastChecked: new Date()
        });
      })
    );
  }
}
