import React, { useState } from 'react';
import {
  Bell,
  Wifi,
  WifiOff,
  RefreshCw,
  User,
  Shield,
  Building2,
  ChevronDown,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMO_USERS } from '../data/initialData';

export const Header: React.FC = () => {
  const {
    currentUser,
    setCurrentUser,
    currentOrg,
    setCurrentOrg,
    isOffline,
    setIsOffline,
    offlineQueue,
    syncOfflineData,
    alerts,
    searchQuery,
    setSearchQuery,
    setActiveView,
    setIsPrioritizationModalOpen,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await syncOfflineData();
    setIsSyncing(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand & Emblem */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-sky-700 via-blue-800 to-indigo-900 flex items-center justify-center text-white shadow-sm border border-blue-900/20">
              <span className="font-bold text-xs tracking-wider">สสจ.</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-900 text-sm sm:text-base leading-tight">
                  ระบบทะเบียนทรัพย์สินและครุภัณฑ์
                </span>
                <span className="hidden sm:inline-flex text-[11px] font-medium bg-blue-50 text-blue-800 border border-blue-200/80 px-2 py-0.5 rounded-full">
                  พ.ร.บ. พัสดุ ๒๕๖๐
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden md:block">
                สำนักงานสาธารณสุขจังหวัด · กรมบัญชีกลาง &amp; GFMIS
              </p>
            </div>
          </div>

          {/* Search Bar in Header */}
          <div className="flex-1 max-w-xs md:max-w-md hidden lg:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อครุภัณฑ์, เลขครุภัณฑ์, S/N, ยี่ห้อ..."
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Roadmap & Prioritization Guide Button */}
            <button
              onClick={() => setIsPrioritizationModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
              title="ดูแผนจัดลำดับความสำคัญของฟีเจอร์ตามที่สอบถาม"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>ลำดับความสำคัญ</span>
            </button>

            {/* Offline Simulator Switch */}
            <div className="flex items-center">
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isOffline
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                }`}
                title="คลิกเพื่อจำลองสภาวะมี/ไม่มีสัญญาณเน็ต เพื่อทดสอบ Offline & Auto-Sync"
              >
                {isOffline ? (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                    <span>ออฟไลน์</span>
                  </>
                ) : (
                  <>
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="hidden sm:inline">ออนไลน์</span>
                  </>
                )}
              </button>
            </div>

            {/* Offline Sync Queue Pill */}
            {offlineQueue.length > 0 && (
              <button
                onClick={handleSyncClick}
                disabled={isOffline || isSyncing}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isOffline
                    ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed'
                    : 'bg-blue-600 text-white border-blue-700 hover:bg-blue-700 shadow-xs'
                }`}
                title={isOffline ? 'เปิดโหมดออนไลน์ก่อนทำการซิงค์' : 'คลิกเพื่อซิงค์ข้อมูลขึ้นคลาวด์'}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>รอซิงค์ {offlineQueue.length}</span>
              </button>
            )}

            {/* Alerts Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsAlertsOpen(!isAlertsOpen)}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="การแจ้งเตือนรอบตรวจสอบและงานด่วน"
              >
                <Bell className="w-4 h-4" />
                {alerts.totalAlerts > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    {alerts.totalAlerts}
                  </span>
                )}
              </button>

              {/* Alerts Dropdown Panel */}
              {isAlertsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-88 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 text-left">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      รายการแจ้งเตือนที่ต้องดำเนินการ
                    </span>
                    <span className="text-[11px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md font-medium">
                      {alerts.totalAlerts} รายการ
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {alerts.overdueBorrows > 0 && (
                      <div
                        onClick={() => {
                          setActiveView('movements');
                          setIsAlertsOpen(false);
                        }}
                        className="p-3 hover:bg-rose-50/60 cursor-pointer transition-colors flex items-start gap-2.5"
                      >
                        <div className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-medium text-rose-900">ยืมครุภัณฑ์เกินกำหนดส่งคืน</p>
                          <p className="text-slate-500 mt-0.5">
                            มี {alerts.overdueBorrows} รายการเกินกำหนดส่งคืน ต้องติดตาม
                          </p>
                        </div>
                      </div>
                    )}

                    {alerts.pmDueCount > 0 && (
                      <div
                        onClick={() => {
                          setActiveView('maintenance');
                          setIsAlertsOpen(false);
                        }}
                        className="p-3 hover:bg-amber-50/60 cursor-pointer transition-colors flex items-start gap-2.5"
                      >
                        <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-medium text-amber-900">รอบ PM / สอบเทียบเครื่องมือแพทย์</p>
                          <p className="text-slate-500 mt-0.5">
                            มี {alerts.pmDueCount} รายการที่ครบกำหนดหรือใกล้ถึงรอบใน 30 วัน
                          </p>
                        </div>
                      </div>
                    )}

                    {alerts.warrantyExpiringCount > 0 && (
                      <div
                        onClick={() => {
                          setActiveView('assets');
                          setIsAlertsOpen(false);
                        }}
                        className="p-3 hover:bg-blue-50/60 cursor-pointer transition-colors flex items-start gap-2.5"
                      >
                        <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-medium text-blue-900">ประกันใกล้หมดอายุ (ภายใน 90 วัน)</p>
                          <p className="text-slate-500 mt-0.5">
                            มี {alerts.warrantyExpiringCount} รายการ เตรียมต่อสัญญา MA
                          </p>
                        </div>
                      </div>
                    )}

                    {alerts.uncountedCount > 0 && (
                      <div
                        onClick={() => {
                          setActiveView('inventory');
                          setIsAlertsOpen(false);
                        }}
                        className="p-3 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-2.5"
                      >
                        <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                        <div>
                          <p className="font-medium text-slate-800">รอบตรวจนับพัสดุประจำปี 2568</p>
                          <p className="text-slate-500 mt-0.5">
                            ยังไม่ได้ตรวจนับ {alerts.uncountedCount} รายการ
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* RBAC Role & Profile Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-slate-200"
              >
                <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                  {currentUser.fullName.slice(3, 4) || 'ส'}
                </div>
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.fullName}
                  </div>
                  <div className="text-[10px] text-blue-700 font-medium">
                    {currentUser.roleLabel.split(' ')[0]}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Role Switcher Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-semibold text-slate-900">{currentUser.fullName}</p>
                    <p className="text-[11px] text-slate-500">{currentUser.position}</p>
                    <p className="text-[11px] text-blue-700 mt-0.5 font-medium">{currentUser.department}</p>
                  </div>

                  <div className="px-3 py-1.5">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      สลับสิทธิ์การใช้งาน (RBAC Demo)
                    </span>
                    <div className="space-y-1">
                      {DEMO_USERS.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => {
                            setCurrentUser(user);
                            setIsUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                            user.id === currentUser.id
                              ? 'bg-blue-50 text-blue-900 font-medium'
                              : 'text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-[10px] text-slate-500">{user.roleLabel}</div>
                          </div>
                          {user.id === currentUser.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
