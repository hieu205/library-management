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

import com.example.demo.dto.request.AdminBorrowRequest;
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

    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_BORROWING = "BORROWING";
    private static final String STATUS_REJECTED = "REJECTED";
    private static final String STATUS_RETURNED = "RETURNED";
    private static final int DEFAULT_BORROW_DAYS = 14;

    private final BorrowRecordRepository borrowRecordRepository;
    private final BorrowItemRepository borrowItemRepository;
    private final BookRepository bookRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryLogRepository inventoryLogRepository;
    private final UserRepository userRepository;

    @Transactional
    public BorrowResponse createBorrowRequest(BorrowRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        System.out.println("[BACKEND] Bắt đầu tạo yêu cầu mượn online - username=" + username + ", soDauSach="
                + (request.getItems() != null ? request.getItems().size() : 0));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));

        if (!user.isActive()) {
            System.err.println("[BACKEND] Không thể tạo yêu cầu mượn vì tài khoản bị khóa - username=" + username);
            throw new RuntimeException("Tài khoản đã bị khóa, không thể tạo đơn mượn");
        }

        LocalDate borrowDate = LocalDate.now();
        LocalDate dueDate = request.getDueDate() != null
                ? request.getDueDate()
                : borrowDate.plusDays(DEFAULT_BORROW_DAYS);

        List<Book> books = new ArrayList<>();
        for (BorrowRequest.BorrowItemLine itemLine : request.getItems()) {
            Book book = bookRepository.findById(itemLine.getBookId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy sách với id: " + itemLine.getBookId()));
            books.add(book);
        }

        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setUser(user);
        borrowRecord.setBorrowDate(borrowDate);
        borrowRecord.setDueDate(dueDate);
        borrowRecord.setStatus(STATUS_PENDING);
        borrowRecord.setCreatedAt(LocalDateTime.now());
        borrowRecord = borrowRecordRepository.save(borrowRecord);
        System.out.println("[BACKEND] Tạo yêu cầu mượn online thành công - borrowId=" + borrowRecord.getId()
                + ", trangThai=" + borrowRecord.getStatus());

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

        return BorrowResponse.builder()
                .record(BorrowRecordResponse.fromEntity(borrowRecord))
                .items(itemResponses)
                .build();
    }

    @Transactional
    public BorrowResponse createBorrowByAdmin(AdminBorrowRequest request) {
        System.out.println("[BACKEND] Bắt đầu tạo phiếu mượn trực tiếp bởi admin - userId=" + request.getUserId()
                + ", soDauSach=" + (request.getItems() != null ? request.getItems().size() : 0));
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với id: " + request.getUserId()));

        if (!user.isActive()) {
            System.err.println(
                    "[BACKEND] Không thể tạo phiếu mượn trực tiếp vì user bị khóa - userId=" + request.getUserId());
            throw new RuntimeException("Tài khoản người dùng đã bị khóa, không thể tạo phiếu mượn");
        }

        LocalDate borrowDate = LocalDate.now();
        LocalDate dueDate = request.getDueDate() != null
                ? request.getDueDate()
                : borrowDate.plusDays(DEFAULT_BORROW_DAYS);

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
                System.err.println("[BACKEND] Tồn kho không đủ khi tạo phiếu trực tiếp - bookId="
                        + itemLine.getBookId() + ", con=" + inventory.getAvailableQuantity() + ", yeuCau="
                        + itemLine.getQuantity());
                throw new RuntimeException(
                        "Sách \"" + book.getTitle() + "\" không đủ tồn kho (còn "
                                + inventory.getAvailableQuantity() + " cuốn, yêu cầu "
                                + itemLine.getQuantity() + ")");
            }

            books.add(book);
            inventories.add(inventory);
        }

        BorrowRecord borrowRecord = new BorrowRecord();
        borrowRecord.setUser(user);
        borrowRecord.setBorrowDate(borrowDate);
        borrowRecord.setDueDate(dueDate);
        borrowRecord.setStatus(STATUS_BORROWING);
        borrowRecord.setAdminNote(request.getAdminNote());
        borrowRecord.setCreatedAt(LocalDateTime.now());
        borrowRecord = borrowRecordRepository.save(borrowRecord);
        System.out.println("[BACKEND] Tạo phiếu mượn trực tiếp thành công - borrowId=" + borrowRecord.getId()
                + ", trangThai=" + borrowRecord.getStatus());

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

        for (int i = 0; i < request.getItems().size(); i++) {
            BorrowRequest.BorrowItemLine itemLine = request.getItems().get(i);
            Inventory inventory = inventories.get(i);

            int newAvailable = inventory.getAvailableQuantity() - itemLine.getQuantity();
            inventory.setAvailableQuantity(newAvailable);
            inventory.setChangeType(Inventory.EXPORT);
            inventory.setUpdatedAt(LocalDateTime.now());
            inventoryRepository.save(inventory);

            inventoryLogRepository.save(InventoryLog.builder()
                    .book(books.get(i))
                    .changeType(InventoryLog.EXPORT)
                    .quantityChanged(-itemLine.getQuantity())
                    .totalAfter(inventory.getTotalQuantity())
                    .availableAfter(newAvailable)
                    .note("Admin tạo phiếu mượn trực tiếp id: " + borrowRecord.getId())
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        List<BorrowItemResponse> itemResponses = savedItems.stream()
                .map(BorrowItemResponse::fromEntity)
                .toList();

        return BorrowResponse.builder()
                .record(BorrowRecordResponse.fromEntity(borrowRecord))
                .items(itemResponses)
                .build();
    }

    @Transactional
    public BorrowResponse approveBorrow(Long id, String adminNote) {
        System.out.println("[BACKEND] Bắt đầu duyệt phiếu mượn - borrowId=" + id);
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu mượn với id: " + id));

        if (!STATUS_PENDING.equals(borrowRecord.getStatus())) {
            System.err.println("[BACKEND] Không thể duyệt phiếu do sai trạng thái - borrowId=" + id + ", trangThai="
                    + borrowRecord.getStatus());
            throw new RuntimeException("Chỉ có thể duyệt phiếu ở trạng thái PENDING");
        }

        if (!borrowRecord.getUser().isActive()) {
            System.err.println("[BACKEND] Không thể duyệt phiếu vì user bị khóa - borrowId=" + id + ", userId="
                    + borrowRecord.getUser().getId());
            throw new RuntimeException("Người dùng đã bị khóa, không thể duyệt phiếu mượn");
        }

        List<BorrowItem> items = borrowItemRepository.findByBorrowRecord_Id(id);
        List<Inventory> inventories = new ArrayList<>();

        for (BorrowItem item : items) {
            Inventory inventory = inventoryRepository.findByBook_Id(item.getBook().getId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy tồn kho cho sách id: " + item.getBook().getId()));

            if (inventory.getAvailableQuantity() < item.getQuantity()) {
                System.err.println("[BACKEND] Tồn kho không đủ khi duyệt phiếu - borrowId=" + id + ", bookId="
                        + item.getBook().getId() + ", con=" + inventory.getAvailableQuantity() + ", yeuCau="
                        + item.getQuantity());
                throw new RuntimeException(
                        "Sách \"" + item.getBook().getTitle() + "\" không đủ tồn kho để duyệt (còn "
                                + inventory.getAvailableQuantity() + " cuốn, yêu cầu "
                                + item.getQuantity() + ")");
            }

            inventories.add(inventory);
        }

        for (int i = 0; i < items.size(); i++) {
            BorrowItem item = items.get(i);
            Inventory inventory = inventories.get(i);
            int newAvailable = inventory.getAvailableQuantity() - item.getQuantity();

            inventory.setAvailableQuantity(newAvailable);
            inventory.setChangeType(Inventory.EXPORT);
            inventory.setUpdatedAt(LocalDateTime.now());
            inventoryRepository.save(inventory);

            inventoryLogRepository.save(InventoryLog.builder()
                    .book(item.getBook())
                    .changeType(InventoryLog.EXPORT)
                    .quantityChanged(-item.getQuantity())
                    .totalAfter(inventory.getTotalQuantity())
                    .availableAfter(newAvailable)
                    .note("Admin duyệt phiếu mượn id: " + borrowRecord.getId())
                    .createdAt(LocalDateTime.now())
                    .build());
        }

        borrowRecord.setStatus(STATUS_BORROWING);
        borrowRecord.setAdminNote(adminNote);
        borrowRecordRepository.save(borrowRecord);
        System.out.println("[BACKEND] Duyệt phiếu mượn thành công - borrowId=" + id + ", trangThai="
                + borrowRecord.getStatus());

        List<BorrowItemResponse> itemResponses = items.stream().map(BorrowItemResponse::fromEntity).toList();

        return BorrowResponse.builder()
                .record(BorrowRecordResponse.fromEntity(borrowRecord))
                .items(itemResponses)
                .build();
    }

    @Transactional
    public BorrowResponse rejectBorrow(Long id, String adminNote) {
        System.out.println("[BACKEND] Bắt đầu từ chối phiếu mượn - borrowId=" + id);
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu mượn với id: " + id));

        if (!STATUS_PENDING.equals(borrowRecord.getStatus())) {
            System.err.println("[BACKEND] Không thể từ chối phiếu do sai trạng thái - borrowId=" + id
                    + ", trangThai=" + borrowRecord.getStatus());
            throw new RuntimeException("Chỉ có thể từ chối phiếu ở trạng thái PENDING");
        }

        borrowRecord.setStatus(STATUS_REJECTED);
        borrowRecord.setAdminNote(adminNote);
        borrowRecordRepository.save(borrowRecord);
        System.out.println("[BACKEND] Từ chối phiếu mượn thành công - borrowId=" + id + ", trangThai="
                + borrowRecord.getStatus());

        List<BorrowItemResponse> itemResponses = borrowItemRepository.findByBorrowRecord_Id(id)
                .stream()
                .map(BorrowItemResponse::fromEntity)
                .toList();

        return BorrowResponse.builder()
                .record(BorrowRecordResponse.fromEntity(borrowRecord))
                .items(itemResponses)
                .build();
    }

    @Transactional
    public BorrowResponse returnBorrow(Long id, ReturnRequest returnRequest) {
        System.out.println("[BACKEND] Bắt đầu xử lý trả sách - borrowId=" + id + ", soDongTra="
                + (returnRequest.getItems() != null ? returnRequest.getItems().size() : 0));
        BorrowRecord borrowRecord = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu mượn với id: " + id));

        if (STATUS_RETURNED.equals(borrowRecord.getStatus())) {
            System.err.println("[BACKEND] Phiếu mượn đã trả hết trước đó - borrowId=" + id);
            throw new RuntimeException("Phiếu mượn id " + id + " đã được trả hết");
        }

        if (!STATUS_BORROWING.equals(borrowRecord.getStatus())) {
            System.err.println("[BACKEND] Không thể trả sách do trạng thái phiếu không hợp lệ - borrowId=" + id
                    + ", trangThai=" + borrowRecord.getStatus());
            throw new RuntimeException("Phiếu mượn chưa được duyệt hoặc đã bị từ chối");
        }

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
            BorrowItem borrowItem = borrowItemRepository
                    .findByBorrowRecord_IdAndBook_Id(id, x.getBookId())
                    .orElseThrow();
            borrowItem.setReturnedQuantity(borrowItem.getReturnedQuantity() + x.getReturnQuantity());
            borrowItemRepository.save(borrowItem);
            updatedItems.add(borrowItem);

            Inventory inventory = inventoryRepository.findByBook_Id(x.getBookId())
                    .orElseThrow(() -> new RuntimeException(
                            "Không tìm thấy tồn kho cho sách id: " + x.getBookId()));
            int newAvailable = inventory.getAvailableQuantity() + x.getReturnQuantity();
            inventory.setAvailableQuantity(newAvailable);
            inventory.setChangeType("RETURN");
            inventory.setUpdatedAt(LocalDateTime.now());
            inventoryRepository.save(inventory);

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

        List<BorrowItem> allItems = borrowItemRepository.findByBorrowRecord_Id(id);
        boolean allReturned = allItems.stream()
                .allMatch(item -> item.getReturnedQuantity().equals(item.getQuantity()));
        if (allReturned) {
            borrowRecord.setStatus(STATUS_RETURNED);
            borrowRecordRepository.save(borrowRecord);
            System.out.println("[BACKEND] Hoàn tất trả sách, phiếu chuyển RETURNED - borrowId=" + id);
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

    public List<BorrowResponse> getPendingBorrowRequests() {
        List<BorrowResponse> responses = borrowRecordRepository.findByStatusOrderByCreatedAtAsc(STATUS_PENDING)
                .stream()
                .map(record -> {
                    List<BorrowItemResponse> itemResponses = borrowItemRepository.findByBorrowRecord_Id(record.getId())
                            .stream()
                            .map(BorrowItemResponse::fromEntity)
                            .toList();
                    return BorrowResponse.builder()
                            .record(BorrowRecordResponse.fromEntity(record))
                            .items(itemResponses)
                            .build();
                })
                .toList();
        System.out.println("[BACKEND] Lấy danh sách phiếu chờ duyệt - tong=" + responses.size());
        return responses;
    }

    public List<BorrowResponse> getMyBorrowRequests(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng: " + username));

        List<BorrowResponse> responses = borrowRecordRepository.findByUser_IdOrderByCreatedAtDesc(user.getId())
                .stream()
                .map(record -> {
                    List<BorrowItemResponse> itemResponses = borrowItemRepository.findByBorrowRecord_Id(record.getId())
                            .stream()
                            .map(BorrowItemResponse::fromEntity)
                            .toList();
                    return BorrowResponse.builder()
                            .record(BorrowRecordResponse.fromEntity(record))
                            .items(itemResponses)
                            .build();
                })
                .toList();
        System.out.println("[BACKEND] Lấy danh sách phiếu mượn của người dùng - username=" + username + ", tong="
                + responses.size());
        return responses;
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
