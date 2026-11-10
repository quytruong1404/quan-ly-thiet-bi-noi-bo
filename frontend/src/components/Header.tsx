'use client';

import React, { useEffect, useState } from 'react';
import { Bell, Sparkles, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    // Check backend connection on mount
    api.checkHealth().then((status) => {
      setIsLive(status);
    });

    // Re-check periodically every 10 seconds
    const interval = setInterval(() => {
      api.checkHealth().then((status) => {
        setIsLive(status);
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-3">
        {/* Dynamic Backend Status Indicator */}
        {isLive === true ? (
          <div
            title={`Đã kết nối thành công với Backend API: ${api.getBaseUrl()}`}
            className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-300 rounded-full text-xs font-semibold text-emerald-700 shadow-sm transition"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Backend Live (MySQL Connected)</span>
          </div>
        ) : (
          <div
            title={`Chưa nhận được phản hồi từ Backend (${api.getBaseUrl()}). Đang sử dụng Mock Data tự động.`}
            className="flex items-center space-x-2 px-3 py-1 bg-amber-50 border border-amber-300 rounded-full text-xs font-semibold text-amber-800 shadow-sm transition cursor-help"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
            <span>Chế độ Demo (Mock Data)</span>
          </div>
        )}

        {/* Tech Stack Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 font-medium border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Spring Boot 3 + Next.js 14</span>
        </div>

        {/* Notifications button */}
        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}
