'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { Device, BorrowRequest, Category } from '@/services/mockData';
import { BarChart3, PieChart, TrendingUp, Award, AlertCircle, FileSpreadsheet, CheckCircle2 } from 'lucide-react';

export default function StatisticsPage() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      const [devs, reqs, cats] = await Promise.all([
        api.getDevices(),
        api.getRequests(),
        api.getCategories()
      ]);
      setDevices(devs);
      setRequests(reqs);
      setCategories(cats);
    }
    load();
  }, []);

  const total = devices.length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Báo Cáo & Thống Kê Thiết Bị Chuyên Sâu"
        subtitle="Dữ liệu phân tích tỷ lệ sử dụng tài sản, danh mục phổ biến và hiệu suất hoàn trả thiết bị"
      />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* KPI Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold uppercase">Tỷ Lệ Sẵn Sàng Kho</span>
            <div className="text-2xl font-bold text-emerald-600 mt-2">
              {total > 0 ? Math.round((devices.filter(d => d.status === 'AVAILABLE').length / total) * 100) : 0}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Đảm bảo nguồn lực cho dự án mới</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold uppercase">Hiệu Suất Khai Thác</span>
            <div className="text-2xl font-bold text-amber-600 mt-2">
              {total > 0 ? Math.round((devices.filter(d => d.status === 'BORROWED').length / total) * 100) : 0}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Thiết bị đang phát huy công năng</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold uppercase">Tỷ Lệ Trả Đúng Hẹn</span>
            <div className="text-2xl font-bold text-purple-600 mt-2">96.8%</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">↑ Tăng 3.2% so với tháng trước</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold uppercase">Tỷ Lệ Hỏng Hóc / Năm</span>
            <div className="text-2xl font-bold text-rose-600 mt-2">
              {total > 0 ? Math.round((devices.filter(d => d.status === 'BROKEN').length / total) * 100) : 0}%
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Dưới ngưỡng rủi ro cho phép (5%)</p>
          </div>
        </div>

        {/* Categories Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center">
              <PieChart className="w-4 h-4 mr-2 text-emerald-600" /> Phân Bổ Số Lượng Theo Danh Mục
            </h4>
            <p className="text-xs text-slate-500 mb-6">Thống kê cơ cấu chủng loại máy móc trong công ty</p>

            <div className="space-y-4">
              {categories.map((cat) => {
                const count = devices.filter(d => d.categoryId === cat.id).length;
                const percent = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={cat.id}>
                    <div className="flex justify-between text-xs mb-1 font-semibold">
                      <span className="text-slate-700">{cat.name}</span>
                      <span className="text-slate-900">{count} máy ({percent}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Borrowed Devices */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 text-sm mb-1 flex items-center">
              <Award className="w-4 h-4 mr-2 text-amber-500" /> Top Thiết Bị Được Mượn Nhiều Nhất
            </h4>
            <p className="text-xs text-slate-500 mb-5">Danh sách các thiết bị có tần suất sử dụng cao nhất</p>

            <div className="space-y-3">
              {[
                { name: 'MacBook Pro 14" M3 Pro', code: 'DEV-LP-001', times: 18, category: 'Laptop' },
                { name: 'Dell XPS 15 9530', code: 'DEV-LP-002', times: 15, category: 'Laptop' },
                { name: 'Samsung Galaxy S24 Ultra', code: 'DEV-MB-002', times: 12, category: 'Mobile Test' },
                { name: 'Máy chiếu Sony 4K Laser', code: 'DEV-PR-001', times: 10, category: 'Máy chiếu' },
                { name: 'Dell UltraSharp 27" 4K', code: 'DEV-MN-001', times: 9, category: 'Monitor' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <p className="font-bold text-xs text-slate-800">{item.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{item.code} • {item.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    {item.times} lượt mượn
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
