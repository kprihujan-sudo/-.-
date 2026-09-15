import React, { useState } from 'react';
import {
  Boxes,
  Coins,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Wrench,
  ArrowUpRight,
  ArrowDownRight,
  Building2,
  FileText,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNumber } from '../../utils/thaiFiscal';

export const DashboardView: React.FC = () => {
  const {
    assets,
    maintenanceJobs,
    maintenanceSchedules,
    borrowRecords,
    alerts,
    setActiveView,
    currentOrg,
    setIsPrioritizationModalOpen,
  } = useApp();

  const [selectedMonth, setSelectedMonth] = useState('มีนาคม 2568');

  // Compute live aggregates
  const totalAssetsCount = assets.length;
  const totalOriginalCost = assets.reduce((sum, a) => sum + (a.totalCost || 0), 0);
  const totalAccumulatedDep = assets.reduce((sum, a) => sum + (a.accumulatedDep || 0), 0);
  const totalNetBookValue = assets.reduce((sum, a) => sum + (a.netBookValue || 0), 0);

  // Status breakdown
  const inUseCount = assets.filter((a) => a.status === 'IN_USE').length;
  const repairCount = assets.filter((a) => a.status === 'REPAIR').length;
  const borrowedCount = assets.filter((a) => a.status === 'BORROWED').length;
  const damagedCount = assets.filter((a) => a.status === 'DAMAGED').length;
  const disposedCount = assets.filter((a) => a.status === 'DISPOSED').length;

  // Category breakdown
  const categoryStats = [
    { code: '6515', name: 'ครุภัณฑ์การแพทย์', color: 'bg-emerald-500' },
    { code: '7440', name: 'ครุภัณฑ์คอมพิวเตอร์', color: 'bg-blue-500' },
    { code: '2310', name: 'ครุภัณฑ์ยานพาหนะ', color: 'bg-indigo-500' },
    { code: '7110', name: 'ครุภัณฑ์สำนักงาน', color: 'bg-amber-500' },
  ].map((cat) => {
    const items = assets.filter((a) => a.categoryCode === cat.code);
    const cost = items.reduce((sum, a) => sum + a.totalCost, 0);
    const nbv = items.reduce((sum, a) => sum + a.netBookValue, 0);
    return {
      ...cat,
      count: items.length,
      cost,
      nbv,
      pct: totalOriginalCost > 0 ? (cost / totalOriginalCost) * 100 : 0,
    };
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & Context Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                ภาพรวมทะเบียนทรัพย์สินและครุภัณฑ์
              </h1>
              <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                ระเบียบพัสดุ พ.ศ. 2560
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentOrg} · ข้อมูลสถานะครุภัณฑ์และการคำนวณค่าเสื่อมราคาแบบเส้นตรง (Straight-Line)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setIsPrioritizationModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl transition-all shadow-xs"
            >
              <Layers className="w-4 h-4" />
              <span>ดูลำดับความสำคัญฟีเจอร์</span>
            </button>
            <button
              onClick={() => setActiveView('reports')}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span>พิมพ์ทะเบียนคุมฯ</span>
            </button>
          </div>
        </div>

        {/* Four Key Financial & Inventory Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          {/* Total Assets */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">จำนวนครุภัณฑ์ทั้งหมด</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-bold text-slate-900">{totalAssetsCount}</div>
            <div className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>ขึ้นทะเบียนครบ 100%</span>
            </div>
          </div>

          {/* Total Cost */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">ราคาทุนรวม (Cost)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              {formatNumber(totalOriginalCost)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">บาท (อิงตามใบตรวจรับ)</div>
          </div>

          {/* Accumulated Depreciation */}
          <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl p-4 hover:border-blue-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">ค่าเสื่อมราคาสะสม</span>
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                <TrendingDown className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-slate-900">
              {formatNumber(totalAccumulatedDep)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">บาท (วิธีเส้นตรงรายเดือน)</div>
          </div>

          {/* Net Book Value */}
          <div className="bg-slate-50/80 border border-blue-200 bg-blue-50/30 rounded-xl p-4 hover:border-blue-400 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-900">มูลค่าสุทธิทางบัญชี (NBV)</span>
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-2 text-xl sm:text-2xl font-bold text-blue-950">
              {formatNumber(totalNetBookValue)}
            </div>
            <div className="text-[11px] text-blue-700 font-medium mt-1">บาท (เทียบยอด GFMIS)</div>
          </div>
        </div>
      </div>

      {/* Grid: Charts & Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Visual Charts & Categories */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Breakdown Bar Chart */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">สัดส่วนมูลค่าครุภัณฑ์แยกตามหมวด</h2>
                <p className="text-xs text-slate-500">จำแนกตามโครงสร้างรหัสพัสดุภาครัฐ (สธ.)</p>
              </div>
              <span className="text-xs font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded-md">
                ปีงบประมาณ 2568
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {categoryStats.map((cat) => (
                <div key={cat.code} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 flex items-center gap-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full ${cat.color}`} />
                      {cat.name} ({cat.count} รายการ)
                    </span>
                    <span className="font-semibold text-slate-900">
                      {formatNumber(cat.cost)} บาท ({cat.pct.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color} transition-all duration-500`}
                      style={{ width: `${Math.max(cat.pct, 3)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Distribution & Quick Flow */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 mb-4">สถานะความพร้อมใช้งานของครุภัณฑ์</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/60 rounded-xl text-center">
                <div className="text-lg font-bold text-emerald-800">{inUseCount}</div>
                <div className="text-xs font-medium text-emerald-700 mt-0.5">ใช้งานปกติ</div>
              </div>
              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-center">
                <div className="text-lg font-bold text-amber-800">{repairCount}</div>
                <div className="text-xs font-medium text-amber-700 mt-0.5">ส่งซ่อม/รออะไหล่</div>
              </div>
              <div className="p-3 bg-blue-50/70 border border-blue-200/60 rounded-xl text-center">
                <div className="text-lg font-bold text-blue-800">{borrowedCount}</div>
                <div className="text-xs font-medium text-blue-700 mt-0.5">ถูกยืมออก</div>
              </div>
              <div className="p-3 bg-rose-50/70 border border-rose-200/60 rounded-xl text-center">
                <div className="text-lg font-bold text-rose-800">{damagedCount}</div>
                <div className="text-xs font-medium text-rose-700 mt-0.5">ชำรุดรอแทงจำหน่าย</div>
              </div>
              <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-center col-span-2 sm:col-span-1">
                <div className="text-lg font-bold text-slate-800">{disposedCount}</div>
                <div className="text-xs font-medium text-slate-600 mt-0.5">จำหน่ายแล้ว</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Alerts & Maintenance Tasks */}
        <div className="space-y-6">
          {/* Urgent Action Center */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                รายการที่ต้องดำเนินการด่วน
              </h2>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                {alerts.totalAlerts}
              </span>
            </div>

            <div className="space-y-2.5">
              {/* Overdue Borrows */}
              <div
                onClick={() => setActiveView('movements')}
                className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-rose-900">
                  <span>ยืมครุภัณฑ์เกินกำหนด</span>
                  <span className="bg-rose-200 text-rose-900 px-1.5 py-0.5 rounded-md text-[10px]">
                    {alerts.overdueBorrows} รายการ
                  </span>
                </div>
                <p className="text-[11px] text-rose-700 mt-1">
                  เครื่องวัดความดันโลหิต Omron เกินกำหนดส่งคืน 5 วันแล้ว
                </p>
              </div>

              {/* PM Due */}
              <div
                onClick={() => setActiveView('maintenance')}
                className="p-3 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
                  <span>รอบ PM &amp; สอบเทียบเครื่องมือแพทย์</span>
                  <span className="bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-md text-[10px]">
                    {alerts.pmDueCount} รายการ
                  </span>
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  เครื่องกระตุกหัวใจ Mindray BeneHeart ถึงรอบบำรุงรักษาเชิงป้องกัน
                </p>
              </div>

              {/* Uncounted Assets */}
              <div
                onClick={() => setActiveView('inventory')}
                className="p-3 rounded-xl border border-blue-200 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                  <span>รอบตรวจนับพัสดุประจำปี 2568</span>
                  <span className="bg-blue-200 text-blue-900 px-1.5 py-0.5 rounded-md text-[10px]">
                    ยังไม่นับ {alerts.uncountedCount} รายการ
                  </span>
                </div>
                <p className="text-[11px] text-blue-700 mt-1">
                  ใช้แอปมือถือสแกน QR Code หน้างานจริงได้ แม้ไม่มีสัญญาณอินเทอร์เน็ต
                </p>
              </div>
            </div>
          </div>

          {/* Quick Depreciation Engine Status */}
          <div className="bg-linear-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                เครื่องคำนวณค่าเสื่อมราคา
              </span>
              <span className="text-[10px] bg-blue-800 text-blue-200 px-2 py-0.5 rounded-md">
                อัตโนมัติ
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              ระบบประมวลผลค่าเสื่อมราคาเส้นตรงตามเกณฑ์กรมบัญชีกลาง (งวดละ 1 เดือน เริ่มเดือนถัดจากวันพร้อมใช้ สิ้นสุดที่ 1 บาท)
            </p>
            <div className="mt-4 pt-3 border-t border-slate-700/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">งวดบัญชีปัจจุบัน:</span>
              <span className="font-semibold text-emerald-400">มีนาคม 2568 (งวดที่ 6)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
