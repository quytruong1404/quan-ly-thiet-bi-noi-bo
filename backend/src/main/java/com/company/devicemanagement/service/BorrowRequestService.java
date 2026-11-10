package com.company.devicemanagement.service;

import com.company.devicemanagement.dto.BorrowApprovalDto;
import com.company.devicemanagement.dto.BorrowRequestCreateDto;
import com.company.devicemanagement.dto.ReturnConfirmDto;
import com.company.devicemanagement.model.*;
import com.company.devicemanagement.repository.BorrowRequestRepository;
import com.company.devicemanagement.repository.DeviceRepository;
import com.company.devicemanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BorrowRequestService {

    private final BorrowRequestRepository borrowRequestRepository;
    private final DeviceRepository deviceRepository;
    private final UserRepository userRepository;

    public List<BorrowRequest> getAllRequests(RequestStatus status) {
        if (status != null) {
            return borrowRequestRepository.findByStatusOrderByCreatedAtDesc(status);
        }
        return borrowRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<BorrowRequest> getRequestsByUser(Long userId) {
        return borrowRequestRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public BorrowRequest getRequestById(Long id) {
        return borrowRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy yêu cầu mượn ID: " + id));
    }

    @Transactional
    public BorrowRequest createRequest(BorrowRequestCreateDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng ID: " + dto.getUserId()));

        String requestCode = "REQ-" + LocalDate.now().getYear() + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();

        BorrowRequest request = BorrowRequest.builder()
                .code(requestCode)
                .user(user)
                .borrowDate(dto.getBorrowDate())
                .expectedReturnDate(dto.getExpectedReturnDate())
                .reason(dto.getReason())
                .status(RequestStatus.PENDING)
                .items(new ArrayList<>())
                .build();

        for (Long deviceId : dto.getDeviceIds()) {
            Device device = deviceRepository.findById(deviceId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị ID: " + deviceId));

            if (device.getStatus() != DeviceStatus.AVAILABLE) {
                throw new RuntimeException("Thiết bị '" + device.getName() + "' hiện không ở trạng thái sẵn sàng để mượn!");
            }

            BorrowItem item = BorrowItem.builder()
                    .request(request)
                    .device(device)
                    .conditionBefore("Hoạt động bình thường tại thời điểm mượn")
                    .build();

            request.getItems().add(item);
        }

        return borrowRequestRepository.save(request);
    }

    @Transactional
    public BorrowRequest approveRequest(Long id, BorrowApprovalDto dto) {
        BorrowRequest request = getRequestById(id);

        if (request.getStatus() != RequestStatus.PENDING) {
            throw new RuntimeException("Chỉ có thể duyệt các phiếu đang ở trạng thái Chờ duyệt (PENDING)");
        }

        User admin = userRepository.findById(dto.getAdminId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy quản trị viên ID: " + dto.getAdminId()));

        request.setApprovedBy(admin);
        request.setAdminNote(dto.getAdminNote());

        if (dto.isApproved()) {
            request.setStatus(RequestStatus.APPROVED);
            // Cập nhật trạng thái các thiết bị sang BORROWED
            for (BorrowItem item : request.getItems()) {
                Device device = item.getDevice();
                device.setStatus(DeviceStatus.BORROWED);
                deviceRepository.save(device);
            }
        } else {
            request.setStatus(RequestStatus.REJECTED);
        }

        return borrowRequestRepository.save(request);
    }

    @Transactional
    public BorrowRequest confirmReturn(Long id, ReturnConfirmDto dto) {
        BorrowRequest request = getRequestById(id);

        if (request.getStatus() != RequestStatus.APPROVED) {
            throw new RuntimeException("Chỉ có thể xác nhận trả đối với phiếu đã được duyệt và đang mượn (APPROVED)");
        }

        LocalDate returnDate = dto.getActualReturnDate() != null ? dto.getActualReturnDate() : LocalDate.now();
        request.setActualReturnDate(returnDate);
        request.setStatus(RequestStatus.RETURNED);

        if (dto.getAdminNote() != null && !dto.getAdminNote().isEmpty()) {
            request.setAdminNote((request.getAdminNote() != null ? request.getAdminNote() + " | " : "") + "Ghi chú trả: " + dto.getAdminNote());
        }

        // Cập nhật tình trạng trả và chuyển thiết bị lại AVAILABLE
        for (BorrowItem item : request.getItems()) {
            Device device = item.getDevice();
            if (dto.getItemConditions() != null && dto.getItemConditions().containsKey(device.getId())) {
                String condition = dto.getItemConditions().get(device.getId());
                item.setConditionAfter(condition);
                if (condition.toLowerCase().contains("hỏng") || condition.toLowerCase().contains("vỡ")) {
                    device.setStatus(DeviceStatus.BROKEN);
                } else if (condition.toLowerCase().contains("lỗi") || condition.toLowerCase().contains("bảo trì")) {
                    device.setStatus(DeviceStatus.MAINTENANCE);
                } else {
                    device.setStatus(DeviceStatus.AVAILABLE);
                }
            } else {
                item.setConditionAfter("Hoàn trả đầy đủ, tình trạng bình thường");
                device.setStatus(DeviceStatus.AVAILABLE);
            }
            deviceRepository.save(device);
        }

        return borrowRequestRepository.save(request);
    }
}
