package com.workshop.todo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
    
    List<Todo> findByCompletedOrderByCreatedAtDesc(Boolean completed);
    
    @Query("SELECT t FROM Todo t WHERE " +
           "(:completed IS NULL OR t.completed = :completed) " +
           "ORDER BY t.createdAt DESC")
    Page<Todo> findTodosWithFilters(
            @Param("completed") Boolean completed,
            Pageable pageable
    );
    
    long countByCompleted(Boolean completed);
}
