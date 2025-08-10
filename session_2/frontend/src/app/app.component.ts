import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from './shared/material.module';
import { HealthService } from './services/health.service';
import { HealthStatus } from './interfaces/health.interface';
import { TaskListComponent } from './components/task-list/task-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MaterialModule, TaskListComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Workshop Frontend';
  
  // Using Angular Signals for reactive state management
  healthStatus = signal<HealthStatus>({
    isHealthy: false,
    message: 'Not checked'
  });
  
  loading = signal(false);
  
  private destroy$ = new Subject<void>();

  constructor(
    private healthService: HealthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    // Perform initial health check on app startup
    this.checkHealth();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  checkHealth() {
    this.loading.set(true);
    
    this.healthService.checkHealth()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status: HealthStatus) => {
          this.healthStatus.set(status);
          this.loading.set(false);
          
          // Show success snackbar for successful connections
          if (status.isHealthy) {
            this.snackBar.open(
              'Backend connection successful!', 
              'Close', 
              { 
                duration: 3000,
                panelClass: ['success-snackbar']
              }
            );
          }
        },
        error: (error) => {
          this.loading.set(false);
          this.snackBar.open(
            'Failed to check backend health', 
            'Retry', 
            { 
              duration: 5000,
              panelClass: ['error-snackbar']
            }
          ).onAction().subscribe(() => {
            this.checkHealth();
          });
        }
      });
  }

  getStatusClass(): string {
    return this.healthStatus().isHealthy ? 'health-status-healthy' : 'health-status-unhealthy';
  }
}