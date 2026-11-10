'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { Device, Category, DeviceStatus } from '@/services/mockData';
import { Search, Plus, Filter, Laptop, MapPin, Tag, Wrench, X, Check } from 'lucide-react';
import Link from 'next/link';

export default function DevicesPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<DeviceStatus | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [newDev, setNewDev] = useState({
    code: '',
    name: '',
    categoryId: 1,
    serialNumber: '',
    brand: '',
    specifications: '',
    status: 'AVAILABLE' as DeviceStatus,
    location: 'Kho thiết bị Tầng 2',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
    purchaseDate: '2024-05-01',
  });

  useEffect(() => {
    async function loadData() {
      const [devList, catList] = await Promise.all([
        api.getDevices(),
        api.getCategories()
      ]);
      setDevices(devList);
      setCategories(catList);
      setLoading(false);
    }
    loadData();
  }, []);

  const handleAddDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDev.name || !newDev.code) {
      alert('Vui lòng điền mã và tên thiết bị!');
      return;
    }

    const cat = categories.find(c => c.id === Number(newDev.categoryId));
    const created = await api.addDevice({
      ...newDev,
      categoryId: Number(newDev.categoryId),
      categoryName: cat?.name || 'Khác',
    });

    setDevices([created, ...devices]);
    setIsModalOpen(false);
    setNewDev({
      code: '',
      name: '',
      categoryId: 1,
      serialNumber: '',
      brand: '',
      specifications: '',
      status: 'AVAILABLE',
      location: 'Kho thiết bị Tầng 2',
      imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500',
      purchaseDate: '2024-05-01',
    });
  };

  const handleStatusChange = async (deviceId: number, newStatus: DeviceStatus) => {
    await api.updateDeviceStatus(deviceId, newStatus);
    setDevices(devices.map(d => d.id === deviceId ? { ...d, status: newStatus } : d));
  };

  const filteredDevices = devices.filter(dev => {
    const matchSearch =
      dev.name.toLowerCase().includes(search.toLowerCase()) ||
      dev.code.toLowerCase().includes(search.toLowerCase()) ||
      dev.brand.toLowerCase().includes(search.toLowerCase());

    const matchCategory = selectedCategory === 'ALL' || dev.categoryId === selectedCategory;
    const matchStatus = selectedStatus === 'ALL' || dev.status === selectedStatus;

    return matchSearch && matchCategory && matchStatus;
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Quản Lý Danh Mục & Thiết Bị"
        subtitle="Quản lý toàn diện vòng đời, hiện trạng và phân loại trang thiết bị trong công ty"
      />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Filter & Action Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Tìm theo tên thiết bị, mã máy, thương hiệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3 overflow-x-auto">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as DeviceStatus | 'ALL')}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="AVAILABLE">Sẵn sàng (Available)</option>
              <option value="BORROWED">Đang mượn (Borrowed)</option>
              <option value="MAINTENANCE">Bảo trì (Maintenance)</option>
              <option value="BROKEN">Hỏng hóc (Broken)</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-700"
            >
              <option value="ALL">Tất cả danh mục</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Add Device Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Thiết Bị</span>
            </button>
          </div>
        </div>

        {/* Device Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredDevices.map((dev) => (
            <div
              key={dev.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col group"
            >
              {/* Image banner */}
              <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                <img
                  src={dev.imageUrl || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500'}
                  alt={dev.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {/* Status Badge */}
                <div className="absolute top-2.5 right-2.5">
                  {dev.status === 'AVAILABLE' && (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-[10px] shadow">
                      SẴN SÀNG
                    </span>
                  )}
                  {dev.status === 'BORROWED' && (
                    <span className="px-2.5 py-1 rounded-full bg-amber-500 text-white font-bold text-[10px] shadow">
                      ĐANG MƯỢN
                    </span>
                  )}
                  {dev.status === 'MAINTENANCE' && (
                    <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white font-bold text-[10px] shadow">
                      BẢO TRÌ
                    </span>
                  )}
                  {dev.status === 'BROKEN' && (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-bold text-[10px] shadow">
                      HỎNG HÓC
                    </span>
                  )}
                </div>

                <div className="absolute bottom-2.5 left-2.5 bg-slate-900/80 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 font-semibold">
                  {dev.code}
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mb-1">
                    <Tag className="w-3 h-3 text-emerald-600" />
                    <span>{dev.brand}</span>
                    <span>•</span>
                    <span className="truncate">{dev.categoryName || 'Thiết bị'}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-emerald-600 transition">
                    {dev.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {dev.specifications}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1 text-slate-400" /> Vị trí:
                    </span>
                    <span className="font-medium text-slate-700">{dev.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Serial:</span>
                    <span className="font-mono text-slate-600">{dev.serialNumber}</span>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-2 flex items-center justify-between gap-2">
                  <select
                    value={dev.status}
                    onChange={(e) => handleStatusChange(dev.id, e.target.value as DeviceStatus)}
                    className="text-[11px] border border-slate-200 rounded px-2 py-1 bg-slate-50 text-slate-700 font-medium focus:outline-none"
                  >
                    <option value="AVAILABLE">Sẵn sàng</option>
                    <option value="BORROWED">Đang mượn</option>
                    <option value="MAINTENANCE">Bảo trì</option>
                    <option value="BROKEN">Hỏng</option>
                  </select>

                  {dev.status === 'AVAILABLE' ? (
                    <Link
                      href={`/borrow?deviceId=${dev.id}`}
                      className="px-3 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold transition"
                    >
                      Mượn máy
                    </Link>
                  ) : (
                    <span className="text-[11px] text-slate-400 italic">Không thể mượn</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add Device Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-bold text-base text-slate-800">Thêm Thiết Bị Mới Vào Kho</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddDevice} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã Thiết Bị (*)</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: DEV-LP-004"
                    value={newDev.code}
                    onChange={(e) => setNewDev({ ...newDev, code: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Danh Mục (*)</label>
                  <select
                    value={newDev.categoryId}
                    onChange={(e) => setNewDev({ ...newDev, categoryId: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên Thiết Bị (*)</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Dell Inspiron 16 5630"
                  value={newDev.name}
                  onChange={(e) => setNewDev({ ...newDev, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Thương Hiệu</label>
                  <input
                    type="text"
                    placeholder="VD: Dell, Apple, Lenovo"
                    value={newDev.brand}
                    onChange={(e) => setNewDev({ ...newDev, brand: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số Serial</label>
                  <input
                    type="text"
                    placeholder="VD: SN-DELL-9921"
                    value={newDev.serialNumber}
                    onChange={(e) => setNewDev({ ...newDev, serialNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Thông Số Kỹ Thuật Chi Tiết</label>
                <textarea
                  rows={2}
                  placeholder="VD: CPU Core i5-1335U, 16GB RAM, 512GB SSD..."
                  value={newDev.specifications}
                  onChange={(e) => setNewDev({ ...newDev, specifications: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Vị Trí Lưu Kho</label>
                  <input
                    type="text"
                    value={newDev.location}
                    onChange={(e) => setNewDev({ ...newDev, location: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Trạng Thái Ban Đầu</label>
                  <select
                    value={newDev.status}
                    onChange={(e) => setNewDev({ ...newDev, status: e.target.value as DeviceStatus })}
                    className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                  >
                    <option value="AVAILABLE">Sẵn sàng (Available)</option>
                    <option value="MAINTENANCE">Bảo trì (Maintenance)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Link Ảnh Minh Họa</label>
                <input
                  type="url"
                  value={newDev.imageUrl}
                  onChange={(e) => setNewDev({ ...newDev, imageUrl: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-md shadow-emerald-600/20"
                >
                  Lưu Thiết Bị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
