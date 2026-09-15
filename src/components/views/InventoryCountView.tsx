import React, { useState, useMemo } from 'react';
import {
  QrCode,
  Camera,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Wifi,
  WifiOff,
  RefreshCw,
  Search,
  MapPin,
  FileCheck,
  User,
  ShieldCheck,
  Sparkles,
  Edit3,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FoundStatus, InventoryCountRecord } from '../../types';
import { formatThaiDate } from '../../utils/thaiFiscal';
import { EditInventoryCountModal } from '../modals/EditInventoryCountModal';

export const InventoryCountView: React.FC = () => {
  const {
    assets,
    inventoryCounts,
    addInventoryCount,
    isOffline,
    setIsOffline,
    offlineQueue,
    syncOfflineData,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'scan' | 'checklist' | 'variance'>('scan');
  const [selectedAssetId, setSelectedAssetId] = useState<number>(assets[0]?.id || 0);
  const [editingCountRecord, setEditingCountRecord] = useState<InventoryCountRecord | null>(null);
  const [foundStatus, setFoundStatus] = useState<FoundStatus>('FOUND');
  const [actualLocation, setActualLocation] = useState<string>('');
  const [countRemark, setCountRemark] = useState<string>('');
  const [isScanningSimulated, setIsScanningSimulated] = useState<boolean>(false);
  const [scanQuery, setScanQuery] = useState<string>('');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Selected Asset
  const selectedAsset = useMemo(() => {
    return assets.find((a) => a.id === Number(selectedAssetId)) || assets[0];
  }, [assets, selectedAssetId]);

  // Set default actual location when asset changes
  React.useEffect(() => {
    if (selectedAsset) {
      setActualLocation(selectedAsset.locationPath);
    }
  }, [selectedAsset]);

  // Count statistics for the 2568 round
  const totalAssets = assets.length;
  const countedIds = new Set(inventoryCounts.map((c) => c.assetId));
  const countedCount = countedIds.size;
  const remainingCount = Math.max(0, totalAssets - countedCount);
  const progressPercent = totalAssets > 0 ? Math.round((countedCount / totalAssets) * 100) : 0;

  // Variances
  const damagedCount = inventoryCounts.filter((c) => c.foundStatus === 'DAMAGED').length;
  const notFoundCount = inventoryCounts.filter((c) => c.foundStatus === 'NOT_FOUND').length;
  const locationMismatchCount = inventoryCounts.filter(
    (c) => c.expectedLocation.trim() !== c.actualLocation.trim()
  ).length;

  const handleSimulateScan = (assetId: number) => {
    setSelectedAssetId(assetId);
    setIsScanningSimulated(true);
    setTimeout(() => setIsScanningSimulated(false), 600);
  };

  const handleSaveCount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    addInventoryCount({
      assetId: selectedAsset.id,
      assetNo: selectedAsset.assetNo,
      assetName: selectedAsset.assetName,
      expectedLocation: selectedAsset.locationPath,
      actualLocation: actualLocation || selectedAsset.locationPath,
      foundStatus,
      photos: selectedAsset.photos || [],
      remark: countRemark,
    });

    setCountRemark('');
    alert(
      isOffline
        ? `บันทึกผลการตรวจนับ ${selectedAsset.assetNo} ลงหน่วยความจำเครื่อง (ออฟไลน์) เรียบร้อย! ระบบจะซิงค์ขึ้นคลาวด์อัตโนมัติเมื่อมีสัญญาณเน็ต`
        : `บันทึกผลการตรวจนับ ${selectedAsset.assetNo} สำเร็จและซิงค์คลาวด์เรียบร้อย!`
    );
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncOfflineData();
    setIsSyncing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner with Offline State Indicator */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              ตรวจสอบพัสดุประจำปี 2568 (ภาคสนาม &amp; สแกนเนอร์)
            </h1>
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                isOffline
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>โหมดออฟไลน์ (Offline)</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>โหมดออนไลน์ (Cloud Sync)</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            ตามระเบียบกระทรวงการคลังฯ พ.ศ. 2560 หมวด 9 (คำสั่งแต่งตั้งคณะกรรมการที่ 38/2568)
          </p>
        </div>

        <div className="flex items-center gap-2">
          {offlineQueue.length > 0 && (
            <button
              onClick={handleManualSync}
              disabled={isOffline || isSyncing}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all ${
                isOffline
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>ซิงค์ข้อมูล ({offlineQueue.length} รายการ)</span>
            </button>
          )}

          <button
            onClick={() => setIsOffline(!isOffline)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            {isOffline ? 'เปลี่ยนเป็นออนไลน์' : 'จำลองออฟไลน์'}
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">ความคืบหน้ารวม</span>
          <div className="text-2xl font-bold text-slate-900 mt-1">{progressPercent}%</div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">ตรวจนับแล้ว</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{countedCount}</div>
          <span className="text-[11px] text-slate-400">รายการ</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">คงเหลือต้องนับ</span>
          <div className="text-2xl font-bold text-blue-700 mt-1">{remainingCount}</div>
          <span className="text-[11px] text-slate-400">รายการ</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">พบผลต่าง/ชำรุด</span>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            {damagedCount + notFoundCount + locationMismatchCount}
          </div>
          <span className="text-[11px] text-rose-500 font-medium">รอเสนอคณะกรรมการ</span>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 border-b border-slate-200 text-xs font-semibold pb-1">
        <button
          onClick={() => setActiveTab('scan')}
          className={`px-4 py-2 rounded-t-xl transition-colors ${
            activeTab === 'scan'
              ? 'bg-white border border-b-0 border-slate-200 text-blue-700 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📷 สแกน QR / บันทึกผลหน้างาน
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-4 py-2 rounded-t-xl transition-colors ${
            activeTab === 'checklist'
              ? 'bg-white border border-b-0 border-slate-200 text-blue-700 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          รายการตรวจสอบ (Checklist {assets.length})
        </button>
        <button
          onClick={() => setActiveTab('variance')}
          className={`px-4 py-2 rounded-t-xl transition-colors ${
            activeTab === 'variance'
              ? 'bg-white border border-b-0 border-slate-200 text-blue-700 font-bold shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          รายงานผลต่างที่ต้องรายงาน สตง.
        </button>
      </div>

      {/* TAB 1: SCAN & RECORD */}
      {activeTab === 'scan' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: QR Scanner Simulation */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-blue-700" />
                กล้องสแกน QR Code หน้างาน (PWA Scanner)
              </span>
              <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                ทำงานแบบ Offline ได้
              </span>
            </h2>

            {/* Camera Viewfinder Mockup */}
            <div className="relative w-full aspect-4/3 bg-slate-950 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-400">
              <div className="absolute inset-0 bg-linear-to-b from-blue-500/10 via-transparent to-blue-500/10 animate-pulse pointer-events-none" />

              <div className="w-40 h-40 border-2 border-blue-400 rounded-lg relative flex items-center justify-center">
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white" />
                <QrCode className="w-20 h-20 text-slate-600 animate-pulse" />
              </div>

              <span className="text-xs text-slate-300 mt-4 font-medium">
                {isScanningSimulated ? 'กำลังจับคู่เลขครุภัณฑ์...' : 'ส่องกล้องไปที่สติกเกอร์ QR Code ครุภัณฑ์'}
              </span>
            </div>

            {/* Quick QR Selector Buttons */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                หรือคลิกเลือกครุภัณฑ์เพื่อจำลองการสแกน QR:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 text-xs">
                {assets.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => handleSimulateScan(a.id)}
                    className={`p-2 rounded-lg border text-left transition-colors flex items-center justify-between ${
                      selectedAsset?.id === a.id
                        ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="truncate">
                      <div className="font-mono text-[11px]">{a.assetNo}</div>
                      <div className="truncate text-[10px] text-slate-500">{a.assetName}</div>
                    </div>
                    {countedIds.has(a.id) && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Inspection Result Form */}
          {selectedAsset && (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
              <div className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-blue-900 text-sm">
                    {selectedAsset.assetNo}
                  </span>
                  {countedIds.has(selectedAsset.id) ? (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> ตรวจนับแล้ว
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      ยังไม่ได้นับรอบนี้
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-slate-900 text-sm mt-1">{selectedAsset.assetName}</h3>
                <p className="text-slate-500 text-[11px]">
                  {selectedAsset.brand} {selectedAsset.model} · S/N: {selectedAsset.serialNo}
                </p>
              </div>

              <form onSubmit={handleSaveCount} className="space-y-4">
                {/* Expected Location vs Actual */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                  <div>
                    <span className="text-slate-500 block text-[11px]">สถานที่ตามทะเบียนคุม:</span>
                    <span className="font-semibold text-slate-900 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-700" />
                      {selectedAsset.locationPath}
                    </span>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold text-[11px] mb-1">
                      สถานที่จริงที่พบหน้างาน:
                    </label>
                    <input
                      type="text"
                      value={actualLocation}
                      onChange={(e) => setActualLocation(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-1.5 text-slate-800"
                    />
                    {actualLocation !== selectedAsset.locationPath && (
                      <span className="text-[10px] text-amber-600 font-semibold block mt-1">
                        ⚠ ไม่ตรงกับทะเบียน (ระบบจะบันทึกเป็นรายงานผลต่างเพื่อปรับปรุงที่ตั้ง)
                      </span>
                    )}
                  </div>
                </div>

                {/* Inspection Result Options */}
                <div>
                  <label className="block font-bold text-slate-700 mb-2">
                    ผลการตรวจสอบสภาพครุภัณฑ์ *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFoundStatus('FOUND')}
                      className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                        foundStatus === 'FOUND'
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-400'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>พบ และใช้งานได้ปกติ</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFoundStatus('DAMAGED')}
                      className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                        foundStatus === 'DAMAGED'
                          ? 'bg-amber-50 border-amber-500 text-amber-900 ring-2 ring-amber-400'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>พบ แต่สภาพชำรุด</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFoundStatus('NOT_FOUND')}
                      className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                        foundStatus === 'NOT_FOUND'
                          ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-400'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <XCircle className="w-4 h-4 text-rose-600" />
                        <span>ไม่พบตัวครุภัณฑ์</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFoundStatus('OBSOLETE')}
                      className={`p-2.5 rounded-xl border font-semibold text-left transition-all ${
                        foundStatus === 'OBSOLETE'
                          ? 'bg-purple-50 border-purple-500 text-purple-900 ring-2 ring-purple-400'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-purple-600" />
                        <span>เสื่อมสภาพ/หมดความจำเป็น</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    หมายเหตุเพิ่มเติม / ข้อเสนอแนะคณะกรรมการ
                  </label>
                  <input
                    type="text"
                    value={countRemark}
                    onChange={(e) => setCountRemark(e.target.value)}
                    placeholder="เช่น ขาโต๊ะหัก ส่งซ่อมแล้วไม่คุ้มค่า เสนอแทงจำหน่าย"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div className="pt-2 border-t flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>บันทึกผลการตรวจนับ ({isOffline ? 'บันทึกออฟไลน์' : 'บันทึก & ซิงค์'})</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CHECKLIST TABLE */}
      {activeTab === 'checklist' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden text-xs">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">
              บัญชีรายการตรวจนับพัสดุประจำปี 2568
            </h2>
            <span className="text-slate-500">
              ตรวจแล้ว {countedCount}/{totalAssets} รายการ
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-[11px]">
                  <th className="p-3">สถานะนับ</th>
                  <th className="p-3">เลขครุภัณฑ์</th>
                  <th className="p-3">รายการ</th>
                  <th className="p-3">สถานที่ในทะเบียน</th>
                  <th className="p-3">ผู้ดูแล</th>
                  <th className="p-3 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assets.map((asset) => {
                  const isCounted = countedIds.has(asset.id);
                  const countRecord = inventoryCounts.find((c) => c.assetId === asset.id);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50">
                      <td className="p-3">
                        {isCounted ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            ✓ ตรวจแล้ว
                          </span>
                        ) : (
                          <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full">
                            รอนับ
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono font-medium text-blue-900">{asset.assetNo}</td>
                      <td className="p-3 font-semibold text-slate-900">{asset.assetName}</td>
                      <td className="p-3 text-slate-600">{asset.locationPath}</td>
                      <td className="p-3 text-slate-600">{asset.custodianName}</td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {isCounted && countRecord && (
                            <button
                              onClick={() => setEditingCountRecord(countRecord)}
                              className="px-2 py-1 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg font-semibold inline-flex items-center gap-1 transition-colors"
                              title="แก้ไขผลตรวจนับ"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>แก้ไข</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedAssetId(asset.id);
                              setActiveTab('scan');
                            }}
                            className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold transition-colors"
                          >
                            {isCounted ? 'นับซ้ำ' : 'บันทึกตรวจนับ'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: VARIANCE REPORT */}
      {activeTab === 'variance' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4 text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              รายงานผลการตรวจสอบพัสดุและรายการผลต่าง (สำหรับรายงานหัวหน้าส่วนราชการ &amp; สตง.)
            </h2>
            <p className="text-slate-500 text-[11px] mt-0.5">
              สรุปรายการพัสดุที่ชำรุด เสื่อมสภาพ สูญหาย หรืออยู่ผิดสถานที่ ตาม พ.ร.บ. พัสดุฯ ๒๕๖๐
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
              <span className="font-bold text-rose-900 block">ไม่พบตัวครุภัณฑ์: {notFoundCount} รายการ</span>
              <p className="text-[11px] text-rose-700 mt-1">
                ต้องแต่งตั้งคณะกรรมการสอบหาข้อเท็จจริงตามระเบียบพัสดุฯ ข้อ 213
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
              <span className="font-bold text-amber-900 block">ชำรุด/เสื่อมสภาพ: {damagedCount} รายการ</span>
              <p className="text-[11px] text-amber-700 mt-1">
                เสนอแต่งตั้งคณะกรรมการสอบหาข้อเท็จจริงเพื่อพิจารณาจำหน่ายพัสดุ
              </p>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="font-bold text-blue-900 block">อยู่ผิดสถานที่: {locationMismatchCount} รายการ</span>
              <p className="text-[11px] text-blue-700 mt-1">
                ดำเนินการปรับปรุงฐานข้อมูลทะเบียนคุมสถานที่ให้ตรงกับความเป็นจริง
              </p>
            </div>
          </div>

          {/* Variance items list with edit button */}
          <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-3 bg-slate-50 border-b border-slate-200 font-bold text-slate-800 flex items-center justify-between">
              <span>รายการครุภัณฑ์ที่มีผลต่าง/ปัญหาจากการตรวจนับ</span>
              <span className="text-[11px] text-slate-500 font-normal">
                สามารถคลิกแก้ไขเพื่ออัปเดตข้อมูลให้ถูกต้องได้
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200 text-[11px]">
                    <th className="p-2.5">เลขครุภัณฑ์</th>
                    <th className="p-2.5">รายการ</th>
                    <th className="p-2.5">สถานะผลต่าง</th>
                    <th className="p-2.5">สถานที่ตามทะเบียน → สถานที่จริง</th>
                    <th className="p-2.5">หมายเหตุ</th>
                    <th className="p-2.5 text-center">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inventoryCounts
                    .filter(
                      (c) =>
                        c.foundStatus !== 'FOUND' ||
                        c.expectedLocation.trim() !== c.actualLocation.trim()
                    )
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="p-2.5 font-mono text-blue-900 font-medium">
                          {item.assetNo}
                        </td>
                        <td className="p-2.5 font-medium text-slate-900">{item.assetName}</td>
                        <td className="p-2.5">
                          {item.foundStatus === 'NOT_FOUND' && (
                            <span className="bg-rose-100 text-rose-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              ไม่พบตัวครุภัณฑ์
                            </span>
                          )}
                          {item.foundStatus === 'DAMAGED' && (
                            <span className="bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              ชำรุด/เสื่อมสภาพ
                            </span>
                          )}
                          {item.foundStatus === 'OBSOLETE' && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                              หมดความจำเป็น
                            </span>
                          )}
                          {item.foundStatus === 'FOUND' &&
                            item.expectedLocation.trim() !== item.actualLocation.trim() && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                สถานที่คลาดเคลื่อน
                              </span>
                            )}
                        </td>
                        <td className="p-2.5 text-slate-600">
                          <span>{item.expectedLocation}</span>
                          <span className="mx-1 text-slate-400">→</span>
                          <span className="font-semibold text-slate-900">
                            {item.actualLocation}
                          </span>
                        </td>
                        <td className="p-2.5 text-slate-500 max-w-xs truncate">
                          {item.remark || '-'}
                        </td>
                        <td className="p-2.5 text-center">
                          <button
                            onClick={() => setEditingCountRecord(item)}
                            className="px-2.5 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg font-semibold inline-flex items-center gap-1 transition-colors text-[11px]"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>แก้ไข</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Inventory Count Modal */}
      {editingCountRecord && (
        <EditInventoryCountModal
          record={editingCountRecord}
          onClose={() => setEditingCountRecord(null)}
        />
      )}
    </div>
  );
};
