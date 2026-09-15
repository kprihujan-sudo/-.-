import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  Wrench,
  QrCode,
  ArrowLeftRight,
  Trash2,
  FileSpreadsheet,
  Layers,
  Sparkles,
  AlertCircle,
  Building,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsCreateModalOpen,
    alerts,
    currentOrg,
    setCurrentOrg,
    currentUser,
  } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'ภาพรวมระบบ',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'assets',
      label: 'ทะเบียนทรัพย์สิน',
      icon: Boxes,
      badge: null,
    },
    {
      id: 'maintenance',
      label: 'ซ่อมบำรุง & PM',
      icon: Wrench,
      badge: alerts.pmDueCount + alerts.pendingRepairCount > 0 ? alerts.pmDueCount + alerts.pendingRepairCount : null,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'inventory',
      label: 'ตรวจนับพัสดุ (สนาม)',
      icon: QrCode,
      badge: alerts.uncountedCount > 0 ? `${alerts.uncountedCount} ค้าง` : null,
      badgeColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'movements',
      label: 'ยืม–คืน ครุภัณฑ์',
      icon: ArrowLeftRight,
      badge: alerts.overdueBorrows > 0 ? `${alerts.overdueBorrows} เกิน` : null,
      badgeColor: 'bg-rose-100 text-rose-800',
    },
    {
      id: 'disposal',
      label: 'จำหน่ายพัสดุ',
      icon: Trash2,
      badge: null,
    },
    {
      id: 'reports',
      label: 'รายงาน & ทะเบียนคุม',
      icon: FileSpreadsheet,
      badge: null,
    },
    {
      id: 'roadmap',
      label: 'แผนลำดับความสำคัญ',
      icon: Layers,
      badge: 'แนะนำ',
      badgeColor: 'bg-indigo-100 text-indigo-800',
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between hidden md:flex h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4 space-y-4">
        {/* Quick Action: New Asset Registration */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ ขึ้นทะเบียนครุภัณฑ์ใหม่</span>
        </button>

        {/* Tenant Organization Context */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <Building className="w-3.5 h-3.5 text-blue-700" />
            หน่วยงานที่ปฏิบัติงาน
          </div>
          <select
            value={currentOrg}
            onChange={(e) => setCurrentOrg(e.target.value)}
            className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          >
            <option value="โรงพยาบาลเมืองใหม่ สสจ.">โรงพยาบาลเมืองใหม่ สสจ.</option>
            <option value="สำนักงานสาธารณสุขจังหวัด (สสจ.)">สำนักงานสาธารณสุขจังหวัด (สสจ.)</option>
            <option value="สสอ. เมือง">สสอ. เมือง</option>
            <option value="รพ.สต. บ้านหนองปลา">รพ.สต. บ้านหนองปลา</option>
            <option value="รพ.สต. บ้านดอนตูม">รพ.สต. บ้านดอนตูม</option>
          </select>
          <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
            <span>รหัสหน่วยงาน: 10670</span>
            <span className="text-emerald-700 font-medium">เชื่อมต่อคลาวด์</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-blue-700' : 'text-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      item.badgeColor || 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="text-xs text-slate-600">
          <div className="font-semibold text-slate-800">ระบบรองรับออฟไลน์ PWA</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            บันทึกข้อมูลและสแกนตรวจนับในจุดอับสัญญาณได้อัตโนมัติ
          </div>
        </div>
      </div>
    </aside>
  );
};
