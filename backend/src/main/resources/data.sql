-- Initial Users
INSERT IGNORE INTO users (id, username, password, full_name, email, phone, department, role, avatar)
VALUES (1, 'admin', '123456', 'Quản Trị Viên (Admin)', 'admin@company.com.vn', '0901234567', 'Phòng Quản Trị & IT', 'ADMIN', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150');

INSERT IGNORE INTO users (id, username, password, full_name, email, phone, department, role, avatar)
VALUES (2, 'quy.truong', '123456', 'Trương Đàm Công Quý', 'quy.truong@company.com.vn', '0912345678', 'Phòng Phát Triển Phần Mềm', 'EMPLOYEE', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150');

INSERT IGNORE INTO users (id, username, password, full_name, email, phone, department, role, avatar)
VALUES (3, 'tan.thanh', '123456', 'Nguyễn Thanh Tấn', 'tan.thanh@company.com.vn', '0987654321', 'Phòng Kiểm Thử (QA/QC)', 'EMPLOYEE', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150');

-- Categories
INSERT IGNORE INTO categories (id, code, name, description, icon)
VALUES (1, 'LAPTOP', 'Máy tính xách tay (Laptop)', 'Laptop lập trình, văn phòng và thiết kế đồ họa', 'Laptop');

INSERT IGNORE INTO categories (id, code, name, description, icon)
VALUES (2, 'MONITOR', 'Màn hình đồ họa (Monitor)', 'Màn hình hiển thị độ phân giải cao 2K - 4K', 'Monitor');

INSERT IGNORE INTO categories (id, code, name, description, icon)
VALUES (3, 'PROJECTOR', 'Máy chiếu & Hội thảo', 'Máy chiếu công suất lớn cho phòng họp và sự kiện', 'Projector');

INSERT IGNORE INTO categories (id, code, name, description, icon)
VALUES (4, 'ACCESSORY', 'Phụ kiện & Thiết bị mạng', 'Chuột, bàn phím, Hub chuyển đổi, Router Wifi di động', 'HardDrive');

INSERT IGNORE INTO categories (id, code, name, description, icon)
VALUES (5, 'MOBILE_TEST', 'Thiết bị Test Mobile', 'Smartphone, máy tính bảng để test ứng dụng iOS/Android', 'Smartphone');

-- Devices
INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (1, 'DEV-LP-001', 'MacBook Pro 14" M3 Pro', 1, 'C02G1234MD6R', 'Apple', 'Chip M3 Pro, 18GB RAM, 512GB SSD, Space Black', 'BORROWED', 'Bàn làm việc Dev 1', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500', '2024-01-15');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (2, 'DEV-LP-002', 'Dell XPS 15 9530', 1, 'DLXPS-9530-99', 'Dell', 'Intel Core i7-13700H, 32GB RAM, 1TB SSD, RTX 4060', 'AVAILABLE', 'Kho thiết bị Tầng 2', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500', '2024-02-10');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (3, 'DEV-LP-003', 'ThinkPad X1 Carbon Gen 11', 1, 'TP-X1C-8821', 'Lenovo', 'Core i7-1365U, 16GB RAM, 512GB SSD, Siêu nhẹ 1.12kg', 'AVAILABLE', 'Kho thiết bị Tầng 2', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500', '2024-03-01');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (4, 'DEV-MN-001', 'Dell UltraSharp 27" 4K U2723QE', 2, 'MN-DELL-4K-01', 'Dell', '27 inch, IPS Black, 4K (3840x2160), 98% DCI-P3, USB-C 90W', 'AVAILABLE', 'Kho thiết bị Tầng 2', 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500', '2024-02-20');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (5, 'DEV-MN-002', 'LG DualUp 28" 28MQ780', 2, 'MN-LG-DUAL-02', 'LG', 'Tỷ lệ 16:18 độc đáo, SDQHD Nano IPS, công thái học Ergo', 'BORROWED', 'Bàn làm việc QA', 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500', '2024-02-22');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (6, 'DEV-PR-001', 'Máy chiếu Sony 4K Laser VPL-XW5000ES', 3, 'PR-SONY-4K-99', 'Sony', 'Độ sáng 2000 Lumens, Nguồn sáng Laser, Chiếu phòng họp VIP', 'AVAILABLE', 'Phòng họp lớn Tầng 3', 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500', '2024-01-05');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (7, 'DEV-MB-001', 'iPhone 15 Pro Max 256GB (Test Device)', 5, 'IP15PM-TEST-01', 'Apple', 'iOS 17.5, Dùng cho đội Mobile QA kiểm thử hiệu năng', 'AVAILABLE', 'Tủ bảo mật Phòng QA', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500', '2024-03-12');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (8, 'DEV-MB-002', 'Samsung Galaxy S24 Ultra 512GB', 5, 'SS-S24U-TEST-02', 'Samsung', 'Snapdragon 8 Gen 3, Android 14, S-Pen kiểm thử phần mềm', 'BORROWED', 'Phòng Dev Mobile', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500', '2024-03-15');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (9, 'DEV-AC-001', 'Chuột Logitech MX Master 3S', 4, 'LOGI-MXM3S-11', 'Logitech', 'Cảm biến 8000 DPI, cuộn MagSpeed siêu êm, kết nối 3 máy', 'MAINTENANCE', 'Bàn kỹ thuật sửa chữa', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500', '2024-04-01');

INSERT IGNORE INTO devices (id, code, name, category_id, serial_number, brand, specifications, status, location, image_url, purchase_date)
VALUES (10, 'DEV-AC-002', 'Bàn phím cơ Keychron K8 Pro', 4, 'KEY-K8PRO-77', 'Keychron', 'Gateron G Pro Brown switch, Hot-swap, Bluetooth 5.1', 'BROKEN', 'Kho chờ thanh lý', 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500', '2023-11-10');
