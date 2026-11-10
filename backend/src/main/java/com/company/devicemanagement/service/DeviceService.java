package com.company.devicemanagement.service;

import com.company.devicemanagement.model.Category;
import com.company.devicemanagement.model.Device;
import com.company.devicemanagement.model.DeviceStatus;
import com.company.devicemanagement.repository.CategoryRepository;
import com.company.devicemanagement.repository.DeviceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DeviceService {

    private final DeviceRepository deviceRepository;
    private final CategoryRepository categoryRepository;

    public List<Device> getAllDevices(String keyword, Long categoryId, DeviceStatus status) {
        if (keyword != null || categoryId != null || status != null) {
            return deviceRepository.searchDevices(keyword, categoryId, status);
        }
        return deviceRepository.findAll();
    }

    public Device getDeviceById(Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thiết bị ID: " + id));
    }

    @Transactional
    public Device createDevice(Device device, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục ID: " + categoryId));
        device.setCategory(category);
        return deviceRepository.save(device);
    }

    @Transactional
    public Device updateDevice(Long id, Device details, Long categoryId) {
        Device device = getDeviceById(id);
        device.setName(details.getName());
        device.setCode(details.getCode());
        device.setBrand(details.getBrand());
        device.setSerialNumber(details.getSerialNumber());
        device.setSpecifications(details.getSpecifications());
        device.setStatus(details.getStatus());
        device.setLocation(details.getLocation());
        device.setImageUrl(details.getImageUrl());
        device.setPurchaseDate(details.getPurchaseDate());

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy danh mục ID: " + categoryId));
            device.setCategory(category);
        }

        return deviceRepository.save(device);
    }

    @Transactional
    public void deleteDevice(Long id) {
        deviceRepository.deleteById(id);
    }

    @Transactional
    public Device updateStatus(Long id, DeviceStatus status) {
        Device device = getDeviceById(id);
        device.setStatus(status);
        return deviceRepository.save(device);
    }
}
