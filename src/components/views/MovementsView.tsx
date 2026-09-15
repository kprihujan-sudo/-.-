import React, { useState } from 'react';
import {
  ArrowLeftRight,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Building,
  User,
  FileText,
  Search,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BorrowRecord } from '../../types';
import { formatThaiDate } from '../../utils/thaiFiscal';
import { EditBorrowModal } from '../modals/EditBorrowModal';

export const MovementsView: React.FC = () => {
  const { borrowRecords, addBorrowRecord, returnAsset, assets, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<BorrowRecord | null>(null);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState<number>(assets[0]?.id || 0);
  const [borrowerName, setBorrowerName] = useState<string>('นางสมศรี รักงาน');
  const [department, setDepartment] = useState<string>('กลุ่มงานเวชปฏิบัติครอบครัว');
  const [purpose, setPurpose] = useState<string>('ออกหน่วยบริการตรวจคัดกรองสุขภาพเชิงรุก ต.บ้านใหม่');
  const [borrowDate, setBorrowDate] = useState<string>('2025-03-01');
  const [dueDate, setDueDate] = useState<string>('2025-03-10');

  const handleCreateBorrow = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === Number(selectedAssetId));
    if (!asset) {
      alert('กรุณาเลือกครุภัณฑ์');
      return;
    }

    addBorrowRecord({
      assetId: asset.id,
      assetNo: asset.assetNo,
      assetName: asset.assetName,
      borrowerName,
      department,
      purpose,
      borrowDate,
      dueDate,
    });

    setIsModalOpen(false);
    alert(`สร้างใบยืมครุภัณฑ์สำหรับ ${asset.assetName} สำเร็จ`);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>ระบบการยืม–คืน &amp; เคลื่อนย้ายครุภัณฑ์</span>
            <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
              แบบฟอร์ม ยม.
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกการขอยืมใช้งานภายนอกหน่วยงาน ติดตามกำหนดคืน และแจ้งเตือนเมื่อเกินกำหนด
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ สร้างใบยืมครุภัณฑ์</span>
        </button>
      </div>

      {/* Borrow Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                <th className="p-3">เลขที่ใบยืม</th>
                <th className="p-3">ครุภัณฑ์ที่ยืม</th>
                <th className="p-3">ผู้ยืม / แผนก</th>
                <th className="p-3">วัตถุประสงค์</th>
                <th className="p-3">วันที่ยืม</th>
                <th className="p-3">กำหนดคืน</th>
                <th className="p-3 text-center">สถานะ</th>
                <th className="p-3 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {borrowRecords.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-blue-900">{item.docNo}</td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-900">{item.assetName}</div>
                    <div className="font-mono text-[10px] text-slate-400">{item.assetNo}</div>
                  </td>
                  <td className="p-3">
                    <div className="font-medium text-slate-800">{item.borrowerName}</div>
                    <div className="text-[11px] text-slate-400">{item.department}</div>
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs truncate">{item.purpose}</td>
                  <td className="p-3 text-slate-600">{formatThaiDate(item.borrowDate)}</td>
                  <td className="p-3 font-semibold text-slate-900">{formatThaiDate(item.dueDate)}</td>
                  <td className="p-3 text-center">
                    {item.status === 'OVERDUE' ? (
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> เกินกำหนด
                      </span>
                    ) : item.status === 'RETURNED' ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                        คืนแล้ว
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                        กำลังยืม
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.status !== 'RETURNED' && (
                        <button
                          onClick={() => returnAsset(item.id)}
                          className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-semibold transition-colors"
                        >
                          รับคืนพัสดุ
                        </button>
                      )}
                      <button
                        onClick={() => setEditingRecord(item)}
                        className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg inline-flex items-center gap-1 font-semibold transition-colors"
                        title="แก้ไขใบยืม"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>แก้ไข</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create Borrow Slip */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
              สร้างใบยืมครุภัณฑ์ (ยม.2568)
            </h2>

            <form onSubmit={handleCreateBorrow} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">เลือกครุภัณฑ์ *</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assetNo} - {a.assetName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ชื่อผู้ยืม *</label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">หน่วยงาน / กลุ่มงานผู้ยืม *</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">วัตถุประสงค์การนำไปใช้ *</label>
                <input
                  type="text"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">วันที่ยืม *</label>
                  <input
                    type="date"
                    value={borrowDate}
                    onChange={(e) => setBorrowDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">กำหนดคืน *</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-semibold"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 text-white rounded-xl font-semibold"
                >
                  บันทึกใบยืม
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Borrow Modal */}
      {editingRecord && (
        <EditBorrowModal
          record={editingRecord}
          onClose={() => setEditingRecord(null)}
        />
      )}
    </div>
  );
};
