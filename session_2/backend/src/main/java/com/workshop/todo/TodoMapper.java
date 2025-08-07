package com.workshop.todo;

import com.workshop.todo.dto.CreateTodoRequest;
import com.workshop.todo.dto.TodoDto;
import com.workshop.todo.dto.UpdateTodoRequest;
import org.springframework.stereotype.Component;

@Component
public class TodoMapper {

    public TodoDto toDto(Todo todo) {
        if (todo == null) {
            return null;
        }
        
        return new TodoDto(
                todo.getId(),
                todo.getTitle(),
                todo.getDescription(),
                todo.getCompleted(),
                todo.getCreatedAt(),
                todo.getUpdatedAt()
        );
    }

    public Todo toEntity(CreateTodoRequest request) {
        if (request == null) {
            return null;
        }
        
        return new Todo(request.getTitle(), request.getDescription());
    }

    public void updateEntityFromRequest(Todo todo, UpdateTodoRequest request) {
        if (todo == null || request == null) {
            return;
        }
        
        if (request.getTitle() != null) {
            todo.setTitle(request.getTitle());
        }
        
        if (request.getDescription() != null) {
            todo.setDescription(request.getDescription());
        }
        
        if (request.getCompleted() != null) {
            todo.setCompleted(request.getCompleted());
        }
    }
}
