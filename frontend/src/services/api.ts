import { Category, Device, BorrowRequest, INITIAL_CATEGORIES, INITIAL_DEVICES, INITIAL_REQUESTS } from './mockData';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

class StorageManager {
  private static isClient = typeof window !== 'undefined';

  static getDevices(): Device[] {
    if (!this.isClient) return INITIAL_DEVICES;
    const stored = localStorage.getItem('thietbi_devices');
    if (!stored) {
      localStorage.setItem('thietbi_devices', JSON.stringify(INITIAL_DEVICES));
      return INITIAL_DEVICES;
    }
    return JSON.parse(stored);
  }

  static saveDevices(devices: Device[]) {
    if (this.isClient) {
      localStorage.setItem('thietbi_devices', JSON.stringify(devices));
    }
  }

  static getRequests(): BorrowRequest[] {
    if (!this.isClient) return INITIAL_REQUESTS;
    const stored = localStorage.getItem('thietbi_requests');
    if (!stored) {
      localStorage.setItem('thietbi_requests', JSON.stringify(INITIAL_REQUESTS));
      return INITIAL_REQUESTS;
    }
    return JSON.parse(stored);
  }

  static saveRequests(requests: BorrowRequest[]) {
    if (this.isClient) {
      localStorage.setItem('thietbi_requests', JSON.stringify(requests));
    }
  }
}

export const api = {
  // 1. Devices
  async getDevices(): Promise<Device[]> {
    try {
      const res = await fetch(`${BASE_URL}/devices`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // Fallback to local storage / mock
    }
    return StorageManager.getDevices();
  },

  async addDevice(device: Omit<Device, 'id'>): Promise<Device> {
    try {
      const res = await fetch(`${BASE_URL}/devices?categoryId=${device.categoryId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(device),
      });
      if (res.ok) return await res.json();
    } catch {}

    const devices = StorageManager.getDevices();
    const newDevice: Device = {
      ...device,
      id: Date.now(),
    };
    devices.unshift(newDevice);
    StorageManager.saveDevices(devices);
    return newDevice;
  },

  async updateDeviceStatus(id: number, status: Device['status']): Promise<void> {
    try {
      await fetch(`${BASE_URL}/devices/${id}/status?status=${status}`, { method: 'PATCH' });
    } catch {}

    const devices = StorageManager.getDevices();
    const target = devices.find(d => d.id === id);
    if (target) {
      target.status = status;
      StorageManager.saveDevices(devices);
    }
  },

  // 2. Categories
  async getCategories(): Promise<Category[]> {
    try {
      const res = await fetch(`${BASE_URL}/categories`, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch {}
    return INITIAL_CATEGORIES;
  },

  // 3. Borrow Requests
  async getRequests(): Promise<BorrowRequest[]> {
    try {
      const res = await fetch(`${BASE_URL}/borrow-requests`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {}
    return StorageManager.getRequests();
  },

  async createBorrowRequest(dto: {
    userId: number;
    userName: string;
    department: string;
    borrowDate: string;
    expectedReturnDate: string;
    reason: string;
    deviceIds: number[];
  }): Promise<BorrowRequest> {
    try {
      const res = await fetch(`${BASE_URL}/borrow-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto),
      });
      if (res.ok) return await res.json();
    } catch {}

    const devices = StorageManager.getDevices();
    const requests = StorageManager.getRequests();

    const selectedDevices = devices.filter(d => dto.deviceIds.includes(d.id));
    const newRequest: BorrowRequest = {
      id: Date.now(),
      code: `REQ-2024-${Math.floor(100 + Math.random() * 900)}`,
      userId: dto.userId,
      userName: dto.userName,
      department: dto.department,
      borrowDate: dto.borrowDate,
      expectedReturnDate: dto.expectedReturnDate,
      reason: dto.reason,
      status: 'PENDING',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      items: selectedDevices.map((d, index) => ({
        id: Date.now() + index,
        deviceId: d.id,
        deviceName: d.name,
        deviceCode: d.code,
        conditionBefore: 'Hoạt động bình thường tại thời điểm mượn',
      })),
    };

    requests.unshift(newRequest);
    StorageManager.saveRequests(requests);
    return newRequest;
  },

  async approveRequest(requestId: number, approved: boolean, note: string): Promise<void> {
    try {
      await fetch(`${BASE_URL}/borrow-requests/${requestId}/approval`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminId: 1, approved, adminNote: note }),
      });
    } catch {}

    const requests = StorageManager.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (req) {
      req.status = approved ? 'APPROVED' : 'REJECTED';
      req.adminNote = note;
      req.approvedByName = 'Quản Trị Viên (Admin)';
      StorageManager.saveRequests(requests);

      if (approved) {
        const devices = StorageManager.getDevices();
        req.items.forEach(item => {
          const dev = devices.find(d => d.id === item.deviceId);
          if (dev) dev.status = 'BORROWED';
        });
        StorageManager.saveDevices(devices);
      }
    }
  },

  async confirmReturn(requestId: number, note: string, condition: string): Promise<void> {
    try {
      await fetch(`${BASE_URL}/borrow-requests/${requestId}/return`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId: 1,
          actualReturnDate: new Date().toISOString().split('T')[0],
          adminNote: note,
        }),
      });
    } catch {}

    const requests = StorageManager.getRequests();
    const req = requests.find(r => r.id === requestId);
    if (req) {
      req.status = 'RETURNED';
      req.actualReturnDate = new Date().toISOString().split('T')[0];
      req.adminNote = (req.adminNote ? req.adminNote + ' | ' : '') + 'Ghi chú trả: ' + note;
      req.items.forEach(item => {
        item.conditionAfter = condition;
      });
      StorageManager.saveRequests(requests);

      const devices = StorageManager.getDevices();
      req.items.forEach(item => {
        const dev = devices.find(d => d.id === item.deviceId);
        if (dev) {
          if (condition.includes('hỏng') || condition.includes('vỡ')) {
            dev.status = 'BROKEN';
          } else if (condition.includes('bảo trì') || condition.includes('lỗi')) {
            dev.status = 'MAINTENANCE';
          } else {
            dev.status = 'AVAILABLE';
          }
        }
      });
      StorageManager.saveDevices(devices);
    }
  },
};
