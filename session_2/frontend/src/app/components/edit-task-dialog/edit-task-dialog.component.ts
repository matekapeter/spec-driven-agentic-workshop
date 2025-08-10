import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MaterialModule } from '../../shared/material.module';
import { TaskService } from '../../services/task.service';
import { Task, UpdateTaskRequest } from '../../interfaces/task.interface';

export interface EditTaskDialogData {
  task: Task;
}

@Component({
  selector: 'app-edit-task-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MaterialModule],
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.scss']
})
export class EditTaskDialogComponent {
  taskForm: FormGroup;
  loading = signal(false);
  originalTask: Task;

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<EditTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditTaskDialogData
  ) {
    this.originalTask = data.task;
    
    // Initialize form with current task data
    this.taskForm = this.fb.group({
      title: [this.originalTask.title, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(255)
      ]],
      description: [this.originalTask.description || '', [
        Validators.maxLength(1000)
      ]]
    });
  }

  /**
   * Save the updated task
   */
  onSave() {
    if (this.taskForm.valid && !this.loading()) {
      this.loading.set(true);
      
      const updateRequest: UpdateTaskRequest = {
        title: this.taskForm.value.title.trim(),
        description: this.taskForm.value.description?.trim() || undefined
      };

      this.taskService.updateTask(this.originalTask.id, updateRequest).subscribe({
        next: (updatedTask) => {
          this.loading.set(false);
          this.dialogRef.close(updatedTask);
        },
        error: (error) => {
          this.loading.set(false);
          console.error('Failed to update task:', error);
          
          const errorMessage = error.error?.message || 'Failed to update task';
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.taskForm.markAllAsTouched();
    }
  }

  /**
   * Cancel editing and close dialog
   */
  onCancel() {
    this.dialogRef.close();
  }

  /**
   * Reset form to original values
   */
  onReset() {
    this.taskForm.reset({
      title: this.originalTask.title,
      description: this.originalTask.description || ''
    });
    this.taskForm.markAsUntouched();
  }

  /**
   * Check if form has been modified
   */
  isFormModified(): boolean {
    const currentTitle = this.taskForm.get('title')?.value?.trim() || '';
    const currentDescription = this.taskForm.get('description')?.value?.trim() || '';
    const originalDescription = this.originalTask.description || '';
    
    return currentTitle !== this.originalTask.title || 
           currentDescription !== originalDescription;
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
   * Get character count for description field
   */
  getDescriptionCharCount(): number {
    return this.taskForm.get('description')?.value?.length || 0;
  }

  /**
   * Format creation date for display
   */
  getFormattedCreatedDate(): string {
    return new Date(this.originalTask.createdAt).toLocaleString();
  }
}
