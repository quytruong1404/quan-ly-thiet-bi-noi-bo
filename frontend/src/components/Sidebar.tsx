'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Laptop, FileText, CheckSquare, BarChart3, ShieldCheck, User } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Tổng quan Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Quản lý Thiết bị', href: '/devices', icon: Laptop },
    { label: 'Nhân viên Mượn máy', href: '/borrow', icon: FileText },
    { label: 'Admin Duyệt & Thu hồi', href: '/admin/requests', icon: CheckSquare },
    { label: 'Báo cáo & Thống kê', href: '/admin/statistics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-200 flex flex-col border-r border-slate-800 shrink-0 select-none">
      {/* Brand Logo */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-white text-base tracking-tight leading-tight">DeviceHub</h1>
          <p className="text-[11px] text-emerald-400 font-medium tracking-wide uppercase">Quản Lý Thiết Bị</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">Chức năng chính</div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">Trương Đàm Công Quý</p>
            <p className="text-[11px] text-emerald-400 truncate">Admin / Quản Trị Hệ Thống</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
