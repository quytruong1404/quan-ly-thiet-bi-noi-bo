package com.company.devicemanagement.controller;

import com.company.devicemanagement.dto.StatisticsDto;
import com.company.devicemanagement.service.StatisticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
@RequiredArgsConstructor
@Tag(name = "5. Thống kê & Báo cáo (Statistics)", description = "Số liệu tổng quan, tỷ lệ thiết bị, xu hướng mượn trả phục vụ Admin")
public class StatisticsController {

    private final StatisticsService statisticsService;

    @GetMapping
    @Operation(summary = "Lấy dữ liệu thống kê tổng hợp cho Dashboard Admin")
    public ResponseEntity<StatisticsDto> getDashboardStatistics() {
        return ResponseEntity.ok(statisticsService.getDashboardStatistics());
    }
}
