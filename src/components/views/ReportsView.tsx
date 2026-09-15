import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Building,
  Calendar,
  Coins,
  CheckCircle2,
  FileText,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatCurrency, formatNumber, formatThaiDate } from '../../utils/thaiFiscal';

export const ReportsView: React.FC = () => {
  const { assets, currentOrg } = useApp();
  const [selectedAssetId, setSelectedAssetId] = useState<number>(assets[0]?.id || 0);

  const selectedAsset = assets.find((a) => a.id === Number(selectedAssetId)) || assets[0];

  // Monthly summary values
  const totalCost = assets.reduce((sum, a) => sum + a.totalCost, 0);
  const totalAccumulatedDep = assets.reduce((sum, a) => sum + a.accumulatedDep, 0);
  const totalNBV = assets.reduce((sum, a) => sum + a.netBookValue, 0);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = [
      'เลขครุภัณฑ์',
      'GFMIS No.',
      'ชื่อรายการ',
      'หมวด',
      'ยี่ห้อ/รุ่น',
      'S/N',
      'วันที่ได้มา',
      'ราคาทุน',
      'ค่าเสื่อมสะสม',
      'มูลค่าสุทธิ (NBV)',
      'สถานที่',
      'ผู้ดูแล',
      'สถานะ',
    ];

    const rows = assets.map((a) => [
      `"${a.assetNo}"`,
      `"${a.gfmisAssetNo || ''}"`,
      `"${a.assetName}"`,
      `"${a.categoryName}"`,
      `"${a.brand} ${a.model}"`,
      `"${a.serialNo}"`,
      `"${a.acquireDate}"`,
      a.unitCost,
      a.accumulatedDep,
      a.netBookValue,
      `"${a.locationPath}"`,
      `"${a.custodianName}"`,
      `"${a.status}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ทะเบียนทรัพย์สิน_${currentOrg}_2568.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>รายงานสรุปสถานะสินทรัพย์ &amp; ทะเบียนคุมทรัพย์สิน</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
              แบบฟอร์มกรมบัญชีกลาง
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            รายงานสถานะรายเดือนและทะเบียนคุมทรัพย์สินแบบมาตรฐานราชการ พร้อมรองรับการพิมพ์และส่งออก CSV
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ส่งออก Excel/CSV</span>
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-xl transition-all shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>พิมพ์แบบฟอร์ม</span>
          </button>
        </div>
      </div>

      {/* Asset Selector for Detailed Official Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs print:hidden">
        <label className="block font-semibold text-slate-700 mb-1.5">
          เลือกครุภัณฑ์ที่ต้องการแสดงในแบบฟอร์ม "ทะเบียนคุมทรัพย์สิน":
        </label>
        <select
          value={selectedAssetId}
          onChange={(e) => setSelectedAssetId(Number(e.target.value))}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 font-medium"
        >
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.assetNo} - {a.assetName} (หมวด {a.categoryCode} {a.categoryName})
            </option>
          ))}
        </select>
      </div>

      {/* Official Government Form (ทะเบียนคุมทรัพย์สิน) */}
      <div className="bg-white border-2 border-slate-800 rounded-xl p-6 sm:p-8 shadow-sm space-y-4 max-w-4xl mx-auto font-['Sarabun',sans-serif]">
        <div className="text-center space-y-1 border-b-2 border-slate-800 pb-3">
          <h2 className="text-lg font-bold text-slate-900 tracking-wide">ทะเบียนคุมทรัพย์สิน</h2>
          <p className="text-xs text-slate-700">ตามระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐</p>
          <p className="text-xs font-semibold text-slate-800">
            หน่วยงาน: {currentOrg} · สำนักงานสาธารณสุขจังหวัด
          </p>
        </div>

        {/* Top Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-xs py-2 border-b border-slate-300">
          <div>
            <span className="text-slate-500">ประเภท:</span>{' '}
            <span className="font-semibold">{selectedAsset.categoryName}</span>
          </div>
          <div>
            <span className="text-slate-500">รหัสสินทรัพย์:</span>{' '}
            <span className="font-mono font-bold text-blue-950">{selectedAsset.assetNo}</span>
          </div>
          <div>
            <span className="text-slate-500">เลขที่ GFMIS:</span>{' '}
            <span className="font-mono">{selectedAsset.gfmisAssetNo || '100000012345'}</span>
          </div>
          <div>
            <span className="text-slate-500">ชื่อครุภัณฑ์:</span>{' '}
            <span className="font-semibold">{selectedAsset.assetName}</span>
          </div>
          <div>
            <span className="text-slate-500">ยี่ห้อ / รุ่น:</span>{' '}
            <span>{selectedAsset.brand} {selectedAsset.model}</span>
          </div>
          <div>
            <span className="text-slate-500">หมายเลขเครื่อง (S/N):</span>{' '}
            <span className="font-mono">{selectedAsset.serialNo}</span>
          </div>
          <div>
            <span className="text-slate-500">วิธีการได้มา:</span>{' '}
            <span>จัดซื้อ (สัญญา {selectedAsset.documentNo})</span>
          </div>
          <div>
            <span className="text-slate-500">แหล่งเงิน:</span>{' '}
            <span>{selectedAsset.budgetSourceName}</span>
          </div>
          <div>
            <span className="text-slate-500">วันที่ได้มา:</span>{' '}
            <span>{formatThaiDate(selectedAsset.acquireDate)}</span>
          </div>
          <div>
            <span className="text-slate-500">ราคาทุนต่อหน่วย:</span>{' '}
            <span className="font-bold">{formatCurrency(selectedAsset.unitCost)}</span>
          </div>
          <div>
            <span className="text-slate-500">อายุการใช้งาน:</span>{' '}
            <span>{selectedAsset.usefulLifeYr} ปี (วิธีเส้นตรง)</span>
          </div>
          <div>
            <span className="text-slate-500">สถานที่ตั้ง:</span>{' '}
            <span>{selectedAsset.locationPath}</span>
          </div>
        </div>

        {/* Ledger Table */}
        <div>
          <h3 className="font-bold text-slate-900 mb-2">ตารางบันทึกการคำนวณค่าเสื่อมราคาและมูลค่าสุทธิ</h3>
          <table className="w-full text-left border border-slate-400 text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 text-slate-800 text-center font-bold">
                <th className="border border-slate-400 p-2 w-24">วัน เดือน ปี</th>
                <th className="border border-slate-400 p-2">รายการ</th>
                <th className="border border-slate-400 p-2 text-right">ราคาทุน (บาท)</th>
                <th className="border border-slate-400 p-2 text-right">ค่าเสื่อมประจำงวด</th>
                <th className="border border-slate-400 p-2 text-right">ค่าเสื่อมสะสม</th>
                <th className="border border-slate-400 p-2 text-right">มูลค่าสุทธิ (NBV)</th>
                <th className="border border-slate-400 p-2 w-24">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-400 p-2 text-center">{formatThaiDate(selectedAsset.acquireDate)}</td>
                <td className="border border-slate-400 p-2">ตรวจรับพัสดุตามสัญญา {selectedAsset.documentNo}</td>
                <td className="border border-slate-400 p-2 text-right font-medium">{formatNumber(selectedAsset.unitCost)}</td>
                <td className="border border-slate-400 p-2 text-right">—</td>
                <td className="border border-slate-400 p-2 text-right">—</td>
                <td className="border border-slate-400 p-2 text-right font-bold">{formatNumber(selectedAsset.unitCost)}</td>
                <td className="border border-slate-400 p-2 text-center text-[10px]">ขึ้นทะเบียน</td>
              </tr>
              {selectedAsset.isDepreciable && (
                <tr>
                  <td className="border border-slate-400 p-2 text-center">31 มี.ค. 2568</td>
                  <td className="border border-slate-400 p-2">คำนวณค่าเสื่อมราคางวดที่ 6 (ประจำเดือน มี.ค. 2568)</td>
                  <td className="border border-slate-400 p-2 text-right font-medium">{formatNumber(selectedAsset.unitCost)}</td>
                  <td className="border border-slate-400 p-2 text-right">{formatNumber(selectedAsset.accumulatedDep)}</td>
                  <td className="border border-slate-400 p-2 text-right">{formatNumber(selectedAsset.accumulatedDep)}</td>
                  <td className="border border-slate-400 p-2 text-right font-bold text-blue-900">
                    {formatNumber(selectedAsset.netBookValue)}
                  </td>
                  <td className="border border-slate-400 p-2 text-center text-[10px]">งวดปัจจุบัน</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Signatures Area */}
        <div className="grid grid-cols-3 gap-4 pt-12 text-center text-xs">
          <div className="space-y-1">
            <div className="border-b border-dotted border-slate-400 pb-1 w-3/4 mx-auto" />
            <p className="font-semibold text-slate-800">({selectedAsset.custodianName})</p>
            <p className="text-slate-500 text-[11px]">ผู้จัดทำ / ผู้ดูแลพัสดุ</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-dotted border-slate-400 pb-1 w-3/4 mx-auto" />
            <p className="font-semibold text-slate-800">(นายสมชาย พัสดุดี)</p>
            <p className="text-slate-500 text-[11px]">ผู้ตรวจสอบ / เจ้าหน้าที่พัสดุ</p>
          </div>

          <div className="space-y-1">
            <div className="border-b border-dotted border-slate-400 pb-1 w-3/4 mx-auto" />
            <p className="font-semibold text-slate-800">(นายวิชัย มั่นคง)</p>
            <p className="text-slate-500 text-[11px]">ผู้อนุมัติ / หัวหน้าเจ้าหน้าที่พัสดุ</p>
          </div>
        </div>
      </div>
    </div>
  );
};
