import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2, Trash2, Calendar, User, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DisposalRecord, DisposalMethod } from '../../types';

interface EditDisposalModalProps {
  record: DisposalRecord | null;
  onClose: () => void;
}

export const EditDisposalModal: React.FC<EditDisposalModalProps> = ({ record, onClose }) => {
  const { updateDisposalRecord } = useApp();
  const [formData, setFormData] = useState<Partial<DisposalRecord>>({});
  const [committeeStr, setCommitteeStr] = useState<string>('');
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (record) {
      setFormData({ ...record });
      setCommitteeStr(record.committee.join('\n'));
      setSaved(false);
    }
  }, [record]);

  if (!record) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.reason?.trim()) {
      alert('กรุณาระบุเหตุผลการขอจำหน่าย');
      return;
    }

    const committee = committeeStr
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    updateDisposalRecord(record.id, {
      ...formData,
      originalCost: Number(formData.originalCost) || 0,
      nbvAtDisposal: Number(formData.nbvAtDisposal) || 0,
      committee: committee.length > 0 ? committee : record.committee,
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
              <span className="font-mono text-sm font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded">
                {record.docNo}
              </span>
              <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                แก้ไขรายการขอจำหน่ายพัสดุ
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
              <span>บันทึกการแก้ไขรายงานขอจำหน่ายเรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                สถานะการจำหน่าย
              </label>
              <select
                value={formData.status || 'PENDING_REVIEW'}
                onChange={(e) => {
                  const status = e.target.value as 'PENDING_REVIEW' | 'APPROVED' | 'EXECUTED';
                  const approvedDate = status === 'APPROVED' ? (formData.approvedDate || new Date().toISOString().slice(0, 10)) : undefined;
                  setFormData({
                    ...formData,
                    status,
                    approvedDate,
                  });
                }}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
              >
                <option value="PENDING_REVIEW">🟡 รอสอบหาข้อเท็จจริง (Pending Review)</option>
                <option value="APPROVED">🟢 อนุมัติจำหน่ายแล้ว (Approved)</option>
                <option value="EXECUTED">✓ ดำเนินการตัดจำหน่ายเสร็จสิ้น (Executed)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                วิธีการจำหน่าย (ตามระเบียบฯ ข้อ 215)
              </label>
              <select
                value={formData.method || 'DESTROY'}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as DisposalMethod })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold text-purple-900"
              >
                <option value="SELL">ขายทอดตลาด / ขายเฉพาะเจาะจง</option>
                <option value="EXCHANGE">แลกเปลี่ยนพัสดุ</option>
                <option value="TRANSFER_OUT">โอนให้หน่วยงานอื่น / องค์กรปกครองส่วนท้องถิ่น</option>
                <option value="DESTROY">แปรสภาพหรือทำลาย</option>
                <option value="WRITE_OFF">ตัดเป็นสูญ (สูญหายตามธรรมชาติ/เหตุสุดวิสัย)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  ราคาทุนเดิม (บาท)
                </label>
                <input
                  type="number"
                  value={formData.originalCost || 0}
                  onChange={(e) => setFormData({ ...formData, originalCost: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  มูลค่าสุทธิ ณ วันจำหน่าย (บาท)
                </label>
                <input
                  type="number"
                  value={formData.nbvAtDisposal || 0}
                  onChange={(e) => setFormData({ ...formData, nbvAtDisposal: Number(e.target.value) })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  วันที่เสนอเรื่อง
                </label>
                <input
                  type="date"
                  value={formData.proposedDate || ''}
                  onChange={(e) => setFormData({ ...formData, proposedDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  วันที่อนุมัติ (ถ้ามี)
                </label>
                <input
                  type="date"
                  value={formData.approvedDate || ''}
                  onChange={(e) => setFormData({ ...formData, approvedDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                เหตุผลความจำเป็นในการขอจำหน่าย <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.reason || ''}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                รายชื่อคณะกรรมการสอบหาข้อเท็จจริง (1 บรรทัดต่อ 1 ท่าน)
              </label>
              <textarea
                rows={3}
                value={committeeStr}
                onChange={(e) => setCommitteeStr(e.target.value)}
                placeholder="เช่น นายวิชัย มั่นคง (ประธานกรรมการ)"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>
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
