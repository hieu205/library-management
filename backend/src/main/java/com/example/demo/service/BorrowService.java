package com.example.demo.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.request.BorrowRequest;
import com.example.demo.dto.request.ReturnRequest;
import com.example.demo.dto.response.BorrowItemResponse;
import com.example.demo.dto.response.BorrowRecordResponse;
import com.example.demo.dto.response.BorrowResponse;
import com.example.demo.entity.Book;
import com.example.demo.entity.BorrowItem;
import com.example.demo.entity.BorrowRecord;
import com.example.demo.entity.Inventory;
import com.example.demo.entity.InventoryLog;
import com.example.demo.entity.User;
import com.example.demo.repository.BookRepository;
import com.example.demo.repository.BorrowItemRepository;
import com.example.demo.repository.BorrowRecordRepository;
import com.example.demo.repository.InventoryLogRepository;
import com.example.demo.repository.InventoryRepository;
import com.example.demo.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BorrowService {

    private static final String STATUS_BORROWING = "BORROWING";
    private static final int DEFAULT_BORROW_DAYS = 14;

    private final BorrowRecordRepository borrowRecordRepository;
    private final BorrowItemRepository borrowItemRepository;
    private final BookRepository bookRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public BorrowResponse createBorrow(BorrowRequest request) {
        // Lấy user hiện tại từ SecurityContext
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        // Cần phải check lại user có tồn tại hay không vì
        // - user login lúc 10h
        // - admin xóa user này lúc 10h5p
        // - user vẫn gửi request (Security context chỉ lưu username đã đăng nhập trước
        // đó)
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));

        LocalDate borrowDate = LocalDate.now();
        LocalDate dueDate = request.getDueDate() != null
                ? request.getDueDate()
                : borrowDate.plusDays(DEFAULT_BORROW_DAYS);

        // Validate tất cả sách tồn tại và đủ tồn kho trước khi thay đổi bất kỳ dữ
        // liệu nào
        List<Book> books = new ArrayList<>();
        List<Inventory> inventories = new ArrayList<>();
        for (BorrowRequest.BorrowItemLine itemLine : request.getItems()) {
            Book book = bookRepository.findById(itemLine.getBookId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy sách với id: " + itemLine.getBookId()));

            Inventory inventory = inventoryRepository.findByBook_Id(itemLine.getBookId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy tồn kho cho sách id: " + itemLine.getBookId()));

            if (inventory.getAvailableQuantity() < itemLine.getQuantity()) {
                throw new RuntimeException(
                        "Sách \"" + book.getTitle() + "\" không đủ tồn kho (còn "
                                + inventory.getAvailableQuantity() + " cuốn, yêu cầu "
                                + itemLine.getQuantity() + ")");
            }

            books.add(book);
            inventories.add(inventory);
        }

        // Tạo borrow_record
        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setUser(user);
        borrowRecord.setBorrowDate(borrowDate);
        borrowRecord.setDueDate(dueDate);
        borrowRecord.setStatus(STATUS_BORROWING);
        borrowRecord.setCreatedAt(LocalDateTime.now());
        borrowRecord = borrowRecordRepository.save(borrowRecord);

        // Tạo borrow_items
        List<BorrowItem> savedItems = new ArrayList<>();
        for (int i = 0; i < request.getItems().size(); i++) {
            BorrowRequest.BorrowItemLine itemLine = request.getItems().get(i);
            BorrowItem borrowItem = new BorrowItem();
            borrowItem.setBorrowRecord(borrowRecord);
            borrowItem.setBook(books.get(i));
            borrowItem.setQuantity(itemLine.getQuantity());
            borrowItem.setReturnedQuantity(0);
            savedItems.add(borrowItemRepository.save(borrowItem));
        }

        List<BorrowItemResponse> itemResponses = new ArrayList<>();
        for (BorrowItem item : savedItems) {
            itemResponses.add(BorrowItemResponse.fromEntity(item));
        }

        // Trừ tồn kho và ghi log xuất kho cho từng sách đã mượn
        for (int i = 0; i < request.getItems().size(); i++) {
            BorrowRequest.BorrowItemLine itemLine = request.getItems().get(i);
            Inventory inventory = inventories.get(i);

            int newAvailable = inventory.getAvailableQuantity() - itemLine.getQuantity();
            if (newAvailable < 0) {
                throw new RuntimeException(
                        "Sách \"" + books.get(i).getTitle() + "\" không đủ tồn kho tại thời điểm ghi nhận mượn");
            }

            inventory.setAvailableQuantity(newAvailable);
            inventory.setUpdatedAt(LocalDateTime.now());
            inventoryRepository.save(inventory);

            inventoryLogRepository.save(InventoryLog.builder()
                    .book(books.get(i))
                    .changeType(InventoryLog.EXPORT)
                    .quantityChanged(-itemLine.getQuantity())
                    .totalAfter(inventory.getTotalQuantity())
                    .availableAfter(newAvailable)
                    .note("Mượn sách - phiếu mượn id: " + borrowRecord.getId())
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        return BorrowResponse.builder()
                .record(BorrowRecordResponse.fromEntity(borrowRecord))
                .items(itemResponses)
                .build();
    }

    @Transactional
    public BorrowResponse returnBorrow(Long id, ReturnRequest returnRequest) {
        // Tìm phiếu mượn
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu mượn với id: " + id));

        // Không cho trả nếu phiếu đã RETURNED
        if ("RETURNED".equals(borrowRecord.getStatus())) {
            throw new RuntimeException("Phiếu mượn id " + id + " đã được trả hết");
        }

        // Validate dữ liệu trước khi ghi vào DB
        for (ReturnRequest.ReturnItemLine x : returnRequest.getItems()) {
            BorrowItem borrowItem = borrowItemRepository
                    .findByBorrowRecord_IdAndBook_Id(id, x.getBookId())
                    .orElseThrow(() -> new RuntimeException(
                            "Sách id " + x.getBookId() + " không thuộc phiếu mượn id " + id));

            int canReturn = borrowItem.getQuantity() - borrowItem.getReturnedQuantity();
            if (x.getReturnQuantity() > canReturn) {
                throw new RuntimeException(
                        "Sách id " + x.getBookId() + " chỉ còn có thể trả tối đa " + canReturn + " cuốn");
            }
        }

        List<BorrowItem> updatedItems = new ArrayList<>();
        for (ReturnRequest.ReturnItemLine x : returnRequest.getItems()) {
            // Cập nhật returned_quantity
            BorrowItem borrowItem = borrowItemRepository
                    .findByBorrowRecord_IdAndBook_Id(id, x.getBookId())
                    .orElseThrow();
            borrowItem.setReturnedQuantity(borrowItem.getReturnedQuantity() + x.getReturnQuantity());
            borrowItemRepository.save(borrowItem);
            updatedItems.add(borrowItem);

            // Tăng available_quantity trong inventory
            Inventory inventory = inventoryRepository.findByBook_Id(x.getBookId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy tồn kho cho sách id: " + x.getBookId()));
            int newAvailable = inventory.getAvailableQuantity() + x.getReturnQuantity();
            inventory.setAvailableQuantity(newAvailable);
            inventory.setChangeType("RETURN");
            inventory.setUpdatedAt(LocalDateTime.now());
            inventoryRepository.save(inventory);

            // Ghi inventory_log loại RETURN
            inventoryLogRepository.save(InventoryLog.builder()
                    .book(borrowItem.getBook())
                    .changeType("RETURN")
                    .quantityChanged(x.getReturnQuantity())
                    .totalAfter(inventory.getTotalQuantity())
                    .availableAfter(newAvailable)
                    .note("Trả sách - phiếu mượn id: " + id)
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        // Kiểm tra nếu tất cả items đã trả đủ -> chuyển status thành RETURNED
        List<BorrowItem> allItems = borrowItemRepository.findByBorrowRecord_Id(id);
        boolean allReturned = allItems.stream()
                .allMatch(item -> item.getReturnedQuantity().equals(item.getQuantity()));
        if (allReturned) {
            borrowRecord.setStatus("RETURNED");
            borrowRecordRepository.save(borrowRecord);
        }

        List<BorrowItemResponse> itemResponses = new ArrayList<>();
        for (BorrowItem item : allItems) {
            itemResponses.add(BorrowItemResponse.fromEntity(item));
        }

        return BorrowResponse.builder()
                .record(BorrowRecordResponse.fromEntity(borrowRecord))
                .items(itemResponses)
                .build();
    }

    public List<BorrowResponse> getAllBorrow() {
        List<BorrowRecord> listBorrow = borrowRecordRepository.findAll();
        List<BorrowResponse> res = new ArrayList<>();
        for (BorrowRecord x : listBorrow) {
            BorrowRecordResponse ans = BorrowRecordResponse.fromEntity(x);
            List<BorrowItem> listBorrowItems = borrowItemRepository.findByBorrowRecord_Id(x.getId());
            List<BorrowItemResponse> listBorrowItemResponse = new ArrayList<>();
            for (BorrowItem it : listBorrowItems) {
                listBorrowItemResponse.add(BorrowItemResponse.fromEntity(it));
            }
            res.add(new BorrowResponse(ans, listBorrowItemResponse));
        }
        return res;
    }

    public Page<BorrowResponse> getBorrowHistoryByUserId(Long userId, Pageable pageable) {
        // Kiểm tra user tồn tại
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + userId));
        return borrowRecordRepository.findByUser_Id(userId, pageable).map(record -> {
            List<BorrowItem> items = borrowItemRepository.findByBorrowRecord_Id(record.getId());
            List<BorrowItemResponse> itemResponses = new ArrayList<>();
            for (BorrowItem it : items) {
                itemResponses.add(BorrowItemResponse.fromEntity(it));
            }
            return BorrowResponse.builder()
                    .record(BorrowRecordResponse.fromEntity(record))
                    .items(itemResponses)
                    .build();
        });
    }

    public Page<BorrowResponse> getBorrowHistory(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));
        return borrowRecordRepository.findByUser_Id(user.getId(), pageable).map(record -> {
            List<BorrowItem> items = borrowItemRepository.findByBorrowRecord_Id(record.getId());
            List<BorrowItemResponse> itemResponses = new ArrayList<>();
            for (BorrowItem it : items) {
                itemResponses.add(BorrowItemResponse.fromEntity(it));
            }
            return BorrowResponse.builder()
                    .record(BorrowRecordResponse.fromEntity(record))
                    .items(itemResponses)
                    .build();
        });
    }

    public Page<BorrowResponse> getCurrentBorrows(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));
        return borrowRecordRepository.findByUser_IdAndStatus(user.getId(), STATUS_BORROWING, pageable)
                .map(record -> {
                    List<BorrowItem> items = borrowItemRepository.findByBorrowRecord_Id(record.getId());
                    List<BorrowItemResponse> itemResponses = new ArrayList<>();
                    for (BorrowItem it : items) {
                        itemResponses.add(BorrowItemResponse.fromEntity(it));
                    }
                    return BorrowResponse.builder()
                            .record(BorrowRecordResponse.fromEntity(record))
                            .items(itemResponses)
                            .build();
                });
    }

    public BorrowResponse getBorrowById(Long id) {
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không thể lấy BorrowRecord với id " + id));
        BorrowResponse borrowResponse = new BorrowResponse();
        BorrowRecordResponse borrowRecordResponse = BorrowRecordResponse.fromEntity(borrowRecord);
        List<BorrowItemResponse> borrowItemResponses = new ArrayList<>();
        List<BorrowItem> borrowItems = borrowItemRepository.findByBorrowRecord_Id(id);
        for (BorrowItem x : borrowItems) {
            borrowItemResponses.add(BorrowItemResponse.fromEntity(x));
        }
        borrowResponse.setRecord(borrowRecordResponse);
        borrowResponse.setItems(borrowItemResponses);
        return borrowResponse;
    }
}
