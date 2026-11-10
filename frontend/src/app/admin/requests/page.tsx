'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { api } from '@/services/api';
import { BorrowRequest, RequestStatus } from '@/services/mockData';
import { Check, X, RotateCcw, Clock, ShieldCheck, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<BorrowRequest[]>([]);
  const [tab, setTab] = useState<'PENDING' | 'APPROVED' | 'HISTORY'>('PENDING');
  const [loading, setLoading] = useState(true);

  // Approval Modal
  const [approvalModal, setApprovalModal] = useState<{ open: boolean; request?: BorrowRequest; isApprove: boolean }>({
    open: false,
    isApprove: true,
  });
  const [adminNote, setAdminNote] = useState('');

  // Return Confirm Modal
  const [returnModal, setReturnModal] = useState<{ open: boolean; request?: BorrowRequest }>({ open: false });
  const [returnCondition, setReturnCondition] = useState('Bình thường, hoạt động tốt, nguyên vẹn');
  const [returnNote, setReturnNote] = useState('');

  const loadRequests = async () => {
    setLoading(true);
    const data = await api.getRequests();
    setRequests(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleApproveOrReject = async () => {
    if (!approvalModal.request) return;
    await api.approveRequest(approvalModal.request.id, approvalModal.isApprove, adminNote);
    setApprovalModal({ open: false, isApprove: true });
    setAdminNote('');
    await loadRequests();
  };

  const handleConfirmReturn = async () => {
    if (!returnModal.request) return;
    await api.confirmReturn(returnModal.request.id, returnNote, returnCondition);
    setReturnModal({ open: false });
    setReturnNote('');
    setReturnCondition('Bình thường, hoạt động tốt, nguyên vẹn');
    await loadRequests();
  };

  const pendingList = requests.filter(r => r.status === 'PENDING');
  const activeList = requests.filter(r => r.status === 'APPROVED');
  const historyList = requests.filter(r => r.status === 'RETURNED' || r.status === 'REJECTED');

  const currentList = tab === 'PENDING' ? pendingList : tab === 'APPROVED' ? activeList : historyList;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      <Header
        title="Admin: Phê Duyệt Phiếu & Xác Nhận Hoàn Trả"
        subtitle="Quản lý việc xuất kho thiết bị, thẩm định lý do và kiểm tra tình trạng máy móc khi nhân viên hoàn trả"
      />

      <main className="flex-1 overflow-y-auto p-8 space-y-6">
        {/* Tabs Bar */}
        <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
          <button
            onClick={() => setTab('PENDING')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              tab === 'PENDING'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Chờ Phê Duyệt</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab === 'PENDING' ? 'bg-purple-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {pendingList.length}
            </span>
          </button>

          <button
            onClick={() => setTab('APPROVED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              tab === 'APPROVED'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Đang Cho Mượn (Chờ Trả)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${tab === 'APPROVED' ? 'bg-amber-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
              {activeList.length}
            </span>
          </button>

          <button
            onClick={() => setTab('HISTORY')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
              tab === 'HISTORY'
                ? 'bg-slate-800 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>Lịch Sử Hoàn Tất & Từ Chối</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">
              {historyList.length}
            </span>
          </button>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {currentList.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-200">
              <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="font-bold text-slate-700 text-sm">Không có phiếu mượn nào trong mục này</h4>
              <p className="text-xs text-slate-400 mt-1">Hệ thống đã cập nhật trạng thái mới nhất</p>
            </div>
          ) : (
            currentList.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      {req.code}
                    </span>
                    <span className="text-xs font-bold text-slate-800">{req.userName}</span>
                    <span className="text-xs text-slate-500">({req.department})</span>

                    {/* Status badge */}
                    {req.status === 'PENDING' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[11px] font-bold">
                        Chờ Phê Duyệt
                      </span>
                    )}
                    {req.status === 'APPROVED' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                        Đang Mượn
                      </span>
                    )}
                    {req.status === 'RETURNED' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                        Đã Thu Hồi Xong
                      </span>
                    )}
                    {req.status === 'REJECTED' && (
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                        Đã Từ Chối
                      </span>
                    )}
                  </div>

                  {/* Devices List */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-slate-500 font-medium">Thiết bị mượn:</span>
                    {req.items.map((it) => (
                      <span
                        key={it.id}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold"
                      >
                        {it.deviceName} ({it.deviceCode})
                      </span>
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-semibold text-slate-700">Lý do: </span> {req.reason}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span>
                      📅 Thời gian: <strong className="text-slate-700">{req.borrowDate}</strong> → <strong className="text-slate-700">{req.expectedReturnDate}</strong>
                    </span>
                    {req.actualReturnDate && (
                      <span className="text-emerald-700 font-medium">
                        ✅ Ngày trả thực tế: {req.actualReturnDate}
                      </span>
                    )}
                    {req.adminNote && (
                      <span className="text-slate-600 italic">
                        💬 Admin note: {req.adminNote}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-2 shrink-0 w-full lg:w-auto justify-end border-t lg:border-t-0 pt-4 lg:pt-0">
                  {req.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => {
                          setApprovalModal({ open: true, request: req, isApprove: false });
                          setAdminNote('Không đủ thiết bị hoặc lý do chưa phù hợp');
                        }}
                        className="px-4 py-2 border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                      >
                        <X className="w-4 h-4" />
                        <span>Từ Chối</span>
                      </button>

                      <button
                        onClick={() => {
                          setApprovalModal({ open: true, request: req, isApprove: true });
                          setAdminNote('Đồng ý cấp thiết bị theo đề xuất');
                        }}
                        className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition flex items-center space-x-1"
                      >
                        <Check className="w-4 h-4" />
                        <span>Duyệt Phiếu</span>
                      </button>
                    </>
                  )}

                  {req.status === 'APPROVED' && (
                    <button
                      onClick={() => {
                        setReturnModal({ open: true, request: req });
                        setReturnNote('Đã nhận lại đủ phụ kiện');
                      }}
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/30 transition flex items-center space-x-1"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Xác Nhận Hoàn Trả</span>
                    </button>
                  )}

                  {req.status === 'RETURNED' && (
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      Đã Nhập Lại Kho
                    </span>
                  )}
                  {req.status === 'REJECTED' && (
                    <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1.5 rounded-lg border border-rose-200">
                      Phiếu Đã Hủy
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Approval Modal */}
      {approvalModal.open && approvalModal.request && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-base text-slate-800">
              {approvalModal.isApprove ? 'Xác Nhận Phê Duyệt Phiếu Mượn' : 'Từ Chối Phiếu Mượn'}
            </h3>
            <p className="text-xs text-slate-500">
              Mã phiếu: <strong>{approvalModal.request.code}</strong> - Người mượn: <strong>{approvalModal.request.userName}</strong>
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú của Admin</label>
              <textarea
                rows={3}
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setApprovalModal({ open: false, isApprove: true })}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-medium"
              >
                Đóng
              </button>
              <button
                onClick={handleApproveOrReject}
                className={`px-5 py-2 text-white rounded-lg text-xs font-bold shadow-md ${
                  approvalModal.isApprove ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {approvalModal.isApprove ? 'Xác Nhận Duyệt' : 'Xác Nhận Từ Chối'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Confirm Modal */}
      {returnModal.open && returnModal.request && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-base text-slate-800">Xác Nhận Hoàn Trả Thiết Bị Vào Kho</h3>
            <p className="text-xs text-slate-500">
              Mã phiếu: <strong>{returnModal.request.code}</strong> ({returnModal.request.items.map(i => i.deviceName).join(', ')})
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Hiện trạng thiết bị sau khi nhận lại (*)</label>
              <select
                value={returnCondition}
                onChange={(e) => setReturnCondition(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
              >
                <option value="Bình thường, hoạt động tốt, nguyên vẹn">Tốt - Nguyên vẹn, hoạt động hoàn hảo (Vào Kho Sẵn Sàng)</option>
                <option value="Có dấu hiệu lỗi nhẹ, cần bảo trì kiểm tra">Cần bảo trì - Đưa vào trạng thái Bảo Trì (Maintenance)</option>
                <option value="Hỏng hóc, nứt vỡ, không lên nguồn">Hỏng - Đưa vào danh sách Hỏng Hóc (Broken)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi chú kiểm tra của Admin</label>
              <textarea
                rows={2}
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                placeholder="VD: Kiểm tra đủ sạc cáp, không trầy xước màn hình..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setReturnModal({ open: false })}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 text-xs font-medium"
              >
                Hủy Bỏ
              </button>
              <button
                onClick={handleConfirmReturn}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-md shadow-amber-600/30"
              >
                Xác Nhận Đã Nhập Kho
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
