-- ========================================================
-- HỆ THỐNG QUẢN LÝ THIẾT BỊ NỘI BỘ (INTERNAL DEVICE MANAGEMENT)
-- Công nghệ: Spring Boot + MySQL + Next.js
-- Tác giả: Trương Đàm Công Quý
-- ========================================================

CREATE DATABASE IF NOT EXISTS `thiet_bi_noi_bo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `thiet_bi_noi_bo`;

-- 1. BẢNG NGƯỜI DÙNG (USERS)
DROP TABLE IF EXISTS `borrow_items`;
DROP TABLE IF EXISTS `borrow_requests`;
DROP TABLE IF EXISTS `devices`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `phone` VARCHAR(20),
    `department` VARCHAR(100) NOT NULL,
    `role` ENUM('ADMIN', 'EMPLOYEE') NOT NULL DEFAULT 'EMPLOYEE',
    `avatar` VARCHAR(255),
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. BẢNG DANH MỤC THIẾT BỊ (CATEGORIES)
CREATE TABLE `categories` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(20) NOT NULL UNIQUE,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT,
    `icon` VARCHAR(50) DEFAULT 'Laptop',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. BẢNG THIẾT BỊ (DEVICES)
CREATE TABLE `devices` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `name` VARCHAR(150) NOT NULL,
    `category_id` BIGINT NOT NULL,
    `serial_number` VARCHAR(100) UNIQUE,
    `brand` VARCHAR(100),
    `specifications` TEXT,
    `status` ENUM('AVAILABLE', 'BORROWED', 'MAINTENANCE', 'BROKEN') NOT NULL DEFAULT 'AVAILABLE',
    `location` VARCHAR(100) DEFAULT 'Kho thiết bị Tầng 2',
    `image_url` VARCHAR(500),
    `purchase_date` DATE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_device_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BẢNG PHIẾU YÊU CẦU MƯỢN (BORROW_REQUESTS)
CREATE TABLE `borrow_requests` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `code` VARCHAR(50) NOT NULL UNIQUE,
    `user_id` BIGINT NOT NULL,
    `borrow_date` DATE NOT NULL,
    `expected_return_date` DATE NOT NULL,
    `actual_return_date` DATE,
    `reason` TEXT NOT NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED', 'RETURNED', 'OVERDUE') NOT NULL DEFAULT 'PENDING',
    `admin_note` TEXT,
    `approved_by` BIGINT,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_request_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_request_admin` FOREIGN KEY (`approved_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. BẢNG CHI TIẾT PHIẾU MƯỢN (BORROW_ITEMS)
CREATE TABLE `borrow_items` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `request_id` BIGINT NOT NULL,
    `device_id` BIGINT NOT NULL,
    `condition_before` VARCHAR(255) DEFAULT 'Bình thường, hoạt động tốt',
    `condition_after` VARCHAR(255),
    CONSTRAINT `fk_item_request` FOREIGN KEY (`request_id`) REFERENCES `borrow_requests` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_item_device` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================================
-- DỮ LIỆU KHỞI TẠO MẪU (SEED DATA)
-- ========================================================

-- Tài khoản:
-- admin / 123456 (ROLE_ADMIN)
-- quy.truong / 123456 (ROLE_EMPLOYEE)
-- tan.thanh / 123456 (ROLE_EMPLOYEE)
INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `email`, `phone`, `department`, `role`, `avatar`) VALUES
(1, 'admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Quản Trị Viên (Admin)', 'admin@company.com.vn', '0901234567', 'Phòng Quản Trị & IT', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'),
(2, 'quy.truong', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Trương Đàm Công Quý', 'quy.truong@company.com.vn', '0912345678', 'Phòng Phát Triển Phần Mềm', 'EMPLOYEE', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'),
(3, 'tan.thanh', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'Nguyễn Thanh Tấn', 'tan.thanh@company.com.vn', '0987654321', 'Phòng Kiểm Thử (QA/QC)', 'EMPLOYEE', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150');

-- Danh mục
INSERT INTO `categories` (`id`, `code`, `name`, `description`, `icon`) VALUES
(1, 'LAPTOP', 'Máy tính xách tay (Laptop)', 'Laptop phục vụ lập trình, thiết kế và công tác', 'Laptop'),
(2, 'MONITOR', 'Màn hình đồ họa (Monitor)', 'Màn hình hiển thị độ phân giải cao 2K - 4K', 'Monitor'),
(3, 'PROJECTOR', 'Máy chiếu & Hội thảo', 'Máy chiếu công suất lớn cho phòng họp và sự kiện', 'Projector'),
(4, 'ACCESSORY', 'Phụ kiện & Thiết bị mạng', 'Chuột, bàn phím, Hub chuyển đổi, Router Wifi di động', 'HardDrive'),
(5, 'MOBILE_TEST', 'Thiết bị Test Mobile', 'Smartphone, máy tính bảng để test ứng dụng iOS/Android', 'Smartphone');

-- Thiết bị
INSERT INTO `devices` (`id`, `code`, `name`, `category_id`, `serial_number`, `brand`, `specifications`, `status`, `location`, `image_url`, `purchase_date`) VALUES
(1, 'DEV-LP-001', 'MacBook Pro 14" M3 Pro', 1, 'C02G1234MD6R', 'Apple', 'Chip M3 Pro, 18GB RAM, 512GB SSD, Space Black', 'BORROWED', 'Bàn làm việc Dev 1', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', '2024-01-15'),
(2, 'DEV-LP-002', 'Dell XPS 15 9530', 1, 'DLXPS-9530-99', 'Dell', 'Intel Core i7-13700H, 32GB RAM, 1TB SSD, RTX 4060', 'AVAILABLE', 'Kho thiết bị Tầng 2', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', '2024-02-10'),
(3, 'DEV-LP-003', 'ThinkPad X1 Carbon Gen 11', 1, 'TP-X1C-8821', 'Lenovo', 'Core i7-1365U, 16GB RAM, 512GB SSD, Siêu nhẹ 1.12kg', 'AVAILABLE', 'Kho thiết bị Tầng 2', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', '2024-03-01'),
(4, 'DEV-MN-001', 'Dell UltraSharp 27" 4K U2723QE', 2, 'MN-DELL-4K-01', 'Dell', '27 inch, IPS Black, 4K (3840x2160), 98% DCI-P3, USB-C 90W', 'AVAILABLE', 'Kho thiết bị Tầng 2', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', '2024-02-20'),
(5, 'DEV-MN-002', 'LG DualUp 28" 28MQ780', 2, 'MN-LG-DUAL-02', 'LG', 'Tỷ lệ 16:18 độc đáo, SDQHD Nano IPS, công thái học Ergo', 'BORROWED', 'Bàn làm việc QA', 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500', '2024-02-22'),
(6, 'DEV-PR-001', 'Máy chiếu Sony 4K Laser VPL-XW5000ES', 3, 'PR-SONY-4K-99', 'Sony', 'Độ sáng 2000 Lumens, Nguồn sáng Laser, Chiếu phòng họp VIP', 'AVAILABLE', 'Phòng họp lớn Tầng 3', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500', '2024-01-05'),
(7, 'DEV-MB-001', 'iPhone 15 Pro Max 256GB (Test Device)', 5, 'IP15PM-TEST-01', 'Apple', 'iOS 17.5, Dùng cho đội Mobile QA kiểm thử hiệu năng', 'AVAILABLE', 'Tủ bảo mật Phòng QA', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', '2024-03-12'),
(8, 'DEV-MB-002', 'Samsung Galaxy S24 Ultra 512GB', 5, 'SS-S24U-TEST-02', 'Samsung', 'Snapdragon 8 Gen 3, Android 14, S-Pen kiểm thử phần mềm', 'BORROWED', 'Phòng Dev Mobile', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', '2024-03-15'),
(9, 'DEV-AC-001', 'Chuột Logitech MX Master 3S', 4, 'LOGI-MXM3S-11', 'Logitech', 'Cảm biến 8000 DPI, cuộn MagSpeed siêu êm, kết nối 3 máy', 'MAINTENANCE', 'Bàn kỹ thuật sửa chữa', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', '2024-04-01'),
(10, 'DEV-AC-002', 'Bàn phím cơ Keychron K8 Pro', 4, 'KEY-K8PRO-77', 'Keychron', 'Gateron G Pro Brown switch, Hot-swap, Bluetooth 5.1', 'BROKEN', 'Kho chờ thanh lý', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', '2023-11-10');

-- Phiếu mượn
INSERT INTO `borrow_requests` (`id`, `code`, `user_id`, `borrow_date`, `expected_return_date`, `actual_return_date`, `reason`, `status`, `admin_note`, `approved_by`) VALUES
(1, 'REQ-2024-001', 2, '2024-04-10', '2024-04-20', '2024-04-19', 'Mượn thiết bị làm việc tại nhà trong đợt bàn giao dự án Sprint 4', 'RETURNED', 'Đã kiểm tra máy khi nhận lại, nguyên vẹn không trầy xước', 1),
(2, 'REQ-2024-002', 2, '2024-05-01', '2024-05-15', NULL, 'Mượn MacBook Pro và Màn hình để Onsite tại trụ sở khách hàng', 'APPROVED', 'Đã duyệt cho Quý mượn phục vụ dự án đối tác', 1),
(3, 'REQ-2024-003', 3, '2024-05-05', '2024-05-12', NULL, 'Mượn thiết bị Samsung S24 Ultra để test tính năng thanh toán VNPAY', 'APPROVED', 'Nhớ hoàn trả đúng hẹn cho đợt kiểm thử kế tiếp', 1),
(4, 'REQ-2024-004', 3, '2024-05-09', '2024-05-14', NULL, 'Cần mượn máy chiếu Sony cho buổi thuyết trình Chuyên đề 2', 'PENDING', NULL, NULL);

-- Chi tiết phiếu mượn
INSERT INTO `borrow_items` (`id`, `request_id`, `device_id`, `condition_before`, `condition_after`) VALUES
(1, 1, 2, 'Máy mới 99%, đầy đủ củ sạc 130W', 'Tình trạng tốt, hoạt động bình thường'),
(2, 2, 1, 'Máy còn mới, có túi chống sốc đi kèm', NULL),
(3, 2, 5, 'Màn hình đầy đủ cáp Type-C và chân đế Ergo', NULL),
(4, 3, 8, 'Máy mới nguyên hộp, kèm que chọc sim', NULL),
(5, 4, 6, 'Máy chiếu hoạt động tốt kèm điều khiển từ xa', NULL);
