import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  QrCode,
  FileSpreadsheet,
  Building,
  Calendar,
  Layers,
  ChevronRight,
  Printer,
  CheckSquare,
  Square,
  Clock,
  Eye,
  Trash2,
  ArrowUpDown,
  Tag,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Asset, AssetStatus } from '../../types';
import { formatCurrency, formatNumber, formatThaiDate } from '../../utils/thaiFiscal';

export const AssetListView: React.FC = () => {
  const {
    assets,
    searchQuery,
    setSearchQuery,
    setSelectedAssetForDetail,
    setIsCreateModalOpen,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [budgetFilter, setBudgetFilter] = useState<string>('ALL');
  const [selectedAssetIds, setSelectedAssetIds] = useState<number[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);

  // Filter logic
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      // Search term
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          asset.assetName.toLowerCase().includes(q) ||
          asset.assetNo.toLowerCase().includes(q) ||
          asset.serialNo.toLowerCase().includes(q) ||
          asset.brand.toLowerCase().includes(q) ||
          asset.locationPath.toLowerCase().includes(q) ||
          (asset.gfmisAssetNo && asset.gfmisAssetNo.toLowerCase().includes(q));
        if (!match) return false;
      }

      // Category
      if (categoryFilter !== 'ALL' && asset.categoryCode !== categoryFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'ALL' && asset.status !== statusFilter) {
        return false;
      }

      // Budget source
      if (budgetFilter !== 'ALL' && asset.budgetSourceCode !== budgetFilter) {
        return false;
      }

      return true;
    });
  }, [assets, searchQuery, categoryFilter, statusFilter, budgetFilter]);

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectedAssetIds.length === filteredAssets.length) {
      setSelectedAssetIds([]);
    } else {
      setSelectedAssetIds(filteredAssets.map((a) => a.id));
    }
  };

  const toggleSelectOne = (id: number) => {
    setSelectedAssetIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const getStatusBadge = (status: AssetStatus) => {
    switch (status) {
      case 'IN_USE':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">● ใช้งานปกติ</span>;
      case 'REPAIR':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">🔧 อยู่ระหว่างซ่อม</span>;
      case 'BORROWED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">🔄 ถูกยืมออก</span>;
      case 'DAMAGED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">⚠ ชำรุด</span>;
      case 'PENDING_DISPOSAL':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">⏳ รอจำหน่าย</span>;
      case 'DISPOSED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">✕ จำหน่ายแล้ว</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">ทะเบียนทรัพย์สินและครุภัณฑ์</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            พบทั้งหมด {filteredAssets.length} รายการ (จากทั้งหมด {assets.length} รายการ)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium border rounded-xl transition-all ${
              showFilterPanel || categoryFilter !== 'ALL' || statusFilter !== 'ALL' || budgetFilter !== 'ALL'
                ? 'bg-blue-50 text-blue-700 border-blue-200 font-semibold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>ตัวกรอง {categoryFilter !== 'ALL' || statusFilter !== 'ALL' ? '•' : ''}</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>ขึ้นทะเบียนใหม่</span>
          </button>
        </div>
      </div>

      {/* Filter Panel (Expandable) */}
      {showFilterPanel && (
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">หมวดครุภัณฑ์</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white text-slate-800"
            >
              <option value="ALL">-- ทุกหมวดครุภัณฑ์ --</option>
              <option value="6515">6515 ครุภัณฑ์การแพทย์</option>
              <option value="7440">7440 ครุภัณฑ์คอมพิวเตอร์</option>
              <option value="7110">7110 ครุภัณฑ์สำนักงาน</option>
              <option value="2310">2310 ครุภัณฑ์ยานพาหนะและขนส่ง</option>
              <option value="4110">4110 ครุภัณฑ์ไฟฟ้าและวิทยุ</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">สถานะครุภัณฑ์</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white text-slate-800"
            >
              <option value="ALL">-- ทุกสถานะ --</option>
              <option value="IN_USE">ใช้งานปกติ</option>
              <option value="REPAIR">อยู่ระหว่างส่งซ่อม</option>
              <option value="BORROWED">ถูกยืมออก</option>
              <option value="DAMAGED">ชำรุดรอจำหน่าย</option>
              <option value="DISPOSED">จำหน่ายแล้ว</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1">แหล่งเงินจัดซื้อ</label>
            <select
              value={budgetFilter}
              onChange={(e) => setBudgetFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 focus:bg-white text-slate-800"
            >
              <option value="ALL">-- ทุกแหล่งเงิน --</option>
              <option value="REVENUE">เงินบำรุงโรงพยาบาล</option>
              <option value="GOV">เงินงบประมาณ</option>
              <option value="NHSO">งบ สปสช.</option>
              <option value="DONATION">เงินบริจาค</option>
            </select>
          </div>
        </div>
      )}

      {/* Bulk Action Toolbar if items selected */}
      {selectedAssetIds.length > 0 && (
        <div className="bg-blue-900 text-white rounded-xl px-4 py-2.5 flex items-center justify-between shadow-md text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-blue-300" />
            <span>เลือกอยู่ {selectedAssetIds.length} รายการ</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`จำลองพิมพ์สติกเกอร์ QR Code สำหรับ ${selectedAssetIds.length} รายการ เรียบร้อย`)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>พิมพ์สติกเกอร์ QR</span>
            </button>
            <button
              onClick={() => setSelectedAssetIds([])}
              className="px-2 py-1 text-blue-200 hover:text-white"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      {/* Asset Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3 w-10 text-center">
                  <button onClick={toggleSelectAll} className="text-slate-400 hover:text-slate-600">
                    {selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-3">รูปภาพ</th>
                <th className="p-3">เลขครุภัณฑ์ / GFMIS</th>
                <th className="p-3">รายการ / ยี่ห้อ / รุ่น</th>
                <th className="p-3">สถานที่ติดตั้ง / ผู้ดูแล</th>
                <th className="p-3 text-right">ราคาทุน (บาท)</th>
                <th className="p-3 text-right">มูลค่าสุทธิ (NBV)</th>
                <th className="p-3 text-center">สถานะ</th>
                <th className="p-3 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-400">
                    ไม่พบข้อมูลครุภัณฑ์ตามเงื่อนไขที่ค้นหา
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => {
                  const isSelected = selectedAssetIds.includes(asset.id);
                  return (
                    <tr
                      key={asset.id}
                      className={`hover:bg-blue-50/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button onClick={() => toggleSelectOne(asset.id)} className="text-slate-400 hover:text-slate-600">
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="p-3" onClick={() => setSelectedAssetForDetail(asset)}>
                        {asset.photos && asset.photos.length > 0 ? (
                          <img
                            src={asset.photos[0]}
                            alt={asset.assetName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 object-cover rounded-lg border border-slate-200 shadow-2xs"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-[10px]">
                            ไม่มีรูป
                          </div>
                        )}
                      </td>

                      <td className="p-3 font-mono" onClick={() => setSelectedAssetForDetail(asset)}>
                        <div className="font-semibold text-blue-900 hover:underline">
                          {asset.assetNo}
                        </div>
                        {asset.gfmisAssetNo && (
                          <div className="text-[10px] text-slate-400">
                            GFMIS: {asset.gfmisAssetNo}
                          </div>
                        )}
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          ปีงบ {asset.fiscalYear} · {asset.categoryName}
                        </div>
                      </td>

                      <td className="p-3" onClick={() => setSelectedAssetForDetail(asset)}>
                        <div className="font-semibold text-slate-900 leading-tight">
                          {asset.assetName}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          {asset.brand} {asset.model} {asset.serialNo ? `(S/N: ${asset.serialNo})` : ''}
                        </div>
                      </td>

                      <td className="p-3" onClick={() => setSelectedAssetForDetail(asset)}>
                        <div className="text-slate-800 font-medium">{asset.locationPath}</div>
                        <div className="text-slate-500 text-[11px]">
                          ผู้ดูแล: {asset.custodianName}
                        </div>
                      </td>

                      <td className="p-3 text-right font-medium text-slate-900">
                        {formatNumber(asset.unitCost)}
                      </td>

                      <td className="p-3 text-right font-semibold text-blue-950">
                        {formatNumber(asset.netBookValue)}
                      </td>

                      <td className="p-3 text-center">
                        {getStatusBadge(asset.status)}
                      </td>

                      <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedAssetForDetail(asset)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="ดูรายละเอียดการ์ดครุภัณฑ์ & ตารางค่าเสื่อม"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
