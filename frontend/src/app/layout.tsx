import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Lý Thiết Bị Nội Bộ',
  description: 'Hệ thống Quản lý Thiết bị Nội bộ - Spring Boot, Next.js, MySQL',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="flex h-screen overflow-hidden bg-slate-50 antialiased">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}
