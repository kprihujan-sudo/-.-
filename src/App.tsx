/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DashboardView } from './components/views/DashboardView';
import { AssetListView } from './components/views/AssetListView';
import { MaintenanceView } from './components/views/MaintenanceView';
import { InventoryCountView } from './components/views/InventoryCountView';
import { MovementsView } from './components/views/MovementsView';
import { DisposalView } from './components/views/DisposalView';
import { ReportsView } from './components/views/ReportsView';
import { RoadmapView } from './components/views/RoadmapView';
import { AssetCreateWizard } from './components/modals/AssetCreateWizard';
import { AssetDetailModal } from './components/modals/AssetDetailModal';
import { AssetEditModal } from './components/modals/AssetEditModal';
import { LoginModal } from './components/modals/LoginModal';

const MainLayout: React.FC = () => {
  const { activeView } = useApp();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'assets':
        return <AssetListView />;
      case 'maintenance':
        return <MaintenanceView />;
      case 'inventory':
        return <InventoryCountView />;
      case 'movements':
        return <MovementsView />;
      case 'disposal':
        return <DisposalView />;
      case 'reports':
        return <ReportsView />;
      case 'roadmap':
        return <RoadmapView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Prompt',sans-serif] text-slate-800 antialiased selection:bg-blue-600 selection:text-white pb-16 md:pb-0">
      {/* Top Fixed Header */}
      <Header />

      {/* Main Workspace with Sticky Sidebar */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto p-3 sm:p-4 md:p-6 gap-6">
        {/* Left Sidebar (Desktop) */}
        <Sidebar />

        {/* View Canvas */}
        <main className="flex-1 min-w-0">
          {renderCurrentView()}
        </main>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileBottomNav />

      {/* Modals */}
      <AssetCreateWizard />
      <AssetDetailModal />
      <AssetEditModal />
      <LoginModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
