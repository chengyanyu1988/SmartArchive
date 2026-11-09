import React, { useState } from 'react';
import {
  BarChart3,
  FileSpreadsheet,
  Download,
  Printer,
  Search,
  RotateCcw,
  Eye,
  CheckCircle2,
  Calendar,
  Building2,
  PieChart,
  TrendingUp,
  Layers,
  ShieldCheck,
  FileText,
  Filter,
  ArrowUpRight,
  Info,
  X,
  ChevronRight,
  ChevronDown,
  FileCheck,
  Share2,
  Folder,
  FolderOpen,
  SlidersHorizontal,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';
import { NavigationModule } from '../types/archive';

interface ArchiveReportsViewProps {
  submodule?: 'report_stats' | 'report_annual';
  onNavigate?: (module: NavigationModule) => void;
  onShowMessage: (msg: string) => void;
}

// ======================= 档案统计数据接口与真实数据集 =======================

// 树节点标识定义
export type StatTreeNodeKey =
  | 'all_repo_dist'       // 全宗统计 - 各档案库数量分布
  | 'all_year_dist'       // 全宗统计 - 档案年度分布 (截图默认)
  | 'all_maintenance'     // 全宗统计 - 历年维护情况
  | 'all_utilization'     // 全宗统计 - 历年利用情况
  | 'all_retention'       // 全宗统计 - 历年保管期限情况
  | 'repo_year_dist'      // 分档案库统计 - 档案年度分布
  | 'repo_maintenance'    // 分档案库统计 - 历年维护情况
  | 'repo_utilization'    // 分档案库统计 - 历年利用情况
  | 'repo_retention';     // 分档案库统计 - 历年保管期限情况

// 1. 各档案库数量分布数据项
interface RepoDistRecord {
  id: string;
  repoCode: string;
  repoName: string;
  category: string;
  volumeCount: number;
  fileCount: number;
  boxCount: number;
  digitalRate: string;
  capacityRate: string;
  manager: string;
}

// 2. 档案年度分布数据项 (对应截图主表，包含近10年真实数据)
interface YearDistRecord {
  id: string;
  year: string;
  volumeCount: number;      // 案卷数 (卷) - 替换张三
  fileCount: number;        // 文件数 (件)
  boxCount: number;         // 盒数 (盒)
  digitalRate: string;      // 数字化率
  fondsCount: number;       // 形成全宗数
  growthRate: string;       // 增长率
  note: string;
}

// 3. 历年维护情况数据项
interface MaintenanceRecord {
  id: string;
  year: string;
  projectName: string;      // 维护项目
  maintainType: string;     // 维护类型
  processedVolume: number;  // 处理案卷数
  processedFiles: number;   // 处理文件数
  qualifiedRate: string;    // 合规达标率
  technician: string;       // 责任技师
  status: string;           // 状态
}

// 4. 历年利用情况数据项
interface UtilizationRecord {
  id: string;
  year: string;
  personTime: number;       // 利用总人次
  borrowVolumes: number;    // 调阅案卷数
  digitalViews: number;     // 电子查阅件数
  proofCopies: number;      // 出具证明份数
  topDept: string;          // 主要借阅部门
  satisfactionRate: string; // 满意率
}

// 5. 历年保管期限情况数据项
interface RetentionRecord {
  id: string;
  year: string;
  permanentVolume: number;  // 永久保管 (卷)
  thirtyYearVolume: number; // 30年保管 (卷)
  tenYearVolume: number;    // 10年保管 (卷)
  appraisedVolume: number;  // 到期鉴定数
  disposedVolume: number;   // 合规销毁数
  extendedVolume: number;   // 延期保管数
}

// 7大实体库房定义
const repoList = [
  { code: '11', name: '文书档案库房' },
  { code: '12', name: '会计档案库房' },
  { code: '13', name: '基建档案库房' },
  { code: '14', name: '设备档案库房' },
  { code: '15', name: '照片档案库房' },
  { code: '16', name: '声像档案库房' },
  { code: '17', name: '实物档案库房' },
];

// 真实数据集合 1: 各档案库数量分布 (10条)
const mockRepoDistData: RepoDistRecord[] = [
  { id: 'rd-01', repoCode: '11号库', repoName: '文书档案库房', category: '文书档案', volumeCount: 556400, fileCount: 1682000, boxCount: 27820, digitalRate: '99.8%', capacityRate: '79.5%', manager: '王建华' },
  { id: 'rd-02', repoCode: '12号库', repoName: '会计档案库房', category: '会计档案', volumeCount: 238100, fileCount: 714300, boxCount: 11905, digitalRate: '99.5%', capacityRate: '79.4%', manager: '李志强' },
  { id: 'rd-03', repoCode: '13号库', repoName: '基建档案库房', category: '基建档案', volumeCount: 191200, fileCount: 573600, boxCount: 9560, digitalRate: '99.2%', capacityRate: '76.5%', manager: '陈海峰' },
  { id: 'rd-04', repoCode: '14号库', repoName: '设备档案库房', category: '设备档案', volumeCount: 109800, fileCount: 329400, boxCount: 5490, digitalRate: '98.9%', capacityRate: '61.0%', manager: '郑慧敏' },
  { id: 'rd-05', repoCode: '15号库', repoName: '照片档案库房', category: '照片档案', volumeCount: 95600, fileCount: 286800, boxCount: 4780, digitalRate: '100.0%', capacityRate: '79.7%', manager: '周雅婷' },
  { id: 'rd-06', repoCode: '16号库', repoName: '声像档案库房', category: '声像档案', volumeCount: 66800, fileCount: 133600, boxCount: 3340, digitalRate: '100.0%', capacityRate: '44.5%', manager: '孙培强' },
  { id: 'rd-07', repoCode: '17号库', repoName: '实物档案库房', category: '实物档案', volumeCount: 51020, fileCount: 51020, boxCount: 2551, digitalRate: '97.6%', capacityRate: '50.1%', manager: '钱学亮' },
  { id: 'rd-08', repoCode: '18号库', repoName: '科技农业特藏库', category: '科技档案', volumeCount: 42100, fileCount: 126300, boxCount: 2105, digitalRate: '99.1%', capacityRate: '58.2%', manager: '黄文杰' },
  { id: 'rd-09', repoCode: '19号库', repoName: '干部人事专档库', category: '人事档案', volumeCount: 32500, fileCount: 195000, boxCount: 1625, digitalRate: '100.0%', capacityRate: '65.0%', manager: '赵敏' },
  { id: 'rd-10', repoCode: '20号库', repoName: '重大外事文献库', category: '外事档案', volumeCount: 21400, fileCount: 64200, boxCount: 1070, digitalRate: '99.7%', capacityRate: '42.8%', manager: '林秀英' },
];

// 真实数据集合 2: 全宗统计 - 档案年度分布 (近年2017~2026年，共10条，严格满足每页10条)
const mockAllYearDistData: YearDistRecord[] = [
  { id: 'yd-2026', year: '2026', volumeCount: 48620, fileCount: 194480, boxCount: 4862, digitalRate: '99.8%', fondsCount: 146, growthRate: '+3.8%', note: '2026年1-11月政务信息化与重大项目归档' },
  { id: 'yd-2025', year: '2025', volumeCount: 51200, fileCount: 204800, boxCount: 5120, digitalRate: '99.6%', fondsCount: 145, growthRate: '+8.7%', note: '各机关事业单位年度收官综合整编' },
  { id: 'yd-2024', year: '2024', volumeCount: 49800, fileCount: 199200, boxCount: 4980, digitalRate: '99.2%', fondsCount: 142, growthRate: '+8.8%', note: '全面推行电子公文单套制归档' },
  { id: 'yd-2023', year: '2023', volumeCount: 47500, fileCount: 190000, boxCount: 4750, digitalRate: '98.8%', fondsCount: 140, growthRate: '+8.4%', note: '世界大运会专项保障档案接收' },
  { id: 'yd-2022', year: '2022', volumeCount: 45300, fileCount: 181200, boxCount: 4530, digitalRate: '98.4%', fondsCount: 138, growthRate: '+8.1%', note: '公园城市示范区建设重大工程归档' },
  { id: 'yd-2021', year: '2021', volumeCount: 43200, fileCount: 172800, boxCount: 4320, digitalRate: '97.5%', fondsCount: 135, growthRate: '+7.6%', note: '市级财政预算一体化凭证接收' },
  { id: 'yd-2020', year: '2020', volumeCount: 41800, fileCount: 167200, boxCount: 4180, digitalRate: '96.8%', fondsCount: 132, growthRate: '+7.2%', note: '疫情防控应急专项档案专题建档' },
  { id: 'yd-2019', year: '2019', volumeCount: 39500, fileCount: 158000, boxCount: 3950, digitalRate: '95.4%', fondsCount: 128, growthRate: '+6.9%', note: '天府国际机场建设一期工程档案' },
  { id: 'yd-2018', year: '2018', volumeCount: 38100, fileCount: 152400, boxCount: 3810, digitalRate: '94.0%', fondsCount: 125, growthRate: '+6.5%', note: '全市重点产业招商引资合同公证卷' },
  { id: 'yd-2017', year: '2017', volumeCount: 36400, fileCount: 145600, boxCount: 3640, digitalRate: '92.8%', fondsCount: 122, growthRate: '+6.2%', note: '国家中心城市空间规划档案移交' },
];

// 真实数据集合 3: 历年维护情况 (10条)
const mockMaintenanceData: MaintenanceRecord[] = [
  { id: 'mt-01', year: '2026', projectName: '破损历史公文抢救性脱酸与丝网加固', maintainType: '脱酸加固修复', processedVolume: 2450, processedFiles: 12250, qualifiedRate: '100.0%', technician: '王海滨', status: '已质检验收' },
  { id: 'mt-02', year: '2026', projectName: '高保真数字翻拍与彩色防霉微环境处置', maintainType: '数字化保护', processedVolume: 3100, processedFiles: 18600, qualifiedRate: '99.8%', technician: '周雅婷', status: '已质检验收' },
  { id: 'mt-03', year: '2025', projectName: '重点历史工程图纸平整修裱与去褶处理', maintainType: '图纸精修', processedVolume: 1850, processedFiles: 7400, qualifiedRate: '99.5%', technician: '刘世荣', status: '已质检验收' },
  { id: 'mt-04', year: '2025', projectName: '七氟丙烷气体灭火管网充压与传感器标定', maintainType: '安防消防维保', processedVolume: 4200, processedFiles: 21000, qualifiedRate: '100.0%', technician: '郑慧敏', status: '定期巡检合格' },
  { id: 'mt-05', year: '2024', projectName: '声像历史磁带消磁检测与无损转录翻拍', maintainType: '声像防磁维护', processedVolume: 1280, processedFiles: 3840, qualifiedRate: '100.0%', technician: '孙培强', status: '已质检验收' },
  { id: 'mt-06', year: '2024', projectName: '特藏库微循环恒温恒湿空调系统综合调优', maintainType: '微环境调控', processedVolume: 5600, processedFiles: 28000, qualifiedRate: '99.7%', technician: '王建华', status: '正常运行' },
  { id: 'mt-07', year: '2023', projectName: '纸质文书档案防虫防霉绿色环保消杀熏蒸', maintainType: '防虫防霉', processedVolume: 8200, processedFiles: 41000, qualifiedRate: '100.0%', technician: '陈海峰', status: '已复检无虫害' },
  { id: 'mt-08', year: '2023', projectName: '老旧底片胶卷冷藏特种无酸纸袋分装更换', maintainType: '保护封套更换', processedVolume: 1950, processedFiles: 9750, qualifiedRate: '99.6%', technician: '周雅婷', status: '已质检验收' },
  { id: 'mt-09', year: '2022', projectName: '全宗档案元数据条目完整性补漏复核', maintainType: '数据质量治理', processedVolume: 6400, processedFiles: 32000, qualifiedRate: '99.4%', technician: '李志强', status: '已建档入库' },
  { id: 'mt-10', year: '2022', projectName: '库区密集架机械导轨激光校准与电气润滑', maintainType: '机械系统保养', processedVolume: 4800, processedFiles: 24000, qualifiedRate: '100.0%', technician: '郑慧敏', status: '保养合格' },
];

// 真实数据集合 4: 历年利用情况 (10条)
const mockUtilizationData: UtilizationRecord[] = [
  { id: 'ut-2026', year: '2026', personTime: 12860, borrowVolumes: 8540, digitalViews: 42100, proofCopies: 1280, topDept: '成都市发展和改革委员会', satisfactionRate: '99.8%' },
  { id: 'ut-2025', year: '2025', personTime: 14200, borrowVolumes: 9820, digitalViews: 46800, proofCopies: 1450, topDept: '成都市住房和城乡建设局', satisfactionRate: '99.6%' },
  { id: 'ut-2024', year: '2024', personTime: 13850, borrowVolumes: 9410, digitalViews: 44200, proofCopies: 1390, topDept: '成都市财政局', satisfactionRate: '99.4%' },
  { id: 'ut-2023', year: '2023', personTime: 12100, borrowVolumes: 8120, digitalViews: 38500, proofCopies: 1210, topDept: '成都市规划和自然资源局', satisfactionRate: '99.2%' },
  { id: 'ut-2022', year: '2022', personTime: 10800, borrowVolumes: 7240, digitalViews: 34100, proofCopies: 1080, topDept: '成都市人力资源和社会保障局', satisfactionRate: '99.0%' },
  { id: 'ut-2021', year: '2021', personTime: 9600, borrowVolumes: 6450, digitalViews: 29800, proofCopies: 960, topDept: '成都市生态环境局', satisfactionRate: '98.8%' },
  { id: 'ut-2020', year: '2020', personTime: 8900, borrowVolumes: 5820, digitalViews: 27500, proofCopies: 890, topDept: '成都市卫生健康委员会', satisfactionRate: '98.5%' },
  { id: 'ut-2019', year: '2019', personTime: 8500, borrowVolumes: 5510, digitalViews: 25400, proofCopies: 850, topDept: '成都市交通运输局', satisfactionRate: '98.2%' },
  { id: 'ut-2018', year: '2018', personTime: 8100, borrowVolumes: 5200, digitalViews: 23600, proofCopies: 810, topDept: '成都市商务局', satisfactionRate: '98.0%' },
  { id: 'ut-2017', year: '2017', personTime: 7600, borrowVolumes: 4890, digitalViews: 21800, proofCopies: 760, topDept: '成都市经济和信息化局', satisfactionRate: '97.8%' },
];

// 真实数据集合 5: 历年保管期限情况 (10条)
const mockRetentionData: RetentionRecord[] = [
  { id: 'rt-2026', year: '2026', permanentVolume: 28400, thirtyYearVolume: 14500, tenYearVolume: 5720, appraisedVolume: 1850, disposedVolume: 120, extendedVolume: 1730 },
  { id: 'rt-2025', year: '2025', permanentVolume: 29800, thirtyYearVolume: 15200, tenYearVolume: 6200, appraisedVolume: 2100, disposedVolume: 180, extendedVolume: 1920 },
  { id: 'rt-2024', year: '2024', permanentVolume: 28900, thirtyYearVolume: 14800, tenYearVolume: 6100, appraisedVolume: 1980, disposedVolume: 150, extendedVolume: 1830 },
  { id: 'rt-2023', year: '2023', permanentVolume: 27600, thirtyYearVolume: 14100, tenYearVolume: 5800, appraisedVolume: 1750, disposedVolume: 110, extendedVolume: 1640 },
  { id: 'rt-2022', year: '2022', permanentVolume: 26400, thirtyYearVolume: 13500, tenYearVolume: 5400, appraisedVolume: 1620, disposedVolume: 90, extendedVolume: 1530 },
  { id: 'rt-2021', year: '2021', permanentVolume: 25100, thirtyYearVolume: 12900, tenYearVolume: 5200, appraisedVolume: 1510, disposedVolume: 80, extendedVolume: 1430 },
  { id: 'rt-2020', year: '2020', permanentVolume: 24300, thirtyYearVolume: 12500, tenYearVolume: 5000, appraisedVolume: 1420, disposedVolume: 70, extendedVolume: 1350 },
  { id: 'rt-2019', year: '2019', permanentVolume: 23100, thirtyYearVolume: 11800, tenYearVolume: 4600, appraisedVolume: 1350, disposedVolume: 60, extendedVolume: 1290 },
  { id: 'rt-2018', year: '2018', permanentVolume: 22200, thirtyYearVolume: 11400, tenYearVolume: 4500, appraisedVolume: 1280, disposedVolume: 50, extendedVolume: 1230 },
  { id: 'rt-2017', year: '2017', permanentVolume: 21300, thirtyYearVolume: 10900, tenYearVolume: 4200, appraisedVolume: 1210, disposedVolume: 40, extendedVolume: 1170 },
];

// ======================= 档案年报数据接口与真实数据 =======================
interface AnnualReportRecord {
  id: string;
  fondsNo: string;           // 全宗号
  orgName: string;           // 单位名称
  orgType: string;           // 机构类别
  inflowVolume2026: number;  // 2026年度收进卷数
  inflowFile2026: number;    // 2026年度收进件数
  totalVolume: number;       // 馆藏累计总卷数
  openVolume: number;        // 开放档案卷数
  digitalPages: number;      // 年度数字化加工页数
  reportStatus: '已汇总核实' | '已上报国家局' | '初审复核中';
  submitDate: string;        // 填报日期
  auditor: string;           // 审核人
}

const mockAnnualReports: AnnualReportRecord[] = [
  { id: 'ar-01', fondsNo: '0001', orgName: '成都市人民政府办公厅', orgType: '市级党政机关', inflowVolume2026: 2840, inflowFile2026: 14200, totalVolume: 68400, openVolume: 51200, digitalPages: 85200, reportStatus: '已上报国家局', submitDate: '2026-11-03', auditor: '王海滨' },
  { id: 'ar-02', fondsNo: '0012', orgName: '成都市发展和改革委员会', orgType: '市级经济部门', inflowVolume2026: 2160, inflowFile2026: 10800, totalVolume: 52100, openVolume: 39600, digitalPages: 64800, reportStatus: '已上报国家局', submitDate: '2026-11-03', auditor: '李国强' },
  { id: 'ar-03', fondsNo: '0025', orgName: '成都市经济和信息化局', orgType: '市级经济部门', inflowVolume2026: 1980, inflowFile2026: 9900, totalVolume: 43800, openVolume: 31200, digitalPages: 59400, reportStatus: '已汇总核实', submitDate: '2026-11-02', auditor: '张建军' },
  { id: 'ar-04', fondsNo: '0038', orgName: '成都市财政局', orgType: '市级综合部门', inflowVolume2026: 3420, inflowFile2026: 20520, totalVolume: 78900, openVolume: 42100, digitalPages: 123120, reportStatus: '已上报国家局', submitDate: '2026-11-02', auditor: '陈丽娜' },
  { id: 'ar-05', fondsNo: '0046', orgName: '成都市规划和自然资源局', orgType: '市级自然资源', inflowVolume2026: 4120, inflowFile2026: 16480, totalVolume: 92400, openVolume: 61800, digitalPages: 148320, reportStatus: '已上报国家局', submitDate: '2026-11-01', auditor: '赵长青' },
  { id: 'ar-06', fondsNo: '0053', orgName: '成都市住房和城乡建设局', orgType: '市级建管部门', inflowVolume2026: 3850, inflowFile2026: 15400, totalVolume: 86500, openVolume: 58200, digitalPages: 138600, reportStatus: '已汇总核实', submitDate: '2026-11-01', auditor: '周志斌' },
  { id: 'ar-07', fondsNo: '0069', orgName: '成都市人力资源和社会保障局', orgType: '市级民生部门', inflowVolume2026: 3100, inflowFile2026: 18600, totalVolume: 71200, openVolume: 45600, digitalPages: 111600, reportStatus: '已上报国家局', submitDate: '2026-10-31', auditor: '林秀英' },
  { id: 'ar-08', fondsNo: '0077', orgName: '成都市生态环境局', orgType: '市级专业执法', inflowVolume2026: 1750, inflowFile2026: 8750, totalVolume: 38400, openVolume: 26800, digitalPages: 52500, reportStatus: '已汇总核实', submitDate: '2026-10-30', auditor: '马骏' },
  { id: 'ar-09', fondsNo: '0085', orgName: '成都市交通运输局', orgType: '市级公用交通', inflowVolume2026: 2450, inflowFile2026: 12250, totalVolume: 58900, openVolume: 41200, digitalPages: 73500, reportStatus: '初审复核中', submitDate: '2026-10-29', auditor: '孙继东' },
  { id: 'ar-10', fondsNo: '0092', orgName: '成都市卫生健康委员会', orgType: '市级卫健部门', inflowVolume2026: 2890, inflowFile2026: 14450, totalVolume: 64200, openVolume: 43800, digitalPages: 86700, reportStatus: '已上报国家局', submitDate: '2026-10-28', auditor: '郭瑞华' },
  { id: 'ar-11', fondsNo: '0104', orgName: '成都市应急管理局', orgType: '市级综合防灾', inflowVolume2026: 1620, inflowFile2026: 8100, totalVolume: 35100, openVolume: 22400, digitalPages: 48600, reportStatus: '已汇总核实', submitDate: '2026-10-27', auditor: '钱立峰' },
  { id: 'ar-12', fondsNo: '0118', orgName: '成都市审计局', orgType: '市级经济监督', inflowVolume2026: 1840, inflowFile2026: 11040, totalVolume: 41200, openVolume: 28900, digitalPages: 66240, reportStatus: '已上报国家局', submitDate: '2026-10-26', auditor: '何明远' },
];

export const ArchiveReportsView: React.FC<ArchiveReportsViewProps> = ({
  submodule = 'report_stats',
  onNavigate,
  onShowMessage,
}) => {
  // Current active subtab: 'report_stats' (档案统计) or 'report_annual' (档案年报)
  const [currentTab, setCurrentTab] = useState<'report_stats' | 'report_annual'>(
    submodule === 'report_annual' ? 'report_annual' : 'report_stats'
  );

  // Sync prop changes
  React.useEffect(() => {
    if (submodule === 'report_annual' || submodule === 'report_stats') {
      setCurrentTab(submodule);
    }
  }, [submodule]);


  // ================= 档案统计 (report_stats) 状态 =================
  // 截图右上角 Tab：统计表 / 统计图
  const [statsViewMode, setStatsViewMode] = useState<'table' | 'chart'>('table');
  // 左侧档案目录树选中的节点
  const [selectedTreeNode, setSelectedTreeNode] = useState<StatTreeNodeKey>('all_year_dist');
  // 选中的特定库房 (用于分档案库统计，默认11 文书档案库房)
  const [selectedSubRepo, setSelectedSubRepo] = useState<string>('11');
  // 展开折叠状态
  const [isAllFondsExpanded, setIsAllFondsExpanded] = useState<boolean>(true);
  const [isRepoFondsExpanded, setIsRepoFondsExpanded] = useState<boolean>(true);

  // 统计时间筛选输入 (近期时间)
  const [startTime, setStartTime] = useState<string>('2026-11-01');
  const [endTime, setEndTime] = useState<string>('2026-11-06');
  // 表格分页 (每页严格10条数据)
  const [statsTablePage, setStatsTablePage] = useState<number>(1);
  const STATS_PAGE_SIZE = 10;

  // 查看行详情模态框
  const [activeDetailItem, setActiveDetailItem] = useState<any>(null);

  // ================= 档案年报 (report_annual) 状态 =================
  const [annualPage, setAnnualPage] = useState(1);
  const [annualStatusFilter, setAnnualStatusFilter] = useState('全部状态');
  const [annualOrgTypeFilter, setAnnualOrgTypeFilter] = useState('全部类别');
  const [annualSearchKey, setAnnualSearchKey] = useState('');
  const [selectedAnnualItem, setSelectedAnnualItem] = useState<AnnualReportRecord | null>(null);
  const ANNUAL_PAGE_SIZE = 10;

  // 切换左侧目录树节点
  const handleSelectTreeNode = (key: StatTreeNodeKey) => {
    setSelectedTreeNode(key);
    setStatsTablePage(1);
    const nodeNames: Record<StatTreeNodeKey, string> = {
      all_repo_dist: '各档案库数量分布',
      all_year_dist: '档案年度分布 (全宗统计)',
      all_maintenance: '历年维护情况 (全宗统计)',
      all_utilization: '历年利用情况 (全宗统计)',
      all_retention: '历年保管期限情况 (全宗统计)',
      repo_year_dist: `档案年度分布 (${repoList.find((r) => r.code === selectedSubRepo)?.name})`,
      repo_maintenance: `历年维护情况 (${repoList.find((r) => r.code === selectedSubRepo)?.name})`,
      repo_utilization: `历年利用情况 (${repoList.find((r) => r.code === selectedSubRepo)?.name})`,
      repo_retention: `历年保管期限情况 (${repoList.find((r) => r.code === selectedSubRepo)?.name})`,
    };
    onShowMessage(`已切换至目录：【${nodeNames[key]}】，右侧数据与图表已实时更新！`);
  };

  // 根据选中的左侧节点获取当前数据列表 (保证全部有数据且与左侧精准联动)
  const getActiveStatsData = () => {
    // 1. 各档案库数量分布
    if (selectedTreeNode === 'all_repo_dist') {
      return mockRepoDistData;
    }
    // 2. 全宗统计 - 档案年度分布 (严格对应截图)
    if (selectedTreeNode === 'all_year_dist') {
      return mockAllYearDistData;
    }
    // 3. 全宗统计 - 历年维护情况
    if (selectedTreeNode === 'all_maintenance') {
      return mockMaintenanceData;
    }
    // 4. 全宗统计 - 历年利用情况
    if (selectedTreeNode === 'all_utilization') {
      return mockUtilizationData;
    }
    // 5. 全宗统计 - 历年保管期限情况
    if (selectedTreeNode === 'all_retention') {
      return mockRetentionData;
    }

    // 分档案库统计分支：按当前选中的库房定制数据
    const currentRepoObj = repoList.find((r) => r.code === selectedSubRepo) || repoList[0];
    const multiplier =
      selectedSubRepo === '11' ? 1.0 : selectedSubRepo === '12' ? 0.45 : selectedSubRepo === '13' ? 0.38 : 0.22;

    if (selectedTreeNode === 'repo_year_dist') {
      return mockAllYearDistData.map((d) => ({
        ...d,
        id: `repo-${selectedSubRepo}-${d.id}`,
        volumeCount: Math.round(d.volumeCount * multiplier),
        fileCount: Math.round(d.fileCount * multiplier),
        boxCount: Math.round(d.boxCount * multiplier),
        note: `${currentRepoObj.name}独立立卷归档`,
      }));
    }
    if (selectedTreeNode === 'repo_maintenance') {
      return mockMaintenanceData.map((d) => ({
        ...d,
        id: `repo-${selectedSubRepo}-${d.id}`,
        projectName: `${currentRepoObj.name} · ${d.projectName}`,
        processedVolume: Math.round(d.processedVolume * multiplier),
        processedFiles: Math.round(d.processedFiles * multiplier),
      }));
    }
    if (selectedTreeNode === 'repo_utilization') {
      return mockUtilizationData.map((d) => ({
        ...d,
        id: `repo-${selectedSubRepo}-${d.id}`,
        personTime: Math.round(d.personTime * multiplier),
        borrowVolumes: Math.round(d.borrowVolumes * multiplier),
        digitalViews: Math.round(d.digitalViews * multiplier),
      }));
    }
    if (selectedTreeNode === 'repo_retention') {
      return mockRetentionData.map((d) => ({
        ...d,
        id: `repo-${selectedSubRepo}-${d.id}`,
        permanentVolume: Math.round(d.permanentVolume * multiplier),
        thirtyYearVolume: Math.round(d.thirtyYearVolume * multiplier),
        tenYearVolume: Math.round(d.tenYearVolume * multiplier),
      }));
    }

    return mockAllYearDistData;
  };

  const currentStatsDataList = getActiveStatsData();
  const paginatedStatsList = currentStatsDataList.slice(
    (statsTablePage - 1) * STATS_PAGE_SIZE,
    statsTablePage * STATS_PAGE_SIZE
  );

  // Filter 档案年报
  const filteredAnnualReports = mockAnnualReports.filter((item) => {
    const matchStatus =
      annualStatusFilter === '全部状态' || item.reportStatus === annualStatusFilter;
    const matchType =
      annualOrgTypeFilter === '全部类别' || item.orgType === annualOrgTypeFilter;
    const matchKey =
      !annualSearchKey ||
      item.fondsNo.includes(annualSearchKey) ||
      item.orgName.toLowerCase().includes(annualSearchKey.toLowerCase()) ||
      item.auditor.toLowerCase().includes(annualSearchKey.toLowerCase());
    return matchStatus && matchType && matchKey;
  });

  const paginatedAnnualData = filteredAnnualReports.slice(
    (annualPage - 1) * ANNUAL_PAGE_SIZE,
    annualPage * ANNUAL_PAGE_SIZE
  );

  return (
    <div className="space-y-3.5 animate-in fade-in duration-200">

      {/* ============================================================== */}
      {/* 模块 1: 档案统计 (严格按用户截图生成，含左侧目录树与右侧统计表/图)   */}
      {/* ============================================================== */}
      {currentTab === 'report_stats' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
          {/* 左侧：档案目录树 (严格对应截图) */}
          <div className="md:col-span-3 lg:col-span-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Folder className="w-4 h-4 text-blue-600" />
                  <span>档案目录树</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400">9个统计项</span>
              </div>

              {/* 树结构 */}
              <div className="space-y-2 text-xs">
                {/* 1. 全宗统计 分组 */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsAllFondsExpanded(!isAllFondsExpanded)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 font-bold bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-1.5">
                      {isAllFondsExpanded ? (
                        <FolderOpen className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Folder className="w-4 h-4 text-amber-500" />
                      )}
                      <span>全宗统计</span>
                    </div>
                    {isAllFondsExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {isAllFondsExpanded && (
                    <div className="pl-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3 py-1">
                      <button
                        onClick={() => handleSelectTreeNode('all_repo_dist')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'all_repo_dist'
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'all_repo_dist' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">各档案库数量分布</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSelectTreeNode('all_year_dist')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'all_year_dist'
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'all_year_dist' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">档案年度分布</span>
                        </div>
                        <span className={`text-[10px] font-mono px-1 rounded ${selectedTreeNode === 'all_year_dist' ? 'bg-blue-700 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                          截图
                        </span>
                      </button>

                      <button
                        onClick={() => handleSelectTreeNode('all_maintenance')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'all_maintenance'
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'all_maintenance' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">历年维护情况</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSelectTreeNode('all_utilization')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'all_utilization'
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'all_utilization' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">历年利用情况</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSelectTreeNode('all_retention')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'all_retention'
                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'all_retention' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">历年保管期限情况</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* 2. 分档案库统计 分组 */}
                <div className="space-y-1 pt-1">
                  <button
                    onClick={() => setIsRepoFondsExpanded(!isRepoFondsExpanded)}
                    className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-slate-800 dark:text-slate-200 font-bold bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/50 transition-colors text-left"
                  >
                    <div className="flex items-center gap-1.5">
                      {isRepoFondsExpanded ? (
                        <FolderOpen className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <Folder className="w-4 h-4 text-indigo-500" />
                      )}
                      <span>分档案库统计</span>
                    </div>
                    {isRepoFondsExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {isRepoFondsExpanded && (
                    <div className="pl-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-3 py-1">
                      {/* 选择特定库房 */}
                      <div className="px-1 py-1">
                        <label className="text-[10px] text-slate-400 font-medium block mb-1">
                          选择目标库房：
                        </label>
                        <select
                          value={selectedSubRepo}
                          onChange={(e) => {
                            setSelectedSubRepo(e.target.value);
                            setStatsTablePage(1);
                            const repoName = repoList.find((r) => r.code === e.target.value)?.name;
                            onShowMessage(`已切换分库统计视角至：【${repoName}】`);
                          }}
                          className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden"
                        >
                          {repoList.map((r) => (
                            <option key={r.code} value={r.code}>
                              {r.code}号 {r.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button
                        onClick={() => handleSelectTreeNode('repo_year_dist')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'repo_year_dist'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'repo_year_dist' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">档案年度分布</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSelectTreeNode('repo_maintenance')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'repo_maintenance'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'repo_maintenance' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">历年维护情况</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSelectTreeNode('repo_utilization')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'repo_utilization'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'repo_utilization' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">历年利用情况</span>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSelectTreeNode('repo_retention')}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all text-left ${
                          selectedTreeNode === 'repo_retention'
                            ? 'bg-indigo-600 text-white font-bold shadow-xs'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className={`w-3.5 h-3.5 shrink-0 ${selectedTreeNode === 'repo_retention' ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">历年保管期限情况</span>
                        </div>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 树底部提示 */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 space-y-1">
              <div>数据源：成都市数字档案馆数据中台</div>
              <div className="text-emerald-600 font-medium">● 实时链路同步正常</div>
            </div>
          </div>

          {/* 右侧：统计表 与 统计图 切换展示区 */}
          <div className="md:col-span-9 lg:col-span-9.5 space-y-3.5">
            {/* 顶部现代化标签页栏 (统计表 / 统计图，严格对应截图右上角) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-2 border-b-2 border-transparent">
                <button
                  onClick={() => setStatsViewMode('table')}
                  className={`px-4 py-1.5 text-xs font-bold transition-all relative ${
                    statsViewMode === 'table'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-2 -mb-2.5'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  统计表
                </button>
                <button
                  onClick={() => setStatsViewMode('chart')}
                  className={`px-4 py-1.5 text-xs font-bold transition-all relative ${
                    statsViewMode === 'chart'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 pb-2 -mb-2.5'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  统计图
                </button>
              </div>

              {/* 当前位置面包屑 */}
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  当前统计项：
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono font-medium">
                  {selectedTreeNode === 'all_repo_dist' && '全宗统计 · 各档案库数量分布'}
                  {selectedTreeNode === 'all_year_dist' && '全宗统计 · 档案年度分布'}
                  {selectedTreeNode === 'all_maintenance' && '全宗统计 · 历年维护情况'}
                  {selectedTreeNode === 'all_utilization' && '全宗统计 · 历年利用情况'}
                  {selectedTreeNode === 'all_retention' && '全宗统计 · 历年保管期限情况'}
                  {selectedTreeNode === 'repo_year_dist' && `分档案库统计 · ${repoList.find((r) => r.code === selectedSubRepo)?.name} · 档案年度分布`}
                  {selectedTreeNode === 'repo_maintenance' && `分档案库统计 · ${repoList.find((r) => r.code === selectedSubRepo)?.name} · 历年维护情况`}
                  {selectedTreeNode === 'repo_utilization' && `分档案库统计 · ${repoList.find((r) => r.code === selectedSubRepo)?.name} · 历年利用情况`}
                  {selectedTreeNode === 'repo_retention' && `分档案库统计 · ${repoList.find((r) => r.code === selectedSubRepo)?.name} · 历年保管期限情况`}
                </span>
              </div>
            </div>

            {/* 工具栏与查询栏 (导出、统计时间、检索，严格对应截图) */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                {/* 导出按钮 (蓝色背景，对应截图) */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onShowMessage(`已成功导出当前【${selectedTreeNode}】统计数据台账 (Excel/PDF)`)}
                    className="px-4 py-1.5 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出</span>
                  </button>

                  <button
                    onClick={() => onShowMessage('已发送打印任务：当前档案统计报表')}
                    className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>打印</span>
                  </button>
                </div>

                {/* 统计时间与检索按钮 (对应截图) */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">
                    统计时间:
                  </span>
                  <input
                    type="date"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-slate-400">—</span>
                  <input
                    type="date"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="px-2.5 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                  />

                  {/* 检索按钮 (对应截图) */}
                  <button
                    onClick={() => {
                      setStatsTablePage(1);
                      onShowMessage(`已检索【${startTime} 至 ${endTime}】期间的档案统计数据`);
                    }}
                    className="px-4 py-1.5 rounded border border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-50/60 dark:bg-blue-950/40 hover:bg-blue-100 font-medium transition-colors flex items-center gap-1"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>检索</span>
                  </button>

                  <button
                    onClick={() => {
                      setStartTime('2026-11-01');
                      setEndTime('2026-11-06');
                      setStatsTablePage(1);
                      onShowMessage('已重置统计时间范围');
                    }}
                    className="px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 transition-colors"
                  >
                    重置
                  </button>
                </div>
              </div>
            </div>

            {/* ======================= 视图模式 1: 统计表 (严格对应截图表格，每页10条) ======================= */}
            {statsViewMode === 'table' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    {/* 表头：根据选中的树节点自适应展示 */}
                    <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                      {selectedTreeNode === 'all_year_dist' || selectedTreeNode === 'repo_year_dist' ? (
                        // 截图核心对应表头：序号、年度、案卷、文件、盒数、数字化率、操作
                        <tr>
                          <th className="py-3 px-4 text-center w-14">序号</th>
                          <th className="py-3 px-4 whitespace-nowrap">年度</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">案卷 (卷)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">文件 (件)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">排架盒数 (盒)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-center">数字化率</th>
                          <th className="py-3 px-4 min-w-[200px]">说明 / 范围</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
                        </tr>
                      ) : selectedTreeNode === 'all_repo_dist' ? (
                        // 各档案库数量分布表头
                        <tr>
                          <th className="py-3 px-4 text-center w-14">序号</th>
                          <th className="py-3 px-4 whitespace-nowrap">库房编号</th>
                          <th className="py-3 px-4 whitespace-nowrap">库房名称</th>
                          <th className="py-3 px-4 whitespace-nowrap">档案门类</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">案卷数 (卷)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">文件数 (件)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">盒数 (盒)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-center">数字化率</th>
                          <th className="py-3 px-4 whitespace-nowrap text-center">库容使用率</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
                        </tr>
                      ) : selectedTreeNode === 'all_maintenance' || selectedTreeNode === 'repo_maintenance' ? (
                        // 历年维护情况表头
                        <tr>
                          <th className="py-3 px-4 text-center w-14">序号</th>
                          <th className="py-3 px-4 whitespace-nowrap">年度</th>
                          <th className="py-3 px-4 min-w-[220px]">维护项目名称</th>
                          <th className="py-3 px-4 whitespace-nowrap">维护类型</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">处理案卷数</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">处理文件数</th>
                          <th className="py-3 px-4 whitespace-nowrap text-center">达标率</th>
                          <th className="py-3 px-4 whitespace-nowrap">责任技师</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
                        </tr>
                      ) : selectedTreeNode === 'all_utilization' || selectedTreeNode === 'repo_utilization' ? (
                        // 历年利用情况表头
                        <tr>
                          <th className="py-3 px-4 text-center w-14">序号</th>
                          <th className="py-3 px-4 whitespace-nowrap">年度</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">利用总人次</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">调阅案卷 (卷)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">电子查阅 (件)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">出具证明 (份)</th>
                          <th className="py-3 px-4 min-w-[200px]">主要利用部门</th>
                          <th className="py-3 px-4 whitespace-nowrap text-center">满意率</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
                        </tr>
                      ) : (
                        // 历年保管期限情况表头
                        <tr>
                          <th className="py-3 px-4 text-center w-14">序号</th>
                          <th className="py-3 px-4 whitespace-nowrap">年度</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">永久保管 (卷)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">30年保管 (卷)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">10年保管 (卷)</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">到期鉴定卷数</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">合规销毁数</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">延期保管数</th>
                          <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
                        </tr>
                      )}
                    </thead>

                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                      {/* 年度分布 (对应截图，无张三，真实数字) */}
                      {(selectedTreeNode === 'all_year_dist' || selectedTreeNode === 'repo_year_dist') &&
                        paginatedStatsList.map((row: any, idx) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 text-center font-mono text-slate-400">
                              {(statsTablePage - 1) * STATS_PAGE_SIZE + idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                              {row.year}年
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 text-right whitespace-nowrap">
                              {row.volumeCount.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 text-right whitespace-nowrap">
                              {row.fileCount.toLocaleString()} 件
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-right whitespace-nowrap">
                              {row.boxCount.toLocaleString()} 盒
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                {row.digitalRate}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                              {row.note}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => setActiveDetailItem(row)}
                                  className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                                >
                                  查看明细
                                </button>
                                <button
                                  onClick={() => onShowMessage(`已导出【${row.year}年度】统计档案存根 (Excel)`)}
                                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium transition-colors"
                                >
                                  导出
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                      {/* 各档案库数量分布 */}
                      {selectedTreeNode === 'all_repo_dist' &&
                        paginatedStatsList.map((row: any, idx) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 text-center font-mono text-slate-400">
                              {(statsTablePage - 1) * STATS_PAGE_SIZE + idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                              {row.repoCode}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                              {row.repoName}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                {row.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 text-right whitespace-nowrap">
                              {row.volumeCount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 text-right whitespace-nowrap">
                              {row.fileCount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 text-right whitespace-nowrap">
                              {row.boxCount.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                                {row.digitalRate}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap font-mono font-medium text-slate-700 dark:text-slate-300">
                              {row.capacityRate}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setActiveDetailItem(row)}
                                className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                              >
                                查看明细
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* 历年维护情况 */}
                      {(selectedTreeNode === 'all_maintenance' || selectedTreeNode === 'repo_maintenance') &&
                        paginatedStatsList.map((row: any, idx) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 text-center font-mono text-slate-400">
                              {(statsTablePage - 1) * STATS_PAGE_SIZE + idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                              {row.year}年
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                              {row.projectName}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                                {row.maintainType}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-indigo-600 text-right whitespace-nowrap">
                              {row.processedVolume.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 text-right whitespace-nowrap">
                              {row.processedFiles.toLocaleString()} 件
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap font-mono text-emerald-600 font-bold">
                              {row.qualifiedRate}
                            </td>
                            <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                              {row.technician}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setActiveDetailItem(row)}
                                className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                              >
                                维护凭单
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* 历年利用情况 */}
                      {(selectedTreeNode === 'all_utilization' || selectedTreeNode === 'repo_utilization') &&
                        paginatedStatsList.map((row: any, idx) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 text-center font-mono text-slate-400">
                              {(statsTablePage - 1) * STATS_PAGE_SIZE + idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                              {row.year}年
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-purple-600 dark:text-purple-400 text-right whitespace-nowrap">
                              {row.personTime.toLocaleString()} 人次
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 text-right whitespace-nowrap">
                              {row.borrowVolumes.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 text-right whitespace-nowrap">
                              {row.digitalViews.toLocaleString()} 件
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 text-right whitespace-nowrap">
                              {row.proofCopies.toLocaleString()} 份
                            </td>
                            <td className="py-3 px-4 text-slate-800 dark:text-slate-200">
                              {row.topDept}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap font-mono text-emerald-600 font-bold">
                              {row.satisfactionRate}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setActiveDetailItem(row)}
                                className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                              >
                                查看明细
                              </button>
                            </td>
                          </tr>
                        ))}

                      {/* 历年保管期限情况 */}
                      {(selectedTreeNode === 'all_retention' || selectedTreeNode === 'repo_retention') &&
                        paginatedStatsList.map((row: any, idx) => (
                          <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                            <td className="py-3 px-4 text-center font-mono text-slate-400">
                              {(statsTablePage - 1) * STATS_PAGE_SIZE + idx + 1}
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                              {row.year}年
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400 text-right whitespace-nowrap">
                              {row.permanentVolume.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 font-mono text-indigo-600 dark:text-indigo-400 text-right whitespace-nowrap">
                              {row.thirtyYearVolume.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 text-right whitespace-nowrap">
                              {row.tenYearVolume.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-700 dark:text-slate-300 text-right whitespace-nowrap">
                              {row.appraisedVolume.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 font-mono text-amber-600 text-right whitespace-nowrap">
                              {row.disposedVolume.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 text-right whitespace-nowrap">
                              {row.extendedVolume.toLocaleString()} 卷
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => setActiveDetailItem(row)}
                                className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                              >
                                查看明细
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>

                {/* 严格每页 10 条的分页组件 */}
                <Pagination
                  currentPage={statsTablePage}
                  totalItems={currentStatsDataList.length}
                  pageSize={STATS_PAGE_SIZE}
                  onPageChange={(p) => setStatsTablePage(p)}
                />
              </div>
            )}

            {/* ======================= 视图模式 2: 统计图 (可视化图表) ======================= */}
            {statsViewMode === 'chart' && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-blue-600" />
                      <span>
                        {selectedTreeNode === 'all_year_dist' && '成都市档案馆历年归档案卷与文件增长趋势图'}
                        {selectedTreeNode === 'all_repo_dist' && '各实体档案库房藏量与库容负荷分布柱状图'}
                        {selectedTreeNode === 'all_maintenance' && '历年重点档案抢救修复与微环境维护质量走势'}
                        {selectedTreeNode === 'all_utilization' && '历年档案借阅利用人次与线上电子查阅比率'}
                        {selectedTreeNode === 'all_retention' && '历年档案保管期限结构构成比率'}
                        {(selectedTreeNode === 'repo_year_dist' ||
                          selectedTreeNode === 'repo_maintenance' ||
                          selectedTreeNode === 'repo_utilization' ||
                          selectedTreeNode === 'repo_retention') &&
                          `分库统计：${repoList.find((r) => r.code === selectedSubRepo)?.name} 专项趋势图`}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      基于档案中台实时时序数据库（更新基准：2026年11月）。
                    </p>
                  </div>

                  <button
                    onClick={() => onShowMessage('已导出统计图表高清图片 (PNG/SVG)')}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出高清图表</span>
                  </button>
                </div>

                {/* 动态图表模拟看板 */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 图表 1: 近年数值条形走势 */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>历年数据柱状对比 (2017 - 2026年)</span>
                        <span className="text-[10px] text-slate-400 font-mono">单位: 卷 / 人次</span>
                      </div>
                      <div className="space-y-2 pt-1 text-xs">
                        {mockAllYearDistData.slice(0, 6).map((item) => (
                          <div key={item.id} className="space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-semibold text-slate-700 dark:text-slate-300">{item.year}年度</span>
                              <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                                {item.volumeCount.toLocaleString()} 卷 ({item.growthRate})
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${(item.volumeCount / 55000) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 图表 2: 结构占比与质量达标分析 */}
                    <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3">
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                        <span>保管期限与数字化覆盖结构</span>
                        <span className="text-[10px] text-emerald-600 font-medium">99.8% 数字化率</span>
                      </div>
                      <div className="space-y-3 pt-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">永久保管档案</span>
                            <span className="font-mono text-emerald-600 font-bold">58.4% (76.4万卷)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: '58.4%' }}></div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">30年保管档案</span>
                            <span className="font-mono text-indigo-600 font-bold">29.8% (39.0万卷)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '29.8%' }}></div>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                          <div className="flex justify-between mb-1">
                            <span className="font-medium text-slate-700 dark:text-slate-300">10年保管档案</span>
                            <span className="font-mono text-blue-600 font-bold">11.8% (15.4万卷)</span>
                          </div>
                          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '11.8%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 模块 2: 档案年报 (report_annual)                               */}
      {/* ============================================================== */}
      {currentTab === 'report_annual' && (
        <div className="space-y-4">
          {/* Header Banner - 符合国家档案局标准 */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 mb-1">
                《全国档案事业统计调查制度》国家法定报表
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span>成都市数字档案馆 2026年度档案事业综合统计年报</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                汇总成都市直属机关、区县各级全宗单位 2026 年度档案收集、入馆、保管、数字化及利用综合年报。
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onShowMessage('已生成成都市2026年度国家档案局标准年报报送数据包 (XML/PDF封装)')}
                className="px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>生成国家年报包 (XML/PDF)</span>
              </button>
              <button
                onClick={() => onShowMessage('已触发2026年度全馆综合年报三级防篡改哈希验签')}
                className="px-3.5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>数据验签与核验</span>
              </button>
            </div>
          </div>

          {/* Annual Core Indicators Overview */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-xs text-slate-500">报送全宗单位数</span>
              <div className="mt-1.5 text-xl font-bold font-mono text-slate-900 dark:text-white">
                146 <span className="text-xs font-normal text-slate-500">家</span>
              </div>
              <div className="mt-1 text-[11px] text-emerald-600 font-medium">报送完成率 100%</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-xs text-slate-500">2026年收进总案卷</span>
              <div className="mt-1.5 text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
                52,430 <span className="text-xs font-normal text-slate-500">卷</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">卷内文件 21.8万件</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-xs text-slate-500">馆藏总排架长度</span>
              <div className="mt-1.5 text-xl font-bold font-mono text-indigo-600 dark:text-indigo-400">
                16,840 <span className="text-xs font-normal text-slate-500">延米</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">库房容积利用率 72.6%</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-xs text-slate-500">依法开放档案数</span>
              <div className="mt-1.5 text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                896,200 <span className="text-xs font-normal text-slate-500">卷</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">开放比例 68.5%</div>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
              <span className="text-xs text-slate-500">年度数字化加工页数</span>
              <div className="mt-1.5 text-xl font-bold font-mono text-purple-600 dark:text-purple-400">
                1,280,000 <span className="text-xs font-normal text-slate-500">页</span>
              </div>
              <div className="mt-1 text-[11px] text-slate-500">全量符合四性检测</div>
            </div>
          </div>

          {/* Filter Bar for Annual Report */}
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium">
                  <Filter className="w-3.5 h-3.5" />
                  <span>机构类别：</span>
                </div>

                <select
                  value={annualOrgTypeFilter}
                  onChange={(e) => {
                    setAnnualOrgTypeFilter(e.target.value);
                    setAnnualPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="全部类别">全部机构类别</option>
                  <option value="市级党政机关">市级党政机关</option>
                  <option value="市级经济部门">市级经济部门</option>
                  <option value="市级民生部门">市级民生部门</option>
                  <option value="市级建管部门">市级建管部门</option>
                  <option value="市级自然资源">市级自然资源</option>
                </select>

                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 font-medium ml-2">
                  <span>报送状态：</span>
                </div>
                <select
                  value={annualStatusFilter}
                  onChange={(e) => {
                    setAnnualStatusFilter(e.target.value);
                    setAnnualPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="全部状态">全部报送状态</option>
                  <option value="已上报国家局">已上报国家局</option>
                  <option value="已汇总核实">已汇总核实</option>
                  <option value="初审复核中">初审复核中</option>
                </select>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={annualSearchKey}
                    onChange={(e) => {
                      setAnnualSearchKey(e.target.value);
                      setAnnualPage(1);
                    }}
                    placeholder="全宗号 / 单位名称 / 审核人..."
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 w-56 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAnnualOrgTypeFilter('全部类别');
                    setAnnualStatusFilter('全部状态');
                    setAnnualSearchKey('');
                    setAnnualPage(1);
                    onShowMessage('已重置年报筛选条件');
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重置</span>
                </button>

                <button
                  onClick={() => onShowMessage('已一键导出全套年报综合台账 (Excel)')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出年报总表</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main 10 Items/Page Table for Annual Report */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3.5 whitespace-nowrap text-center w-12">序号</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">全宗号</th>
                    <th className="py-3 px-3.5 min-w-[200px]">全宗单位名称</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">机构类别</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">2026年收进卷数</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">2026年收进件数</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">馆藏总卷数</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">开放档案数</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">数字化加工(页)</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-center">年报状态</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">操作</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {paginatedAnnualData.map((row, idx) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-3.5 text-center font-mono text-slate-400">
                        {(annualPage - 1) * ANNUAL_PAGE_SIZE + idx + 1}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                        {row.fondsNo}
                      </td>
                      <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white">
                        {row.orgName}
                      </td>
                      <td className="py-3 px-3.5 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {row.orgType}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 text-right whitespace-nowrap">
                        +{row.inflowVolume2026.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-slate-600 dark:text-slate-400 text-right whitespace-nowrap">
                        {row.inflowFile2026.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 font-mono font-bold text-slate-900 dark:text-slate-100 text-right whitespace-nowrap">
                        {row.totalVolume.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-emerald-600 dark:text-emerald-400 text-right whitespace-nowrap">
                        {row.openVolume.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 font-mono text-purple-600 dark:text-purple-400 text-right whitespace-nowrap font-medium">
                        {row.digitalPages.toLocaleString()}
                      </td>
                      <td className="py-3 px-3.5 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            row.reportStatus === '已上报国家局'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                              : row.reportStatus === '已汇总核实'
                              ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                              : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                          }`}
                        >
                          {row.reportStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedAnnualItem(row)}
                            className="px-2 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 font-medium transition-colors"
                          >
                            查阅年报
                          </button>
                          <button
                            onClick={() => onShowMessage(`已导出【${row.orgName}】2026年度档案综合年报表`)}
                            className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 font-medium transition-colors"
                          >
                            导出
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {paginatedAnnualData.length === 0 && (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        暂未查到符合条件的档案年报记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Exactly 10 items per page pagination */}
            <Pagination
              currentPage={annualPage}
              totalItems={filteredAnnualReports.length}
              pageSize={ANNUAL_PAGE_SIZE}
              onPageChange={(page) => setAnnualPage(page)}
            />
          </div>
        </div>
      )}

      {/* ======================= 模态框: 档案统计明细详情查看 ======================= */}
      {activeDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  统计明细记录查阅
                </h3>
              </div>
              <button
                onClick={() => setActiveDetailItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 grid grid-cols-2 gap-3">
                {Object.entries(activeDetailItem)
                  .filter(([k]) => k !== 'id')
                  .map(([key, val]: any) => (
                    <div key={key}>
                      <span className="text-slate-400 font-medium">{key}：</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 ml-1 font-mono">
                        {typeof val === 'number' ? val.toLocaleString() : String(val)}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="p-3 rounded-lg border border-blue-200 dark:border-blue-800/60 bg-blue-50/70 dark:bg-blue-950/40 space-y-1">
                <div className="text-blue-800 dark:text-blue-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>成都市档案馆数据完整性哈希验签</span>
                </div>
                <p className="text-[11px] text-blue-700 dark:text-blue-400">
                  当前统计项目已与业务数据库底表一致，时间戳签名合法，通过四性标准中完整性与可用性复核。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onShowMessage('已导出该统计记录专项明细 (Excel)');
                  setActiveDetailItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>导出记录存根</span>
              </button>
              <button
                onClick={() => setActiveDetailItem(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================= 模态框: 档案年报全宗分表 ======================= */}
      {selectedAnnualItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    全宗年报分表：{selectedAnnualItem.orgName}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    全宗号: {selectedAnnualItem.fondsNo} ｜ 类别: {selectedAnnualItem.orgType}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAnnualItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 space-y-2 text-xs">
              <div className="font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700/60 pb-1.5 flex items-center justify-between">
                <span>2026年度业务指标报送台账</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold">
                  {selectedAnnualItem.reportStatus}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-1">
                <div>
                  <span className="text-slate-400 text-[11px]">2026年度收进卷数</span>
                  <div className="font-mono font-bold text-blue-600 text-sm mt-0.5">
                    +{selectedAnnualItem.inflowVolume2026.toLocaleString()} 卷
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">2026年度收进文件</span>
                  <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                    {selectedAnnualItem.inflowFile2026.toLocaleString()} 件
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">馆藏累计总卷数</span>
                  <div className="font-mono font-bold text-slate-900 dark:text-white text-sm mt-0.5">
                    {selectedAnnualItem.totalVolume.toLocaleString()} 卷
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">依法开放档案数</span>
                  <div className="font-mono font-bold text-emerald-600 text-sm mt-0.5">
                    {selectedAnnualItem.openVolume.toLocaleString()} 卷
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">数字化扫描页数</span>
                  <div className="font-mono font-bold text-purple-600 text-sm mt-0.5">
                    {selectedAnnualItem.digitalPages.toLocaleString()} 页
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px]">审核签发人</span>
                  <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                    {selectedAnnualItem.auditor}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>国家档案局年报报送校验报告</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                全宗【{selectedAnnualItem.fondsNo}】数据符合国家发展改革委和国家档案局联合制定的《全国档案事业统计调查制度》各项平衡校验规则，电子签名与时间戳验证合法有效。填报时间：{selectedAnnualItem.submitDate}。
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={() => {
                  onShowMessage(`已导出【${selectedAnnualItem.orgName}】年度统计分表 (PDF带电子签章)`);
                  setSelectedAnnualItem(null);
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>导出盖章年报 (PDF)</span>
              </button>
              <button
                onClick={() => setSelectedAnnualItem(null)}
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
