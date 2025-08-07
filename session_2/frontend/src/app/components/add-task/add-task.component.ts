import { Component, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../shared/material.module';
import { TaskService } from '../../services/task.service';
import { Task, CreateTaskRequest } from '../../interfaces/task.interface';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent {
  @Output() taskCreated = new EventEmitter<Task>();

  // Reactive form for task creation
  taskForm: FormGroup;
  
  // Loading state
  loading = signal(false);

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.taskForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255)
      ]],
      description: ['', [
        Validators.maxLength(1000)
      ]]
    });
  }

  /**
   * Submit the form to create a new task
   */
  onSubmit() {
    if (this.taskForm.valid && !this.loading()) {
      this.loading.set(true);
      
      const createRequest: CreateTaskRequest = {
        title: this.taskForm.value.title.trim(),
        description: this.taskForm.value.description?.trim() || undefined
      };

      this.taskService.createTask(createRequest).subscribe({
        next: (newTask) => {
          this.loading.set(false);
          this.taskCreated.emit(newTask);
          
          // Reset form after successful creation
          this.taskForm.reset();
          
          // Mark form as untouched to reset validation states
          this.taskForm.markAsUntouched();
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Failed to create task:', error);
          
          // Show specific error message if available
          const errorMessage = error.error?.message || 'Failed to create task';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      this.taskForm.markAllAsTouched();
    }
  }

  /**
   * Reset the form to initial state
   */
  onReset() {
    this.taskForm.reset();
    this.taskForm.markAsUntouched();
  }

  /**
   * Get error message for title field
   */
  getTitleErrorMessage(): string {
    const titleControl = this.taskForm.get('title');
    
    if (titleControl?.hasError('required')) {
      return 'Title is required';
    }
    if (titleControl?.hasError('minlength')) {
      return 'Title cannot be empty';
    }
    if (titleControl?.hasError('maxlength')) {
      return 'Title cannot exceed 255 characters';
    }
    
    return '';
  }

  /**
   * Get error message for description field
   */
  getDescriptionErrorMessage(): string {
    const descControl = this.taskForm.get('description');
    
    if (descControl?.hasError('maxlength')) {
      return 'Description cannot exceed 1000 characters';
    }
    
    return '';
  }

  /**
   * Check if the form has any errors
   */
  hasFormErrors(): boolean {
    return this.taskForm.invalid && this.taskForm.touched;
  }

  /**
   * Get character count for description field
   */
  getDescriptionCharCount(): number {
    return this.taskForm.get('description')?.value?.length || 0;
  }
}
