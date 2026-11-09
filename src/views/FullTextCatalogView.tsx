import React, { useState } from 'react';
import {
  Search,
  FileText,
  Filter,
  Eye,
  BookOpen,
  Download,
  Bookmark,
  Sparkles,
  CheckSquare,
  Square,
  Building2,
  FileCheck,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Grid,
  List,
  Clock,
  Layers,
  File,
  FileSpreadsheet,
  FileCode,
  ShieldAlert,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

interface FullTextCatalogViewProps {
  onSelectRecord: (record: any) => void;
  onApplyBorrow: (record: any) => void;
  onShowMessage: (msg: string) => void;
}

export interface FullTextRecord {
  id: string;
  archiveRefCode: string;
  fondsCode: string;
  fondsName: string;
  title: string;
  archiveType: string;
  author: string;
  year: number;
  writtenDate: string;
  archivedDate: string;
  retentionPeriod: string;
  securityLevel: string;
  pageCount: number;
  hitSnippet: string;
  hitPage: number;
  totalHits: number;
  fileFormat: string;
  hasPermission: boolean;
}

const mockFullTextDataset: FullTextRecord[] = [
  {
    id: 'ft-01',
    archiveRefCode: '0110-WS·2026-Y-BGS-0001',
    fondsCode: '0001',
    fondsName: '成都市住房和城乡建设局全宗',
    title: '国家档案局10号令《企业文件材料归档范围和档案保管期限的规定》.doc',
    archiveType: '文书档案',
    author: '国家档案局',
    year: 2026,
    writtenDate: '2026-11-03',
    archivedDate: '2026-11-04',
    retentionPeriod: '永久',
    securityLevel: '机密',
    pageCount: 111,
    hitSnippet: '……文件内容国家档案局10号令《企业文件材料归档范围和档案保管期限的规定》文件内容，全流程规范政企数字化档案收收集、移交、归档和保管期限划定。各企事业单位需结合自身业务流程厘清【企业文件材料】保存周期……',
    hitPage: 2,
    totalHits: 18,
    fileFormat: '.doc',
    hasPermission: true,
  },
  {
    id: 'ft-02',
    archiveRefCode: '0110-BS·2026-Y-BGS-0002',
    fondsCode: '0001',
    fondsName: '成都市住房和城乡建设局全宗',
    title: '成都市住房和城乡建设局关于2026年建筑工程竣工归档范围的规定.pdf',
    archiveType: '工程档案',
    author: '成都市住房和城乡建设局',
    year: 2026,
    writtenDate: '2026-11-02',
    archivedDate: '2026-11-03',
    retentionPeriod: '30年',
    securityLevel: '秘密',
    pageCount: 68,
    hitSnippet: '……新建住宅及公共建筑工程在办理竣工验收备案前，必须全面整理【企业文件材料】与工程建设档案，确保四性检测达标，按规范归集BIM三维模型数据与电子印章证书……',
    hitPage: 5,
    totalHits: 14,
    fileFormat: '.pdf',
    hasPermission: false,
  },
  {
    id: 'ft-03',
    archiveRefCode: '0110-WS·2026-Y-BGS-0003',
    fondsCode: '0002',
    fondsName: '成都市人力资源和社会保障局全宗',
    title: '关于印发2026年重点促进就业与企业扶持政策实施细则的通知.ofd',
    archiveType: '文书档案',
    author: '成都市人力资源和社会保障局',
    year: 2026,
    writtenDate: '2026-11-01',
    archivedDate: '2026-11-02',
    retentionPeriod: '30年',
    securityLevel: '秘密',
    pageCount: 42,
    hitSnippet: '……设立专项稳岗就业资金池，对符合条件的企业按规定归档【企业文件材料】并完成线上资格审查后拨付贴息补贴，经专家组自查审计后归归档备案……',
    hitPage: 1,
    totalHits: 9,
    fileFormat: '.ofd',
    hasPermission: true,
  },
  {
    id: 'ft-04',
    archiveRefCode: '0110-QE·2026-Y-BGS-0004',
    fondsCode: '0003',
    fondsName: '成都市发展和改革委员会全宗',
    title: '成都市“十四五”数字政府建设与政务档案数字孪生规划纲要.pdf',
    archiveType: '科技档案',
    author: '成都市发展和改革委员会',
    year: 2026,
    writtenDate: '2026-11-05',
    archivedDate: '2026-11-01',
    retentionPeriod: '永久',
    securityLevel: '内部',
    pageCount: 156,
    hitSnippet: '……依托全域数据资源池与智算中心，推动政务【文件材料】全生命周期数字化重构，实现跨部门档案一网通办、智能全文检索与自动化鉴定销毁……',
    hitPage: 12,
    totalHits: 25,
    fileFormat: '.pdf',
    hasPermission: true,
  },
  {
    id: 'ft-05',
    archiveRefCode: '0110-TE·2026-Y-BGS-0005',
    fondsCode: '0004',
    fondsName: '成都市财政局全宗',
    title: '关于下达2026年全域电子会计凭证与电子归档资金预算的通知.ofd',
    archiveType: '会计档案',
    author: '成都市财政局',
    year: 2026,
    writtenDate: '2026-11-05',
    archivedDate: '2026-11-05',
    retentionPeriod: '30年',
    securityLevel: '秘密',
    pageCount: 35,
    hitSnippet: '……拨付专项资金用于市级机关及重点企事业单位【企业文件材料】信息化升级，建立标准化的电子会计档案库房与备份中心……',
    hitPage: 3,
    totalHits: 11,
    fileFormat: '.ofd',
    hasPermission: true,
  },
  {
    id: 'ft-06',
    archiveRefCode: '0110-JT·2026-Y-BGS-0006',
    fondsCode: '0005',
    fondsName: '成都市交通运输局全宗',
    title: '成都市智能网联汽车高精度地图数据安全与归档管理办法.pdf',
    archiveType: '科技档案',
    author: '成都市交通运输局',
    year: 2026,
    writtenDate: '2026-11-05',
    archivedDate: '2026-11-05',
    retentionPeriod: '30年',
    securityLevel: '机密',
    pageCount: 88,
    hitSnippet: '……自动驾驶测试车辆运行数据及相关【企业文件材料】须在测试完成后30日内加密归档，严格执行脱敏与国密算法加密标准……',
    hitPage: 7,
    totalHits: 16,
    fileFormat: '.pdf',
    hasPermission: false,
  },
  {
    id: 'ft-07',
    archiveRefCode: '0110-CW·2026-Y-BGS-0007',
    fondsCode: '0006',
    fondsName: '成都市规划和自然资源局全宗',
    title: '成都市中心城区国土空间规划地下管线数字化档案汇编.pdf',
    archiveType: '工程档案',
    author: '成都市规划和自然资源局',
    year: 2026,
    writtenDate: '2026-11-05',
    archivedDate: '2026-11-05',
    retentionPeriod: '永久',
    securityLevel: '秘密',
    pageCount: 210,
    hitSnippet: '……管线竣工测量成果及关联【文件材料】需由施工单位在项目竣工后全量归档，建立一管一档防篡改数据库……',
    hitPage: 24,
    totalHits: 30,
    fileFormat: '.pdf',
    hasPermission: true,
  },
  {
    id: 'ft-08',
    archiveRefCode: '0110-YB·2026-Y-BGS-0008',
    fondsCode: '0007',
    fondsName: '成都市水务局全宗',
    title: '成都市防汛抗旱指挥部2026年主汛期水利设施巡检归档汇总表.xlsx',
    archiveType: '文书档案',
    author: '成都市水务局',
    year: 2026,
    writtenDate: '2026-11-05',
    archivedDate: '2026-11-05',
    retentionPeriod: '10年',
    securityLevel: '公开',
    pageCount: 15,
    hitSnippet: '……全市 48 座水库及堤防设施巡检记录、现场影像与【企业文件材料】均已通过智慧水务APP实时归集并封存入库……',
    hitPage: 1,
    totalHits: 5,
    fileFormat: '.xlsx',
    hasPermission: true,
  },
  {
    id: 'ft-09',
    archiveRefCode: '0110-GD·2026-Y-BGS-0009',
    fondsCode: '0008',
    fondsName: '成都市生态环境局全宗',
    title: '2026年第三季度全市重点排污单位碳排放核查与备案档案.ofd',
    archiveType: '科技档案',
    author: '成都市生态环境局',
    year: 2026,
    writtenDate: '2026-11-04',
    archivedDate: '2026-11-05',
    retentionPeriod: '30年',
    securityLevel: '公开',
    pageCount: 94,
    hitSnippet: '……第三方核查机构出具的报告及【企业文件材料】统一纳入电子档案库管理，作为后续碳交易与履约审核依据……',
    hitPage: 9,
    totalHits: 13,
    fileFormat: '.ofd',
    hasPermission: true,
  },
  {
    id: 'ft-10',
    archiveRefCode: '0110-KJ·2026-Y-BGS-0010',
    fondsCode: '0009',
    fondsName: '成都市市场监督管理局全宗',
    title: '关于开展全市知识产权质押融资登记档案规范化建设的通知.doc',
    archiveType: '文书档案',
    author: '成都市市场监督管理局',
    year: 2026,
    writtenDate: '2026-11-04',
    archivedDate: '2026-11-04',
    retentionPeriod: '永久',
    securityLevel: '公开',
    pageCount: 32,
    hitSnippet: '……规范质押合同、评估报告及商业企划等【企业文件材料】的立卷与移交标准，支持知识产权跨区县线上协同调阅……',
    hitPage: 4,
    totalHits: 8,
    fileFormat: '.doc',
    hasPermission: true,
  },
  {
    id: 'ft-11',
    archiveRefCode: '0110-TY·2026-Y-BGS-0011',
    fondsCode: '0010',
    fondsName: '成都市经济和信息化局全宗',
    title: '成都市2026年首批专精特新“小巨人”企业认定申报材料汇编.pdf',
    archiveType: '科技档案',
    author: '成都市经济和信息化局',
    year: 2026,
    writtenDate: '2026-11-04',
    archivedDate: '2026-11-04',
    retentionPeriod: '30年',
    securityLevel: '秘密',
    pageCount: 240,
    hitSnippet: '……评审委员会对申报企业提交的研发审计报告、专利证书及【企业文件材料】进行合规性抽查，归档备查周期为30年……',
    hitPage: 15,
    totalHits: 22,
    fileFormat: '.pdf',
    hasPermission: false,
  },
  {
    id: 'ft-12',
    archiveRefCode: '0110-WJ·2026-Y-BGS-0012',
    fondsCode: '0011',
    fondsName: '成都市商务局全宗',
    title: '2026年中国（四川）自由贸易试验区成都片区跨国采购签约文件.ofd',
    archiveType: '文书档案',
    author: '成都市商务局',
    year: 2026,
    writtenDate: '2026-11-04',
    archivedDate: '2026-11-04',
    retentionPeriod: '永久',
    securityLevel: '机密',
    pageCount: 76,
    hitSnippet: '……自贸区双语合同及外资项目审批【企业文件材料】完成国密水印签署，并转入高密级档案电子库长期保存……',
    hitPage: 6,
    totalHits: 17,
    fileFormat: '.ofd',
    hasPermission: true,
  },
];

export const FullTextCatalogView: React.FC<FullTextCatalogViewProps> = ({
  onSelectRecord,
  onApplyBorrow,
  onShowMessage,
}) => {
  const [fondsSelect, setFondsSelect] = useState('成都市住房和城乡建设局全宗');
  const [searchQuery, setSearchQuery] = useState('企业文件材料');
  const [hasSearched, setHasSearched] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [viewStyle, setViewStyle] = useState<'card' | 'table'>('card');
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Filter criteria
  const [archiveTypeFilter, setArchiveTypeFilter] = useState('全部');
  const [retentionFilter, setRetentionFilter] = useState('全部');
  const [securityFilter, setSecurityFilter] = useState('全部');

  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredData = mockFullTextDataset.filter((item) => {
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.hitSnippet.toLowerCase().includes(q) ||
      item.archiveRefCode.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.fondsName.toLowerCase().includes(q);

    const matchesType = archiveTypeFilter === '全部' || item.archiveType === archiveTypeFilter;
    const matchesRetention = retentionFilter === '全部' || item.retentionPeriod === retentionFilter;
    const matchesSecurity = securityFilter === '全部' || item.securityLevel === securityFilter;

    return matchesQuery && matchesType && matchesRetention && matchesSecurity;
  }).sort((a, b) => (b.archivedDate || "").localeCompare(a.archivedDate || ""));

  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.writtenDate).getTime() - new Date(a.writtenDate).getTime()
  );

  const paginatedData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleExecuteSearch = () => {
    setHasSearched(true);
    setCurrentPage(1);
    onShowMessage(`全文检索完成，为您找到约 ${sortedData.length} 份匹配的电子档案正文`);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((d) => d.id));
    }
  };

  const handleBatchBorrow = () => {
    if (selectedIds.length === 0) {
      onShowMessage('请先勾选需要借阅的全文档案');
      return;
    }
    onShowMessage(`已提交 ${selectedIds.length} 份档案的调阅申请，请等待审批`);
  };

  const handleBatchFavorite = () => {
    if (selectedIds.length === 0) {
      onShowMessage('请先勾选需要收藏的文档');
      return;
    }
    onShowMessage(`成功将 ${selectedIds.length} 份文档加入我的收藏`);
  };

  const getFormatIcon = (format: string) => {
    if (format === '.doc' || format === '.docx') {
      return <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />;
    }
    if (format === '.pdf') {
      return <File className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />;
    }
    if (format === '.ofd') {
      return <FileCode className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />;
    }
    if (format === '.xlsx') {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
    }
    return <FileText className="w-5 h-5 text-slate-500 shrink-0" />;
  };

  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;
    const q = searchQuery.trim();
    const parts = text.split(new RegExp(`(${q})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === q.toLowerCase() ? (
            <mark
              key={i}
              className="bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-300 font-bold px-1 py-0.5 rounded border border-red-200 dark:border-red-900"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Search Input Control Section (Landing vs Results top bar) */}
      {!hasSearched ? (
        /* Initial Landing Search View (Screenshot 1 Style) */
        <div className="min-h-[480px] flex flex-col items-center justify-center p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              全文检索
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              基于 OFD/PDF 原生文本提取与 OCR 识别，秒级穿透检索整份档案正文段落
            </p>
          </div>

          {/* Search Box Lockup */}
          <div className="w-full max-w-3xl space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch rounded-xl border-2 border-blue-500 dark:border-blue-600 bg-white dark:bg-slate-850 shadow-md overflow-hidden">
              <select
                value={fondsSelect}
                onChange={(e) => setFondsSelect(e.target.value)}
                className="w-full sm:w-56 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-3 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 focus:outline-hidden cursor-pointer"
              >
                <option value="成都市住房和城乡建设局全宗">成都市住房和城乡建设局全宗</option>
                <option value="成都市人力资源和社会保障局全宗">成都市人力资源和社会保障局全宗</option>
                <option value="成都市发展和改革委员会全宗">成都市发展和改革委员会全宗</option>
                <option value="成都市财政局全宗">成都市财政局全宗</option>
                <option value="成都市交通运输局全宗">成都市交通运输局全宗</option>
                <option value="成都市规划和自然资源局全宗">成都市规划和自然资源局全宗</option>
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleExecuteSearch();
                }}
                placeholder="请输入关键词进行检索，多个关键词用空格或;分开"
                className="flex-1 text-xs px-4 py-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
              />

              <button
                onClick={handleExecuteSearch}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>检索</span>
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium flex items-center gap-1"
              >
                <span>更多选项</span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="text-[11px] text-slate-400 font-mono">
                热门检索: 企业文件材料 / 竣工归档 / 稳岗补贴 / 数字化档案
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvanced && (
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-200">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">档案类型</label>
                  <select
                    value={archiveTypeFilter}
                    onChange={(e) => setArchiveTypeFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="全部">全部类型</option>
                    <option value="文书档案">文书档案</option>
                    <option value="工程档案">工程档案</option>
                    <option value="科技档案">科技档案</option>
                    <option value="会计档案">会计档案</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">保管期限</label>
                  <select
                    value={retentionFilter}
                    onChange={(e) => setRetentionFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="全部">全部期限</option>
                    <option value="永久">永久</option>
                    <option value="30年">30年</option>
                    <option value="10年">10年</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">密级要求</label>
                  <select
                    value={securityFilter}
                    onChange={(e) => setSecurityFilter(e.target.value)}
                    className="w-full text-xs p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="全部">全部密级</option>
                    <option value="公开">公开</option>
                    <option value="内部">内部</option>
                    <option value="秘密">秘密</option>
                    <option value="机密">机密</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Search Results Page View (Screenshot 2 Style) */
        <div className="space-y-4">
          {/* Top Search Lockup */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <span className="text-base font-extrabold text-slate-900 dark:text-white shrink-0">
                全文检索
              </span>

              <div className="flex-1 w-full flex flex-col sm:flex-row items-stretch rounded-lg border border-blue-500 dark:border-blue-600 bg-white dark:bg-slate-850 overflow-hidden">
                <select
                  value={fondsSelect}
                  onChange={(e) => setFondsSelect(e.target.value)}
                  className="w-full sm:w-56 text-xs font-semibold text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-3 py-2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700 focus:outline-hidden cursor-pointer"
                >
                  <option value="成都市住房和城乡建设局全宗">成都市住房和城乡建设局全宗</option>
                  <option value="成都市人力资源和社会保障局全宗">成都市人力资源和社会保障局全宗</option>
                  <option value="成都市发展和改革委员会全宗">成都市发展和改革委员会全宗</option>
                  <option value="成都市财政局全宗">成都市财政局全宗</option>
                  <option value="成都市交通运输局全宗">成都市交通运输局全宗</option>
                  <option value="成都市规划和自然资源局全宗">成都市规划和自然资源局全宗</option>
                </select>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExecuteSearch();
                  }}
                  className="flex-1 text-xs px-3 py-2 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />

                <button
                  onClick={handleExecuteSearch}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>检索</span>
                </button>
              </div>

              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium shrink-0 flex items-center gap-0.5"
              >
                <span>更多选项</span>
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>

            {/* Advanced Filters Panel inside Results */}
            {showAdvanced && (
              <div className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">档案类型</label>
                  <select
                    value={archiveTypeFilter}
                    onChange={(e) => setArchiveTypeFilter(e.target.value)}
                    className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="全部">全部类型</option>
                    <option value="文书档案">文书档案</option>
                    <option value="工程档案">工程档案</option>
                    <option value="科技档案">科技档案</option>
                    <option value="会计档案">会计档案</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">保管期限</label>
                  <select
                    value={retentionFilter}
                    onChange={(e) => setRetentionFilter(e.target.value)}
                    className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="全部">全部期限</option>
                    <option value="永久">永久</option>
                    <option value="30年">30年</option>
                    <option value="10年">10年</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-500 mb-1">密级要求</label>
                  <select
                    value={securityFilter}
                    onChange={(e) => setSecurityFilter(e.target.value)}
                    className="w-full text-xs p-1.5 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="全部">全部密级</option>
                    <option value="公开">公开</option>
                    <option value="内部">内部</option>
                    <option value="秘密">秘密</option>
                    <option value="机密">机密</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Result Count Status Line & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 border-b-2 border-blue-600 pb-2 -mb-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">全文</span>
                <span className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">
                  ({sortedData.length})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>本次检索耗时 0.43s</span>
              <span>·</span>
              <span>共为您找到相关结果约 {sortedData.length} 个</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handleBatchBorrow}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>申请借阅</span>
              </button>
              <button
                onClick={handleBatchFavorite}
                className="px-4 py-1.5 rounded-lg border border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>加入收藏</span>
              </button>
              <button
                onClick={() => onShowMessage(`已导出选中的 ${selectedIds.length || sortedData.length} 份检索结果`)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>导出</span>
              </button>
            </div>

            {/* Layout Style Switcher (Card View vs Table View) */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-end sm:self-auto">
              <button
                onClick={() => setViewStyle('card')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  viewStyle === 'card'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>卡片视图</span>
              </button>
              <button
                onClick={() => setViewStyle('table')}
                className={`px-2.5 py-1 rounded text-xs font-medium flex items-center gap-1 transition-colors ${
                  viewStyle === 'table'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>表格视图</span>
              </button>
            </div>
          </div>

          {/* Results List: Card View vs Table View */}
          {viewStyle === 'card' ? (
            <div className="space-y-4">
              {paginatedData.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                return (
                  <div
                    key={item.id}
                    className={`relative p-5 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/20 shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    {/* Top Title Bar */}
                    <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        {getFormatIcon(item.fileFormat)}
                        <span
                          onClick={() => onSelectRecord(item)}
                          className="font-bold text-sm text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer truncate"
                        >
                          {highlightText(item.title)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.hasPermission ? (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                            <Unlock className="w-3 h-3" />
                            <span>允许全文查阅</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[10px] font-bold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            <span>仅预览附件名称(需申请解密)</span>
                          </span>
                        )}

                        <button
                          onClick={() => toggleSelect(item.id)}
                          className="text-slate-400 hover:text-blue-600 transition-colors p-1"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          ) : (
                            <Square className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Hit Snippet Box with Permission Overlay state if disabled */}
                    <div className="relative my-3 p-3.5 rounded-lg bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-mono">
                      {!item.hasPermission ? (
                        <div className="space-y-2">
                          <div className="filter blur-[3px] select-none text-slate-400">
                            {item.hitSnippet}
                          </div>
                          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] rounded-lg flex items-center justify-center p-3 text-white text-xs font-bold gap-2">
                            <ShieldAlert className="w-4 h-4 text-amber-400" />
                            <span>对于无电子文件浏览权限的，只能看到附件名称</span>
                            <button
                              onClick={() => onApplyBorrow(item)}
                              className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] ml-2"
                            >
                              提交查阅解密申请
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                            <span>正文深度命中片段 (命中第 {item.hitPage} 页 · 出现 {item.totalHits} 次):</span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">国密算法脱敏验证</span>
                          </div>
                          <div>{highlightText(item.hitSnippet)}</div>
                        </div>
                      )}
                    </div>

                    {/* Metadata Footer Grid */}
                    <div className="flex flex-wrap items-center justify-between gap-y-2 text-[11px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-2 font-mono">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span>全宗号: <strong className="text-slate-700 dark:text-slate-300">{item.fondsCode}</strong></span>
                        <span>档案类型: <strong className="text-slate-700 dark:text-slate-300">{item.archiveType}</strong></span>
                        <span>档号: <strong className="text-blue-600 dark:text-blue-400">{item.archiveRefCode}</strong></span>
                        <span>年度: <strong className="text-slate-700 dark:text-slate-300">{item.year}</strong></span>
                        <span>成文日期: <strong className="text-slate-700 dark:text-slate-300">{item.writtenDate}</strong></span>
                        <span>保管期限: <strong className="text-slate-700 dark:text-slate-300">{item.retentionPeriod}</strong></span>
                        <span>密级: <strong className="text-slate-700 dark:text-slate-300">{item.securityLevel}</strong></span>
                        <span>页数: <strong className="text-slate-700 dark:text-slate-300">{item.pageCount}页</strong></span>
                        <span>责任者: <strong className="text-slate-700 dark:text-slate-300">{item.author}</strong></span>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onSelectRecord(item)}
                          className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 text-[11px] font-medium transition-colors"
                        >
                          条目详情
                        </button>
                        <button
                          onClick={() => onApplyBorrow(item)}
                          className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-[11px] font-semibold transition-colors"
                        >
                          调阅申请
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Modern Table Grid View */
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-medium">
                    <th className="py-3 px-3 w-10 text-center">
                      <button onClick={toggleSelectAll} className="p-1">
                        {selectedIds.length === paginatedData.length && paginatedData.length > 0 ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-400" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-3 w-12 text-center">序号</th>
                    <th className="py-3 px-3 min-w-[200px]">文件题名 / 原件名称</th>
                    <th className="py-3 px-3 min-w-[150px]">文件档号</th>
                    <th className="py-3 px-3 min-w-[140px]">全宗名称</th>
                    <th className="py-3 px-3 w-24">保管期限</th>
                    <th className="py-3 px-3 w-20">密级</th>
                    <th className="py-3 px-3 w-28">成文日期</th>
                    <th className="py-3 px-3 w-24">权限状态</th>
                    <th className="py-3 px-3 w-28 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {paginatedData.map((item, index) => {
                    const isSelected = selectedIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors ${
                          isSelected ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center">
                          <button onClick={() => toggleSelect(item.id)}>
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-blue-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-400">
                          {(currentPage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <div className="flex items-center gap-2">
                            {getFormatIcon(item.fileFormat)}
                            <span
                              onClick={() => onSelectRecord(item)}
                              className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer"
                            >
                              {highlightText(item.title)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3 text-blue-600 dark:text-blue-400 font-bold">
                          {item.archiveRefCode}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-sans">
                          {item.fondsName}
                        </td>
                        <td className="py-3 px-3">{item.retentionPeriod}</td>
                        <td className="py-3 px-3">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                            {item.securityLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-500">{item.writtenDate}</td>
                        <td className="py-3 px-3">
                          {item.hasPermission ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                              可全看
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                              需申请
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onSelectRecord(item)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-sans font-medium text-[11px]"
                            >
                              查看
                            </button>
                            <button
                              onClick={() => onApplyBorrow(item)}
                              className="px-2 py-0.5 rounded bg-blue-600 text-white hover:bg-blue-700 text-[11px] font-sans font-medium"
                            >
                              借阅
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Component - Strict 10 per page */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
            <Pagination
              currentPage={currentPage}
              totalItems={sortedData.length}
              pageSize={PAGE_SIZE}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
