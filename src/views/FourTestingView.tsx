import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileCheck2,
  Folder,
  FileText,
  Clock,
  User,
  Eye,
  X,
  Play,
  RotateCcw,
  Sliders,
  Check,
  Building2,
  Layers,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';
import { ModalDetail } from '../components/ModalDetail';

interface FourTestingViewProps {
  onSelectRecord?: (record: any) => void;
  onShowMessage: (msg: string) => void;
}

// 1. 四性检测记录数据接口
export interface TestingRecordItem {
  id: string;
  archiveType: string;         // 档案类型 (e.g. '文书档案（文件）', '文书档案（盒/案卷）', '工程档案'...)
  checkTime: string;           // 检测时间 (e.g. '2026-11-04 19:58:14')
  vaultName: string;           // 档案库 (e.g. '成都市住建局机关档案库', '工程竣工档案馆'...)
  year: number;                // 年度 (e.g. 2026)
  fileCount: number;           // 文件总数
  schemeName: string;          // 检测方案 (e.g. '文书归档检测')
  itemSummary: string;         // 检测项目 (e.g. '共检测9项')
  inspector: string;           // 检测人员 (e.g. '管理员', '李审核', '系统自动检测')
  status: '未通过' | '通过' | '检测中'; // 状态
  // 4-property details for Modal display
  authenticity: string;
  integrity: string;
  usability: string;
  security: string;
}

// 2. 检测方案数据接口
export interface TestingSchemeItem {
  id: string;
  archiveType: string;         // 适用档案类型
  schemeName: string;          // 方案名称 (e.g. '文书档案提交检测')
  schemeType: string;          // 方案类型 (e.g. '通用方案', '全宗专用方案')
  itemSummary: string;         // 检测项目 (e.g. '共检测9项')
  updatedDate: string;         // 修改日期 (e.g. '2026-11-04')
  rulesCount: number;          // 细分规则项
  creator: string;             // 创建责任人
}

// Generator 1: 100 检测记录 (Pages 1-5: 近3个月 2026-11-05 ~ 2026-11-02 降序; Pages 6-10: 前3个月 2026-11-02 ~ 2026-11-01 降序)
const generate100TestingRecords = (): TestingRecordItem[] => {
  const archiveTypes = [
    '文书档案（文件）',
    '文书档案（盒/案卷）',
    '工程档案',
    '照片档案',
    '声像档案',
    '实物档案',
    '会计档案',
  ];
  const vaults = [
    '成都市住建局机关档案库',
    '重点工程竣工档案库',
    '成都市文书案卷档案库',
    '市住建局照片图音档案库',
    '声像多媒体数字库房',
    '电子会计凭证专用档案库',
    '荣誉实物特藏档案库'
  ];
  const inspectors = ['管理员', '李审核', '张工程师', '系统自动检测', '王音像', '赵档案'];
  const schemes = [
    '文书归档检测方案',
    '工程竣工图纸四性强检',
    '文书案卷四性合规检测',
    '高清照片档案EXIF检测',
    '声像多媒体编码检测',
    '电子会计凭证验签检测',
    '党政机关公文格式与电子签章检测'
  ];

  const items: TestingRecordItem[] = [];

  for (let i = 1; i <= 100; i++) {
    let year = 2026;
    let checkTime = '';
    if (i <= 50) {
      // 降序：i=1 时为 2026-11-05，i=50 时为 2026-11-02
      const dayOffset = Math.floor(((i - 1) / 49) * 82);
      const baseDate = new Date(2026, 10, 5); // 2026-11-05
      baseDate.setDate(baseDate.getDate() - dayOffset);
      const y = baseDate.getFullYear();
      const m = String(baseDate.getMonth() + 1).padStart(2, '0');
      const d = String(baseDate.getDate()).padStart(2, '0');
      const hh = String(19 - (i % 10)).padStart(2, '0');
      const mm = String((59 - (i * 7) % 60)).padStart(2, '0');
      const ss = String((59 - (i * 13) % 60)).padStart(2, '0');
      checkTime = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      year = y;
    } else {
      // 降序：i=51 时为 2026-11-02，i=100 时为 2026-11-01
      const stepIdx = i - 51;
      const dayOffset = Math.floor((stepIdx / 49) * 105);
      const baseDate = new Date(2026, 7, 14); // 2026-11-02
      baseDate.setDate(baseDate.getDate() - dayOffset);
      const y = baseDate.getFullYear();
      const m = String(baseDate.getMonth() + 1).padStart(2, '0');
      const d = String(baseDate.getDate()).padStart(2, '0');
      const hh = String(18 - (i % 9)).padStart(2, '0');
      const mm = String((59 - (i * 11) % 60)).padStart(2, '0');
      const ss = String((59 - (i * 17) % 60)).padStart(2, '0');
      checkTime = `${y}-${m}-${d} ${hh}:${mm}:${ss}`;
      year = y;
    }

    const archType = archiveTypes[(i - 1) % archiveTypes.length];
    const vault = vaults[(i - 1) % vaults.length];
    const inspector = inspectors[(i - 1) % inspectors.length];
    const scheme = schemes[(i - 1) % schemes.length];
    const status: '通过' | '未通过' | '检测中' = i % 7 === 0 ? '未通过' : i % 9 === 0 ? '检测中' : '通过';

    items.push({
      id: `tr-${String(i).padStart(3, '0')}`,
      archiveType: archType,
      checkTime,
      vaultName: vault,
      year,
      fileCount: 10 + ((i * 3) % 150),
      schemeName: scheme,
      itemSummary: `共检测${8 + (i % 9)}项`,
      inspector,
      status,
      authenticity: status === '未通过' ? '未通过 (签章签名解验异常)' : '通过 (国密SM2/SM3算法验签合格)',
      integrity: status === '未通过' ? '未通过 (缺少成文日期元数据)' : '通过 (DA/T 46元数据集完整度100%)',
      usability: '通过 (OFD/PDF标准解析一致)',
      security: '通过 (国密SM4加密传输无病毒)',
    });
  }

  return items;
};

const initialTestingRecords: TestingRecordItem[] = generate100TestingRecords();

// Generator 2: 100 检测方案 (Pages 1-5: 近3个月 2026-11-05 ~ 2026-11-02 降序; Pages 6-10: 前3个月 2026-11-02 ~ 2026-11-01 降序)
const generate100TestingSchemes = (): TestingSchemeItem[] => {
  const archiveTypes = [
    '文书档案（文件）',
    '文书档案（盒/案卷）',
    '工程档案',
    '照片档案',
    '声像档案',
    '实物档案',
    '会计档案',
  ];
  const schemeNames = [
    '文书档案提交检测',
    '文书档案归档检测',
    '文书案卷组卷四性强检方案',
    '重点建设工程竣工图纸强检方案',
    '高清照片档案EXIF与分辨率校验',
    '多媒体音视频通用编码规范检测',
    '实物荣誉档案三维数字清册检测',
    '电子会计凭证国密哈希完整性校验',
    '党政机关公文格式与电子签章检测',
    '地下管线3D三维矢量数据检测',
    '企业财税电子发票真实性实时复测',
    '历史珍贵黑白照片数字修复检测'
  ];
  const schemeTypes = ['通用方案', '全宗专用方案', '专项检测方案'];
  const creators = ['系统管理员', '李审核', '张工程师', '管理员', '王音像', '赵档案'];

  const items: TestingSchemeItem[] = [];

  for (let i = 1; i <= 100; i++) {
    let updatedDate = '';
    if (i <= 50) {
      // 降序：i=1 时为 2026-11-05，i=50 时为 2026-11-02
      const dayOffset = Math.floor(((i - 1) / 49) * 82);
      const baseDate = new Date(2026, 10, 5);
      baseDate.setDate(baseDate.getDate() - dayOffset);
      const y = baseDate.getFullYear();
      const m = String(baseDate.getMonth() + 1).padStart(2, '0');
      const d = String(baseDate.getDate()).padStart(2, '0');
      updatedDate = `${y}-${m}-${d}`;
    } else {
      // 降序：i=51 时为 2026-11-02，i=100 时为 2026-11-01
      const stepIdx = i - 51;
      const dayOffset = Math.floor((stepIdx / 49) * 105);
      const baseDate = new Date(2026, 7, 14);
      baseDate.setDate(baseDate.getDate() - dayOffset);
      const y = baseDate.getFullYear();
      const m = String(baseDate.getMonth() + 1).padStart(2, '0');
      const d = String(baseDate.getDate()).padStart(2, '0');
      updatedDate = `${y}-${m}-${d}`;
    }

    const archType = archiveTypes[(i - 1) % archiveTypes.length];
    const baseName = schemeNames[(i - 1) % schemeNames.length];
    const schemeType = schemeTypes[(i - 1) % schemeTypes.length];
    const creator = creators[(i - 1) % creators.length];
    const rulesCount = 6 + (i % 12);

    items.push({
      id: `ts-${String(i).padStart(3, '0')}`,
      archiveType: archType,
      schemeName: i > 12 ? `${baseName} (V${(i % 5) + 1}.0)` : baseName,
      schemeType,
      itemSummary: `共检测${rulesCount}项`,
      updatedDate,
      rulesCount,
      creator,
    });
  }

  return items;
};

const initialTestingSchemes: TestingSchemeItem[] = generate100TestingSchemes();

export const FourTestingView: React.FC<FourTestingViewProps> = ({
  onSelectRecord,
  onShowMessage,
}) => {
  // Top Tabs: 'records' (检测记录) vs 'schemes' (检测方案)
  const [activeTab, setActiveTab] = useState<'records' | 'schemes'>('records');

  // Datasets
  const [recordsList, setRecordsList] = useState<TestingRecordItem[]>(initialTestingRecords);
  const [schemesList, setSchemesList] = useState<TestingSchemeItem[]>(initialTestingSchemes);

  // Left Sidebar Archive Type Filter
  const [selectedArchiveType, setSelectedArchiveType] = useState<string>('全部类型');

  // Filters for Records Tab
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [recordsSearchQuery, setRecordsSearchQuery] = useState('');
  const [currentRecordsPage, setCurrentRecordsPage] = useState(1);
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);

  // Filters for Schemes Tab
  const [schemeNameSearch, setSchemeNameSearch] = useState('');
  const [currentSchemesPage, setCurrentSchemesPage] = useState(1);
  const [selectedSchemeIds, setSelectedSchemeIds] = useState<string[]>([]);

  // Action Modals State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeDetailItem, setActiveDetailItem] = useState<any>(null);

  const [modalType, setModalType] = useState<
    'add_test' | 'add_scheme' | 'view_scheme_rules' | null
  >(null);

  // Form states for New Test
  const [newTestVault, setNewTestVault] = useState('成都市住建局机关档案库');
  const [newTestType, setNewTestType] = useState('文书档案（文件）');
  const [newTestScheme, setNewTestScheme] = useState('文书归档检测方案');

  // Empty state for Add Scheme modal matching 5 screenshots
  const emptySchemeFormState = {
    schemeName: '',
    schemeSubTab: 'accuracy' as 'accuracy' | 'integrity' | 'usability' | 'security',

    lengthChecks: {
      '文件档号': { checked: false, value: '' },
      '文件题名': { checked: false, value: '' },
      '年度': { checked: false, value: '' },
      '保管期限': { checked: false, value: '' },
      '密级': { checked: false, value: '' },
      '文件页数': { checked: false, value: '' },
      '文号': { checked: false, value: '' },
      '成文日期': { checked: false, value: '' },
      '归档份数': { checked: false, value: '' },
    } as Record<string, { checked: boolean; value: string }>,

    typeChecks: {
      '文件档号': { checked: false, value: '字符型' },
      '文件题名': { checked: false, value: '字符型' },
      '年度': { checked: false, value: '字符型' },
      '保管期限': { checked: false, value: '字符型' },
      '密级': { checked: false, value: '字符型' },
      '文件页数': { checked: false, value: '字符型' },
      '文号': { checked: false, value: '字符型' },
      '成文日期': { checked: false, value: '字符型' },
      '归档份数': { checked: false, value: '字符型' },
    } as Record<string, { checked: boolean; value: string }>,

    valueRangeChecks: {
      '文件档号': { checked: false, value: '' },
      '文件题名': { checked: false, value: '' },
      '年度': { checked: false, value: '' },
      '保管期限': { checked: false, value: '' },
      '密级': { checked: false, value: '' },
      '文件页数': { checked: false, value: '' },
      '文号': { checked: false, value: '' },
      '成文日期': { checked: false, value: '' },
      '归档份数': { checked: false, value: '' },
    } as Record<string, { checked: boolean; value: string }>,

    validRangeChecks: {
      '文件档号': { checked: false, value: '' },
      '文件题名': { checked: false, value: '' },
      '年度': { checked: false, value: '' },
      '保管期限': { checked: false, value: '' },
      '密级': { checked: false, value: '' },
      '文件页数': { checked: false, value: '' },
      '文号': { checked: false, value: '' },
      '成文日期': { checked: false, value: '' },
      '归档份数': { checked: false, value: '' },
    } as Record<string, { checked: boolean; value: string }>,

    specialCharChecks: {
      '文件档号': { checked: false, value: '' },
      '文件题名': { checked: false, value: '' },
      '年度': { checked: false, value: '' },
      '保管期限': { checked: false, value: '' },
      '密级': { checked: false, value: '' },
      '文件页数': { checked: false, value: '' },
    } as Record<string, { checked: boolean; value: string }>,

    fileCodeNormChecked: false,

    duplicateChecks: {
      '文件档号': false,
      '文件题名': false,
      '年度': false,
      '文件页数': false,
      '保管期限': false,
      '密级': false,
      '文号': false,
      '成文日期': false,
      '归档份数': false,
    } as Record<string, boolean>,

    sourceAuthenticity: false,
    contentAuthenticity: false,
    relationalConsistency: false,

    metadataCompleteness: false,
    requiredChecks: {
      '文件档号': false,
      '文件题名': false,
      '年度': false,
      '保管期限': false,
      '密级': false,
      '文件页数': false,
      '文号': false,
      '成文日期': false,
      '归档份数': false,
      '计算机文件名': false,
      '计算机文件大小': false,
      '格式信息': false,
      '文档创建程序': false,
      '信息系统描述': false,
      '软件环境信息': false,
      '硬件环境信息': false,
    } as Record<string, boolean>,
    continuityCheck: false,
    contentCompleteness: false,

    metadataUsability: false,
    swEnvCheck: false,
    swEnvValue: '',
    hwEnvCheck: false,
    hwEnvValue: '',
    fileFormatCheck: false,
    fileFormatValue: '',

    topSecretTitleCheck: false,
    topSecretFileCheck: false,
  };

  const [schemeFormState, setSchemeFormState] = useState(emptySchemeFormState);

  // Open Add Scheme Modal with CLEARED form fields
  const handleOpenAddScheme = () => {
    setSchemeFormState(emptySchemeFormState);
    setModalType('add_scheme');
  };

  const PAGE_SIZE = 10;

  // Archive Types List for Left Sidebar
  const archiveTypes = [
    '文书档案（文件）',
    '文书档案（盒/案卷）',
    '工程档案',
    '照片档案',
    '声像档案',
    '实物档案',
    '会计档案',
  ];

  // Handle Left Type Click
  const handleSelectArchiveType = (type: string) => {
    if (selectedArchiveType === type) {
      setSelectedArchiveType('全部类型');
      onShowMessage('已重置档案类型筛选，展示全量记录');
    } else {
      setSelectedArchiveType(type);
      onShowMessage(`已选择 [${type}]，右侧列表已同步切换数据`);
    }
    setCurrentRecordsPage(1);
    setCurrentSchemesPage(1);
  };

  // Filtered Records Data
  const filteredRecords = recordsList.filter((item) => {
    const matchesType =
      selectedArchiveType === '全部类型' || item.archiveType === selectedArchiveType;

    const matchesStatus =
      statusFilter === '全部' || item.status === statusFilter;

    const matchesQuery =
      !recordsSearchQuery ||
      item.vaultName.toLowerCase().includes(recordsSearchQuery.toLowerCase()) ||
      item.schemeName.toLowerCase().includes(recordsSearchQuery.toLowerCase()) ||
      item.inspector.toLowerCase().includes(recordsSearchQuery.toLowerCase());

    return matchesType && matchesStatus && matchesQuery;
  }).sort((a, b) => (b.checkTime || "").localeCompare(a.checkTime || ""));

  const paginatedRecords = filteredRecords.slice(
    (currentRecordsPage - 1) * PAGE_SIZE,
    currentRecordsPage * PAGE_SIZE
  );

  // Filtered Schemes Data
  const filteredSchemes = schemesList.filter((item) => {
    const matchesType =
      selectedArchiveType === '全部类型' || item.archiveType === selectedArchiveType;

    const matchesName =
      !schemeNameSearch ||
      item.schemeName.toLowerCase().includes(schemeNameSearch.toLowerCase()) ||
      item.creator.toLowerCase().includes(schemeNameSearch.toLowerCase());

    return matchesType && matchesName;
  }).sort((a, b) => (b.updatedDate || "").localeCompare(a.updatedDate || ""));

  const paginatedSchemes = filteredSchemes.slice(
    (currentSchemesPage - 1) * PAGE_SIZE,
    currentSchemesPage * PAGE_SIZE
  );

  // Toggle selection checkboxes
  const toggleSelectRecord = (id: string) => {
    setSelectedRecordIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectScheme = (id: string) => {
    setSelectedSchemeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Delete Handlers
  const handleDeleteRecords = () => {
    if (selectedRecordIds.length === 0) {
      onShowMessage('请先勾选需要删除的检测记录');
      return;
    }
    setRecordsList(recordsList.filter((r) => !selectedRecordIds.includes(r.id)));
    setSelectedRecordIds([]);
    onShowMessage('选中的四性检测记录已彻底删除');
  };

  const handleDeleteSchemes = () => {
    if (selectedSchemeIds.length === 0) {
      onShowMessage('请先选择需要删除的检测方案');
      return;
    }
    setSchemesList(schemesList.filter((s) => !selectedSchemeIds.includes(s.id)));
    setSelectedSchemeIds([]);
    onShowMessage('选中的检测方案已成功移除');
  };

  // Open Detail Modal for Record
  const handleOpenDetail = (record: TestingRecordItem) => {
    if (onSelectRecord) {
      onSelectRecord(record);
    } else {
      setActiveDetailItem(record);
      setDetailModalOpen(true);
    }
  };

  // Save New Test Execution
  const handleSaveNewTest = () => {
    const newRecord: TestingRecordItem = {
      id: `tr-${Date.now()}`,
      archiveType: newTestType,
      checkTime: '2026-11-04 20:10:00',
      vaultName: newTestVault,
      year: 2026,
      fileCount: 38,
      schemeName: newTestScheme,
      itemSummary: '共检测12项',
      inspector: '管理员',
      status: '通过',
      authenticity: '通过 (国密SM2签章合规)',
      integrity: '通过 (DA/T 46元数据完全吻合)',
      usability: '通过 (OFD/A-1解析通过)',
      security: '通过 (国密SM4链路防护)',
    };
    setRecordsList([newRecord, ...recordsList]);
    setModalType(null);
    onShowMessage(`已启动对 [${newTestVault}] 的批量四性检测，检测结果：全部合规通过！`);
  };

  // Save New Scheme
  const handleSaveNewScheme = () => {
    const title = schemeFormState.schemeName.trim() || '新建四性检测方案';
    const newScheme: TestingSchemeItem = {
      id: `ts-${Date.now()}`,
      archiveType: selectedArchiveType !== '全部类型' ? selectedArchiveType : '文书档案（文件）',
      schemeName: title,
      schemeType: '通用方案',
      itemSummary: '共检测12项',
      updatedDate: '2026-11-05',
      rulesCount: 12,
      creator: '管理员',
    };
    setSchemesList([newScheme, ...schemesList]);
    setModalType(null);
    onShowMessage(`已成功保存新建四性检测方案 [${newScheme.schemeName}]！`);
  };

  // Status Badge Renderer
  const getStatusBadge = (status: TestingRecordItem['status']) => {
    switch (status) {
      case '通过':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
            通过
          </span>
        );
      case '未通过':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-[11px] font-bold">
            未通过
          </span>
        );
      case '检测中':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold">
            检测中
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 animate-in fade-in duration-300">
      {/* LEFT SIDEBAR PANEL: 档案类型列表 */}
      <div className="w-full lg:w-56 space-y-3 shrink-0">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Folder className="w-4 h-4 text-amber-500" />
              <span>档案类型列表</span>
            </h3>
            {selectedArchiveType !== '全部类型' && (
              <button
                onClick={() => setSelectedArchiveType('全部类型')}
                className="text-[10px] text-blue-600 hover:underline"
              >
                重置
              </button>
            )}
          </div>

          <div className="space-y-1 text-xs font-mono">
            {archiveTypes.map((type) => {
              const isSelected = selectedArchiveType === type;
              return (
                <button
                  key={type}
                  onClick={() => handleSelectArchiveType(type)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{type}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT MAIN CONTAINER */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Top Header Tabs: 检测记录 vs 检测方案 */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('records')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'records'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              检测记录 ({filteredRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'schemes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              检测方案 ({filteredSchemes.length})
            </button>
          </div>

          {selectedArchiveType !== '全部类型' && (
            <div className="text-xs font-mono text-blue-600 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-200 dark:border-blue-900">
              类型: {selectedArchiveType}
            </div>
          )}
        </div>

        {/* TAB 1: 检测记录 WORKSPACE */}
        {activeTab === 'records' && (
          <div className="space-y-3">
            {/* Toolbar for 检测记录 */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setModalType('add_test')}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增检测</span>
                </button>

                <button
                  onClick={handleDeleteRecords}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除记录</span>
                </button>
              </div>

              {/* Right Filter & Search */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-sans">
                  <span>状态:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      setCurrentRecordsPage(1);
                    }}
                    className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:outline-hidden cursor-pointer"
                  >
                    <option value="全部">全部</option>
                    <option value="通过">通过</option>
                    <option value="未通过">未通过</option>
                    <option value="检测中">检测中</option>
                  </select>
                </div>

                <div className="relative w-48">
                  <input
                    type="text"
                    placeholder="档案库 / 方案名称..."
                    value={recordsSearchQuery}
                    onChange={(e) => {
                      setRecordsSearchQuery(e.target.value);
                      setCurrentRecordsPage(1);
                    }}
                    className="w-full pl-3 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <button
                  onClick={() => setCurrentRecordsPage(1)}
                  className="px-3 py-1 rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  <span>检索</span>
                </button>
              </div>
            </div>

            {/* Table for 检测记录 (matching Screenshot 1 & 2) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-medium">
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedRecordIds.length === paginatedRecords.length &&
                          paginatedRecords.length > 0
                        }
                        onChange={() => {
                          if (selectedRecordIds.length === paginatedRecords.length)
                            setSelectedRecordIds([]);
                          else setSelectedRecordIds(paginatedRecords.map((r) => r.id));
                        }}
                        className="rounded border-slate-300"
                      />
                    </th>
                    <th className="py-2.5 px-3 w-12 text-center whitespace-nowrap">序号</th>
                    <th className="py-2.5 px-3 min-w-[150px] whitespace-nowrap">检测时间</th>
                    <th className="py-2.5 px-3 min-w-[160px]">档案库</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">年度</th>
                    <th className="py-2.5 px-3 text-center whitespace-nowrap">文件总数</th>
                    <th className="py-2.5 px-3 min-w-[150px]">检测方案</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">检测项目</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">检测人员</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">状态</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap sticky right-0 bg-slate-50/90 dark:bg-slate-850">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {paginatedRecords.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400 font-sans">
                        暂无符合条件的四性检测记录
                      </td>
                    </tr>
                  ) : (
                    paginatedRecords.map((item, index) => {
                      const isSelected = selectedRecordIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors ${
                            isSelected ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectRecord(item.id)}
                              className="rounded border-slate-300"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-400 whitespace-nowrap">
                            {(currentRecordsPage - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                            {item.checkTime}
                          </td>
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                            {item.vaultName}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">{item.year}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-800 dark:text-slate-200">
                            {item.fileCount}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-blue-600 dark:text-blue-400 font-medium">
                            {item.schemeName}
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400">
                            {item.itemSummary}
                          </td>
                          <td className="py-2.5 px-3 font-sans whitespace-nowrap">{item.inspector}</td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            {getStatusBadge(item.status)}
                          </td>
                          <td className="py-2.5 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 whitespace-nowrap">
                            <div className="whitespace-nowrap inline-flex items-center justify-end gap-2 font-sans">
                              <button
                                onClick={() => handleOpenDetail(item)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-semibold flex items-center gap-0.5"
                              >
                                <Eye className="w-3 h-3" />
                                <span>详情</span>
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

            {/* Pagination */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <Pagination
                currentPage={currentRecordsPage}
                totalItems={filteredRecords.length}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => setCurrentRecordsPage(page)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: 检测方案 WORKSPACE */}
        {activeTab === 'schemes' && (
          <div className="space-y-3">
            {/* Toolbar for 检测方案 */}
            <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleOpenAddScheme}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增方案</span>
                </button>

                <button
                  onClick={handleDeleteSchemes}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除方案</span>
                </button>
              </div>

              {/* Right Filter for 检测方案 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-600 dark:text-slate-300">方案名称:</span>
                <div className="relative w-56">
                  <input
                    type="text"
                    placeholder="方案名称"
                    value={schemeNameSearch}
                    onChange={(e) => {
                      setSchemeNameSearch(e.target.value);
                      setCurrentSchemesPage(1);
                    }}
                    className="w-full pl-3 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <button
                  onClick={() => setCurrentSchemesPage(1)}
                  className="px-3 py-1 rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 text-xs font-bold hover:bg-blue-50 transition-colors flex items-center gap-1"
                >
                  <Search className="w-3 h-3" />
                  <span>检索</span>
                </button>
              </div>
            </div>

            {/* Table for 检测方案 (matching Screenshot 3) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-medium">
                    <th className="py-2.5 px-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={
                          selectedSchemeIds.length === paginatedSchemes.length &&
                          paginatedSchemes.length > 0
                        }
                        onChange={() => {
                          if (selectedSchemeIds.length === paginatedSchemes.length)
                            setSelectedSchemeIds([]);
                          else setSelectedSchemeIds(paginatedSchemes.map((s) => s.id));
                        }}
                        className="rounded border-slate-300"
                      />
                    </th>
                    <th className="py-2.5 px-3 w-12 text-center whitespace-nowrap">序号</th>
                    <th className="py-2.5 px-3 min-w-[220px]">方案名称</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">方案类型</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">检测项目</th>
                    <th className="py-2.5 px-3 whitespace-nowrap">修改日期</th>
                    <th className="py-2.5 px-3 text-right whitespace-nowrap sticky right-0 bg-slate-50/90 dark:bg-slate-850">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {paginatedSchemes.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-sans">
                        暂无符合条件的四性检测方案
                      </td>
                    </tr>
                  ) : (
                    paginatedSchemes.map((item, index) => {
                      const isSelected = selectedSchemeIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors ${
                            isSelected ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectScheme(item.id)}
                              className="rounded border-slate-300"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center font-bold text-slate-400 whitespace-nowrap">
                            {(currentSchemesPage - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                            {item.schemeName}
                          </td>
                          <td className="py-2.5 px-3 font-sans whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                              {item.schemeType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-sans text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {item.itemSummary}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap text-slate-600 dark:text-slate-400">
                            {item.updatedDate}
                          </td>
                          <td className="py-2.5 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 whitespace-nowrap">
                            <div className="whitespace-nowrap inline-flex items-center justify-end gap-2 font-sans">
                              <button
                                onClick={() => {
                                  setActiveDetailItem(item);
                                  setModalType('view_scheme_rules');
                                }}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-semibold flex items-center gap-0.5"
                              >
                                <Eye className="w-3 h-3" />
                                <span>详情</span>
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

            {/* Pagination */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <Pagination
                currentPage={currentSchemesPage}
                totalItems={filteredSchemes.length}
                pageSize={PAGE_SIZE}
                onPageChange={(page) => setCurrentSchemesPage(page)}
              />
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: Detail Drawer Modal for Record */}
      <ModalDetail
        isOpen={detailModalOpen}
        title="四性检测合规与验签报告"
        onClose={() => setDetailModalOpen(false)}
        data={
          activeDetailItem
            ? {
                ...activeDetailItem,
                checkNo: `4T-20261104-${activeDetailItem.id}`,
                archiveName: activeDetailItem.vaultName || '成都市住房和城乡建设局档案',
                fondsName: '成都市住房和城乡建设局 (0110全宗)',
                conclusion: activeDetailItem.status === '未通过' ? '整改中' : '合格',
              }
            : null
        }
        type="four_testing"
        onActionSuccess={onShowMessage}
      />

      {/* MODAL 2: New Test Modal */}
      {modalType === 'add_test' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>新建四性检测任务</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-sans">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  目标档案库
                </label>
                <input
                  type="text"
                  value={newTestVault}
                  onChange={(e) => setNewTestVault(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    档案类型
                  </label>
                  <select
                    value={newTestType}
                    onChange={(e) => setNewTestType(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
                  >
                    {archiveTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    检测方案
                  </label>
                  <select
                    value={newTestScheme}
                    onChange={(e) => setNewTestScheme(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
                  >
                    <option value="文书归档检测方案">文书归档检测方案</option>
                    <option value="工程竣工图纸四性强检">工程竣工图纸四性强检</option>
                    <option value="电子会计凭证验签检测">电子会计凭证验签检测</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleSaveNewTest}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
              >
                启动四性检测
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: New Scheme Modal (根据 5 张截图 100% 还原四性检测方案配制) */}
      {modalType === 'add_scheme' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-5xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl p-6 space-y-5 my-6 max-h-[92vh] overflow-y-auto font-sans">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-blue-600" />
                <span>新增检测方案</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scheme Title & Metadata Item Bar */}
            <div className="space-y-3 border-b border-slate-100 dark:border-slate-800 pb-4 text-xs">
              <div className="flex items-center gap-3">
                <label className="text-slate-700 dark:text-slate-300 font-semibold shrink-0">检测方案名称:</label>
                <input
                  type="text"
                  placeholder="20个字以内"
                  value={schemeFormState.schemeName}
                  onChange={(e) =>
                    setSchemeFormState((prev) => ({ ...prev, schemeName: e.target.value }))
                  }
                  className="w-full max-w-md px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 flex-wrap">
                <span className="font-semibold text-slate-700 dark:text-slate-300">检测元数据项:</span>
                <span className="text-slate-500">
                  文件档号，文件题名，年度，保管期限，密级，文件页数，文号，成文日期，归档份数
                </span>
                <button
                  type="button"
                  onClick={() => onShowMessage('元数据检测项设置已保存')}
                  className="text-blue-600 hover:text-blue-800 font-bold text-xs underline ml-1"
                >
                  【设置】
                </button>
              </div>
            </div>

            {/* 4 Sub-Tabs for Four Testing */}
            <div className="flex items-center gap-8 border-b border-slate-200 dark:border-slate-800 text-xs font-bold">
              {[
                { id: 'accuracy', label: '准确性' },
                { id: 'integrity', label: '完整性' },
                { id: 'usability', label: '可用性' },
                { id: 'security', label: '安全性' },
              ].map((tab) => {
                const isActive = schemeFormState.schemeSubTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() =>
                      setSchemeFormState((prev) => ({ ...prev, schemeSubTab: tab.id as any }))
                    }
                    className={`pb-2.5 transition-colors relative ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 font-extrabold border-b-2 border-blue-600'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: 准确性 (Screenshots 1 & 2) */}
            {schemeFormState.schemeSubTab === 'accuracy' && (
              <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
                {/* Section A: 元数据检测 */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    元数据检测
                  </h4>

                  {/* 1. 长度检测 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100">长度检测</span>
                      <span className="text-slate-400 text-[11px]">元数据的内容长度，是否符合规范要求，例如：100</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-2">
                      {['文件档号', '文件题名', '年度', '保管期限', '密级', '文件页数', '文号', '成文日期', '归档份数'].map(
                        (field) => (
                          <div key={`len-${field}`} className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 shrink-0 cursor-pointer min-w-[70px]">
                              <input
                                type="checkbox"
                                checked={schemeFormState.lengthChecks[field]?.checked || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSchemeFormState((prev) => ({
                                    ...prev,
                                    lengthChecks: {
                                      ...prev.lengthChecks,
                                      [field]: { ...prev.lengthChecks[field], checked },
                                    },
                                  }));
                                }}
                                className="rounded border-slate-300"
                              />
                              <span>{field}</span>
                            </label>
                            <input
                              type="text"
                              value={schemeFormState.lengthChecks[field]?.value || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSchemeFormState((prev) => ({
                                  ...prev,
                                  lengthChecks: {
                                    ...prev.lengthChecks,
                                    [field]: { ...prev.lengthChecks[field], value: val },
                                  },
                                }));
                              }}
                              className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 2. 类型检测 */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100">类型检测</span>
                      <span className="text-slate-400 text-[11px]">元数据的类型格式，是否符合规范要求</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-2">
                      {['文件档号', '文件题名', '年度', '保管期限', '密级', '文件页数', '文号', '成文日期', '归档份数'].map(
                        (field) => (
                          <div key={`type-${field}`} className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 shrink-0 cursor-pointer min-w-[70px]">
                              <input
                                type="checkbox"
                                checked={schemeFormState.typeChecks[field]?.checked || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSchemeFormState((prev) => ({
                                    ...prev,
                                    typeChecks: {
                                      ...prev.typeChecks,
                                      [field]: { ...prev.typeChecks[field], checked },
                                    },
                                  }));
                                }}
                                className="rounded border-slate-300"
                              />
                              <span>{field}</span>
                            </label>
                            <select
                              value={schemeFormState.typeChecks[field]?.value || '字符型'}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSchemeFormState((prev) => ({
                                  ...prev,
                                  typeChecks: {
                                    ...prev.typeChecks,
                                    [field]: { ...prev.typeChecks[field], value: val },
                                  },
                                }));
                              }}
                              className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs cursor-pointer"
                            >
                              <option value="字符型">字符型</option>
                              <option value="数值型">数值型</option>
                              <option value="日期型">日期型</option>
                            </select>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 3. 值域检测 */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100">值域检测</span>
                      <span className="text-slate-400 text-[11px]">元数据的值，是否符合规范，格式：值1, 值2, 值3</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-2">
                      {['文件档号', '文件题名', '年度', '保管期限', '密级', '文件页数', '文号', '成文日期', '归档份数'].map(
                        (field) => (
                          <div key={`range-${field}`} className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 shrink-0 cursor-pointer min-w-[70px]">
                              <input
                                type="checkbox"
                                checked={schemeFormState.valueRangeChecks[field]?.checked || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSchemeFormState((prev) => ({
                                    ...prev,
                                    valueRangeChecks: {
                                      ...prev.valueRangeChecks,
                                      [field]: { ...prev.valueRangeChecks[field], checked },
                                    },
                                  }));
                                }}
                                className="rounded border-slate-300"
                              />
                              <span>{field}</span>
                            </label>
                            <input
                              type="text"
                              value={schemeFormState.valueRangeChecks[field]?.value || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSchemeFormState((prev) => ({
                                  ...prev,
                                  valueRangeChecks: {
                                    ...prev.valueRangeChecks,
                                    [field]: { ...prev.valueRangeChecks[field], value: val },
                                  },
                                }));
                              }}
                              className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 4. 有效值范围 */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100">有效值范围</span>
                      <span className="text-slate-400 text-[11px]">元数据的值，是否在合理有效的范围内，格式：最小值, 最大值</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-2">
                      {['文件档号', '文件题名', '年度', '保管期限', '密级', '文件页数', '文号', '成文日期', '归档份数'].map(
                        (field) => (
                          <div key={`valid-${field}`} className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 shrink-0 cursor-pointer min-w-[70px]">
                              <input
                                type="checkbox"
                                checked={schemeFormState.validRangeChecks[field]?.checked || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSchemeFormState((prev) => ({
                                    ...prev,
                                    validRangeChecks: {
                                      ...prev.validRangeChecks,
                                      [field]: { ...prev.validRangeChecks[field], checked },
                                    },
                                  }));
                                }}
                                className="rounded border-slate-300"
                              />
                              <span>{field}</span>
                            </label>
                            <input
                              type="text"
                              value={schemeFormState.validRangeChecks[field]?.value || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSchemeFormState((prev) => ({
                                  ...prev,
                                  validRangeChecks: {
                                    ...prev.validRangeChecks,
                                    [field]: { ...prev.validRangeChecks[field], value: val },
                                  },
                                }));
                              }}
                              className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 5. 特殊字符检测 */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100">特殊字符检测</span>
                      <span className="text-slate-400 text-[11px]">元数据的内容，是否含有不符合规范的特殊字符，例如：\, /, :, *, ?, ", &lt;, &gt;, |</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-2">
                      {['文件档号', '文件题名', '年度', '保管期限', '密级', '文件页数'].map(
                        (field) => (
                          <div key={`spec-${field}`} className="flex items-center gap-2">
                            <label className="flex items-center gap-1.5 shrink-0 cursor-pointer min-w-[70px]">
                              <input
                                type="checkbox"
                                checked={schemeFormState.specialCharChecks[field]?.checked || false}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setSchemeFormState((prev) => ({
                                    ...prev,
                                    specialCharChecks: {
                                      ...prev.specialCharChecks,
                                      [field]: { ...prev.specialCharChecks[field], checked },
                                    },
                                  }));
                                }}
                                className="rounded border-slate-300"
                              />
                              <span>{field}</span>
                            </label>
                            <input
                              type="text"
                              value={schemeFormState.specialCharChecks[field]?.value || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                setSchemeFormState((prev) => ({
                                  ...prev,
                                  specialCharChecks: {
                                    ...prev.specialCharChecks,
                                    [field]: { ...prev.specialCharChecks[field], value: val },
                                  },
                                }));
                              }}
                              className="w-full px-2 py-1 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  {/* 6. 档号规范性检测 */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 font-bold cursor-pointer text-slate-800 dark:text-slate-100">
                        <input
                          type="checkbox"
                          checked={schemeFormState.fileCodeNormChecked}
                          onChange={(e) =>
                            setSchemeFormState((prev) => ({
                              ...prev,
                              fileCodeNormChecked: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        <span>档号规范性检测</span>
                      </label>
                      <span className="text-slate-400 text-[11px]">档号，是否符合规范要求</span>
                    </div>
                  </div>

                  {/* 7. 重复性检测 */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100">重复性检测</span>
                      <span className="text-slate-400 text-[11px]">元数据的内容，是否存在不符合要求的重复情况</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pl-2">
                      {['文件档号', '文件题名', '年度', '文件页数', '保管期限', '密级', '文号', '成文日期', '归档份数'].map(
                        (field) => (
                          <label key={`dup-${field}`} className="flex items-center gap-1.5 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={schemeFormState.duplicateChecks[field] || false}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setSchemeFormState((prev) => ({
                                  ...prev,
                                  duplicateChecks: { ...prev.duplicateChecks, [field]: checked },
                                }));
                              }}
                              className="rounded border-slate-300"
                            />
                            <span>{field}</span>
                          </label>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Section B: 电子原文检测 */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    电子原文检测
                  </h4>

                  <div className="space-y-2.5 pl-2">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 font-semibold min-w-[130px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schemeFormState.sourceAuthenticity}
                          onChange={(e) =>
                            setSchemeFormState((prev) => ({
                              ...prev,
                              sourceAuthenticity: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        <span>来源真实性检测</span>
                      </label>
                      <span className="text-slate-400 text-[11px]">电子文件的固化信息，与元数据记录的是否一致</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 font-semibold min-w-[130px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schemeFormState.contentAuthenticity}
                          onChange={(e) =>
                            setSchemeFormState((prev) => ({
                              ...prev,
                              contentAuthenticity: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        <span>内容真实性检测</span>
                      </label>
                      <span className="text-slate-400 text-[11px]">电子文件的电子属性与元数据记录的是否一致</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 font-semibold min-w-[130px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schemeFormState.relationalConsistency}
                          onChange={(e) =>
                            setSchemeFormState((prev) => ({
                              ...prev,
                              relationalConsistency: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        <span>关联一致性检测</span>
                      </label>
                      <span className="text-slate-400 text-[11px]">元数据中记录的文件存储位置与实际存储位置是否一致</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 2: 完整性 (Screenshot 3) */}
            {schemeFormState.schemeSubTab === 'integrity' && (
              <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
                {/* Section A: 元数据检测 */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    元数据检测
                  </h4>

                  <div className="flex items-center gap-3 pl-2">
                    <label className="flex items-center gap-2 font-semibold min-w-[150px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schemeFormState.metadataCompleteness}
                        onChange={(e) =>
                          setSchemeFormState((prev) => ({
                            ...prev,
                            metadataCompleteness: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300"
                      />
                      <span>元数据项是否完整检测</span>
                    </label>
                    <span className="text-slate-400 text-[11px]">要求的或自定义元数据项是否完整</span>
                  </div>

                  {/* 必填项检测 */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-800 dark:text-slate-100">必填项检测</span>
                      <span className="text-slate-400 text-[11px]">必填的元数据是否有值</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-2">
                      {[
                        '文件档号',
                        '文件题名',
                        '年度',
                        '保管期限',
                        '密级',
                        '文件页数',
                        '文号',
                        '成文日期',
                        '归档份数',
                        '计算机文件名',
                        '计算机文件大小',
                        '格式信息',
                        '文档创建程序',
                        '信息系统描述',
                        '软件环境信息',
                        '硬件环境信息',
                      ].map((field) => (
                        <label key={`req-${field}`} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={schemeFormState.requiredChecks[field] || false}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setSchemeFormState((prev) => ({
                                ...prev,
                                requiredChecks: { ...prev.requiredChecks, [field]: checked },
                              }));
                            }}
                            className="rounded border-slate-300"
                          />
                          <span>{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 连续性检测 */}
                  <div className="flex items-center gap-3 pl-2 pt-2">
                    <label className="flex items-center gap-2 font-semibold min-w-[120px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schemeFormState.continuityCheck}
                        onChange={(e) =>
                          setSchemeFormState((prev) => ({
                            ...prev,
                            continuityCheck: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300"
                      />
                      <span>连续性检测</span>
                    </label>
                    <span className="text-slate-400 text-[11px]">连续编号的元数据项是否有漏号现象等</span>
                  </div>
                </div>

                {/* Section B: 电子原文检测 */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    电子原文检测
                  </h4>

                  <div className="flex items-center gap-3 pl-2">
                    <label className="flex items-center gap-2 font-semibold min-w-[130px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schemeFormState.contentCompleteness}
                        onChange={(e) =>
                          setSchemeFormState((prev) => ({
                            ...prev,
                            contentCompleteness: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300"
                      />
                      <span>内容完整性检测</span>
                    </label>
                    <span className="text-slate-400 text-[11px]">需要归档的附件类型是否完整，例如：正文，流转单</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: 可用性 (Screenshot 4) */}
            {schemeFormState.schemeSubTab === 'usability' && (
              <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
                {/* Section A: 元数据检测 */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    元数据检测
                  </h4>

                  <div className="flex items-center gap-3 pl-2">
                    <label className="flex items-center gap-2 font-semibold min-w-[140px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schemeFormState.metadataUsability}
                        onChange={(e) =>
                          setSchemeFormState((prev) => ({
                            ...prev,
                            metadataUsability: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300"
                      />
                      <span>元数据可用性检测</span>
                    </label>
                    <span className="text-slate-400 text-[11px]">元数据是否被正常访问</span>
                  </div>

                  {/* 软件环境信息检测 */}
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 font-semibold min-w-[140px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schemeFormState.swEnvCheck}
                          onChange={(e) =>
                            setSchemeFormState((prev) => ({
                              ...prev,
                              swEnvCheck: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        <span>软件环境信息检测</span>
                      </label>
                      <span className="text-slate-400 text-[11px]">元数据中的软件环境信息，是否符合归档要求，例如：windows NT 10.0, windows NT 6.1</span>
                    </div>
                    <input
                      type="text"
                      value={schemeFormState.swEnvValue}
                      onChange={(e) =>
                        setSchemeFormState((prev) => ({ ...prev, swEnvValue: e.target.value }))
                      }
                      placeholder="windows NT 10.0, windows NT 6.1"
                      className="w-full max-w-2xl px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs ml-6"
                    />
                  </div>

                  {/* 硬件环境信息检测 */}
                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 font-semibold min-w-[140px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schemeFormState.hwEnvCheck}
                          onChange={(e) =>
                            setSchemeFormState((prev) => ({
                              ...prev,
                              hwEnvCheck: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        <span>硬件环境信息检测</span>
                      </label>
                      <span className="text-slate-400 text-[11px]">元数据中的硬件环境信息，是否符合归档要求，例如：x64, x86</span>
                    </div>
                    <input
                      type="text"
                      value={schemeFormState.hwEnvValue}
                      onChange={(e) =>
                        setSchemeFormState((prev) => ({ ...prev, hwEnvValue: e.target.value }))
                      }
                      placeholder="x64, x86"
                      className="w-full max-w-2xl px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs ml-6"
                    />
                  </div>
                </div>

                {/* Section B: 电子原文检测 */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    电子原文检测
                  </h4>

                  <div className="space-y-2 pl-2">
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 font-semibold min-w-[130px] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schemeFormState.fileFormatCheck}
                          onChange={(e) =>
                            setSchemeFormState((prev) => ({
                              ...prev,
                              fileFormatCheck: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-300"
                        />
                        <span>文件格式检测</span>
                      </label>
                      <span className="text-slate-400 text-[11px]">电子档案内容数据的格式，例如：pdf, doc, docx, txt, jpg</span>
                    </div>
                    <input
                      type="text"
                      value={schemeFormState.fileFormatValue}
                      onChange={(e) =>
                        setSchemeFormState((prev) => ({ ...prev, fileFormatValue: e.target.value }))
                      }
                      placeholder="pdf, doc, docx, txt, jpg"
                      className="w-full max-w-2xl px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded bg-white dark:bg-slate-800 text-xs ml-6"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: 安全性 (Screenshot 5) */}
            {schemeFormState.schemeSubTab === 'security' && (
              <div className="space-y-6 text-xs text-slate-800 dark:text-slate-200">
                {/* Section A: 元数据检测 */}
                <div className="space-y-4">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    元数据检测
                  </h4>

                  <div className="flex items-center gap-3 pl-2">
                    <label className="flex items-center gap-2 font-semibold min-w-[150px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schemeFormState.topSecretTitleCheck}
                        onChange={(e) =>
                          setSchemeFormState((prev) => ({
                            ...prev,
                            topSecretTitleCheck: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300"
                      />
                      <span>绝密档案题名检测</span>
                    </label>
                    <span className="text-slate-400 text-[11px]">检测是否存在题名泄密的安全性风险</span>
                  </div>
                </div>

                {/* Section B: 电子原文检测 */}
                <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white border-l-4 border-blue-600 pl-2">
                    电子原文检测
                  </h4>

                  <div className="flex items-center gap-3 pl-2">
                    <label className="flex items-center gap-2 font-semibold min-w-[150px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={schemeFormState.topSecretFileCheck}
                        onChange={(e) =>
                          setSchemeFormState((prev) => ({
                            ...prev,
                            topSecretFileCheck: e.target.checked,
                          }))
                        }
                        className="rounded border-slate-300"
                      />
                      <span>绝密档案文件检测</span>
                    </label>
                    <span className="text-slate-400 text-[11px]">检测是否存在电子文件挂接泄密的安全性风险</span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Action Buttons Centered */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                onClick={handleSaveNewScheme}
                className="px-8 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                保存
              </button>
              <button
                onClick={() => setModalType(null)}
                className="px-8 py-2 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Scheme Rules Detail Modal */}
      {modalType === 'view_scheme_rules' && activeDetailItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <span>【{activeDetailItem.schemeName}】细则规则列表</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">1. 真实性检测 (Authenticity)</div>
                <div className="text-slate-500">国密SM2数字签章完整有效、电子时间戳可追溯。</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">2. 完整性检测 (Integrity)</div>
                <div className="text-slate-500">DA/T 46-2009 元数据必填项非空率100%，附录清晰。</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">3. 可用性检测 (Usability)</div>
                <div className="text-slate-500">OFD/A-1或PDF/A标椎双层可检索版式解析正常。</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">4. 安全性检测 (Security)</div>
                <div className="text-slate-500">无恶意脚本代码注入，传输存储全面国密SM4加密。</div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
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
