/**
 * Task interfaces matching the Spring Boot backend DTOs
 */

/**
 * Main Task interface matching TodoDto from backend
 */
export interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: string;  // ISO 8601 string from backend
  updatedAt: string;  // ISO 8601 string from backend
}

/**
 * Request interface for creating new tasks
 * Matches CreateTodoRequest from backend
 */
export interface CreateTaskRequest {
  title: string;        // Required, 1-255 characters
  description?: string; // Optional, max 1000 characters
}

/**
 * Request interface for updating existing tasks
 * Matches UpdateTodoRequest from backend
 */
export interface UpdateTaskRequest {
  title?: string;       // Optional, 1-255 characters if provided
  description?: string; // Optional, max 1000 characters if provided
  completed?: boolean;  // Optional completion status
}

/**
 * API response wrapper for paginated results
 * Matches Spring Boot Page<TodoDto> structure
 */
export interface TaskPageResponse {
  content: Task[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
