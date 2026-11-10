package com.company.devicemanagement.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BorrowApprovalDto {

    @NotNull(message = "ID của Admin duyệt không được để trống")
    private Long adminId;

    private boolean approved;

    private String adminNote;
}
