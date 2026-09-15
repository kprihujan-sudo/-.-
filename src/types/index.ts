export type OrgType = 'SSJ' | 'HOSPITAL' | 'DHO' | 'PCU' | 'DEPARTMENT';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'PURCHASING_HEAD' 
  | 'PURCHASING_OFFICER' 
  | 'FINANCE_OFFICER' 
  | 'COMMITTEE_MEMBER' 
  | 'TECHNICIAN' 
  | 'GENERAL_USER' 
  | 'AUDITOR';

export interface Organization {
  id: string;
  code: string;
  name: string;
  shortName: string;
  type: 'PROVINCIAL_HQ' | 'DHO' | 'HOSPITAL';
  typeLabel: string;
  district: string;
  hasAdminRole: boolean;
  departments: string[];
}

export const SATUN_ORGANIZATIONS: Organization[] = [
  {
    id: 'org-1',
    code: '91000',
    name: 'สำนักงานสาธารณสุขจังหวัดสตูล',
    shortName: 'สสจ.สตูล',
    type: 'PROVINCIAL_HQ',
    typeLabel: 'สำนักงานสาธารณสุขจังหวัด (ศูนย์กลางบริหาร)',
    district: 'เมืองสตูล',
    hasAdminRole: true,
    departments: [
      'กลุ่มงานบริหารทั่วไป (งานพัสดุและยานพาหนะ)',
      'กลุ่มงานพัฒนายุทธศาสตร์สาธารณสุข',
      'กลุ่มงานควบคุมโรคติดต่อ',
      'กลุ่มงานประกันสุขภาพ',
      'กลุ่มงานทันตสาธารณสุข',
      'กลุ่มงานคุ้มครองผู้บริโภคและเภสัชสาธารณสุข',
      'ศูนย์เทคโนโลยีสารสนเทศและการสื่อสาร',
    ],
  },
  {
    id: 'org-2',
    code: '91001',
    name: 'สำนักงานสาธารณสุขอำเภอเมืองสตูล',
    shortName: 'สสอ.เมืองสตูล',
    type: 'DHO',
    typeLabel: 'สำนักงานสาธารณสุขอำเภอ',
    district: 'เมืองสตูล',
    hasAdminRole: false,
    departments: ['งานบริหารทั่วไปและพัสดุ', 'งานบริการปฐมภูมิ', 'งานควบคุมโรค'],
  },
  {
    id: 'org-3',
    code: '91002',
    name: 'สำนักงานสาธารณสุขอำเภอควนโดน',
    shortName: 'สสอ.ควนโดน',
    type: 'DHO',
    typeLabel: 'สำนักงานสาธารณสุขอำเภอ',
    district: 'ควนโดน',
    hasAdminRole: false,
    departments: ['งานบริหารทั่วไปและพัสดุ', 'งานบริการปฐมภูมิ', 'งานควบคุมโรค'],
  },
  {
    id: 'org-4',
    code: '91003',
    name: 'สำนักงานสาธารณสุขอำเภอควนกาหลง',
    shortName: 'สสอ.ควนกาหลง',
    type: 'DHO',
    typeLabel: 'สำนักงานสาธารณสุขอำเภอ',
    district: 'ควนกาหลง',
    hasAdminRole: false,
    departments: ['งานบริหารทั่วไปและพัสดุ', 'งานบริการปฐมภูมิ', 'งานส่งเสริมสุขภาพ'],
  },
  {
    id: 'org-5',
    code: '91004',
    name: 'สำนักงานสาธารณสุขอำเภอท่าแพ',
    shortName: 'สสอ.ท่าแพ',
    type: 'DHO',
    typeLabel: 'สำนักงานสาธารณสุขอำเภอ',
    district: 'ท่าแพ',
    hasAdminRole: false,
    departments: ['งานบริหารทั่วไปและพัสดุ', 'งานบริการปฐมภูมิ', 'งานควบคุมโรค'],
  },
  {
    id: 'org-6',
    code: '91005',
    name: 'สำนักงานสาธารณสุขอำเภอละงู',
    shortName: 'สสอ.ละงู',
    type: 'DHO',
    typeLabel: 'สำนักงานสาธารณสุขอำเภอ',
    district: 'ละงู',
    hasAdminRole: false,
    departments: ['งานบริหารทั่วไปและพัสดุ', 'งานบริการปฐมภูมิ', 'งานควบคุมโรค'],
  },
  {
    id: 'org-7',
    code: '91006',
    name: 'สำนักงานสาธารณสุขอำเภอทุ่งหว้า',
    shortName: 'สสอ.ทุ่งหว้า',
    type: 'DHO',
    typeLabel: 'สำนักงานสาธารณสุขอำเภอ',
    district: 'ทุ่งหว้า',
    hasAdminRole: false,
    departments: ['งานบริหารทั่วไปและพัสดุ', 'งานบริการปฐมภูมิ', 'งานควบคุมโรค'],
  },
  {
    id: 'org-8',
    code: '91007',
    name: 'สำนักงานสาธารณสุขอำเภอมะนัง',
    shortName: 'สสอ.มะนัง',
    type: 'DHO',
    typeLabel: 'สำนักงานสาธารณสุขอำเภอ',
    district: 'มะนัง',
    hasAdminRole: false,
    departments: ['งานบริหารทั่วไปและพัสดุ', 'งานบริการปฐมภูมิ', 'งานควบคุมโรค'],
  },
  {
    id: 'org-9',
    code: '10670',
    name: 'โรงพยาบาลสตูล',
    shortName: 'รพ.สตูล',
    type: 'HOSPITAL',
    typeLabel: 'โรงพยาบาลทั่วไป (แม่ข่าย)',
    district: 'เมืองสตูล',
    hasAdminRole: false,
    departments: [
      'กลุ่มงานบริหารทั่วไป (งานพัสดุ)',
      'กลุ่มงานการพยาบาลผู้ป่วยนอก (OPD)',
      'กลุ่มงานอุบัติเหตุและฉุกเฉิน (ER)',
      'กลุ่มงานผู้ป่วยใน (IPD)',
      'กลุ่มงานเทคนิคบริการและซ่อมบำรุง',
      'กลุ่มงานการเงินและบัญชี',
      'กลุ่มงานรังสีวิทยา',
      'กลุ่มงานเวชปฏิบัติครอบครัวและชุมชน',
    ],
  },
  {
    id: 'org-10',
    code: '10671',
    name: 'โรงพยาบาลควนโดน',
    shortName: 'รพ.ควนโดน',
    type: 'HOSPITAL',
    typeLabel: 'โรงพยาบาลชุมชน',
    district: 'ควนโดน',
    hasAdminRole: false,
    departments: ['งานบริหารและพัสดุ', 'กลุ่มงานการพยาบาล', 'งานอุบัติเหตุฉุกเฉิน', 'กลุ่มงานเทคนิคบริการ'],
  },
  {
    id: 'org-11',
    code: '10672',
    name: 'โรงพยาบาลควนกาหลง',
    shortName: 'รพ.ควนกาหลง',
    type: 'HOSPITAL',
    typeLabel: 'โรงพยาบาลชุมชน',
    district: 'ควนกาหลง',
    hasAdminRole: false,
    departments: ['งานบริหารและพัสดุ', 'กลุ่มงานการพยาบาล', 'งานอุบัติเหตุฉุกเฉิน', 'กลุ่มงานบริการทางการแพทย์'],
  },
  {
    id: 'org-12',
    code: '10673',
    name: 'โรงพยาบาลท่าแพ',
    shortName: 'รพ.ท่าแพ',
    type: 'HOSPITAL',
    typeLabel: 'โรงพยาบาลชุมชน',
    district: 'ท่าแพ',
    hasAdminRole: false,
    departments: ['งานบริหารและพัสดุ', 'กลุ่มงานการพยาบาล', 'งานอุบัติเหตุฉุกเฉิน', 'งานซ่อมบำรุงและเครื่องมือแพทย์'],
  },
  {
    id: 'org-13',
    code: '10674',
    name: 'โรงพยาบาลละงู',
    shortName: 'รพ.ละงู',
    type: 'HOSPITAL',
    typeLabel: 'โรงพยาบาลชุมชน (โซนชายทะเล)',
    district: 'ละงู',
    hasAdminRole: false,
    departments: ['งานบริหารและพัสดุ', 'กลุ่มงานการพยาบาล', 'งานอุบัติเหตุฉุกเฉินและส่งต่อ', 'กลุ่มงานเทคนิคบริการ'],
  },
  {
    id: 'org-14',
    code: '10675',
    name: 'โรงพยาบาลทุ่งหว้า',
    shortName: 'รพ.ทุ่งหว้า',
    type: 'HOSPITAL',
    typeLabel: 'โรงพยาบาลชุมชน',
    district: 'ทุ่งหว้า',
    hasAdminRole: false,
    departments: ['งานบริหารและพัสดุ', 'กลุ่มงานการพยาบาล', 'งานอุบัติเหตุฉุกเฉิน', 'กลุ่มงานบริการทางการแพทย์'],
  },
  {
    id: 'org-15',
    code: '10676',
    name: 'โรงพยาบาลมะนัง',
    shortName: 'รพ.มะนัง',
    type: 'HOSPITAL',
    typeLabel: 'โรงพยาบาลชุมชน',
    district: 'มะนัง',
    hasAdminRole: false,
    departments: ['งานบริหารและพัสดุ', 'กลุ่มงานการพยาบาล', 'งานอุบัติเหตุฉุกเฉิน', 'กลุ่มงานบริการทางการแพทย์'],
  },
];

export interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  position: string;
  department: string;
  orgId: string;
  orgName: string;
  role: UserRole;
  roleLabel: string;
  avatar?: string;
  isAdmin?: boolean;
}

export type AssetStatus = 
  | 'PENDING_APPROVAL' 
  | 'IN_USE' 
  | 'IDLE' 
  | 'BORROWED' 
  | 'REPAIR' 
  | 'DAMAGED' 
  | 'LOST' 
  | 'PENDING_DISPOSAL' 
  | 'DISPOSED' 
  | 'TRANSFERRED';

export type AcquireType = 'PURCHASE' | 'DONATE' | 'TRANSFER_IN' | 'BUILD' | 'EXCHANGE';

export interface AssetCategory {
  code: string;
  name: string;
  usefulLifeYr: number;
  gfmisAssetCls: string;
  requiresCalibration?: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'PHOTO' | 'INVOICE' | 'CONTRACT' | 'RECEIPT' | 'WARRANTY' | 'MANUAL';
  url: string;
  sizeKb: number;
  uploadedAt: string;
}

export interface Asset {
  id: number;
  assetNo: string;
  gfmisAssetNo?: string;
  assetName: string;
  categoryCode: string;
  categoryName: string;
  brand: string;
  model: string;
  serialNo: string;
  spec: string;
  acquireType: AcquireType;
  acquireDate: string; // YYYY-MM-DD
  inServiceDate: string; // YYYY-MM-DD
  fiscalYear: number; // e.g. 2568
  budgetSourceCode: 'GOV' | 'REVENUE' | 'NHSO' | 'DONATION';
  budgetSourceName: string;
  documentNo: string;
  poNo?: string;
  vendorName: string;
  unitCost: number;
  quantity: number;
  totalCost: number;
  usefulLifeYr: number;
  salvageValue: number; // usually 1 Baht
  isDepreciable: boolean;
  accumulatedDep: number;
  netBookValue: number;
  depreciationStartDate?: string;
  building: string;
  floor: string;
  room: string;
  locationPath: string;
  custodianId: number;
  custodianName: string;
  custodianPosition: string;
  department: string;
  orgId?: string;
  orgName?: string;
  warrantyEnd?: string;
  status: AssetStatus;
  qrToken: string;
  photos: string[];
  attachments: Attachment[];
  remark?: string;
  lastCountedDate?: string;
  isOverdueForInspection?: boolean;
}

export interface DepreciationScheduleRow {
  fiscalYear: number;
  periodLabel: string;
  monthsCharged: number;
  depreciation: number;
  accumulated: number;
  netBookValue: number;
  status: 'POSTED' | 'PROJECTED';
}

export type MaintenanceJobType = 'REPAIR' | 'PM' | 'CALIBRATION' | 'INSPECTION';
export type MaintenanceUrgency = 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL';
export type MaintenanceStatus = 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface MaintenanceJob {
  id: number;
  ticketNo: string;
  assetId: number;
  assetNo: string;
  assetName: string;
  jobType: MaintenanceJobType;
  urgency: MaintenanceUrgency;
  status: MaintenanceStatus;
  symptom: string;
  actionTaken?: string;
  partsReplaced?: string;
  cost?: number;
  technicianName?: string;
  reportedBy: string;
  reportedAt: string;
  completedAt?: string;
  photosBefore: string[];
  photosAfter: string[];
  affectsService?: boolean;
}

export interface MaintenanceSchedule {
  id: number;
  assetId: number;
  assetNo: string;
  assetName: string;
  scheduleType: 'PM' | 'CALIBRATION';
  frequency: 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUAL' | 'ANNUAL';
  lastPerformedDate?: string;
  nextDueDate: string;
  daysUntilDue: number;
  isOverdue: boolean;
  assignedVendorOrStaff: string;
}

export type FoundStatus = 'FOUND' | 'NOT_FOUND' | 'DAMAGED' | 'OBSOLETE' | 'UNREGISTERED';

export interface InventoryCountRecord {
  id: string;
  clientUuid: string;
  roundId: number;
  assetId: number;
  assetNo: string;
  assetName: string;
  expectedLocation: string;
  actualLocation: string;
  foundStatus: FoundStatus;
  countedAt: string;
  countedBy: string;
  photos: string[];
  remark?: string;
  synced: boolean;
}

export interface BorrowRecord {
  id: number;
  docNo: string;
  assetId: number;
  assetNo: string;
  assetName: string;
  borrowerName: string;
  department: string;
  purpose: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

export type DisposalMethod = 'SELL' | 'EXCHANGE' | 'TRANSFER_OUT' | 'DESTROY' | 'WRITE_OFF';

export interface DisposalRecord {
  id: number;
  docNo: string;
  assetId: number;
  assetNo: string;
  assetName: string;
  originalCost: number;
  nbvAtDisposal: number;
  method: DisposalMethod;
  reason: string;
  proposedDate: string;
  approvedDate?: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'EXECUTED';
  committee: string[];
}

export interface OfflineQueueItem {
  id: string;
  type: 'COUNT' | 'MAINTENANCE' | 'ASSET_CREATE' | 'BORROW';
  payload: any;
  createdAt: string;
  retryCount: number;
}
