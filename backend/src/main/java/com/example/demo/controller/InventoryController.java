package com.example.demo.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.request.InventoryRequest;
import com.example.demo.dto.response.ApiResponse;
import com.example.demo.dto.response.InventoryLogResponse;
import com.example.demo.dto.response.InventoryResponse;
import com.example.demo.entity.InventoryLog;
import com.example.demo.repository.InventoryLogRepository;
import com.example.demo.service.InventoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/inventory")
public class InventoryController {

        private final InventoryService inventoryService;

        // Tạo mới hoặc nhập thêm sách vào kho
        @PostMapping("/add")
        public ResponseEntity<ApiResponse<InventoryResponse>> addInventory(
                        @Valid @RequestBody InventoryRequest request) {
                System.out.println("[BACKEND] API nhập kho - bookId=" + request.getBookId() + ", quantity="
                                + request.getQuantity());
                InventoryResponse data = inventoryService.addInventory(request);
                return ResponseEntity.ok(ApiResponse.<InventoryResponse>builder()
                                .success(true)
                                .message("Nhập kho thành công")
                                .data(data)
                                .build());
        }

        // Xuất kho (khách hàng mượn sách)
        @PatchMapping("/decrease")
        public ResponseEntity<ApiResponse<InventoryResponse>> decreaseInventory(
                        @Valid @RequestBody InventoryRequest request) {
                System.out.println("[BACKEND] API xuất kho - bookId=" + request.getBookId() + ", quantity="
                                + request.getQuantity());
                InventoryResponse data = inventoryService.decreaseInventory(request);
                return ResponseEntity.ok(ApiResponse.<InventoryResponse>builder()
                                .success(true)
                                .message("Xuất kho thành công")
                                .data(data)
                                .build());
        }

        // Nhập kho (thêm sách mới vào kho hoặc khách hàng trả sách đã mượn về)
        @PatchMapping("/increase")
        public ResponseEntity<ApiResponse<InventoryResponse>> increaseInventory(
                        @Valid @RequestBody InventoryRequest request) {
                System.out.println("[BACKEND] API tăng tồn kho - bookId=" + request.getBookId() + ", quantity="
                                + request.getQuantity());
                InventoryResponse data = inventoryService.increaseInventory(request);
                return ResponseEntity.ok(ApiResponse.<InventoryResponse>builder()
                                .success(true)
                                .message("Nhập lại kho thành công")
                                .data(data)
                                .build());
        }

        // Lấy về all list inventory book
        @GetMapping()
        public ResponseEntity<ApiResponse<List<InventoryResponse>>> getAllInventory() {
                System.out.println("[BACKEND] API lấy toàn bộ tồn kho");
                List<InventoryResponse> listInventoryResponses = inventoryService.getAllInventory();

                ApiResponse<List<InventoryResponse>> apiResponse = ApiResponse.<List<InventoryResponse>>builder()
                                .success(true)
                                .message("Lấy danh sách kho book thành công")
                                .data(listInventoryResponses)
                                .build();

                return ResponseEntity.ok(apiResponse);
        }

        // lấy inventory theo BookId
        @GetMapping("/{bookId}")
        public ResponseEntity<ApiResponse<InventoryResponse>> getInventoryByBookId(@PathVariable Long bookId) {
                System.out.println("[BACKEND] API lấy tồn kho theo bookId=" + bookId);
                InventoryResponse inventoryResponse = inventoryService.getInventoryByBookId(bookId);
                ApiResponse<InventoryResponse> apiResponse = ApiResponse.<InventoryResponse>builder()
                                .success(true)
                                .message("Lấy danh sách kho book thành công")
                                .data(inventoryResponse)
                                .build();

                return ResponseEntity.ok(apiResponse);
        }

        // lấy về lịch sử nhập/xuất kho của tất cả book
        @GetMapping("/logs")
        public ResponseEntity<ApiResponse<List<InventoryLogResponse>>> getAllInventoryLog() {
                System.out.println("[BACKEND] API lấy lịch sử nhập xuất kho");
                List<InventoryLogResponse> inventoryLogResponses = inventoryService.getAllInventoryLog();
                ApiResponse<List<InventoryLogResponse>> apiResponse = ApiResponse.<List<InventoryLogResponse>>builder()
                                .success(true)
                                .message("Lấy lịch sử xuất/nhập kho book thành công")
                                .data(inventoryLogResponses)
                                .build();

                return ResponseEntity.ok(apiResponse);

        }

        // lấy về lịch sử xuất nhập kho theo bookId
        @GetMapping("/logs/{bookId}")
        public ResponseEntity<ApiResponse<List<InventoryLogResponse>>> getAllInventoryLogByBookId(
                        @PathVariable Long id) {
                System.out.println("[BACKEND] API lấy lịch sử nhập xuất kho theo bookId=" + id);
                List<InventoryLogResponse> inventoryLogResponses = inventoryService.getAllInventoryLogByBookId(id);
                ApiResponse<List<InventoryLogResponse>> apiResponse = ApiResponse.<List<InventoryLogResponse>>builder()
                                .success(true)
                                .message("Lấy lịch sử xuất/nhập kho book theo BookId thành công")
                                .data(inventoryLogResponses)
                                .build();

                return ResponseEntity.ok(apiResponse);
        }

}
