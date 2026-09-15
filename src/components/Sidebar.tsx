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
  Shield,
  Filter,
  Lock,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeView,
    setActiveView,
    setIsCreateModalOpen,
    alerts,
    currentUser,
    isAdminUser,
    organizations,
    selectedOrgFilter,
    setSelectedOrgFilter,
    selectedDeptFilter,
    setSelectedDeptFilter,
    setIsLoginModalOpen,
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

  // Derive department options based on selected organization filter or user's org
  const activeOrgObj = organizations.find((o) =>
    isAdminUser
      ? (selectedOrgFilter !== 'ALL' ? o.id === selectedOrgFilter : o.id === 'org-1')
      : o.id === currentUser.orgId
  ) || organizations[0];

  return (
    <aside className="w-68 bg-white border-r border-slate-200 shrink-0 flex flex-col justify-between hidden md:flex h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Quick Action: New Asset Registration */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ ขึ้นทะเบียนครุภัณฑ์ใหม่</span>
        </button>

        {/* Tenant Organization Context & Filter */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <span className="flex items-center gap-1.5 text-blue-900">
              <Building className="w-3.5 h-3.5 text-blue-700" />
              <span>สังกัดหน่วยงาน</span>
            </span>
            {isAdminUser ? (
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                Admin
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-500 flex items-center gap-0.5">
                <Lock className="w-2.5 h-2.5" />
                <span>จำกัดสิทธิ์</span>
              </span>
            )}
          </div>

          {isAdminUser ? (
            /* Admin filter allowing view of ANY of the 15 units or ALL */
            <div className="space-y-1.5">
              <label className="text-[10px] text-slate-500 font-medium block">
                กรองข้อมูล 15 หน่วยงาน จ.สตูล:
              </label>
              <select
                value={selectedOrgFilter}
                onChange={(e) => {
                  setSelectedOrgFilter(e.target.value);
                  setSelectedDeptFilter('ALL');
                }}
                className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-300 rounded-lg p-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="ALL">🌐 ทุกหน่วยงาน (ทั้งจังหวัด 15 แห่ง)</option>
                <optgroup label="ศูนย์กลางระดับจังหวัด">
                  <option value="org-1">สำนักงานสาธารณสุขจังหวัดสตูล</option>
                </optgroup>
                <optgroup label="โรงพยาบาลทั่วไป/ชุมชน (7 แห่ง)">
                  {organizations
                    .filter((o) => o.type === 'HOSPITAL')
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="สำนักงานสาธารณสุขอำเภอ (7 แห่ง)">
                  {organizations
                    .filter((o) => o.type === 'DHO')
                    .map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name}
                      </option>
                    ))}
                </optgroup>
              </select>

              {/* Department filter when specific org is selected */}
              {selectedOrgFilter !== 'ALL' && (
                <div className="pt-1">
                  <label className="text-[10px] text-slate-500 font-medium block mb-1">
                    แผนก/กลุ่มงาน:
                  </label>
                  <select
                    value={selectedDeptFilter}
                    onChange={(e) => setSelectedDeptFilter(e.target.value)}
                    className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="ALL">ทุกแผนกในหน่วยงาน</option>
                    {activeOrgObj.departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ) : (
            /* Non-admin user view: Locked to their own organization */
            <div className="space-y-1.5">
              <div className="bg-white border border-slate-200 rounded-lg p-2 text-xs">
                <div className="font-semibold text-slate-800 truncate" title={currentUser.orgName}>
                  {currentUser.orgName}
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  รหัส {activeOrgObj.code} · {currentUser.department}
                </div>
              </div>

              {/* Department sub-filter within their own facility */}
              <div>
                <label className="text-[10px] text-slate-500 font-medium block mb-1">
                  แผนกภายในหน่วยงาน:
                </label>
                <select
                  value={selectedDeptFilter}
                  onChange={(e) => setSelectedDeptFilter(e.target.value)}
                  className="w-full text-xs text-slate-700 bg-white border border-slate-200 rounded-lg p-1.5 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                >
                  <option value="ALL">ทุกแผนกใน {currentUser.orgName.split(' ')[0]}</option>
                  {activeOrgObj.departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              <span>ฐานข้อมูลคลาวด์ สสจ.</span>
            </span>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="text-blue-700 hover:text-blue-900 font-medium hover:underline cursor-pointer"
            >
              สลับผู้ใช้
            </button>
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
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 font-semibold shadow-2xs'
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
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-blue-700" />
            <span>ระบบ พ.ร.บ. พัสดุ ๒๕๖๐</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            สำนักงานสาธารณสุขจังหวัดสตูล และเครือข่ายบริการสุขภาพ 15 แห่ง
          </div>
        </div>
      </div>
    </aside>
  );
};
