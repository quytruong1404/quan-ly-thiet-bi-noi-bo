package com.company.devicemanagement.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReturnConfirmDto {

    private Long adminId;

    private LocalDate actualReturnDate;

    private String adminNote;

    // deviceId -> condition description (e.g. "Hoạt động tốt, nguyên vẹn")
    private Map<Long, String> itemConditions;
}
