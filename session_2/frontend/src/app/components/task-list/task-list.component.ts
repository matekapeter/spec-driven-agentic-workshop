import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { MaterialModule } from '../../shared/material.module';
import { TaskService } from '../../services/task.service';
import { Task } from '../../interfaces/task.interface';
import { AddTaskComponent } from '../add-task/add-task.component';
import { EditTaskDialogComponent } from '../edit-task-dialog/edit-task-dialog.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MaterialModule, AddTaskComponent],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit, OnDestroy {
  // Reactive state using Angular Signals
  tasks = signal<Task[]>([]);
  loading = signal(false);
  
  private destroy$ = new Subject<void>();

  constructor(
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load all tasks from the backend
   */
  loadTasks() {
    this.loading.set(true);
    
    this.taskService.getAllTasksSimple()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Sort tasks: newest first
          const sortedTasks = response.content.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          this.tasks.set(sortedTasks);
          this.loading.set(false);
        },
        error: (error) => {
          console.error('Failed to load tasks:', error);
          this.loading.set(false);
          this.snackBar.open('Failed to load tasks', 'Close', { 
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  /**
   * Handle new task creation
   * @param task - Newly created task from AddTaskComponent
   */
  onTaskCreated(task: Task) {
    // Add new task to the beginning of the list (newest first)
    this.tasks.update(tasks => [task, ...tasks]);
    
    this.snackBar.open('Task created successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Toggle task completion status
   * @param task - Task to toggle
   */
  onToggleTask(task: Task) {
    this.taskService.toggleTaskCompletion(task.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedTask) => {
          // Update the task in the list
          this.tasks.update(tasks => 
            tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
          );
          
          const action = updatedTask.completed ? 'completed' : 'marked as incomplete';
          this.snackBar.open(`Task ${action}!`, 'Close', {
            duration: 2000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          console.error('Failed to toggle task:', error);
          this.snackBar.open('Failed to update task', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
  }

  /**
   * Open edit dialog for a task
   * @param task - Task to edit
   */
  onEditTask(task: Task) {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: '500px',
      data: { task }
    });

    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(updatedTask => {
        if (updatedTask) {
          // Update the task in the list
          this.tasks.update(tasks => 
            tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
          );
          
          this.snackBar.open('Task updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        }
      });
  }

  /**
   * Delete a task with confirmation
   * @param task - Task to delete
   */
  onDeleteTask(task: Task) {
    // Simple confirmation - could be enhanced with a proper dialog
    if (confirm(`Are you sure you want to delete "${task.title}"?`)) {
      this.taskService.deleteTask(task.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            // Remove task from the list
            this.tasks.update(tasks => tasks.filter(t => t.id !== task.id));
            
            this.snackBar.open('Task deleted successfully!', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (error) => {
            console.error('Failed to delete task:', error);
            this.snackBar.open('Failed to delete task', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
    }
  }

  /**
   * Get relative time string for task creation
   * @param createdAt - ISO date string
   */
  getRelativeTime(createdAt: string): string {
    const now = new Date();
    const created = new Date(createdAt);
    const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  /**
   * Track function for ngFor optimization
   * @param index - Array index
   * @param task - Task item
   */
  trackByTaskId(index: number, task: Task): number {
    return task.id;
  }
}
