import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  FileText,
  AlertTriangle,
  User,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DisposalMethod } from '../../types';
import { formatCurrency, formatNumber, formatThaiDate } from '../../utils/thaiFiscal';

export const DisposalView: React.FC = () => {
  const { disposalRecords, proposeDisposal, approveDisposal, assets, currentUser } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedAssetId, setSelectedAssetId] = useState<number>(assets[0]?.id || 0);
  const [method, setMethod] = useState<DisposalMethod>('DESTROY');
  const [reason, setReason] = useState<string>(
    'เสื่อมสภาพตามอายุการใช้งาน โครงสร้างชำรุด ซ่อมแล้วไม่คุ้มค่า ตามผลตรวจนับประจำปี'
  );

  const selectedAsset = assets.find((a) => a.id === Number(selectedAssetId));

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    proposeDisposal({
      assetId: selectedAsset.id,
      assetNo: selectedAsset.assetNo,
      assetName: selectedAsset.assetName,
      originalCost: selectedAsset.totalCost,
      nbvAtDisposal: selectedAsset.netBookValue,
      method,
      reason,
      committee: [
        'นายวิชัย มั่นคง (ประธานกรรมการ)',
        'นางสาวมาลี ใจดี (กรรมการ)',
        'นายสมชาย พัสดุดี (กรรมการและเลขานุการ)',
      ],
    });

    setIsModalOpen(false);
    alert('บันทึกเสนอจำหน่ายพัสดุเรียบร้อย ส่งเรื่องให้คณะกรรมการสอบหาข้อเท็จจริง');
  };

  const methodNames: Record<DisposalMethod, string> = {
    SELL: 'ขายทอดตลาด / ขายเฉพาะเจาะจง',
    EXCHANGE: 'แลกเปลี่ยนพัสดุ',
    TRANSFER_OUT: 'โอนให้หน่วยงานอื่น / องค์กรปกครองส่วนท้องถิ่น',
    DESTROY: 'แปรสภาพหรือทำลาย',
    WRITE_OFF: 'ตัดเป็นสูญ (สูญหายตามธรรมชาติ/เหตุสุดวิสัย)',
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>ระบบการจำหน่ายพัสดุ (Disposal Workflow)</span>
            <span className="text-xs bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded-full">
              ระเบียบพัสดุฯ ข้อ 215
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            กระบวนการขออนุมัติจำหน่ายพัสดุที่ชำรุด เสื่อมสภาพ หรือหมดความจำเป็นต้องใช้ในราชการ
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ เสนอขอจำหน่ายพัสดุ</span>
        </button>
      </div>

      {/* Disposals List */}
      <div className="space-y-4">
        {disposalRecords.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <span className="font-mono font-bold text-blue-900 text-sm">{item.docNo}</span>
                <span className="text-slate-400 text-[11px] ml-2">
                  เสนอเมื่อ {formatThaiDate(item.proposedDate)}
                </span>
              </div>
              <span
                className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  item.status === 'APPROVED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {item.status === 'APPROVED' ? 'อนุมัติจำหน่ายแล้ว' : 'รอสอบหาข้อเท็จจริง'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <span className="text-slate-500 block">รายการครุภัณฑ์:</span>
                <div className="font-bold text-slate-900">{item.assetName}</div>
                <div className="font-mono text-[11px] text-slate-400">{item.assetNo}</div>
              </div>

              <div>
                <span className="text-slate-500 block">วิธีการจำหน่าย:</span>
                <span className="font-semibold text-purple-900">{methodNames[item.method]}</span>
              </div>

              <div>
                <span className="text-slate-500 block">มูลค่าสุทธิ ณ วันจำหน่าย:</span>
                <span className="font-bold text-blue-900">{formatCurrency(item.nbvAtDisposal)}</span>
                <span className="text-[10px] text-slate-400 block">
                  (ราคาทุน {formatNumber(item.originalCost)} บ.)
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-slate-500 font-semibold block text-[11px]">เหตุผลการขอจำหน่าย:</span>
              <p className="text-slate-800 mt-0.5">{item.reason}</p>
            </div>

            {/* Committee info */}
            <div className="text-[11px] text-slate-500 pt-1 flex flex-wrap items-center justify-between gap-2">
              <span>คณะกรรมการ: {item.committee.join(' · ')}</span>
              {item.status !== 'APPROVED' && (
                <button
                  onClick={() => approveDisposal(item.id)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold"
                >
                  อนุมัติจำหน่าย &amp; ตัดออกจากทะเบียน
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Propose Disposal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 border-b pb-2">
              เสนอขอจำหน่ายพัสดุ (จพ.2568)
            </h2>

            <form onSubmit={handlePropose} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">เลือกครุภัณฑ์ *</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  {assets.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.assetNo} - {a.assetName} (NBV: {formatNumber(a.netBookValue)} บ.)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">วิธีการจำหน่าย *</label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                >
                  <option value="DESTROY">แปรสภาพหรือทำลาย (DESTROY)</option>
                  <option value="SELL">ขายทอดตลาด (SELL)</option>
                  <option value="TRANSFER_OUT">โอนให้ส่วนราชการอื่น (TRANSFER)</option>
                  <option value="EXCHANGE">แลกเปลี่ยน (EXCHANGE)</option>
                  <option value="WRITE_OFF">ตัดเป็นสูญ (WRITE_OFF)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">เหตุผลและความจำเป็น *</label>
                <textarea
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2"
                />
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
                  ยื่นขอจำหน่าย
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
