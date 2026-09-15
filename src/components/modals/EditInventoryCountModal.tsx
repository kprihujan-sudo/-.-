import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2, QrCode, MapPin, AlertTriangle, XCircle, FileCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { InventoryCountRecord, FoundStatus } from '../../types';

interface EditInventoryCountModalProps {
  record: InventoryCountRecord | null;
  onClose: () => void;
}

export const EditInventoryCountModal: React.FC<EditInventoryCountModalProps> = ({ record, onClose }) => {
  const { updateInventoryCount } = useApp();
  const [formData, setFormData] = useState<Partial<InventoryCountRecord>>({});
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
    updateInventoryCount(record.id, {
      ...formData,
      foundStatus: formData.foundStatus || 'FOUND',
      actualLocation: formData.actualLocation || record.expectedLocation,
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
                {record.assetNo}
              </span>
              <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                แก้ไขผลการตรวจนับพัสดุ
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              ครุภัณฑ์: {record.assetName}
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
              <span>บันทึกการแก้ไขผลตรวจนับเรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="space-y-3">
            {/* Status options */}
            <div>
              <label className="block text-slate-700 font-bold mb-2">
                ผลการตรวจสอบสภาพครุภัณฑ์ *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, foundStatus: 'FOUND' })}
                  className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                    formData.foundStatus === 'FOUND'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>พบ / ใช้งานได้ปกติ</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    ตรงตามทะเบียน สภาพพร้อมใช้งาน
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, foundStatus: 'DAMAGED' })}
                  className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                    formData.foundStatus === 'DAMAGED'
                      ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold">
                    <AlertTriangle className="w-4 h-4" />
                    <span>ชำรุด / เสื่อมสภาพ</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    ใช้งานไม่ได้ ต้องซ่อมหรือจำหน่าย
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, foundStatus: 'NOT_FOUND' })}
                  className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                    formData.foundStatus === 'NOT_FOUND'
                      ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-rose-700 font-bold">
                    <XCircle className="w-4 h-4" />
                    <span>ไม่พบตัวครุภัณฑ์</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    ค้นหาไม่พบ หรือสูญหาย
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, foundStatus: 'OBSOLETE' })}
                  className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                    formData.foundStatus === 'OBSOLETE'
                      ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-400'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-purple-700 font-bold">
                    <FileCheck className="w-4 h-4" />
                    <span>หมดความจำเป็นใช้</span>
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    เทคโนโลยีล้าสมัย หรือเกินความจำเป็น
                  </p>
                </button>
              </div>
            </div>

            {/* Locations */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
              <div>
                <span className="text-slate-500 block text-[11px]">สถานที่ตามทะเบียนคุมเดิม:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-700" />
                  {record.expectedLocation}
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold text-[11px] mb-1">
                  สถานที่จริงที่ตรวจพบ:
                </label>
                <input
                  type="text"
                  value={formData.actualLocation || ''}
                  onChange={(e) => setFormData({ ...formData, actualLocation: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ผู้ทำการตรวจนับ
              </label>
              <input
                type="text"
                value={formData.countedBy || ''}
                onChange={(e) => setFormData({ ...formData, countedBy: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                หมายเหตุ / บันทึกผลต่าง
              </label>
              <textarea
                rows={2}
                value={formData.remark || ''}
                onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                placeholder="เช่น พบในห้องพักแพทย์ สภาพฝาครอบแตกเล็กน้อย"
                className="w-full bg-white border border-slate-300 rounded-xl p-2 text-slate-900"
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
