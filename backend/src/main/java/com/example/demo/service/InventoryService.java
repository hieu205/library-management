package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.InventoryRequest;
import com.example.demo.dto.response.InventoryLogResponse;
import com.example.demo.dto.response.InventoryResponse;
import com.example.demo.entity.Book;
import com.example.demo.entity.Inventory;
import com.example.demo.entity.InventoryLog;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.InventoryLogRepository;
import com.example.demo.repository.InventoryRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final BookRepository bookRepository;

    @Transactional
    public void createInventoryForBook(Book book) {
        Inventory inventory = Inventory.builder()
                .book(book)
                .totalQuantity(0)
                .availableQuantity(0)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        inventoryRepository.save(inventory);
    }

    // Nếu chưa có inventory → tạo mới. Nếu đã có → cộng thêm số lượng
    @Transactional
    public InventoryResponse addInventory(InventoryRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy sách với id: " + request.getBookId()));

        Optional<Inventory> opt = inventoryRepository.findByBook_Id(request.getBookId());
        Inventory inventory;

        if (opt.isEmpty()) {
            inventory = Inventory.builder()
                    .book(book)
                    .totalQuantity(request.getQuantity())
                    .availableQuantity(request.getQuantity())
                    .changeType(Inventory.IMPORT)
                    .createdAt(LocalDateTime.now())
                    .updatedAt(LocalDateTime.now())
                    .build();
        } else {
            inventory = opt.get();
            inventory.setTotalQuantity(inventory.getTotalQuantity() + request.getQuantity());
            inventory.setAvailableQuantity(inventory.getAvailableQuantity() + request.getQuantity());
            inventory.setChangeType(Inventory.IMPORT);
            inventory.setUpdatedAt(LocalDateTime.now());
        }
        inventoryRepository.save(inventory);

        inventoryLogRepository.save(InventoryLog.builder()
                .book(book)
                .changeType(InventoryLog.IMPORT)
                .quantityChanged(request.getQuantity())
                .totalAfter(inventory.getTotalQuantity())
                .availableAfter(inventory.getAvailableQuantity())
                .note(request.getNote())
                .createdAt(LocalDateTime.now())
                .build());

        return InventoryResponse.fromEntity(inventory);
    }

    // Xuất kho: giảm available (khi người dùng mượn sách)
    @Transactional
    public InventoryResponse decreaseInventory(InventoryRequest request) {
        Inventory inventory = inventoryRepository.findByBook_Id(request.getBookId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy tồn kho cho sách id: " + request.getBookId()));

        if (inventory.getAvailableQuantity() < request.getQuantity()) {
            throw new RuntimeException(
                    "Số lượng sách trong kho không đủ (còn "
                            + inventory.getAvailableQuantity() + " cuốn)");
        }

        int newAvailable = inventory.getAvailableQuantity() - request.getQuantity();
        inventory.setAvailableQuantity(newAvailable);
        inventory.setChangeType(Inventory.EXPORT);
        inventory.setUpdatedAt(LocalDateTime.now());
        inventoryRepository.save(inventory);

        inventoryLogRepository.save(InventoryLog.builder()
                .book(inventory.getBook())
                .changeType(InventoryLog.EXPORT)
                .quantityChanged(-request.getQuantity())
                .totalAfter(inventory.getTotalQuantity())
                .availableAfter(newAvailable)
                .note(request.getNote())
                .createdAt(LocalDateTime.now())
                .build());

        return InventoryResponse.fromEntity(inventory);
    }

    // Nhập kho: tăng available (khi người dùng trả sách)
    @Transactional
    public InventoryResponse increaseInventory(InventoryRequest request) {
        Inventory inventory = inventoryRepository.findByBook_Id(request.getBookId())
                .orElseThrow(() -> new RuntimeException(
                        "Không tìm thấy tồn kho cho sách id: " + request.getBookId()));

        int newAvailable = inventory.getAvailableQuantity() + request.getQuantity();
        inventory.setAvailableQuantity(newAvailable);
        inventory.setChangeType(Inventory.IMPORT);
        inventory.setUpdatedAt(LocalDateTime.now());
        inventoryRepository.save(inventory);

        inventoryLogRepository.save(InventoryLog.builder()
                .book(inventory.getBook())
                .changeType(InventoryLog.IMPORT)
                .quantityChanged(request.getQuantity())
                .totalAfter(inventory.getTotalQuantity())
                .availableAfter(newAvailable)
                .note(request.getNote())
                .createdAt(LocalDateTime.now())
                .build());

        return InventoryResponse.fromEntity(inventory);
    }

    public List<InventoryResponse> getAllInventory() {
        List<Inventory> listInventory = inventoryRepository.findAll();

        List<InventoryResponse> listInventoryResponses = new ArrayList<>();
        for (Inventory x : listInventory) {
            listInventoryResponses.add(InventoryResponse.fromEntity(x));
        }

        return listInventoryResponses;
    }

    public InventoryResponse getInventoryByBookId(Long id) {
        Inventory inventory = inventoryRepository.findByBook_Id(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tồn kho cho sách có bookId: " + id));
        return InventoryResponse.fromEntity(inventory);

    }

    public List<InventoryLogResponse> getAllInventoryLog() {
        List<InventoryLog> inventoryLog = inventoryLogRepository.findAllByOrderByCreatedAtDesc();
        List<InventoryLogResponse> listInventoryLogResponses = new ArrayList<>();
        for (InventoryLog x : inventoryLog) {
            listInventoryLogResponses.add(InventoryLogResponse.fromEntity(x));
        }

        return listInventoryLogResponses;
    }

    public List<InventoryLogResponse> getAllInventoryLogByBookId(Long id) {
        if (!bookRepository.existsById(id)) {
            throw new RuntimeException("Không tìm thấy sách với id: " + id);
        }
        List<InventoryLog> inventoryLog = inventoryLogRepository.findByBook_IdOrderByCreatedAtDesc(id);
        List<InventoryLogResponse> listInventoryLogResponses = new ArrayList<>();
        for (InventoryLog x : inventoryLog) {
            listInventoryLogResponses.add(InventoryLogResponse.fromEntity(x));
        }

        return listInventoryLogResponses;
    }
}
