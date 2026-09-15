import React from 'react';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Smartphone,
  Coins,
  Wrench,
  QrCode,
  FileSpreadsheet,
  Clock,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const RoadmapView: React.FC = () => {
  const { setActiveView, setIsCreateModalOpen } = useApp();

  const phases = [
    {
      phase: 'Phase 1',
      badge: 'ความสำคัญเร่งด่วนสูงสุด (Essential Foundation)',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
      title: 'ทะเบียนทรัพย์สินหลัก, ตรวจจับ S/N ซ้ำ และสร้างรหัสครุภัณฑ์ราชการ + QR Code',
      duration: 'เดือนที่ 1 – 2',
      objective:
        'เป็นรากฐานของทุกส่วน หากไม่มีทะเบียนที่ถูกต้อง รหัสครุภัณฑ์ และการแยกแยะด้วย QR Code โมดูลอื่นจะไม่สามารถทำงานได้',
      deliverables: [
        'ระบบขึ้นทะเบียนครุภัณฑ์แบบ 4 ขั้นตอน (ข้อมูล, แหล่งเงิน, ที่ตั้ง, ตรวจสอบ)',
        'ระบบสร้างเลขครุภัณฑ์ราชการอัตโนมัติ (เช่น 10670-6515-004-0001/68)',
        'การตรวจสอบหมายเลขเครื่อง (Serial Number) ซ้ำแบบ Real-time',
        'ระบบแนบไฟล์ภาพถ่ายและเอกสารตรวจรับ/สัญญาจัดซื้อจัดจ้าง',
        'การสร้างและพิมพ์สติกเกอร์ QR Code สำหรับติดตัวเครื่อง',
        'ระบบล็อกอินและสิทธิ์การเข้าถึง (RBAC) แยกตามระดับผู้ใช้',
      ],
      currentStatus: 'พัฒนาเสร็จสมบูรณ์ พร้อมใช้งานในระบบนี้',
    },
    {
      phase: 'Phase 2',
      badge: 'สำคัญยิ่งยวดเชิงระเบียบและการเงิน (High Priority)',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'เครื่องคำนวณค่าเสื่อมราคาเส้นตรง (Depreciation Engine) & รายงาน GFMIS',
      duration: 'เดือนที่ 3 – 4',
      objective:
        'ตอบโจทย์ความถูกต้องตามระเบียบกรมบัญชีกลางและป้องกันข้อทักท้วงจาก สตง.',
      deliverables: [
        'อัลกอริทึมคำนวณค่าเสื่อมราคาเส้นตรงรายเดือนตามปีงบประมาณไทย (1 ต.ค. – 30 ก.ย.)',
        'การตรวจสอบเกณฑ์ 5,000 บาท (ต่ำกว่าเกณฑ์คุมในทะเบียนแต่ไม่คิดค่าเสื่อม)',
        'เริ่มคิดค่าเสื่อมเดือนถัดจากวันพร้อมใช้ และหยุดคิดเมื่อมูลค่าสุทธิเหลือ 1 บาท',
        'การสร้างตารางค่าเสื่อมราคารายปีและรายเดือนอัตโนมัติ',
        'รายงานทะเบียนคุมทรัพย์สิน (แบบ 1 แผ่น/1 รายการ ตามกรมบัญชีกลาง)',
        'ระบบประมวลผลงวดบัญชีรายเดือนและการกระทบยอดกับระบบ GFMIS',
      ],
      currentStatus: 'พัฒนาเสร็จสมบูรณ์ พร้อมใช้งานในระบบนี้',
    },
    {
      phase: 'Phase 3',
      badge: 'การปฏิบัติการภาคสนาม & ออฟไลน์ (Field Operations)',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      title: 'ระบบตรวจนับพัสดุประจำปีบนมือถือแบบ Offline-First & Auto-Sync',
      duration: 'เดือนที่ 5 – 6',
      objective:
        'แก้ปัญหาหน้างานจริง เช่น ชั้นใต้ดิน ห้องเก็บของ หรือ รพ.สต. ห่างไกลที่ไม่มีสัญญาณอินเทอร์เน็ต',
      deliverables: [
        'Web App บนมือถือ (PWA) พร้อมเครื่องสแกน QR Code หน้างาน',
        'ฐานข้อมูลออฟไลน์ในเครื่อง (Local Storage / IndexedDB)',
        'ระบบบันทึกผลการตรวจนับ (พบปกติ / ชำรุด / ไม่พบ / ผิดห้อง)',
        'ระบบซิงค์ข้อมูลอัตโนมัติ (Background Auto-Sync) เมื่อต่อเน็ตได้อีกครั้ง',
        'รายงานสรุปผลต่าง (Variance Report) สำหรับคณะกรรมการตรวจนับประจำปี',
      ],
      currentStatus: 'พัฒนาเสร็จสมบูรณ์ พร้อมใช้งานในระบบนี้ (ทดสอบปุ่มจำลองออฟไลน์ได้ทันที)',
    },
    {
      phase: 'Phase 4',
      badge: 'การบริหารจัดการความต่อเนื่อง (Service Continuity)',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'ระบบแจ้งซ่อมออนไลน์, แผน PM, สอบเทียบเครื่องมือแพทย์ & ยืม-คืน',
      duration: 'เดือนที่ 7 – 8',
      objective:
        'รักษาความพร้อมใช้งานของอุปกรณ์ทางการแพทย์และความคุ้มค่าตลอดอายุการใช้งาน',
      deliverables: [
        'แบบฟอร์มแจ้งซ่อมออนไลน์พร้อมแนบภาพอาการเสีย',
        'การมอบหมายช่าง, บันทึกการแก้ไข, อะไหล่ที่เปลี่ยน และค่าใช้จ่าย',
        'ตารางแผนบำรุงรักษาเชิงป้องกัน (PM) และรอบสอบเทียบความปลอดภัย',
        'ระบบแจ้งเตือนเมื่อถึงกำหนดรอบล่วงหน้า 30 วัน',
        'ระบบการยืม-คืนพัสดุ (ใบยืม ยม.) พร้อมระบบเตือนเมื่อเกินกำหนดส่งคืน',
      ],
      currentStatus: 'พัฒนาเสร็จสมบูรณ์ พร้อมใช้งานในระบบนี้',
    },
    {
      phase: 'Phase 5',
      badge: 'การสิ้นสุดวงจรชีวิต & การเชื่อมโยงระดับจังหวัด (Governance & Scale)',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      title: 'กระบวนการจำหน่ายพัสดุตามระเบียบฯ & Multi-tenant Hierarchy สสจ.',
      duration: 'เดือนที่ 9 – 10',
      objective:
        'จัดการพัสดุจนถึงจุดสิ้นสุดวงจรชีวิตอย่างถูกต้องตามกฎหมาย และเชื่อมโยงทั้งจังหวัด',
      deliverables: [
        'Workflow การจำหน่ายพัสดุ 5 วิธี (ขาย, แลกเปลี่ยน, โอน, ทำลาย, ตัดสูญ)',
        'บันทึกผลการสอบหาข้อเท็จจริงของคณะกรรมการ และการแจ้ง สตง.',
        'ระบบหลายหน่วยงาน (Multi-tenant) สสจ. / โรงพยาบาล / สสอ. / รพ.สต.',
        'Row-Level Security (RLS) แยกสิทธิ์การเห็นข้อมูลระหว่างหน่วยงาน',
        'รองรับการล็อกอินผ่านระบบกลางกระทรวงสาธารณสุข (Health ID / AD SSO)',
      ],
      currentStatus: 'พัฒนาเสร็จสมบูรณ์ พร้อมใช้งานในระบบนี้',
    },
  ];

  return (
    <div className="space-y-6 text-xs">
      {/* Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-slate-900">
              แผนการจัดลำดับความสำคัญของฟีเจอร์ที่ควรพัฒนา (Feature Roadmap)
            </h1>
            <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2.5 py-0.5 rounded-full">
              สสจ. &amp; รพ. โมเดล
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            วิเคราะห์และจัดลำดับตามหลักเกณฑ์ พ.ร.บ. การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. ๒๕๖๐
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-semibold shadow-xs transition-colors"
          >
            ไปยังหน้าภาพรวมระบบ
          </button>
        </div>
      </div>

      {/* Overview Matrix Banner */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-900 text-white rounded-2xl p-6 shadow-md">
        <h2 className="text-base font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>หลักการจัดลำดับความสำคัญตามระเบียบราชการ (Rationalization)</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">1. ลำดับแรก (Must Have):</span>
            <span>
              ทะเบียนทรัพย์สิน + ระบบสร้างรหัสครุภัณฑ์ราชการ + Depreciation Engine เส้นตรง เพราะหากไม่มีข้อมูลตั้งต้นและค่าเสื่อมราคา จะส่งงบดุลและรายงาน สตง. ไม่ได้
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">2. ลำดับรอง (Should Have):</span>
            <span>
              ระบบตรวจนับพัสดุประจำปีแบบ Offline-First PWA บนมือถือ เพื่อตอบสนองกฎหมายที่บังคับตรวจนับก่อน 30 ก.ย. และส่งรายงานภายใน 30 ธ.ค.
            </span>
          </div>
          <div className="bg-white/10 rounded-xl p-3 border border-white/10">
            <span className="font-bold text-amber-300 block mb-1">3. ลำดับต่อขยาย (Could Have):</span>
            <span>
              การยืม-คืน, แผนสอบเทียบเครื่องมือแพทย์ PM, และ Workflow จำหน่ายพัสดุเพื่อตัดออกจากบัญชีเมื่อสิ้นสุดอายุ
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Phase Cards */}
      <div className="space-y-4">
        {phases.map((p, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-black flex items-center justify-center text-sm shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{p.title}</h3>
                  <span className="text-[11px] text-slate-500 font-medium">ระยะเวลา: {p.duration}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-center">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${p.badgeColor}`}>
                  {p.badge}
                </span>
              </div>
            </div>

            <p className="text-slate-700 font-medium">{p.objective}</p>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
              <span className="font-bold text-slate-800 block text-[11px] mb-1.5">
                ฟังก์ชันหลักที่ต้องส่งมอบในระยะนี้:
              </span>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600">
                {p.deliverables.map((item, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px]">
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                {p.currentStatus}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
