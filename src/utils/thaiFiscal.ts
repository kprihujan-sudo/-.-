import { Asset, DepreciationScheduleRow } from '../types';

/**
 * แปลงวันที่ ค.ศ. (YYYY-MM-DD) เป็นปีงบประมาณไทย (พ.ศ.)
 * ปีงบประมาณไทย: 1 ต.ค. (ปีก่อนหน้า) ถึง 30 ก.ย. (ปีงบ)
 */
export function getThaiFiscalYear(dateString: string): number {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return new Date().getFullYear() + 543;
  const month = date.getMonth() + 1; // 1 - 12
  const yearCe = date.getFullYear();
  const yearBe = yearCe + 543;
  return month >= 10 ? yearBe + 1 : yearBe;
}

/**
 * คำนวณวันเริ่มคิดค่าเสื่อมราคา (เดือนถัดจากเดือนที่พร้อมใช้งาน)
 * ตัวอย่าง: พร้อมใช้ 20 ม.ค. 2568 -> เริ่มคิด 1 ก.พ. 2568
 */
export function getDepreciationStartDate(inServiceDateStr: string): string {
  const date = new Date(inServiceDateStr);
  if (isNaN(date.getTime())) return inServiceDateStr;
  
  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  
  const nextMonthDate = new Date(currentYear, currentMonth + 1, 1);
  const y = nextMonthDate.getFullYear();
  const m = String(nextMonthDate.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

/**
 * ฟอร์แมตตัวเลขเป็นสกุลเงินบาทไทย
 */
export function formatCurrency(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '0.00 บาท';
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * ฟอร์แมตตัวเลขแบบไม่มีสัญลักษณ์สกุลเงิน
 */
export function formatNumber(amount: number | undefined | null): string {
  if (amount === undefined || amount === null) return '0.00';
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * แปลงวันที่เป็นรูปแบบไทย เช่น "25 ม.ค. 2568"
 */
export function formatThaiDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const thaiMonths = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ];

  const d = date.getDate();
  const m = thaiMonths[date.getMonth()];
  const y = date.getFullYear() + 543;

  return `${d} ${m} ${y}`;
}

export function formatThaiFullDate(dateStr: string | undefined | null): string {
  if (!dateStr) return '-';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;

  const thaiFullMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ];

  const d = date.getDate();
  const m = thaiFullMonths[date.getMonth()];
  const y = date.getFullYear() + 543;

  return `${d} ${m} พ.ศ. ${y}`;
}

/**
 * ตรวจสอบเงื่อนไขการคิดค่าเสื่อมราคาตามระเบียบกระทรวงการคลัง
 * 1. ราคาต่อหน่วย >= 5,000 บาท
 * 2. ได้มาตั้งแต่วันที่ 1 ต.ค. 2539 เป็นต้นไป
 */
export function checkDepreciableEligibility(unitCost: number, acquireDateStr: string): {
  isEligible: boolean;
  reason?: string;
} {
  if (unitCost < 5000) {
    return {
      isEligible: false,
      reason: 'ราคาต่อหน่วยต่ำกว่าเกณฑ์ครุภัณฑ์ (ต่ำกว่า 5,000 บาท) จัดเป็นครุภัณฑ์ต่ำกว่าเกณฑ์ขึ้นทะเบียนคุมแต่ไม่คิดค่าเสื่อมราคา',
    };
  }

  const acquireDate = new Date(acquireDateStr);
  const cutoffDate = new Date('1996-10-01'); // 1 ต.ค. 2539
  if (!isNaN(acquireDate.getTime()) && acquireDate < cutoffDate) {
    return {
      isEligible: false,
      reason: 'ครุภัณฑ์ได้มาก่อนปีงบประมาณ 2540 (1 ต.ค. 2539) บันทึกทะเบียนคุมแต่ไม่คิดค่าเสื่อมราคา',
    };
  }

  return { isEligible: true };
}

/**
 * คำนวณค่าเสื่อมราคารายปีและรายเดือน (วิธีเส้นตรง)
 */
export function calculateDepreciationBase(cost: number, usefulLifeYr: number, salvageValue = 1) {
  if (usefulLifeYr <= 0 || cost < 5000) {
    return {
      annualDepreciation: 0,
      monthlyDepreciation: 0,
      depreciableCost: 0,
    };
  }

  const depreciableCost = Math.max(0, cost - salvageValue);
  const annualDepreciation = Number((depreciableCost / usefulLifeYr).toFixed(2));
  const monthlyDepreciation = Number((annualDepreciation / 12).toFixed(2));

  return {
    annualDepreciation,
    monthlyDepreciation,
    depreciableCost,
  };
}

/**
 * สร้างตารางค่าเสื่อมราคาแบบเส้นตรง (Straight-Line Depreciation Schedule)
 * ตามปีงบประมาณไทย จนกระทั่งมูลค่าสุทธิเหลือ 1 บาท
 */
export function generateDepreciationSchedule(
  cost: number,
  usefulLifeYr: number,
  inServiceDateStr: string,
  currentFiscalYear = 2568
): DepreciationScheduleRow[] {
  const schedule: DepreciationScheduleRow[] = [];
  const salvageValue = 1;

  if (cost < 5000 || usefulLifeYr <= 0) {
    return [
      {
        fiscalYear: getThaiFiscalYear(inServiceDateStr),
        periodLabel: `ปีงบประมาณ ${getThaiFiscalYear(inServiceDateStr)}`,
        monthsCharged: 0,
        depreciation: 0,
        accumulated: 0,
        netBookValue: cost,
        status: 'POSTED',
      },
    ];
  }

  const startDateStr = getDepreciationStartDate(inServiceDateStr);
  const startDate = new Date(startDateStr);
  const startMonth = startDate.getMonth() + 1; // 1-12
  const startYearBe = startDate.getFullYear() + 543;
  const firstFiscalYear = startMonth >= 10 ? startYearBe + 1 : startYearBe;

  // จำนวนเดือนปีแรก (นับจากเดือนเริ่มคิด จนถึง ก.ย. ซึ่งคือเดือน 9)
  let firstYearMonths = 0;
  if (startMonth >= 10) {
    // เช่น ต.ค. (10) ถึง ก.ย. ปีถัดไป = 12 - (10 - 1) = 12 - 9 = 12 เดือน (หรือ ต.ค.=12, พ.ย.=11, ธ.ค.=10)
    firstYearMonths = (12 - startMonth + 1) + 9;
  } else {
    // เช่น ก.พ. (2) ถึง ก.ย. (9) = 9 - 2 + 1 = 8 เดือน
    firstYearMonths = 9 - startMonth + 1;
  }

  const totalDepreciable = cost - salvageValue;
  const monthlyDep = totalDepreciable / (usefulLifeYr * 12);

  let accumulated = 0;
  let remainingDepreciable = totalDepreciable;

  let yearIndex = 0;
  let runningFY = firstFiscalYear;

  while (remainingDepreciable > 0.01 && yearIndex < usefulLifeYr + 2) {
    let monthsThisYear = 12;
    if (yearIndex === 0) {
      monthsThisYear = firstYearMonths;
    }

    let depThisYear = Number((monthlyDep * monthsThisYear).toFixed(2));
    if (depThisYear > remainingDepreciable || yearIndex === usefulLifeYr) {
      depThisYear = Number(remainingDepreciable.toFixed(2));
    }

    accumulated = Number((accumulated + depThisYear).toFixed(2));
    remainingDepreciable = Number((totalDepreciable - accumulated).toFixed(2));
    
    // ตรวจสอบมูลค่าสุทธิขั้นต่ำ 1 บาท
    const nbv = Math.max(salvageValue, Number((cost - accumulated).toFixed(2)));

    schedule.push({
      fiscalYear: runningFY,
      periodLabel: `ปีงบประมาณ ${runningFY}`,
      monthsCharged: monthsThisYear,
      depreciation: depThisYear,
      accumulated: accumulated,
      netBookValue: nbv,
      status: runningFY <= currentFiscalYear ? 'POSTED' : 'PROJECTED',
    });

    if (nbv <= salvageValue) {
      break;
    }

    runningFY++;
    yearIndex++;
  }

  return schedule;
}
