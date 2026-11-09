import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpenCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Download,
  CheckSquare,
  RotateCcw,
  BarChart3,
  AlertTriangle,
  Send,
  Eye,
  FileCheck,
  Building2,
  Filter,
  FileSpreadsheet,
  Printer,
  ShieldCheck,
  Calendar,
  X,
  TrendingUp,
  FolderTree,
  Folder,
  FolderOpen,
  FileText,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  Trash2,
} from 'lucide-react';
import { ArchiveBorrowRecord, NavigationModule } from '../types/archive';
import { mockArchiveBorrows } from '../data/mockData';
import { Pagination } from '../components/Pagination';

// Realistic Archive Item in "借阅档案" directory & catalog
export interface ArchiveCatalogBorrowItem {
  id: string;
  status: '档案库' | '在档' | '可借阅';
  fondsNo: string;
  year: number;
  refCode: string;
  title: string;
  securityLevel: '公开' | '内部' | '秘密' | '机密';
  retention: '10年' | '30年' | '永久';
  docNo: string;
  category: '文书档案' | '会计档案' | '基建档案' | '设备档案' | '照片档案' | '声像档案' | '实物档案';
  level: '文件' | '案卷';
  carrierFormat: '实体、电子' | '实体' | '电子';
  pageCount: number;
  archivedDate: string; // 2026-11-01 ~ 2026-11-05
}

interface ArchiveBorrowViewProps {
  submodule?: 'borrow_records' | 'borrow_approve' | 'borrow_return' | 'borrow_stats';
  onNavigate?: (module: NavigationModule) => void;
  onSelectRecord: (record: any) => void;
  onShowMessage: (msg: string) => void;
}

// Borrow Approval Item strictly matching user's screenshots
export interface BorrowApprovalItem {
  id: string;
  borrowNo: string;
  applicant: string;
  borrowType: '实体档案' | '电子档案';
  dept: string;
  borrowTime: string;
  returnTime: string;
  purpose: string;
  remark: string;
  ePermission: '---' | '浏览' | '浏览、下载';
  archiveRefCode: string;
  archiveTitle: string;
  category?: string;
  fondsNo?: string;
  securityLevel?: '公开' | '内部' | '秘密' | '机密';
  retention?: '10年' | '30年' | '永久';
  pageCount?: number;
  status: '待审批' | '已通过' | '已驳回';
  approveResult?: string;
  approver?: string;
  approveTime?: string;
  approveComment?: string;
}

// 13 realistic pending approval items (recent Nov 2026 dates <= Nov 5, descending order, zero XXX)
const initialPendingApprovalList: BorrowApprovalItem[] = [
  {
    id: 'ba-p-01',
    borrowNo: 'DAJY-20261105-001',
    applicant: '李志远',
    borrowType: '实体档案',
    dept: '规划发展部',
    borrowTime: '2026-11-05',
    returnTime: '2026-11-12',
    purpose: '成华区二期安置房项目规划复核与选址红线审查',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0110-WS·2026-Y-BGS-0001',
    archiveTitle: '关于成立成都市就业工作领导小组的通知',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 16,
    status: '待审批',
  },
  {
    id: 'ba-p-02',
    borrowNo: 'DAJY-20261105-002',
    applicant: '陈若曦',
    borrowType: '电子档案',
    dept: '科技信息部',
    borrowTime: '2026-11-05',
    returnTime: '2026-11-12',
    purpose: '数字政府新一代统一身份认证系统架构升级参考',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0110-JJ·2026-30Y-GC-0003',
    archiveTitle: '天府软件园三期智慧云谷工程主体结构竣工验收报告与抗震设防审查意见',
    category: '基建档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 46,
    status: '待审批',
  },
  {
    id: 'ba-p-03',
    borrowNo: 'DAJY-20261105-003',
    applicant: '王建国',
    borrowType: '电子档案',
    dept: '财务资产部',
    borrowTime: '2026-11-05',
    returnTime: '2026-11-10',
    purpose: '2026年度市国资委清产核资专项财务审计对账',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0110-CW·2025-Y-CW-0001',
    archiveTitle: '2025年度市属国有重点企业财务清查决算审计终结清算报告',
    category: '会计档案',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '永久',
    pageCount: 110,
    status: '待审批',
  },
  {
    id: 'ba-p-04',
    borrowNo: 'DAJY-20261104-001',
    applicant: '刘晓敏',
    borrowType: '实体档案',
    dept: '办公室',
    borrowTime: '2026-11-04',
    returnTime: '2026-11-11',
    purpose: '筹备全市优化营商环境大会汇报材料编写',
    remark: '申请原件复印盖章',
    ePermission: '---',
    archiveRefCode: '0110-WS·2026-Y-BGS-0002',
    archiveTitle: '成都市进一步优化营商环境激发市场主体活力实施方案',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '30年',
    pageCount: 38,
    status: '待审批',
  },
  {
    id: 'ba-p-05',
    borrowNo: 'DAJY-20261104-002',
    applicant: '周海涛',
    borrowType: '实体档案',
    dept: '工程管理部',
    borrowTime: '2026-11-04',
    returnTime: '2026-11-08',
    purpose: '高新西区保障性租赁住房一期主体封顶质量评定',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0110-JJ·2025-30Y-GC-0002',
    archiveTitle: '高新西区保障性租赁住房一期主体封顶质量检测评定与地勘报告',
    category: '基建档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 65,
    status: '待审批',
  },
  {
    id: 'ba-p-06',
    borrowNo: 'DAJY-20261104-003',
    applicant: '郑雪梅',
    borrowType: '电子档案',
    dept: '科技信息部',
    borrowTime: '2026-11-04',
    returnTime: '2026-11-09',
    purpose: '智慧档案管理平台恒温恒湿测控双机热备配置方案复验',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0110-SB·2025-10Y-SB-0012',
    archiveTitle: '智慧档案馆库房高密级恒温恒湿双系统与七氟丙烷气体灭火设施巡检移交台账',
    category: '设备档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '10年',
    pageCount: 32,
    status: '待审批',
  },
  {
    id: 'ba-p-07',
    borrowNo: 'DAJY-20261103-001',
    applicant: '赵德成',
    borrowType: '电子档案',
    dept: '审计法务部',
    borrowTime: '2026-11-03',
    returnTime: '2026-11-07',
    purpose: '市属国有企业重大法律合规性与资产处置专项审查',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0110-WS·2026-Y-BGS-0004',
    archiveTitle: '2026年市属国有企业清产核资与重大风险防范指导意见',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '30年',
    pageCount: 52,
    status: '待审批',
  },
  {
    id: 'ba-p-08',
    borrowNo: 'DAJY-20261103-002',
    applicant: '黄文华',
    borrowType: '实体档案',
    dept: '人力资源部',
    borrowTime: '2026-11-03',
    returnTime: '2026-11-06',
    purpose: '局属事业单位中层骨干年终履职考核述职材料查验',
    remark: '需加盖查阅密封章',
    ePermission: '---',
    archiveRefCode: '0110-WS·2026-Y-BGS-0003',
    archiveTitle: '市政府常务会议关于高新技术产业开发区扩区规划若干决议',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 24,
    status: '待审批',
  },
  {
    id: 'ba-p-09',
    borrowNo: 'DAJY-20261102-001',
    applicant: '孙思敏',
    borrowType: '电子档案',
    dept: '办公室',
    borrowTime: '2026-11-02',
    returnTime: '2026-11-09',
    purpose: '制作成都市重大政务外事考察图片档案宣传折页',
    remark: '仅阅览高清底片',
    ePermission: '浏览、下载',
    archiveRefCode: '0110-ZP·2026-30Y-ZP-0001',
    archiveTitle: '2026年中国西部国际博览城重点展会代表团考察座谈高清原版照片集',
    category: '照片档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 88,
    status: '待审批',
  },
  {
    id: 'ba-p-10',
    borrowNo: 'DAJY-20261102-002',
    applicant: '宋明哲',
    borrowType: '实体档案',
    dept: '工程管理部',
    borrowTime: '2026-11-02',
    returnTime: '2026-11-05',
    purpose: '老旧小区加装电梯民生实事工程图纸核实与质保溯源',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0110-WS·2026-Y-BGS-0005',
    archiveTitle: '关于开展全市老旧小区加装电梯民生实事工程专项考核通报',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '10年',
    pageCount: 18,
    status: '待审批',
  },
  {
    id: 'ba-p-11',
    borrowNo: 'DAJY-20261101-001',
    applicant: '冯天赐',
    borrowType: '实体档案',
    dept: '科技信息部',
    borrowTime: '2026-11-01',
    returnTime: '2026-11-06',
    purpose: '数字档案室高水平样板单位金质奖牌展厅陈列布展',
    remark: '实物移交登记',
    ePermission: '---',
    archiveRefCode: '0110-SW·2024-Y-SW-0005',
    archiveTitle: '荣获国家档案局数字档案室高水平样板单位金质奖牌与荣誉证书实体',
    category: '实物档案',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '永久',
    pageCount: 1,
    status: '待审批',
  },
  {
    id: 'ba-p-12',
    borrowNo: 'DAJY-20261101-002',
    applicant: '杨舒涵',
    borrowType: '电子档案',
    dept: '办公室',
    borrowTime: '2026-11-01',
    returnTime: '2026-11-08',
    purpose: '市重点交通枢纽通车试运营纪录片剪辑与校对',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0110-SX·2026-30Y-SX-0002',
    archiveTitle: '市重点交通枢纽轨道交通第十号线通车试运营专题高清纪实音视频',
    category: '声像档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 1,
    status: '待审批',
  },
  {
    id: 'ba-p-13',
    borrowNo: 'DAJY-20261101-003',
    applicant: '钱振华',
    borrowType: '电子档案',
    dept: '财务资产部',
    borrowTime: '2026-11-01',
    returnTime: '2026-11-07',
    purpose: '2025年度市属国企会计凭证抽检清查核实',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0110-CW·2025-30Y-CW-0003',
    archiveTitle: '2025年第四季度市级国有资本经营预算执行财务凭证及银行对账单',
    category: '会计档案',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '30年',
    pageCount: 140,
    status: '待审批',
  },
];

// 13 realistic approval history items (strictly matching Screenshot 2, recent Nov 2026 dates, zero XXX)
const initialHistoryApprovalList: BorrowApprovalItem[] = [
  {
    id: 'ba-h-01',
    borrowNo: 'DAJY-20261105-0108',
    applicant: '李志远',
    borrowType: '实体档案',
    dept: '规划发展部',
    borrowTime: '2026-11-05',
    returnTime: '2026-11-12',
    purpose: '编制高新综合保税区产业扩容详细规划',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0110-WS·2026-Y-BGS-0001',
    archiveTitle: '关于成立成都市就业工作领导小组的通知',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 16,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-05 15:20',
    approveComment: '核验通过，下发纸质原件出库验视调阅放行单。',
  },
  {
    id: 'ba-h-02',
    borrowNo: 'DAJY-20261105-0092',
    applicant: '陈若曦',
    borrowType: '电子档案',
    dept: '科技信息部',
    borrowTime: '2026-11-05',
    returnTime: '2026-11-12',
    purpose: '涉密内网机房容灾备份体系专家评审准备',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0110-WS·2026-Y-BGS-0004',
    archiveTitle: '2026年市属国有企业清产核资与重大风险防范指导意见',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '30年',
    pageCount: 52,
    status: '已驳回',
    approveResult: '不同意(敏感文件)',
    approver: '陈安全 (档案室主管)',
    approveTime: '2026-11-05 14:05',
    approveComment: '该档案含涉密核心财务与重大资产配置信息，暂不对非财务口开放下载权限。',
  },
  {
    id: 'ba-h-03',
    borrowNo: 'DAJY-20261104-0188',
    applicant: '王建国',
    borrowType: '电子档案',
    dept: '财务资产部',
    borrowTime: '2026-11-04',
    returnTime: '2026-11-11',
    purpose: '年度国有资本收益收缴清算核对',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0110-CW·2025-Y-CW-0001',
    archiveTitle: '2025年度市属国有重点企业财务清查决算审计终结清算报告',
    category: '会计档案',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '永久',
    pageCount: 110,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-04 17:15',
    approveComment: '属于财务内部对账法定范畴，下发带动态工号盲水印电子在线浏览权限。',
  },
  {
    id: 'ba-h-04',
    borrowNo: 'DAJY-20261104-0130',
    applicant: '周海涛',
    borrowType: '实体档案',
    dept: '工程管理部',
    borrowTime: '2026-11-04',
    returnTime: '2026-11-08',
    purpose: '锦江绿道工程二期隐蔽工程质量纠纷取证',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0110-JJ·2025-30Y-GC-0002',
    archiveTitle: '高新西区保障性租赁住房一期主体封顶质量检测评定与地勘报告',
    category: '基建档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 65,
    status: '已驳回',
    approveResult: '不同意(敏感文件)',
    approver: '陈安全 (档案室主管)',
    approveTime: '2026-11-04 11:40',
    approveComment: '所涉案卷处于司法复核保全期，需出具法院或市纪检监察机关协助调查公函。',
  },
  {
    id: 'ba-h-05',
    borrowNo: 'DAJY-20261103-0210',
    applicant: '刘晓敏',
    borrowType: '实体档案',
    dept: '办公室',
    borrowTime: '2026-11-03',
    returnTime: '2026-11-07',
    purpose: '民生实事工程满意度测评专项简报编制',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0110-WS·2026-Y-BGS-0005',
    archiveTitle: '关于开展全市老旧小区加装电梯民生实事工程专项考核通报',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '10年',
    pageCount: 18,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-03 16:30',
    approveComment: '政务公开类通报公文，准予查阅原件并复印登记。',
  },
  {
    id: 'ba-h-06',
    borrowNo: 'DAJY-20261103-0145',
    applicant: '郑雪梅',
    borrowType: '电子档案',
    dept: '科技信息部',
    borrowTime: '2026-11-03',
    returnTime: '2026-11-10',
    purpose: '库房智能化双系统温湿度传感器标定参数复核',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0110-SB·2025-10Y-SB-0012',
    archiveTitle: '智慧档案馆库房高密级恒温恒湿双系统与七氟丙烷气体灭火设施巡检移交台账',
    category: '设备档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '10年',
    pageCount: 32,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-03 10:50',
    approveComment: '保障馆库设备安全运行，准予查阅及下载电子技术文档。',
  },
  {
    id: 'ba-h-07',
    borrowNo: 'DAJY-20261103-0099',
    applicant: '赵德成',
    borrowType: '电子档案',
    dept: '审计法务部',
    borrowTime: '2026-11-03',
    returnTime: '2026-11-06',
    purpose: '集团公司年度重大风险防控内控自查',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0110-WS·2026-Y-BGS-0003',
    archiveTitle: '市政府常务会议关于高新技术产业开发区扩区规划若干决议',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 24,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-03 09:30',
    approveComment: '法务合规自查合规利用，准予在线浏览3天。',
  },
  {
    id: 'ba-h-08',
    borrowNo: 'DAJY-20261102-0166',
    applicant: '黄文华',
    borrowType: '实体档案',
    dept: '人力资源部',
    borrowTime: '2026-11-02',
    returnTime: '2026-11-05',
    purpose: '借阅跨部门干部选任未脱密材料',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0110-WS·2025-30Y-FG-0018',
    archiveTitle: '市级产业引导母基金投资决策与合规性审查法律意见书',
    category: '文书档案',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '30年',
    pageCount: 42,
    status: '已驳回',
    approveResult: '不同意(权限受限)',
    approver: '陈安全 (档案室主管)',
    approveTime: '2026-11-02 15:10',
    approveComment: '非申请人分管业务职责范围，且未附人事干部主管部门批件，不予借阅。',
  },
  {
    id: 'ba-h-09',
    borrowNo: 'DAJY-20261102-0112',
    applicant: '孙思敏',
    borrowType: '电子档案',
    dept: '办公室',
    borrowTime: '2026-11-02',
    returnTime: '2026-11-09',
    purpose: '市级重点发展战略成果图文汇编制作',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0110-ZP·2026-30Y-ZP-0001',
    archiveTitle: '2026年中国西部国际博览城重点展会代表团考察座谈高清原版照片集',
    category: '照片档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 88,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-02 11:20',
    approveComment: '用于官方画册编制，已授权带防伪盲水印原版照片包下载。',
  },
  {
    id: 'ba-h-10',
    borrowNo: 'DAJY-20261102-0088',
    applicant: '宋明哲',
    borrowType: '实体档案',
    dept: '工程管理部',
    borrowTime: '2026-11-02',
    returnTime: '2026-11-06',
    purpose: '园区智能制造中试基地规划环评审核',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0110-JJ·2026-30Y-GC-0003',
    archiveTitle: '天府软件园三期智慧云谷工程主体结构竣工验收报告与抗震设防审查意见',
    category: '基建档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 46,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-02 09:15',
    approveComment: '工程复核必要材料，准予实体借阅，出库登记编号 CK-20261102-03。',
  },
  {
    id: 'ba-h-11',
    borrowNo: 'DAJY-20261101-0177',
    applicant: '冯天赐',
    borrowType: '实体档案',
    dept: '科技信息部',
    borrowTime: '2026-11-01',
    returnTime: '2026-11-05',
    purpose: '申报国家级数字标杆档案馆申报材料原件调取',
    remark: '实物陈列',
    ePermission: '---',
    archiveRefCode: '0110-SW·2024-Y-SW-0005',
    archiveTitle: '荣获国家档案局数字档案室高水平样板单位金质奖牌与荣誉证书实体',
    category: '实物档案',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '永久',
    pageCount: 1,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-01 16:40',
    approveComment: '展陈利用，现场清点并签收实物展品移交清单。',
  },
  {
    id: 'ba-h-12',
    borrowNo: 'DAJY-20261101-0120',
    applicant: '徐立峰',
    borrowType: '电子档案',
    dept: '审计法务部',
    borrowTime: '2026-11-01',
    returnTime: '2026-11-08',
    purpose: '涉密核心资产保密清查未获书面授权',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0110-CW·2026-Y-CW-0002',
    archiveTitle: '2026年度市重点产业基础设施投资资金拨付与清算总账',
    category: '会计档案',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 160,
    status: '已驳回',
    approveResult: '不同意(敏感文件)',
    approver: '陈安全 (档案室主管)',
    approveTime: '2026-11-01 14:15',
    approveComment: '特别受控专项涉密财务账册，需报经市国资委与分管市领导共同审批。',
  },
  {
    id: 'ba-h-13',
    borrowNo: 'DAJY-20261101-0078',
    applicant: '杨舒涵',
    borrowType: '电子档案',
    dept: '办公室',
    borrowTime: '2026-11-01',
    returnTime: '2026-11-06',
    purpose: '重点交通工程音视频宣传片剪辑备份',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0110-SX·2026-30Y-SX-0002',
    archiveTitle: '市重点交通枢纽轨道交通第十号线通车试运营专题高清纪实音视频',
    category: '声像档案',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 1,
    status: '已通过',
    approveResult: '同意',
    approver: '郭海波 (利用审批岗)',
    approveTime: '2026-11-01 10:30',
    approveComment: '准予提取高清剪辑片段并加盖不可篡改内嵌数字指纹。',
  },
];

// Borrow Return Item interface strictly matching user's screenshots
export interface BorrowReturnItem {
  id: string;
  borrowNo: string;
  borrower: string;
  borrowType: '实体档案' | '电子档案';
  dept: string;
  borrowTime: string;      // 2026-11-05 etc.
  expectedReturnTime: string; // 2026-11-12 etc.
  actualReturnTime?: string;
  purpose: string;
  remark: string;
  ePermission: '---' | '浏览' | '浏览、下载';
  archiveRefCode: string;
  archiveTitle: string;
  category: string;        // '文书档案' | '会计档案' | '基建档案' | '设备档案' | '照片档案' | '声像档案' | '实物档案'
  year: number;            // 2026, 2025, 2024
  status: '未归还' | '已归还' | '超期';
  fondsNo?: string;
  securityLevel?: '公开' | '内部' | '秘密' | '机密';
  retention?: '10年' | '30年' | '永久';
  pageCount?: number;
  docNo?: string;
  location?: string;
  overdueDays?: number;
  returnInspector?: string;
  returnCondition?: string;
}

// 13 realistic records for 未归还 (strictly matching screenshot: recent Nov 2026 dates, descending order, zero XXX)
const initialNotReturnedList: BorrowReturnItem[] = [
  {
    id: 'br-nr-01',
    borrowNo: 'DAJY-20261105-001',
    borrower: '林晓楠',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-11-05',
    expectedReturnTime: '2026-11-12',
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-26-43-32',
    archiveTitle: '关于印发2026年度科技创新研发专项实施方案的通知',
    category: '文书档案',
    year: 2026,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 18,
    docNo: '盛能发〔2026〕012号',
    location: '1号智能库房-02架-03层',
  },
  {
    id: 'br-nr-02',
    borrowNo: 'DAJY-20261105-002',
    borrower: '陈致远',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-11-05',
    expectedReturnTime: '2026-11-12',
    purpose: '学习',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0001-26-43-33',
    archiveTitle: '1号智能主变电站高压断路器与继电保护定值校核技术规程',
    category: '设备档案',
    year: 2026,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 32,
    docNo: '盛能技〔2026〕008号',
    location: '3号设备库房-01架-02层',
  },
  {
    id: 'br-nr-03',
    borrowNo: 'DAJY-20261104-001',
    borrower: '周泽宇',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-11-04',
    expectedReturnTime: '2026-11-11',
    purpose: '学习',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0001-26-43-34',
    archiveTitle: '研发创新产业园一期主体结构及消防给排水联合验收合格意见书',
    category: '基建档案',
    year: 2026,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '30年',
    pageCount: 46,
    docNo: '建验字〔2026〕019号',
    location: '2号基建库房-04架-01层',
  },
  {
    id: 'br-nr-04',
    borrowNo: 'DAJY-20261104-002',
    borrower: '沈宏伟',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-11-04',
    expectedReturnTime: '2026-11-10',
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-25-43-35',
    archiveTitle: '2025年度所属重点二级企业固定资产盘点清查与账实核对专项清册',
    category: '会计档案',
    year: 2025,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '永久',
    pageCount: 88,
    docNo: '盛能财〔2025〕045号',
    location: '1号特藏库房-01架-04层',
  },
  {
    id: 'br-nr-05',
    borrowNo: 'DAJY-20261104-003',
    borrower: '张嘉怡',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-11-04',
    expectedReturnTime: '2026-11-11',
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-26-43-36',
    archiveTitle: '盛京能源建设集团“十五五”新能源高新产业中长期发展战略规划草案',
    category: '文书档案',
    year: 2026,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 54,
    docNo: '盛能发〔2026〕009号',
    location: '1号智能库房-02架-02层',
  },
  {
    id: 'br-nr-06',
    borrowNo: 'DAJY-20261103-001',
    borrower: '赵文博',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-11-03',
    expectedReturnTime: '2026-11-10',
    purpose: '学习',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0001-26-43-37',
    archiveTitle: '集团机关公文督办与首问责任制精细化业务实施细则',
    category: '文书档案',
    year: 2026,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '10年',
    pageCount: 22,
    docNo: '盛能办〔2026〕017号',
    location: '1号智能库房-03架-01层',
  },
  {
    id: 'br-nr-07',
    borrowNo: 'DAJY-20261103-002',
    borrower: '许雅琴',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-11-03',
    expectedReturnTime: '2026-11-09',
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-25-43-38',
    archiveTitle: '盛京热电厂三期集中供热特许经营协议与法律合规论证评审意见',
    category: '文书档案',
    year: 2025,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '30年',
    pageCount: 64,
    docNo: '法务意〔2025〕028号',
    location: '1号智能库房-04架-02层',
  },
  {
    id: 'br-nr-08',
    borrowNo: 'DAJY-20261102-001',
    borrower: '黄俊杰',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-11-02',
    expectedReturnTime: '2026-11-09',
    purpose: '学习',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0001-25-43-39',
    archiveTitle: '2号燃气轮机发电机组热工自动化DCS系统调试联锁保护试验记录',
    category: '设备档案',
    year: 2025,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 40,
    docNo: '调记录〔2025〕014号',
    location: '3号设备库房-02架-03层',
  },
  {
    id: 'br-nr-09',
    borrowNo: 'DAJY-20261102-002',
    borrower: '孙承志',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-11-02',
    expectedReturnTime: '2026-11-08',
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-26-43-40',
    archiveTitle: '2026年度工程系列高级专业技术职务任职资格评审结果公示及批文',
    category: '文书档案',
    year: 2026,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 28,
    docNo: '盛能人〔2026〕033号',
    location: '1号智能库房-05架-01层',
  },
  {
    id: 'br-nr-10',
    borrowNo: 'DAJY-20261101-001',
    borrower: '刘雨辰',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-11-01',
    expectedReturnTime: '2026-11-08',
    purpose: '学习',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0001-26-43-41',
    archiveTitle: '热电联产扩建工程工业废水零排放深度处理环保设施环评批复书',
    category: '基建档案',
    year: 2026,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '30年',
    pageCount: 36,
    docNo: '环评批〔2026〕005号',
    location: '2号基建库房-01架-03层',
  },
  {
    id: 'br-nr-11',
    borrowNo: 'DAJY-20261101-002',
    borrower: '钱伟民',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-11-01',
    expectedReturnTime: '2026-11-07',
    purpose: '学习',
    remark: '实体案卷一册',
    ePermission: '---',
    archiveRefCode: '0001-25-43-42',
    archiveTitle: '集团关于表彰2025年度先进基层党组织与十佳科技先锋的通报',
    category: '文书档案',
    year: 2025,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '永久',
    pageCount: 14,
    docNo: '盛能党〔2025〕018号',
    location: '1号智能库房-01架-02层',
  },
  {
    id: 'br-nr-12',
    borrowNo: 'DAJY-20261101-003',
    borrower: '陆浩天',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-11-01',
    expectedReturnTime: '2026-11-08',
    purpose: '学习',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0001-26-43-43',
    archiveTitle: '集团调度指挥控制中心核心工业内网等级保护三级测评及整改报告',
    category: '设备档案',
    year: 2026,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '30年',
    pageCount: 58,
    docNo: '等保测〔2026〕003号',
    location: '3号设备库房-03架-01层',
  },
  {
    id: 'br-nr-13',
    borrowNo: 'DAJY-20261101-004',
    borrower: '冯雪晴',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-11-01',
    expectedReturnTime: '2026-11-06',
    purpose: '学习',
    remark: '附结构施工图',
    ePermission: '---',
    archiveRefCode: '0001-24-43-44',
    archiveTitle: '综合地下热能管廊深基坑开挖与支护结构抗变形变形监测技术总结',
    category: '基建档案',
    year: 2024,
    status: '未归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 72,
    docNo: '管廊监〔2024〕011号',
    location: '2号基建库房-03架-02层',
  },
];

// 12 realistic records for 已归还 (recent Nov 2026 dates, descending order, zero XXX)
const initialReturnedList: BorrowReturnItem[] = [
  {
    id: 'br-rd-01',
    borrowNo: 'DAJY-20261105-081',
    borrower: '李博文',
    borrowType: '实体档案',
    dept: '规划发展部',
    borrowTime: '2026-11-04',
    expectedReturnTime: '2026-11-05',
    actualReturnTime: '2026-11-05 16:10',
    purpose: '城市绿道景观带生态环保选线图纸审阅',
    remark: '验视无损入库',
    ePermission: '---',
    archiveRefCode: '0001-26-43-18',
    archiveTitle: '关于成都市天府绿道沿线绿色生态景观规划红线图集',
    category: '基建档案',
    year: 2026,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 26,
    returnInspector: '苏晓文 (利用管理岗)',
    returnCondition: '完好无损，无破损涂画缺页',
    location: '2号基建库房-02架-01层',
  },
  {
    id: 'br-rd-02',
    borrowNo: 'DAJY-20261104-067',
    borrower: '宋敏',
    borrowType: '电子档案',
    dept: '财务资产部',
    borrowTime: '2026-11-03',
    expectedReturnTime: '2026-11-05',
    actualReturnTime: '2026-11-05 14:30',
    purpose: '月度专项审计报表对比分析',
    remark: '权限正常收回',
    ePermission: '浏览、下载',
    archiveRefCode: '0001-25-43-12',
    archiveTitle: '2025年度市属骨干企业会计决算报告及注册会计师专项审计意见书',
    category: '会计档案',
    year: 2025,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 94,
    returnInspector: '系统自动脱密注销',
    returnCondition: '电子查阅权限已安全闭环回收',
    location: '1号特藏库房-01架-02层',
  },
  {
    id: 'br-rd-03',
    borrowNo: 'DAJY-20261104-055',
    borrower: '蒋振华',
    borrowType: '实体档案',
    dept: '生产运营部',
    borrowTime: '2026-11-02',
    expectedReturnTime: '2026-11-04',
    actualReturnTime: '2026-11-04 17:00',
    purpose: '高压输变电设备预防性试验方案论证',
    remark: '原件完好归架',
    ePermission: '---',
    archiveRefCode: '0001-26-43-15',
    archiveTitle: '关于印发2026年电网安全运行与电力迎峰度冬应急处置保障预案的通知',
    category: '文书档案',
    year: 2026,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '30年',
    pageCount: 38,
    returnInspector: '苏晓文 (利用管理岗)',
    returnCondition: '完好无损，封条与附图齐备',
    location: '1号智能库房-03架-02层',
  },
  {
    id: 'br-rd-04',
    borrowNo: 'DAJY-20261103-042',
    borrower: '韩雪',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-11-02',
    expectedReturnTime: '2026-11-04',
    actualReturnTime: '2026-11-04 11:20',
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-25-43-20',
    archiveTitle: '大型燃煤锅炉超低排放协同脱硫脱硝技术攻关试验研究报告',
    category: '设备档案',
    year: 2025,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 60,
    returnInspector: '杜晓峰 (馆藏保管员)',
    returnCondition: '完好无损，无破损涂画缺页',
    location: '3号设备库房-02架-01层',
  },
  {
    id: 'br-rd-05',
    borrowNo: 'DAJY-20261103-031',
    borrower: '董建国',
    borrowType: '电子档案',
    dept: '办公室',
    borrowTime: '2026-11-01',
    expectedReturnTime: '2026-11-03',
    actualReturnTime: '2026-11-03 16:45',
    purpose: '市企联合主题党日高清活动照片调阅',
    remark: '数字水印正常',
    ePermission: '浏览',
    archiveRefCode: '0001-26-43-22',
    archiveTitle: '2026年“七一”优秀党员表彰大会暨红歌汇演现场高清原图全套',
    category: '照片档案',
    year: 2026,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '永久',
    pageCount: 80,
    returnInspector: '系统自动脱密注销',
    returnCondition: '电子查阅到期正常脱密收回',
    location: '数字媒体资源池-01区',
  },
  {
    id: 'br-rd-06',
    borrowNo: 'DAJY-20261102-029',
    borrower: '卢志刚',
    borrowType: '实体档案',
    dept: '安全质量部',
    borrowTime: '2026-11-01',
    expectedReturnTime: '2026-11-03',
    actualReturnTime: '2026-11-03 15:00',
    purpose: '安全生产责任书签署历史档案查核',
    remark: '已当面核验入库',
    ePermission: '---',
    archiveRefCode: '0001-26-43-25',
    archiveTitle: '2026年度集团各生产单位安全生产与消防安全目标责任书汇编',
    category: '文书档案',
    year: 2026,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '30年',
    pageCount: 42,
    returnInspector: '苏晓文 (利用管理岗)',
    returnCondition: '完好无损，无破损涂画缺页',
    location: '1号智能库房-04架-03层',
  },
  {
    id: 'br-rd-07',
    borrowNo: 'DAJY-20261102-018',
    borrower: '彭程',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-11-01',
    expectedReturnTime: '2026-11-02',
    actualReturnTime: '2026-11-02 18:00',
    purpose: '学习',
    remark: '---',
    ePermission: '浏览、下载',
    archiveRefCode: '0001-26-43-28',
    archiveTitle: '成都市分布式综合能源示范微电网多能互补优化控制系统技术方案',
    category: '设备档案',
    year: 2026,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 52,
    returnInspector: '系统自动脱密注销',
    returnCondition: '电子查阅权限已安全闭环回收',
    location: '3号设备库房-01架-04层',
  },
  {
    id: 'br-rd-08',
    borrowNo: 'DAJY-20261101-015',
    borrower: '朱慧芳',
    borrowType: '实体档案',
    dept: '纪检审计部',
    borrowTime: '2026-10-31',
    expectedReturnTime: '2026-11-02',
    actualReturnTime: '2026-11-02 11:30',
    purpose: '招投标合规性专项调卷复查',
    remark: '案卷查验封存',
    ePermission: '---',
    archiveRefCode: '0001-25-43-08',
    archiveTitle: '2025年度第二批大宗设备物资集中采购招标文件及开标评标记录总汇',
    category: '会计档案',
    year: 2025,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 120,
    returnInspector: '杜晓峰 (馆藏保管员)',
    returnCondition: '完好无损，无破损涂画缺页',
    location: '1号特藏库房-02架-03层',
  },
  {
    id: 'br-rd-09',
    borrowNo: 'DAJY-20261101-011',
    borrower: '任浩宇',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-10-31',
    expectedReturnTime: '2026-11-01',
    actualReturnTime: '2026-11-01 17:15',
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-24-43-16',
    archiveTitle: '盛京新能源总部大厦弱电智能化系统集成施工深化设计图纸',
    category: '基建档案',
    year: 2024,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 68,
    returnInspector: '苏晓文 (利用管理岗)',
    returnCondition: '完好无损，图纸无折角破损',
    location: '2号基建库房-03架-01层',
  },
  {
    id: 'br-rd-10',
    borrowNo: 'DAJY-20261031-008',
    borrower: '曹立新',
    borrowType: '电子档案',
    dept: '办公室',
    borrowTime: '2026-10-30',
    expectedReturnTime: '2026-11-01',
    actualReturnTime: '2026-11-01 15:00',
    purpose: '省属国企高质量发展成果纪录片片花剪辑',
    remark: '高清音视频借阅',
    ePermission: '浏览、下载',
    archiveRefCode: '0001-26-43-19',
    archiveTitle: '2026年清洁能源装机突破500万千瓦暨新项目集中开工纪实音视频',
    category: '声像档案',
    year: 2026,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '永久',
    pageCount: 1,
    returnInspector: '系统自动脱密注销',
    returnCondition: '电子查阅到期正常脱密收回',
    location: '声像档案专用存储阵列-B卷',
  },
  {
    id: 'br-rd-11',
    borrowNo: 'DAJY-20261030-004',
    borrower: '韦婷婷',
    borrowType: '实体档案',
    dept: '工会办公室',
    borrowTime: '2026-10-29',
    expectedReturnTime: '2026-11-01',
    actualReturnTime: '2026-11-01 11:00',
    purpose: '全国劳模先进事迹展陈布置',
    remark: '奖章实体借出',
    ePermission: '---',
    archiveRefCode: '0001-25-43-30',
    archiveTitle: '全国五一劳动奖章及国务院政府特殊津贴专家荣誉奖杯实物',
    category: '实物档案',
    year: 2025,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '公开',
    retention: '永久',
    pageCount: 1,
    returnInspector: '苏晓文 (利用管理岗)',
    returnCondition: '实物奖章与木质锦盒完好无损',
    location: '实物特藏展柜-A02号',
  },
  {
    id: 'br-rd-12',
    borrowNo: 'DAJY-20261030-001',
    borrower: '廖志强',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-10-29',
    expectedReturnTime: '2026-10-31',
    actualReturnTime: '2026-10-31 17:30',
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-25-43-14',
    archiveTitle: '关于实施集团数字化转型与智慧档案大数据中台建设的指导意见',
    category: '文书档案',
    year: 2025,
    status: '已归还',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 34,
    returnInspector: '杜晓峰 (馆藏保管员)',
    returnCondition: '完好无损，无破损涂画缺页',
    location: '1号智能库房-02架-04层',
  },
];

// 10 realistic records for 超期 (recent Nov 2026 dates, overdue by 1~4 days relative to 2026-11-05, zero XXX)
const initialOverdueList: BorrowReturnItem[] = [
  {
    id: 'br-od-01',
    borrowNo: 'DAJY-20261028-001',
    borrower: '谭德明',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-10-28',
    expectedReturnTime: '2026-11-01',
    overdueDays: 4,
    purpose: '学习',
    remark: '已发催告函',
    ePermission: '---',
    archiveRefCode: '0001-25-43-45',
    archiveTitle: '关于下达2025年度火电机组灵活性改造重点研发专项攻坚任务的通知',
    category: '文书档案',
    year: 2025,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '30年',
    pageCount: 22,
    location: '1号智能库房-03架-04层',
  },
  {
    id: 'br-od-02',
    borrowNo: 'DAJY-20261029-002',
    borrower: '何建平',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-10-29',
    expectedReturnTime: '2026-11-02',
    overdueDays: 3,
    purpose: '学习',
    remark: '系统限权警示',
    ePermission: '浏览、下载',
    archiveRefCode: '0001-26-43-46',
    archiveTitle: '电化学储能电站并网调试及BMS电池管理系统关键安全参数表',
    category: '设备档案',
    year: 2026,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 44,
    location: '3号设备库房-02架-04层',
  },
  {
    id: 'br-od-03',
    borrowNo: 'DAJY-20261029-003',
    borrower: '莫小云',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-10-29',
    expectedReturnTime: '2026-11-02',
    overdueDays: 3,
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-25-43-47',
    archiveTitle: '集团关于下达2025年度节能降碳技改补贴专项资金支付凭证及清册',
    category: '会计档案',
    year: 2025,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '永久',
    pageCount: 76,
    location: '1号特藏库房-01架-03层',
  },
  {
    id: 'br-od-04',
    borrowNo: 'DAJY-20261030-001',
    borrower: '薛宇翔',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-10-30',
    expectedReturnTime: '2026-11-03',
    overdueDays: 2,
    purpose: '学习',
    remark: '短信催还已发送',
    ePermission: '浏览',
    archiveRefCode: '0001-26-43-48',
    archiveTitle: '成都市龙泉驿区氢能重卡示范运营加氢母站建设规划审查意见书',
    category: '基建档案',
    year: 2026,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 34,
    location: '2号基建库房-02架-03层',
  },
  {
    id: 'br-od-05',
    borrowNo: 'DAJY-20261030-002',
    borrower: '丁文华',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-10-30',
    expectedReturnTime: '2026-11-03',
    overdueDays: 2,
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-24-43-49',
    archiveTitle: '2024年度市重点外资合资清洁能源合作项目签约意向书及谈判备忘录',
    category: '文书档案',
    year: 2024,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 50,
    location: '1号智能库房-05架-03层',
  },
  {
    id: 'br-od-06',
    borrowNo: 'DAJY-20261031-001',
    borrower: '陶思齐',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-10-31',
    expectedReturnTime: '2026-11-04',
    overdueDays: 1,
    purpose: '学习',
    remark: '已通知处室联络员',
    ePermission: '浏览、下载',
    archiveRefCode: '0001-26-43-50',
    archiveTitle: '关于全面推行安全生产风险隐患“双重预防机制”数字化建设方案',
    category: '文书档案',
    year: 2026,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '10年',
    pageCount: 28,
    location: '1号智能库房-03架-03层',
  },
  {
    id: 'br-od-07',
    borrowNo: 'DAJY-20261031-002',
    borrower: '柴东升',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-10-31',
    expectedReturnTime: '2026-11-04',
    overdueDays: 1,
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-25-43-51',
    archiveTitle: '330kV超高压气体绝缘全封闭组合电器（GIS）出厂高压绝缘试验报告',
    category: '设备档案',
    year: 2025,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '30年',
    pageCount: 42,
    location: '3号设备库房-01架-03层',
  },
  {
    id: 'br-od-08',
    borrowNo: 'DAJY-20261031-003',
    borrower: '常佳慧',
    borrowType: '电子档案',
    dept: '技术部',
    borrowTime: '2026-10-31',
    expectedReturnTime: '2026-11-04',
    overdueDays: 1,
    purpose: '学习',
    remark: '---',
    ePermission: '浏览',
    archiveRefCode: '0001-25-43-52',
    archiveTitle: '集团2025年度重点科技成果申报国家科技进步奖全套申报书与附件',
    category: '文书档案',
    year: 2025,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '秘密',
    retention: '永久',
    pageCount: 112,
    location: '1号智能库房-02架-01层',
  },
  {
    id: 'br-od-09',
    borrowNo: 'DAJY-20261030-004',
    borrower: '严晓刚',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-10-30',
    expectedReturnTime: '2026-11-03',
    overdueDays: 2,
    purpose: '学习',
    remark: '出差申请延期',
    ePermission: '---',
    archiveRefCode: '0001-26-43-53',
    archiveTitle: '智慧园区低碳楼宇综合能源管理系统施工质量监督与过程验收台账',
    category: '基建档案',
    year: 2026,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '内部',
    retention: '30年',
    pageCount: 56,
    location: '2号基建库房-04架-02层',
  },
  {
    id: 'br-od-10',
    borrowNo: 'DAJY-20261029-005',
    borrower: '白雪莲',
    borrowType: '实体档案',
    dept: '技术部',
    borrowTime: '2026-10-29',
    expectedReturnTime: '2026-11-02',
    overdueDays: 3,
    purpose: '学习',
    remark: '---',
    ePermission: '---',
    archiveRefCode: '0001-26-43-54',
    archiveTitle: '关于成都市产业转型升级投资基金管理暂行办法及合伙人协议汇编',
    category: '文书档案',
    year: 2026,
    status: '超期',
    fondsNo: '0110',
    securityLevel: '机密',
    retention: '永久',
    pageCount: 66,
    location: '1号智能库房-04架-01层',
  },
];

// Realistic initial archives dataset across 7 categories (recent years 2024-2026, recent dates <= Nov 5, 2026)
const initialCatalogBorrowList: ArchiveCatalogBorrowItem[] = [
  // 1. 文书档案 - 2026
  {
    id: 'cb-001',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0001',
    title: '关于成立成都市就业工作领导小组的通知',
    securityLevel: '机密',
    retention: '永久',
    docNo: '省办公厅〔2026〕001号',
    category: '文书档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 16,
    archivedDate: '2026-11-05',
  },
  {
    id: 'cb-002',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0002',
    title: '成都市进一步优化营商环境激发市场主体活力实施方案',
    securityLevel: '秘密',
    retention: '30年',
    docNo: '成府发〔2026〕012号',
    category: '文书档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 38,
    archivedDate: '2026-11-05',
  },
  {
    id: 'cb-003',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0003',
    title: '市政府常务会议关于高新技术产业开发区扩区规划若干决议',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成府纪〔2026〕045号',
    category: '文书档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 24,
    archivedDate: '2026-11-04',
  },
  {
    id: 'cb-004',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0004',
    title: '2026年市属国有企业清产核资与重大风险防范指导意见',
    securityLevel: '秘密',
    retention: '30年',
    docNo: '成国资规〔2026〕008号',
    category: '文书档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 52,
    archivedDate: '2026-11-04',
  },
  {
    id: 'cb-005',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0005',
    title: '关于开展全市老旧小区加装电梯民生实事工程专项考核通报',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成住建发〔2026〕033号',
    category: '文书档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 18,
    archivedDate: '2026-11-03',
  },

  // 文书档案 - 2025
  {
    id: 'cb-006',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0006',
    title: '成都市数字政务基础设施与公共数据资源分类分级共享目录',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成大数据发〔2025〕019号',
    category: '文书档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 64,
    archivedDate: '2026-11-03',
  },
  {
    id: 'cb-007',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0007',
    title: '市委统筹推进高质量发展与生态文明建设五年规划专题工作纪要',
    securityLevel: '秘密',
    retention: '永久',
    docNo: '成委发〔2025〕028号',
    category: '文书档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 30,
    archivedDate: '2026-11-02',
  },
  {
    id: 'cb-008',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0008',
    title: '关于印发成都市智慧交通体系二期工程投资建设任务分工通知',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成交运函〔2025〕115号',
    category: '文书档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 42,
    archivedDate: '2026-11-02',
  },
  {
    id: 'cb-009',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0009',
    title: '市市场监督管理局关于深化反不正当竞争公平审查机制规定',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成市监发〔2025〕054号',
    category: '文书档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 22,
    archivedDate: '2026-11-01',
  },

  // 文书档案 - 2024
  {
    id: 'cb-010',
    status: '档案库',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0010',
    title: '关于实施新一轮西部陆海新通道协同联动发展规划总体方案',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成发改通〔2024〕082号',
    category: '文书档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 56,
    archivedDate: '2026-11-01',
  },
  {
    id: 'cb-011',
    status: '档案库',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0011',
    title: '成都市建设国际消费中心城市若干重大扶持政策措施',
    securityLevel: '公开',
    retention: '30年',
    docNo: '成商务函〔2024〕049号',
    category: '文书档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 35,
    archivedDate: '2026-11-01',
  },

  // 2. 会计档案 - 2026 & 2025
  {
    id: 'cb-012',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-CW·2026-Y-CW-0001',
    title: '2026年市级财政统筹专项资金绩效评价自评报告汇总明细表',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成财预决〔2026〕015号',
    category: '会计档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 92,
    archivedDate: '2026-11-05',
  },
  {
    id: 'cb-013',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-CW·2026-Y-CW-0002',
    title: '2026年度局机关及直属事业单位干部职工公积金统筹汇缴总台账',
    securityLevel: '公开',
    retention: '30年',
    docNo: '成金管审〔2026〕022号',
    category: '会计档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 68,
    archivedDate: '2026-11-04',
  },
  {
    id: 'cb-014',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-CW·2026-Y-CW-0003',
    title: '市智慧城市云平台三期工程建设进度款资金划拨与税务凭证',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成审结字〔2026〕041号',
    category: '会计档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 45,
    archivedDate: '2026-11-03',
  },
  {
    id: 'cb-015',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-CW·2025-Y-CW-0001',
    title: '2025年度市属国有重点企业财务清查决算审计终结清算报告',
    securityLevel: '秘密',
    retention: '永久',
    docNo: '成国资审〔2025〕088号',
    category: '会计档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 110,
    archivedDate: '2026-11-02',
  },
  {
    id: 'cb-016',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-CW·2025-Y-CW-0002',
    title: '市医疗保障事业统筹基金年度收支清算与财政拨付记账凭证卷',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成医保清〔2025〕034号',
    category: '会计档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 85,
    archivedDate: '2026-11-01',
  },

  // 3. 基建档案 - 2026 & 2025
  {
    id: 'cb-017',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-JJ·2026-Y-JS-0001',
    title: '天府新区城市中轴线地下综合管廊二期工程竣工规划测量报告',
    securityLevel: '内部',
    retention: '永久',
    docNo: '成规建竣〔2026〕009号',
    category: '基建档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 140,
    archivedDate: '2026-11-05',
  },
  {
    id: 'cb-018',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-JJ·2026-Y-JS-0002',
    title: '成都市第三人民医院新院区医疗综合大楼建筑结构抗震施工图纸',
    securityLevel: '机密',
    retention: '永久',
    docNo: '成住建图〔2026〕031号',
    category: '基建档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 260,
    archivedDate: '2026-11-04',
  },
  {
    id: 'cb-019',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-JJ·2025-Y-JS-0003',
    title: '锦江绿道二期工程绿化景观提升与水系综合治理工程验收结案卷',
    securityLevel: '公开',
    retention: '30年',
    docNo: '成水务验〔2025〕067号',
    category: '基建档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 120,
    archivedDate: '2026-11-02',
  },
  {
    id: 'cb-020',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-JJ·2025-Y-JS-0004',
    title: '市东部新区智能低碳产业园标准化厂房建设工程规划许可证正本',
    securityLevel: '内部',
    retention: '永久',
    docNo: '成规许字〔2025〕103号',
    category: '基建档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 48,
    archivedDate: '2026-11-01',
  },

  // 4. 设备档案 - 2026 & 2025
  {
    id: 'cb-021',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-SB·2026-Y-SB-0001',
    title: '档案馆智能恒温恒湿密闭密集架及物联网温湿度传感器检定证书',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成质检设〔2026〕006号',
    category: '设备档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 32,
    archivedDate: '2026-11-05',
  },
  {
    id: 'cb-022',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-SB·2026-Y-SB-0002',
    title: '市政务核心数据中心容灾备份高密刀片服务器设备运行维护手册',
    securityLevel: '秘密',
    retention: '10年',
    docNo: '成数保台〔2026〕014号',
    category: '设备档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 78,
    archivedDate: '2026-11-03',
  },
  {
    id: 'cb-023',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-SB·2025-Y-SB-0003',
    title: '城市供水管网智能加压泵站成套自动化变频控制机组出厂合格证',
    securityLevel: '公开',
    retention: '30年',
    docNo: '成水设检〔2025〕044号',
    category: '设备档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 54,
    archivedDate: '2026-11-01',
  },

  // 5. 照片档案 - 2026 & 2025
  {
    id: 'cb-024',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-ZP·2026-Y-XW-0001',
    title: '2026年市重大产业项目招商引资集中签约仪式全景高清影像合集',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成宣影字〔2026〕018号',
    category: '照片档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 180,
    archivedDate: '2026-11-05',
  },
  {
    id: 'cb-025',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-ZP·2026-Y-XW-0002',
    title: '第十五届国际低碳环保创新论坛成都会场重要中外嘉宾合影底片',
    securityLevel: '公开',
    retention: '30年',
    docNo: '成外事影〔2026〕009号',
    category: '照片档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 65,
    archivedDate: '2026-11-04',
  },
  {
    id: 'cb-026',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-ZP·2025-Y-XW-0003',
    title: '成都大运会场馆综合利用及市民体育嘉年华开幕式盛况纪实相册',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成体影存〔2025〕052号',
    category: '照片档案',
    level: '案卷',
    carrierFormat: '实体、电子',
    pageCount: 210,
    archivedDate: '2026-11-02',
  },

  // 6. 声像档案 - 2026 & 2025
  {
    id: 'cb-027',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-SX·2026-Y-YJ-0001',
    title: '市防汛抗旱应急指挥部2026年超强暴雨洪涝调度决策现场音视频',
    securityLevel: '内部',
    retention: '永久',
    docNo: '成应急视〔2026〕004号',
    category: '声像档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 1,
    archivedDate: '2026-11-05',
  },
  {
    id: 'cb-028',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-SX·2026-Y-GH-0002',
    title: '成都市庆祝建党105周年重点劳模工匠事迹访谈全纪录高保真录音',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成总工音〔2026〕011号',
    category: '声像档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 1,
    archivedDate: '2026-11-03',
  },
  {
    id: 'cb-029',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-SX·2025-Y-XC-0003',
    title: '“蓉城非遗”蜀绣古法织造手工艺国家级非遗传承人口述史原声带',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成文旅音〔2025〕037号',
    category: '声像档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 1,
    archivedDate: '2026-11-01',
  },

  // 7. 实物档案 - 2026 & 2025
  {
    id: 'cb-030',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-SW·2026-Y-SW-0001',
    title: '荣获国务院推进数字政府治理百强标杆城市金色奖牌与特许印章',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成荣誉物〔2026〕002号',
    category: '实物档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 1,
    archivedDate: '2026-11-05',
  },
  {
    id: 'cb-031',
    status: '档案库',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-SW·2026-Y-SW-0002',
    title: '市直机关工委表彰先进基层党组织锦旗与首批红色示范标兵印鉴',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成直工物〔2026〕005号',
    category: '实物档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 1,
    archivedDate: '2026-11-04',
  },
  {
    id: 'cb-032',
    status: '档案库',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-SW·2025-Y-SW-0003',
    title: '中法生态示范园产业合作纪念水晶封印与中法建交60周年特制封泥',
    securityLevel: '内部',
    retention: '永久',
    docNo: '成外事物〔2025〕018号',
    category: '实物档案',
    level: '文件',
    carrierFormat: '实体、电子',
    pageCount: 1,
    archivedDate: '2026-11-02',
  },
];

export const ArchiveBorrowView: React.FC<ArchiveBorrowViewProps> = ({
  submodule = 'borrow_records',
  onNavigate,
  onSelectRecord,
  onShowMessage,
}) => {
  // Current active sub-tab (controlled either via prop or local clicks)
  const [activeTab, setActiveTab] = useState<'borrow_records' | 'borrow_approve' | 'borrow_return' | 'borrow_stats'>(submodule);

  useEffect(() => {
    setActiveTab(submodule);
  }, [submodule]);

  // Master borrow data list for return/approval
  const [dataList, setDataList] = useState<ArchiveBorrowRecord[]>(mockArchiveBorrows);

  // ==========================================
  // 1. 借阅档案 (Borrow Catalog & Tree) State
  // ==========================================
  const [catalogList, setCatalogList] = useState<ArchiveCatalogBorrowItem[]>(initialCatalogBorrowList);
  const [searchTitle, setSearchTitle] = useState('');
  const [catalogPage, setCatalogPage] = useState(1);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // Directory Tree State
  const [expandedNodes, setExpandedNodes] = useState<{ [key: string]: boolean }>({
    root: true,
    '文书档案': true,
    '会计档案': true,
    '基建档案': false,
    '设备档案': false,
    '照片档案': false,
    '声像档案': false,
    '实物档案': false,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  // Modal 1: 申请借阅 (Apply for Borrowing) Modal State
  const [isApplyBorrowModalOpen, setIsApplyBorrowModalOpen] = useState(false);
  const [borrowTargetItems, setBorrowTargetItems] = useState<ArchiveCatalogBorrowItem[]>([]);

  // Form in 申请借阅 Modal
  const [applyBorrowForm, setApplyBorrowForm] = useState<{
    borrowNo: string;
    borrower: string;
    dept: string;
    borrowType: '实体档案' | '电子档案';
    borrowTime: string;
    returnTime: string;
    purpose: string;
    remark: string;
  }>({
    borrowNo: 'DAJY-20261105-001',
    borrower: '',
    dept: '',
    borrowType: '实体档案',
    borrowTime: '',
    returnTime: '',
    purpose: '',
    remark: '',
  });

  // Modal 2: 高级检索 Modal
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [advancedSearchParams, setAdvancedSearchParams] = useState({
    title: '',
    refCode: '',
    docNo: '',
    fondsNo: '',
    startYear: '',
    endYear: '',
    securityLevel: '全部',
    retention: '全部',
  });

  // ==========================================
  // 2. 借阅审批 (Borrow Approval) State & Data
  // ==========================================
  const [approveSubTab, setApproveSubTab] = useState<'pending' | 'history'>('pending');
  const [approveSearch, setApproveSearch] = useState('');
  const [approvePage, setApprovePage] = useState(1);

  // Realistic datasets strictly matching screenshots (recent Nov 2026 dates, zero XXX)
  const [pendingApprovalList, setPendingApprovalList] = useState<BorrowApprovalItem[]>(initialPendingApprovalList);
  const [historyApprovalList, setHistoryApprovalList] = useState<BorrowApprovalItem[]>(initialHistoryApprovalList);

  // Row selection in 待审批
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);

  // Function Modals for: 同意 / 不同意 / 查看档案详情
  const [isApproveAgreeModalOpen, setIsApproveAgreeModalOpen] = useState(false);
  const [isApproveRejectModalOpen, setIsApproveRejectModalOpen] = useState(false);
  const [detailApprovalRecord, setDetailApprovalRecord] = useState<BorrowApprovalItem | null>(null);

  // Agree modal form fields
  const [agreeEPermission, setAgreeEPermission] = useState<'浏览' | '浏览、下载' | '---'>('浏览、下载');
  const [agreeWatermark, setAgreeWatermark] = useState('动态防伪盲水印（附借阅人工号+查阅时间戳）');
  const [agreeComment, setAgreeComment] = useState('经核验，申请人借阅目的正当合规，符合保密与利用规定，准予借阅利用。');

  // Reject modal form fields
  const [rejectReason, setRejectReason] = useState<string>('不同意(敏感文件)');
  const [rejectComment, setRejectComment] = useState('拟查阅档案属于受限重点管控档案，申请部门非业务归口部门，暂不予批准借阅。');

  // ==========================================
  // 3. 归还管理 (Return Management) State strictly matching screenshots
  // ==========================================
  const [returnSubTab, setReturnSubTab] = useState<'not_returned' | 'returned' | 'overdue'>('not_returned');
  const [returnBorrowerSearch, setReturnBorrowerSearch] = useState('');
  const [returnPage, setReturnPage] = useState(1);

  // Return Tree State ("点击左侧，右侧数据也跟着变，右侧的年份不要太早")
  const [returnSelectedCategory, setReturnSelectedCategory] = useState<string | null>(null);
  const [returnSelectedYear, setReturnSelectedYear] = useState<number | null>(null);
  const [returnExpandedNodes, setReturnExpandedNodes] = useState<Record<string, boolean>>({
    '文书档案': true,
    '会计档案': false,
    '基建档案': false,
    '设备档案': false,
    '照片档案': false,
    '声像档案': false,
    '实物档案': false,
  });

  const toggleReturnNode = (nodeKey: string) => {
    setReturnExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  // Datasets for 归还管理
  const [notReturnedList, setNotReturnedList] = useState<BorrowReturnItem[]>(initialNotReturnedList);
  const [returnedList, setReturnedList] = useState<BorrowReturnItem[]>(initialReturnedList);
  const [overdueList, setOverdueList] = useState<BorrowReturnItem[]>(initialOverdueList);

  // Row selection in 未归还 / 超期 / 已归还
  const [selectedReturnIds, setSelectedReturnIds] = useState<string[]>([]);

  // Function Modals for: 归还 / 续借 / 查看档案详情
  const [isReturnProcessModalOpen, setIsReturnProcessModalOpen] = useState(false);
  const [returnTargetItem, setReturnTargetItem] = useState<BorrowReturnItem | null>(null);
  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false);
  const [renewTargetItem, setRenewTargetItem] = useState<BorrowReturnItem | null>(null);
  const [detailReturnRecord, setDetailReturnRecord] = useState<BorrowReturnItem | null>(null);

  // Return Process Modal Fields
  const [returnInspector, setReturnInspector] = useState('苏晓文 (利用管理岗)');
  const [returnIntegrity, setReturnIntegrity] = useState('完好无损，无破损涂画缺页');
  const [returnStorageLocation, setReturnStorageLocation] = useState('1号智能库房-03排-02架-04层');
  const [returnRemark, setReturnRemark] = useState('经现场双人核验，卷内文件顺序及附件完整无损，已重新贴签入库归位。');

  // Renew Modal Fields
  const [renewExtendDays, setRenewExtendDays] = useState(7);
  const [renewNewDate, setRenewNewDate] = useState('2026-11-19');
  const [renewReason, setRenewReason] = useState('重点专项调研报告编制尚未结题，需继续对照原始底稿核验相关数据');
  const [renewApprover, setRenewApprover] = useState('苏晓文 (综合档案室负责人)');

  // ==========================================
  // 4. 借阅统计 (Borrow Stats) State
  // ==========================================
  const [statsPeriod, setStatsPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const PAGE_SIZE = 10;

  // Toggle tree node expansion
  const toggleNode = (nodeKey: string) => {
    setExpandedNodes((prev) => ({ ...prev, [nodeKey]: !prev[nodeKey] }));
  };

  // Tree nodes definition
  const treeNodes = [
    { name: '文书档案', years: [2026, 2025, 2024] },
    { name: '会计档案', years: [2026, 2025] },
    { name: '基建档案', years: [2026, 2025] },
    { name: '设备档案', years: [2026, 2025] },
    { name: '照片档案', years: [2026, 2025] },
    { name: '声像档案', years: [2026, 2025] },
    { name: '实物档案', years: [2026, 2025] },
  ];

  // ----------------------------------------------------
  // Dynamic Filtering for 借阅档案 based on Tree & Search
  // ----------------------------------------------------
  const filteredCatalogData = catalogList
    .filter((item) => {
      if (selectedCategory && item.category !== selectedCategory) return false;
      if (selectedYear && item.year !== selectedYear) return false;

      if (searchTitle.trim()) {
        const query = searchTitle.trim().toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesRefCode = item.refCode.toLowerCase().includes(query);
        const matchesDocNo = item.docNo.toLowerCase().includes(query);
        if (!matchesTitle && !matchesRefCode && !matchesDocNo) return false;
      }

      if (advancedSearchParams.title && !item.title.includes(advancedSearchParams.title)) return false;
      if (advancedSearchParams.refCode && !item.refCode.includes(advancedSearchParams.refCode)) return false;
      if (advancedSearchParams.docNo && !item.docNo.includes(advancedSearchParams.docNo)) return false;
      if (advancedSearchParams.fondsNo && item.fondsNo !== advancedSearchParams.fondsNo) return false;
      if (advancedSearchParams.securityLevel !== '全部' && item.securityLevel !== advancedSearchParams.securityLevel) return false;
      if (advancedSearchParams.retention !== '全部' && item.retention !== advancedSearchParams.retention) return false;

      return true;
    })
    .sort((a, b) => b.archivedDate.localeCompare(a.archivedDate) || b.year - a.year);

  const paginatedCatalogData = filteredCatalogData.slice(
    (catalogPage - 1) * PAGE_SIZE,
    catalogPage * PAGE_SIZE
  );

  // Checkbox handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = paginatedCatalogData.map((item) => item.id);
      setSelectedItemIds(Array.from(new Set([...selectedItemIds, ...allIds])));
    } else {
      const pageIds = paginatedCatalogData.map((item) => item.id);
      setSelectedItemIds(selectedItemIds.filter((id) => !pageIds.includes(id)));
    }
  };

  const handleToggleRowSelect = (id: string) => {
    if (selectedItemIds.includes(id)) {
      setSelectedItemIds(selectedItemIds.filter((item) => item !== id));
    } else {
      setSelectedItemIds([...selectedItemIds, id]);
    }
  };

  // Open Borrow Modal:
  // "点击【申请借阅】的按钮时 ，里面的数据帮我清空"
  // "表格里的数据帮我重新生成，不要有xxx的内容，帮我改成真实的"
  // "有涉及时间的，时间帮我改成近期的"
  const handleOpenBorrowModal = (singleItem?: ArchiveCatalogBorrowItem) => {
    let itemsToBorrow: ArchiveCatalogBorrowItem[] = [];

    if (singleItem) {
      itemsToBorrow = [singleItem];
    } else if (selectedItemIds.length > 0) {
      itemsToBorrow = catalogList.filter((item) => selectedItemIds.includes(item.id));
    } else {
      // Default items matching the screenshot structure: Row 1 Document archive (2026), Row 2 Accounting archive (2025)
      itemsToBorrow = [
        {
          id: 'cb-001',
          status: '档案库',
          fondsNo: '0110',
          year: 2026,
          refCode: '0110-WS·2026-Y-BGS-0001',
          title: '关于成立成都市就业工作领导小组的通知',
          securityLevel: '机密',
          retention: '永久',
          docNo: '省办公厅〔2026〕001号',
          category: '文书档案',
          level: '文件',
          carrierFormat: '实体、电子',
          pageCount: 16,
          archivedDate: '2026-11-05',
        },
        {
          id: 'cb-015',
          status: '档案库',
          fondsNo: '0110',
          year: 2025,
          refCode: '0110-CW·2025-Y-CW-0001',
          title: '2025年度市属国有重点企业财务清查决算审计终结清算报告',
          securityLevel: '秘密',
          retention: '永久',
          docNo: '成国资审〔2025〕088号',
          category: '会计档案',
          level: '案卷',
          carrierFormat: '实体、电子',
          pageCount: 110,
          archivedDate: '2026-11-02',
        },
      ];
    }

    setBorrowTargetItems(itemsToBorrow);

    // Completely clear all input fields as requested by the user:
    setApplyBorrowForm({
      borrowNo: 'DAJY-20261105-001', // Recent November 2026 format (replaces 20210727)
      borrower: '',                 // Cleaned/empty!
      dept: '',                     // Cleaned/empty!
      borrowType: '实体档案',       // Radio default
      borrowTime: '',               // Cleaned/empty placeholder: 请选择时间
      returnTime: '',               // Cleaned/empty placeholder: 请选择时间
      purpose: '',                  // Cleaned/empty placeholder: 请输入借阅目的
      remark: '',                   // Cleaned/empty placeholder: 选填
    });

    setIsApplyBorrowModalOpen(true);
  };

  // Remove archive item inside 申请借阅 Modal
  const handleRemoveBorrowTargetItem = (id: string) => {
    setBorrowTargetItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Submit Borrow Application
  const handleSubmitBorrowApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (borrowTargetItems.length === 0) {
      onShowMessage('申请借阅的档案列表不能为空，请至少保留一份拟借阅档案');
      return;
    }

    if (!applyBorrowForm.borrower.trim()) {
      onShowMessage('请填写借阅人姓名');
      return;
    }

    if (!applyBorrowForm.purpose.trim()) {
      onShowMessage('请填写借阅目的');
      return;
    }

    // Generate new borrow record into dataList
    const newRecord: ArchiveBorrowRecord = {
      id: `br-${Date.now()}`,
      borrowNo: applyBorrowForm.borrowNo || 'DAJY-20261105-001',
      archiveRefCode: borrowTargetItems[0].refCode,
      archiveTitle: borrowTargetItems[0].title + (borrowTargetItems.length > 1 ? ` 等共${borrowTargetItems.length}卷` : ''),
      borrower: applyBorrowForm.borrower,
      dept: applyBorrowForm.dept || '技术部',
      purpose: applyBorrowForm.purpose,
      borrowType: applyBorrowForm.borrowType === '实体档案' ? '纸质借阅' : '电子查阅',
      applyTime: applyBorrowForm.borrowTime ? `${applyBorrowForm.borrowTime} 10:00:00` : '2026-11-05 10:00:00',
      expectedReturnTime: applyBorrowForm.returnTime ? `${applyBorrowForm.returnTime} 17:00:00` : '2026-11-12 17:00:00',
      status: '待审批',
      approveRemark: applyBorrowForm.remark || applyBorrowForm.purpose,
    };

    // Also add to pendingApprovalList
    const newApprovalItem: BorrowApprovalItem = {
      id: `ba-p-${Date.now()}`,
      borrowNo: applyBorrowForm.borrowNo || 'DAJY-20261105-001',
      applicant: applyBorrowForm.borrower,
      borrowType: applyBorrowForm.borrowType,
      dept: applyBorrowForm.dept || '技术部',
      borrowTime: applyBorrowForm.borrowTime || '2026-11-05',
      returnTime: applyBorrowForm.returnTime || '2026-11-12',
      purpose: applyBorrowForm.purpose,
      remark: applyBorrowForm.remark || '---',
      ePermission: applyBorrowForm.borrowType === '电子档案' ? '浏览、下载' : '---',
      archiveRefCode: borrowTargetItems[0].refCode,
      archiveTitle: borrowTargetItems[0].title + (borrowTargetItems.length > 1 ? ` 等共${borrowTargetItems.length}卷` : ''),
      category: borrowTargetItems[0].category,
      securityLevel: borrowTargetItems[0].securityLevel,
      retention: borrowTargetItems[0].retention,
      fondsNo: borrowTargetItems[0].fondsNo,
      pageCount: borrowTargetItems[0].pageCount,
      status: '待审批',
    };

    setPendingApprovalList((prev) => [newApprovalItem, ...prev]);
    setDataList([newRecord, ...dataList]);
    setIsApplyBorrowModalOpen(false);
    setSelectedItemIds([]);
    onShowMessage(`借阅申请单 [${newRecord.borrowNo}] 已成功提交，待分管审批！`);
  };

  // Pending Approvals (filtering & pagination strictly by 10 items per page)
  const filteredPendingList = pendingApprovalList
    .filter((item) => {
      if (!approveSearch) return true;
      const q = approveSearch.toLowerCase();
      return (
        item.applicant.toLowerCase().includes(q) ||
        item.dept.toLowerCase().includes(q) ||
        item.archiveTitle.toLowerCase().includes(q) ||
        item.archiveRefCode.toLowerCase().includes(q) ||
        item.borrowNo.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (b.borrowTime || '').localeCompare(a.borrowTime || '') || b.id.localeCompare(a.id));

  const paginatedPendingList = filteredPendingList.slice(
    (approvePage - 1) * PAGE_SIZE,
    approvePage * PAGE_SIZE
  );

  // Approval History (filtering & pagination strictly by 10 items per page)
  const filteredHistoryList = historyApprovalList
    .filter((item) => {
      if (!approveSearch) return true;
      const q = approveSearch.toLowerCase();
      return (
        item.applicant.toLowerCase().includes(q) ||
        item.dept.toLowerCase().includes(q) ||
        item.archiveTitle.toLowerCase().includes(q) ||
        item.archiveRefCode.toLowerCase().includes(q) ||
        item.borrowNo.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => (b.borrowTime || '').localeCompare(a.borrowTime || '') || b.id.localeCompare(a.id));

  const paginatedHistoryList = filteredHistoryList.slice(
    (approvePage - 1) * PAGE_SIZE,
    approvePage * PAGE_SIZE
  );

  // Row selection in 待审批
  const handleToggleSelectPendingRow = (id: string) => {
    setSelectedPendingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPending = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = paginatedPendingList.map((item) => item.id);
      setSelectedPendingIds(Array.from(new Set([...selectedPendingIds, ...pageIds])));
    } else {
      const pageIds = paginatedPendingList.map((item) => item.id);
      setSelectedPendingIds(selectedPendingIds.filter((id) => !pageIds.includes(id)));
    }
  };

  // Open Agree Modal
  const handleOpenAgreeModal = (singleItem?: BorrowApprovalItem) => {
    if (singleItem) {
      setSelectedPendingIds([singleItem.id]);
    } else if (selectedPendingIds.length === 0) {
      if (paginatedPendingList.length > 0) {
        setSelectedPendingIds([paginatedPendingList[0].id]);
        onShowMessage('已为您预选当前列表第 1 项待审批借阅单，请在弹窗中确认批复');
      } else {
        onShowMessage('当前没有待审批的借阅申请');
        return;
      }
    }
    setIsApproveAgreeModalOpen(true);
  };

  // Confirm Agree
  const handleConfirmAgree = () => {
    const targetItems = pendingApprovalList.filter((item) => selectedPendingIds.includes(item.id));
    if (targetItems.length === 0) return;

    const newHistoryItems: BorrowApprovalItem[] = targetItems.map((item) => ({
      ...item,
      status: '已通过',
      approveResult: '同意',
      ePermission: item.borrowType === '电子档案' ? agreeEPermission : '---',
      approver: '郭海波 (利用审批岗)',
      approveTime: '2026-11-05 16:30',
      approveComment: agreeComment,
    }));

    setHistoryApprovalList((prev) => [...newHistoryItems, ...prev]);
    setPendingApprovalList((prev) => prev.filter((item) => !selectedPendingIds.includes(item.id)));

    setDataList((prev) =>
      prev.map((d) => {
        const found = targetItems.find((t) => t.borrowNo === d.borrowNo);
        if (found) {
          return { ...d, status: '已批准', approveRemark: agreeComment };
        }
        return d;
      })
    );

    setSelectedPendingIds([]);
    setIsApproveAgreeModalOpen(false);
    if (detailApprovalRecord && selectedPendingIds.includes(detailApprovalRecord.id)) {
      setDetailApprovalRecord(null);
    }
    onShowMessage(`已成功审批同意 ${targetItems.length} 项借阅申请，并已流转至审批历史与在借台账！`);
  };

  // Open Reject Modal
  const handleOpenRejectModal = (singleItem?: BorrowApprovalItem) => {
    if (singleItem) {
      setSelectedPendingIds([singleItem.id]);
    } else if (selectedPendingIds.length === 0) {
      if (paginatedPendingList.length > 0) {
        setSelectedPendingIds([paginatedPendingList[0].id]);
        onShowMessage('已为您预选当前列表第 1 项待审批借阅单，请在弹窗中确认驳回');
      } else {
        onShowMessage('当前没有待审批的借阅申请');
        return;
      }
    }
    setIsApproveRejectModalOpen(true);
  };

  // Confirm Reject
  const handleConfirmReject = () => {
    const targetItems = pendingApprovalList.filter((item) => selectedPendingIds.includes(item.id));
    if (targetItems.length === 0) return;

    const newHistoryItems: BorrowApprovalItem[] = targetItems.map((item) => ({
      ...item,
      status: '已驳回',
      approveResult: rejectReason,
      approver: '陈安全 (档案室主管)',
      approveTime: '2026-11-05 16:35',
      approveComment: rejectComment,
    }));

    setHistoryApprovalList((prev) => [...newHistoryItems, ...prev]);
    setPendingApprovalList((prev) => prev.filter((item) => !selectedPendingIds.includes(item.id)));

    setDataList((prev) =>
      prev.map((d) => {
        const found = targetItems.find((t) => t.borrowNo === d.borrowNo);
        if (found) {
          return { ...d, status: '已驳回', approveRemark: rejectComment };
        }
        return d;
      })
    );

    setSelectedPendingIds([]);
    setIsApproveRejectModalOpen(false);
    if (detailApprovalRecord && selectedPendingIds.includes(detailApprovalRecord.id)) {
      setDetailApprovalRecord(null);
    }
    onShowMessage(`已驳回 ${targetItems.length} 项借阅申请，原因：${rejectReason}`);
  };

  // ==========================================
  // 3. 归还管理 (Return Management) Filtering & Handlers
  // ==========================================
  // Select Tree Node ("点击左侧，右侧数据也跟着变，右侧的年份不要太早")
  const handleSelectReturnTreeNode = (category: string | null, year: number | null) => {
    setReturnSelectedCategory(category);
    setReturnSelectedYear(year);
    setReturnPage(1);
    setSelectedReturnIds([]);
  };

  // Generic filter function for return items based on Tree & 借阅人 Search
  const filterReturnList = (list: BorrowReturnItem[]) => {
    return list
      .filter((item) => {
        // Tree filter: category
        if (returnSelectedCategory && item.category !== returnSelectedCategory) {
          return false;
        }
        // Tree filter: year
        if (returnSelectedYear && item.year !== returnSelectedYear) {
          return false;
        }
        // 借阅人 search filter
        if (returnBorrowerSearch.trim()) {
          const query = returnBorrowerSearch.trim().toLowerCase();
          const matchesBorrower = item.borrower.toLowerCase().includes(query);
          const matchesDept = item.dept.toLowerCase().includes(query);
          const matchesTitle = item.archiveTitle.toLowerCase().includes(query);
          const matchesRef = item.archiveRefCode.toLowerCase().includes(query);
          const matchesNo = item.borrowNo.toLowerCase().includes(query);
          if (!matchesBorrower && !matchesDept && !matchesTitle && !matchesRef && !matchesNo) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => (b.borrowTime || '').localeCompare(a.borrowTime || '') || b.id.localeCompare(a.id));
  };

  const filteredNotReturnedList = filterReturnList(notReturnedList);
  const paginatedNotReturnedList = filteredNotReturnedList.slice(
    (returnPage - 1) * PAGE_SIZE,
    returnPage * PAGE_SIZE
  );

  const filteredReturnedList = filterReturnList(returnedList);
  const paginatedReturnedList = filteredReturnedList.slice(
    (returnPage - 1) * PAGE_SIZE,
    returnPage * PAGE_SIZE
  );

  const filteredOverdueList = filterReturnList(overdueList);
  const paginatedOverdueList = filteredOverdueList.slice(
    (returnPage - 1) * PAGE_SIZE,
    returnPage * PAGE_SIZE
  );

  // Current active list and paginated slice based on returnSubTab
  const currentReturnTotal =
    returnSubTab === 'not_returned'
      ? filteredNotReturnedList.length
      : returnSubTab === 'returned'
      ? filteredReturnedList.length
      : filteredOverdueList.length;

  const currentPaginatedReturns =
    returnSubTab === 'not_returned'
      ? paginatedNotReturnedList
      : returnSubTab === 'returned'
      ? paginatedReturnedList
      : paginatedOverdueList;

  // Row selection in 归还管理
  const handleToggleSelectReturnRow = (id: string) => {
    setSelectedReturnIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllReturns = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const pageIds = currentPaginatedReturns.map((item) => item.id);
      setSelectedReturnIds(Array.from(new Set([...selectedReturnIds, ...pageIds])));
    } else {
      const pageIds = currentPaginatedReturns.map((item) => item.id);
      setSelectedReturnIds(selectedReturnIds.filter((id) => !pageIds.includes(id)));
    }
  };

  // Open Return Modal
  const handleOpenReturnModal = (singleItem?: BorrowReturnItem) => {
    if (singleItem) {
      setReturnTargetItem(singleItem);
      setSelectedReturnIds([singleItem.id]);
    } else if (selectedReturnIds.length === 0) {
      if (currentPaginatedReturns.length > 0) {
        setReturnTargetItem(currentPaginatedReturns[0]);
        setSelectedReturnIds([currentPaginatedReturns[0].id]);
        onShowMessage('已为您预选当前列表第 1 项待归还档案，请在弹窗中办理归还');
      } else {
        onShowMessage('当前没有可归还的档案记录');
        return;
      }
    } else {
      const firstSelected =
        notReturnedList.find((i) => i.id === selectedReturnIds[0]) ||
        overdueList.find((i) => i.id === selectedReturnIds[0]) ||
        currentPaginatedReturns[0];
      setReturnTargetItem(firstSelected || null);
    }
    setIsReturnProcessModalOpen(true);
  };

  // Confirm Return
  const handleConfirmReturn = () => {
    const targetIds = selectedReturnIds.length > 0 ? selectedReturnIds : returnTargetItem ? [returnTargetItem.id] : [];
    if (targetIds.length === 0) return;

    // Collect all returning items from notReturnedList and overdueList
    const returningFromNotReturned = notReturnedList.filter((item) => targetIds.includes(item.id));
    const returningFromOverdue = overdueList.filter((item) => targetIds.includes(item.id));
    const allReturning = [...returningFromNotReturned, ...returningFromOverdue];

    if (allReturning.length === 0 && returnTargetItem) {
      allReturning.push(returnTargetItem);
    }

    const newReturnedItems: BorrowReturnItem[] = allReturning.map((item) => ({
      ...item,
      status: '已归还',
      actualReturnTime: '2026-11-05 16:50',
      returnInspector,
      returnCondition: returnIntegrity,
      remark: returnRemark,
      location: returnStorageLocation,
    }));

    // Update returned list
    setReturnedList((prev) => [...newReturnedItems, ...prev]);

    // Remove from notReturnedList and overdueList
    setNotReturnedList((prev) => prev.filter((item) => !targetIds.includes(item.id)));
    setOverdueList((prev) => prev.filter((item) => !targetIds.includes(item.id)));

    // Sync with general dataList
    setDataList((prev) =>
      prev.map((d) => {
        if (targetIds.some((tid) => tid.includes(d.borrowNo) || d.borrowNo.includes(tid))) {
          return {
            ...d,
            status: '已归还',
            approveRemark: `【归还登记】查验结论：${returnIntegrity}。查验人：${returnInspector}。${returnRemark}`,
          };
        }
        return d;
      })
    );

    setSelectedReturnIds([]);
    setIsReturnProcessModalOpen(false);
    setReturnTargetItem(null);
    if (detailReturnRecord && targetIds.includes(detailReturnRecord.id)) {
      setDetailReturnRecord(null);
    }
    onShowMessage(`已成功办理 ${allReturning.length} 项档案归还入库，档案已入库上架！`);
  };

  // Open Renew Modal
  const handleOpenRenewModal = (singleItem?: BorrowReturnItem) => {
    if (singleItem) {
      setRenewTargetItem(singleItem);
      setSelectedReturnIds([singleItem.id]);
    } else if (selectedReturnIds.length === 0) {
      if (currentPaginatedReturns.length > 0) {
        setRenewTargetItem(currentPaginatedReturns[0]);
        setSelectedReturnIds([currentPaginatedReturns[0].id]);
        onShowMessage('已为您预选当前列表第 1 项档案，请在弹窗中办理借阅续期');
      } else {
        onShowMessage('当前没有可续借的档案记录');
        return;
      }
    } else {
      const firstSelected =
        notReturnedList.find((i) => i.id === selectedReturnIds[0]) ||
        overdueList.find((i) => i.id === selectedReturnIds[0]) ||
        currentPaginatedReturns[0];
      setRenewTargetItem(firstSelected || null);
    }
    setIsRenewModalOpen(true);
  };

  // Confirm Renew
  const handleConfirmRenew = () => {
    const targetIds = selectedReturnIds.length > 0 ? selectedReturnIds : renewTargetItem ? [renewTargetItem.id] : [];
    if (targetIds.length === 0) return;

    // Update notReturnedList
    setNotReturnedList((prev) =>
      prev.map((item) => {
        if (targetIds.includes(item.id)) {
          return {
            ...item,
            expectedReturnTime: renewNewDate,
            remark: `已续借至${renewNewDate}（事由：${renewReason}）`,
          };
        }
        return item;
      })
    );

    // If renewed from overdueList, move back to notReturnedList
    const renewedOverdues = overdueList.filter((item) => targetIds.includes(item.id));
    if (renewedOverdues.length > 0) {
      const recoveredItems: BorrowReturnItem[] = renewedOverdues.map((item) => ({
        ...item,
        status: '未归还',
        expectedReturnTime: renewNewDate,
        overdueDays: undefined,
        remark: `逾期已办理补续借，延长至${renewNewDate}`,
      }));
      setNotReturnedList((prev) => [...recoveredItems, ...prev]);
      setOverdueList((prev) => prev.filter((item) => !targetIds.includes(item.id)));
    }

    setSelectedReturnIds([]);
    setIsRenewModalOpen(false);
    setRenewTargetItem(null);
    if (detailReturnRecord && targetIds.includes(detailReturnRecord.id)) {
      setDetailReturnRecord({
        ...detailReturnRecord,
        expectedReturnTime: renewNewDate,
        remark: `已续借至${renewNewDate}`,
      });
    }
    onShowMessage(`已成功办理 ${targetIds.length} 项档案续借手续，期限已顺延至 ${renewNewDate}！`);
  };

  // Urge Overdue Return
  const handleUrgeReturnItem = (item: BorrowReturnItem) => {
    onShowMessage(`已向借阅人 [${item.borrower}] (${item.dept}) 发送催还提醒短信及企业协同督办通知（档号: ${item.archiveRefCode}）`);
  };

  // Total counts for stats cards
  const totalInLoanCount = notReturnedList.length;
  const totalOverdueCount = overdueList.length;
  const totalPendingApproveCount = pendingApprovalList.length;
  const totalReturnedCount = returnedList.length;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Banner with Submenu Navigation Tabs */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">档案利用中心</h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium">
              4 项利用服务模块
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            提供从档案目录分类检索、在线申请借阅、逐级流转审批、到期归还查验与统计分析全生命周期服务。
          </p>
        </div>

        {/* Quick Submenu Switch Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/60 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            onClick={() => {
              setActiveTab('borrow_records');
              if (onNavigate) onNavigate('borrow_records');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'borrow_records'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpenCheck className="w-3.5 h-3.5" />
            <span>借阅档案</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('borrow_approve');
              if (onNavigate) onNavigate('borrow_approve');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap relative ${
              activeTab === 'borrow_approve'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>借阅审批</span>
            {totalPendingApproveCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                {totalPendingApproveCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('borrow_return');
              if (onNavigate) onNavigate('borrow_return');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap relative ${
              activeTab === 'borrow_return'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>归还管理</span>
            {totalOverdueCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
                {totalOverdueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('borrow_stats');
              if (onNavigate) onNavigate('borrow_stats');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
              activeTab === 'borrow_stats'
                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>借阅统计</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. 子菜单 1: 借阅档案 (Borrow Archives - Left Tree & Right Table)*/}
      {/* ============================================================== */}
      {activeTab === 'borrow_records' && (
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* Left Panel: 档案目录树 (Directory Tree) */}
          <div className="w-full lg:w-64 shrink-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 flex items-center justify-between">
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>档案目录树</span>
              </div>
              {(selectedCategory || selectedYear) && (
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedYear(null);
                    setCatalogPage(1);
                  }}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  重置全部
                </button>
              )}
            </div>

            <div className="p-3 text-xs space-y-1 max-h-[700px] overflow-y-auto">
              <div className="space-y-1">
                <button
                  onClick={() => toggleNode('root')}
                  className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-semibold"
                >
                  {expandedNodes.root ? (
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  )}
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                  <span className="truncate">成都市城市建设发展总公司</span>
                </button>

                {expandedNodes.root && (
                  <div className="pl-4 space-y-1 border-l border-slate-200 dark:border-slate-800 ml-3">
                    {treeNodes.map((cat) => {
                      const isCatExpanded = !!expandedNodes[cat.name];
                      const isCatSelected = selectedCategory === cat.name && selectedYear === null;
                      const catTotalCount = catalogList.filter((item) => item.category === cat.name).length;

                      return (
                        <div key={cat.name} className="space-y-0.5">
                          <div
                            className={`flex items-center justify-between px-2 py-1 rounded-md transition-colors ${
                              isCatSelected
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <button
                              onClick={() => {
                                toggleNode(cat.name);
                                setSelectedCategory(cat.name);
                                setSelectedYear(null);
                                setCatalogPage(1);
                              }}
                              className="flex items-center gap-1.5 truncate flex-1 text-left"
                            >
                              {cat.years.length > 0 && (
                                isCatExpanded ? (
                                  <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
                                ) : (
                                  <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                                )
                              )}
                              {isCatExpanded ? (
                                <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              ) : (
                                <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                              <span className="truncate">{cat.name}</span>
                            </button>
                            <span className="text-[10px] text-slate-400 font-mono px-1">
                              {catTotalCount}
                            </span>
                          </div>

                          {isCatExpanded && (
                            <div className="pl-5 space-y-0.5 border-l border-slate-100 dark:border-slate-800 ml-2.5 py-0.5">
                              {cat.years.map((yr) => {
                                const isYearSelected = selectedCategory === cat.name && selectedYear === yr;
                                const count = catalogList.filter(
                                  (item) => item.category === cat.name && item.year === yr
                                ).length;

                                return (
                                  <button
                                    key={yr}
                                    onClick={() => {
                                      setSelectedCategory(cat.name);
                                      setSelectedYear(yr);
                                      setCatalogPage(1);
                                    }}
                                    className={`w-full flex items-center justify-between px-2 py-1 rounded-md text-xs transition-colors ${
                                      isYearSelected
                                        ? 'bg-blue-600 text-white font-semibold shadow-xs'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900'
                                    }`}
                                  >
                                    <div className="flex items-center gap-1.5">
                                      <FileText className="w-3 h-3 shrink-0" />
                                      <span>{yr}年</span>
                                    </div>
                                    <span
                                      className={`text-[10px] font-mono px-1 rounded ${
                                        isYearSelected ? 'text-blue-100' : 'text-slate-400'
                                      }`}
                                    >
                                      {count}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Action Bar + Table matching screenshot */}
          <div className="flex-1 min-w-0 space-y-3 w-full">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenBorrowModal()}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <BookOpenCheck className="w-3.5 h-3.5" />
                  <span>申请借阅</span>
                </button>
                {selectedItemIds.length > 0 && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/40">
                    已选 {selectedItemIds.length} 卷
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">题名:</span>
                <input
                  type="text"
                  placeholder="请输入检索题名或档号..."
                  value={searchTitle}
                  onChange={(e) => {
                    setSearchTitle(e.target.value);
                    setCatalogPage(1);
                  }}
                  className="w-48 sm:w-64 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                />
                <button
                  onClick={() => setCatalogPage(1)}
                  className="px-3.5 py-1.5 rounded-lg border border-blue-500 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                >
                  检索
                </button>
                <button
                  onClick={() => setIsAdvancedSearchOpen(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline px-1 py-1 font-medium flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>高级检索</span>
                </button>
              </div>
            </div>

            {(selectedCategory || selectedYear) && (
              <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex items-center justify-between">
                <span>
                  当前目录节点:{' '}
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    成都市城市建设发展总公司
                    {selectedCategory ? ` > ${selectedCategory}` : ''}
                    {selectedYear ? ` > ${selectedYear}年` : ''}
                  </span>
                  {' '}(匹配共 {filteredCatalogData.length} 卷)
                </span>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedYear(null);
                    setCatalogPage(1);
                  }}
                  className="text-slate-500 hover:text-slate-800 text-[11px] underline"
                >
                  清除分类过滤
                </button>
              </div>
            )}

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3 px-3 w-8 text-center">
                        <input
                          type="checkbox"
                          checked={
                            paginatedCatalogData.length > 0 &&
                            paginatedCatalogData.every((item) => selectedItemIds.includes(item.id))
                          }
                          onChange={handleSelectAll}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="py-3 px-3 whitespace-nowrap text-center">序号</th>
                      <th className="py-3 px-3 whitespace-nowrap">档案状态</th>
                      <th className="py-3 px-3 whitespace-nowrap">全宗号</th>
                      <th className="py-3 px-3 whitespace-nowrap">年度</th>
                      <th className="py-3 px-4 whitespace-nowrap font-mono">档号</th>
                      <th className="py-3 px-4 min-w-[240px]">题名</th>
                      <th className="py-3 px-3 whitespace-nowrap">密级</th>
                      <th className="py-3 px-3 whitespace-nowrap">期限</th>
                      <th className="py-3 px-4 whitespace-nowrap">文号</th>
                      <th className="py-3 px-3 whitespace-nowrap text-right">操作</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                    {paginatedCatalogData.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="py-12 text-center text-slate-400">
                          暂无符合条件的档案目录数据
                        </td>
                      </tr>
                    ) : (
                      paginatedCatalogData.map((row, idx) => {
                        const isSelected = selectedItemIds.includes(row.id);

                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors ${
                              isSelected ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleRowSelect(row.id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>

                            <td className="py-3 px-3 text-center font-mono text-slate-500">
                              {(catalogPage - 1) * PAGE_SIZE + idx + 1}
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-medium text-[11px]">
                                {row.status}
                              </span>
                            </td>

                            <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {row.fondsNo}
                            </td>

                            <td className="py-3 px-3 font-mono text-slate-800 dark:text-slate-200 whitespace-nowrap font-semibold">
                              {row.year}
                            </td>

                            <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {row.refCode}
                            </td>

                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                              <div className="line-clamp-2" title={row.title}>
                                {row.title}
                              </div>
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded font-medium text-[11px] ${
                                  row.securityLevel === '机密'
                                    ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                                    : row.securityLevel === '秘密'
                                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                                    : row.securityLevel === '内部'
                                    ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                                    : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                }`}
                              >
                                {row.securityLevel}
                              </span>
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded font-mono text-[11px] ${
                                  row.retention === '永久'
                                    ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-semibold'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {row.retention}
                              </span>
                            </td>

                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
                              {row.docNo}
                            </td>

                            <td className="py-3 px-3 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => handleOpenBorrowModal(row)}
                                  className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-semibold transition-colors"
                                >
                                  借阅
                                </button>
                                <button
                                  onClick={() =>
                                    onSelectRecord({
                                      archiveRefCode: row.refCode,
                                      title: row.title,
                                      fondsNo: row.fondsNo,
                                      author: '市档案局利用服务中心',
                                      creationTime: row.archivedDate,
                                      retentionPeriod: row.retention,
                                      securityLevel: row.securityLevel,
                                      carrierType: '电子文件',
                                      pageCount: row.pageCount,
                                      keywords: [row.category, `${row.year}年`, row.securityLevel],
                                      summary: `${row.title}，正式收录于${row.category}类目，文号：${row.docNo}。`,
                                    })
                                  }
                                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium transition-colors"
                                >
                                  详情
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={catalogPage}
                totalItems={filteredCatalogData.length}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => setCatalogPage(page)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. 子菜单 2: 借阅审批 (Borrow Approval)                          */}
      {/* ============================================================== */}
      {activeTab === 'borrow_approve' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
            {/* Top Subtabs & Search */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5">
              <div className="flex items-center gap-8">
                <button
                  onClick={() => {
                    setApproveSubTab('pending');
                    setApprovePage(1);
                    setSelectedPendingIds([]);
                  }}
                  className={`pb-2.5 text-sm font-bold relative transition-colors cursor-pointer ${
                    approveSubTab === 'pending'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>待审批</span>
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono">
                    {pendingApprovalList.length}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setApproveSubTab('history');
                    setApprovePage(1);
                  }}
                  className={`pb-2.5 text-sm font-bold relative transition-colors cursor-pointer ${
                    approveSubTab === 'history'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>审批历史</span>
                  <span className="ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                    {historyApprovalList.length}
                  </span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">综合检索:</span>
                <input
                  type="text"
                  placeholder="检索借阅人、部门、档号或题名..."
                  value={approveSearch}
                  onChange={(e) => {
                    setApproveSearch(e.target.value);
                    setApprovePage(1);
                  }}
                  className="w-56 sm:w-64 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                />
                {approveSearch && (
                  <button
                    onClick={() => {
                      setApproveSearch('');
                      setApprovePage(1);
                    }}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    重置
                  </button>
                )}
              </div>
            </div>

            {approveSubTab === 'pending' && (
              <div className="space-y-3">
                {/* Top Action Buttons for 待审批: 同意 / 不同意 matching Screenshot 1 */}
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleOpenAgreeModal()}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>同意</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenRejectModal()}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>不同意</span>
                  </button>
                  {selectedPendingIds.length > 0 && (
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium ml-2">
                      已选中 {selectedPendingIds.length} 项借阅单
                    </span>
                  )}
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                        <tr>
                          <th className="py-2.5 px-3 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={
                                paginatedPendingList.length > 0 &&
                                paginatedPendingList.every((row) => selectedPendingIds.includes(row.id))
                              }
                              onChange={handleToggleSelectAllPending}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </th>
                          <th className="py-2.5 px-3 whitespace-nowrap">序号</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">借阅人</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">借阅类型</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">借阅部门</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">借阅时间</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">归还时间</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">借阅目的</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">备注</th>
                          <th className="py-2.5 px-3 whitespace-nowrap">电子文件权限</th>
                          <th className="py-2.5 px-4 min-w-[280px]">借阅内容</th>
                          <th className="py-2.5 px-4 whitespace-nowrap text-right">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                        {paginatedPendingList.length === 0 ? (
                          <tr>
                            <td colSpan={12} className="py-12 text-center text-slate-400">
                              暂无等待审批的借阅申请
                            </td>
                          </tr>
                        ) : (
                          paginatedPendingList.map((row, idx) => (
                            <tr
                              key={row.id}
                              className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                                selectedPendingIds.includes(row.id) ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                              }`}
                            >
                              <td className="py-3 px-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={selectedPendingIds.includes(row.id)}
                                  onChange={() => handleToggleSelectPendingRow(row.id)}
                                  className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                              </td>
                              <td className="py-3 px-3 text-slate-500 font-mono">
                                {(approvePage - 1) * PAGE_SIZE + idx + 1}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                                {row.applicant}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                    row.borrowType === '实体档案'
                                      ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                                      : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                                  }`}
                                >
                                  {row.borrowType}
                                </span>
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                                {row.dept}
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                {row.borrowTime}
                              </td>
                              <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                                {row.returnTime}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap text-slate-700 dark:text-slate-300 max-w-[140px] truncate" title={row.purpose}>
                                {row.purpose}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                {row.remark || '---'}
                              </td>
                              <td className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                    row.ePermission === '浏览、下载'
                                      ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                                      : row.ePermission === '浏览'
                                      ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60'
                                      : 'text-slate-400'
                                  }`}
                                >
                                  {row.ePermission || '---'}
                                </span>
                              </td>
                              <td className="py-3 px-4 min-w-[280px]">
                                <div className="space-y-0.5 leading-snug">
                                  <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                    档号: {row.archiveRefCode}
                                  </div>
                                  <div className="font-medium text-slate-900 dark:text-slate-100">
                                    题名: {row.archiveTitle}
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenAgreeModal(row)}
                                    className="px-2 py-0.5 rounded text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                                  >
                                    同意
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRejectModal(row)}
                                    className="px-2 py-0.5 rounded text-[11px] font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60"
                                  >
                                    驳回
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDetailApprovalRecord(row)}
                                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline text-xs"
                                  >
                                    查看档案详情
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    currentPage={approvePage}
                    totalItems={filteredPendingList.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={(page) => setApprovePage(page)}
                  />
                </div>
              </div>
            )}

            {approveSubTab === 'history' && (
              <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                      <tr>
                        <th className="py-2.5 px-3 whitespace-nowrap">序号</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">借阅人</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">借阅类型</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">借阅部门</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">借阅时间</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">归还时间</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">借阅目的</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">备注</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">电子文件权限</th>
                        <th className="py-2.5 px-4 min-w-[280px]">借阅内容</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">审批结果</th>
                        <th className="py-2.5 px-4 whitespace-nowrap text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                      {paginatedHistoryList.length === 0 ? (
                        <tr>
                          <td colSpan={12} className="py-12 text-center text-slate-400">
                            暂无符合条件的审批历史记录
                          </td>
                        </tr>
                      ) : (
                        paginatedHistoryList.map((row, idx) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                            <td className="py-3 px-3 text-slate-500 font-mono">
                              {(approvePage - 1) * PAGE_SIZE + idx + 1}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                              {row.applicant}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                  row.borrowType === '实体档案'
                                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                                    : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                                }`}
                              >
                                {row.borrowType}
                              </span>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                              {row.dept}
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {row.borrowTime}
                            </td>
                            <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                              {row.returnTime}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-slate-700 dark:text-slate-300 max-w-[140px] truncate" title={row.purpose}>
                              {row.purpose}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                              {row.remark || '---'}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                  row.ePermission === '浏览、下载'
                                    ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                                    : row.ePermission === '浏览'
                                    ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60'
                                    : 'text-slate-400'
                                }`}
                              >
                                {row.ePermission || '---'}
                              </span>
                            </td>
                            <td className="py-3 px-4 min-w-[280px]">
                              <div className="space-y-0.5 leading-snug">
                                <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                  档号: {row.archiveRefCode}
                                </div>
                                <div className="font-medium text-slate-900 dark:text-slate-100">
                                  题名: {row.archiveTitle}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 rounded font-semibold text-[11px] inline-flex items-center gap-1 ${
                                  row.approveResult === '同意'
                                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60'
                                    : 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60'
                                }`}
                              >
                                {row.approveResult}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => setDetailApprovalRecord(row)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline text-xs"
                              >
                                查看档案详情
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={approvePage}
                  totalItems={filteredHistoryList.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={(page) => setApprovePage(page)}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. 子菜单 3: 归还管理 (Return Management)                        */}
      {/* ============================================================== */}
      {activeTab === 'borrow_return' && (
        <div className="flex flex-col lg:flex-row gap-4 items-start">
          {/* LEFT: 档案目录树 (Archive Directory Tree) */}
          <div className="w-full lg:w-64 shrink-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 font-semibold text-xs text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>档案目录树</span>
              </span>
              {(returnSelectedCategory || returnSelectedYear) && (
                <button
                  type="button"
                  onClick={() => handleSelectReturnTreeNode(null, null)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-normal"
                >
                  清除筛选
                </button>
              )}
            </div>

            <div className="p-3 text-xs space-y-1">
              {/* Root Node: XX公司 / 盛京能源建设集团 */}
              <div
                onClick={() => handleSelectReturnTreeNode(null, null)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  !returnSelectedCategory && !returnSelectedYear
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                <Folder className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>盛京能源建设集团</span>
              </div>

              {/* Children categories */}
              <div className="pl-4 space-y-1">
                {treeNodes.map((cat) => {
                  const isExpanded = returnExpandedNodes[cat.name];
                  const isCategoryActive = returnSelectedCategory === cat.name && !returnSelectedYear;
                  return (
                    <div key={cat.name} className="space-y-0.5">
                      <div
                        className={`flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer transition-colors ${
                          isCategoryActive
                            ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div
                          className="flex items-center gap-1.5 flex-1"
                          onClick={() => handleSelectReturnTreeNode(cat.name, null)}
                        >
                          <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span>{cat.name}</span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleReturnNode(cat.name);
                          }}
                          className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Sub-years (2026年, 2025年, 2024年 - strictly recent) */}
                      {isExpanded && (
                        <div className="pl-5 space-y-0.5">
                          {cat.years.map((yr) => {
                            const isYearActive =
                              returnSelectedCategory === cat.name && returnSelectedYear === yr;
                            return (
                              <div
                                key={yr}
                                onClick={() => handleSelectReturnTreeNode(cat.name, yr)}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-md cursor-pointer text-[11px] transition-colors ${
                                  isYearActive
                                    ? 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                }`}
                              >
                                <FileText className="w-3 h-3 text-slate-400 shrink-0" />
                                <span>{yr}年</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: 主展示区 (Tabs + Action Buttons + Search + Table + Pagination) */}
          <div className="flex-1 w-full space-y-3 min-w-0">
            {/* Top Sub-Tabs: 未归还 | 已归还 | 超期 */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center gap-8 px-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setReturnSubTab('not_returned');
                  setReturnPage(1);
                  setSelectedReturnIds([]);
                }}
                className={`pb-3 text-sm font-semibold transition-all relative ${
                  returnSubTab === 'not_returned'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>未归还</span>
                <span className="ml-1.5 text-xs px-1.5 py-0.2 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                  {notReturnedList.length}
                </span>
                {returnSubTab === 'not_returned' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setReturnSubTab('returned');
                  setReturnPage(1);
                  setSelectedReturnIds([]);
                }}
                className={`pb-3 text-sm font-semibold transition-all relative ${
                  returnSubTab === 'returned'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>已归还</span>
                <span className="ml-1.5 text-xs px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {returnedList.length}
                </span>
                {returnSubTab === 'returned' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setReturnSubTab('overdue');
                  setReturnPage(1);
                  setSelectedReturnIds([]);
                }}
                className={`pb-3 text-sm font-semibold transition-all relative ${
                  returnSubTab === 'overdue'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <span>超期</span>
                <span className="ml-1.5 text-xs px-1.5 py-0.2 rounded-full bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300">
                  {overdueList.length}
                </span>
                {returnSubTab === 'overdue' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 dark:bg-red-400 rounded-full" />
                )}
              </button>
            </div>

            {/* Action Buttons & 借阅人 Search Input */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2.5">
                {returnSubTab !== 'returned' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleOpenReturnModal()}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>归还</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenRenewModal()}
                      className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs flex items-center gap-1.5 transition-colors"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>续借</span>
                    </button>
                  </>
                ) : (
                  <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>共查验入库已归还档案 {returnedList.length} 卷/册</span>
                  </div>
                )}

                {returnSubTab === 'overdue' && (
                  <button
                    type="button"
                    onClick={() => {
                      onShowMessage('已向当前所有超期人员发送加急催还督办短信与站内提醒');
                    }}
                    className="px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>一键批量催还</span>
                  </button>
                )}

                {selectedReturnIds.length > 0 && (
                  <span className="text-xs text-blue-600 dark:text-blue-400 font-medium ml-2">
                    已勾选 {selectedReturnIds.length} 项
                  </span>
                )}
              </div>

              {/* Search by 借阅人 */}
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-700 dark:text-slate-300 font-medium shrink-0">
                  借阅人:
                </label>
                <div className="relative w-48 sm:w-60">
                  <input
                    type="text"
                    value={returnBorrowerSearch}
                    onChange={(e) => {
                      setReturnBorrowerSearch(e.target.value);
                      setReturnPage(1);
                    }}
                    placeholder="请输入借阅人姓名..."
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  />
                  {returnBorrowerSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setReturnBorrowerSearch('');
                        setReturnPage(1);
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tree filter indicator tag */}
            {(returnSelectedCategory || returnSelectedYear) && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                <span>当前目录树筛选:</span>
                {returnSelectedCategory && (
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                    {returnSelectedCategory}
                  </span>
                )}
                {returnSelectedYear && (
                  <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-medium">
                    {returnSelectedYear}年
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleSelectReturnTreeNode(null, null)}
                  className="text-blue-600 hover:underline ml-2"
                >
                  显示全部
                </button>
              </div>
            )}

            {/* TABLE SECTION strictly matching user's screenshots */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            currentPaginatedReturns.length > 0 &&
                            currentPaginatedReturns.every((row) => selectedReturnIds.includes(row.id))
                          }
                          onChange={handleToggleSelectAllReturns}
                          className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap">序号</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">借阅人</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">借阅类型</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">借阅部门</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">借阅时间</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">
                        {returnSubTab === 'returned' ? '实际归还时间' : '归还时间'}
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap">借阅目的</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">
                        {returnSubTab === 'returned' ? '查验结论' : returnSubTab === 'overdue' ? '超期状态' : '备注'}
                      </th>
                      <th className="py-2.5 px-3 whitespace-nowrap">
                        {returnSubTab === 'returned' ? '核验保管员' : '电子文件权限'}
                      </th>
                      <th className="py-2.5 px-4 min-w-[280px]">借阅内容</th>
                      <th className="py-2.5 px-4 whitespace-nowrap text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                    {currentPaginatedReturns.length === 0 ? (
                      <tr>
                        <td colSpan={12} className="py-12 text-center text-slate-400">
                          暂无符合条件的{returnSubTab === 'not_returned' ? '未归还' : returnSubTab === 'returned' ? '已归还' : '超期'}档案记录
                        </td>
                      </tr>
                    ) : (
                      currentPaginatedReturns.map((row, idx) => (
                        <tr
                          key={row.id}
                          className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                            selectedReturnIds.includes(row.id) ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={selectedReturnIds.includes(row.id)}
                              onChange={() => handleToggleSelectReturnRow(row.id)}
                              className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono">
                            {(returnPage - 1) * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                            {row.borrower}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                row.borrowType === '实体档案'
                                  ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60'
                                  : 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60'
                              }`}
                            >
                              {row.borrowType}
                            </span>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                            {row.dept}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {row.borrowTime}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {returnSubTab === 'returned'
                              ? row.actualReturnTime || row.expectedReturnTime
                              : row.expectedReturnTime}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap text-slate-700 dark:text-slate-300 max-w-[140px] truncate" title={row.purpose}>
                            {row.purpose}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {returnSubTab === 'returned' ? (
                              <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                                {row.returnCondition || '完好无损入库'}
                              </span>
                            ) : returnSubTab === 'overdue' ? (
                              <span className="px-2 py-0.5 rounded font-semibold text-[11px] bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800/60">
                                逾期 {row.overdueDays || 2} 天
                              </span>
                            ) : (
                              <span className="text-slate-500 dark:text-slate-400">
                                {row.remark || '---'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            {returnSubTab === 'returned' ? (
                              <span className="text-slate-700 dark:text-slate-300 font-mono text-[11px]">
                                {row.returnInspector || '苏晓文 (利用管理岗)'}
                              </span>
                            ) : (
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                                  row.ePermission === '浏览、下载'
                                    ? 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60'
                                    : row.ePermission === '浏览'
                                    ? 'bg-cyan-50 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800/60'
                                    : 'text-slate-400'
                                }`}
                              >
                                {row.ePermission || '---'}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 min-w-[280px]">
                            <div className="space-y-0.5 leading-snug">
                              <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                                档号: {row.archiveRefCode}
                              </div>
                              <div className="font-medium text-slate-900 dark:text-slate-100">
                                题名: {row.archiveTitle}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              {returnSubTab !== 'returned' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenReturnModal(row)}
                                    className="px-2 py-0.5 rounded text-[11px] font-medium text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                                  >
                                    归还
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleOpenRenewModal(row)}
                                    className="px-2 py-0.5 rounded text-[11px] font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60"
                                  >
                                    续借
                                  </button>
                                </>
                              )}
                              {returnSubTab === 'overdue' && (
                                <button
                                  type="button"
                                  onClick={() => handleUrgeReturnItem(row)}
                                  className="px-2 py-0.5 rounded text-[11px] font-medium text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60"
                                >
                                  催还
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => setDetailReturnRecord(row)}
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium hover:underline text-xs"
                              >
                                查看档案详情
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={returnPage}
                totalItems={currentReturnTotal}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => setReturnPage(page)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 4. 子菜单 4: 借阅统计 (Borrow Statistics)                        */}
      {/* ============================================================== */}
      {activeTab === 'borrow_stats' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>累计借阅利用总量</span>
                <BookOpenCheck className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                3,428 <span className="text-xs font-normal text-slate-500">人次</span>
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>近11月较上月增长 12.4%</span>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>电子查阅利用占比</span>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                83.5%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                数字化脱密查阅与动态水印覆盖率 100%
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>纸质原件出库借阅</span>
                <FileSpreadsheet className="w-4 h-4 text-purple-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                16.5%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                实体原件借出严格双人查验核对
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <div className="flex items-center justify-between text-slate-500 text-xs">
                <span>档案按期归还率</span>
                <RotateCcw className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white mt-2">
                99.2%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                平均借阅周转周期 4.8 天
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    <span>近7日档案利用走势 (2026年10月30日 - 11月05日)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">每日借阅发起量与归还入库量对比走势</p>
                </div>

                <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                  <button
                    onClick={() => setStatsPeriod('week')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      statsPeriod === 'week' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    按日
                  </button>
                  <button
                    onClick={() => setStatsPeriod('month')}
                    className={`px-2.5 py-1 rounded font-medium ${
                      statsPeriod === 'month' ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    按月
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  { date: '11-05 (今日)', borrows: 48, returns: 38, max: 60 },
                  { date: '11-04 (昨日)', borrows: 52, returns: 45, max: 60 },
                  { date: '11-03', borrows: 44, returns: 40, max: 60 },
                  { date: '11-02', borrows: 39, returns: 35, max: 60 },
                  { date: '11-01', borrows: 36, returns: 32, max: 60 },
                  { date: '10-31', borrows: 31, returns: 28, max: 60 },
                  { date: '10-30', borrows: 27, returns: 26, max: 60 },
                ].map((item, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <span>{item.date}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-blue-600 dark:text-blue-400 font-semibold">借阅: {item.borrows}次</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">归还: {item.returns}卷</span>
                      </div>
                    </div>
                    <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-full rounded-l-full transition-all duration-500"
                        style={{ width: `${(item.borrows / item.max) * 60}%` }}
                      />
                      <div
                        className="bg-emerald-500 dark:bg-emerald-400 h-full rounded-r-full transition-all duration-500 ml-0.5"
                        style={{ width: `${(item.returns / item.max) * 40}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-blue-600" />
                  <span>电子与纸质借阅</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-emerald-500" />
                  <span>归还入库核验</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>借阅档案门类分布</span>
              </h3>

              <div className="space-y-3.5">
                {[
                  { label: '文书档案', pct: 46, count: '1,576卷', color: 'bg-blue-500' },
                  { label: '科技与基建档案', pct: 24, count: '822卷', color: 'bg-indigo-500' },
                  { label: '财务与会计档案', pct: 18, count: '617卷', color: 'bg-emerald-500' },
                  { label: '声像与照片档案', pct: 12, count: '413件', color: 'bg-amber-500' },
                ].map((cat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                      <span>{cat.label}</span>
                      <span className="font-mono text-slate-500">{cat.count} ({cat.pct}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">借阅目的构成</div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[10px]">业务参考</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">42.8%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[10px]">审计检查</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">28.4%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[10px]">史志编研</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">16.3%</div>
                  </div>
                  <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <div className="text-slate-400 text-[10px]">诉讼举证</div>
                    <div className="font-bold text-slate-800 dark:text-slate-200 font-mono mt-0.5">12.5%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: 申请借阅 (Apply for Borrowing) Modal                   */}
      {/* Exact match to user screenshot image_386ee8b6.png:             */}
      {/* - Section 1: 申请借阅的档案 (Table with 移除)                   */}
      {/* - Section 2: 填写借阅单 (All inputs empty upon opening!)        */}
      {/* - Recent dates: DAJY-20261105-001, recent years 2026/2025       */}
      {/* ============================================================== */}
      {isApplyBorrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header: 申请借阅 with X button */}
            <div className="px-6 py-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">申请借阅</h3>
              <button
                onClick={() => setIsApplyBorrowModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmitBorrowApplication} className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Part 1: 申请借阅的档案 */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">申请借阅的档案</h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">序号</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">档案类型</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">档案级别</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">档案形态</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">年度</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">全宗号</th>
                        <th className="py-2.5 px-4 text-center whitespace-nowrap">档号</th>
                        <th className="py-2.5 px-4 min-w-[220px]">题名</th>
                        <th className="py-2.5 px-3 text-center whitespace-nowrap">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {borrowTargetItems.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-slate-400">
                            暂无拟借阅档案，请在借阅档案目录中勾选后点击申请借阅
                          </td>
                        </tr>
                      ) : (
                        borrowTargetItems.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                              {idx + 1}
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              {item.category}
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              {item.level || '文件'}
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              {item.carrierFormat || '实体、电子'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono whitespace-nowrap">
                              {item.year}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {item.fondsNo}
                            </td>
                            <td className="py-2.5 px-4 text-center font-mono text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {item.refCode}
                            </td>
                            <td className="py-2.5 px-4 font-medium text-slate-900 dark:text-slate-100">
                              <div className="line-clamp-2" title={item.title}>
                                {item.title}
                              </div>
                            </td>
                            <td className="py-2.5 px-3 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleRemoveBorrowTargetItem(item.id)}
                                className="text-blue-500 hover:text-blue-700 dark:text-blue-400 hover:underline font-medium"
                              >
                                移除
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part 2: 填写借阅单 (Layout strictly matched to image_386ee8b6.png) */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">填写借阅单</h4>

                {/* Form Row 1: 借阅单号 & 借阅人 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-center">
                  <div className="flex items-center gap-3">
                    <label className="w-20 shrink-0 text-right text-slate-700 dark:text-slate-300">
                      借阅单号:
                    </label>
                    <input
                      type="text"
                      disabled
                      value={applyBorrowForm.borrowNo}
                      className="flex-1 px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono text-xs cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-20 shrink-0 text-right text-slate-700 dark:text-slate-300">
                      借阅人:
                    </label>
                    <input
                      type="text"
                      placeholder="请输入借阅人"
                      value={applyBorrowForm.borrower}
                      onChange={(e) => setApplyBorrowForm({ ...applyBorrowForm, borrower: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden text-xs"
                    />
                  </div>
                </div>

                {/* Form Row 2: 借阅部门 & 借阅类型 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-center">
                  <div className="flex items-center gap-3">
                    <label className="w-20 shrink-0 text-right text-slate-700 dark:text-slate-300">
                      借阅部门:
                    </label>
                    <input
                      type="text"
                      placeholder="请输入借阅部门"
                      value={applyBorrowForm.dept}
                      onChange={(e) => setApplyBorrowForm({ ...applyBorrowForm, dept: e.target.value })}
                      className="flex-1 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-20 shrink-0 text-right text-slate-700 dark:text-slate-300">
                      <span className="text-red-500 mr-0.5">*</span>借阅类型:
                    </label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="borrowTypeRadio"
                          checked={applyBorrowForm.borrowType === '实体档案'}
                          onChange={() => setApplyBorrowForm({ ...applyBorrowForm, borrowType: '实体档案' })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">实体档案</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="borrowTypeRadio"
                          checked={applyBorrowForm.borrowType === '电子档案'}
                          onChange={() => setApplyBorrowForm({ ...applyBorrowForm, borrowType: '电子档案' })}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-slate-700 dark:text-slate-300">电子档案</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Form Row 3: 借阅时间 & 归还时间 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 items-center">
                  <div className="flex items-center gap-3">
                    <label className="w-20 shrink-0 text-right text-slate-700 dark:text-slate-300">
                      <span className="text-red-500 mr-0.5">*</span>借阅时间:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="请选择时间"
                        value={applyBorrowForm.borrowTime}
                        onChange={(e) => setApplyBorrowForm({ ...applyBorrowForm, borrowTime: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setApplyBorrowForm({ ...applyBorrowForm, borrowTime: '2026-11-05' })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 hover:text-blue-700 font-mono"
                      >
                        今日(11-05)
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="w-20 shrink-0 text-right text-slate-700 dark:text-slate-300">
                      <span className="text-red-500 mr-0.5">*</span>归还时间:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="请选择时间"
                        value={applyBorrowForm.returnTime}
                        onChange={(e) => setApplyBorrowForm({ ...applyBorrowForm, returnTime: e.target.value })}
                        className="w-full px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => setApplyBorrowForm({ ...applyBorrowForm, returnTime: '2026-11-12' })}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-blue-500 hover:text-blue-700 font-mono"
                      >
                        7天后(11-12)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Row 4: 借阅目的 */}
                <div className="flex items-start gap-3">
                  <label className="w-20 shrink-0 text-right text-slate-700 dark:text-slate-300 pt-1.5">
                    <span className="text-red-500 mr-0.5">*</span>借阅目的:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="请输入借阅目的"
                    value={applyBorrowForm.purpose}
                    onChange={(e) => setApplyBorrowForm({ ...applyBorrowForm, purpose: e.target.value })}
                    className="flex-1 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden text-xs"
                  />
                </div>

                {/* Form Row 5: 备注 */}
                <div className="flex items-start gap-3">
                  <label className="w-20 shrink-0 text-right text-slate-700 dark:text-slate-300 pt-1.5">
                    备注:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="选填"
                    value={applyBorrowForm.remark}
                    onChange={(e) => setApplyBorrowForm({ ...applyBorrowForm, remark: e.target.value })}
                    className="flex-1 px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden text-xs"
                  />
                </div>
              </div>

              {/* Bottom Actions matching screenshot: [确定] [取消] centered */}
              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  type="submit"
                  className="px-6 py-1.5 rounded bg-blue-500 hover:bg-blue-600 text-white font-medium text-xs shadow-xs transition-colors"
                >
                  确定
                </button>
                <button
                  type="button"
                  onClick={() => setIsApplyBorrowModalOpen(false)}
                  className="px-6 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: 高级检索 Modal (Advanced Search)                        */}
      {/* ============================================================== */}
      {isAdvancedSearchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">档案目录高级组合检索</h3>
              </div>
              <button
                onClick={() => setIsAdvancedSearchOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">题名关键字</label>
                <input
                  type="text"
                  placeholder="输入题名精确或模糊词..."
                  value={advancedSearchParams.title}
                  onChange={(e) => setAdvancedSearchParams({ ...advancedSearchParams, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">档号</label>
                  <input
                    type="text"
                    placeholder="例如: 0110-WS·2026..."
                    value={advancedSearchParams.refCode}
                    onChange={(e) => setAdvancedSearchParams({ ...advancedSearchParams, refCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">文件发文字号</label>
                  <input
                    type="text"
                    placeholder="例如: 成府发〔2026〕..."
                    value={advancedSearchParams.docNo}
                    onChange={(e) => setAdvancedSearchParams({ ...advancedSearchParams, docNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">全宗号</label>
                  <input
                    type="text"
                    placeholder="0110"
                    value={advancedSearchParams.fondsNo}
                    onChange={(e) => setAdvancedSearchParams({ ...advancedSearchParams, fondsNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">密级限制</label>
                  <select
                    value={advancedSearchParams.securityLevel}
                    onChange={(e) => setAdvancedSearchParams({ ...advancedSearchParams, securityLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                  >
                    <option value="全部">全部密级</option>
                    <option value="公开">公开</option>
                    <option value="内部">内部</option>
                    <option value="秘密">秘密</option>
                    <option value="机密">机密</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">保管期限</label>
                  <select
                    value={advancedSearchParams.retention}
                    onChange={(e) => setAdvancedSearchParams({ ...advancedSearchParams, retention: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-hidden"
                  >
                    <option value="全部">全部期限</option>
                    <option value="10年">10年</option>
                    <option value="30年">30年</option>
                    <option value="永久">永久</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setAdvancedSearchParams({
                      title: '',
                      refCode: '',
                      docNo: '',
                      fondsNo: '',
                      startYear: '',
                      endYear: '',
                      securityLevel: '全部',
                      retention: '全部',
                    })
                  }
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  重置条件
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAdvancedSearchOpen(false)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50"
                  >
                    取消
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdvancedSearchOpen(false);
                      setCatalogPage(1);
                      onShowMessage('高级组合检索条件已生效');
                    }}
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
                  >
                    应用检索
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: 审批办理弹窗 (Approval Process Modal)                  */}
      {/* ============================================================== */}
      {/* ============================================================== */}
      {/* MODAL 1: 借阅审批 - 同意授权弹窗                                */}
      {/* ============================================================== */}
      {isApproveAgreeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">借阅审批 - 准予借阅签发</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApproveAgreeModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-1.5">
                <div className="font-semibold text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
                  <span>拟批准借阅申请 ({selectedPendingIds.length} 项)</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                    审批状态: 准予借阅
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 max-h-24 overflow-y-auto space-y-1">
                  {pendingApprovalList
                    .filter((item) => selectedPendingIds.includes(item.id))
                    .map((item) => (
                      <div key={item.id} className="font-mono text-[11px] truncate">
                        • [{item.borrowNo}] {item.applicant} ({item.dept}) - {item.archiveTitle}
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  电子档案下发权限
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['浏览、下载', '浏览', '---'] as const).map((perm) => (
                    <button
                      key={perm}
                      type="button"
                      onClick={() => setAgreeEPermission(perm)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        agreeEPermission === perm
                          ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/20 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {perm}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  安全防伪与溯源策略
                </label>
                <select
                  value={agreeWatermark}
                  onChange={(e) => setAgreeWatermark(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="动态防伪盲水印（附借阅人工号+查阅时间戳）">
                    动态防伪盲水印（附借阅人工号+查阅时间戳+防截屏打印）
                  </option>
                  <option value="国密数字证书脱密阅读器（限定局域网终端）">
                    国密数字证书脱密阅读器（限定局域网专用终端）
                  </option>
                  <option value="纸质原件库房当面验视放行单">纸质原件库房当面验视放行单</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  审批批注与准予意见
                </label>
                <textarea
                  rows={2}
                  value={agreeComment}
                  onChange={(e) => setAgreeComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApproveAgreeModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAgree}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  确认同意并签发
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: 借阅审批 - 不同意驳回弹窗                              */}
      {/* ============================================================== */}
      {isApproveRejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-red-50/50 dark:bg-red-950/20">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">借阅审批 - 驳回借阅申请</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsApproveRejectModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/30 dark:bg-red-950/20 space-y-1.5">
                <div className="font-semibold text-red-900 dark:text-red-200 flex items-center justify-between">
                  <span>拟驳回申请 ({selectedPendingIds.length} 项)</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
                    审批状态: 驳回不予借阅
                  </span>
                </div>
                <div className="text-slate-600 dark:text-slate-400 max-h-24 overflow-y-auto space-y-1">
                  {pendingApprovalList
                    .filter((item) => selectedPendingIds.includes(item.id))
                    .map((item) => (
                      <div key={item.id} className="font-mono text-[11px] truncate">
                        • [{item.borrowNo}] {item.applicant} ({item.dept}) - {item.archiveTitle}
                      </div>
                    ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  驳回原因分类
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    '不同意(敏感文件)',
                    '不同意(权限受限)',
                    '不同意(材料不全)',
                    '不同意(非业务归口)',
                  ].map((reason) => (
                    <button
                      key={reason}
                      type="button"
                      onClick={() => setRejectReason(reason)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium text-left transition-colors ${
                        rejectReason === reason
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 ring-2 ring-red-500/20 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  详细驳回理由说明
                </label>
                <textarea
                  rows={3}
                  value={rejectComment}
                  onChange={(e) => setRejectComment(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsApproveRejectModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-xs"
                >
                  确认驳回申请
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: 借阅审批 - 查看档案详情弹窗                            */}
      {/* ============================================================== */}
      {detailApprovalRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">借阅审批 - 档案卷宗详情全貌</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailApprovalRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20">
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  {detailApprovalRecord.archiveTitle}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  <div>档号: <span className="font-semibold text-blue-600">{detailApprovalRecord.archiveRefCode}</span></div>
                  <div>全宗号: {detailApprovalRecord.fondsNo || '0110'}</div>
                  <div>档案门类: {detailApprovalRecord.category || '文书档案'}</div>
                  <div>密级: {detailApprovalRecord.securityLevel || '机密'}</div>
                  <div>保管期限: {detailApprovalRecord.retention || '永久'}</div>
                  <div>总页数: {detailApprovalRecord.pageCount || 16} 页</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>借阅流转单信息</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                  <div>借阅单号: <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{detailApprovalRecord.borrowNo}</span></div>
                  <div>申请借阅人: <span className="font-semibold text-slate-900 dark:text-slate-100">{detailApprovalRecord.applicant}</span></div>
                  <div>所属部门: {detailApprovalRecord.dept}</div>
                  <div>借阅类型: <span className="font-semibold">{detailApprovalRecord.borrowType}</span></div>
                  <div>借阅时间: {detailApprovalRecord.borrowTime}</div>
                  <div>应还时间: {detailApprovalRecord.returnTime}</div>
                  <div>电子文件权限: {detailApprovalRecord.ePermission || '---'}</div>
                  <div>当前状态: <span className="font-bold text-blue-600">{detailApprovalRecord.status}</span></div>
                  <div className="col-span-2">借阅目的: <span className="text-slate-900 dark:text-slate-100">{detailApprovalRecord.purpose}</span></div>
                  <div className="col-span-2">备注说明: <span className="text-slate-500">{detailApprovalRecord.remark || '无'}</span></div>
                </div>
              </div>

              {detailApprovalRecord.approveResult && (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-white">审批办结记录</div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                    <div>审批结果: <span className="font-bold text-emerald-600">{detailApprovalRecord.approveResult}</span></div>
                    <div>签批人员: {detailApprovalRecord.approver || '郭海波 (利用审批岗)'}</div>
                    <div>签批时间: {detailApprovalRecord.approveTime || '2026-11-05 16:30'}</div>
                    <div className="col-span-2">签批意见: {detailApprovalRecord.approveComment || '经核验符合规定，准予借阅。'}</div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="text-xs text-slate-500">
                盛京智慧档案利用全过程审计跟踪中
              </div>
              <div className="flex items-center gap-2">
                {detailApprovalRecord.status === '待审批' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenAgreeModal(detailApprovalRecord);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                    >
                      同意借阅
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenRejectModal(detailApprovalRecord);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-xs"
                    >
                      驳回申请
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onShowMessage(`已调取单据 [${detailApprovalRecord.borrowNo}] 完整电子套印凭证`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-100"
                >
                  打印凭单
                </button>
                <button
                  type="button"
                  onClick={() => setDetailApprovalRecord(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 text-xs font-semibold"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: 归还管理 - 办理档案归还入库查验弹窗                      */}
      {/* ============================================================== */}
      {isReturnProcessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/20">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">档案利用 - 办理归还入库查验</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsReturnProcessModalOpen(false);
                  setReturnTargetItem(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {returnTargetItem ? returnTargetItem.archiveTitle : `共选定 ${selectedReturnIds.length} 卷档案`}
                </div>
                {returnTargetItem && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    <div>借阅单号: {returnTargetItem.borrowNo}</div>
                    <div>档号: {returnTargetItem.archiveRefCode}</div>
                    <div>借阅人: {returnTargetItem.borrower} ({returnTargetItem.dept})</div>
                    <div>借阅方式: {returnTargetItem.borrowType}</div>
                    <div>借出时间: {returnTargetItem.borrowTime}</div>
                    <div>应还时间: {returnTargetItem.expectedReturnTime}</div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  物理外观与完整性查验结论
                </label>
                <select
                  value={returnIntegrity}
                  onChange={(e) => setReturnIntegrity(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="完好无损，无破损涂画缺页">完好无损，无破损涂画缺页 (合格入库归架)</option>
                  <option value="电子借阅权限到期安全注销回收">电子借阅权限到期安全注销回收 (权限闭环注销)</option>
                  <option value="经技术除尘与整理后归架">经技术除尘与整理后归架</option>
                  <option value="存在轻微装订磨损已修护加固">存在轻微装订磨损已修护加固</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    验收入库保管员
                  </label>
                  <input
                    type="text"
                    value={returnInspector}
                    onChange={(e) => setReturnInspector(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    入库指定库位
                  </label>
                  <input
                    type="text"
                    value={returnStorageLocation}
                    onChange={(e) => setReturnStorageLocation(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  查验入库登记说明
                </label>
                <textarea
                  rows={2}
                  value={returnRemark}
                  onChange={(e) => setReturnRemark(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsReturnProcessModalOpen(false);
                    setReturnTargetItem(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReturn}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                >
                  确认查验入库并归还
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: 归还管理 - 借阅续借申请/办理弹窗                         */}
      {/* ============================================================== */}
      {isRenewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">档案利用 - 借阅续期办理</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsRenewModalOpen(false);
                  setRenewTargetItem(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                <div className="font-semibold text-slate-900 dark:text-slate-100">
                  {renewTargetItem ? renewTargetItem.archiveTitle : `共办理 ${selectedReturnIds.length} 项档案续借`}
                </div>
                {renewTargetItem && (
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400 font-mono text-[11px]">
                    <div>借阅单号: {renewTargetItem.borrowNo}</div>
                    <div>借阅人: {renewTargetItem.borrower} ({renewTargetItem.dept})</div>
                    <div>原归还日期: <span className="text-amber-600 font-bold">{renewTargetItem.expectedReturnTime}</span></div>
                    <div>借阅类型: {renewTargetItem.borrowType}</div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  快捷延长周期
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { days: 7, label: '+7天 (顺延一周)', date: '2026-11-19' },
                    { days: 15, label: '+15天 (半个月)', date: '2026-11-27' },
                    { days: 30, label: '+30天 (一个月)', date: '2026-12-12' },
                  ].map((preset) => (
                    <button
                      key={preset.days}
                      type="button"
                      onClick={() => {
                        setRenewExtendDays(preset.days);
                        setRenewNewDate(preset.date);
                      }}
                      className={`py-2 px-3 rounded-lg border text-xs transition-colors ${
                        renewExtendDays === preset.days
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-2 ring-blue-500/20 font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    新延期归还时间
                  </label>
                  <input
                    type="date"
                    value={renewNewDate}
                    onChange={(e) => setRenewNewDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    续借审批责任人
                  </label>
                  <input
                    type="text"
                    value={renewApprover}
                    onChange={(e) => setRenewApprover(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  续借正当事由说明
                </label>
                <textarea
                  rows={2}
                  value={renewReason}
                  onChange={(e) => setRenewReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRenewModalOpen(false);
                    setRenewTargetItem(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmRenew}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
                >
                  确认办理续借
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 6: 归还管理 - 查看档案详情弹窗                            */}
      {/* ============================================================== */}
      {detailReturnRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">借阅与归还档案详情全貌</h3>
              </div>
              <button
                type="button"
                onClick={() => setDetailReturnRecord(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20">
                <div className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  {detailReturnRecord.archiveTitle}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-[11px] text-slate-600 dark:text-slate-300">
                  <div>档号: <span className="font-semibold text-blue-600">{detailReturnRecord.archiveRefCode}</span></div>
                  <div>全宗号: {detailReturnRecord.fondsNo || '0110'}</div>
                  <div>档案门类: {detailReturnRecord.category}</div>
                  <div>归档年度: {detailReturnRecord.year}年</div>
                  <div>密级: {detailReturnRecord.securityLevel || '内部'}</div>
                  <div>保管期限: {detailReturnRecord.retention || '30年'}</div>
                  <div>总页数: {detailReturnRecord.pageCount || 20} 页</div>
                  <div>存放库位: {detailReturnRecord.location || '1号智能库房-02架-03层'}</div>
                  <div>发文字号: {detailReturnRecord.docNo || '盛能发〔2026〕012号'}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-blue-600" />
                  <span>借阅及归还管理详情</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-slate-600 dark:text-slate-300">
                  <div>借阅单号: <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{detailReturnRecord.borrowNo}</span></div>
                  <div>借阅人: <span className="font-semibold text-slate-900 dark:text-slate-100">{detailReturnRecord.borrower}</span></div>
                  <div>借阅部门: {detailReturnRecord.dept}</div>
                  <div>借阅类型: <span className="font-semibold">{detailReturnRecord.borrowType}</span></div>
                  <div>借阅时间: {detailReturnRecord.borrowTime}</div>
                  <div>应还时间: <span className="font-semibold text-amber-600">{detailReturnRecord.expectedReturnTime}</span></div>
                  {detailReturnRecord.actualReturnTime && (
                    <div>实际归还: <span className="font-bold text-emerald-600">{detailReturnRecord.actualReturnTime}</span></div>
                  )}
                  <div>归还状态: <span className="font-bold text-blue-600">{detailReturnRecord.status}</span></div>
                  <div>电子文件权限: {detailReturnRecord.ePermission}</div>
                  {detailReturnRecord.returnInspector && (
                    <div>验收入库人: {detailReturnRecord.returnInspector}</div>
                  )}
                  <div className="col-span-2">借阅目的: <span className="text-slate-900 dark:text-slate-100">{detailReturnRecord.purpose}</span></div>
                  <div className="col-span-2">备注: <span className="text-slate-500">{detailReturnRecord.remark}</span></div>
                </div>
              </div>

              {detailReturnRecord.returnCondition && (
                <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-1.5">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200">归还验收与闭环结论</div>
                  <div className="text-slate-700 dark:text-slate-300">
                    查验结论：{detailReturnRecord.returnCondition}
                  </div>
                  <div className="text-slate-500 font-mono text-[11px]">
                    入库位置：{detailReturnRecord.location || '1号智能库房-03排-02架-04层'}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
              <div className="text-xs text-slate-500">
                档案借还闭环安全体系
              </div>
              <div className="flex items-center gap-2">
                {detailReturnRecord.status !== '已归还' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenReturnModal(detailReturnRecord);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 shadow-xs"
                    >
                      办理归还
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleOpenRenewModal(detailReturnRecord);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
                    >
                      办理续借
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => onShowMessage(`已调取归还单据 [${detailReturnRecord.borrowNo}] 台账登记簿`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium hover:bg-slate-100"
                >
                  打印台账
                </button>
                <button
                  type="button"
                  onClick={() => setDetailReturnRecord(null)}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900 text-xs font-semibold"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
