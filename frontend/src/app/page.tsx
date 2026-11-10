'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { Device, BorrowRequest } from '@/services/mockData';
import { Laptop, CheckCircle2, Clock, AlertTriangle, ArrowUpRight, Plus, ShieldCheck, Calendar, UserCheck } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      const [devList, reqList] = await Promise.all([
        api.getDevices(),
        api.getRequests()
      ]);
      setDevices(devList);
      setRequests(reqList);
      setLoading(false);
    }
    loadData();
  }, []);

  const totalDevices = devices.length;
  const availableDevices = devices.filter(d => d.status === 'AVAILABLE').length;
  const borrowedDevices = devices.filter(d => d.status === 'BORROWED').length;
  const maintenanceDevices = devices.filter(d => d.status === 'MAINTENANCE' || d.status === 'BROKEN').length;
  const pendingRequests = requests.filter(r => r.status === 'PENDING').length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Bảng Điều Khiển Tổng Quan (Dashboard)"
        subtitle="Theo dõi chỉ số thiết bị nội bộ, duyệt phiếu mượn và tỷ lệ sử dụng tài sản công ty"
      />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Tổng thiết bị */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tổng Thiết Bị</span>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Laptop className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-800">{loading ? '...' : totalDevices}</span>
              <span className="text-xs text-slate-500">100% tài sản</span>
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-blue-500 h-1.5 rounded-full w-full"></div>
            </div>
          </div>

          {/* Card 2: Sẵn sàng mượn */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sẵn Sàng</span>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-emerald-600">{loading ? '...' : availableDevices}</span>
              <span className="text-xs text-emerald-600 font-medium">Trong kho</span>
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-emerald-500 h-1.5 rounded-full"
                style={{ width: `${totalDevices > 0 ? (availableDevices / totalDevices) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Card 3: Đang được mượn */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đang Cho Mượn</span>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-amber-600">{loading ? '...' : borrowedDevices}</span>
              <span className="text-xs text-amber-600 font-medium">Đang sử dụng</span>
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-1.5 rounded-full"
                style={{ width: `${totalDevices > 0 ? (borrowedDevices / totalDevices) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Card 4: Bảo trì / Hỏng */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Bảo Trì / Hỏng</span>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-rose-600">{loading ? '...' : maintenanceDevices}</span>
              <span className="text-xs text-rose-500">Cần xử lý</span>
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-rose-500 h-1.5 rounded-full"
                style={{ width: `${totalDevices > 0 ? (maintenanceDevices / totalDevices) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* Card 5: Chờ duyệt */}
          <div className="bg-white p-5 rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50/50 to-white shadow-sm hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider">Phiếu Chờ Duyệt</span>
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg animate-pulse">
                <UserCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-purple-700">{loading ? '...' : pendingRequests}</span>
              <Link href="/admin/requests" className="text-xs text-purple-700 font-semibold hover:underline flex items-center">
                Duyệt ngay <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>
            <div className="mt-3 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-purple-600 h-1.5 rounded-full w-2/3"></div>
            </div>
          </div>
        </div>

        {/* Action Banner */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                Phiên bản 1.0 Live
              </span>
              <h3 className="text-lg font-bold">Hệ thống Quản lý Thiết bị Doanh nghiệp</h3>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl">
              Hỗ trợ quản lý danh mục thiết bị, nhân viên tạo phiếu mượn online, Admin xét duyệt phiếu và xác nhận tình trạng khi hoàn trả.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              href="/borrow"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Yêu Cầu Mượn</span>
            </Link>
            <Link
              href="/admin/requests"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Duyệt Phiếu ({pendingRequests})</span>
            </Link>
          </div>
        </div>

        {/* Charts & Status Breakdown Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Monthly Borrow Trends Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Xu Hướng Mượn Thiết Bị Theo Tháng</h4>
                <p className="text-xs text-slate-500">Số lượng phiếu mượn qua các tháng gần đây</p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">Năm 2024</span>
            </div>

            <div className="h-48 flex items-end justify-between gap-4 pt-6 px-4">
              {[
                { month: 'Tháng 1', count: 12, height: '40%' },
                { month: 'Tháng 2', count: 18, height: '55%' },
                { month: 'Tháng 3', count: 26, height: '80%' },
                { month: 'Tháng 4', count: 22, height: '70%' },
                { month: 'Tháng 5', count: 31, height: '95%' },
                { month: 'Tháng 6', count: 28, height: '85%' },
              ].map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[11px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition">
                    {item.count} phiếu
                  </span>
                  <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end h-32 overflow-hidden">
                    <div
                      className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-500 group-hover:from-emerald-500 group-hover:to-teal-300"
                      style={{ height: item.height }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Device Status Breakdown */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-1">Cơ Cấu Trạng Thái Thiết Bị</h4>
            <p className="text-xs text-slate-500 mb-6">Tỷ lệ phân bổ trạng thái trên toàn hệ thống</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-600 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span> Sẵn sàng trong kho
                  </span>
                  <span className="text-slate-800 font-bold">{availableDevices} máy</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${totalDevices > 0 ? (availableDevices / totalDevices) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-600 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 mr-2"></span> Đang cho nhân viên mượn
                  </span>
                  <span className="text-slate-800 font-bold">{borrowedDevices} máy</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{ width: `${totalDevices > 0 ? (borrowedDevices / totalDevices) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-600 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 mr-2"></span> Đang bảo trì kỹ thuật
                  </span>
                  <span className="text-slate-800 font-bold">{devices.filter(d => d.status === 'MAINTENANCE').length} máy</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5 font-medium">
                  <span className="text-slate-600 flex items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 mr-2"></span> Hỏng hóc / Chờ thanh lý
                  </span>
                  <span className="text-slate-800 font-bold">{devices.filter(d => d.status === 'BROKEN').length} máy</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Requests Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Phiếu Yêu Cầu Mượn Gần Đây</h4>
              <p className="text-xs text-slate-500">Các yêu cầu mới nhất từ nhân viên các phòng ban</p>
            </div>
            <Link
              href="/admin/requests"
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
            >
              Xem tất cả <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3.5">Mã Phiếu</th>
                  <th className="px-5 py-3.5">Người Mượn</th>
                  <th className="px-5 py-3.5">Phòng Ban</th>
                  <th className="px-5 py-3.5">Thiết Bị Mượn</th>
                  <th className="px-5 py-3.5">Thời Gian Mượn</th>
                  <th className="px-5 py-3.5">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {requests.slice(0, 5).map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-3 font-semibold text-slate-900">{req.code}</td>
                    <td className="px-5 py-3 font-medium">{req.userName}</td>
                    <td className="px-5 py-3 text-slate-500">{req.department}</td>
                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        {req.items.map((it) => (
                          <span key={it.id} className="inline-block px-2 py-0.5 bg-slate-100 rounded text-[11px] mr-1 text-slate-800">
                            {it.deviceName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-500">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {req.borrowDate} → {req.expectedReturnDate}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      {req.status === 'PENDING' && (
                        <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold text-[11px]">
                          Chờ Duyệt
                        </span>
                      )}
                      {req.status === 'APPROVED' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold text-[11px]">
                          Đang Mượn
                        </span>
                      )}
                      {req.status === 'RETURNED' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold text-[11px]">
                          Đã Hoàn Trả
                        </span>
                      )}
                      {req.status === 'REJECTED' && (
                        <span className="px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 font-semibold text-[11px]">
                          Bị Từ Chối
                        </span>
                      )}
                    </td>
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
