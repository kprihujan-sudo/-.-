import React, { useState, useMemo } from 'react';
import {
  X,
  Shield,
  Building2,
  User,
  KeyRound,
  CheckCircle2,
  Lock,
  Hospital,
  Briefcase,
  Layers,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SATUN_ORGANIZATIONS } from '../../types';
import { DEMO_USERS } from '../../data/initialData';

export const LoginModal: React.FC = () => {
  const {
    currentUser,
    login,
    isLoginModalOpen,
    setIsLoginModalOpen,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'quick' | 'form'>('quick');
  const [selectedOrgId, setSelectedOrgId] = useState<string>(currentUser.orgId || 'org-1');
  const [selectedUserId, setSelectedUserId] = useState<number>(currentUser.id);

  // Form tab credentials state
  const [usernameInput, setUsernameInput] = useState<string>('');
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  const currentSelectedOrg = useMemo(() => {
    return SATUN_ORGANIZATIONS.find((o) => o.id === selectedOrgId) || SATUN_ORGANIZATIONS[0];
  }, [selectedOrgId]);

  const orgUsers = useMemo(() => {
    return DEMO_USERS.filter((u) => u.orgId === selectedOrgId);
  }, [selectedOrgId]);

  if (!isLoginModalOpen) return null;

  const handleQuickLogin = (userId: number) => {
    const targetUser = DEMO_USERS.find((u) => u.id === userId);
    if (targetUser) {
      login(targetUser);
    }
  };

  const handleFormLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const targetUser = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === usernameInput.trim().toLowerCase()
    );

    if (!targetUser) {
      setAuthError('ไม่พบชื่อผู้ใช้งานนี้ในระบบฐานข้อมูล 15 หน่วยงาน จ.สตูล');
      return;
    }

    login(targetUser);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-900 via-sky-800 to-indigo-900 px-6 py-5 text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white backdrop-blur-xs shadow-inner">
              <Building2 className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold">ระบบยืนยันตัวตนแยกตามสังกัดหน่วยงาน</h3>
                <span className="text-[10px] uppercase font-semibold bg-sky-400/20 text-sky-200 border border-sky-400/30 px-2 py-0.5 rounded-full">
                  จ.สตูล 15 หน่วยงาน
                </span>
              </div>
              <p className="text-xs text-sky-100/80 mt-0.5">
                กำหนดสิทธิ์การเข้าถึงทะเบียนทรัพย์สินและครุภัณฑ์แยกตามหน่วยงานและแผนก
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active User Banner */}
        <div className="bg-blue-50/70 border-b border-blue-100 px-6 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <span className="text-slate-500">บัญชีที่ใช้งานอยู่ปัจจุบัน:</span>
            <span className="font-semibold text-blue-900">{currentUser.fullName}</span>
            <span className="bg-blue-200/70 text-blue-800 px-2 py-0.5 rounded-md font-medium text-[11px]">
              {currentUser.roleLabel}
            </span>
          </div>
          <span className="font-medium text-slate-600 truncate max-w-[200px]" title={currentUser.orgName}>
            📍 {currentUser.orgName}
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 px-6 pt-3 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('quick')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'border-blue-700 text-blue-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>เลือกเข้าใช้งานตาม 15 หน่วยงาน (Quick Access)</span>
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'form'
                ? 'border-blue-700 text-blue-800'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>ลงชื่อเข้าใช้งานด้วย Username</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {activeTab === 'quick' ? (
            <div className="space-y-4">
              {/* Organization Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>1. เลือกสังกัดหน่วยงาน (15 หน่วยงานสาธารณสุข จ.สตูล):</span>
                  {currentSelectedOrg.hasAdminRole ? (
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ⭐ สิทธิ์ผู้ดูแลระบบระดับจังหวัด (Super Admin)
                    </span>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium bg-slate-100 px-2 py-0.5 rounded">
                      🔒 สิทธิ์เฉพาะหน่วยงานตนเอง
                    </span>
                  )}
                </label>
                <select
                  value={selectedOrgId}
                  onChange={(e) => {
                    setSelectedOrgId(e.target.value);
                    const firstUserOfOrg = DEMO_USERS.find((u) => u.orgId === e.target.value);
                    if (firstUserOfOrg) setSelectedUserId(firstUserOfOrg.id);
                  }}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <optgroup label="ศูนย์กลางระดับจังหวัด">
                    {SATUN_ORGANIZATIONS.filter((o) => o.type === 'PROVINCIAL_HQ').map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} (สิทธิ์ผู้ดูแลระบบ สสจ.)
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="โรงพยาบาลทั่วไปและโรงพยาบาลชุมชน (7 แห่ง)">
                    {SATUN_ORGANIZATIONS.filter((o) => o.type === 'HOSPITAL').map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.district})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="สำนักงานสาธารณสุขอำเภอ (7 แห่ง)">
                    {SATUN_ORGANIZATIONS.filter((o) => o.type === 'DHO').map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.district})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Organization Info Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs flex items-start gap-3">
                <Building2 className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                    <span>{currentSelectedOrg.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      (รหัส {currentSelectedOrg.code})
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    ประเภท: {currentSelectedOrg.typeLabel} · อำเภอ: {currentSelectedOrg.district}
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {currentSelectedOrg.departments.slice(0, 4).map((d) => (
                      <span
                        key={d}
                        className="bg-white border border-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-sm"
                      >
                        {d}
                      </span>
                    ))}
                    {currentSelectedOrg.departments.length > 4 && (
                      <span className="text-[10px] text-slate-400 py-0.5">
                        +{currentSelectedOrg.departments.length - 4} แผนก
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Users under Selected Organization */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  2. เลือกตำแหน่ง/ผู้ใช้งานเพื่อเข้าสู่ระบบ:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {orgUsers.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleQuickLogin(user.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-left flex items-start justify-between ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-600 ring-1 ring-blue-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-xs text-slate-900 flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5 text-blue-700" />
                            <span>{user.fullName}</span>
                          </div>
                          <div className="text-[11px] text-slate-600 mt-0.5">{user.position}</div>
                          <div className="text-[10px] text-blue-700 font-medium mt-1">
                            {user.roleLabel}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            สังกัด: {user.department}
                          </div>
                        </div>

                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" /> กำลังใช้งาน
                          </span>
                        ) : (
                          <button
                            type="button"
                            className="text-[11px] text-blue-700 font-medium hover:underline flex items-center gap-1 shrink-0 pt-1"
                          >
                            <span>เข้าสู่ระบบ</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleFormLogin} className="space-y-4 max-w-md mx-auto py-2">
              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
                  <Info className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  ชื่อผู้ใช้งาน (Username)
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value)}
                    placeholder="เช่น admin.satun, director.langu, nurse.satun"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  ทดสอบได้ด้วย: <code className="text-blue-700">admin.satun</code> (สสจ. สตูล),{' '}
                  <code className="text-blue-700">director.langu</code> (รพ.ละงู),{' '}
                  <code className="text-blue-700">supply.satunhosp</code> (รพ.สตูล)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  รหัสผ่าน (Password)
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  *ในโหมดสาธิต สามารถใส่รหัสผ่านใดก็ได้ หรือเว้นว่างไว้
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-colors flex items-center justify-center gap-2 mt-4"
              >
                <Lock className="w-4 h-4" />
                <span>เข้าสู่ระบบตามสิทธิ์หน่วยงาน</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer Note */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>ระบบรักษาความปลอดภัยตาม พ.ร.บ. คุ้มครองข้อมูลและ พ.ร.บ. จัดซื้อจัดจ้าง ๒๕๖๐</span>
          </div>
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
