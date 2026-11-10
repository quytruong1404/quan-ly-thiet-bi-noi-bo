package com.company.devicemanagement.controller;

import com.company.devicemanagement.dto.BorrowApprovalDto;
import com.company.devicemanagement.dto.BorrowRequestCreateDto;
import com.company.devicemanagement.dto.ReturnConfirmDto;
import com.company.devicemanagement.model.BorrowRequest;
import com.company.devicemanagement.model.RequestStatus;
import com.company.devicemanagement.service.BorrowRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow-requests")
@RequiredArgsConstructor
@Tag(name = "4. Quản lý Mượn & Trả Thiết bị (Borrow Requests)", description = "Nhân viên tạo yêu cầu; Admin duyệt/từ chối; Admin xác nhận hoàn trả")
public class BorrowRequestController {

    private final BorrowRequestService borrowRequestService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả phiếu mượn (lọc theo trạng thái PENDING, APPROVED, RETURNED, REJECTED)")
    public ResponseEntity<List<BorrowRequest>> getAllRequests(@RequestParam(required = false) RequestStatus status) {
        return ResponseEntity.ok(borrowRequestService.getAllRequests(status));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Lấy danh sách phiếu mượn của một nhân viên")
    public ResponseEntity<List<BorrowRequest>> getRequestsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(borrowRequestService.getRequestsByUser(userId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết một phiếu mượn")
    public ResponseEntity<BorrowRequest> getRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(borrowRequestService.getRequestById(id));
    }

    @PostMapping
    @Operation(summary = "Nhân viên tạo phiếu yêu cầu mượn thiết bị mới")
    public ResponseEntity<BorrowRequest> createRequest(@Valid @RequestBody BorrowRequestCreateDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(borrowRequestService.createRequest(dto));
    }

    @PostMapping("/{id}/approval")
    @Operation(summary = "Admin duyệt hoặc từ chối phiếu mượn thiết bị")
    public ResponseEntity<BorrowRequest> approveRequest(
            @PathVariable Long id,
            @Valid @RequestBody BorrowApprovalDto dto) {
        return ResponseEntity.ok(borrowRequestService.approveRequest(id, dto));
    }

    @PostMapping("/{id}/return")
    @Operation(summary = "Admin xác nhận nhân viên đã hoàn trả thiết bị và kiểm tra hiện trạng")
    public ResponseEntity<BorrowRequest> confirmReturn(
            @PathVariable Long id,
            @RequestBody ReturnConfirmDto dto) {
        return ResponseEntity.ok(borrowRequestService.confirmReturn(id, dto));
    }
}
