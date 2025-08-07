package com.workshop.todo;

import com.workshop.todo.dto.CreateTodoRequest;
import com.workshop.todo.dto.TodoDto;
import com.workshop.todo.exception.TodoNotFoundException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TodoServiceTest {

    @Mock
    private TodoRepository todoRepository;

    @Mock
    private TodoMapper todoMapper;

    @InjectMocks
    private TodoService todoService;

    @Test
    void createTodo_ValidRequest_ReturnsTodoDto() {
        // Given
        CreateTodoRequest request = new CreateTodoRequest("Test Todo", "Test Description");
        Todo todo = new Todo("Test Todo", "Test Description");
        Todo savedTodo = new Todo("Test Todo", "Test Description");
        savedTodo.setId(1L);
        
        TodoDto expectedDto = new TodoDto(1L, "Test Todo", "Test Description", false, 
                Instant.now(), Instant.now());

        when(todoMapper.toEntity(request)).thenReturn(todo);
        when(todoRepository.save(todo)).thenReturn(savedTodo);
        when(todoMapper.toDto(savedTodo)).thenReturn(expectedDto);

        // When
        TodoDto result = todoService.createTodo(request);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getTitle()).isEqualTo("Test Todo");
        assertThat(result.getCompleted()).isFalse();
    }

    @Test
    void findById_NonExistentId_ReturnsEmpty() {
        // Given
        Long id = 999L;
        when(todoRepository.findById(id)).thenReturn(Optional.empty());

        // When
        Optional<TodoDto> result = todoService.findById(id);

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void deleteTodo_NonExistentId_ThrowsException() {
        // Given
        Long id = 999L;
        when(todoRepository.existsById(id)).thenReturn(false);

        // When & Then
        assertThatThrownBy(() -> todoService.deleteTodo(id))
                .isInstanceOf(TodoNotFoundException.class)
                .hasMessage("Todo not found with ID: 999");
    }
}
