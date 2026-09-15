import React, { useState, useMemo } from 'react';
import {
  X,
  Printer,
  Calendar,
  Building,
  Coins,
  QrCode,
  Wrench,
  ArrowLeftRight,
  FileText,
  Clock,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  formatCurrency,
  formatNumber,
  formatThaiDate,
  generateDepreciationSchedule,
} from '../../utils/thaiFiscal';

export const AssetDetailModal: React.FC = () => {
  const { selectedAssetForDetail, setSelectedAssetForDetail, maintenanceJobs, borrowRecords } = useApp();
  const [activeTab, setActiveTab] = useState<'info' | 'depreciation' | 'maintenance' | 'label'>('info');

  const asset = selectedAssetForDetail;

  const depreciationSchedule = useMemo(() => {
    if (!asset) return [];
    return generateDepreciationSchedule(
      asset.unitCost,
      asset.usefulLifeYr,
      asset.inServiceDate || asset.acquireDate,
      2568
    );
  }, [asset]);

  if (!asset) return null;

  // Asset's maintenance jobs
  const assetJobs = maintenanceJobs.filter((j) => j.assetId === asset.id);
  const assetBorrows = borrowRecords.filter((b) => b.assetId === asset.id);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base sm:text-lg font-bold text-blue-900">
                {asset.assetNo}
              </span>
              <span className="text-xs bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-md">
                หมวด {asset.categoryCode} ({asset.categoryName})
              </span>
              {asset.status === 'IN_USE' && (
                <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2.5 py-0.5 rounded-full">
                  ● ใช้งานปกติ
                </span>
              )}
              {asset.status === 'REPAIR' && (
                <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2.5 py-0.5 rounded-full">
                  🔧 อยู่ระหว่างซ่อม
                </span>
              )}
              {asset.status === 'BORROWED' && (
                <span className="text-xs bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full">
                  🔄 ถูกยืมออก
                </span>
              )}
              {asset.status === 'DAMAGED' && (
                <span className="text-xs bg-rose-100 text-rose-800 font-medium px-2.5 py-0.5 rounded-full">
                  ⚠ ชำรุด
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-xl font-bold text-slate-900 mt-1">
              {asset.assetName}
            </h2>
            <p className="text-xs text-slate-500">
              {asset.brand} {asset.model} · S/N: {asset.serialNo || '-'} · สถานที่: {asset.locationPath}
            </p>
          </div>

          <button
            onClick={() => setSelectedAssetForDetail(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 px-5 border-b border-slate-200 flex gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'info'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ข้อมูลทั่วไปและการจัดซื้อ
          </button>
          <button
            onClick={() => setActiveTab('depreciation')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'depreciation'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ตารางค่าเสื่อมราคา ({depreciationSchedule.length} งวด)
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'maintenance'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            ประวัติซ่อมบำรุง ({assetJobs.length})
          </button>
          <button
            onClick={() => setActiveTab('label')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'label'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            สติกเกอร์ &amp; QR Code
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* TAB 1: General Info */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              {/* Photo & Financial Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-1 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-48 sm:h-auto">
                  {asset.photos && asset.photos.length > 0 ? (
                    <img
                      src={asset.photos[0]}
                      alt={asset.assetName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-slate-400">
                      ไม่มีรูปถ่าย
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2 grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  <div>
                    <span className="text-slate-500 block">ราคาทุนรวม (Cost):</span>
                    <span className="text-base font-bold text-slate-900">
                      {formatCurrency(asset.unitCost)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">มูลค่าสุทธิปัจจุบัน (NBV):</span>
                    <span className="text-base font-bold text-blue-900">
                      {formatCurrency(asset.netBookValue)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ค่าเสื่อมสะสม:</span>
                    <span className="font-semibold text-slate-700">
                      {formatCurrency(asset.accumulatedDep)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">เกณฑ์การคิดค่าเสื่อม:</span>
                    <span className="font-semibold text-emerald-700">
                      {asset.isDepreciable ? `วิธีเส้นตรง (${asset.usefulLifeYr} ปี)` : 'ไม่คิดค่าเสื่อม (<5,000 บ.)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">แหล่งเงิน:</span>
                    <span className="font-semibold text-slate-800">{asset.budgetSourceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ปีงบประมาณที่ได้มา:</span>
                    <span className="font-semibold text-slate-800">พ.ศ. {asset.fiscalYear}</span>
                  </div>
                </div>
              </div>

              {/* Spec & Contract Details */}
              <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-white">
                <h3 className="font-bold text-slate-900 border-b pb-1">รายละเอียดทางพัสดุและสัญญา</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-500">เลขที่สัญญา / PO:</span>{' '}
                    <span className="font-medium text-slate-800">{asset.documentNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ผู้ขาย / คู่สัญญา:</span>{' '}
                    <span className="font-medium text-slate-800">{asset.vendorName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">วันที่ได้มา:</span>{' '}
                    <span className="font-medium text-slate-800">{formatThaiDate(asset.acquireDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">วันเริ่มใช้งาน:</span>{' '}
                    <span className="font-medium text-slate-800">{formatThaiDate(asset.inServiceDate)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">วันสิ้นสุดการรับประกัน:</span>{' '}
                    <span className="font-medium text-slate-800">{formatThaiDate(asset.warrantyEnd)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ตรวจนับล่าสุด:</span>{' '}
                    <span className="font-medium text-slate-800">{formatThaiDate(asset.lastCountedDate)}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block">คุณลักษณะเฉพาะ (Specification):</span>
                    <p className="font-medium text-slate-800 mt-0.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {asset.spec || 'ไม่มีรายละเอียดเพิ่มเติม'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Custodian & Location */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h3 className="font-bold text-slate-900 border-b pb-1 mb-2">สถานที่และผู้รับผิดชอบ</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500">สถานที่ติดตั้ง:</span>{' '}
                    <span className="font-semibold text-slate-900">{asset.locationPath}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">กลุ่มงาน/แผนก:</span>{' '}
                    <span className="font-semibold text-slate-900">{asset.department}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ผู้รับผิดชอบ:</span>{' '}
                    <span className="font-semibold text-slate-900">{asset.custodianName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ตำแหน่ง:</span>{' '}
                    <span className="font-semibold text-slate-900">{asset.custodianPosition}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Depreciation Schedule */}
          {activeTab === 'depreciation' && (
            <div className="space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <div className="font-bold text-blue-950">
                    ตารางค่าเสื่อมราคาตามระเบียบกรมบัญชีกลาง (เส้นตรง)
                  </div>
                  <div className="text-[11px] text-blue-800 mt-0.5">
                    ราคาทุน {formatNumber(asset.unitCost)} บาท · อายุการใช้งาน {asset.usefulLifeYr} ปี · มูลค่าคงเหลือ 1.00 บาท
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] text-slate-500">มูลค่าสุทธิ (NBV) ปัจจุบัน</div>
                  <div className="text-base font-bold text-blue-900">
                    {formatNumber(asset.netBookValue)} บ.
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <th className="p-2.5">ปีงบประมาณ</th>
                      <th className="p-2.5 text-center">จำนวนเดือน</th>
                      <th className="p-2.5 text-right">ค่าเสื่อมประจำปี (บาท)</th>
                      <th className="p-2.5 text-right">ค่าเสื่อมสะสม (บาท)</th>
                      <th className="p-2.5 text-right">มูลค่าสุทธิทางบัญชี (บาท)</th>
                      <th className="p-2.5 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {depreciationSchedule.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80">
                        <td className="p-2.5 font-medium text-slate-900">
                          {row.periodLabel}
                        </td>
                        <td className="p-2.5 text-center text-slate-600">
                          {row.monthsCharged} เดือน
                        </td>
                        <td className="p-2.5 text-right font-medium text-slate-800">
                          {formatNumber(row.depreciation)}
                        </td>
                        <td className="p-2.5 text-right text-slate-600">
                          {formatNumber(row.accumulated)}
                        </td>
                        <td className="p-2.5 text-right font-bold text-blue-900">
                          {formatNumber(row.netBookValue)}
                        </td>
                        <td className="p-2.5 text-center">
                          {row.status === 'POSTED' ? (
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-medium">
                              บันทึกแล้ว
                            </span>
                          ) : (
                            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                              ประมาณการ
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Maintenance & Borrow History */}
          {activeTab === 'maintenance' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">ประวัติการแจ้งซ่อมและบำรุงรักษา</h3>
              {assetJobs.length === 0 ? (
                <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
                  ไม่มีประวัติการส่งซ่อมสำหรับครุภัณฑ์นี้ (ใช้งานได้ตามปกติ)
                </div>
              ) : (
                <div className="space-y-3">
                  {assetJobs.map((job) => (
                    <div key={job.id} className="p-3 border border-slate-200 rounded-xl bg-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-900">{job.ticketNo}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          job.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {job.status === 'COMPLETED' ? 'ซ่อมเสร็จสิ้น' : 'กำลังดำเนินการ'}
                        </span>
                      </div>
                      <p className="text-slate-800 font-medium">{job.symptom}</p>
                      {job.actionTaken && (
                        <p className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded-lg">
                          การแก้ไข: {job.actionTaken}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t">
                        <span>ช่างผู้ดำเนินการ: {job.technicianName || '-'}</span>
                        <span className="font-semibold text-slate-900">
                          ค่าใช้จ่าย: {job.cost ? formatCurrency(job.cost) : 'ไม่มีค่าใช้จ่าย'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Label & Sticker */}
          {activeTab === 'label' && (
            <div className="space-y-4 text-center">
              <div className="max-w-md mx-auto bg-white p-4 border-2 border-slate-900 rounded-xl shadow-lg text-left space-y-2">
                <div className="flex items-center justify-between border-b pb-1.5">
                  <div className="text-[11px] font-bold text-slate-900">
                    โรงพยาบาลเมืองใหม่ สสจ.
                  </div>
                  <div className="text-[9px] font-semibold text-slate-500">
                    ครุภัณฑ์ภาครัฐ
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-mono text-base font-black text-blue-950">
                      {asset.assetNo}
                    </div>
                    <div className="font-semibold text-slate-800 text-xs">
                      {asset.assetName}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {asset.brand} {asset.model}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      วันได้มา: {formatThaiDate(asset.acquireDate)}
                    </div>
                  </div>

                  <div className="w-20 h-20 bg-slate-50 border border-slate-300 rounded-lg p-1.5 flex items-center justify-center shrink-0">
                    <QrCode className="w-16 h-16 text-slate-900" />
                  </div>
                </div>

                <div className="text-[9px] text-slate-400 border-t pt-1 flex justify-between">
                  <span>ห้ามแกะหรือทำลายสติกเกอร์</span>
                  <span>งานพัสดุ โทร. 1102</span>
                </div>
              </div>

              <button
                onClick={() => alert(`ส่งคำสั่งพิมพ์สติกเกอร์สำหรับ ${asset.assetNo} ไปยังเครื่องพิมพ์สำเร็จ`)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>สั่งพิมพ์สติกเกอร์ (Thermal Printer)</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end rounded-b-2xl">
          <button
            onClick={() => setSelectedAssetForDetail(null)}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
