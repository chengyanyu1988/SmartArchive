import React, { useState } from 'react';
import {
  Building2,
  Thermometer,
  ShieldCheck,
  RefreshCw,
  Layers,
  Download,
  CheckCircle2,
  Eye,
  ClipboardCheck,
  PieChart,
  BarChart3,
  Search,
  Plus,
  Sliders,
  AlertTriangle,
  Lightbulb,
  Lock,
  Unlock,
  Wind,
  FileText,
  User,
  MapPin,
  TrendingUp,
  Box,
  Radio,
  FileCheck,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Folder,
  FolderOpen,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Calendar,
  Save,
  Tag,
  Printer,
  FileSpreadsheet,
  Edit,
  Trash2,
  Cpu,
  Inbox,
  LogOut,
  LogIn,
  RotateCcw,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';
import { NavigationModule } from '../types/archive';

interface RepositoryManageViewProps {
  submodule?: 'repo_manage' | 'repo_browse' | 'repo_daily' | 'repo_stats';
  onNavigate?: (module: NavigationModule) => void;
  onShowMessage: (msg: string) => void;
}

// 库房分类树节点定义
interface RepoTreeNode {
  id: string;
  repoCode: string; // 编号，如 "11"
  name: string;     // 如 "文书档案库房"
  fullName: string; // 如 "文书档案库房（编号11）"
  shortName: string;// 如 "文书库房"
  categoryLabel: string; // "文书档案"
  manager: string;  // 库房管理员
  remarks: string;  // 备注
  totalRacks: number;   // 档案架数量
  totalGrids: number;   // 总格位数量
  totalBoxes: number;   // 总档案盒数
  storedCount: string;  // 存放量 (如 "420,800 卷")
}

const repoTreeNodes: RepoTreeNode[] = [
  {
    id: 'repo-11',
    repoCode: '11',
    name: '文书档案库房',
    fullName: '文书档案库房（编号11）',
    shortName: '文书库房',
    categoryLabel: '文书档案',
    manager: '王建华',
    remarks: '恒温恒湿特种纸质公文库房，配备微环境传感器及七氟丙烷气体灭火系统',
    totalRacks: 16,
    totalGrids: 480,
    totalBoxes: 8640,
    storedCount: '420,800 卷',
  },
  {
    id: 'repo-12',
    repoCode: '12',
    name: '会计档案库房',
    fullName: '会计档案库房（编号12）',
    shortName: '会计库房',
    categoryLabel: '会计档案',
    manager: '李志强',
    remarks: '财务凭证、年度审计报告、收支流水账簿专用库区，独立排架密集柜，配置全自动除湿机组',
    totalRacks: 14,
    totalGrids: 420,
    totalBoxes: 6200,
    storedCount: '180,200 卷',
  },
  {
    id: 'repo-13',
    repoCode: '13',
    name: '基建档案库房',
    fullName: '基建档案库房（编号13）',
    shortName: '基建库房',
    categoryLabel: '基建档案',
    manager: '陈海峰',
    remarks: '重大工程竣工图纸、科技规划蓝图平放柜库区，避光恒湿，防震防虫专用储藏',
    totalRacks: 20,
    totalGrids: 600,
    totalBoxes: 9500,
    storedCount: '241,000 卷',
  },
  {
    id: 'repo-14',
    repoCode: '14',
    name: '设备档案库房',
    fullName: '设备档案库房（编号14）',
    shortName: '设备库房',
    categoryLabel: '设备档案',
    manager: '郑慧敏',
    remarks: '机电仪器设备说明书、PLC智能控制系统电气图样与特种设备检验合格资质留存库',
    totalRacks: 10,
    totalGrids: 300,
    totalBoxes: 3800,
    storedCount: '95,000 卷',
  },
  {
    id: 'repo-15',
    repoCode: '15',
    name: '照片档案库房',
    fullName: '照片档案库房（编号15）',
    shortName: '照片库房',
    categoryLabel: '照片档案',
    manager: '周雅婷',
    remarks: '特种低温防酸冷柜运行，恒定控制在15°C/35%RH，专用无酸纸袋保护珍贵历史照片原底',
    totalRacks: 8,
    totalGrids: 240,
    totalBoxes: 4200,
    storedCount: '310,500 张',
  },
  {
    id: 'repo-16',
    repoCode: '16',
    name: '声像档案库房',
    fullName: '声像档案库房（编号16）',
    shortName: '声像库房',
    categoryLabel: '声像档案',
    manager: '孙培强',
    remarks: '专业防磁屏蔽机柜库区，电磁屏蔽效能达到国家B级标准，恒温避光储藏磁带、光盘及数字硬盘',
    totalRacks: 8,
    totalGrids: 240,
    totalBoxes: 2600,
    storedCount: '42,000 盘',
  },
  {
    id: 'repo-17',
    repoCode: '17',
    name: '实物档案库房',
    fullName: '实物档案库房（编号17）',
    shortName: '实物库房',
    categoryLabel: '实物档案',
    manager: '钱学亮',
    remarks: '充氮防弹恒湿密封柜，高纯度氮气保护金质奖牌、锦旗印章与外事互赠纪念品实物',
    totalRacks: 6,
    totalGrids: 180,
    totalBoxes: 1200,
    storedCount: '8,520 件',
  },
];

// 密集架定义
interface RackColumn {
  rackNo: string;
  sideA: string;
  sideB: string;
}

const mockRackColumns: RackColumn[] = [
  { rackNo: '005', sideA: '005架 A', sideB: '005架 B' },
  { rackNo: '006', sideA: '006架 A', sideB: '006架 B' },
  { rackNo: '007', sideA: '007架 A', sideB: '007架 B' },
  { rackNo: '008', sideA: '008架 A', sideB: '008架 B' },
  { rackNo: '009', sideA: '009架 A', sideB: '009架 B' },
];

// 1. 库房管理-上架与排架档案记录
interface RepoArchiveRecord {
  id: string;
  repoCode: string;
  status: '已上架' | '待上架';
  fondsNo: string;
  year: string;
  boxNo: number;
  archiveNo: string;
  title: string;
  location: string;
  rackCode: string;
  operator: string;
  operateTime: string;
}

// 2. 库房浏览-流转流水记录 (上架/下架/出库/入库)
interface RepoLogRecord {
  id: string;
  repoCode: string;
  action: '上架' | '下架' | '出库' | '入库';
  operator: string;
  operateTime: string;
  fondsNo: string;
  year: string;
  boxNo: number;
  archiveNo: string;
  title: string;
  location: string;
  reason?: string;
  borrower?: string;
  dept?: string;
}

// 3. 日常管理/浏览 - 温湿度登记数据结构 (对应截图1)
interface TempHumidityRecord {
  id: string;
  repoCode: string;
  time: string;          // 时间 (近期2026年11月)
  recorder: string;      // 记录人 (真实姓名，严禁张三)
  indoorTemp: number;    // 室内温度 (°C)
  indoorHumidity: number;// 室内湿度 (% RH)
  outdoorTemp: number;   // 室外温度 (°C)
  outdoorHumidity: number;// 室外湿度 (% RH)
  remarks?: string;
}

// 4. 日常管理/浏览 - 日常情况检查数据结构 (对应截图2)
interface DailyInspectionRecord {
  id: string;
  repoCode: string;
  checkTime: string;     // 检查时间 (近期2026年11月)
  checker: string;       // 检查人 (真实姓名)
  archiveNo: string;     // 档号
  title: string;         // 题名 (真实题名，严禁关于XX的通知)
  location: string;      // 库房位置
  archiveType: string;   // 档案类型 (文书档案、会计档案...)
  storageStatus: string; // 存储状态 (完好、正常)
  issueItem: string;     // 问题项 (无异常、微偏已调、滤网需清、防尘排查正常)
}

// 5. 日常管理/浏览 - 库房设备登记数据结构 (对应截图3)
interface RepoDeviceRecord {
  id: string;
  repoCode: string;
  regTime: string;       // 登记时间 (近期2026年11月)
  registrant: string;    // 登记人 (真实姓名)
  deviceName: string;    // 设备名称
  quantity: number;      // 数量
  remarks: string;       // 备注
}

// 6. 库房统计 - 密集架与库容资产明细数据结构
export interface RackStatisticItem {
  id: string;
  repoCode: string;          // 11 ~ 17
  repoName: string;          // 文书档案库房, 会计档案库房...
  rackCode: string;          // 001架, 002架...
  rackType: string;          // 智能电动密集架, 恒温恒湿特藏架, 防磁安全柜, 充氮标本展柜
  totalSlots: number;        // 总格位数 (72, 96, 120, 144)
  usedSlots: number;         // 已用格位
  boxCount: number;          // 存放档案盒数
  volumeCount: number;       // 在库卷数
  usageRate: number;         // 负荷率 (百分比)
  tempReading: string;       // 19.4℃
  humidityReading: string;   // 52%RH
  rfidCoverage: string;      // 100%
  envStatus: '恒温恒湿' | '正常' | '适宜' | '低温冷藏' | '防磁屏蔽' | '充氮密封';
  safetyCheck: '已安防巡检' | '实时布防';
  manager: string;           // 责任人
  lastAuditTime: string;     // 盘点时间
}

const initialRackStatsList: RackStatisticItem[] = [
  // 11 文书档案库房 (4条)
  { id: 'rk-11-01', repoCode: '11', repoName: '文书档案库房', rackCode: '001架', rackType: '智能电动密集架', totalSlots: 144, usedSlots: 128, boxCount: 1280, volumeCount: 3840, usageRate: 88.9, tempReading: '19.4℃', humidityReading: '52%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '王建华', lastAuditTime: '2026-11-06 09:30' },
  { id: 'rk-11-02', repoCode: '11', repoName: '文书档案库房', rackCode: '002架', rackType: '智能电动密集架', totalSlots: 144, usedSlots: 115, boxCount: 1150, volumeCount: 3450, usageRate: 79.8, tempReading: '19.6℃', humidityReading: '51%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '王建华', lastAuditTime: '2026-11-06 09:30' },
  { id: 'rk-11-03', repoCode: '11', repoName: '文书档案库房', rackCode: '003架', rackType: '智能电动密集架', totalSlots: 144, usedSlots: 102, boxCount: 1020, volumeCount: 3060, usageRate: 70.8, tempReading: '19.5℃', humidityReading: '53%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '王建华', lastAuditTime: '2026-11-05 16:40' },
  { id: 'rk-11-04', repoCode: '11', repoName: '文书档案库房', rackCode: '004架', rackType: '智能电动密集架', totalSlots: 144, usedSlots: 90, boxCount: 900, volumeCount: 2700, usageRate: 62.5, tempReading: '19.3℃', humidityReading: '52%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '王建华', lastAuditTime: '2026-11-05 16:40' },

  // 12 会计档案库房 (3条)
  { id: 'rk-12-01', repoCode: '12', repoName: '会计档案库房', rackCode: '001架', rackType: '智能电动密集架', totalSlots: 120, usedSlots: 106, boxCount: 1060, volumeCount: 3180, usageRate: 88.3, tempReading: '20.1℃', humidityReading: '48%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '李志强', lastAuditTime: '2026-11-06 10:15' },
  { id: 'rk-12-02', repoCode: '12', repoName: '会计档案库房', rackCode: '002架', rackType: '智能电动密集架', totalSlots: 120, usedSlots: 95, boxCount: 950, volumeCount: 2850, usageRate: 79.1, tempReading: '20.0℃', humidityReading: '49%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '李志强', lastAuditTime: '2026-11-06 10:15' },
  { id: 'rk-12-03', repoCode: '12', repoName: '会计档案库房', rackCode: '003架', rackType: '智能电动密集架', totalSlots: 120, usedSlots: 84, boxCount: 840, volumeCount: 2520, usageRate: 70.0, tempReading: '20.2℃', humidityReading: '47%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '李志强', lastAuditTime: '2026-11-05 14:20' },

  // 13 基建档案库房 (3条)
  { id: 'rk-13-01', repoCode: '13', repoName: '基建档案库房', rackCode: '001架', rackType: '大承重加宽图纸密集架', totalSlots: 96, usedSlots: 82, boxCount: 820, volumeCount: 2460, usageRate: 85.4, tempReading: '19.8℃', humidityReading: '50%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '陈海峰', lastAuditTime: '2026-11-06 09:50' },
  { id: 'rk-13-02', repoCode: '13', repoName: '基建档案库房', rackCode: '002架', rackType: '大承重加宽图纸密集架', totalSlots: 96, usedSlots: 75, boxCount: 750, volumeCount: 2250, usageRate: 78.1, tempReading: '19.7℃', humidityReading: '51%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '陈海峰', lastAuditTime: '2026-11-06 09:50' },
  { id: 'rk-13-03', repoCode: '13', repoName: '基建档案库房', rackCode: '003架', rackType: '大承重加宽图纸密集架', totalSlots: 96, usedSlots: 64, boxCount: 640, volumeCount: 1920, usageRate: 66.7, tempReading: '19.9℃', humidityReading: '49%RH', rfidCoverage: '100%', envStatus: '恒温恒湿', safetyCheck: '已安防巡检', manager: '陈海峰', lastAuditTime: '2026-11-05 15:30' },

  // 14 设备档案库房 (3条)
  { id: 'rk-14-01', repoCode: '14', repoName: '设备档案库房', rackCode: '001架', rackType: '仪器技术档案组合架', totalSlots: 96, usedSlots: 65, boxCount: 650, volumeCount: 1950, usageRate: 67.7, tempReading: '20.5℃', humidityReading: '46%RH', rfidCoverage: '100%', envStatus: '适宜', safetyCheck: '已安防巡检', manager: '郑慧敏', lastAuditTime: '2026-11-06 10:40' },
  { id: 'rk-14-02', repoCode: '14', repoName: '设备档案库房', rackCode: '002架', rackType: '仪器技术档案组合架', totalSlots: 96, usedSlots: 58, boxCount: 580, volumeCount: 1740, usageRate: 60.4, tempReading: '20.4℃', humidityReading: '45%RH', rfidCoverage: '100%', envStatus: '适宜', safetyCheck: '已安防巡检', manager: '郑慧敏', lastAuditTime: '2026-11-06 10:40' },
  { id: 'rk-14-03', repoCode: '14', repoName: '设备档案库房', rackCode: '003架', rackType: '仪器技术档案组合架', totalSlots: 96, usedSlots: 50, boxCount: 500, volumeCount: 1500, usageRate: 52.1, tempReading: '20.6℃', humidityReading: '47%RH', rfidCoverage: '100%', envStatus: '适宜', safetyCheck: '已安防巡检', manager: '郑慧敏', lastAuditTime: '2026-11-05 11:20' },

  // 15 照片档案库房 (2条)
  { id: 'rk-15-01', repoCode: '15', repoName: '照片档案库房', rackCode: '001架', rackType: '低温特藏无酸纸排架', totalSlots: 72, usedSlots: 60, boxCount: 600, volumeCount: 1800, usageRate: 83.3, tempReading: '14.5℃', humidityReading: '38%RH', rfidCoverage: '100%', envStatus: '低温冷藏', safetyCheck: '已安防巡检', manager: '周雅婷', lastAuditTime: '2026-11-06 11:10' },
  { id: 'rk-15-02', repoCode: '15', repoName: '照片档案库房', rackCode: '002架', rackType: '低温特藏无酸纸排架', totalSlots: 72, usedSlots: 52, boxCount: 520, volumeCount: 1560, usageRate: 72.2, tempReading: '14.2℃', humidityReading: '39%RH', rfidCoverage: '100%', envStatus: '低温冷藏', safetyCheck: '已安防巡检', manager: '周雅婷', lastAuditTime: '2026-11-06 11:10' },

  // 16 声像档案库房 (2条)
  { id: 'rk-16-01', repoCode: '16', repoName: '声像档案库房', rackCode: '001架', rackType: '防磁屏蔽特种档案架', totalSlots: 72, usedSlots: 36, boxCount: 360, volumeCount: 1080, usageRate: 50.0, tempReading: '18.2℃', humidityReading: '42%RH', rfidCoverage: '100%', envStatus: '防磁屏蔽', safetyCheck: '已安防巡检', manager: '孙培强', lastAuditTime: '2026-11-06 10:20' },
  { id: 'rk-16-02', repoCode: '16', repoName: '声像档案库房', rackCode: '002架', rackType: '防磁屏蔽特种档案架', totalSlots: 72, usedSlots: 30, boxCount: 300, volumeCount: 900, usageRate: 41.7, tempReading: '18.0℃', humidityReading: '40%RH', rfidCoverage: '100%', envStatus: '防磁屏蔽', safetyCheck: '已安防巡检', manager: '孙培强', lastAuditTime: '2026-11-06 10:20' },

  // 17 实物档案库房 (2条)
  { id: 'rk-17-01', repoCode: '17', repoName: '实物档案库房', rackCode: '001架', rackType: '充氮密封恒湿实物展存柜', totalSlots: 60, usedSlots: 32, boxCount: 320, volumeCount: 320, usageRate: 53.3, tempReading: '19.0℃', humidityReading: '45%RH', rfidCoverage: '100%', envStatus: '充氮密封', safetyCheck: '已安防巡检', manager: '钱学亮', lastAuditTime: '2026-11-06 10:55' },
  { id: 'rk-17-02', repoCode: '17', repoName: '实物档案库房', rackCode: '002架', rackType: '充氮密封恒湿实物展存柜', totalSlots: 60, usedSlots: 28, boxCount: 280, volumeCount: 280, usageRate: 46.7, tempReading: '19.1℃', humidityReading: '44%RH', rfidCoverage: '100%', envStatus: '充氮密封', safetyCheck: '已安防巡检', manager: '钱学亮', lastAuditTime: '2026-11-06 10:55' },
];

export const RepositoryManageView: React.FC<RepositoryManageViewProps> = ({
  submodule = 'repo_manage',
  onNavigate,
  onShowMessage,
}) => {
  // 当前子模块状态 (支持与侧边栏双向联动)
  const [currentSubTab, setCurrentSubTab] = useState<'repo_manage' | 'repo_browse' | 'repo_daily' | 'repo_stats'>(submodule);

  // 左侧树导航当前选中的库房 (默认 11: 文书档案库房)
  const [selectedTreeRepoCode, setSelectedTreeRepoCode] = useState<string>('11');

  // ================= 1. 库房管理 (repo_manage) 状态 =================
  const [selectedRackSide, setSelectedRackSide] = useState<string>('001架A');
  const [shelfTab, setShelfTab] = useState<'已上架' | '待上架'>('已上架');
  const [managePage, setManagePage] = useState<number>(1);
  const PAGE_SIZE = 10;

  // 7个库房各自独立的真实排架数据：每个库房均生成 10 条已上架 + 2 条待上架数据，表格严格对齐
  const [manageArchives, setManageArchives] = useState<RepoArchiveRecord[]>([
    // === 11: 文书档案库房 (已上架 10 条，待上架 2 条) ===
    { id: 'ma-11-01', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-WS-2026-Y-BGS-0001', title: '关于成立成都市就业工作领导小组的通知', location: '11-155A-1-1-2', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-06 14:00' },
    { id: 'ma-11-02', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-WS-2026-Y-BGS-0002', title: '关于印发成都市智慧蓉城数字档案中枢建设技术标准的通知', location: '11-155A-1-1-3', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-06 14:10' },
    { id: 'ma-11-03', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 2, archiveNo: '0110-WS-2026-Y-BGS-0003', title: '成都市推进产业园区数字化改造工程专家论证会纪要', location: '11-155A-1-2-1', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-05 11:20' },
    { id: 'ma-11-04', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-WS-2025-Y-BGS-0015', title: '成都市大数据协同中心网络安全防护及应急预案工作总结', location: '11-155A-1-2-2', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-05 11:30' },
    { id: 'ma-11-05', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-WS-2025-Y-BGS-0028', title: '关于高新技术企业梯度培育攻坚三年行动计划申报卷', location: '11-155A-2-1-1', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-04 15:40' },
    { id: 'ma-11-06', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-WS-2025-Y-BGS-0036', title: '成都市城市地下综合管廊一期工程消防与安全专项验收报告', location: '11-155A-2-1-2', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-04 16:00' },
    { id: 'ma-11-07', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-WS-2024-Y-BGS-0042', title: '市直机关精神文明建设与效能目标综合考核评估指标汇编', location: '11-155A-2-2-1', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-03 09:30' },
    { id: 'ma-11-08', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-WS-2024-Y-BGS-0050', title: '天府国际机场通航重要里程碑纪实摄影照片集全套档案', location: '11-155A-2-2-2', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-03 10:15' },
    { id: 'ma-11-09', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-WS-2024-Y-BGS-0063', title: '成都市深化现代服务业高质量发展财政贴息及奖补申报档案', location: '11-155A-3-1-1', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-02 14:00' },
    { id: 'ma-11-10', repoCode: '11', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-WS-2024-Y-BGS-0075', title: '成都市科技创新中心核心示范区首期工程竣工决算审计底稿', location: '11-155A-3-1-2', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-02 15:30' },
    { id: 'ma-11-11', repoCode: '11', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-WS-2026-Y-BGS-0101', title: '成都市数字经济产业建圈强链招商引资重点签约协议汇编', location: '待分配格位', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-06 16:30' },
    { id: 'ma-11-12', repoCode: '11', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-WS-2026-Y-BGS-0102', title: '市财政局2026年度数字公共基础设施重大专项资金拨付审批表', location: '待分配格位', rackCode: '001架A', operator: '王建华', operateTime: '2026-11-06 16:40' },

    // === 12: 会计档案库房 (已上架 10 条，待上架 2 条) ===
    { id: 'ma-12-01', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-KJ-2026-Y-CW-0001', title: '成都市2026年度上半年财政预算执行分析与会计核算账簿', location: '12-102A-1-1-1', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-06 10:20' },
    { id: 'ma-12-02', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-KJ-2026-Y-CW-0002', title: '智慧蓉城公共数据开发运营重大专项资金拨付凭证卷', location: '12-102A-1-1-2', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-06 10:45' },
    { id: 'ma-12-03', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-KJ-2025-Y-CW-0018', title: '成都市直属事业单位2025年度财务决算审计报告及明细底稿', location: '12-102A-1-2-1', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-05 14:10' },
    { id: 'ma-12-04', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-KJ-2025-Y-CW-0032', title: '天府现代产业园区专项建设债券资金收支核算总账', location: '12-102A-2-1-1', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-05 16:00' },
    { id: 'ma-12-05', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-KJ-2025-Y-CW-0045', title: '成都市重大民生工程转移支付专项资金发放对账单表卷', location: '12-102A-2-1-2', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-04 09:30' },
    { id: 'ma-12-06', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-KJ-2024-Y-CW-0010', title: '2024年度全市行政事业单位固定资产清查核实汇总台账', location: '12-102A-2-2-1', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-04 11:20' },
    { id: 'ma-12-07', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-KJ-2024-Y-CW-0022', title: '市财政局各专户银行存款余额调节表及月结单原件', location: '12-102A-2-2-2', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-03 14:40' },
    { id: 'ma-12-08', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-KJ-2024-Y-CW-0036', title: '成都市科技型中小企业研发费用税前加计扣除专项审核凭单', location: '12-102A-3-1-1', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-02 10:15' },
    { id: 'ma-12-09', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-KJ-2024-Y-CW-0048', title: '锦江流域生态治理与水环境保护专项财政奖补报销单据', location: '12-102A-3-1-2', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-02 15:00' },
    { id: 'ma-12-10', repoCode: '12', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 6, archiveNo: '0110-KJ-2024-Y-CW-0060', title: '成都市社保基金专户利息收入与保值增值会计核算凭证', location: '12-102A-3-2-1', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-01 16:30' },
    { id: 'ma-12-11', repoCode: '12', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-KJ-2026-Y-CW-0070', title: '市财政局2026年三季度科研扶持资金银行对账单及汇款回单', location: '待分配格位', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-06 15:30' },
    { id: 'ma-12-12', repoCode: '12', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-KJ-2026-Y-CW-0071', title: '2026年四季度政府采购信息化设备开标履约保证金收据账册', location: '待分配格位', rackCode: '001架A', operator: '李志强', operateTime: '2026-11-06 16:00' },

    // === 13: 基建档案库房 (已上架 10 条，待上架 2 条) ===
    { id: 'ma-13-01', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-JJ-2026-Y-GC-0001', title: '成都市地下综合管廊二期工程地下消防与雨污水管网施工图集', location: '13-205A-1-1-1', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-06 09:30' },
    { id: 'ma-13-02', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-JJ-2026-Y-GC-0002', title: '天府新区科学城算力中心机房结构抗震设防专项计算书', location: '13-205A-1-1-2', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-06 15:00' },
    { id: 'ma-13-03', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-JJ-2025-Y-GC-0021', title: '锦江绿道重点景观提升工程一期竣工测量成果图卷', location: '13-205A-1-2-1', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-05 11:20' },
    { id: 'ma-13-04', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-JJ-2025-Y-GC-0022', title: '成都市轨道交通18号线三期工程区间盾构掘进测量复核图', location: '13-205A-1-2-2', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-05 14:30' },
    { id: 'ma-13-05', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-JJ-2025-Y-GC-0035', title: '天府国际会议中心主钢结构屋盖大跨度焊接节点检测卷', location: '13-205A-2-1-1', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-04 10:00' },
    { id: 'ma-13-06', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-JJ-2024-Y-GC-0012', title: '成都东部新区未来科技城核心起步区总平面工程地质图', location: '13-205A-2-1-2', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-03 16:15' },
    { id: 'ma-13-07', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-JJ-2024-Y-GC-0018', title: '金沙演艺综合体幕墙风洞试验报告与外立面深化施工图', location: '13-205A-2-2-1', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-03 17:00' },
    { id: 'ma-13-08', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-JJ-2024-Y-GC-0026', title: '成都市三环路扩能提升工程主道沥青路面荷载检测全套图', location: '13-205A-2-2-2', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-02 09:40' },
    { id: 'ma-13-09', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-JJ-2024-Y-GC-0038', title: '市疾控中心生物安全三级P3实验室给排水及负压净化蓝图', location: '13-205A-3-1-1', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-02 11:20' },
    { id: 'ma-13-10', repoCode: '13', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 6, archiveNo: '0110-JJ-2024-Y-GC-0050', title: '青白江国际铁路港集装箱中心站二期自动化轨道桥结构图', location: '13-205A-3-1-2', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-01 15:00' },
    { id: 'ma-13-11', repoCode: '13', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-JJ-2026-Y-GC-0060', title: '天府国际机场第三跑道扩展工程地质勘察钻孔柱状图', location: '待分配格位', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-06 16:15' },
    { id: 'ma-13-12', repoCode: '13', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-JJ-2026-Y-GC-0061', title: '成都市智慧水务雨污水一体化智慧截流井结构施工蓝图', location: '待分配格位', rackCode: '001架A', operator: '陈海峰', operateTime: '2026-11-06 16:40' },

    // === 14: 设备档案库房 (已上架 10 条，待上架 2 条) ===
    { id: 'ma-14-01', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SB-2026-Y-SB-0001', title: '智能密集架中央PLC触控屏控制柜电气竣工原理图与通信协议', location: '14-301A-1-1-1', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-06 11:00' },
    { id: 'ma-14-02', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SB-2026-Y-SB-0002', title: '档案馆精密恒温恒湿空调机组安装调试报告及出厂合格证', location: '14-301A-1-1-2', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-06 14:30' },
    { id: 'ma-14-03', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SB-2025-Y-SB-0012', title: '七氟丙烷高压管网灭火系统特种压力容器年检合格证书档案', location: '14-301A-1-2-1', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-05 10:00' },
    { id: 'ma-14-04', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SB-2025-Y-SB-0015', title: '档案馆安防视频监控全景超清鱼眼摄像机配置工程手册', location: '14-301A-1-2-2', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-05 15:20' },
    { id: 'ma-14-05', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-SB-2025-Y-SB-0024', title: '无线LoRaWAN超低功耗温湿度采集节点标定检测证书', location: '14-301A-2-1-1', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-04 11:40' },
    { id: 'ma-14-06', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-SB-2024-Y-SB-0008', title: '智能指静脉与人脸识别双因子生物门禁闸机出厂检验单', location: '14-301A-2-1-2', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-03 14:10' },
    { id: 'ma-14-07', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-SB-2024-Y-SB-0016', title: '档案专用全自动臭氧环氧乙烷消毒杀菌机操作规程档案', location: '14-301A-2-2-1', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-03 16:30' },
    { id: 'ma-14-08', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-SB-2024-Y-SB-0028', title: '精密微循环除湿辅机电气控制线路设计与备件清单说明', location: '14-301A-2-2-2', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-02 09:50' },
    { id: 'ma-14-09', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-SB-2024-Y-SB-0035', title: '三相双变换在线式机房UPS不间断电源蓄电池维护卡', location: '14-301A-3-1-1', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-02 14:20' },
    { id: 'ma-14-10', repoCode: '14', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 6, archiveNo: '0110-SB-2024-Y-SB-0042', title: '超高频RFID通道门禁防盗天线一体机射频调优检测报告', location: '14-301A-3-1-2', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-01 10:40' },
    { id: 'ma-14-11', repoCode: '14', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-SB-2026-Y-SB-0050', title: '全馆数字孪生三维激光扫描建模测量仪器精度检测书', location: '待分配格位', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-06 16:40' },
    { id: 'ma-14-12', repoCode: '14', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-SB-2026-Y-SB-0051', title: '库区防紫外线低照度LED冷光源照明灯具光电性能测试表', location: '待分配格位', rackCode: '001架A', operator: '郑慧敏', operateTime: '2026-11-06 17:00' },

    // === 15: 照片档案库房 (已上架 10 条，待上架 2 条) ===
    { id: 'ma-15-01', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-ZP-2026-Y-XC-0001', title: '天府国际机场通航重要里程碑纪实摄影高分辨率原版底片档案', location: '15-401A-1-1-1', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-06 13:20' },
    { id: 'ma-15-02', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-ZP-2026-Y-XC-0002', title: '2026成都市科技创新峰会领导巡馆与关键成果签约纪实原片', location: '15-401A-1-1-2', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-06 16:10' },
    { id: 'ma-15-03', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-ZP-2025-Y-XC-0019', title: '成都市建设践行新发展理念公园城市示范区历程摄影精选底片', location: '15-401A-1-2-1', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-05 10:40' },
    { id: 'ma-15-04', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-ZP-2025-Y-XC-0020', title: '成都第31届世界大学生夏季运动会开闭幕式高清纪实照片底片', location: '15-401A-1-2-2', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-05 15:30' },
    { id: 'ma-15-05', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-ZP-2025-Y-XC-0035', title: '成都市历史文化街区宽窄巷子保护更新工程纪实全景胶卷', location: '15-401A-2-1-1', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-04 11:15' },
    { id: 'ma-15-06', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-ZP-2024-Y-XC-0009', title: '成都市重特大交通枢纽工程金堂港航电枢纽通航盛典照片卷', location: '15-401A-2-1-2', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-03 14:50' },
    { id: 'ma-15-07', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-ZP-2024-Y-XC-0014', title: '成都市国际友城青年音乐周开幕式各国青年交流高清胶片', location: '15-401A-2-2-1', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-03 16:20' },
    { id: 'ma-15-08', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-ZP-2024-Y-XC-0025', title: '成都市劳模与先进工作者表彰大会英模人物肖像正片底片', location: '15-401A-2-2-2', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-02 09:30' },
    { id: 'ma-15-09', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-ZP-2024-Y-XC-0038', title: '环城生态公园百公里骑行绿道全线贯通群众打卡实景照片', location: '15-401A-3-1-1', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-02 16:00' },
    { id: 'ma-15-10', repoCode: '15', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 6, archiveNo: '0110-ZP-2024-Y-XC-0046', title: '成都市乡村振兴示范村战旗村现代农业科技产业考察照片集', location: '15-401A-3-1-2', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-01 11:20' },
    { id: 'ma-15-11', repoCode: '15', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-ZP-2026-Y-XC-0050', title: '成都市城市地下综合管廊通水送电竣工节点全景全彩胶片', location: '待分配格位', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-06 17:00' },
    { id: 'ma-15-12', repoCode: '15', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-ZP-2026-Y-XC-0051', title: '成都市第十五届运动会青少年射击比赛获奖瞬间特写正片', location: '待分配格位', rackCode: '001架A', operator: '周雅婷', operateTime: '2026-11-06 17:15' },

    // === 16: 声像档案库房 (已上架 10 条，待上架 2 条) ===
    { id: 'ma-16-01', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SX-2026-Y-MT-0001', title: '2026年度成都市委全会暨高质量发展推进大会全景4K数字母带', location: '16-501A-1-1-1', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-06 14:40' },
    { id: 'ma-16-02', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SX-2026-Y-MT-0002', title: '市级重要外事会见现场高清多声道同传录音无损母盘', location: '16-501A-1-1-2', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-06 10:15' },
    { id: 'ma-16-03', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SX-2025-Y-MT-0015', title: '成都市历史文化名城保护口述历史老专家访谈原版录音带', location: '16-501A-1-2-1', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-05 15:30' },
    { id: 'ma-16-04', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SX-2025-Y-MT-0018', title: '都江堰水利工程申遗成功25周年纪念宣传片未删减素材带', location: '16-501A-1-2-2', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-05 16:50' },
    { id: 'ma-16-05', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-SX-2025-Y-MT-0026', title: '成都市建设践行新发展理念公园城市示范区五年综述纪录片', location: '16-501A-2-1-1', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-04 11:00' },
    { id: 'ma-16-06', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-SX-2024-Y-MT-0005', title: '成都市政协常委会参政议政专题协商会全程同期声录音母带', location: '16-501A-2-1-2', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-03 10:30' },
    { id: 'ma-16-07', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-SX-2024-Y-MT-0012', title: '金沙遗址出土太阳神鸟金饰考古发掘亲历学者专题回忆音频', location: '16-501A-2-2-1', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-03 14:00' },
    { id: 'ma-16-08', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-SX-2024-Y-MT-0020', title: '成都市交响乐团庆祝新中国成立75周年原创交响音乐会蓝光盘', location: '16-501A-2-2-2', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-02 09:10' },
    { id: 'ma-16-09', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-SX-2024-Y-MT-0033', title: '成都市数字政府智慧城市大脑系统架构技术论证会录屏卷', location: '16-501A-3-1-1', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-02 16:15' },
    { id: 'ma-16-10', repoCode: '16', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 6, archiveNo: '0110-SX-2024-Y-MT-0045', title: '成都第31届世界大学生夏季运动会火炬传递仪式数字视频集', location: '16-501A-3-1-2', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-01 14:50' },
    { id: 'ma-16-11', repoCode: '16', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-SX-2026-Y-MT-0050', title: '成都市数字孪生中枢启动仪式无人机超高清8K全流程视频带', location: '待分配格位', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-06 16:20' },
    { id: 'ma-16-12', repoCode: '16', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-SX-2026-Y-MT-0051', title: '市文旅局关于非物质文化遗产蜀锦蜀绣织造技艺高清纪录盘', location: '待分配格位', rackCode: '001架A', operator: '孙培强', operateTime: '2026-11-06 16:50' },

    // === 17: 实物档案库房 (已上架 10 条，待上架 2 条) ===
    { id: 'ma-17-01', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SW-2026-Y-RY-0001', title: '成都市荣获联合国人居署全球绿色城市杰出范例奖纯铜镀金奖牌', location: '17-601A-1-1-1', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-06 15:00' },
    { id: 'ma-17-02', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SW-2026-Y-RY-0002', title: '2026世界园艺博览会组委会授予成都市特别贡献功勋荣誉锦旗', location: '17-601A-1-1-2', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-06 11:00' },
    { id: 'ma-17-03', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SW-2025-Y-RY-0010', title: '国际友城友好建交20周年互赠纪念青铜雕塑实物档案', location: '17-601A-1-2-1', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-05 16:10' },
    { id: 'ma-17-04', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SW-2025-Y-RY-0014', title: '中央文明办授予成都市全国文明城市六连冠纯银纪念封与奖牌', location: '17-601A-1-2-2', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-05 17:00' },
    { id: 'ma-17-05', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-SW-2025-Y-RY-0022', title: '国际大体联FISU赠予成都市特别贡献杰出荣誉金钥匙实物', location: '17-601A-2-1-1', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-04 10:20' },
    { id: 'ma-17-06', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-SW-2024-Y-RY-0006', title: '国家科技部授予天府实验室国家级战略科技创新平台牌匾', location: '17-601A-2-1-2', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-03 11:30' },
    { id: 'ma-17-07', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-SW-2024-Y-RY-0015', title: '成都市与法兰西共和国友好建交纪念特制景泰蓝双耳花瓶实物', location: '17-601A-2-2-1', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-03 15:40' },
    { id: 'ma-17-08', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-SW-2024-Y-RY-0028', title: '国务院表彰成都市深化商事制度改革成效显著先进集体奖杯', location: '17-601A-2-2-2', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-02 10:00' },
    { id: 'ma-17-09', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 5, archiveNo: '0110-SW-2024-Y-RY-0036', title: '成都市老字号非遗传承珍贵古法印版及纯手工朱砂印泥实物', location: '17-601A-3-1-1', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-02 14:15' },
    { id: 'ma-17-10', repoCode: '17', status: '已上架', fondsNo: '0110', year: '2024', boxNo: 6, archiveNo: '0110-SW-2024-Y-RY-0044', title: '成都天府国际机场首航全体机组签名金质纪念模型与飞行日记', location: '17-601A-3-1-2', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-01 16:00' },
    { id: 'ma-17-11', repoCode: '17', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-SW-2026-Y-RY-0050', title: '全国文明典范城市创评国家考评组颁发特级水晶纪念鼎', location: '待分配格位', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-06 16:50' },
    { id: 'ma-17-12', repoCode: '17', status: '待上架', fondsNo: '0110', year: '2026', boxNo: 7, archiveNo: '0110-SW-2026-Y-RY-0051', title: '四川省人民政府授予成都市高质量发展突出贡献一等功勋章', location: '待分配格位', rackCode: '001架A', operator: '钱学亮', operateTime: '2026-11-06 17:10' },
  ]);

  // ================= 2. 库房浏览 (repo_browse) 状态 =================
  const [browseActiveTab, setBrowseActiveTab] = useState<'info' | 'put_log' | 'take_log' | 'out_log' | 'in_log'>('info');
  const [browseTablePage, setBrowseTablePage] = useState<number>(1);
  const [browseSearchQuery, setBrowseSearchQuery] = useState('');
  const [browseStartDate, setBrowseStartDate] = useState('');
  const [browseEndDate, setBrowseEndDate] = useState('');

  // 库房基本信息字典 (支持每个库房独立保存修改)
  const [repoInfoState, setRepoInfoState] = useState<Record<string, RepoTreeNode>>(() => {
    const map: Record<string, RepoTreeNode> = {};
    repoTreeNodes.forEach((n) => {
      map[n.repoCode] = { ...n };
    });
    return map;
  });

  // 库房浏览的流水记录台账 (每个库房都有专属数据)
  const [repoLogs, setRepoLogs] = useState<RepoLogRecord[]>([
    // 11 文书
    { id: 'log-11-1', repoCode: '11', action: '上架', operator: '王建华', operateTime: '2026-11-06 14:00', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-WS-2026-Y-BGS-0001', title: '关于成立成都市就业工作领导小组的通知', location: '11-155A-1-1-2', reason: '年度文件归档定架入库' },
    { id: 'log-11-2', repoCode: '11', action: '上架', operator: '王建华', operateTime: '2026-11-06 14:10', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-WS-2026-Y-BGS-0002', title: '关于印发成都市智慧蓉城数字档案中枢建设技术标准的通知', location: '11-155A-1-1-3', reason: '标准规范归档入库' },
    { id: 'log-11-3', repoCode: '11', action: '上架', operator: '王建华', operateTime: '2026-11-05 11:20', fondsNo: '0110', year: '2026', boxNo: 2, archiveNo: '0110-WS-2026-Y-BGS-0003', title: '成都市推进产业园区数字化改造工程专家论证会纪要', location: '11-155A-1-2-1', reason: '会议纪要上架' },
    { id: 'log-11-4', repoCode: '11', action: '上架', operator: '王建华', operateTime: '2026-11-05 11:30', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-WS-2025-Y-BGS-0015', title: '成都市大数据协同中心网络安全防护及应急预案工作总结', location: '11-155A-1-2-2', reason: '网安预案上架' },
    { id: 'log-11-5', repoCode: '11', action: '下架', operator: '王建华', operateTime: '2026-11-04 16:30', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-WS-2025-Y-BGS-0012', title: '关于印发成都市智慧蓉城数字档案技术规范的通知', location: '11-155A-1-2-1', reason: '借阅调卷' },
    { id: 'log-11-6', repoCode: '11', action: '下架', operator: '王建华', operateTime: '2026-11-03 10:15', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-WS-2024-Y-BGS-0042', title: '市直机关精神文明建设与效能目标综合考核评估指标汇编', location: '11-155A-2-2-1', reason: '效能评估调卷' },
    { id: 'log-11-7', repoCode: '11', action: '出库', operator: '王建华', operateTime: '2026-11-04 16:45', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-WS-2025-Y-BGS-0012', title: '关于印发成都市智慧蓉城数字档案技术规范的通知', location: '11-155A-1-2-1', borrower: '张明哲', dept: '大数据政务办' },
    { id: 'log-11-8', repoCode: '11', action: '出库', operator: '王建华', operateTime: '2026-11-03 10:30', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-WS-2024-Y-BGS-0042', title: '市直机关精神文明建设与效能目标综合考核评估指标汇编', location: '11-155A-2-2-1', borrower: '韩雪', dept: '市直机关工委' },
    { id: 'log-11-9', repoCode: '11', action: '入库', operator: '王建华', operateTime: '2026-11-05 11:20', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-WS-2025-Y-BGS-0012', title: '关于印发成都市智慧蓉城数字档案技术规范的通知', location: '11-155A-1-2-1', reason: '阅毕归还清点入库' },
    { id: 'log-11-10', repoCode: '11', action: '入库', operator: '王建华', operateTime: '2026-11-04 15:40', fondsNo: '0110', year: '2024', boxNo: 4, archiveNo: '0110-WS-2024-Y-BGS-0042', title: '市直机关精神文明建设与效能目标综合考核评估指标汇编', location: '11-155A-2-2-1', reason: '评估核查毕归还入库' },

    // 12 会计
    { id: 'log-12-1', repoCode: '12', action: '上架', operator: '李志强', operateTime: '2026-11-06 10:20', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-KJ-2026-Y-CW-0001', title: '成都市2026年度上半年财政预算执行分析与会计核算账簿', location: '12-102A-1-1-1', reason: '半年度凭证归档' },
    { id: 'log-12-2', repoCode: '12', action: '上架', operator: '李志强', operateTime: '2026-11-06 10:45', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-KJ-2026-Y-CW-0002', title: '智慧蓉城公共数据开发运营重大专项资金拨付凭证卷', location: '12-102A-1-1-2', reason: '拨付凭单定架' },
    { id: 'log-12-3', repoCode: '12', action: '下架', operator: '李志强', operateTime: '2026-11-04 14:00', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-KJ-2025-Y-CW-0015', title: '市直属机关2025年综合预算决算审计底稿', location: '12-102A-1-2-3', reason: '财政审计调阅' },
    { id: 'log-12-4', repoCode: '12', action: '出库', operator: '李志强', operateTime: '2026-11-04 14:20', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-KJ-2025-Y-CW-0015', title: '市直属机关2025年综合预算决算审计底稿', location: '12-102A-1-2-3', borrower: '杨文轩', dept: '市审计局' },
    { id: 'log-12-5', repoCode: '12', action: '入库', operator: '李志强', operateTime: '2026-11-05 17:00', fondsNo: '0110', year: '2025', boxNo: 3, archiveNo: '0110-KJ-2025-Y-CW-0015', title: '市直属机关2025年综合预算决算审计底稿', location: '12-102A-1-2-3', reason: '审计结束归还入库' },

    // 13 基建
    { id: 'log-13-1', repoCode: '13', action: '上架', operator: '陈海峰', operateTime: '2026-11-06 09:30', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-JJ-2026-Y-GC-0001', title: '成都市地下综合管廊二期工程地下消防与雨污水管网施工图集', location: '13-205A-1-1-1', reason: '重点项目图纸定架' },
    { id: 'log-13-2', repoCode: '13', action: '上架', operator: '陈海峰', operateTime: '2026-11-06 15:00', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-JJ-2026-Y-GC-0002', title: '天府新区科学城算力中心机房结构抗震设防专项计算书', location: '13-205A-1-1-2', reason: '抗震图纸定架' },
    { id: 'log-13-3', repoCode: '13', action: '下架', operator: '陈海峰', operateTime: '2026-11-03 11:00', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-JJ-2025-Y-GC-0008', title: '天府国际机场核心航站楼防雷防风结构验收蓝图', location: '13-205A-2-1-2', reason: '工程改造核验' },
    { id: 'log-13-4', repoCode: '13', action: '出库', operator: '陈海峰', operateTime: '2026-11-03 11:15', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-JJ-2025-Y-GC-0008', title: '天府国际机场核心航站楼防雷防风结构验收蓝图', location: '13-205A-2-1-2', borrower: '刘建业', dept: '住建局工程处' },
    { id: 'log-13-5', repoCode: '13', action: '入库', operator: '陈海峰', operateTime: '2026-11-05 10:30', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-JJ-2025-Y-GC-0008', title: '天府国际机场核心航站楼防雷防风结构验收蓝图', location: '13-205A-2-1-2', reason: '施工图核验完毕入库' },

    // 14 设备
    { id: 'log-14-1', repoCode: '14', action: '上架', operator: '郑慧敏', operateTime: '2026-11-06 11:00', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SB-2026-Y-SB-0001', title: '智能密集架中央PLC触控屏控制柜电气竣工原理图与通信协议', location: '14-301A-1-1-1', reason: '自动化设备文档入库' },
    { id: 'log-14-2', repoCode: '14', action: '下架', operator: '郑慧敏', operateTime: '2026-11-02 15:00', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SB-2025-Y-SB-0004', title: '精密微循环低噪除湿机组伺服电路板设计原理图纸', location: '14-301A-1-2-2', reason: '机电维保校对' },
    { id: 'log-14-3', repoCode: '14', action: '出库', operator: '郑慧敏', operateTime: '2026-11-02 15:20', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SB-2025-Y-SB-0004', title: '精密微循环低噪除湿机组伺服电路板设计原理图纸', location: '14-301A-1-2-2', borrower: '赵刚', dept: '后勤装备科' },
    { id: 'log-14-4', repoCode: '14', action: '入库', operator: '郑慧敏', operateTime: '2026-11-04 09:40', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SB-2025-Y-SB-0004', title: '精密微循环低噪除湿机组伺服电路板设计原理图纸', location: '14-301A-1-2-2', reason: '维保结束技术档案归库' },

    // 15 照片
    { id: 'log-15-1', repoCode: '15', action: '上架', operator: '周雅婷', operateTime: '2026-11-06 13:20', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-ZP-2026-Y-XC-0001', title: '天府国际机场通航重要里程碑纪实摄影高分辨率原版底片档案', location: '15-401A-1-1-1', reason: '特种冷柜恒温上架' },
    { id: 'log-15-2', repoCode: '15', action: '下架', operator: '周雅婷', operateTime: '2026-11-04 10:00', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-ZP-2025-Y-XC-0010', title: '成都市建设践行新发展理念公园城市示范区历程摄影精选底片', location: '15-401A-1-2-1', reason: '市级文史画册排版借阅' },
    { id: 'log-15-3', repoCode: '15', action: '出库', operator: '周雅婷', operateTime: '2026-11-04 10:30', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-ZP-2025-Y-XC-0010', title: '成都市建设践行新发展理念公园城市示范区历程摄影精选底片', location: '15-401A-1-2-1', borrower: '方晨', dept: '市委宣传部新闻处' },
    { id: 'log-15-4', repoCode: '15', action: '入库', operator: '周雅婷', operateTime: '2026-11-05 16:00', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-ZP-2025-Y-XC-0010', title: '成都市建设践行新发展理念公园城市示范区历程摄影精选底片', location: '15-401A-1-2-1', reason: '高精扫描完毕底片还库' },

    // 16 声像
    { id: 'log-16-1', repoCode: '16', action: '上架', operator: '孙培强', operateTime: '2026-11-06 14:40', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SX-2026-Y-MT-0001', title: '2026年度成都市委全会暨高质量发展推进大会全景4K数字母带', location: '16-501A-1-1-1', reason: '防磁柜定架' },
    { id: 'log-16-2', repoCode: '16', action: '下架', operator: '孙培强', operateTime: '2026-11-03 14:00', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SX-2025-Y-MT-0006', title: '成都市城市地下综合管廊通水送电竣工节点全景全彩胶片', location: '16-501A-1-2-1', reason: '纪录片素材调取' },
    { id: 'log-16-3', repoCode: '16', action: '出库', operator: '孙培强', operateTime: '2026-11-03 14:30', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SX-2025-Y-MT-0006', title: '成都市城市地下综合管廊通水送电竣工节点全景全彩胶片', location: '16-501A-1-2-1', borrower: '郭峰', dept: '成都市广电传媒中心' },
    { id: 'log-16-4', repoCode: '16', action: '入库', operator: '孙培强', operateTime: '2026-11-05 11:30', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SX-2025-Y-MT-0006', title: '成都市城市地下综合管廊通水送电竣工节点全景全彩胶片', location: '16-501A-1-2-1', reason: '转码完成母盘还库' },

    // 17 实物
    { id: 'log-17-1', repoCode: '17', action: '上架', operator: '钱学亮', operateTime: '2026-11-06 15:00', fondsNo: '0110', year: '2026', boxNo: 1, archiveNo: '0110-SW-2026-Y-RY-0001', title: '成都市荣获联合国人居署全球绿色城市杰出范例奖纯铜镀金奖牌', location: '17-601A-1-1-1', reason: '充氮密封防弹展柜定架' },
    { id: 'log-17-2', repoCode: '17', action: '下架', operator: '钱学亮', operateTime: '2026-11-02 10:00', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SW-2025-Y-RY-0005', title: '国际友城友好建交20周年互赠纪念青铜雕塑实物档案', location: '17-601A-1-2-1', reason: '外事主题巡展借调' },
    { id: 'log-17-3', repoCode: '17', action: '出库', operator: '钱学亮', operateTime: '2026-11-02 10:40', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SW-2025-Y-RY-0005', title: '国际友城友好建交20周年互赠纪念青铜雕塑实物档案', location: '17-601A-1-2-1', borrower: '高洁', dept: '市政府外事办' },
    { id: 'log-17-4', repoCode: '17', action: '入库', operator: '钱学亮', operateTime: '2026-11-04 16:30', fondsNo: '0110', year: '2025', boxNo: 2, archiveNo: '0110-SW-2025-Y-RY-0005', title: '国际友城友好建交20周年互赠纪念青铜雕塑实物档案', location: '17-601A-1-2-1', reason: '特展圆满结束充氮封存入库' },
  ]);

  // ================= 3. 日常浏览/管理 (repo_daily - 用户3张截图对应模块) 状态 =================
  const [dailyActiveTab, setDailyActiveTab] = useState<'th_log' | 'check_log' | 'device_log'>('th_log');
  const [dailySearchStartDate, setDailySearchStartDate] = useState('');
  const [dailySearchEndDate, setDailySearchEndDate] = useState('');
  const [dailySearchQuery, setDailySearchQuery] = useState('');
  const [dailyPage, setDailyPage] = useState<number>(1);
  const [selectedDailyRowIds, setSelectedDailyRowIds] = useState<string[]>([]);

  // 模态框交互状态
  const [activeModalType, setActiveModalType] = useState<
    | 'put_shelf'
    | 'take_shelf'
    | 'detail'
    | 'daily_add'
    | 'daily_edit'
    | 'daily_delete'
    | 'daily_print'
    | null
  >(null);
  const [modalTargetRecord, setModalTargetRecord] = useState<any>(null);

  // 日常管理-温湿度初始数据 (7个库房，每个库房各生成 10 条真实近期监测数据)
  const [thList, setThList] = useState<TempHumidityRecord[]>(() => {
    const list: TempHumidityRecord[] = [];
    const configs = [
      { code: '11', name: '王建华', inT: 20.2, inH: 45, outT: 18.2, outH: 52, rem: '恒温恒湿微循环正常' },
      { code: '12', name: '李志强', inT: 19.8, inH: 44, outT: 18.0, outH: 50, rem: '财务专区除湿机正常巡航' },
      { code: '13', name: '陈海峰', inT: 20.1, inH: 43, outT: 17.8, outH: 51, rem: '蓝图平放柜微环境恒定' },
      { code: '14', name: '郑慧敏', inT: 21.0, inH: 46, outT: 18.5, outH: 53, rem: '机电设备柜散热与除湿联动' },
      { code: '15', name: '周雅婷', inT: 15.2, inH: 35, outT: 18.0, outH: 49, rem: '低温防酸冷柜恒定15°C/35%' },
      { code: '16', name: '孙培强', inT: 18.5, inH: 40, outT: 18.3, outH: 52, rem: '防磁屏蔽机柜温湿度正常' },
      { code: '17', name: '钱学亮', inT: 18.0, inH: 42, outT: 18.6, outH: 50, rem: '充氮保护柜氮气浓度99.9%' },
    ];

    configs.forEach((cfg) => {
      for (let i = 1; i <= 10; i++) {
        const day = 6 - Math.floor((i - 1) / 2);
        const hour = i % 2 === 1 ? '10:30' : '16:00';
        const dateStr = `2026-11-0${Math.max(1, day)} ${hour}`;
        list.push({
          id: `th-${cfg.code}-${i}`,
          repoCode: cfg.code,
          time: dateStr,
          recorder: cfg.name,
          indoorTemp: Number((cfg.inT + (i % 3) * 0.1 - 0.1).toFixed(1)),
          indoorHumidity: cfg.inH + (i % 2),
          outdoorTemp: Number((cfg.outT + (i % 2) * 0.3).toFixed(1)),
          outdoorHumidity: cfg.outH + (i % 4),
          remarks: cfg.rem,
        });
      }
    });
    return list;
  });

  // 日常管理-日常情况检查初始数据 (7个库房，每个库房各生成 10 条真实公文检查记录)
  const [checkList, setCheckList] = useState<DailyInspectionRecord[]>(() => {
    const list: DailyInspectionRecord[] = [];
    const titlesByRepo: Record<string, { type: string; titles: string[]; checker: string }> = {
      '11': {
        type: '文书档案',
        checker: '王建华',
        titles: [
          '关于成立成都市就业工作领导小组的通知',
          '关于推进智慧蓉城数字基础设施一体化建设的实施方案',
          '2026年三季度重大民生改善项目综合效益评估总结',
          '成都市推进产业园区数字化改造工程专家论证批复',
          '市大数据协同中心网络安全应急处置演练工作方案',
          '成都市公共资源交易平台数据服务规范与监管办法',
          '关于实施高新技术企业梯度培育攻坚三年行动计划的决定',
          '市直机关精神文明建设与效能目标考核评估总结报告',
          '成都市深化现代服务业高质量发展财政支持政策汇编',
          '关于进一步做好青年友好型城市建设政策落实的意见',
        ],
      },
      '12': {
        type: '会计档案',
        checker: '李志强',
        titles: [
          '成都市2026年度上半年财政预算执行分析与会计核算账簿',
          '智慧蓉城公共数据开发运营重大专项资金拨付凭证卷',
          '成都市直属事业单位2025年度财务决算审计报告及明细底稿',
          '天府现代产业园区专项建设债券资金收支核算总账',
          '成都市重大民生工程转移支付专项资金发放对账单表卷',
          '2024年度全市行政事业单位固定资产清查核实汇总台账',
          '市财政局各专户银行存款余额调节表及月结单原件',
          '成都市科技型中小企业研发费用税前加计扣除专项审核凭单',
          '锦江流域生态治理与水环境保护专项财政奖补报销单据',
          '成都市社保基金专户利息收入与保值增值会计核算凭证',
        ],
      },
      '13': {
        type: '基建工程',
        checker: '陈海峰',
        titles: [
          '成都市地下综合管廊二期工程地下消防与雨污水管网施工图集',
          '天府新区科学城算力中心机房结构抗震设防专项计算书',
          '锦江绿道重点景观提升工程一期竣工测量成果图卷',
          '成都市轨道交通18号线三期工程区间盾构掘进测量复核图',
          '天府国际会议中心主钢结构屋盖大跨度焊接节点检测卷',
          '成都东部新区未来科技城核心起步区总平面工程地质图',
          '金沙演艺综合体幕墙风洞试验报告与外立面深化施工图',
          '成都市三环路扩能提升工程主道沥青路面荷载检测全套图',
          '市疾控中心生物安全三级P3实验室给排水及负压净化蓝图',
          '青白江国际铁路港集装箱中心站二期自动化轨道桥结构图',
        ],
      },
      '14': {
        type: '设备档案',
        checker: '郑慧敏',
        titles: [
          '智能密集架中央PLC触控屏控制柜电气竣工原理图与通信协议',
          '档案馆精密恒温恒湿空调机组安装调试报告及出厂合格证',
          '七氟丙烷高压管网灭火系统特种压力容器年检合格证书档案',
          '档案馆安防视频监控全景超清鱼眼摄像机配置工程手册',
          '无线LoRaWAN超低功耗温湿度采集节点标定检测证书',
          '智能指静脉与人脸识别双因子生物门禁闸机出厂检验单',
          '档案专用全自动臭氧环氧乙烷消毒杀菌机操作规程档案',
          '精密微循环除湿辅机电气控制线路设计与备件清单说明',
          '三相双变换在线式机房UPS不间断电源蓄电池维护卡',
          '超高频RFID通道门禁防盗天线一体机射频调优检测报告',
        ],
      },
      '15': {
        type: '照片档案',
        checker: '周雅婷',
        titles: [
          '天府国际机场通航重要里程碑纪实摄影高分辨率原版底片档案',
          '2026成都市科技创新峰会领导巡馆与关键成果签约纪实原片',
          '成都市建设践行新发展理念公园城市示范区历程摄影精选底片',
          '成都第31届世界大学生夏季运动会开闭幕式高清纪实照片底片',
          '成都市历史文化街区宽窄巷子保护更新工程纪实全景胶卷',
          '成都市重特大交通枢纽工程金堂港航电枢纽通航盛典照片卷',
          '成都市国际友城青年音乐周开幕式各国青年交流高清胶片',
          '成都市劳模与先进工作者表彰大会英模人物肖像正片底片',
          '环城生态公园百公里骑行绿道全线贯通群众打卡实景照片',
          '成都市乡村振兴示范村战旗村现代农业科技产业考察照片集',
        ],
      },
      '16': {
        type: '声像档案',
        checker: '孙培强',
        titles: [
          '2026年度成都市委全会暨高质量发展推进大会全景4K数字母带',
          '市级重要外事会见现场高清多声道同传录音无损母盘',
          '成都市历史文化名城保护口述历史老专家访谈原版录音带',
          '都江堰水利工程申遗成功25周年纪念宣传片未删减素材带',
          '成都市建设践行新发展理念公园城市示范区五年综述纪录片',
          '成都市政协常委会参政议政专题协商会全程同期声录音母带',
          '金沙遗址出土太阳神鸟金饰考古发掘亲历学者专题回忆音频',
          '成都市交响乐团庆祝新中国成立75周年原创交响音乐会蓝光盘',
          '成都市数字政府智慧城市大脑系统架构技术论证会录屏卷',
          '成都第31届世界大学生夏季运动会火炬传递仪式数字视频集',
        ],
      },
      '17': {
        type: '实物档案',
        checker: '钱学亮',
        titles: [
          '成都市荣获联合国人居署全球绿色城市杰出范例奖纯铜镀金奖牌',
          '2026世界园艺博览会组委会授予成都市特别贡献功勋荣誉锦旗',
          '国际友城友好建交20周年互赠纪念青铜雕塑实物档案',
          '中央文明办授予成都市全国文明城市六连冠纯银纪念封与奖牌',
          '国际大体联FISU赠予成都市特别贡献杰出荣誉金钥匙实物',
          '国家科技部授予天府实验室国家级战略科技创新平台牌匾',
          '成都市与法兰西共和国友好建交纪念特制景泰蓝双耳花瓶实物',
          '国务院表彰成都市深化商事制度改革成效显著先进集体奖杯',
          '成都市老字号非遗传承珍贵古法印版及纯手工朱砂印泥实物',
          '成都天府国际机场首航全体机组签名金质纪念模型与飞行日记',
        ],
      },
    };

    Object.entries(titlesByRepo).forEach(([code, conf]) => {
      conf.titles.forEach((title, idx) => {
        const day = 6 - Math.floor(idx / 2);
        const hour = idx % 2 === 0 ? '09:30' : '15:10';
        list.push({
          id: `ck-${code}-${idx + 1}`,
          repoCode: code,
          checkTime: `2026-11-0${Math.max(1, day)} ${hour}`,
          checker: conf.checker,
          archiveNo: `0110-${code === '11' ? 'WS' : code === '12' ? 'KJ' : code === '13' ? 'JJ' : code === '14' ? 'SB' : code === '15' ? 'ZP' : code === '16' ? 'SX' : 'SW'}-2026-${String(idx + 1).padStart(3, '0')}`,
          title,
          location: `${code}-101A-${Math.floor(idx / 3) + 1}-${(idx % 3) + 1}-1`,
          archiveType: conf.type,
          storageStatus: '完好',
          issueItem: idx === 1 ? '微偏已自动调控' : idx === 4 ? '滤网需吸尘清理' : '无异常',
        });
      });
    });
    return list;
  });

  // 日常管理-库房设备登记初始数据 (每个库房各生成 5 条真实设备台账)
  const [deviceList, setDeviceList] = useState<RepoDeviceRecord[]>([
    // 11 文书
    { id: 'dev-11-01', repoCode: '11', regTime: '2026-11-06 09:20', registrant: '王建华', deviceName: '精密恒温恒湿中央空调机组', quantity: 2, remarks: '格力机房专用精密空调，定期维保检测合格' },
    { id: 'dev-11-02', repoCode: '11', regTime: '2026-11-05 14:10', registrant: '王建华', deviceName: '智能电动密集架中央PLC触控屏控制柜', quantity: 16, remarks: '红外防挤压联动传感器灵敏，已通过负荷检测' },
    { id: 'dev-11-03', repoCode: '11', regTime: '2026-11-04 16:00', registrant: '王建华', deviceName: '七氟丙烷气体灭火管网瓶组', quantity: 8, remarks: '消防压力表指示绿区（2.5MPa），年检合格' },
    { id: 'dev-11-04', repoCode: '11', regTime: '2026-11-03 11:20', registrant: '王建华', deviceName: '无线LoRaWAN超低功耗温湿度采集节点', quantity: 24, remarks: '每半小时自动上传数值至数字孪生中控' },
    { id: 'dev-11-05', repoCode: '11', regTime: '2026-11-02 10:30', registrant: '王建华', deviceName: '智能指静脉与人脸识别生物门禁闸机', quantity: 1, remarks: '生物特征双因子鉴权，安防等级特级' },

    // 12 会计
    { id: 'dev-12-01', repoCode: '12', regTime: '2026-11-06 09:50', registrant: '李志强', deviceName: '会计凭证专用全封闭除湿干燥柜', quantity: 6, remarks: '专用防潮密封条完好，湿度控制在45%以下' },
    { id: 'dev-12-02', repoCode: '12', regTime: '2026-11-05 10:30', registrant: '李志强', deviceName: '财务账簿高速无损翻页扫描仪', quantity: 2, remarks: '冷光源扫描，不伤纸质凭证装订线' },
    { id: 'dev-12-03', repoCode: '12', regTime: '2026-11-04 15:20', registrant: '李志强', deviceName: '独立防盗报警金库式加重防火门', quantity: 1, remarks: '联动双生物特征识别锁' },
    { id: 'dev-12-04', repoCode: '12', regTime: '2026-11-03 14:10', registrant: '李志强', deviceName: '超高频RFID通道门禁防盗天线一体机', quantity: 2, remarks: '凭证出库射频防盗感应率100%' },
    { id: 'dev-12-05', repoCode: '12', regTime: '2026-11-02 16:00', registrant: '李志强', deviceName: '三相双变换在线式机房UPS电源', quantity: 1, remarks: '断电续航持续8小时保障恒湿' },

    // 13 基建
    { id: 'dev-13-01', repoCode: '13', regTime: '2026-11-06 10:15', registrant: '陈海峰', deviceName: 'A0超大幅面工程图纸平放密集柜', quantity: 20, remarks: '抽屉承重测试150kg达标，无卡顿' },
    { id: 'dev-13-02', repoCode: '13', regTime: '2026-11-05 11:00', registrant: '陈海峰', deviceName: '大幅面高分辨率非接触式图纸扫描系统', quantity: 1, remarks: '光学分辨率最高达1200DPI，支持图纸平整矫正' },
    { id: 'dev-13-03', repoCode: '13', regTime: '2026-11-04 14:40', registrant: '陈海峰', deviceName: '蓝图无酸保护夹专用温湿度调节舱', quantity: 4, remarks: '定期紫外线阻断检测合格' },
    { id: 'dev-13-04', repoCode: '13', regTime: '2026-11-03 09:20', registrant: '陈海峰', deviceName: '工程图纸防虫防霉恒温调湿机', quantity: 2, remarks: '植物精油防虫熏蒸模块在线' },
    { id: 'dev-13-05', repoCode: '13', regTime: '2026-11-02 15:30', registrant: '陈海峰', deviceName: '防紫外线低照度LED冷光源工作台', quantity: 6, remarks: '照度严格控制在50勒克斯以内' },

    // 14 设备
    { id: 'dev-14-01', repoCode: '14', regTime: '2026-11-06 09:30', registrant: '郑慧敏', deviceName: '机电技术图纸重型文件柜', quantity: 10, remarks: '每层独立编码锁具，防火阻燃认证' },
    { id: 'dev-14-02', repoCode: '14', regTime: '2026-11-05 16:20', registrant: '郑慧敏', deviceName: '特种设备仪器说明书微缩胶片数字化阅读机', quantity: 1, remarks: '高对比度光学镜头洁净' },
    { id: 'dev-14-03', repoCode: '14', regTime: '2026-11-04 10:50', registrant: '郑慧敏', deviceName: 'LoRaWAN环境物联网基站网关', quantity: 2, remarks: '覆盖全馆所有库房传感器节点' },
    { id: 'dev-14-04', repoCode: '14', regTime: '2026-11-03 14:00', registrant: '郑慧敏', deviceName: '机房配电柜自动灭火热气溶胶发生器', quantity: 4, remarks: '响应时间小于1秒' },
    { id: 'dev-14-05', repoCode: '14', regTime: '2026-11-02 11:15', registrant: '郑慧敏', deviceName: '机电档案防磁专用工具检修试验台', quantity: 1, remarks: '无磁防静电台面' },

    // 15 照片
    { id: 'dev-15-01', repoCode: '15', regTime: '2026-11-06 10:00', registrant: '周雅婷', deviceName: '特种低温防酸照片原底恒温恒湿冷库', quantity: 4, remarks: '日本原装无氟制冷机组，温度恒定15°C' },
    { id: 'dev-15-02', repoCode: '15', regTime: '2026-11-05 13:40', registrant: '周雅婷', deviceName: '高精度透射式底片胶片CCD扫描仪', quantity: 2, remarks: '支持4800DPI胶片光学扫描，色彩还原99.8%' },
    { id: 'dev-15-03', repoCode: '15', regTime: '2026-11-04 11:10', registrant: '周雅婷', deviceName: '防紫外线抗老化滤光玻璃防爆密封柜', quantity: 8, remarks: '紫外线透射率为0%' },
    { id: 'dev-15-04', repoCode: '15', regTime: '2026-11-03 15:00', registrant: '周雅婷', deviceName: '照片底片脱酸保养恒压净化试验舱', quantity: 1, remarks: '气相弱碱脱酸有效率99.9%' },
    { id: 'dev-15-05', repoCode: '15', regTime: '2026-11-02 10:45', registrant: '周雅婷', deviceName: '超净百级无尘底片整理操作台', quantity: 2, remarks: '垂直层流洁净度达到ISO 5级' },

    // 16 声像
    { id: 'dev-16-01', repoCode: '16', regTime: '2026-11-06 10:25', registrant: '孙培强', deviceName: '电磁屏蔽国家B级防磁专用机柜', quantity: 8, remarks: '高导磁率坡莫合金屏蔽层，衰减量>80dB' },
    { id: 'dev-16-02', repoCode: '16', regTime: '2026-11-05 15:10', registrant: '孙培强', deviceName: '专业级磁带光盘高保真音频转码工作站', quantity: 1, remarks: '支持24bit/192kHz广播级无损采样' },
    { id: 'dev-16-03', repoCode: '16', regTime: '2026-11-04 16:30', registrant: '孙培强', deviceName: '静电防护离子风幕与除尘通道机', quantity: 1, remarks: '出入静电消除率100%' },
    { id: 'dev-16-04', repoCode: '16', regTime: '2026-11-03 11:00', registrant: '孙培强', deviceName: '全频段射频屏蔽房屏蔽效能监测仪', quantity: 1, remarks: '实时报警磁场泄露' },
    { id: 'dev-16-05', repoCode: '16', regTime: '2026-11-02 14:20', registrant: '孙培强', deviceName: '广播级数字广播母盘无尘冷储藏柜', quantity: 4, remarks: '恒温18°C/40%RH恒定' },

    // 17 实物
    { id: 'dev-17-01', repoCode: '17', regTime: '2026-11-06 10:50', registrant: '钱学亮', deviceName: '高纯度充氮恒湿防弹密封展存柜', quantity: 6, remarks: '纯氮循环保压，氧气残留量<0.1%' },
    { id: 'dev-17-02', repoCode: '17', regTime: '2026-11-05 14:00', registrant: '钱学亮', deviceName: '珍贵实物微焦点X光无损探伤检测仪', quantity: 1, remarks: '用于金石实物内部隐伤定期无损探查' },
    { id: 'dev-17-03', repoCode: '17', regTime: '2026-11-04 10:20', registrant: '钱学亮', deviceName: '微震动吸收抗震隔离浮筑底座平台', quantity: 6, remarks: '可抵御8级地震微幅晃动' },
    { id: 'dev-17-04', repoCode: '17', regTime: '2026-11-03 16:10', registrant: '钱学亮', deviceName: '高精度工业制氮机制气储气罐机组', quantity: 1, remarks: '连续供应99.999%高纯氮气' },
    { id: 'dev-17-05', repoCode: '17', regTime: '2026-11-02 09:30', registrant: '钱学亮', deviceName: '实物档案三维激光全息数字扫描仪', quantity: 1, remarks: '真彩高精度三维建模重建' },
  ]);

  // 新增/编辑表单临时状态
  const [dailyFormState, setDailyFormState] = useState<any>({
    time: '2026-11-06 11:30',
    recorder: '王建华',
    indoorTemp: '20.2',
    indoorHumidity: '45',
    outdoorTemp: '18.5',
    outdoorHumidity: '52',
    archiveNo: '0110-WS-2026-008',
    title: '成都市推进产业园区数字化基础设施建设实施方案',
    location: '11-155A-1-1-2',
    archiveType: '文书档案',
    storageStatus: '完好',
    issueItem: '无异常',
    deviceName: '精密恒温恒湿中央空调机组',
    quantity: '2',
    remarks: '运行稳定，已通过例行巡查检测',
  });

  // ================= 4. 库房统计 (repo_stats) 独立状态 =================
  const [rackStatsList] = useState<RackStatisticItem[]>(initialRackStatsList);
  const [statsScope, setStatsScope] = useState<'current' | 'all'>('current');
  const [statsUsageFilter, setStatsUsageFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [statsSearchQuery, setStatsSearchQuery] = useState('');
  const [statsPage, setStatsPage] = useState(1);
  const [selectedStatsRack, setSelectedStatsRack] = useState<RackStatisticItem | null>(null);
  const [showCapacityForecastModal, setShowCapacityForecastModal] = useState(false);

  // 当外部 submodule 变化时同步
  React.useEffect(() => {
    if (submodule) {
      setCurrentSubTab(submodule);
    }
  }, [submodule]);

  // 当前选中的树节点信息 (支持实时读取可编辑状态)
  const currentTreeNode = repoInfoState[selectedTreeRepoCode] || repoTreeNodes[0];

  // 切换左侧库房树：彻底联动全部子页面数据
  const handleSelectTreeRepo = (code: string) => {
    setSelectedTreeRepoCode(code);
    setManagePage(1);
    setBrowseTablePage(1);
    setDailyPage(1);
    setStatsPage(1);
    setSelectedDailyRowIds([]);
    setSelectedRackSide('001架A');
    const targetNode = repoInfoState[code] || repoTreeNodes.find((n) => n.repoCode === code);
    if (targetNode) {
      // 联动表单默认登记人
      setDailyFormState((prev: any) => ({
        ...prev,
        recorder: targetNode.manager,
        archiveType: targetNode.categoryLabel,
        location: `${targetNode.repoCode}-101A-1-1-1`,
      }));
      onShowMessage(`已切换至 [${targetNode.fullName}]，右侧数据与数量已精准联动！`);
    }
  };

  // ================= 核心数量计算函数：根据当前页面与Tab计算左侧角标数量（保证与右侧表格100%严格一致） =================
  const getRepoItemCount = (repoCode: string) => {
    // 1. 库房管理 (repo_manage)：按选中的状态 (已上架 / 待上架) 严格统计
    if (currentSubTab === 'repo_manage') {
      return manageArchives.filter((i) => i.repoCode === repoCode && i.status === shelfTab).length;
    }

    // 2. 库房浏览 (repo_browse)：按当前选中的浏览标签页统计
    if (currentSubTab === 'repo_browse') {
      if (browseActiveTab === 'info') {
        // 基本信息下显示该库房的所有在库档案数
        return manageArchives.filter((i) => i.repoCode === repoCode).length;
      }
      let actionType: '上架' | '下架' | '出库' | '入库' = '上架';
      if (browseActiveTab === 'put_log') actionType = '上架';
      else if (browseActiveTab === 'take_log') actionType = '下架';
      else if (browseActiveTab === 'out_log') actionType = '出库';
      else if (browseActiveTab === 'in_log') actionType = '入库';

      return repoLogs.filter((log) => {
        const matchRepo = log.repoCode === repoCode;
        const matchAction = log.action === actionType;
        const matchQuery =
          !browseSearchQuery ||
          log.title.includes(browseSearchQuery) ||
          log.archiveNo.includes(browseSearchQuery) ||
          (log.borrower && log.borrower.includes(browseSearchQuery));
        return matchRepo && matchAction && matchQuery;
      }).length;
    }

    // 3. 日常管理 (repo_daily)：按当前选中的日常标签页统计
    if (currentSubTab === 'repo_daily') {
      if (dailyActiveTab === 'th_log') {
        return thList.filter((item) => item.repoCode === repoCode).length;
      }
      if (dailyActiveTab === 'check_log') {
        return checkList.filter((item) => {
          const matchRepo = item.repoCode === repoCode;
          const matchQuery =
            !dailySearchQuery ||
            item.title.includes(dailySearchQuery) ||
            item.archiveNo.includes(dailySearchQuery);
          return matchRepo && matchQuery;
        }).length;
      }
      if (dailyActiveTab === 'device_log') {
        return deviceList.filter((item) => {
          const matchRepo = item.repoCode === repoCode;
          const matchQuery = !dailySearchQuery || item.deviceName.includes(dailySearchQuery);
          return matchRepo && matchQuery;
        }).length;
      }
    }

    // 4. 库房统计 (repo_stats)：统计该库房排架资产台账数 (严格与表格保持一致)
    return rackStatsList.filter((i) => i.repoCode === repoCode).length;
  };

  // 1. 库房管理 (repo_manage) 列表筛选与分页：严格按照 selectedTreeRepoCode 过滤
  const filteredArchives = manageArchives.filter((item) => {
    return item.repoCode === selectedTreeRepoCode && item.status === shelfTab;
  });

  const paginatedManageData = filteredArchives.slice(
    (managePage - 1) * PAGE_SIZE,
    managePage * PAGE_SIZE
  );

  // 2. 库房浏览 (repo_browse) 的流水台账过滤：严格按所选库房与流水Tab过滤
  const getBrowseLogs = () => {
    let actionType: '上架' | '下架' | '出库' | '入库' = '上架';
    if (browseActiveTab === 'put_log') actionType = '上架';
    else if (browseActiveTab === 'take_log') actionType = '下架';
    else if (browseActiveTab === 'out_log') actionType = '出库';
    else if (browseActiveTab === 'in_log') actionType = '入库';

    return repoLogs.filter((log) => {
      const matchRepo = log.repoCode === selectedTreeRepoCode;
      const matchAction = log.action === actionType;
      const matchQuery =
        !browseSearchQuery ||
        log.title.includes(browseSearchQuery) ||
        log.archiveNo.includes(browseSearchQuery) ||
        (log.borrower && log.borrower.includes(browseSearchQuery));
      return matchRepo && matchAction && matchQuery;
    });
  };

  const currentBrowseLogList = getBrowseLogs();
  const paginatedBrowseLogs = currentBrowseLogList.slice(
    (browseTablePage - 1) * PAGE_SIZE,
    browseTablePage * PAGE_SIZE
  );

  // 3. 日常管理 (repo_daily) 当前Tab的数据：严格按所选库房过滤
  const getDailyDataList = () => {
    let list: any[] = [];
    if (dailyActiveTab === 'th_log') {
      list = thList.filter((item) => item.repoCode === selectedTreeRepoCode);
    } else if (dailyActiveTab === 'check_log') {
      list = checkList.filter((item) => {
        const matchRepo = item.repoCode === selectedTreeRepoCode;
        const matchQuery =
          !dailySearchQuery ||
          item.title.includes(dailySearchQuery) ||
          item.archiveNo.includes(dailySearchQuery);
        return matchRepo && matchQuery;
      });
    } else if (dailyActiveTab === 'device_log') {
      list = deviceList.filter((item) => {
        const matchRepo = item.repoCode === selectedTreeRepoCode;
        const matchQuery = !dailySearchQuery || item.deviceName.includes(dailySearchQuery);
        return matchRepo && matchQuery;
      });
    }
    return list;
  };

  const currentDailyList = getDailyDataList();
  const paginatedDailyList = currentDailyList.slice(
    (dailyPage - 1) * PAGE_SIZE,
    dailyPage * PAGE_SIZE
  );

  // 全选/反选日常记录
  const handleToggleSelectAllDaily = () => {
    if (selectedDailyRowIds.length === paginatedDailyList.length && paginatedDailyList.length > 0) {
      setSelectedDailyRowIds([]);
    } else {
      setSelectedDailyRowIds(paginatedDailyList.map((d: any) => d.id));
    }
  };

  const handleToggleDailyRow = (id: string) => {
    setSelectedDailyRowIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 执行新增
  const handleConfirmDailyAdd = () => {
    if (dailyActiveTab === 'th_log') {
      const newRec: TempHumidityRecord = {
        id: `th-${selectedTreeRepoCode}-${Date.now()}`,
        repoCode: selectedTreeRepoCode,
        time: dailyFormState.time,
        recorder: dailyFormState.recorder,
        indoorTemp: parseFloat(dailyFormState.indoorTemp) || 20.0,
        indoorHumidity: parseInt(dailyFormState.indoorHumidity) || 45,
        outdoorTemp: parseFloat(dailyFormState.outdoorTemp) || 18.0,
        outdoorHumidity: parseInt(dailyFormState.outdoorHumidity) || 50,
        remarks: dailyFormState.remarks,
      };
      setThList((prev) => [newRec, ...prev]);
      onShowMessage(`已成功为 [${currentTreeNode.name}] 登记温湿度记录！`);
    } else if (dailyActiveTab === 'check_log') {
      const newRec: DailyInspectionRecord = {
        id: `ck-${selectedTreeRepoCode}-${Date.now()}`,
        repoCode: selectedTreeRepoCode,
        checkTime: dailyFormState.time,
        checker: dailyFormState.recorder,
        archiveNo: dailyFormState.archiveNo,
        title: dailyFormState.title,
        location: dailyFormState.location,
        archiveType: dailyFormState.archiveType,
        storageStatus: dailyFormState.storageStatus,
        issueItem: dailyFormState.issueItem,
      };
      setCheckList((prev) => [newRec, ...prev]);
      onShowMessage(`已成功登记档案 [${newRec.title}] 日常检查巡视记录！`);
    } else if (dailyActiveTab === 'device_log') {
      const newRec: RepoDeviceRecord = {
        id: `dev-${selectedTreeRepoCode}-${Date.now()}`,
        repoCode: selectedTreeRepoCode,
        regTime: dailyFormState.time,
        registrant: dailyFormState.recorder,
        deviceName: dailyFormState.deviceName,
        quantity: parseInt(dailyFormState.quantity) || 1,
        remarks: dailyFormState.remarks,
      };
      setDeviceList((prev) => [newRec, ...prev]);
      onShowMessage(`已成功录入库房设备 [${newRec.deviceName}] 登记台账！`);
    }
    setActiveModalType(null);
  };

  // 执行编辑
  const handleConfirmDailyEdit = () => {
    if (!modalTargetRecord) return;
    if (dailyActiveTab === 'th_log') {
      setThList((prev) =>
        prev.map((item) =>
          item.id === modalTargetRecord.id
            ? {
                ...item,
                recorder: dailyFormState.recorder,
                time: dailyFormState.time,
                indoorTemp: parseFloat(dailyFormState.indoorTemp) || item.indoorTemp,
                indoorHumidity: parseInt(dailyFormState.indoorHumidity) || item.indoorHumidity,
                outdoorTemp: parseFloat(dailyFormState.outdoorTemp) || item.outdoorTemp,
                outdoorHumidity: parseInt(dailyFormState.outdoorHumidity) || item.outdoorHumidity,
                remarks: dailyFormState.remarks,
              }
            : item
        )
      );
      onShowMessage('已成功更新温湿度监测数据！');
    } else if (dailyActiveTab === 'check_log') {
      setCheckList((prev) =>
        prev.map((item) =>
          item.id === modalTargetRecord.id
            ? {
                ...item,
                checker: dailyFormState.recorder,
                checkTime: dailyFormState.time,
                storageStatus: dailyFormState.storageStatus,
                issueItem: dailyFormState.issueItem,
              }
            : item
        )
      );
      onShowMessage('已成功保存日常检查项修改！');
    } else if (dailyActiveTab === 'device_log') {
      setDeviceList((prev) =>
        prev.map((item) =>
          item.id === modalTargetRecord.id
            ? {
                ...item,
                registrant: dailyFormState.recorder,
                regTime: dailyFormState.time,
                deviceName: dailyFormState.deviceName,
                quantity: parseInt(dailyFormState.quantity) || item.quantity,
                remarks: dailyFormState.remarks,
              }
            : item
        )
      );
      onShowMessage(`已更新库房设备 [${modalTargetRecord.deviceName}] 登记！`);
    }
    setActiveModalType(null);
  };

  // 执行批量删除
  const handleConfirmDailyDelete = () => {
    const idsToDelete =
      selectedDailyRowIds.length > 0 ? selectedDailyRowIds : modalTargetRecord ? [modalTargetRecord.id] : [];
    if (idsToDelete.length === 0) {
      onShowMessage('请先勾选需要删除的记录行');
      return;
    }

    if (dailyActiveTab === 'th_log') {
      setThList((prev) => prev.filter((i) => !idsToDelete.includes(i.id)));
    } else if (dailyActiveTab === 'check_log') {
      setCheckList((prev) => prev.filter((i) => !idsToDelete.includes(i.id)));
    } else if (dailyActiveTab === 'device_log') {
      setDeviceList((prev) => prev.filter((i) => !idsToDelete.includes(i.id)));
    }

    onShowMessage(`已成功删除选中的 ${idsToDelete.length} 条数据！`);
    setSelectedDailyRowIds([]);
    setActiveModalType(null);
  };

  // 左侧公共树形目录组件：明确区分【编号代码】与【当前视图真实数据量 Badge】，点击即时对应右侧表格数量
  const renderLeftTree = () => (
    <div className="md:col-span-3 lg:col-span-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col justify-between">
      <div className="space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>库房列表</span>
          </h3>
          <span className="text-[10px] font-mono text-slate-400">7个库房</span>
        </div>

        {/* 树形列表 */}
        <div className="space-y-1 text-xs">
          {/* 根节点 */}
          <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-slate-700 dark:text-slate-300 font-semibold bg-slate-50 dark:bg-slate-800/50">
            <FolderOpen className="w-4 h-4 text-amber-500" />
            <span>库房列表</span>
          </div>

          {/* 各库房子节点 */}
          <div className="pl-3.5 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3 py-1">
            {repoTreeNodes.map((node) => {
              const isSelected = selectedTreeRepoCode === node.repoCode;
              // 精确计算该库房在当前页面和Tab下的数据量
              const currentItemCount = getRepoItemCount(node.repoCode);

              return (
                <button
                  key={node.id}
                  onClick={() => handleSelectTreeRepo(node.repoCode)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-white' : 'text-amber-500'}`} />
                    <span className="truncate">{node.name}</span>
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded ${
                        isSelected
                          ? 'bg-blue-700/70 text-blue-100'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {node.repoCode}号
                    </span>
                  </div>

                  {/* 提示数字：与右侧表格数量 100% 保持严格对应 */}
                  <span
                    title={`当前分类共 ${currentItemCount} 条数据`}
                    className={`text-[11px] font-mono font-bold px-1.5 py-0.2 rounded-full transition-all shrink-0 ml-1.5 ${
                      isSelected
                        ? 'bg-white text-blue-600 shadow-2xs ring-1 ring-white/60'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60'
                    }`}
                  >
                    {currentItemCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono space-y-1">
        <div className="flex items-center justify-between">
          <span>当前管员：</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{currentTreeNode.manager}</span>
        </div>
        <div className="flex items-center justify-between text-emerald-600 font-medium">
          <span>当前列表数据：</span>
          <span className="font-bold font-mono">{getRepoItemCount(selectedTreeRepoCode)} 条</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-3 animate-in fade-in duration-200">

      {/* ===================== 子菜单 1: 库房管理 (密集架排架立面与上下架表格) ===================== */}
      {currentSubTab === 'repo_manage' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {renderLeftTree()}

          <div className="md:col-span-9 lg:col-span-9.5 space-y-3">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedRackSide('001架A');
                      onShowMessage(`已重置返回至 [${currentTreeNode.fullName} —— 001架A]`);
                    }}
                    title="返回初始架位"
                    className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 flex items-center justify-center text-blue-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    当前位置：
                    <span className="text-blue-600 dark:text-blue-400 font-bold">{currentTreeNode.fullName}</span>
                    <span className="text-slate-400 mx-1.5">——</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono font-bold bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded border border-indigo-200 dark:border-indigo-900">
                      {selectedRackSide}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => onShowMessage(`已下发指令：开启 [${currentTreeNode.name} - ${selectedRackSide}] 密集架通道`)}
                    className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Unlock className="w-3 h-3" />
                    <span>展开通道</span>
                  </button>
                  <button
                    onClick={() => onShowMessage(`已下发指令：全列密集架调整为10cm定时通风保护间隙`)}
                    className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 text-[11px] font-medium flex items-center gap-1"
                  >
                    <Wind className="w-3 h-3" />
                    <span>通风保护</span>
                  </button>
                </div>
              </div>

              {/* 密集架双列立面图 */}
              <div className="p-3 bg-slate-50/70 dark:bg-slate-950/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
                <div className="flex items-stretch gap-3 min-w-[680px] justify-between py-1">
                  {mockRackColumns.map((col) => {
                    const isSideASelected = selectedRackSide === col.sideA;
                    const isSideBSelected = selectedRackSide === col.sideB;

                    return (
                      <div
                        key={col.rackNo}
                        className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/90 dark:border-slate-800 p-2 shadow-2xs hover:shadow-sm transition-all"
                      >
                        <div className="grid grid-cols-2 gap-1.5 h-full">
                          <button
                            onClick={() => setSelectedRackSide(col.sideA)}
                            className={`p-2 rounded-lg flex flex-col items-center justify-between transition-all border ${
                              isSideASelected
                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-400/40'
                                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="py-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-widest [writing-mode:vertical-lr]">
                              {currentTreeNode.categoryLabel}
                            </div>
                            <div className="w-full border-t border-slate-200 dark:border-slate-700 my-1.5"></div>
                            <div className="text-center font-mono text-[11px] font-bold space-y-0.5">
                              <div className="text-slate-500">{col.rackNo}架</div>
                              <div className={`px-1.5 py-0.5 rounded text-[10px] ${isSideASelected ? 'bg-blue-600 text-white' : 'text-blue-600'}`}>
                                A面
                              </div>
                            </div>
                          </button>

                          <button
                            onClick={() => setSelectedRackSide(col.sideB)}
                            className={`p-2 rounded-lg flex flex-col items-center justify-between transition-all border ${
                              isSideBSelected
                                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-400/40'
                                : 'bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            <div className="py-2 text-[11px] font-bold text-slate-700 dark:text-slate-300 tracking-widest [writing-mode:vertical-lr]">
                              {currentTreeNode.categoryLabel}
                            </div>
                            <div className="w-full border-t border-slate-200 dark:border-slate-700 my-1.5"></div>
                            <div className="text-center font-mono text-[11px] font-bold space-y-0.5">
                              <div className="text-slate-500">{col.rackNo}架</div>
                              <div className={`px-1.5 py-0.5 rounded text-[10px] ${isSideBSelected ? 'bg-blue-600 text-white' : 'text-indigo-600'}`}>
                                B面
                              </div>
                            </div>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 下方已上架/待上架表格 */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
              <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => {
                      setShelfTab('已上架');
                      setManagePage(1);
                    }}
                    className={`pb-2.5 text-xs font-bold transition-all relative ${
                      shelfTab === '已上架'
                        ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    已上架 ({manageArchives.filter((i) => i.repoCode === selectedTreeRepoCode && i.status === '已上架').length})
                  </button>
                  <button
                    onClick={() => {
                      setShelfTab('待上架');
                      setManagePage(1);
                    }}
                    className={`pb-2.5 text-xs font-bold transition-all relative ${
                      shelfTab === '待上架'
                        ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    待上架 ({manageArchives.filter((i) => i.repoCode === selectedTreeRepoCode && i.status === '待上架').length})
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline-block">
                    共 <strong className="text-blue-600 font-semibold">{filteredArchives.length}</strong> 条档案
                  </span>
                  <button
                    onClick={() => setActiveModalType('put_shelf')}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-xs"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                    <span>上架</span>
                  </button>
                  <button
                    onClick={() => setActiveModalType('take_shelf')}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5 shadow-xs"
                  >
                    <ArrowDownRight className="w-3.5 h-3.5" />
                    <span>下架</span>
                  </button>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-3 text-center">序号</th>
                        <th className="py-3 px-3 whitespace-nowrap">档案状态</th>
                        <th className="py-3 px-3 whitespace-nowrap">全宗号</th>
                        <th className="py-3 px-3 whitespace-nowrap">年度</th>
                        <th className="py-3 px-3 text-center whitespace-nowrap">盒号</th>
                        <th className="py-3 px-4 min-w-[170px] whitespace-nowrap">档号</th>
                        <th className="py-3 px-4 min-w-[260px]">题名</th>
                        <th className="py-3 px-4 min-w-[150px] whitespace-nowrap">库房位置</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                      {paginatedManageData.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="py-8 text-center text-slate-400">
                            暂无对应档案记录
                          </td>
                        </tr>
                      ) : (
                        paginatedManageData.map((row, index) => (
                          <tr key={row.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/60">
                            <td className="py-3 px-3 text-center font-mono text-slate-500">
                              {(managePage - 1) * PAGE_SIZE + index + 1}
                            </td>
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  row.status === '已上架'
                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                                }`}
                              >
                                {row.status}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-mono">{row.fondsNo}</td>
                            <td className="py-3 px-3 font-mono">{row.year}</td>
                            <td className="py-3 px-3 font-mono text-center font-bold">{row.boxNo}</td>
                            <td className="py-3 px-4 font-mono font-medium text-blue-600">{row.archiveNo}</td>
                            <td className="py-3 px-4 font-medium">{row.title}</td>
                            <td className="py-3 px-4 font-mono">{row.location}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                <Pagination
                  currentPage={managePage}
                  totalItems={filteredArchives.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={(page) => setManagePage(page)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 子菜单 2: 库房浏览 (复原完整包含5大标签页、库房信息保存与流转台账) ===================== */}
      {currentSubTab === 'repo_browse' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {renderLeftTree()}

          <div className="md:col-span-9 lg:col-span-9.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-4">
            {/* 顶层5大业务标签页 (完全对应业务流水) */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between overflow-x-auto">
              <div className="flex items-center gap-6 min-w-max">
                <button
                  onClick={() => {
                    setBrowseActiveTab('info');
                    setBrowseTablePage(1);
                  }}
                  className={`pb-2.5 text-xs font-bold transition-all relative ${
                    browseActiveTab === 'info'
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  库房基本信息
                </button>
                <button
                  onClick={() => {
                    setBrowseActiveTab('put_log');
                    setBrowseTablePage(1);
                  }}
                  className={`pb-2.5 text-xs font-bold transition-all relative ${
                    browseActiveTab === 'put_log'
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  上架记录 ({repoLogs.filter((l) => l.repoCode === selectedTreeRepoCode && l.action === '上架').length})
                </button>
                <button
                  onClick={() => {
                    setBrowseActiveTab('take_log');
                    setBrowseTablePage(1);
                  }}
                  className={`pb-2.5 text-xs font-bold transition-all relative ${
                    browseActiveTab === 'take_log'
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  下架记录 ({repoLogs.filter((l) => l.repoCode === selectedTreeRepoCode && l.action === '下架').length})
                </button>
                <button
                  onClick={() => {
                    setBrowseActiveTab('out_log');
                    setBrowseTablePage(1);
                  }}
                  className={`pb-2.5 text-xs font-bold transition-all relative ${
                    browseActiveTab === 'out_log'
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  出库记录 ({repoLogs.filter((l) => l.repoCode === selectedTreeRepoCode && l.action === '出库').length})
                </button>
                <button
                  onClick={() => {
                    setBrowseActiveTab('in_log');
                    setBrowseTablePage(1);
                  }}
                  className={`pb-2.5 text-xs font-bold transition-all relative ${
                    browseActiveTab === 'in_log'
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  入库记录 ({repoLogs.filter((l) => l.repoCode === selectedTreeRepoCode && l.action === '入库').length})
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-500 pb-2">
                库房代码：<span className="font-bold text-blue-600">{currentTreeNode.repoCode}</span>
              </div>
            </div>

            {/* Tab 1: 库房基本信息与使用信息表单 */}
            {browseActiveTab === 'info' && (
              <div className="space-y-5 animate-in fade-in duration-150">
                {/* 1. 库房信息区块 */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">库房信息</h4>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-500 font-medium shrink-0">库房编号：</span>
                      <input
                        type="text"
                        disabled
                        value={currentTreeNode.repoCode}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-500 font-mono"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-500 font-medium shrink-0">库房名称：</span>
                      <input
                        type="text"
                        value={currentTreeNode.name}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRepoInfoState((prev) => ({
                            ...prev,
                            [selectedTreeRepoCode]: { ...prev[selectedTreeRepoCode], name: val },
                          }));
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-500 font-medium shrink-0">库房管理员：</span>
                      <input
                        type="text"
                        value={currentTreeNode.manager}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRepoInfoState((prev) => ({
                            ...prev,
                            [selectedTreeRepoCode]: { ...prev[selectedTreeRepoCode], manager: val },
                          }));
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-500 font-medium shrink-0">备注：</span>
                      <input
                        type="text"
                        value={currentTreeNode.remarks}
                        onChange={(e) => {
                          const val = e.target.value;
                          setRepoInfoState((prev) => ({
                            ...prev,
                            [selectedTreeRepoCode]: { ...prev[selectedTreeRepoCode], remarks: val },
                          }));
                        }}
                        className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. 库房使用信息区块 (完全还原 screenshot 带黄色角标 4, 1, 2, 3) */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">库房使用信息</h4>
                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/40 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-500 font-medium shrink-0">档案架数量：</span>
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          value={currentTreeNode.totalRacks}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setRepoInfoState((prev) => ({
                              ...prev,
                              [selectedTreeRepoCode]: { ...prev[selectedTreeRepoCode], totalRacks: val },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300"
                        />
                        <span className="absolute top-1 right-2 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950 shadow-2xs">
                          4
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-500 font-medium shrink-0">总格位数量：</span>
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          value={currentTreeNode.totalGrids}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setRepoInfoState((prev) => ({
                              ...prev,
                              [selectedTreeRepoCode]: { ...prev[selectedTreeRepoCode], totalGrids: val },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300"
                        />
                        <span className="absolute top-1 right-2 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950 shadow-2xs">
                          1
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-500 font-medium shrink-0">总档案盒数：</span>
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          value={currentTreeNode.totalBoxes}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setRepoInfoState((prev) => ({
                              ...prev,
                              [selectedTreeRepoCode]: { ...prev[selectedTreeRepoCode], totalBoxes: val },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300"
                        />
                        <span className="absolute top-1 right-2 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950 shadow-2xs">
                          2
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-24 text-right text-slate-500 font-medium shrink-0">存放量：</span>
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={currentTreeNode.storedCount}
                          onChange={(e) => {
                            const val = e.target.value;
                            setRepoInfoState((prev) => ({
                              ...prev,
                              [selectedTreeRepoCode]: { ...prev[selectedTreeRepoCode], storedCount: val },
                            }));
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 font-mono text-slate-700 dark:text-slate-300"
                        />
                        <span className="absolute top-1 right-2 px-1.5 py-0.2 rounded text-[10px] font-bold bg-amber-400 text-slate-950 shadow-2xs">
                          3
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      onShowMessage(`已成功保存 [${currentTreeNode.fullName}] 库房基本配置参数！`);
                    }}
                    className="px-8 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>保存</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tab 2 ~ 5: 上架记录 / 下架记录 / 出库记录 / 入库记录 流水台账 */}
            {browseActiveTab !== 'info' && (
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {/* 检索栏 */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50/60 dark:bg-slate-800/40 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium">流水时间：</span>
                      <input
                        type="date"
                        value={browseStartDate}
                        onChange={(e) => setBrowseStartDate(e.target.value)}
                        className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                      <span className="text-slate-400">—</span>
                      <input
                        type="date"
                        value={browseEndDate}
                        onChange={(e) => setBrowseEndDate(e.target.value)}
                        className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-500 font-medium">关键词：</span>
                      <input
                        type="text"
                        placeholder="检索档号、题名或经办人..."
                        value={browseSearchQuery}
                        onChange={(e) => setBrowseSearchQuery(e.target.value)}
                        className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-48"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setBrowseTablePage(1)}
                      className="px-3 py-1 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Search className="w-3.5 h-3.5" />
                      <span>检索</span>
                    </button>
                    <button
                      onClick={() => {
                        setBrowseSearchQuery('');
                        setBrowseStartDate('');
                        setBrowseEndDate('');
                        setBrowseTablePage(1);
                      }}
                      className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    >
                      重置
                    </button>
                  </div>
                </div>

                {/* 流水表格 */}
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                        <tr>
                          <th className="py-3 px-3 text-center">序号</th>
                          <th className="py-3 px-3 whitespace-nowrap">操作时间</th>
                          <th className="py-3 px-3 whitespace-nowrap">经办管员</th>
                          <th className="py-3 px-3 whitespace-nowrap">全宗号</th>
                          <th className="py-3 px-4 min-w-[170px] whitespace-nowrap">档号</th>
                          <th className="py-3 px-4 min-w-[260px]">题名</th>
                          <th className="py-3 px-4 min-w-[140px] whitespace-nowrap">库房位置</th>
                          <th className="py-3 px-4 whitespace-nowrap">事由/说明</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                        {paginatedBrowseLogs.length === 0 ? (
                          <tr>
                            <td colSpan={8} className="py-8 text-center text-slate-400">
                              当前库房暂无流水日志
                            </td>
                          </tr>
                        ) : (
                          paginatedBrowseLogs.map((log, idx) => (
                            <tr key={log.id} className="hover:bg-slate-50/90 dark:hover:bg-slate-800/60">
                              <td className="py-3 px-3 text-center font-mono text-slate-500">
                                {(browseTablePage - 1) * PAGE_SIZE + idx + 1}
                              </td>
                              <td className="py-3 px-3 font-mono whitespace-nowrap text-slate-600 dark:text-slate-400">
                                {log.operateTime}
                              </td>
                              <td className="py-3 px-3 font-medium">{log.operator}</td>
                              <td className="py-3 px-3 font-mono">{log.fondsNo}</td>
                              <td className="py-3 px-4 font-mono font-medium text-blue-600">{log.archiveNo}</td>
                              <td className="py-3 px-4 font-medium">{log.title}</td>
                              <td className="py-3 px-4 font-mono">{log.location}</td>
                              <td className="py-3 px-4 text-slate-500">
                                {log.reason || (log.borrower ? `借阅人：${log.borrower} (${log.dept})` : '例行流转')}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  <Pagination
                    currentPage={browseTablePage}
                    totalItems={currentBrowseLogList.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={(page) => setBrowseTablePage(page)}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===================== 子菜单 3: 日常管理 / 日常浏览 (用户3张截图对应模块) ===================== */}
      {currentSubTab === 'repo_daily' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {renderLeftTree()}

          <div className="md:col-span-9 lg:col-span-9.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs space-y-3.5">
            {/* 顶层三大标签页 (温湿度登记 / 日常情况检查 / 库房设备登记) */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => {
                    setDailyActiveTab('th_log');
                    setDailyPage(1);
                    setSelectedDailyRowIds([]);
                  }}
                  className={`pb-2.5 text-xs font-bold transition-all relative ${
                    dailyActiveTab === 'th_log'
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  温湿度登记 ({thList.filter((item) => item.repoCode === selectedTreeRepoCode).length})
                </button>
                <button
                  onClick={() => {
                    setDailyActiveTab('check_log');
                    setDailyPage(1);
                    setSelectedDailyRowIds([]);
                  }}
                  className={`pb-2.5 text-xs font-bold transition-all relative ${
                    dailyActiveTab === 'check_log'
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  日常情况检查 ({checkList.filter((item) => item.repoCode === selectedTreeRepoCode).length})
                </button>
                <button
                  onClick={() => {
                    setDailyActiveTab('device_log');
                    setDailyPage(1);
                    setSelectedDailyRowIds([]);
                  }}
                  className={`pb-2.5 text-xs font-bold transition-all relative ${
                    dailyActiveTab === 'device_log'
                      ? 'text-blue-600 dark:text-blue-400 font-extrabold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-blue-600'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                  }`}
                >
                  库房设备登记 ({deviceList.filter((item) => item.repoCode === selectedTreeRepoCode).length})
                </button>
              </div>

              <div className="text-[11px] font-mono text-slate-400 pb-2">
                库区：{currentTreeNode.name}
              </div>
            </div>

            {/* 操作按钮区与检索区 */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setDailyFormState((prev: any) => ({
                      ...prev,
                      recorder: currentTreeNode.manager,
                      time: '2026-11-06 11:30',
                      archiveType: currentTreeNode.categoryLabel,
                      location: `${currentTreeNode.repoCode}-101A-1-1-1`,
                    }));
                    setActiveModalType('daily_add');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加</span>
                </button>

                <button
                  onClick={() => {
                    if (selectedDailyRowIds.length === 0) {
                      onShowMessage('请先勾选需要编辑的一条数据');
                      return;
                    }
                    const target = currentDailyList.find((i) => i.id === selectedDailyRowIds[0]);
                    if (target) {
                      setModalTargetRecord(target);
                      setDailyFormState({
                        ...dailyFormState,
                        recorder: target.recorder || target.checker || target.registrant,
                        time: target.time || target.checkTime || target.regTime,
                        indoorTemp: target.indoorTemp?.toString() || '20.0',
                        indoorHumidity: target.indoorHumidity?.toString() || '45',
                        storageStatus: target.storageStatus || '完好',
                        issueItem: target.issueItem || '无异常',
                        deviceName: target.deviceName || '',
                        quantity: target.quantity?.toString() || '1',
                        remarks: target.remarks || '',
                      });
                      setActiveModalType('daily_edit');
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-1 shadow-xs"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>编辑</span>
                </button>

                <button
                  onClick={() => {
                    if (selectedDailyRowIds.length === 0) {
                      onShowMessage('请先勾选需要删除的数据');
                      return;
                    }
                    setActiveModalType('daily_delete');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-1 shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除</span>
                </button>

                <button
                  onClick={() => setActiveModalType('daily_print')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 flex items-center gap-1 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印</span>
                </button>
              </div>

              {/* 日常情况检查 & 库房设备登记的检索栏 */}
              {(dailyActiveTab === 'check_log' || dailyActiveTab === 'device_log') && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-500 whitespace-nowrap">
                    {dailyActiveTab === 'check_log' ? '检查时间：' : '登记时间：'}
                  </span>
                  <input
                    type="date"
                    value={dailySearchStartDate}
                    onChange={(e) => setDailySearchStartDate(e.target.value)}
                    className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  />
                  <span className="text-slate-400">—</span>
                  <input
                    type="date"
                    value={dailySearchEndDate}
                    onChange={(e) => setDailySearchEndDate(e.target.value)}
                    className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
                  />

                  <span className="text-slate-500 ml-1 whitespace-nowrap">
                    {dailyActiveTab === 'check_log' ? '题名：' : '设备名称：'}
                  </span>
                  <input
                    type="text"
                    value={dailySearchQuery}
                    onChange={(e) => setDailySearchQuery(e.target.value)}
                    placeholder="输入检索词..."
                    className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs w-36"
                  />

                  <button
                    onClick={() => setDailyPage(1)}
                    className="px-3 py-1 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  >
                    检索
                  </button>
                </div>
              )}
            </div>

            {/* 表格呈现区 */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            paginatedDailyList.length > 0 &&
                            selectedDailyRowIds.length === paginatedDailyList.length
                          }
                          onChange={handleToggleSelectAllDaily}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                      </th>
                      <th className="py-3 px-3 text-center w-12">序号</th>

                      {/* Tab 1: 温湿度登记 */}
                      {dailyActiveTab === 'th_log' && (
                        <>
                          <th className="py-3 px-4 min-w-[150px] whitespace-nowrap">时间</th>
                          <th className="py-3 px-3 whitespace-nowrap">记录人</th>
                          <th className="py-3 px-3 text-center whitespace-nowrap">室内温度(°C)</th>
                          <th className="py-3 px-3 text-center whitespace-nowrap">室内湿度(%RH)</th>
                          <th className="py-3 px-3 text-center whitespace-nowrap">室外温度(°C)</th>
                          <th className="py-3 px-3 text-center whitespace-nowrap">室外湿度(%RH)</th>
                          <th className="py-3 px-4 min-w-[180px]">运行备注</th>
                        </>
                      )}

                      {/* Tab 2: 日常情况检查 */}
                      {dailyActiveTab === 'check_log' && (
                        <>
                          <th className="py-3 px-3 whitespace-nowrap">检查时间</th>
                          <th className="py-3 px-3 whitespace-nowrap">检查人</th>
                          <th className="py-3 px-4 min-w-[160px] whitespace-nowrap">档号</th>
                          <th className="py-3 px-4 min-w-[260px]">题名</th>
                          <th className="py-3 px-4 min-w-[140px] whitespace-nowrap">库房位置</th>
                          <th className="py-3 px-3 whitespace-nowrap">档案类型</th>
                          <th className="py-3 px-3 whitespace-nowrap">存储状态</th>
                          <th className="py-3 px-3 whitespace-nowrap">问题项</th>
                        </>
                      )}

                      {/* Tab 3: 库房设备登记 */}
                      {dailyActiveTab === 'device_log' && (
                        <>
                          <th className="py-3 px-3 whitespace-nowrap">登记时间</th>
                          <th className="py-3 px-3 whitespace-nowrap">登记人</th>
                          <th className="py-3 px-4 min-w-[240px]">设备名称</th>
                          <th className="py-3 px-3 text-center whitespace-nowrap">数量</th>
                          <th className="py-3 px-4 min-w-[200px]">备注</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                    {paginatedDailyList.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-8 text-center text-slate-400">
                          当前库区暂无记录，可点击上方【添加】创建
                        </td>
                      </tr>
                    ) : (
                      paginatedDailyList.map((row: any, index: number) => {
                        const isRowSelected = selectedDailyRowIds.includes(row.id);
                        return (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/90 dark:hover:bg-slate-800/60 transition-colors ${
                              isRowSelected ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''
                            }`}
                          >
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isRowSelected}
                                onChange={() => handleToggleDailyRow(row.id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                              />
                            </td>
                            <td className="py-3 px-3 text-center font-mono text-slate-500">
                              {(dailyPage - 1) * PAGE_SIZE + index + 1}
                            </td>

                            {/* Tab 1 行数据 */}
                            {dailyActiveTab === 'th_log' && (
                              <>
                                <td className="py-3 px-4 font-mono whitespace-nowrap text-slate-600 dark:text-slate-400">
                                  {row.time}
                                </td>
                                <td className="py-3 px-3 font-medium">{row.recorder}</td>
                                <td className="py-3 px-3 text-center font-mono font-bold text-blue-600 dark:text-blue-400">
                                  {row.indoorTemp}
                                </td>
                                <td className="py-3 px-3 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  {row.indoorHumidity}
                                </td>
                                <td className="py-3 px-3 text-center font-mono text-slate-500">
                                  {row.outdoorTemp}
                                </td>
                                <td className="py-3 px-3 text-center font-mono text-slate-500">
                                  {row.outdoorHumidity}
                                </td>
                                <td className="py-3 px-4 text-slate-500">
                                  {row.remarks || '—'}
                                </td>
                              </>
                            )}

                            {/* Tab 2 行数据 */}
                            {dailyActiveTab === 'check_log' && (
                              <>
                                <td className="py-3 px-3 font-mono whitespace-nowrap text-slate-600 dark:text-slate-400">
                                  {row.checkTime}
                                </td>
                                <td className="py-3 px-3 font-medium">{row.checker}</td>
                                <td className="py-3 px-4 font-mono font-medium text-blue-600">
                                  {row.archiveNo}
                                </td>
                                <td className="py-3 px-4 font-medium">{row.title}</td>
                                <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                                  {row.location}
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                                  {row.archiveType}
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                                    {row.storageStatus}
                                  </span>
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
                                  {row.issueItem}
                                </td>
                              </>
                            )}

                            {/* Tab 3 行数据 */}
                            {dailyActiveTab === 'device_log' && (
                              <>
                                <td className="py-3 px-3 font-mono whitespace-nowrap text-slate-600 dark:text-slate-400">
                                  {row.regTime}
                                </td>
                                <td className="py-3 px-3 font-medium">{row.registrant}</td>
                                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                                  {row.deviceName}
                                </td>
                                <td className="py-3 px-3 text-center font-mono font-bold text-blue-600">
                                  {row.quantity}
                                </td>
                                <td className="py-3 px-4 text-slate-500">
                                  {row.remarks}
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* 分页组件 (严格10条/页) */}
              <Pagination
                currentPage={dailyPage}
                totalItems={currentDailyList.length}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => setDailyPage(page)}
              />
            </div>
          </div>
        </div>
      )}

      {/* ===================== 子菜单 4: 库房统计 (全馆及库房高保真智能统计大盘) ===================== */}
      {currentSubTab === 'repo_stats' && (() => {
        // 计算当前筛选条件下的排架统计数据
        const filteredRackStats = rackStatsList.filter((item) => {
          const matchScope = statsScope === 'all' || item.repoCode === selectedTreeRepoCode;
          let matchUsage = true;
          if (statsUsageFilter === 'high') matchUsage = item.usageRate >= 80;
          else if (statsUsageFilter === 'medium') matchUsage = item.usageRate >= 50 && item.usageRate < 80;
          else if (statsUsageFilter === 'low') matchUsage = item.usageRate < 50;

          const matchQuery =
            !statsSearchQuery ||
            item.rackCode.includes(statsSearchQuery) ||
            item.rackType.includes(statsSearchQuery) ||
            item.manager.includes(statsSearchQuery) ||
            item.repoName.includes(statsSearchQuery);

          return matchScope && matchUsage && matchQuery;
        });

        const STATS_PAGE_SIZE = 10;
        const paginatedRackStats = filteredRackStats.slice(
          (statsPage - 1) * STATS_PAGE_SIZE,
          statsPage * STATS_PAGE_SIZE
        );

        // 计算当前视角的指标汇总
        const targetRacks = rackStatsList.filter((r) => statsScope === 'all' || r.repoCode === selectedTreeRepoCode);
        const totalVolumeCount = targetRacks.reduce((acc, cur) => acc + cur.volumeCount, 0);
        const totalBoxCount = targetRacks.reduce((acc, cur) => acc + cur.boxCount, 0);
        const totalSlotsCount = targetRacks.reduce((acc, cur) => acc + cur.totalSlots, 0);
        const totalUsedSlots = targetRacks.reduce((acc, cur) => acc + cur.usedSlots, 0);
        const avgUsageRate = targetRacks.length > 0 ? (totalUsedSlots / totalSlotsCount) * 100 : 0;

        return (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {renderLeftTree()}

            <div className="md:col-span-9 lg:col-span-9.5 space-y-3.5">
              {/* 1. 顶部控制与态势栏 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                      {statsScope === 'all' ? '全馆所有库房汇总统计' : `当前库区：${currentTreeNode.fullName}`}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      责任管理员: {currentTreeNode.manager}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 mt-1">
                    <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    <span>
                      {statsScope === 'all'
                        ? '成都市档案馆全馆库房容量与密集架资产统计'
                        : `${currentTreeNode.name} · 排架负荷与智能微环境监控`}
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    基于物联网IoT传感器实时采集温湿度、密集架开合状态及RFID在架盘点数据（更新基准：2026年11月）。
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setShowCapacityForecastModal(true)}
                    className="px-3 py-1.5 rounded-lg border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold hover:bg-indigo-100 flex items-center gap-1.5 transition-colors"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                    <span>库容智能推演</span>
                  </button>

                  <button
                    onClick={() => onShowMessage(`已向 [${currentTreeNode.name}] 密集架控制系统发送微循环通风指令`)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5 transition-colors"
                  >
                    <Wind className="w-3.5 h-3.5 text-blue-600" />
                    <span>排架智能通风</span>
                  </button>

                  <button
                    onClick={() => onShowMessage(`已成功导出 [${currentTreeNode.name}] 库房统计与资产明细报表 (Excel/PDF)`)}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出统计报表</span>
                  </button>
                </div>
              </div>

              {/* 2. 核心 4 大指标大卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">统计在库卷数</span>
                    <span className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600">
                      <Layers className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-slate-900 dark:text-white">
                    {totalVolumeCount.toLocaleString()} <span className="text-xs font-normal text-slate-500">卷</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>档案盒: {totalBoxCount.toLocaleString()} 盒</span>
                    <span className="text-emerald-600 font-medium">RFID绑订 100%</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">密集架格位使用率</span>
                    <span className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                      <BarChart3 className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                    {avgUsageRate.toFixed(1)}%
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>已用 {totalUsedSlots} / 总 {totalSlotsCount} 格</span>
                    <span className="text-indigo-600 font-mono">余 {totalSlotsCount - totalUsedSlots}格</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">库房微环境达标率</span>
                    <span className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600">
                      <Thermometer className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                    99.8%
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>恒温 19.4℃ · 恒湿 52%RH</span>
                    <span className="text-emerald-600 font-medium">国标一级</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-500">库房安全与“八防”指数</span>
                    <span className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600">
                      <ShieldCheck className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="mt-2 text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
                    100.0 <span className="text-xs font-normal text-slate-500">分</span>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>七氟丙烷灭火与防盗</span>
                    <span className="text-emerald-600 font-medium">全域布防中</span>
                  </div>
                </div>
              </div>

              {/* 3. 两个可视化深度分析大面板 */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                {/* 面板 1: 全馆 7 大实体库房负荷对比与利用率走势 */}
                <div className="md:col-span-7 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <PieChart className="w-4 h-4 text-indigo-600" />
                      <span>全馆 7 大实体库房容量负荷对比与库容预警</span>
                    </div>
                    <span className="text-[11px] text-slate-500 font-mono">总库容 180万卷 (使用率 72.6%)</span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    {repoTreeNodes.map((n) => {
                      const isSelected = n.repoCode === selectedTreeRepoCode;
                      // 各库房设计库容与实际在库
                      const capacityMap: Record<string, { total: number; stored: number; rate: number; tag: string }> = {
                        '11': { total: 700000, stored: 556400, rate: 79.5, tag: '高负荷' },
                        '12': { total: 300000, stored: 238100, rate: 79.4, tag: '适中' },
                        '13': { total: 250000, stored: 191200, rate: 76.5, tag: '适中' },
                        '14': { total: 180000, stored: 109800, rate: 61.0, tag: '充裕' },
                        '15': { total: 120000, stored: 95600, rate: 79.7, tag: '低温特藏' },
                        '16': { total: 150000, stored: 66800, rate: 44.5, tag: '防磁屏蔽' },
                        '17': { total: 100000, stored: 50120, rate: 50.1, tag: '充氮保护' },
                      };
                      const cap = capacityMap[n.repoCode] || { total: 200000, stored: 120000, rate: 60, tag: '正常' };

                      return (
                        <div
                          key={n.id}
                          onClick={() => handleSelectTreeRepo(n.repoCode)}
                          className={`p-2 rounded-lg cursor-pointer transition-all border ${
                            isSelected
                              ? 'bg-indigo-50/60 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/80 shadow-2xs'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-1.5 font-medium">
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{n.name}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({n.repoCode}号库)</span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {cap.tag}
                              </span>
                            </div>
                            <div className="text-right font-mono text-[11px]">
                              <span className="font-bold text-slate-900 dark:text-white">
                                {(cap.stored / 10000).toFixed(1)}万
                              </span>
                              <span className="text-slate-400"> / {(cap.total / 10000).toFixed(0)}万卷 </span>
                              <span className={`font-bold ml-1 ${cap.rate > 78 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                ({cap.rate}%)
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isSelected
                                  ? 'bg-indigo-600'
                                  : cap.rate > 78
                                  ? 'bg-amber-500'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${cap.rate}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 面板 2: 当前库房排架立体热力占用矩阵与设备保障 */}
                <div className="md:col-span-5 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                      <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Box className="w-4 h-4 text-blue-600" />
                        <span>{currentTreeNode.name} · 排架立体空间占用状态</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium">IoT 在线</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-3">
                      {targetRacks.slice(0, 6).map((rack) => (
                        <div
                          key={rack.id}
                          onClick={() => setSelectedStatsRack(rack)}
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600">
                              {rack.rackCode}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              {rack.usedSlots}/{rack.totalSlots}格
                            </span>
                          </div>
                          <div className="mt-1.5 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-500">{rack.volumeCount}卷</span>
                            <span className={`font-bold ${rack.usageRate > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                              {rack.usageRate}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1 mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${rack.usageRate > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                              style={{ width: `${rack.usageRate}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 库房安防巡检与保障状态 */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      特种微环境传感器实时监测指标：
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span className="text-slate-500">室内温度:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">19.4℃</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span className="text-slate-500">相对湿度:</span>
                        <span className="font-mono font-bold text-slate-800 dark:text-slate-200">52.0%RH</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span className="text-slate-500">七氟丙烷压力:</span>
                        <span className="font-mono font-bold text-emerald-600">4.2 MPa 正常</span>
                      </div>
                      <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 flex items-center justify-between">
                        <span className="text-slate-500">安防巡检:</span>
                        <span className="font-mono font-bold text-emerald-600">已闭环完成</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. 统计表格筛选过滤工具栏 */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* 统计范围切换 (查看当前库房 / 查看全馆汇总) */}
                    <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <button
                        onClick={() => {
                          setStatsScope('current');
                          setStatsPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                          statsScope === 'current'
                            ? 'bg-white dark:bg-slate-900 text-indigo-600 font-bold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        当前库房排架 ({rackStatsList.filter((r) => r.repoCode === selectedTreeRepoCode).length}条)
                      </button>
                      <button
                        onClick={() => {
                          setStatsScope('all');
                          setStatsPage(1);
                        }}
                        className={`px-3 py-1.5 rounded-md transition-all font-medium ${
                          statsScope === 'all'
                            ? 'bg-white dark:bg-slate-900 text-indigo-600 font-bold shadow-2xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                        }`}
                      >
                        全馆所有库房汇总 ({rackStatsList.length}条)
                      </button>
                    </div>

                    {/* 负荷率等级过滤 */}
                    <div className="flex items-center gap-1.5 ml-2 text-slate-600 dark:text-slate-400 font-medium">
                      <span>负荷等级：</span>
                    </div>
                    <select
                      value={statsUsageFilter}
                      onChange={(e) => {
                        setStatsUsageFilter(e.target.value as any);
                        setStatsPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="all">全部负荷区间</option>
                      <option value="high">高负荷 (≥80%)</option>
                      <option value="medium">适中负荷 (50%~80%)</option>
                      <option value="low">充裕负荷 (&lt;50%)</option>
                    </select>

                    {/* 检索框 */}
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={statsSearchQuery}
                        onChange={(e) => {
                          setStatsSearchQuery(e.target.value);
                          setStatsPage(1);
                        }}
                        placeholder="检索架号 / 排架类型 / 管理员..."
                        className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-52 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setStatsScope('current');
                        setStatsUsageFilter('all');
                        setStatsSearchQuery('');
                        setStatsPage(1);
                        onShowMessage('已重置排架统计筛选条件');
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>重置</span>
                    </button>

                    <button
                      onClick={() => onShowMessage('已导出排架格位资产与负荷明细台账 (Excel)')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>导出排架台账</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 5. 10条/页完整数据表格 */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-3.5 whitespace-nowrap text-center w-12">序号</th>
                        <th className="py-3 px-3.5 whitespace-nowrap">库房编号</th>
                        <th className="py-3 px-3.5 whitespace-nowrap">库房名称</th>
                        <th className="py-3 px-3.5 whitespace-nowrap">排架号</th>
                        <th className="py-3 px-3.5 min-w-[150px]">密集架类型</th>
                        <th className="py-3 px-3.5 whitespace-nowrap text-right">格位使用 (已用/总数)</th>
                        <th className="py-3 px-3.5 whitespace-nowrap text-right">在库盒数</th>
                        <th className="py-3 px-3.5 whitespace-nowrap text-right">在库档案卷数</th>
                        <th className="py-3 px-3.5 whitespace-nowrap text-center min-w-[110px]">库容负荷率</th>
                        <th className="py-3 px-3.5 whitespace-nowrap">实时微环境</th>
                        <th className="py-3 px-3.5 whitespace-nowrap">安防巡检</th>
                        <th className="py-3 px-3.5 whitespace-nowrap">责任人</th>
                        <th className="py-3 px-3.5 whitespace-nowrap text-right">操作</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                      {paginatedRackStats.map((row, idx) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-3.5 text-center font-mono text-slate-400">
                            {(statsPage - 1) * STATS_PAGE_SIZE + idx + 1}
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                            {row.repoCode}号库
                          </td>
                          <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            {row.repoName}
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {row.rackCode}
                          </td>
                          <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {row.rackType}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 font-mono text-right whitespace-nowrap">
                            <span className="font-bold text-slate-900 dark:text-slate-100">{row.usedSlots}</span>
                            <span className="text-slate-400"> / {row.totalSlots}格</span>
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-400 text-right whitespace-nowrap">
                            {row.boxCount.toLocaleString()} 盒
                          </td>
                          <td className="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
                            {row.volumeCount.toLocaleString()} 卷
                          </td>
                          <td className="py-3 px-3.5 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              <span className={`font-mono font-bold text-xs ${row.usageRate > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {row.usageRate}%
                              </span>
                              <div className="w-12 bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${row.usageRate > 80 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                                  style={{ width: `${row.usageRate}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{row.tempReading}</span> ｜ {row.humidityReading}
                          </td>
                          <td className="py-3 px-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                              {row.safetyCheck}
                            </span>
                          </td>
                          <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {row.manager}
                          </td>
                          <td className="py-3 px-3.5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setSelectedStatsRack(row)}
                                className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-medium transition-colors"
                              >
                                架位明细
                              </button>
                              <button
                                onClick={() => onShowMessage(`已对【${row.repoName} · ${row.rackCode}】启动列间安全间距自检`)}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium transition-colors"
                              >
                                调控
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {paginatedRackStats.length === 0 && (
                        <tr>
                          <td colSpan={13} className="py-12 text-center text-slate-400">
                            未找到符合条件的排架库容统计记录
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 6. 每页10条分页组件 */}
                <Pagination
                  currentPage={statsPage}
                  totalItems={filteredRackStats.length}
                  pageSize={STATS_PAGE_SIZE}
                  onPageChange={(page) => setStatsPage(page)}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* ===================== 功能弹窗 1: 添加记录弹窗 ===================== */}
      {activeModalType === 'daily_add' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  {dailyActiveTab === 'th_log' && `录入 [${currentTreeNode.name}] 温湿度数据`}
                  {dailyActiveTab === 'check_log' && `添加 [${currentTreeNode.name}] 日常检查记录`}
                  {dailyActiveTab === 'device_log' && `登记 [${currentTreeNode.name}] 专用设备`}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                    经办人 / 记录人
                  </label>
                  <input
                    type="text"
                    value={dailyFormState.recorder}
                    onChange={(e) => setDailyFormState({ ...dailyFormState, recorder: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                    记录时间
                  </label>
                  <input
                    type="text"
                    value={dailyFormState.time}
                    onChange={(e) => setDailyFormState({ ...dailyFormState, time: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Tab 1 专属字段 */}
              {dailyActiveTab === 'th_log' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        室内温度(°C)
                      </label>
                      <input
                        type="text"
                        value={dailyFormState.indoorTemp}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, indoorTemp: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        室内湿度(%RH)
                      </label>
                      <input
                        type="text"
                        value={dailyFormState.indoorHumidity}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, indoorHumidity: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        室外温度(°C)
                      </label>
                      <input
                        type="text"
                        value={dailyFormState.outdoorTemp}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, outdoorTemp: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        室外湿度(%RH)
                      </label>
                      <input
                        type="text"
                        value={dailyFormState.outdoorHumidity}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, outdoorHumidity: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Tab 2 专属字段 */}
              {dailyActiveTab === 'check_log' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        档号
                      </label>
                      <input
                        type="text"
                        value={dailyFormState.archiveNo}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, archiveNo: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        库房位置
                      </label>
                      <input
                        type="text"
                        value={dailyFormState.location}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, location: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                      题名 (真实公文/档案名称)
                    </label>
                    <input
                      type="text"
                      value={dailyFormState.title}
                      onChange={(e) => setDailyFormState({ ...dailyFormState, title: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        存储状态
                      </label>
                      <select
                        value={dailyFormState.storageStatus}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, storageStatus: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        <option value="完好">完好</option>
                        <option value="正常">正常</option>
                        <option value="需除尘">需除尘</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        问题排查项
                      </label>
                      <select
                        value={dailyFormState.issueItem}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, issueItem: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      >
                        <option value="无异常">无异常</option>
                        <option value="微偏已自动调控">微偏已自动调控</option>
                        <option value="滤网需吸尘清理">滤网需吸尘清理</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Tab 3 专属字段 */}
              {dailyActiveTab === 'device_log' && (
                <>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        设备名称
                      </label>
                      <input
                        type="text"
                        value={dailyFormState.deviceName}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, deviceName: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                        数量
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={dailyFormState.quantity}
                        onChange={(e) => setDailyFormState({ ...dailyFormState, quantity: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center font-mono"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                      设备维保及巡查备注
                    </label>
                    <textarea
                      rows={2}
                      value={dailyFormState.remarks}
                      onChange={(e) => setDailyFormState({ ...dailyFormState, remarks: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    ></textarea>
                  </div>
                </>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModalType(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDailyAdd}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"
              >
                保存记录
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 功能弹窗 2: 编辑弹窗 ===================== */}
      {activeModalType === 'daily_edit' && modalTargetRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  编辑记录数据
                </h3>
              </div>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                    经办人
                  </label>
                  <input
                    type="text"
                    value={dailyFormState.recorder}
                    onChange={(e) => setDailyFormState({ ...dailyFormState, recorder: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                    时间
                  </label>
                  <input
                    type="text"
                    value={dailyFormState.time}
                    onChange={(e) => setDailyFormState({ ...dailyFormState, time: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {dailyActiveTab === 'th_log' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                      室内温度(°C)
                    </label>
                    <input
                      type="text"
                      value={dailyFormState.indoorTemp}
                      onChange={(e) => setDailyFormState({ ...dailyFormState, indoorTemp: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                      室内湿度(%RH)
                    </label>
                    <input
                      type="text"
                      value={dailyFormState.indoorHumidity}
                      onChange={(e) => setDailyFormState({ ...dailyFormState, indoorHumidity: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModalType(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDailyEdit}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 功能弹窗 3: 删除确认弹窗 ===================== */}
      {activeModalType === 'daily_delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/60 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">确认删除记录？</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  将永久删除已勾选的 {selectedDailyRowIds.length} 条数据，该操作不可撤销。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setActiveModalType(null)}
                className="px-3.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDailyDelete}
                className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 text-xs font-semibold shadow-xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 功能弹窗 4: 打印预览弹窗 ===================== */}
      {activeModalType === 'daily_print' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  档案馆日常情况台账打印预览
                </h3>
              </div>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs bg-slate-50 dark:bg-slate-950/60 max-h-[460px] overflow-y-auto">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    成都市档案馆 - {currentTreeNode.fullName}日常监测与安全巡检表
                  </h2>
                  <div className="text-[11px] font-mono text-slate-500">
                    报表周期：2026年11月 ｜ 打印生成时间：2026-11-06 11:30 ｜ 经办管员：{currentTreeNode.manager}
                  </div>
                </div>

                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="p-2">序号</th>
                        <th className="p-2">记录时间</th>
                        <th className="p-2">记录人员</th>
                        <th className="p-2">核查要项</th>
                        <th className="p-2">实测数值/结论</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {paginatedDailyList.slice(0, 5).map((row: any, idx: number) => (
                        <tr key={row.id}>
                          <td className="p-2 font-mono">{idx + 1}</td>
                          <td className="p-2 font-mono">{row.time || row.checkTime || row.regTime}</td>
                          <td className="p-2">{row.recorder || row.checker || row.registrant}</td>
                          <td className="p-2">{row.title || row.deviceName || '温湿度恒温恒湿'}</td>
                          <td className="p-2 font-mono text-emerald-600 font-semibold">
                            {row.indoorTemp ? `${row.indoorTemp}°C / ${row.indoorHumidity}%` : row.storageStatus || '合格在用'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700 text-[11px] text-slate-500">
                  <div>安防保密复核：已复核无误</div>
                  <div>档案主管签字：________________</div>
                </div>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModalType(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium"
              >
                关闭
              </button>
              <button
                onClick={() => {
                  onShowMessage(`已发送打印任务至档案馆激光打印机（${currentTreeNode.name}打印节点）！`);
                  setActiveModalType(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"
              >
                立即打印输出
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 功能弹窗 5: 上架操作弹窗 ===================== */}
      {activeModalType === 'put_shelf' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  档案实体上架入库
                </h3>
              </div>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                  选择待上架档案
                </label>
                <select
                  defaultValue={manageArchives.find((i) => i.repoCode === selectedTreeRepoCode && i.status === '待上架')?.id}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  {manageArchives
                    .filter((i) => i.repoCode === selectedTreeRepoCode && i.status === '待上架')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.archiveNo} ({item.title})
                      </option>
                    ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                    目标密集架及面
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={`${currentTreeNode.fullName} - ${selectedRackSide}`}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-mono text-slate-600 dark:text-slate-300"
                  />
                </div>
                <div>
                  <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                    上架排位号
                  </label>
                  <input
                    type="text"
                    defaultValue={`${selectedTreeRepoCode}-155A-1-2-4`}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                  执行上架管员
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentTreeNode.manager}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-medium"
                />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModalType(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const targetWaiting = manageArchives.find(
                    (i) => i.repoCode === selectedTreeRepoCode && i.status === '待上架'
                  );
                  if (targetWaiting) {
                    setManageArchives((prev) =>
                      prev.map((it) =>
                        it.id === targetWaiting.id
                          ? { ...it, status: '已上架', location: `${selectedTreeRepoCode}-155A-1-2-4` }
                          : it
                      )
                    );
                  }
                  onShowMessage(`档案已成功完成定位并正式上架进入 [${currentTreeNode.name}] 密集架！`);
                  setActiveModalType(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 text-xs font-semibold"
              >
                确认上架
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 功能弹窗 6: 下架操作弹窗 ===================== */}
      {activeModalType === 'take_shelf' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ArrowDownRight className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  档案下架与暂存出库
                </h3>
              </div>
              <button
                onClick={() => setActiveModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                  选择需下架档案
                </label>
                <select
                  defaultValue={manageArchives.find((i) => i.repoCode === selectedTreeRepoCode && i.status === '已上架')?.id}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  {manageArchives
                    .filter((i) => i.repoCode === selectedTreeRepoCode && i.status === '已上架')
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.archiveNo} ({item.title})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                  下架事由
                </label>
                <select
                  defaultValue="借阅调卷出库"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-medium"
                >
                  <option value="借阅调卷出库">档案借阅利用调卷</option>
                  <option value="数字化扫描加工">高精度无损数字化扫描加工</option>
                  <option value="档案修裱保护">破损修裱及脱酸保护保养</option>
                  <option value="库房架位调优重排">架位空间优化与类目归整重排</option>
                </select>
              </div>
              <div>
                <label className="text-slate-600 dark:text-slate-400 font-medium block mb-1">
                  经办管员
                </label>
                <input
                  type="text"
                  readOnly
                  value={currentTreeNode.manager}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 font-medium"
                />
              </div>
            </div>
            <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-2">
              <button
                onClick={() => setActiveModalType(null)}
                className="px-4 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  const targetActive = manageArchives.find(
                    (i) => i.repoCode === selectedTreeRepoCode && i.status === '已上架'
                  );
                  if (targetActive) {
                    setManageArchives((prev) =>
                      prev.map((it) =>
                        it.id === targetActive.id ? { ...it, status: '待上架', location: '待重分配' } : it
                      )
                    );
                  }
                  onShowMessage(`已完成下架操作，档案状态已变更为待上架！`);
                  setActiveModalType(null);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold"
              >
                确认下架
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 功能弹窗 6: 排架立体结构与格位明细弹窗 ===================== */}
      {selectedStatsRack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    排架立体结构与格位明细：【{selectedStatsRack.repoName} · {selectedStatsRack.rackCode}】
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    排架类型: {selectedStatsRack.rackType} ｜ 责任人: {selectedStatsRack.manager}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStatsRack(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 统计指标卡 */}
            <div className="grid grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 text-[11px]">格位利用</span>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {selectedStatsRack.usedSlots} / {selectedStatsRack.totalSlots} 格
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 text-[11px]">在库卷数</span>
                <div className="font-mono font-bold text-indigo-600 text-sm mt-0.5">
                  {selectedStatsRack.volumeCount.toLocaleString()} 卷
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 text-[11px]">负荷利用率</span>
                <div className={`font-mono font-bold text-sm mt-0.5 ${selectedStatsRack.usageRate > 80 ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {selectedStatsRack.usageRate}%
                </div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60">
                <span className="text-slate-400 text-[11px]">温湿度传感器</span>
                <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {selectedStatsRack.tempReading} ｜ {selectedStatsRack.humidityReading}
                </div>
              </div>
            </div>

            {/* 密集架立面 6层 x 4节 格位占用仿真图 */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  密集架正面立面层格状态仿真 (6层 × 4节)
                </span>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-indigo-600"></span> 已满载
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-blue-400"></span> 半满在用
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-xs bg-slate-200 dark:bg-slate-700"></span> 空闲格位
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {Array.from({ length: 24 }).map((_, idx) => {
                  const tier = 6 - Math.floor(idx / 4);
                  const col = (idx % 4) + 1;
                  const isFull = idx % 3 === 0;
                  const isHalf = idx % 3 === 1;

                  return (
                    <div
                      key={idx}
                      title={`第${tier}层 第${col}格位 (存盒标号: ${selectedStatsRack.repoCode}-${selectedStatsRack.rackCode.replace('架','')}-${tier}-${col})`}
                      className={`h-9 rounded-md border flex flex-col items-center justify-center p-1 text-[10px] font-mono transition-all hover:scale-105 cursor-pointer ${
                        isFull
                          ? 'bg-indigo-600/90 text-white border-indigo-700 shadow-2xs'
                          : isHalf
                          ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                          : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      <span className="font-bold leading-tight">{tier}层-{col}格</span>
                      <span className="text-[9px] opacity-80">{isFull ? '10盒已满' : isHalf ? '6盒在用' : '空置'}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 物联网与安防遥测状态 */}
            <div className="p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 text-xs space-y-1">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 font-semibold">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>智能电动密集架控制板与红外防夹联动就绪</span>
                </span>
                <span className="font-mono">最近巡检: {selectedStatsRack.lastAuditTime}</span>
              </div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
                该密集架配置有 LoRaWAN 超高频 RFID 盘点天线、双向红外防夹传感器及列间漏电急停开关，支持一键锁定、通风及自动休眠合架。
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onShowMessage(`已对【${selectedStatsRack.rackCode}】启动列间安全间距自检并开启微循环通风！`);
                  setSelectedStatsRack(null);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5"
              >
                <Wind className="w-4 h-4" />
                <span>开启排架通风调控</span>
              </button>
              <button
                onClick={() => setSelectedStatsRack(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================== 功能弹窗 7: 库容智能推演与预警测算模型弹窗 ===================== */}
      {showCapacityForecastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-600" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">
                    全馆智能库容推演与扩容预警测算模型 (2026-2035)
                  </h3>
                  <p className="text-xs text-slate-500">
                    依据成都市“十四五”与“十五五”数字档案事业规划预测推演
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCapacityForecastModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200">库容耗尽预警倒计时</span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                    约 4.8 年后达到 90% 警戒线
                  </span>
                </div>
                <div className="text-slate-500 leading-relaxed text-[11px]">
                  目前全馆剩余库容为 491,980 卷。按近3年年均新增归档 4.8万卷（增长率约为3.8%）测算，文书档案库房与基建档案库房预计将于 2030 年第三季度达到高负荷饱和状态。
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-800 dark:text-slate-200">专家系统智能应对建议：</div>
                <ul className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] list-disc list-inside">
                  <li>建议在 2028 年前启动二期新馆特藏高密立体库房扩建规划；</li>
                  <li>加快推进到期文书与会计档案合规鉴定销毁流程，腾退约 8.5 万卷冗余库位；</li>
                  <li>全面推行“电子公文单套制归档”，减少实体低利用率纸质档案入库占比；</li>
                  <li>优先利用设备库房（负荷仅61%）与声像库房闲置密集架进行跨库调配。</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onShowMessage('已下载《成都市数字档案馆智能库容推演与规划分析报告》(PDF)');
                  setShowCapacityForecastModal(false);
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>下载规划推演报告 (PDF)</span>
              </button>
              <button
                onClick={() => setShowCapacityForecastModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
