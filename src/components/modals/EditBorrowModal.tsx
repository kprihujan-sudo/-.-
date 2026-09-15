import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2, ArrowLeftRight, Calendar, User, Building } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BorrowRecord } from '../../types';

interface EditBorrowModalProps {
  record: BorrowRecord | null;
  onClose: () => void;
}

export const EditBorrowModal: React.FC<EditBorrowModalProps> = ({ record, onClose }) => {
  const { updateBorrowRecord } = useApp();
  const [formData, setFormData] = useState<Partial<BorrowRecord>>({});
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (record) {
      setFormData({ ...record });
      setSaved(false);
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.borrowerName?.trim()) {
      alert('กรุณาระบุชื่อผู้ยืม');
      return;
    }

    updateBorrowRecord(record.id, {
      ...formData,
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto text-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                {record.docNo}
              </span>
              <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                แก้ไขใบยืมครุภัณฑ์ (ยม.)
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              ครุภัณฑ์: {record.assetName} ({record.assetNo})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>บันทึกการแก้ไขใบยืมครุภัณฑ์เรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                สถานะการยืม–คืน
              </label>
              <select
                value={formData.status || 'BORROWED'}
                onChange={(e) => {
                  const status = e.target.value as 'BORROWED' | 'RETURNED' | 'OVERDUE';
                  const returnDate = status === 'RETURNED' ? (formData.returnDate || new Date().toISOString().slice(0, 10)) : undefined;
                  setFormData({
                    ...formData,
                    status,
                    returnDate,
                  });
                }}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
              >
                <option value="BORROWED">🔵 อยู่ระหว่างการยืม (Borrowed)</option>
                <option value="OVERDUE">🔴 เกินกำหนดส่งคืน (Overdue)</option>
                <option value="RETURNED">🟢 ส่งคืนเรียบร้อยแล้ว (Returned)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ชื่อผู้ยืม <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.borrowerName || ''}
                onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                หน่วยงาน / กลุ่มงานผู้ยืม
              </label>
              <input
                type="text"
                value={formData.department || ''}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                วัตถุประสงค์การนำไปใช้
              </label>
              <textarea
                rows={2}
                value={formData.purpose || ''}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  วันที่ยืม
                </label>
                <input
                  type="date"
                  value={formData.borrowDate || ''}
                  onChange={(e) => setFormData({ ...formData, borrowDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  กำหนดส่งคืน
                </label>
                <input
                  type="date"
                  value={formData.dueDate || ''}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
                />
              </div>
            </div>

            {formData.status === 'RETURNED' && (
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  วันที่รับคืนจริง
                </label>
                <input
                  type="date"
                  value={formData.returnDate || ''}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full bg-emerald-50 border border-emerald-300 rounded-xl p-2.5 text-emerald-900 font-bold"
                />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการแก้ไข</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
