import React, { useState, useEffect } from 'react';
import { X, Save, CheckCircle2, Wrench, AlertTriangle, Clock } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaintenanceJob, MaintenanceJobType, MaintenanceUrgency, MaintenanceStatus } from '../../types';

interface EditMaintenanceJobModalProps {
  job: MaintenanceJob | null;
  onClose: () => void;
}

export const EditMaintenanceJobModal: React.FC<EditMaintenanceJobModalProps> = ({ job, onClose }) => {
  const { updateMaintenanceJob } = useApp();
  const [formData, setFormData] = useState<Partial<MaintenanceJob>>({});
  const [saved, setSaved] = useState<boolean>(false);

  useEffect(() => {
    if (job) {
      setFormData({ ...job });
      setSaved(false);
    }
  }, [job]);

  if (!job) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.symptom?.trim()) {
      alert('กรุณาระบุอาการชำรุดหรือรายละเอียดงาน');
      return;
    }

    updateMaintenanceJob(job.id, {
      ...formData,
      cost: Number(formData.cost) || 0,
    });

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95 text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                {job.ticketNo}
              </span>
              <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full text-[11px]">
                แก้ไขใบแจ้งซ่อม/บำรุงรักษา
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
              ครุภัณฑ์: {job.assetName} ({job.assetNo})
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {saved && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>บันทึกการแก้ไขใบแจ้งซ่อมเรียบร้อยแล้ว</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ประเภทงานบำรุงรักษา
              </label>
              <select
                value={formData.jobType || 'REPAIR'}
                onChange={(e) => setFormData({ ...formData, jobType: e.target.value as MaintenanceJobType })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              >
                <option value="REPAIR">ซ่อมแซมแก้ไข (Corrective Maintenance)</option>
                <option value="PM">บำรุงรักษาเชิงป้องกัน (Preventive Maintenance)</option>
                <option value="CALIBRATION">สอบเทียบความถูกต้อง (Calibration)</option>
                <option value="INSPECTION">ตรวจสอบความปลอดภัยประจำรอบ</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ระดับความเร่งด่วน (Priority)
              </label>
              <select
                value={formData.urgency || 'NORMAL'}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as MaintenanceUrgency })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-semibold"
              >
                <option value="LOW">🟢 ปกติ ไม่กระทบงาน (Low)</option>
                <option value="NORMAL">🟡 ปานกลาง (Normal)</option>
                <option value="HIGH">🟠 เร่งด่วน กระทบบริการ (High)</option>
                <option value="CRITICAL">🔴 วิกฤติฉุกเฉิน เครื่องช่วยชีวิต (Critical)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                สถานะงานซ่อม
              </label>
              <select
                value={formData.status || 'OPEN'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as MaintenanceStatus })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-bold"
              >
                <option value="OPEN">⚪ รอดำเนินการ (Open)</option>
                <option value="ASSIGNED">🔵 มอบหมายช่างแล้ว (Assigned)</option>
                <option value="IN_PROGRESS">🟡 กำลังซ่อม/รออะไหล่ (In Progress)</option>
                <option value="COMPLETED">🟢 ซ่อมเสร็จสิ้นแล้ว (Completed)</option>
                <option value="CANCELLED">❌ ยกเลิกงานแจ้งซ่อม (Cancelled)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ผู้แจ้งซ่อม
              </label>
              <input
                type="text"
                value={formData.reportedBy || ''}
                onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ช่างผู้รับผิดชอบ / บริษัทซ่อม
              </label>
              <input
                type="text"
                value={formData.technicianName || ''}
                onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
                placeholder="เช่น นายช่างวิโรจน์ หรือ บจก.ไทยเมดิคอล"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                ค่าใช้จ่ายในการซ่อมรวม (บาท)
              </label>
              <input
                type="number"
                min={0}
                value={formData.cost || 0}
                onChange={(e) => setFormData({ ...formData, cost: Number(e.target.value) })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono font-bold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                อาการชำรุด / ปัญหาที่พบ <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={formData.symptom || ''}
                onChange={(e) => setFormData({ ...formData, symptom: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                รายละเอียดการซ่อม / การแก้ไขของช่าง
              </label>
              <textarea
                rows={2}
                value={formData.actionTaken || ''}
                onChange={(e) => setFormData({ ...formData, actionTaken: e.target.value })}
                placeholder="เช่น เปลี่ยนแผงวงจรควบคุมหลัก ทดสอบการทำงาน 3 รอบผ่านเกณฑ์"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-semibold mb-1">
                รายการอะไหล่ที่เปลี่ยน
              </label>
              <input
                type="text"
                value={formData.partsReplaced || ''}
                onChange={(e) => setFormData({ ...formData, partsReplaced: e.target.value })}
                placeholder="เช่น Mainboard Rev.C, Power Supply 24V"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                วันที่และเวลาที่แจ้ง
              </label>
              <input
                type="text"
                value={formData.reportedAt || ''}
                onChange={(e) => setFormData({ ...formData, reportedAt: e.target.value })}
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                วันที่ซ่อมเสร็จสิ้น (ถ้ามี)
              </label>
              <input
                type="text"
                value={formData.completedAt || ''}
                onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
                placeholder="เช่น 2025-03-02 14:30"
                className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 font-mono"
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
