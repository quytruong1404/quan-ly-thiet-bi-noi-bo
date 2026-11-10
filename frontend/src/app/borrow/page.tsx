'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { Device, BorrowRequest } from '@/services/mockData';
import { Calendar, Laptop, CheckCircle, Clock, AlertCircle, Send, Check } from 'lucide-react';

export default function BorrowPage() {
  const [availableDevices, setAvailableDevices] = useState<Device[]>([]);
  const [myRequests, setMyRequests] = useState<BorrowRequest[]>([]);
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<number[]>([]);
  const [borrowDate, setBorrowDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [expectedReturnDate, setExpectedReturnDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split('T')[0];
  });
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadData() {
      const [devs, reqs] = await Promise.all([api.getDevices(), api.getRequests()]);
      setAvailableDevices(devs.filter(d => d.status === 'AVAILABLE'));
      setMyRequests(reqs.filter(r => r.userId === 2)); // Trương Đàm Công Quý
    }
    loadData();
  }, [submitted]);

  const toggleSelectDevice = (id: number) => {
    if (selectedDeviceIds.includes(id)) {
      setSelectedDeviceIds(selectedDeviceIds.filter(dId => dId !== id));
    } else {
      setSelectedDeviceIds([...selectedDeviceIds, id]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDeviceIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thiết bị để mượn!');
      return;
    }
    if (!reason.trim()) {
      alert('Vui lòng nhập lý do mượn thiết bị!');
      return;
    }

    await api.createBorrowRequest({
      userId: 2,
      userName: 'Trương Đàm Công Quý',
      department: 'Phòng Phát Triển Phần Mềm',
      borrowDate,
      expectedReturnDate,
      reason,
      deviceIds: selectedDeviceIds,
    });

    setSubmitted(true);
    setSelectedDeviceIds([]);
    setReason('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Dành Cho Nhân Viên: Tạo Phiếu Mượn Thiết Bị"
        subtitle="Chọn thiết bị từ kho, đăng ký thời gian mượn và theo dõi trạng thái phê duyệt từ Admin"
      />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {submitted && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl flex items-center space-x-3 shadow-sm animate-fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">Yêu cầu mượn thiết bị đã được gửi thành công!</p>
              <p className="text-[11px] text-emerald-700">Phiếu đang ở trạng thái Chờ Duyệt (PENDING) và đã được chuyển tới Quản trị viên.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Form Create Request */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-sm mb-1 flex items-center">
                <Send className="w-4 h-4 mr-2 text-emerald-600" /> Tạo Phiếu Mượn Mới
              </h3>
              <p className="text-xs text-slate-500 mb-5">Điền thông tin chi tiết để gửi cấp quản lý xem xét</p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* User Info (Readonly) */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Nhân viên yêu cầu:</span>
                    <span className="font-bold text-slate-800">Trương Đàm Công Quý</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phòng ban:</span>
                    <span className="text-slate-700">Phòng Phát Triển Phần Mềm</span>
                  </div>
                </div>

                {/* Date range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ngày Bắt Đầu Mượn (*)</label>
                    <input
                      type="date"
                      required
                      value={borrowDate}
                      onChange={(e) => setBorrowDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Ngày Hẹn Trả (*)</label>
                    <input
                      type="date"
                      required
                      value={expectedReturnDate}
                      onChange={(e) => setExpectedReturnDate(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mục Đích / Lý Do Mượn (*)</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="VD: Cần mượn Laptop để đi công tác Onsite tại chi nhánh Đà Nẵng trong 1 tuần..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Selected devices count */}
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <span className="text-emerald-900 font-semibold">Đã chọn ({selectedDeviceIds.length} thiết bị):</span>
                  <span className="text-emerald-700 text-[11px] font-medium">Chọn ở danh sách bên phải</span>
                </div>

                <button
                  type="submit"
                  disabled={selectedDeviceIds.length === 0}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold shadow-md transition flex items-center justify-center space-x-2 ${
                    selectedDeviceIds.length > 0
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Phiếu Mượn Cho Admin</span>
                </button>
              </form>
            </div>
          </div>

          {/* Device Selection Picker */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Kho Thiết Bị Khả Dụng (Sẵn Sàng)</h3>
                <p className="text-xs text-slate-500">Tích chọn các thiết bị bạn muốn đăng ký mượn</p>
              </div>
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-xs">
                {availableDevices.length} máy trong kho
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[480px] space-y-2.5 pr-1">
              {availableDevices.map((dev) => {
                const isSelected = selectedDeviceIds.includes(dev.id);
                return (
                  <div
                    key={dev.id}
                    onClick={() => toggleSelectDevice(dev.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                        <img src={dev.imageUrl} alt={dev.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {dev.code}
                          </span>
                          <span className="text-[11px] text-slate-500">{dev.brand}</span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-800 truncate mt-0.5">{dev.name}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{dev.specifications}</p>
                      </div>
                    </div>

                    <div className="shrink-0 ml-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                          isSelected ? 'bg-emerald-600 text-white' : 'border border-slate-300 text-transparent'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* My Request History Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200">
            <h4 className="font-bold text-slate-800 text-sm">Lịch Sử Phiếu Mượn Của Tôi</h4>
            <p className="text-xs text-slate-500">Theo dõi tiến độ phê duyệt và tình trạng hoàn trả</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Mã Phiếu</th>
                  <th className="px-5 py-3">Thời Gian Mượn</th>
                  <th className="px-5 py-3">Thiết Bị</th>
                  <th className="px-5 py-3">Lý Do Mượn</th>
                  <th className="px-5 py-3">Trạng Thái</th>
                  <th className="px-5 py-3">Ghi Chú Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {myRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-3 font-semibold text-slate-900">{req.code}</td>
                    <td className="px-5 py-3 text-slate-500">
                      {req.borrowDate} → {req.expectedReturnDate}
                    </td>
                    <td className="px-5 py-3">
                      {req.items.map(it => (
                        <span key={it.id} className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[11px] mr-1 text-slate-800">
                          {it.deviceName}
                        </span>
                      ))}
                    </td>
                    <td className="px-5 py-3 text-slate-600 max-w-xs truncate">{req.reason}</td>
                    <td className="px-5 py-3">
                      {req.status === 'PENDING' && (
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-bold text-[11px]">
                          Chờ Duyệt
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-[11px]">
                          Đang Mượn
                        </span>
                      )}
                      {req.status === 'RETURNED' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-[11px]">
                          Đã Hoàn Trả
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-bold text-[11px]">
                          Bị Từ Chối
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500 italic">{req.adminNote || 'Chưa có ghi chú'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
