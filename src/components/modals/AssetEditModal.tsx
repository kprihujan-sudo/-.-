import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  CheckCircle2,
  Building,
  Coins,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Asset, AssetStatus, AcquireType } from '../../types';
import { ASSET_CATEGORIES } from '../../data/initialData';
import { SATUN_ORGANIZATIONS } from '../../types';

export const AssetEditModal: React.FC = () => {
  const { assetToEdit, setAssetToEdit, updateAsset, isAdminUser } = useApp();

  const [activeTab, setActiveTab] = useState<'basic' | 'finance' | 'location' | 'status'>('basic');
  const [formData, setFormData] = useState<Partial<Asset>>({});
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (assetToEdit) {
      setFormData({ ...assetToEdit });
      setActiveTab('basic');
      setSaveSuccess(false);
    }
  }, [assetToEdit]);

  if (!assetToEdit) return null;

  const currentOrg = SATUN_ORGANIZATIONS.find((o) => o.id === formData.orgId) || SATUN_ORGANIZATIONS[0];
  const departments = currentOrg.departments || [];

  const handleCategoryChange = (categoryCode: string) => {
    const cat = ASSET_CATEGORIES.find((c) => c.code === categoryCode);
    if (cat) {
      setFormData((prev) => ({
        ...prev,
        categoryCode: cat.code,
        categoryName: cat.name,
        usefulLifeYr: cat.usefulLifeYr,
      }));
    }
  };

  const handleOrgChange = (orgId: string) => {
    const org = SATUN_ORGANIZATIONS.find((o) => o.id === orgId);
    if (org) {
      setFormData((prev) => ({
        ...prev,
        orgId: org.id,
        orgName: org.name,
        department: org.departments[0] || 'งานบริหารทั่วไปและพัสดุ',
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.assetName?.trim()) {
      alert('กรุณากรอกชื่อครุภัณฑ์');
      return;
    }

    const unitCost = Number(formData.unitCost) || 0;
    const quantity = Number(formData.quantity) || 1;
    const totalCost = unitCost * quantity;
    const building = formData.building || '';
    const floor = formData.floor || '';
    const room = formData.room || '';
    const locationPath = `${building} > ชั้น ${floor} > ห้อง ${room}`;

    updateAsset(assetToEdit.id, {
      ...formData,
      unitCost,
      quantity,
      totalCost,
      locationPath,
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setAssetToEdit(null);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-blue-900 bg-blue-100/70 px-2 py-0.5 rounded">
                {assetToEdit.assetNo}
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-full">
                โหมดแก้ไขข้อมูลทะเบียน
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              แก้ไขข้อมูลครุภัณฑ์: {assetToEdit.assetName}
            </h2>
          </div>

          <button
            onClick={() => setAssetToEdit(null)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 px-5 border-b border-slate-200 flex gap-4 sm:gap-6 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'basic'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            ข้อมูลพื้นฐาน & สเปก
          </button>
          <button
            onClick={() => setActiveTab('finance')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'finance'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            การจัดซื้อ & ค่าเสื่อมราคา
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'location'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building className="w-3.5 h-3.5" />
            สังกัดหน่วยงาน & สถานที่
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`py-3 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'status'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            สถานะ & ประกัน
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>บันทึกการแก้ไขข้อมูลครุภัณฑ์เรียบร้อยแล้ว</span>
            </div>
          )}

          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    ชื่อครุภัณฑ์ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.assetName || ''}
                    onChange={(e) => setFormData({ ...formData, assetName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    หมวดหมู่ครุภัณฑ์
                  </label>
                  <select
                    value={formData.categoryCode || ''}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-blue-600"
                  >
                    {ASSET_CATEGORIES.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.code} - {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    รหัสสินทรัพย์ GFMIS (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    value={formData.gfmisAssetNo || ''}
                    onChange={(e) => setFormData({ ...formData, gfmisAssetNo: e.target.value })}
                    placeholder="เช่น 120605000001"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ยี่ห้อ / Brand</label>
                  <input
                    type="text"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">รุ่น / Model</label>
                  <input
                    type="text"
                    value={formData.model || ''}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">หมายเลขเครื่อง (Serial No.)</label>
                  <input
                    type="text"
                    value={formData.serialNo || ''}
                    onChange={(e) => setFormData({ ...formData, serialNo: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ลิงก์รูปภาพประกอบ (URL)</label>
                  <input
                    type="text"
                    value={formData.photos?.[0] || ''}
                    onChange={(e) => setFormData({ ...formData, photos: [e.target.value] })}
                    placeholder="https://..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    รายละเอียดคุณลักษณะเฉพาะ (Specification)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.spec || ''}
                    onChange={(e) => setFormData({ ...formData, spec: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>

              {formData.photos?.[0] && (
                <div className="mt-2 p-3 bg-slate-50 border rounded-xl flex items-center gap-3">
                  <img
                    src={formData.photos[0]}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-lg border border-slate-200 shadow-2xs"
                  />
                  <div className="text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700 block">ตัวอย่างภาพถ่ายครุภัณฑ์</span>
                    ลิงก์รูปภาพพร้อมใช้งานในระบบ
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FINANCE & PROCUREMENT */}
          {activeTab === 'finance' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ราคาต่อหน่วย (บาท) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={formData.unitCost || 0}
                    onChange={(e) => {
                      const cost = Number(e.target.value);
                      const isDep = cost >= 5000;
                      setFormData({
                        ...formData,
                        unitCost: cost,
                        isDepreciable: isDep,
                        totalCost: cost * (formData.quantity || 1),
                      });
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono font-bold"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {(formData.unitCost || 0) >= 5000
                      ? '✓ สินทรัพย์ถาวร (>= 5,000 บาท) คิดค่าเสื่อมราคา'
                      : '⚠ สินทรัพย์มูลค่าต่ำกว่าเกณฑ์ (< 5,000 บาท) ตัดเป็นค่าใช้จ่าย'}
                  </span>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">จำนวนหน่วย</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.quantity || 1}
                    onChange={(e) => {
                      const qty = Number(e.target.value);
                      setFormData({
                        ...formData,
                        quantity: qty,
                        totalCost: (formData.unitCost || 0) * qty,
                      });
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ประเภทการได้มา
                  </label>
                  <select
                    value={formData.acquireType || 'PURCHASE'}
                    onChange={(e) => setFormData({ ...formData, acquireType: e.target.value as AcquireType })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="PURCHASE">จัดซื้อ / จัดจ้าง</option>
                    <option value="DONATE">รับบริจาค</option>
                    <option value="TRANSFER_IN">รับโอนจากหน่วยงานอื่น</option>
                    <option value="BUILD">ก่อสร้าง / ผลิตขึ้นใช้เอง</option>
                    <option value="EXCHANGE">แลกเปลี่ยน</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    แหล่งเงินงบประมาณ
                  </label>
                  <select
                    value={formData.budgetSourceCode || 'GOV'}
                    onChange={(e) => {
                      const val = e.target.value as 'GOV' | 'REVENUE' | 'NHSO' | 'DONATION';
                      const names = {
                        GOV: 'งบประมาณแผ่นดิน (งบลงทุน/งบกลาง)',
                        REVENUE: 'เงินบำรุงหน่วยบริการสาธารณสุข',
                        NHSO: 'กองทุนหลักประกันสุขภาพแห่งชาติ (สปสช.)',
                        DONATION: 'เงินบริจาคเพื่อจัดหาครุภัณฑ์การแพทย์',
                      };
                      setFormData({ ...formData, budgetSourceCode: val, budgetSourceName: names[val] });
                    }}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    <option value="GOV">งบประมาณแผ่นดิน (งบลงทุน/งบกลาง)</option>
                    <option value="REVENUE">เงินบำรุงหน่วยบริการสาธารณสุข</option>
                    <option value="NHSO">กองทุนหลักประกันสุขภาพแห่งชาติ (สปสช.)</option>
                    <option value="DONATION">เงินบริจาคเพื่อจัดหาครุภัณฑ์การแพทย์</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    เลขที่เอกสารสัญญา / ใบสั่งซื้อ (PO)
                  </label>
                  <input
                    type="text"
                    value={formData.documentNo || ''}
                    onChange={(e) => setFormData({ ...formData, documentNo: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ชื่อผู้ขาย / คู่สัญญา
                  </label>
                  <input
                    type="text"
                    value={formData.vendorName || ''}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    วันที่ได้มา (Acquire Date)
                  </label>
                  <input
                    type="date"
                    value={formData.acquireDate || ''}
                    onChange={(e) => setFormData({ ...formData, acquireDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    วันที่เริ่มใช้งาน (In-Service Date)
                  </label>
                  <input
                    type="date"
                    value={formData.inServiceDate || ''}
                    onChange={(e) => setFormData({ ...formData, inServiceDate: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ปีงบประมาณ (พ.ศ.)</label>
                  <input
                    type="number"
                    value={formData.fiscalYear || 2568}
                    onChange={(e) => setFormData({ ...formData, fiscalYear: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    อายุการใช้งาน (ปี) ตามเกณฑ์กระทรวงการคลัง
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={formData.usefulLifeYr || 8}
                    onChange={(e) => setFormData({ ...formData, usefulLifeYr: Number(e.target.value) })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LOCATION & CUSTODIAN */}
          {activeTab === 'location' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">
                    สังกัดหน่วยงาน (15 หน่วยงาน จ.สตูล)
                  </label>
                  <select
                    disabled={!isAdminUser}
                    value={formData.orgId || ''}
                    onChange={(e) => handleOrgChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:border-blue-600 disabled:bg-slate-100"
                  >
                    {SATUN_ORGANIZATIONS.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.name} ({org.typeLabel})
                      </option>
                    ))}
                  </select>
                  {!isAdminUser && (
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      * เฉพาะผู้ดูแลระบบ สสจ.สตูล จึงจะสามารถย้ายสังกัดข้ามหน่วยงานได้
                    </span>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">กลุ่มงาน / แผนก</label>
                  <select
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">อาคาร / ตึก</label>
                  <input
                    type="text"
                    value={formData.building || ''}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    placeholder="เช่น อาคารผู้ป่วยนอก"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ชั้น</label>
                  <input
                    type="text"
                    value={formData.floor || ''}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    placeholder="เช่น 1 หรือ 2"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">ห้อง / จุดติดตั้ง</label>
                  <input
                    type="text"
                    value={formData.room || ''}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="เช่น ห้องตรวจ 102 หรือ แผนกเอกซเรย์"
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    ผู้รับผิดชอบดูแลครุภัณฑ์
                  </label>
                  <input
                    type="text"
                    value={formData.custodianName || ''}
                    onChange={(e) => setFormData({ ...formData, custodianName: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ตำแหน่งผู้รับผิดชอบ</label>
                  <input
                    type="text"
                    value={formData.custodianPosition || ''}
                    onChange={(e) => setFormData({ ...formData, custodianPosition: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: STATUS & WARRANTY */}
          {activeTab === 'status' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    สถานะการใช้งานปัจจุบัน
                  </label>
                  <select
                    value={formData.status || 'IN_USE'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as AssetStatus })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs font-semibold text-slate-900"
                  >
                    <option value="IN_USE">● ใช้งานปกติ (In Use)</option>
                    <option value="REPAIR">🔧 อยู่ระหว่างซ่อมบำรุง (Under Repair)</option>
                    <option value="BORROWED">🔄 ถูกยืมออกภายนอก (Borrowed)</option>
                    <option value="DAMAGED">⚠ ชำรุด รอตรวจสอบ (Damaged)</option>
                    <option value="PENDING_DISPOSAL">📦 เสนอขอจำหน่าย (Pending Disposal)</option>
                    <option value="DISPOSED">✓ จำหน่ายออกจากบัญชีแล้ว (Disposed)</option>
                    <option value="LOST">❌ สูญหาย (Lost)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    วันสิ้นสุดการรับประกัน (Warranty End)
                  </label>
                  <input
                    type="date"
                    value={formData.warrantyEnd || ''}
                    onChange={(e) => setFormData({ ...formData, warrantyEnd: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-semibold mb-1">หมายเหตุเพิ่มเติม</label>
                  <textarea
                    rows={3}
                    value={formData.remark || ''}
                    onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                    placeholder="บันทึกรายละเอียดเพิ่มเติม..."
                    className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setAssetToEdit(null)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>บันทึกการแก้ไขครุภัณฑ์</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
