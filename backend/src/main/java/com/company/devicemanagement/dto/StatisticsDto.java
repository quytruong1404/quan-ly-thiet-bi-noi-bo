package com.company.devicemanagement.dto;

import lombok.*;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StatisticsDto {
    private long totalDevices;
    private long availableDevices;
    private long borrowedDevices;
    private long maintenanceDevices;
    private long brokenDevices;

    private long totalRequests;
    private long pendingRequests;
    private long approvedRequests;
    private long returnedRequests;
    private long rejectedRequests;

    private Map<String, Long> devicesByCategory;
    private Map<String, Long> monthlyBorrowTrends;
}
