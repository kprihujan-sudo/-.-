import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2, Calendar, Clock, Wrench } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaintenanceSchedule } from '../../types';

interface EditMaintenanceScheduleModalProps {
  schedule: MaintenanceSchedule | null;
  onClose: () => void;
}

export const EditMaintenanceScheduleModal: React.FC<EditMaintenanceScheduleModalProps> = ({
  schedule,
  onClose,
}) => {
  const { updateMaintenanceSchedule } = useApp();
  const [formData, setFormData] = useState<Partial<MaintenanceSchedule>>({});
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (schedule) {
      setFormData({ ...schedule });
      setSaved(false);
    }
  }, [schedule]);

  if (!schedule) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nextDueDate) {
      alert('กรุณาระบุกำหนดการรอบถัดไป');
      return;
    }

    const today = new Date();
    const dueDate = new Date(formData.nextDueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const isOverdue = daysUntilDue < 0;

    updateMaintenanceSchedule(schedule.id, {
      ...formData,
      daysUntilDue,
      isOverdue,
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto text-xs">
      <div className="bg-white rounded-2xl max-w-xl w-full flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                {schedule.assetNo}
              </span>
              <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                แก้ไขแผนบำรุงรักษา/สอบเทียบ
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              ครุภัณฑ์: {schedule.assetName}
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
              <span>บันทึกการแก้ไขแผนรอบบำรุงรักษาเรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ประเภทแผนบำรุงรักษา
              </label>
              <select
                value={formData.scheduleType || 'PM'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    scheduleType: e.target.value as 'PM' | 'CALIBRATION',
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
              >
                <option value="PM">การบำรุงรักษาเชิงป้องกัน (Preventive Maintenance)</option>
                <option value="CALIBRATION">การสอบเทียบมาตรฐานเครื่องมือ (Calibration)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">ความถี่รอบการทำ</label>
              <select
                value={formData.frequency || 'SEMI_ANNUAL'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    frequency: e.target.value as any,
                  })
                }
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              >
                <option value="MONTHLY">ทุก 1 เดือน (Monthly)</option>
                <option value="QUARTERLY">ทุก 3 เดือน (Quarterly)</option>
                <option value="SEMI_ANNUAL">ทุก 6 เดือน (Semi-Annual)</option>
                <option value="ANNUAL">ทุก 1 ปี (Annual)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                วันที่ทำรอบล่าสุด
              </label>
              <input
                type="date"
                value={formData.lastPerformedDate || ''}
                onChange={(e) => setFormData({ ...formData, lastPerformedDate: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                กำหนดรอบถัดไป <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.nextDueDate || ''}
                onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold text-blue-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                ผู้รับผิดชอบ / บริษัทผู้ให้บริการ
              </label>
              <input
                type="text"
                value={formData.assignedVendorOrStaff || ''}
                onChange={(e) => setFormData({ ...formData, assignedVendorOrStaff: e.target.value })}
                placeholder="เช่น ช่างเทคนิค รพ.สตูล หรือ ศูนย์วิทยาศาสตร์การแพทย์สตูล"
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
