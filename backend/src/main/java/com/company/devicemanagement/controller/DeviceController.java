package com.company.devicemanagement.controller;

import com.company.devicemanagement.model.Device;
import com.company.devicemanagement.model.DeviceStatus;
import com.company.devicemanagement.service.DeviceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/devices")
@RequiredArgsConstructor
@Tag(name = "3. Quản lý Thiết bị (Devices)", description = "CRUD thiết bị, lọc trạng thái, tìm kiếm và cập nhật tình trạng")
public class DeviceController {

    private final DeviceService deviceService;

    @GetMapping
    @Operation(summary = "Lấy danh sách thiết bị (hỗ trợ lọc từ khóa, danh mục, trạng thái)")
    public ResponseEntity<List<Device>> getAllDevices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) DeviceStatus status) {
        return ResponseEntity.ok(deviceService.getAllDevices(keyword, categoryId, status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin chi tiết thiết bị theo ID")
    public ResponseEntity<Device> getDeviceById(@PathVariable Long id) {
        return ResponseEntity.ok(deviceService.getDeviceById(id));
    }

    @PostMapping
    @Operation(summary = "Thêm mới thiết bị vào kho (Admin)")
    public ResponseEntity<Device> createDevice(
            @RequestBody Device device,
            @RequestParam Long categoryId) {
        return ResponseEntity.status(HttpStatus.CREATED).body(deviceService.createDevice(device, categoryId));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin thiết bị (Admin)")
    public ResponseEntity<Device> updateDevice(
            @PathVariable Long id,
            @RequestBody Device device,
            @RequestParam(required = false) Long categoryId) {
        return ResponseEntity.ok(deviceService.updateDevice(id, device, categoryId));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật nhanh trạng thái thiết bị (AVAILABLE, BORROWED, MAINTENANCE, BROKEN)")
    public ResponseEntity<Device> updateStatus(
            @PathVariable Long id,
            @RequestParam DeviceStatus status) {
        return ResponseEntity.ok(deviceService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Xóa thiết bị khỏi hệ thống (Admin)")
    public ResponseEntity<Void> deleteDevice(@PathVariable Long id) {
        deviceService.deleteDevice(id);
        return ResponseEntity.noContent().build();
    }
}
