export interface Category {
  id: number;
  code: string;
  name: string;
  description: string;
  icon: string;
}

export type DeviceStatus = 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE' | 'BROKEN';

export interface Device {
  id: number;
  code: string;
  name: string;
  categoryId: number;
  categoryName?: string;
  serialNumber: string;
  brand: string;
  specifications: string;
  status: DeviceStatus;
  location: string;
  imageUrl: string;
  purchaseDate: string;
}

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'RETURNED' | 'OVERDUE';

export interface BorrowItem {
  id: number;
  deviceId: number;
  deviceName: string;
  deviceCode: string;
  conditionBefore: string;
  conditionAfter?: string;
}

export interface BorrowRequest {
  id: number;
  code: string;
  userId: number;
  userName: string;
  department: string;
  borrowDate: string;
  expectedReturnDate: string;
  actualReturnDate?: string;
  reason: string;
  status: RequestStatus;
  adminNote?: string;
  approvedByName?: string;
  items: BorrowItem[];
  createdAt: string;
}

export const INITIAL_CATEGORIES: Category[] = [
  { id: 1, code: 'LAPTOP', name: 'Máy tính xách tay (Laptop)', description: 'Laptop phục vụ phát triển phần mềm, thiết kế và công tác', icon: 'Laptop' },
  { id: 2, code: 'MONITOR', name: 'Màn hình đồ họa (Monitor)', description: 'Màn hình hiển thị độ phân giải cao 2K - 4K', icon: 'Monitor' },
  { id: 3, code: 'PROJECTOR', name: 'Máy chiếu & Hội thảo', description: 'Máy chiếu công suất lớn cho phòng họp và sự kiện', icon: 'Projector' },
  { id: 4, code: 'ACCESSORY', name: 'Phụ kiện & Thiết bị mạng', description: 'Chuột, phím cơ, Hub chuyển đổi, Router Wifi di động', icon: 'HardDrive' },
  { id: 5, code: 'MOBILE_TEST', name: 'Thiết bị Test Mobile', description: 'Smartphone, máy tính bảng phục vụ kiểm thử QA/QC', icon: 'Smartphone' },
];

export const INITIAL_DEVICES: Device[] = [
  {
    id: 1,
    code: 'DEV-LP-001',
    name: 'MacBook Pro 14" M3 Pro',
    categoryId: 1,
    categoryName: 'Máy tính xách tay (Laptop)',
    serialNumber: 'C02G1234MD6R',
    brand: 'Apple',
    specifications: 'Chip M3 Pro (11-core CPU, 14-core GPU), 18GB Unified RAM, 512GB SSD',
    status: 'BORROWED',
    location: 'Bàn làm việc Dev 1',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
    purchaseDate: '2024-01-15',
  },
  {
    id: 2,
    code: 'DEV-LP-002',
    name: 'Dell XPS 15 9530',
    categoryId: 1,
    categoryName: 'Máy tính xách tay (Laptop)',
    serialNumber: 'DLXPS-9530-99',
    brand: 'Dell',
    specifications: 'Intel Core i7-13700H, 32GB RAM DDR5, 1TB SSD NVMe, NVIDIA RTX 4060',
    status: 'AVAILABLE',
    location: 'Kho thiết bị Tầng 2',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
    purchaseDate: '2024-02-10',
  },
  {
    id: 3,
    code: 'DEV-LP-003',
    name: 'ThinkPad X1 Carbon Gen 11',
    categoryId: 1,
    categoryName: 'Máy tính xách tay (Laptop)',
    serialNumber: 'TP-X1C-8821',
    brand: 'Lenovo',
    specifications: 'Core i7-1365U, 16GB RAM, 512GB SSD, Cân nặng siêu nhẹ 1.12kg',
    status: 'AVAILABLE',
    location: 'Kho thiết bị Tầng 2',
    imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500',
    purchaseDate: '2024-03-01',
  },
  {
    id: 4,
    code: 'DEV-MN-001',
    name: 'Dell UltraSharp 27" 4K U2723QE',
    categoryId: 2,
    categoryName: 'Màn hình đồ họa (Monitor)',
    serialNumber: 'MN-DELL-4K-01',
    brand: 'Dell',
    specifications: '27 inch, IPS Black, 4K (3840x2160), 98% DCI-P3, Cổng sạc USB-C 90W',
    status: 'AVAILABLE',
    location: 'Kho thiết bị Tầng 2',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500',
    purchaseDate: '2024-02-20',
  },
  {
    id: 5,
    code: 'DEV-MN-002',
    name: 'LG DualUp 28" 28MQ780',
    categoryId: 2,
    categoryName: 'Màn hình đồ họa (Monitor)',
    serialNumber: 'MN-LG-DUAL-02',
    brand: 'LG',
    specifications: 'Tỷ lệ 16:18 độc đáo, SDQHD Nano IPS, Chân công thái học Ergo xoay 360',
    status: 'BORROWED',
    location: 'Bàn làm việc QA',
    imageUrl: 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=500',
    purchaseDate: '2024-02-22',
  },
  {
    id: 6,
    code: 'DEV-PR-001',
    name: 'Máy chiếu Sony 4K Laser VPL-XW5000ES',
    categoryId: 3,
    categoryName: 'Máy chiếu & Hội thảo',
    serialNumber: 'PR-SONY-4K-99',
    brand: 'Sony',
    specifications: 'Độ sáng 2000 Lumens, Nguồn sáng Laser 20.000 giờ, Native 4K SXRD',
    status: 'AVAILABLE',
    location: 'Phòng họp lớn Tầng 3',
    imageUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500',
    purchaseDate: '2024-01-05',
  },
  {
    id: 7,
    code: 'DEV-MB-001',
    name: 'iPhone 15 Pro Max 256GB Titanium',
    categoryId: 5,
    categoryName: 'Thiết bị Test Mobile',
    serialNumber: 'IP15PM-TEST-01',
    brand: 'Apple',
    specifications: 'Apple A17 Pro, Màn hình OLED ProMotion 120Hz, iOS 17.5',
    status: 'AVAILABLE',
    location: 'Tủ bảo mật Phòng QA',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500',
    purchaseDate: '2024-03-12',
  },
  {
    id: 8,
    code: 'DEV-MB-002',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    categoryId: 5,
    categoryName: 'Thiết bị Test Mobile',
    serialNumber: 'SS-S24U-TEST-02',
    brand: 'Samsung',
    specifications: 'Snapdragon 8 Gen 3 for Galaxy, 12GB RAM, S-Pen tích hợp, Android 14',
    status: 'BORROWED',
    location: 'Phòng Dev Mobile',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
    purchaseDate: '2024-03-15',
  },
  {
    id: 9,
    code: 'DEV-AC-001',
    name: 'Chuột không dây Logitech MX Master 3S',
    categoryId: 4,
    categoryName: 'Phụ kiện & Thiết bị mạng',
    serialNumber: 'LOGI-MXM3S-11',
    brand: 'Logitech',
    specifications: 'Cảm biến 8000 DPI, cuộn MagSpeed siêu êm, kết nối cùng lúc 3 thiết bị',
    status: 'MAINTENANCE',
    location: 'Bàn kỹ thuật IT',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=500',
    purchaseDate: '2024-04-01',
  },
  {
    id: 10,
    code: 'DEV-AC-002',
    name: 'Bàn phím cơ Keychron K8 Pro QMK/VIA',
    categoryId: 4,
    categoryName: 'Phụ kiện & Thiết bị mạng',
    serialNumber: 'KEY-K8PRO-77',
    brand: 'Keychron',
    specifications: 'Gateron G Pro Brown switch, Hot-swap, Bluetooth 5.1 & Type-C',
    status: 'BROKEN',
    location: 'Kho chờ thanh lý',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    purchaseDate: '2023-11-10',
  },
];

export const INITIAL_REQUESTS: BorrowRequest[] = [
  {
    id: 1,
    code: 'REQ-2024-001',
    userId: 2,
    userName: 'Trương Đàm Công Quý',
    department: 'Phòng Phát Triển Phần Mềm',
    borrowDate: '2024-04-10',
    expectedReturnDate: '2024-04-20',
    actualReturnDate: '2024-04-19',
    reason: 'Mượn Dell XPS làm việc tại nhà trong giai đoạn nước rút bàn giao Sprint 4',
    status: 'RETURNED',
    adminNote: 'Đã nhận máy đầy đủ phụ kiện củ sạc, không trầy xước',
    approvedByName: 'Quản Trị Viên (Admin)',
    createdAt: '2024-04-09 14:20:00',
    items: [
      { id: 1, deviceId: 2, deviceName: 'Dell XPS 15 9530', deviceCode: 'DEV-LP-002', conditionBefore: 'Máy hoạt động tốt', conditionAfter: 'Đã hoàn trả nguyên vẹn' }
    ]
  },
  {
    id: 2,
    code: 'REQ-2024-002',
    userId: 2,
    userName: 'Trương Đàm Công Quý',
    department: 'Phòng Phát Triển Phần Mềm',
    borrowDate: '2024-05-01',
    expectedReturnDate: '2024-05-20',
    reason: 'Mượn MacBook Pro và Màn hình để làm việc Onsite trực tiếp tại trụ sở ngân hàng đối tác',
    status: 'APPROVED',
    adminNote: 'Đã phê duyệt bàn giao máy kèm túi chống sốc và cáp HDMI/Type-C',
    approvedByName: 'Quản Trị Viên (Admin)',
    createdAt: '2024-04-30 09:15:00',
    items: [
      { id: 2, deviceId: 1, deviceName: 'MacBook Pro 14" M3 Pro', deviceCode: 'DEV-LP-001', conditionBefore: 'Máy mới 99%' },
      { id: 3, deviceId: 5, deviceName: 'LG DualUp 28" 28MQ780', deviceCode: 'DEV-MN-002', conditionBefore: 'Đầy đủ chân đế và cáp kết nối' }
    ]
  },
  {
    id: 3,
    code: 'REQ-2024-003',
    userId: 3,
    userName: 'Nguyễn Thanh Tấn',
    department: 'Phòng Kiểm Thử (QA/QC)',
    borrowDate: '2024-05-05',
    expectedReturnDate: '2024-05-18',
    reason: 'Mượn Samsung Galaxy S24 Ultra để kiểm thử tính năng nhận diện sinh trắc học và thanh toán',
    status: 'APPROVED',
    adminNote: 'Chú ý bảo quản thiết bị trong tủ bảo mật sau giờ làm việc',
    approvedByName: 'Quản Trị Viên (Admin)',
    createdAt: '2024-05-04 16:45:00',
    items: [
      { id: 4, deviceId: 8, deviceName: 'Samsung Galaxy S24 Ultra 512GB', deviceCode: 'DEV-MB-002', conditionBefore: 'Máy mới nguyên hộp' }
    ]
  },
  {
    id: 4,
    code: 'REQ-2024-004',
    userId: 3,
    userName: 'Nguyễn Thanh Tấn',
    department: 'Phòng Kiểm Thử (QA/QC)',
    borrowDate: '2024-05-15',
    expectedReturnDate: '2024-05-16',
    reason: 'Cần mượn máy chiếu Sony cho buổi báo cáo tiến độ đồ án Chuyên đề 2',
    status: 'PENDING',
    createdAt: '2024-05-10 11:30:00',
    items: [
      { id: 5, deviceId: 6, deviceName: 'Máy chiếu Sony 4K Laser VPL-XW5000ES', deviceCode: 'DEV-PR-001', conditionBefore: 'Máy hoạt động hoàn hảo' }
    ]
  }
];
