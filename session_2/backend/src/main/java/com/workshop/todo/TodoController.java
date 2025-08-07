package com.workshop.todo;

import com.workshop.todo.dto.CreateTodoRequest;
import com.workshop.todo.dto.TodoDto;
import com.workshop.todo.dto.UpdateTodoRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/todos")
@Validated
public class TodoController {
    private static final Logger log = LoggerFactory.getLogger(TodoController.class);
    
    private final TodoService todoService;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @GetMapping
    public ResponseEntity<Page<TodoDto>> getAllTodos(
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        log.debug("GET /api/v1/todos - completed: {}, search: {}, page: {}, size: {}", 
                completed, search, page, size);
        
        Pageable pageable = PageRequest.of(page, size);
        Page<TodoDto> todos = todoService.findAllTodos(completed, search, pageable);
        
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/by-status")
    public ResponseEntity<List<TodoDto>> getTodosByStatus(
            @RequestParam Boolean completed) {
        
        log.debug("GET /api/v1/todos/by-status - completed: {}", completed);
        
        List<TodoDto> todos = todoService.findTodosByCompleted(completed);
        return ResponseEntity.ok(todos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TodoDto> getTodoById(@PathVariable @Positive Long id) {
        log.debug("GET /api/v1/todos/{}", id);
        
        return todoService.findById(id)
                .map(todo -> ResponseEntity.ok(todo))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TodoDto> createTodo(@Valid @RequestBody CreateTodoRequest request) {
        log.debug("POST /api/v1/todos - title: {}", request.getTitle());
        
        TodoDto createdTodo = todoService.createTodo(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTodo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TodoDto> updateTodo(
            @PathVariable @Positive Long id,
            @Valid @RequestBody UpdateTodoRequest request) {
        
        log.debug("PUT /api/v1/todos/{}", id);
        
        TodoDto updatedTodo = todoService.updateTodo(id, request);
        return ResponseEntity.ok(updatedTodo);
    }

    @PatchMapping("/{id}/toggle")
    public ResponseEntity<TodoDto> toggleTodoCompleted(@PathVariable @Positive Long id) {
        log.debug("PATCH /api/v1/todos/{}/toggle", id);
        
        TodoDto updatedTodo = todoService.toggleCompleted(id);
        return ResponseEntity.ok(updatedTodo);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTodo(@PathVariable @Positive Long id) {
        log.debug("DELETE /api/v1/todos/{}", id);
        
        todoService.deleteTodo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/count")
    public ResponseEntity<Long> countTodos(@RequestParam Boolean completed) {
        log.debug("GET /api/v1/todos/count - completed: {}", completed);
        
        long count = todoService.countByCompleted(completed);
        return ResponseEntity.ok(count);
    }
}
