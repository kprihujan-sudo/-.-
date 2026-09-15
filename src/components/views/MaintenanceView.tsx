import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Plus,
  Camera,
  Coins,
  ShieldCheck,
  Building,
  User,
  ExternalLink,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MaintenanceJob, MaintenanceUrgency, MaintenanceSchedule } from '../../types';
import { formatCurrency, formatThaiDate } from '../../utils/thaiFiscal';
import { EditMaintenanceJobModal } from '../modals/EditMaintenanceJobModal';
import { EditMaintenanceScheduleModal } from '../modals/EditMaintenanceScheduleModal';

export const MaintenanceView: React.FC = () => {
  const {
    maintenanceJobs,
    addMaintenanceJob,
    updateMaintenanceStatus,
    maintenanceSchedules,
    assets,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'tickets' | 'schedules' | 'newTicket'>('tickets');
  const [editingJob, setEditingJob] = useState<MaintenanceJob | null>(null);
  const [editingSchedule, setEditingSchedule] = useState<MaintenanceSchedule | null>(null);

  // Form State for new repair job
  const [selectedAssetId, setSelectedAssetId] = useState<number>(assets[0]?.id || 0);
  const [jobType, setJobType] = useState<MaintenanceJob['jobType']>('REPAIR');
  const [urgency, setUrgency] = useState<MaintenanceUrgency>('NORMAL');
  const [symptom, setSymptom] = useState<string>('');
  const [affectsService, setAffectsService] = useState<boolean>(false);
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=600&auto=format&fit=crop&q=80'
  );

  // Modal / inline action to complete job
  const [completingJobId, setCompletingJobId] = useState<number | null>(null);
  const [completionAction, setCompletionAction] = useState<string>('');
  const [completionCost, setCompletionCost] = useState<number>(0);

  const handleSubmitNewTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find((a) => a.id === Number(selectedAssetId));
    if (!asset) {
      alert('กรุณาเลือกครุภัณฑ์ที่ต้องการแจ้งซ่อม');
      return;
    }
    if (!symptom.trim()) {
      alert('กรุณาระบุอาการชำรุดหรือปัญหาที่พบ');
      return;
    }

    addMaintenanceJob({
      assetId: asset.id,
      assetNo: asset.assetNo,
      assetName: asset.assetName,
      jobType,
      urgency,
      status: 'OPEN',
      symptom,
      reportedBy: currentUser.fullName,
      photosBefore: photoUrl ? [photoUrl] : [],
      photosAfter: [],
      affectsService,
    });

    setSymptom('');
    setActiveTab('tickets');
    alert('บันทึกการแจ้งซ่อมออนไลน์เรียบร้อยแล้ว ช่างซ่อมบำรุงจะเข้าตรวจสอบตาม SLA');
  };

  const handleFinishJob = (jobId: number) => {
    if (!completionAction.trim()) {
      alert('กรุณาระบุรายละเอียดการซ่อมหรืออะไหล่ที่เปลี่ยน');
      return;
    }
    updateMaintenanceStatus(
      jobId,
      'COMPLETED',
      completionAction,
      completionCost,
      ['https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80']
    );
    setCompletingJobId(null);
    setCompletionAction('');
    setCompletionCost(0);
    alert('บันทึกปิดงานซ่อมและปรับสถานะครุภัณฑ์กลับมาใช้งานปกติเรียบร้อย');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>ระบบงานซ่อมบำรุง &amp; สอบเทียบเครื่องมือแพทย์</span>
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              ศูนย์วิศวกรรมการแพทย์
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            บันทึกประวัติการซ่อมบำรุงออนไลน์ แนบภาพถ่าย และติดตามรอบการสอบเทียบความปลอดภัย (PM/Calibration)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('newTicket')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ แจ้งซ่อมออนไลน์</span>
          </button>
        </div>
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-semibold pb-1">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2 rounded-t-xl transition-colors ${
            activeTab === 'tickets'
              ? 'bg-white border border-b-0 border-slate-200 text-blue-700 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          รายการแจ้งซ่อม / ประวัติงาน ({maintenanceJobs.length})
        </button>

        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-t-xl transition-colors ${
            activeTab === 'schedules'
              ? 'bg-white border border-b-0 border-slate-200 text-blue-700 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          รอบบำรุงรักษาเชิงป้องกัน (PM) &amp; สอบเทียบ ({maintenanceSchedules.length})
        </button>

        <button
          onClick={() => setActiveTab('newTicket')}
          className={`px-4 py-2 rounded-t-xl transition-colors ${
            activeTab === 'newTicket'
              ? 'bg-white border border-b-0 border-slate-200 text-blue-700 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          แบบฟอร์มแจ้งซ่อมใหม่
        </button>
      </div>

      {/* TAB 1: TICKETS LIST */}
      {activeTab === 'tickets' && (
        <div className="space-y-4">
          {maintenanceJobs.length === 0 ? (
            <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-400 text-xs">
              ยังไม่มีรายการแจ้งซ่อมในระบบ
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maintenanceJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <div>
                      <span className="font-mono font-bold text-blue-900 text-xs">
                        {job.ticketNo}
                      </span>
                      <span className="text-[11px] text-slate-400 ml-2">
                        {job.reportedAt}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {job.urgency === 'CRITICAL' && (
                        <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded-md font-bold">
                          ด่วนวิกฤต
                        </span>
                      )}
                      {job.urgency === 'HIGH' && (
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-md font-bold">
                          ด่วนสูง
                        </span>
                      )}
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          job.status === 'COMPLETED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {job.status === 'COMPLETED' ? 'ซ่อมเสร็จสิ้น' : 'กำลังดำเนินการ'}
                      </span>
                      <button
                        onClick={() => setEditingJob(job)}
                        className="p-1 text-slate-400 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors ml-1"
                        title="แก้ไขใบแจ้งซ่อม"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-xs leading-snug">
                      {job.assetName}
                    </h3>
                    <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                      {job.assetNo}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      อาการชำรุด / ข้อขัดข้อง:
                    </span>
                    <p className="text-slate-800">{job.symptom}</p>
                  </div>

                  {/* Photos */}
                  {job.photosBefore && job.photosBefore.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">ภาพก่อนซ่อม:</span>
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200">
                        <img
                          src={job.photosBefore[0]}
                          alt="Before"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* If action taken exists */}
                  {job.actionTaken && (
                    <div className="bg-emerald-50/60 border border-emerald-200/60 p-2.5 rounded-xl text-xs space-y-1">
                      <span className="text-[11px] font-bold text-emerald-900 block">
                        ผลการดำเนินการซ่อม:
                      </span>
                      <p className="text-slate-800">{job.actionTaken}</p>
                      {job.partsReplaced && (
                        <p className="text-[11px] text-slate-600">อะไหล่: {job.partsReplaced}</p>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div>
                      <span>ผู้แจ้ง: {job.reportedBy}</span>
                    </div>
                    {job.cost && job.cost > 0 && (
                      <div className="font-bold text-slate-900">
                        ค่าใช้จ่าย: {formatCurrency(job.cost)}
                      </div>
                    )}
                  </div>

                  {/* Action button if in progress */}
                  {job.status !== 'COMPLETED' && (
                    <div className="pt-2">
                      {completingJobId === job.id ? (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-2 text-xs">
                          <span className="font-bold text-blue-900 block">
                            บันทึกปิดงานซ่อม
                          </span>
                          <input
                            type="text"
                            placeholder="ระบุการแก้ไขและอะไหล่ที่เปลี่ยน..."
                            value={completionAction}
                            onChange={(e) => setCompletionAction(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5"
                          />
                          <input
                            type="number"
                            placeholder="ค่าใช้จ่ายรวม (บาท)"
                            value={completionCost || ''}
                            onChange={(e) => setCompletionCost(Number(e.target.value))}
                            className="w-full bg-white border border-slate-300 rounded-lg p-1.5"
                          />
                          <div className="flex justify-end gap-2 pt-1">
                            <button
                              onClick={() => setCompletingJobId(null)}
                              className="px-2.5 py-1 text-slate-600 bg-white border rounded-lg"
                            >
                              ยกเลิก
                            </button>
                            <button
                              onClick={() => handleFinishJob(job.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                            >
                              ยืนยันปิดงาน
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCompletingJobId(job.id)}
                          className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 font-semibold rounded-lg text-xs transition-colors border border-blue-200"
                        >
                          บันทึกการซ่อม &amp; ปิดงาน
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: SCHEDULES (PM & CALIBRATION) */}
      {activeTab === 'schedules' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold text-slate-900">
                ตารางแผนบำรุงรักษาเชิงป้องกัน (PM) &amp; ตรวจสอบสอบเทียบความปลอดภัย
              </h2>
              <p className="text-[11px] text-slate-500">
                ระบบแจ้งเตือนล่วงหน้า 30 วัน ตามมาตรฐานโรงพยาบาล (HA/JCI)
              </p>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-bold">
              ทั้งหมด {maintenanceSchedules.length} รอบ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="p-3">เลขครุภัณฑ์</th>
                  <th className="p-3">รายการ</th>
                  <th className="p-3">ประเภทงาน</th>
                  <th className="p-3">ความถี่</th>
                  <th className="p-3">รอบล่าสุด</th>
                  <th className="p-3">กำหนดรอบถัดไป</th>
                  <th className="p-3">สถานะเตือน</th>
                  <th className="p-3">ผู้รับผิดชอบ</th>
                  <th className="p-3 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {maintenanceSchedules.map((sch) => (
                  <tr key={sch.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-medium text-blue-900">{sch.assetNo}</td>
                    <td className="p-3 font-semibold text-slate-900">{sch.assetName}</td>
                    <td className="p-3">
                      <span className="font-medium bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md">
                        {sch.scheduleType === 'CALIBRATION' ? 'สอบเทียบเครื่องมือ' : 'บำรุงรักษา (PM)'}
                      </span>
                    </td>
                    <td className="p-3 text-slate-600">
                      {sch.frequency === 'QUARTERLY' ? 'ทุก 3 เดือน' : 'ทุก 6 เดือน'}
                    </td>
                    <td className="p-3 text-slate-600">{formatThaiDate(sch.lastPerformedDate)}</td>
                    <td className="p-3 font-semibold text-slate-900">{formatThaiDate(sch.nextDueDate)}</td>
                    <td className="p-3">
                      {sch.isOverdue ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3 h-3" />
                          เกินกำหนดแล้ว
                        </span>
                      ) : sch.daysUntilDue <= 30 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          <Clock className="w-3 h-3" />
                          ถึงรอบใน {sch.daysUntilDue} วัน
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          ปกติ
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-700">{sch.assignedVendorOrStaff}</td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => setEditingSchedule(sch)}
                        className="p-1.5 text-amber-700 hover:bg-amber-50 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
                        title="แก้ไขแผนบำรุงรักษา"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>แก้ไข</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: NEW REPAIR TICKET FORM */}
      {activeTab === 'newTicket' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs max-w-2xl mx-auto space-y-4 text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-700" />
            <span>แบบฟอร์มส่งซ่อมครุภัณฑ์ออนไลน์</span>
          </h2>

          <form onSubmit={handleSubmitNewTicket} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                เลือกครุภัณฑ์ที่พบปัญหา *
              </label>
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.assetNo} - {a.assetName} ({a.locationPath})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">ประเภทงาน *</label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="REPAIR">ซ่อมแซมอาการชำรุด (Repair)</option>
                  <option value="PM">บำรุงรักษาเชิงป้องกัน (PM)</option>
                  <option value="CALIBRATION">สอบเทียบความถูกต้อง (Calibration)</option>
                  <option value="INSPECTION">ตรวจสอบความปลอดภัย (Inspection)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">ระดับความเร่งด่วน *</label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                >
                  <option value="NORMAL">ปกติ (ภายใน 72 ชม.)</option>
                  <option value="HIGH">ด่วนสูง (ภายใน 24 ชม.)</option>
                  <option value="CRITICAL">ด่วนวิกฤต กระทบชีวิตผู้ป่วย (ภายใน 4 ชม.)</option>
                  <option value="LOW">ต่ำ (ซ่อมบำรุงทั่วไป)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                อาการชำรุด / ข้อขัดข้องที่พบ *
              </label>
              <textarea
                rows={3}
                value={symptom}
                onChange={(e) => setSymptom(e.target.value)}
                placeholder="ระบุอาการชำรุด เช่น เปิดเครื่องไม่ติด, สัญญาณภาพรบกวน, ลมรั่ว, ข้อต่อหัก"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="affectsService"
                checked={affectsService}
                onChange={(e) => setAffectsService(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded-sm"
              />
              <label htmlFor="affectsService" className="text-slate-700 font-medium">
                กระทบต่อการให้บริการผู้ป่วยโดยตรง (เข้าเกณฑ์เร่งด่วนพิเศษ)
              </label>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                ภาพถ่ายประกอบอาการชำรุด (URL)
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
              />
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('tickets')}
                className="px-4 py-2 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-white bg-blue-700 hover:bg-blue-800 rounded-xl font-semibold shadow-xs"
              >
                ส่งใบแจ้งซ่อม
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Maintenance Modals */}
      {editingJob && (
        <EditMaintenanceJobModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
        />
      )}

      {editingSchedule && (
        <EditMaintenanceScheduleModal
          schedule={editingSchedule}
          onClose={() => setEditingSchedule(null)}
        />
      )}
    </div>
  );
};
