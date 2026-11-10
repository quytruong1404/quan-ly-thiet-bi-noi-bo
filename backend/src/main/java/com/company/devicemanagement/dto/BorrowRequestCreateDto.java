package com.company.devicemanagement.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRequestCreateDto {

    @NotNull(message = "ID người mượn không được để trống")
    private Long userId;

    @NotNull(message = "Ngày mượn không được để trống")
    private LocalDate borrowDate;

    @NotNull(message = "Ngày trả dự kiến không được để trống")
    private LocalDate expectedReturnDate;

    @NotNull(message = "Lý do mượn không được để trống")
    private String reason;

    @NotEmpty(message = "Danh sách thiết bị mượn không được rỗng")
    private List<Long> deviceIds;

    private String notes;
}
