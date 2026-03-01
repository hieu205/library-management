package com.example.demo.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Inventory;

public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    Optional<Inventory> findByBook_Id(Long bookId);

    List<Inventory> findByBook_IdIn(Collection<Long> bookIds);

    boolean existsByBook_Id(Long bookId);
}
