'use client';

import React from 'react';
import { Bell, Sparkles, Server } from 'lucide-react';

export default function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-slate-800">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {/* API Status badge */}
        <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-xs font-medium text-emerald-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <Server className="w-3.5 h-3.5" />
          <span>Spring Boot REST API</span>
        </div>

        {/* Tech Stack Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs text-slate-600 font-medium border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Spring Boot 3 + Next.js + MySQL</span>
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
