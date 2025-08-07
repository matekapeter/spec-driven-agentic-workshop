package com.workshop.todo;

import com.workshop.todo.dto.CreateTodoRequest;
import com.workshop.todo.dto.TodoDto;
import com.workshop.todo.dto.UpdateTodoRequest;
import com.workshop.todo.exception.TodoNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class TodoService {
    private static final Logger log = LoggerFactory.getLogger(TodoService.class);
    
    private final TodoRepository todoRepository;
    private final TodoMapper todoMapper;

    public TodoService(TodoRepository todoRepository, TodoMapper todoMapper) {
        this.todoRepository = todoRepository;
        this.todoMapper = todoMapper;
    }

    public Page<TodoDto> findAllTodos(Boolean completed, String search, Pageable pageable) {
        log.debug("Finding todos with filters - completed: {}, search: {}, page: {}", 
                completed, search, pageable.getPageNumber());
        
        // For now, ignore search parameter to get basic functionality working
        // TODO: Re-implement search functionality later
        return todoRepository.findTodosWithFilters(completed, pageable)
                .map(todoMapper::toDto);
    }

    public List<TodoDto> findTodosByCompleted(Boolean completed) {
        log.debug("Finding todos by completed status: {}", completed);
        
        return todoRepository.findByCompletedOrderByCreatedAtDesc(completed)
                .stream()
                .map(todoMapper::toDto)
                .toList();
    }

    public Optional<TodoDto> findById(Long id) {
        log.debug("Finding todo by ID: {}", id);
        
        return todoRepository.findById(id)
                .map(todoMapper::toDto);
    }

    @Transactional
    public TodoDto createTodo(CreateTodoRequest request) {
        log.info("Creating new todo with title: {}", request.getTitle());
        
        Todo todo = todoMapper.toEntity(request);
        Todo savedTodo = todoRepository.save(todo);
        
        log.info("Todo created successfully with ID: {}", savedTodo.getId());
        return todoMapper.toDto(savedTodo);
    }

    @Transactional
    public TodoDto updateTodo(Long id, UpdateTodoRequest request) {
        log.info("Updating todo with ID: {}", id);
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        
        todoMapper.updateEntityFromRequest(todo, request);
        Todo savedTodo = todoRepository.save(todo);
        
        log.info("Todo updated successfully with ID: {}", savedTodo.getId());
        return todoMapper.toDto(savedTodo);
    }

    @Transactional
    public void deleteTodo(Long id) {
        log.info("Deleting todo with ID: {}", id);
        
        if (!todoRepository.existsById(id)) {
            throw new TodoNotFoundException(id);
        }
        
        todoRepository.deleteById(id);
        log.info("Todo deleted successfully with ID: {}", id);
    }

    @Transactional
    public TodoDto toggleCompleted(Long id) {
        log.info("Toggling completion status for todo with ID: {}", id);
        
        Todo todo = todoRepository.findById(id)
                .orElseThrow(() -> new TodoNotFoundException(id));
        
        todo.setCompleted(!todo.getCompleted());
        Todo savedTodo = todoRepository.save(todo);
        
        log.info("Todo completion status toggled successfully with ID: {}", savedTodo.getId());
        return todoMapper.toDto(savedTodo);
    }

    public long countByCompleted(Boolean completed) {
        log.debug("Counting todos by completed status: {}", completed);
        return todoRepository.countByCompleted(completed);
    }
}
