import React, { useState, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Camera,
  QrCode,
  Calendar,
  Building,
  Coins,
  ShieldAlert,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ASSET_CATEGORIES } from '../../data/initialData';
import {
  getThaiFiscalYear,
  getDepreciationStartDate,
  calculateDepreciationBase,
  formatCurrency,
  formatNumber,
} from '../../utils/thaiFiscal';

export const AssetCreateWizard: React.FC = () => {
  const { isCreateModalOpen, setIsCreateModalOpen, addAsset, assets, currentOrg } = useApp();

  const [step, setStep] = useState<number>(1);

  // Form State
  const [categoryCode, setCategoryCode] = useState<string>('6515');
  const [assetName, setAssetName] = useState<string>('');
  const [brand, setBrand] = useState<string>('');
  const [model, setModel] = useState<string>('');
  const [serialNo, setSerialNo] = useState<string>('');
  const [spec, setSpec] = useState<string>('');
  const [photoUrl, setPhotoUrl] = useState<string>(
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=600&auto=format&fit=crop&q=80'
  );

  const [acquireType, setAcquireType] = useState<'PURCHASE' | 'DONATE' | 'TRANSFER_IN' | 'BUILD' | 'EXCHANGE'>('PURCHASE');
  const [budgetSourceCode, setBudgetSourceCode] = useState<'REVENUE' | 'GOV' | 'NHSO' | 'DONATION'>('REVENUE');
  const [acquireDate, setAcquireDate] = useState<string>('2025-01-20');
  const [inServiceDate, setInServiceDate] = useState<string>('2025-01-25');
  const [documentNo, setDocumentNo] = useState<string>('สัญญาซื้อขาย 12/2568');
  const [poNo, setPoNo] = useState<string>('PO-2568-0087');
  const [vendorName, setVendorName] = useState<string>('บริษัท เมดิคอล แคร์ ซัพพลาย จำกัด');
  const [unitCost, setUnitCost] = useState<number>(18500);

  const [building, setBuilding] = useState<string>('อาคารผู้ป่วยนอก (OPD)');
  const [floor, setFloor] = useState<string>('ชั้น 2');
  const [room, setRoom] = useState<string>('ห้องตรวจ 3');
  const [department, setDepartment] = useState<string>('กลุ่มงานการพยาบาลผู้ป่วยนอก');
  const [custodianName, setCustodianName] = useState<string>('นางสาวมาลี ใจดี');
  const [custodianPosition, setCustodianPosition] = useState<string>('พยาบาลวิชาชีพชำนาญการ');
  const [warrantyEnd, setWarrantyEnd] = useState<string>('2027-01-24');
  const [remark, setRemark] = useState<string>('จัดซื้อตามแผนเงินบำรุงประจำปีงบประมาณ 2568');

  // Selected Category Info
  const selectedCategory = useMemo(() => {
    return ASSET_CATEGORIES.find((c) => c.code === categoryCode) || ASSET_CATEGORIES[0];
  }, [categoryCode]);

  const usefulLifeYr = selectedCategory.usefulLifeYr;
  const fiscalYear = useMemo(() => getThaiFiscalYear(acquireDate), [acquireDate]);
  const isDepreciable = unitCost >= 5000;
  const depCalculation = useMemo(() => {
    return calculateDepreciationBase(unitCost, usefulLifeYr);
  }, [unitCost, usefulLifeYr]);

  // Realtime Serial Check
  const isDuplicateSerial = useMemo(() => {
    if (!serialNo.trim()) return false;
    return assets.some(
      (a) => a.serialNo.trim().toLowerCase() === serialNo.trim().toLowerCase()
    );
  }, [assets, serialNo]);

  if (!isCreateModalOpen) return null;

  const handleNext = () => {
    if (step === 1) {
      if (!assetName.trim()) {
        alert('กรุณากรอกชื่อครุภัณฑ์');
        return;
      }
      if (isDuplicateSerial) {
        alert('หมายเลขเครื่อง (Serial Number) นี้มีในระบบแล้ว กรุณาตรวจสอบ');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    const budgetNames = {
      REVENUE: 'เงินบำรุงโรงพยาบาล',
      GOV: 'เงินงบประมาณจัดซื้อครุภัณฑ์',
      NHSO: 'งบกองทุนหลักประกันสุขภาพ (สปสช.)',
      DONATION: 'เงินบริจาค',
    };

    const locationPath = `${building} > ${floor} > ${room}`;

    addAsset({
      assetName,
      categoryCode,
      categoryName: selectedCategory.name,
      brand,
      model,
      serialNo,
      spec,
      acquireType,
      acquireDate,
      inServiceDate,
      fiscalYear,
      budgetSourceCode,
      budgetSourceName: budgetNames[budgetSourceCode] || 'เงินบำรุง',
      documentNo,
      poNo,
      vendorName,
      unitCost,
      quantity: 1,
      totalCost: unitCost,
      usefulLifeYr,
      salvageValue: 1,
      isDepreciable,
      depreciationStartDate: isDepreciable ? getDepreciationStartDate(inServiceDate) : undefined,
      building,
      floor,
      room,
      locationPath,
      custodianId: 3,
      custodianName,
      custodianPosition,
      department,
      warrantyEnd,
      photos: photoUrl ? [photoUrl] : [],
      attachments: [],
      remark,
    });

    setIsCreateModalOpen(false);
    alert('ขึ้นทะเบียนครุภัณฑ์สำเร็จ! ระบบได้สร้างรหัสครุภัณฑ์และผูกตารางค่าเสื่อมราคาเรียบร้อย');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>ขึ้นทะเบียนครุภัณฑ์ใหม่</span>
              <span className="text-xs bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full">
                ระเบียบพัสดุ ๒๕๖๐
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ระบบตรวจสอบเกณฑ์ 5,000 บาท และคำนวณค่าเสื่อมราคาเส้นตรงอัตโนมัติ
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold">
          {[
            { num: 1, title: '1. ข้อมูลครุภัณฑ์' },
            { num: 2, title: '2. การได้มา & มูลค่า' },
            { num: 3, title: '3. สถานที่ & ผู้ดูแล' },
            { num: 4, title: '4. ตรวจสอบ & QR' },
          ].map((s) => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 ${
                step === s.num
                  ? 'text-blue-700 font-bold'
                  : step > s.num
                  ? 'text-emerald-700'
                  : 'text-slate-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-blue-700 text-white'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="hidden sm:inline">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    หมวดครุภัณฑ์ *
                  </label>
                  <select
                    value={categoryCode}
                    onChange={(e) => setCategoryCode(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                  >
                    {ASSET_CATEGORIES.map((cat) => (
                      <option key={cat.code} value={cat.code}>
                        {cat.code} - {cat.name} (อายุใช้งาน {cat.usefulLifeYr} ปี)
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-slate-500 mt-1">
                    รหัสหมวดพัสดุภาครัฐตามคู่มือจำแนกพัสดุ กรมบัญชีกลาง
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    ชื่อครุภัณฑ์ *
                  </label>
                  <input
                    type="text"
                    value={assetName}
                    onChange={(e) => setAssetName(e.target.value)}
                    placeholder="เช่น เครื่องวัดความดันโลหิตอัตโนมัติ"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ยี่ห้อ (Brand)</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="เช่น Omron, Dell, Toyota"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">รุ่น / แบบ (Model)</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="เช่น HBP-1320"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    หมายเลขเครื่อง (Serial Number) *
                  </label>
                  <input
                    type="text"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                    placeholder="เช่น OM-8891-A"
                    className={`w-full bg-slate-50 border rounded-lg p-2 font-mono ${
                      isDuplicateSerial ? 'border-rose-400 bg-rose-50 text-rose-900' : 'border-slate-200 text-slate-800'
                    }`}
                  />
                  {isDuplicateSerial ? (
                    <p className="text-[11px] text-rose-600 mt-1 font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      คำเตือน: หมายเลขเครื่อง (Serial No.) นี้มีอยู่ในระบบแล้ว กรุณาตรวจสอบ
                    </p>
                  ) : (
                    <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      ตรวจสอบแล้ว ไม่ซ้ำในระบบ
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">คุณลักษณะเฉพาะ (Specification)</label>
                  <textarea
                    rows={2}
                    value={spec}
                    onChange={(e) => setSpec(e.target.value)}
                    placeholder="ระบุคุณลักษณะทางเทคนิคสำคัญ เช่น ขนาดจอ กำลังไฟ หรืออุปกรณ์ประกอบชุด"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">รูปถ่ายครุภัณฑ์ (URL)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      placeholder="ใส่ URL รูปถ่าย"
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                    />
                    <div className="w-12 h-9 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">วิธีการได้มา *</label>
                  <select
                    value={acquireType}
                    onChange={(e) => setAcquireType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="PURCHASE">จัดซื้อ (Purchase)</option>
                    <option value="DONATE">รับบริจาค (Donation)</option>
                    <option value="TRANSFER_IN">รับโอนจากหน่วยงานอื่น</option>
                    <option value="BUILD">ผลิตหรือสร้างเอง</option>
                    <option value="EXCHANGE">แลกเปลี่ยน</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">แหล่งเงิน *</label>
                  <select
                    value={budgetSourceCode}
                    onChange={(e) => setBudgetSourceCode(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  >
                    <option value="REVENUE">เงินบำรุงโรงพยาบาล</option>
                    <option value="GOV">เงินงบประมาณจัดซื้อครุภัณฑ์</option>
                    <option value="NHSO">งบ สปสช.</option>
                    <option value="DONATION">เงินบริจาค</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">วันที่ได้มา *</label>
                  <input
                    type="date"
                    value={acquireDate}
                    onChange={(e) => setAcquireDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                  <p className="text-[11px] text-blue-700 mt-1 font-medium">
                    ปีงบประมาณไทย: {fiscalYear} (คำนวณอัตโนมัติ)
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">วันเริ่มใช้งาน (In-Service Date)</label>
                  <input
                    type="date"
                    value={inServiceDate}
                    onChange={(e) => setInServiceDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    ใช้เป็นฐานคำนวณค่าเสื่อมราคา (เริ่มเดือนถัดไป)
                  </p>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">เลขที่สัญญา / ใบส่งของ *</label>
                  <input
                    type="text"
                    value={documentNo}
                    onChange={(e) => setDocumentNo(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ผู้ขาย / คู่สัญญา *</label>
                  <input
                    type="text"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">ราคาต่อหน่วย (บาท) *</label>
                  <input
                    type="number"
                    value={unitCost}
                    onChange={(e) => setUnitCost(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 font-bold text-base"
                  />
                </div>
              </div>

              {/* Depreciation Engine Card */}
              {isDepreciable ? (
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                      เข้าเกณฑ์การคิดค่าเสื่อมราคา (ราคา ≥ 5,000 บาท)
                    </span>
                    <span className="text-[11px] bg-blue-200 text-blue-900 px-2 py-0.5 rounded-md font-bold">
                      วิธีเส้นตรง (Straight-Line)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-blue-200 text-xs">
                    <div>
                      <span className="text-slate-500 block">อายุการใช้งาน:</span>
                      <span className="font-bold text-slate-900">{usefulLifeYr} ปี</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">มูลค่าคงเหลือ:</span>
                      <span className="font-bold text-slate-900">1.00 บาท</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ค่าเสื่อมราคา/ปี:</span>
                      <span className="font-bold text-blue-900">
                        {formatNumber(depCalculation.annualDepreciation)} บาท
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">ค่าเสื่อมราคา/เดือน:</span>
                      <span className="font-bold text-blue-900">
                        {formatNumber(depCalculation.monthlyDepreciation)} บาท
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2 text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block">ครุภัณฑ์ต่ำกว่าเกณฑ์ (&lt; 5,000 บาท)</span>
                    <p className="text-[11px] text-amber-800 mt-0.5">
                      รายการนี้มีราคาต่ำกว่า 5,000 บาท จัดเป็นครุภัณฑ์ต่ำกว่าเกณฑ์
                      จะขึ้นทะเบียนคุมเพื่อการตรวจสอบพัสดุ แต่ไม่นำไปคิดค่าเสื่อมราคาตามระเบียบ
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">อาคาร / ตึก *</label>
                  <input
                    type="text"
                    value={building}
                    onChange={(e) => setBuilding(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ชั้น *</label>
                  <input
                    type="text"
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ห้อง / แผนก *</label>
                  <input
                    type="text"
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">กลุ่มงานที่สังกัด *</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ผู้รับผิดชอบพัสดุ *</label>
                  <input
                    type="text"
                    value={custodianName}
                    onChange={(e) => setCustodianName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">ตำแหน่งผู้รับผิดชอบ</label>
                  <input
                    type="text"
                    value={custodianPosition}
                    onChange={(e) => setCustodianPosition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">วันหมดอายุประกัน (Warranty End)</label>
                  <input
                    type="date"
                    value={warrantyEnd}
                    onChange={(e) => setWarrantyEnd(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              {/* Sticker Preview Box */}
              <div className="bg-slate-900 text-white rounded-xl p-4 shadow-md">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 border-b border-slate-700 pb-1">
                  <span>ตัวอย่างสติกเกอร์รหัสครุภัณฑ์ติดตัวเครื่อง (50x25 mm)</span>
                  <span>{currentOrg}</span>
                </div>
                <div className="bg-white text-slate-900 p-3 rounded-lg border-2 border-slate-800 flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">
                      {currentOrg}
                    </div>
                    <div className="font-mono text-sm sm:text-base font-black text-blue-900 tracking-tight">
                      10670-{categoryCode}-001-XXXX/{String(fiscalYear).slice(-2)}
                    </div>
                    <div className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {assetName || 'เครื่องวัดความดันโลหิตอัตโนมัติ'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      วันได้มา: {acquireDate} · ราคา: {formatNumber(unitCost)} บ.
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-slate-100 border border-slate-300 rounded-md p-1 flex items-center justify-center shrink-0">
                    <QrCode className="w-14 h-14 text-slate-900" />
                  </div>
                </div>
              </div>

              {/* Summary Review List */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <div className="font-bold text-slate-900 mb-2 border-b pb-1">
                  สรุปรายละเอียดการขึ้นทะเบียน
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-500">ชื่อรายการ:</span>{' '}
                    <span className="font-semibold text-slate-900">{assetName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">หมวดหมู่:</span>{' '}
                    <span className="font-semibold text-slate-900">{selectedCategory.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ยี่ห้อ/รุ่น:</span>{' '}
                    <span className="font-semibold text-slate-900">{brand} {model}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">S/N:</span>{' '}
                    <span className="font-semibold text-slate-900 font-mono">{serialNo}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ราคาทุน:</span>{' '}
                    <span className="font-semibold text-blue-900">{formatCurrency(unitCost)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">การคิดค่าเสื่อม:</span>{' '}
                    <span className="font-semibold text-emerald-700">
                      {isDepreciable ? `คิดค่าเสื่อม (${usefulLifeYr} ปี)` : 'ไม่คิดค่าเสื่อม (<5,000 บ.)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">สถานที่:</span>{' '}
                    <span className="font-semibold text-slate-900">{building} {floor} {room}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">ผู้รับผิดชอบ:</span>{' '}
                    <span className="font-semibold text-slate-900">{custodianName}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 rounded-b-2xl">
          <button
            type="button"
            onClick={step === 1 ? () => setIsCreateModalOpen(false) : handleBack}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            {step === 1 ? 'ยกเลิก' : '← ย้อนกลับ'}
          </button>

          <div className="flex items-center gap-2">
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
              >
                ขั้นตอนถัดไป →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>ยืนยันขึ้นทะเบียนครุภัณฑ์</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
