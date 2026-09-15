import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  PlusCircle,
  Wrench,
  QrCode,
  Layers,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { activeView, setActiveView, setIsCreateModalOpen, alerts } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveView('dashboard')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeView === 'dashboard' ? 'text-blue-700 font-bold' : 'text-slate-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>หน้าแรก</span>
      </button>

      <button
        onClick={() => setActiveView('assets')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeView === 'assets' ? 'text-blue-700 font-bold' : 'text-slate-500'
        }`}
      >
        <Boxes className="w-5 h-5 mb-0.5" />
        <span>ทะเบียน</span>
      </button>

      {/* Quick Add Button Center */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="flex flex-col items-center -mt-4 bg-blue-700 text-white p-2.5 rounded-full shadow-md active:scale-95 transition-transform"
      >
        <PlusCircle className="w-6 h-6" />
      </button>

      <button
        onClick={() => setActiveView('inventory')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium relative transition-colors ${
          activeView === 'inventory' ? 'text-blue-700 font-bold' : 'text-slate-500'
        }`}
      >
        <QrCode className="w-5 h-5 mb-0.5" />
        <span>ตรวจนับ</span>
        {alerts.uncountedCount > 0 && (
          <span className="absolute top-0 right-1 w-2 h-2 bg-blue-600 rounded-full" />
        )}
      </button>

      <button
        onClick={() => setActiveView('maintenance')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium relative transition-colors ${
          activeView === 'maintenance' ? 'text-blue-700 font-bold' : 'text-slate-500'
        }`}
      >
        <Wrench className="w-5 h-5 mb-0.5" />
        <span>ซ่อมบำรุง</span>
        {alerts.pendingRepairCount > 0 && (
          <span className="absolute top-0 right-1 w-2 h-2 bg-amber-500 rounded-full" />
        )}
      </button>

      <button
        onClick={() => setActiveView('roadmap')}
        className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
          activeView === 'roadmap' ? 'text-indigo-700 font-bold' : 'text-slate-500'
        }`}
      >
        <Layers className="w-5 h-5 mb-0.5" />
        <span>แผนงาน</span>
      </button>
    </div>
  );
};
