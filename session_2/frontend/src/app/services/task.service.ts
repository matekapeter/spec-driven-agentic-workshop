import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskPageResponse } from '../interfaces/task.interface';

/**
 * Service for managing tasks via REST API
 * Connects to Spring Boot backend at /api/v1/todos
 */
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly apiUrl = '/api/v1/todos';

  constructor(private http: HttpClient) {}

  /**
   * Get all tasks with optional filtering and pagination
   * @param completed - Filter by completion status (optional)
   * @param search - Search in title/description (optional)  
   * @param page - Page number (default: 0)
   * @param size - Page size (default: 20)
   */
  getAllTasks(
    completed?: boolean, 
    search?: string, 
    page: number = 0, 
    size: number = 20
  ): Observable<TaskPageResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (completed !== undefined) {
      params = params.set('completed', completed.toString());
    }

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<TaskPageResponse>(this.apiUrl, { params });
  }

  /**
   * Get all tasks without pagination (simplified for our UI)
   * Returns all tasks ordered by creation date (newest first)
   */
  getAllTasksSimple(): Observable<TaskPageResponse> {
    return this.getAllTasks(undefined, undefined, 0, 1000);
  }

  /**
   * Get tasks filtered by completion status
   * @param completed - true for completed tasks, false for incomplete
   */
  getTasksByStatus(completed: boolean): Observable<Task[]> {
    const params = new HttpParams().set('completed', completed.toString());
    return this.http.get<Task[]>(`${this.apiUrl}/by-status`, { params });
  }

  /**
   * Get a specific task by ID
   * @param id - Task ID
   */
  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create a new task
   * @param task - Task creation request
   */
  createTask(task: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, task);
  }

  /**
   * Update an existing task
   * @param id - Task ID
   * @param task - Task update request
   */
  updateTask(id: number, task: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  /**
   * Toggle task completion status
   * @param id - Task ID
   */
  toggleTaskCompletion(id: number): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/toggle`, {});
  }

  /**
   * Delete a task
   * @param id - Task ID
   */
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get count of tasks by completion status
   * @param completed - true for completed count, false for incomplete count
   */
  getTaskCount(completed: boolean): Observable<number> {
    const params = new HttpParams().set('completed', completed.toString());
    return this.http.get<number>(`${this.apiUrl}/count`, { params });
  }
}
