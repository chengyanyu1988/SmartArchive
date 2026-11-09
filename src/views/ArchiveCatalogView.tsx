import React, { useState } from 'react';
import {
  Search,
  FolderSearch,
  Filter,
  Eye,
  BookOpen,
  Download,
  Bookmark,
  Sparkles,
  ChevronRight,
  CheckSquare,
  Square,
  ArrowLeft,
  Building2,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

interface ArchiveCatalogViewProps {
  onSelectRecord: (record: any) => void;
  onApplyBorrow: (record: any) => void;
  onShowMessage: (msg: string) => void;
}

interface ItemSearchRecord {
  id: string;
  title: string;          // 文件题名
  year: number;           // 年度
  archiveRefCode: string; // 文件档号
  docNo: string;          // 文号
  securityLevel: '公开' | '内部' | '秘密' | '机密'; // 密级
  retentionPeriod: '永久' | '30年' | '10年'; // 保管期限
  category: '文书档案' | '会计档案' | '工程档案' | '照片档案';
  subCategory: '文书档案-文件' | '文书档案-案卷';
  author: string;
  creationDate: string;
}

// 2026 Recent Authentic Item Search Dataset (30 items)
const mockItemSearchDataset: ItemSearchRecord[] = [
  { id: 'itm-01', title: '关于成立成都市就业工作领导小组的通知', year: 2026, archiveRefCode: '0110-WS-2026-Y-BGS-0001', docNo: '国台办2026[001]号', securityLevel: '机密', retentionPeriod: '永久', category: '文书档案', subCategory: '文书档案-文件', author: '成都市人民政府办公室', creationDate: '2026-11-03' },
  { id: 'itm-02', title: '关于印发2026年重点促进就业与创业扶持政策实施细则的通知', year: 2026, archiveRefCode: '0110-BS-2026-Y-BGS-0002', docNo: '国台办2026[002]号', securityLevel: '秘密', retentionPeriod: '30年', category: '文书档案', subCategory: '文书档案-文件', author: '成都市人力资源和社会保障局', creationDate: '2026-11-02' },
  { id: 'itm-03', title: '关于表彰2026年度稳岗扩就业先进单位与优秀个人的决定', year: 2026, archiveRefCode: '0110-WS-2026-Y-BGS-0003', docNo: '国台办2026[003]号', securityLevel: '秘密', retentionPeriod: '30年', category: '文书档案', subCategory: '文书档案-案卷', author: '成都市就业促进委员会', creationDate: '2026-11-01' },
  { id: 'itm-04', title: '关于下达2026年高校毕业生就业创业专项补贴资金预算的通知', year: 2026, archiveRefCode: '0110-QE-2026-Y-BGS-0004', docNo: '国台办2026[004]号', securityLevel: '秘密', retentionPeriod: '30年', category: '文书档案', subCategory: '文书档案-文件', author: '成都市财政局', creationDate: '2026-11-05' },
  { id: 'itm-05', title: '关于开展全市就业困难人员一对一帮扶行动方案的批复', year: 2026, archiveRefCode: '0110-TE-2026-Y-BGS-0005', docNo: '国台办2026[005]号', securityLevel: '秘密', retentionPeriod: '30年', category: '文书档案', subCategory: '文书档案-案卷', author: '成都市发展和改革委员会', creationDate: '2026-11-05' },
  { id: 'itm-06', title: '关于数字化智能交通三期工程就业岗位对接会议纪要', year: 2026, archiveRefCode: '0110-JT-2026-Y-BGS-0006', docNo: '市交字2026[088]号', securityLevel: '内部', retentionPeriod: '10年', category: '文书档案', subCategory: '文书档案-文件', author: '成都市交通运输局', creationDate: '2026-11-05' },
  { id: 'itm-07', title: '2026年第三季度全市各区县就业失业动态监测分析报告', year: 2026, archiveRefCode: '0110-CW-2026-Y-BGS-0007', docNo: '成府发2026[045]号', securityLevel: '公开', retentionPeriod: '10年', category: '文书档案', subCategory: '文书档案-案卷', author: '成都市统计局', creationDate: '2026-11-05' },
  { id: 'itm-08', title: '关于推进灵活就业人员社会保险补贴申领通办流程的规范', year: 2026, archiveRefCode: '0110-YB-2026-Y-BGS-0008', docNo: '成医保发2026[012]号', securityLevel: '公开', retentionPeriod: '30年', category: '文书档案', subCategory: '文书档案-文件', author: '成都市医疗保障局', creationDate: '2026-11-05' },
  { id: 'itm-09', title: '新建轨道交通5号线二期工程建设期间临时就业岗位调配记录', year: 2026, archiveRefCode: '0110-GD-2026-Y-BGS-0009', docNo: '轨交字2026[019]号', securityLevel: '内部', retentionPeriod: '10年', category: '工程档案', subCategory: '文书档案-文件', author: '成都市轨道交通集团', creationDate: '2026-11-04' },
  { id: 'itm-10', title: '2026年全市高新技术企业R&D研发人员就业落户绿色通道批复', year: 2026, archiveRefCode: '0110-KJ-2026-Y-BGS-0010', docNo: '成科字2026[033]号', securityLevel: '公开', retentionPeriod: '永久', category: '文书档案', subCategory: '文书档案-文件', author: '成都市科学技术局', creationDate: '2026-11-04' },
  { id: 'itm-11', title: '全市退役军人再就业创业培训基地建设工程竣工验收文件', year: 2026, archiveRefCode: '0110-TY-2026-Y-BGS-0011', docNo: '成退役字2026[008]号', securityLevel: '内部', retentionPeriod: '永久', category: '工程档案', subCategory: '文书档案-案卷', author: '成都市退役军人事务局', creationDate: '2026-11-04' },
  { id: 'itm-12', title: '2026年三季度公立医院卫生技术人员就业编制核定备案表', year: 2026, archiveRefCode: '0110-WJ-2026-Y-BGS-0012', docNo: '成卫健发2026[051]号', securityLevel: '秘密', retentionPeriod: '30年', category: '会计档案', subCategory: '文书档案-文件', author: '成都市卫生健康委员会', creationDate: '2026-11-04' },
  { id: 'itm-13', title: '市属高职院校产教融合实训基地毕业生就地就业意向协议汇总', year: 2026, archiveRefCode: '0110-JY-2026-Y-BGS-0013', docNo: '成教字2026[027]号', securityLevel: '公开', retentionPeriod: '10年', category: '文书档案', subCategory: '文书档案-案卷', author: '成都市教育局', creationDate: '2026-11-04' },
  { id: 'itm-14', title: '全市残疾人就业保障金征缴与安置就业专项审计凭证表', year: 2026, archiveRefCode: '0110-SJ-2026-Y-BGS-0014', docNo: '成审字2026[018]号', securityLevel: '机密', retentionPeriod: '30年', category: '会计档案', subCategory: '文书档案-文件', author: '成都市审计局', creationDate: '2026-11-03' },
  { id: 'itm-15', title: '2026年大型春季人才招聘会暨就业博览会现场高质高清照片', year: 2026, archiveRefCode: '0110-ZP-2026-Y-BGS-0015', docNo: '成宣图2026[099]号', securityLevel: '公开', retentionPeriod: '永久', category: '照片档案', subCategory: '文书档案-文件', author: '成都市委宣传部', creationDate: '2026-11-03' },
  { id: 'itm-16', title: '关于东部新区新能源汽车产业园就业吸纳能力评估报告', year: 2026, archiveRefCode: '0110-HZ-2026-Y-BGS-0016', docNo: '成经合发2026[030]号', securityLevel: '内部', retentionPeriod: '30年', category: '工程档案', subCategory: '文书档案-案卷', author: '成都市经济合作局', creationDate: '2026-11-03' },
  { id: 'itm-17', title: '2026年度全市生态环境监测人员专业就业资质考评清册', year: 2026, archiveRefCode: '0110-HJ-2026-Y-BGS-0017', docNo: '成环发2026[015]号', securityLevel: '公开', retentionPeriod: '10年', category: '文书档案', subCategory: '文书档案-文件', author: '成都市生态环境局', creationDate: '2026-11-03' },
  { id: 'itm-18', title: '全市公共资源交易平台电子竞标企业就业保障承诺声明', year: 2026, archiveRefCode: '0110-JY-2026-Y-BGS-0018', docNo: '成公资发2026[009]号', securityLevel: '内部', retentionPeriod: '10年', category: '会计档案', subCategory: '文书档案-文件', author: '成都市公共资源交易中心', creationDate: '2026-11-03' },
  { id: 'itm-19', title: '关于防汛救灾应急队伍青年就业志愿者动员指令', year: 2026, archiveRefCode: '0110-YJ-2026-Y-BGS-0019', docNo: '成应字2026[040]号', securityLevel: '公开', retentionPeriod: '永久', category: '文书档案', subCategory: '文书档案-案卷', author: '成都市应急管理局', creationDate: '2026-11-02' },
  { id: 'itm-20', title: '2026年市智慧城市数字平台研发人员就业合同与保密协议', year: 2026, archiveRefCode: '0110-DSJ-2026-Y-BGS-0020', docNo: '成数发2026[022]号', securityLevel: '秘密', retentionPeriod: '30年', category: '文书档案', subCategory: '文书档案-文件', author: '成都市大数据政务局', creationDate: '2026-11-02' },
  { id: 'itm-21', title: '市建筑工程质量监督站新招录专业工程师履历表', year: 2025, archiveRefCode: '0110-ZJ-2025-Y-BGS-0021', docNo: '成住建发2025[088]号', securityLevel: '秘密', retentionPeriod: '30年', category: '文书档案', subCategory: '文书档案-文件', author: '成都市住房和城乡建设局', creationDate: '2026-11-03' },
];

export const ArchiveCatalogView: React.FC<ArchiveCatalogViewProps> = ({
  onSelectRecord,
  onApplyBorrow,
  onShowMessage,
}) => {
  // Navigation mode: 'search_page' (条目检索初始页) vs 'result_page' (检索结果页)
  const [viewState, setViewState] = useState<'search_page' | 'result_page'>('search_page');

  // Search input state (authentic municipal entity fonds)
  const [companyFonds, setCompanyFonds] = useState('成都市住房和城乡建设局全宗');
  const [searchKeywords, setSearchKeywords] = useState('就业,WS,2026');

  // Category Filter Tabs
  const [activeMainCategory, setActiveMainCategory] = useState<'全部' | '文书档案' | '会计档案' | '工程档案' | '照片档案'>('文书档案');
  const [activeSubCategory, setActiveSubCategory] = useState<'全部' | '文书档案-文件' | '文书档案-案卷'>('全部');

  // Multi-selection state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Pagination state (10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Search History
  const [searchHistory, setSearchHistory] = useState<string[]>([
    '就业,WS,2026',
    '智能交通,验收',
    '国资决算,2026',
    '工程图纸,水厂',
    '环境监测,PM2.5',
  ]);

  // Handle execute search
  const handleExecuteSearch = (queryOverride?: string) => {
    const q = queryOverride !== undefined ? queryOverride : searchKeywords;
    if (!q.trim()) {
      onShowMessage('请输入需要检索的关键词');
      return;
    }
    setSearchKeywords(q);

    // Update history (max 5 items, newest first)
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item !== q);
      return [q, ...filtered].slice(0, 5);
    });

    setViewState('result_page');
    setCurrentPage(1);
    onShowMessage(`条目检索成功，已查找到相关结果`);
  };

  // Filter dataset for result view
  const filteredDataset = mockItemSearchDataset.filter((item) => {
    // Keyword match
    const keywordsArr = searchKeywords
      .split(/[,，\s]+/)
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);

    const matchesKeyword =
      keywordsArr.length === 0 ||
      keywordsArr.some(
        (kw) =>
          item.title.toLowerCase().includes(kw) ||
          item.archiveRefCode.toLowerCase().includes(kw) ||
          item.docNo.toLowerCase().includes(kw) ||
          item.year.toString().includes(kw)
      );

    // Main category filter
    const matchesMainCat =
      activeMainCategory === '全部' || item.category === activeMainCategory;

    // Sub category filter
    const matchesSubCat =
      activeSubCategory === '全部' || item.subCategory === activeSubCategory;

    return matchesKeyword && matchesMainCat && matchesSubCat;
  }).sort((a, b) => (b.creationDate || "").localeCompare(a.creationDate || ""));

  // Calculate totals by category
  const countsMap = {
    文书档案: mockItemSearchDataset.filter((i) => i.category === '文书档案').length,
    会计档案: mockItemSearchDataset.filter((i) => i.category === '会计档案').length,
    工程档案: mockItemSearchDataset.filter((i) => i.category === '工程档案').length,
    照片档案: mockItemSearchDataset.filter((i) => i.category === '照片档案').length,
  };

  // Sort descending by creation date/year
  const sortedDataset = [...filteredDataset].sort((a, b) => b.year - a.year);

  // Paginated dataset (exactly 10 per page)
  const paginatedDataset = sortedDataset.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Toggle single item selection
  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Toggle select all on current page
  const toggleSelectAllPage = () => {
    const pageIds = paginatedDataset.map((i) => i.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageIds])));
    }
  };

  // Toggle Favorite
  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const exists = prev.includes(id);
      onShowMessage(exists ? '已取消收藏该档案条目' : '已将该档案条目加入我的收藏');
      return exists ? prev.filter((i) => i !== id) : [...prev, id];
    });
  };

  // Highlight search keywords in title
  const highlightKeywords = (text: string) => {
    const keywordsArr = searchKeywords
      .split(/[,，\s]+/)
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    if (keywordsArr.length === 0) return text;

    let result = text;
    keywordsArr.forEach((kw) => {
      const regex = new RegExp(`(${kw})`, 'gi');
      result = result.replace(regex, '___HIGHLIGHT___$1___ENDHIGHLIGHT___');
    });

    const parts = result.split(/(___HIGHLIGHT___|___ENDHIGHLIGHT___)/);
    let isHighlight = false;

    return (
      <span>
        {parts.map((part, idx) => {
          if (part === '___HIGHLIGHT___') {
            isHighlight = true;
            return null;
          }
          if (part === '___ENDHIGHLIGHT___') {
            isHighlight = false;
            return null;
          }
          if (isHighlight) {
            return (
              <span key={idx} className="bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold px-0.5 rounded">
                {part}
              </span>
            );
          }
          return part;
        })}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* STATE 1: 条目检索 初始首页态 */}
      {viewState === 'search_page' && (
        <div className="min-h-[70vh] flex flex-col justify-center p-6">
          <div className="max-w-4xl mx-auto w-full space-y-8">
            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                条目检索
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                全馆集中目录检索 · 支持全字段模糊搜索与多关键词组合调阅
              </p>
            </div>

            {/* Main Centered Search Input Lockup */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-blue-500/80 shadow-2xl p-2 flex flex-col sm:flex-row items-center gap-2">
              {/* Fonds Select */}
              <div className="w-full sm:w-64 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800 pb-2 sm:pb-0 pr-2">
                <select
                  value={companyFonds}
                  onChange={(e) => setCompanyFonds(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-hidden py-2 px-3 cursor-pointer"
                >
                  <option value="成都市住房和城乡建设局全宗">成都市住房和城乡建设局全宗</option>
                  <option value="成都市交通运输局全宗">成都市交通运输局全宗 (F012)</option>
                  <option value="成都市国资委全宗">成都市国资委全宗 (F008)</option>
                  <option value="成都市行政审批局全宗">成都市行政审批局全宗 (F003)</option>
                  <option value="成都市发改委全宗">成都市发改委全宗 (F004)</option>
                  <option value="成都市大数据政务局全宗">成都市大数据政务局全宗 (F002)</option>
                </select>
              </div>

              {/* Keyword Input */}
              <div className="flex-1 w-full relative">
                <input
                  type="text"
                  placeholder='请输入关键词进行检索，多个关键词用空格或","分开'
                  value={searchKeywords}
                  onChange={(e) => setSearchKeywords(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleExecuteSearch();
                  }}
                  className="w-full text-xs py-2.5 px-3 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>

              {/* Search Button */}
              <button
                onClick={() => handleExecuteSearch()}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg hover:shadow-blue-500/25 transition-all shrink-0 flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>检 索</span>
              </button>
            </div>

            {/* Quick History Tags */}
            <div className="flex items-center justify-center gap-2 text-xs flex-wrap">
              <span className="text-slate-400 dark:text-slate-500">最近检索历史:</span>
              {searchHistory.map((item) => (
                <button
                  key={item}
                  onClick={() => handleExecuteSearch(item)}
                  className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-slate-700 transition-all font-mono text-[11px]"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* STATE 2: 条目检索结果页 */}
      {viewState === 'result_page' && (
        <div className="space-y-5">
          {/* Top Compact Search Bar Header */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewState('search_page')}
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="返回条目检索主页"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="text-base font-bold text-slate-900 dark:text-white shrink-0">
                  条目检索结果
                </h2>

                {/* Compact Search Input Lockup */}
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-800">
                  <select
                    value={companyFonds}
                    onChange={(e) => setCompanyFonds(e.target.value)}
                    className="text-xs font-semibold text-slate-800 dark:text-slate-200 bg-transparent py-1.5 px-3 border-r border-slate-200 dark:border-slate-700 focus:outline-hidden cursor-pointer"
                  >
                    <option value="成都市住房和城乡建设局全宗">成都市住房和城乡建设局全宗</option>
                    <option value="成都市交通运输局全宗">成都市交通运输局全宗 (F012)</option>
                    <option value="成都市国资委全宗">成都市国资委全宗 (F008)</option>
                  </select>

                  <input
                    type="text"
                    value={searchKeywords}
                    onChange={(e) => setSearchKeywords(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleExecuteSearch();
                    }}
                    className="text-xs py-1.5 px-3 bg-transparent text-slate-900 dark:text-slate-100 focus:outline-hidden w-60"
                  />

                  <button
                    onClick={() => handleExecuteSearch()}
                    className="px-4 py-1.5 bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                  >
                    检索
                  </button>
                </div>
              </div>

              {/* Advanced search hint link */}
              <div className="text-xs text-slate-500 dark:text-slate-400">
                对检索结果不满意？试试{' '}
                <button
                  onClick={() => onShowMessage('已开启多条件组合高级检索模式')}
                  className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                >
                  高级检索
                </button>
              </div>
            </div>

            {/* Time & Count Info */}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono pt-1">
              本次检索耗时 <span className="font-bold text-blue-600 dark:text-blue-400">0.12s</span>，共为您找到相关结果约{' '}
              <span className="font-bold text-slate-900 dark:text-slate-100">{sortedDataset.length}</span> 个
            </div>
          </div>

          {/* Primary Category Filter Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 flex items-center gap-8 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => {
                setActiveMainCategory('文书档案');
                setCurrentPage(1);
              }}
              className={`pb-3 transition-colors whitespace-nowrap border-b-2 ${
                activeMainCategory === '文书档案'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              文书档案
            </button>

            <button
              onClick={() => {
                setActiveMainCategory('会计档案');
                setCurrentPage(1);
              }}
              className={`pb-3 transition-colors whitespace-nowrap border-b-2 ${
                activeMainCategory === '会计档案'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              会计档案
            </button>

            <button
              onClick={() => {
                setActiveMainCategory('工程档案');
                setCurrentPage(1);
              }}
              className={`pb-3 transition-colors whitespace-nowrap border-b-2 ${
                activeMainCategory === '工程档案'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              工程档案
            </button>

            <button
              onClick={() => {
                setActiveMainCategory('照片档案');
                setCurrentPage(1);
              }}
              className={`pb-3 transition-colors whitespace-nowrap border-b-2 ${
                activeMainCategory === '照片档案'
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              照片档案
            </button>
          </div>

          {/* Secondary Sub-Category Pills */}
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => {
                setActiveSubCategory('全部');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeSubCategory === '全部'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              全部层级
            </button>
            <button
              onClick={() => {
                setActiveSubCategory('文书档案-文件');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeSubCategory === '文书档案-文件'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              文书档案-文件
            </button>

            <button
              onClick={() => {
                setActiveSubCategory('文书档案-案卷');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-full border transition-all ${
                activeSubCategory === '文书档案-案卷'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-600 dark:text-blue-400 font-bold'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400'
              }`}
            >
              文书档案-案卷
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  onShowMessage('请先勾选需要申请借阅的条目');
                  return;
                }
                onShowMessage(`已批量提交 ${selectedIds.length} 项档案调阅申请`);
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-colors"
            >
              申请借阅
            </button>

            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  onShowMessage('请先勾选需要加入收藏的条目');
                  return;
                }
                setSelectedIds([]);
                onShowMessage(`已将 ${selectedIds.length} 项档案放入我的个人收藏夹`);
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-colors"
            >
              加入收藏
            </button>

            <button
              onClick={() => {
                if (selectedIds.length === 0) {
                  onShowMessage('请先勾选需要导出的条目');
                  return;
                }
                onShowMessage(`已成功导出选中的 ${selectedIds.length} 条条目目录 (Excel)`);
              }}
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-colors"
            >
              导出选中
            </button>

            <button
              onClick={() => onShowMessage(`已成功导出全部 ${sortedDataset.length} 条检索结果目录`)}
              className="px-4 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs transition-colors"
            >
              导出全部
            </button>
          </div>

          {/* Redesigned Sleek Executive Results Data Table */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3 w-10 text-center">
                      <button
                        onClick={toggleSelectAllPage}
                        className="text-slate-500 hover:text-slate-900 dark:hover:text-white"
                        title="全选/取消全选"
                      >
                        {paginatedDataset.length > 0 &&
                        paginatedDataset.every((i) => selectedIds.includes(i.id)) ? (
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-3 px-3 w-12 text-center whitespace-nowrap">序号</th>
                    <th className="py-3 px-4 min-w-[260px]">文件题名</th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">年度</th>
                    <th className="py-3 px-4 whitespace-nowrap font-mono">文件档号</th>
                    <th className="py-3 px-4 whitespace-nowrap font-mono">文号</th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">密级</th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">保管期限</th>
                    <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {paginatedDataset.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        未匹配到相关条目结果，建议缩减关键词重试
                      </td>
                    </tr>
                  ) : (
                    paginatedDataset.map((row, idx) => {
                      const isSelected = selectedIds.includes(row.id);
                      const isFav = favoriteIds.includes(row.id);
                      const globalIndex = (currentPage - 1) * PAGE_SIZE + idx + 1;

                      return (
                        <tr
                          key={row.id}
                          className={`transition-colors ${
                            isSelected
                              ? 'bg-blue-50/70 dark:bg-blue-950/40'
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => toggleSelectRow(row.id)}
                              className="text-slate-400 hover:text-blue-600"
                            >
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-3 text-center font-mono font-medium text-slate-500 whitespace-nowrap">
                            {globalIndex}
                          </td>

                          <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                            <div className="line-clamp-2" title={row.title}>
                              {highlightKeywords(row.title)}
                            </div>
                          </td>

                          <td className="py-3 px-4 text-center font-mono font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {row.year}
                          </td>

                          <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {highlightKeywords(row.archiveRefCode)}
                          </td>

                          <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {row.docNo}
                          </td>

                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                row.securityLevel === '公开'
                                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                                  : row.securityLevel === '机密'
                                  ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                              }`}
                            >
                              {row.securityLevel}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {row.retentionPeriod}
                          </td>

                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => toggleFavorite(row.id)}
                                className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                                  isFav ? 'text-amber-500' : 'text-slate-400'
                                }`}
                                title={isFav ? '已收藏' : '加入收藏'}
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-current" />
                              </button>
                              <button
                                onClick={() => onSelectRecord(row)}
                                className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                              >
                                预览
                              </button>
                              <button
                                onClick={() => onApplyBorrow(row)}
                                className="px-2 py-1 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-medium transition-colors"
                              >
                                申请
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

            {/* Pagination displaying exactly 10 items per page */}
            <Pagination
              currentPage={currentPage}
              totalItems={sortedDataset.length}
              pageSize={PAGE_SIZE}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
