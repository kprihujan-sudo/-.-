import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Asset,
  MaintenanceJob,
  MaintenanceSchedule,
  BorrowRecord,
  DisposalRecord,
  UserProfile,
  InventoryCountRecord,
  OfflineQueueItem,
  FoundStatus,
} from '../types';
import {
  INITIAL_ASSETS,
  INITIAL_MAINTENANCE_JOBS,
  INITIAL_SCHEDULES,
  INITIAL_BORROWS,
  INITIAL_DISPOSALS,
  INITIAL_INVENTORY_COUNTS,
  DEMO_USERS,
} from '../data/initialData';

interface AppContextType {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  currentOrg: string;
  setCurrentOrg: (org: string) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  offlineQueue: OfflineQueueItem[];
  assets: Asset[];
  maintenanceJobs: MaintenanceJob[];
  maintenanceSchedules: MaintenanceSchedule[];
  borrowRecords: BorrowRecord[];
  disposalRecords: DisposalRecord[];
  inventoryCounts: InventoryCountRecord[];
  
  // Actions
  addAsset: (asset: Omit<Asset, 'id' | 'assetNo' | 'qrToken' | 'status' | 'accumulatedDep' | 'netBookValue'>) => Asset;
  updateAsset: (id: number, updates: Partial<Asset>) => void;
  deleteAsset: (id: number, reason: string) => void;
  
  addMaintenanceJob: (job: Omit<MaintenanceJob, 'id' | 'ticketNo' | 'reportedAt'>) => MaintenanceJob;
  updateMaintenanceStatus: (jobId: number, status: MaintenanceJob['status'], actionTaken?: string, cost?: number, photosAfter?: string[]) => void;
  
  addBorrowRecord: (borrow: Omit<BorrowRecord, 'id' | 'docNo' | 'status'>) => void;
  returnAsset: (borrowId: number) => void;
  
  addInventoryCount: (count: {
    assetId: number;
    assetNo: string;
    assetName: string;
    expectedLocation: string;
    actualLocation: string;
    foundStatus: FoundStatus;
    photos: string[];
    remark?: string;
  }) => void;

  proposeDisposal: (disposal: Omit<DisposalRecord, 'id' | 'docNo' | 'proposedDate' | 'status'>) => void;
  approveDisposal: (disposalId: number) => void;

  syncOfflineData: () => Promise<{ success: boolean; count: number }>;
  clearOfflineQueue: () => void;
  
  alerts: {
    overdueBorrows: number;
    pmDueCount: number;
    warrantyExpiringCount: number;
    uncountedCount: number;
    pendingRepairCount: number;
    totalAlerts: number;
  };
  
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedAssetForDetail: Asset | null;
  setSelectedAssetForDetail: (asset: Asset | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isPrioritizationModalOpen: boolean;
  setIsPrioritizationModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ASSETS = 'thai_asset_registry_assets_v1';
const LOCAL_STORAGE_KEY_MAINTENANCE = 'thai_asset_registry_maint_v1';
const LOCAL_STORAGE_KEY_COUNTS = 'thai_asset_registry_counts_v1';
const LOCAL_STORAGE_KEY_BORROWS = 'thai_asset_registry_borrows_v1';
const LOCAL_STORAGE_KEY_DISPOSALS = 'thai_asset_registry_disposals_v1';
const LOCAL_STORAGE_KEY_OFFLINE_QUEUE = 'thai_asset_registry_offline_queue_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DEMO_USERS[0]);
  const [currentOrg, setCurrentOrg] = useState<string>('โรงพยาบาลเมืองใหม่ สสจ.');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedAssetForDetail, setSelectedAssetForDetail] = useState<Asset | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isPrioritizationModalOpen, setIsPrioritizationModalOpen] = useState<boolean>(false);

  // Initialize from LocalStorage or Fallback
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ASSETS);
    return saved ? JSON.parse(saved) : INITIAL_ASSETS;
  });

  const [maintenanceJobs, setMaintenanceJobs] = useState<MaintenanceJob[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_MAINTENANCE);
    return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_JOBS;
  });

  const [maintenanceSchedules, setMaintenanceSchedules] = useState<MaintenanceSchedule[]>(INITIAL_SCHEDULES);

  const [borrowRecords, setBorrowRecords] = useState<BorrowRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BORROWS);
    return saved ? JSON.parse(saved) : INITIAL_BORROWS;
  });

  const [disposalRecords, setDisposalRecords] = useState<DisposalRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DISPOSALS);
    return saved ? JSON.parse(saved) : INITIAL_DISPOSALS;
  });

  const [inventoryCounts, setInventoryCounts] = useState<InventoryCountRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_COUNTS);
    return saved ? JSON.parse(saved) : INITIAL_INVENTORY_COUNTS;
  });

  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_OFFLINE_QUEUE);
    return saved ? JSON.parse(saved) : [];
  });

  // Sync to LocalStorage on state change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ASSETS, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_MAINTENANCE, JSON.stringify(maintenanceJobs));
  }, [maintenanceJobs]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_BORROWS, JSON.stringify(borrowRecords));
  }, [borrowRecords]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_DISPOSALS, JSON.stringify(disposalRecords));
  }, [disposalRecords]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_COUNTS, JSON.stringify(inventoryCounts));
  }, [inventoryCounts]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_OFFLINE_QUEUE, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  // Handle Online Event auto-sync
  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      if (offlineQueue.length > 0) {
        syncOfflineData();
      }
    };
    const handleOffline = () => {
      setIsOffline(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [offlineQueue.length]);

  // Compute Alerts
  const alerts = useMemo(() => {
    const overdueBorrows = borrowRecords.filter((b) => b.status === 'OVERDUE').length;
    const pmDueCount = maintenanceSchedules.filter((s) => s.isOverdue || s.daysUntilDue <= 30).length;
    
    const now = new Date();
    const ninetyDaysLater = new Date();
    ninetyDaysLater.setDate(now.getDate() + 90);
    
    const warrantyExpiringCount = assets.filter((a) => {
      if (!a.warrantyEnd) return false;
      const wDate = new Date(a.warrantyEnd);
      return wDate > now && wDate <= ninetyDaysLater;
    }).length;

    const countedAssetIds = new Set(inventoryCounts.map((c) => c.assetId));
    const uncountedCount = assets.filter((a) => !countedAssetIds.has(a.id)).length;
    const pendingRepairCount = maintenanceJobs.filter((j) => j.status === 'OPEN' || j.status === 'IN_PROGRESS').length;

    const totalAlerts = overdueBorrows + pmDueCount + warrantyExpiringCount + pendingRepairCount;

    return {
      overdueBorrows,
      pmDueCount,
      warrantyExpiringCount,
      uncountedCount,
      pendingRepairCount,
      totalAlerts,
    };
  }, [borrowRecords, maintenanceSchedules, assets, inventoryCounts, maintenanceJobs]);

  // Action: Add Asset
  const addAsset = (data: Omit<Asset, 'id' | 'assetNo' | 'qrToken' | 'status' | 'accumulatedDep' | 'netBookValue'>): Asset => {
    const newId = Date.now();
    const runningNum = String(assets.length + 1).padStart(4, '0');
    const fyShort = String(data.fiscalYear).slice(-2);
    const assetNo = `10670-${data.categoryCode}-001-${runningNum}/${fyShort}`;
    const qrToken = `qr-asset-${newId}`;

    let accumulatedDep = 0;
    let netBookValue = data.unitCost;
    if (data.isDepreciable && data.unitCost >= 5000) {
      netBookValue = data.unitCost;
    }

    const newAsset: Asset = {
      ...data,
      id: newId,
      assetNo,
      qrToken,
      status: 'IN_USE',
      accumulatedDep,
      netBookValue,
    };

    if (isOffline) {
      const queueItem: OfflineQueueItem = {
        id: `queue-${Date.now()}`,
        type: 'ASSET_CREATE',
        payload: newAsset,
        createdAt: new Date().toISOString(),
        retryCount: 0,
      };
      setOfflineQueue((prev) => [...prev, queueItem]);
    }

    setAssets((prev) => [newAsset, ...prev]);
    return newAsset;
  };

  // Action: Update Asset
  const updateAsset = (id: number, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, ...updates } : asset))
    );
  };

  // Action: Delete Asset (Soft delete / audit)
  const deleteAsset = (id: number, reason: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Action: Add Maintenance Job
  const addMaintenanceJob = (jobData: Omit<MaintenanceJob, 'id' | 'ticketNo' | 'reportedAt'>): MaintenanceJob => {
    const newId = Date.now();
    const ticketNo = `MA-2568-${String(maintenanceJobs.length + 1).padStart(4, '0')}`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newJob: MaintenanceJob = {
      ...jobData,
      id: newId,
      ticketNo,
      reportedAt: nowStr,
    };

    if (isOffline) {
      const queueItem: OfflineQueueItem = {
        id: `queue-maint-${Date.now()}`,
        type: 'MAINTENANCE',
        payload: newJob,
        createdAt: new Date().toISOString(),
        retryCount: 0,
      };
      setOfflineQueue((prev) => [...prev, queueItem]);
    }

    setMaintenanceJobs((prev) => [newJob, ...prev]);

    // Update asset status to REPAIR if repair
    if (jobData.jobType === 'REPAIR') {
      updateAsset(jobData.assetId, { status: 'REPAIR' });
    }

    return newJob;
  };

  // Action: Update Maintenance Status
  const updateMaintenanceStatus = (
    jobId: number,
    status: MaintenanceJob['status'],
    actionTaken?: string,
    cost?: number,
    photosAfter?: string[]
  ) => {
    const completedAt = status === 'COMPLETED' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : undefined;
    
    setMaintenanceJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          const updated = {
            ...job,
            status,
            ...(actionTaken ? { actionTaken } : {}),
            ...(cost !== undefined ? { cost } : {}),
            ...(photosAfter ? { photosAfter } : {}),
            ...(completedAt ? { completedAt } : {}),
          };
          // If completed, set asset back to IN_USE
          if (status === 'COMPLETED') {
            updateAsset(job.assetId, { status: 'IN_USE' });
          }
          return updated;
        }
        return job;
      })
    );
  };

  // Action: Borrow Record
  const addBorrowRecord = (borrowData: Omit<BorrowRecord, 'id' | 'docNo' | 'status'>) => {
    const newId = Date.now();
    const docNo = `ยม.2568/${String(borrowRecords.length + 1).padStart(4, '0')}`;
    const newBorrow: BorrowRecord = {
      ...borrowData,
      id: newId,
      docNo,
      status: 'BORROWED',
    };

    if (isOffline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: `queue-borrow-${Date.now()}`,
          type: 'BORROW',
          payload: newBorrow,
          createdAt: new Date().toISOString(),
          retryCount: 0,
        },
      ]);
    }

    setBorrowRecords((prev) => [newBorrow, ...prev]);
    updateAsset(borrowData.assetId, { status: 'BORROWED' });
  };

  // Action: Return Asset
  const returnAsset = (borrowId: number) => {
    const today = new Date().toISOString().slice(0, 10);
    const item = borrowRecords.find((b) => b.id === borrowId);
    if (item) {
      updateAsset(item.assetId, { status: 'IN_USE' });
    }
    setBorrowRecords((prev) =>
      prev.map((b) => (b.id === borrowId ? { ...b, status: 'RETURNED', returnDate: today } : b))
    );
  };

  // Action: Add Inventory Count Record (Physical Count / Mobile Scanner)
  const addInventoryCount = (countData: {
    assetId: number;
    assetNo: string;
    assetName: string;
    expectedLocation: string;
    actualLocation: string;
    foundStatus: FoundStatus;
    photos: string[];
    remark?: string;
  }) => {
    const clientUuid = `uuid-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16);
    
    const countRecord: InventoryCountRecord = {
      id: `cnt-${Date.now()}`,
      clientUuid,
      roundId: 2568,
      ...countData,
      countedAt: nowStr,
      countedBy: currentUser.fullName,
      synced: !isOffline,
    };

    if (isOffline) {
      setOfflineQueue((prev) => [
        ...prev,
        {
          id: `queue-count-${Date.now()}`,
          type: 'COUNT',
          payload: countRecord,
          createdAt: new Date().toISOString(),
          retryCount: 0,
        },
      ]);
    }

    setInventoryCounts((prev) => [countRecord, ...prev]);

    // Update asset last counted date
    updateAsset(countData.assetId, {
      lastCountedDate: countData.actualLocation ? nowStr.slice(0, 10) : undefined,
      status: countData.foundStatus === 'DAMAGED' ? 'DAMAGED' : countData.foundStatus === 'NOT_FOUND' ? 'LOST' : 'IN_USE',
    });
  };

  // Action: Propose Disposal
  const proposeDisposal = (data: Omit<DisposalRecord, 'id' | 'docNo' | 'proposedDate' | 'status'>) => {
    const newId = Date.now();
    const docNo = `จพ.2568/${String(disposalRecords.length + 1).padStart(4, '0')}`;
    const today = new Date().toISOString().slice(0, 10);
    const newDisposal: DisposalRecord = {
      ...data,
      id: newId,
      docNo,
      proposedDate: today,
      status: 'PENDING_REVIEW',
    };
    setDisposalRecords((prev) => [newDisposal, ...prev]);
    updateAsset(data.assetId, { status: 'PENDING_DISPOSAL' });
  };

  // Action: Approve Disposal
  const approveDisposal = (disposalId: number) => {
    const today = new Date().toISOString().slice(0, 10);
    const item = disposalRecords.find((d) => d.id === disposalId);
    if (item) {
      updateAsset(item.assetId, { status: 'DISPOSED' });
    }
    setDisposalRecords((prev) =>
      prev.map((d) => (d.id === disposalId ? { ...d, status: 'APPROVED', approvedDate: today } : d))
    );
  };

  // Action: Offline Batch Sync
  const syncOfflineData = async (): Promise<{ success: boolean; count: number }> => {
    const count = offlineQueue.length;
    if (count === 0) {
      return { success: true, count: 0 };
    }

    // Simulate network latency / cloud sync
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Mark all counts as synced
    setInventoryCounts((prev) => prev.map((c) => ({ ...c, synced: true })));

    // Clear queue
    setOfflineQueue([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY_OFFLINE_QUEUE);

    // Trigger celebration effect
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
    });

    return { success: true, count };
  };

  const clearOfflineQueue = () => {
    setOfflineQueue([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY_OFFLINE_QUEUE);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        currentOrg,
        setCurrentOrg,
        isOffline,
        setIsOffline,
        offlineQueue,
        assets,
        maintenanceJobs,
        maintenanceSchedules,
        borrowRecords,
        disposalRecords,
        inventoryCounts,
        addAsset,
        updateAsset,
        deleteAsset,
        addMaintenanceJob,
        updateMaintenanceStatus,
        addBorrowRecord,
        returnAsset,
        addInventoryCount,
        proposeDisposal,
        approveDisposal,
        syncOfflineData,
        clearOfflineQueue,
        alerts,
        searchQuery,
        setSearchQuery,
        activeView,
        setActiveView,
        selectedAssetForDetail,
        setSelectedAssetForDetail,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isPrioritizationModalOpen,
        setIsPrioritizationModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
