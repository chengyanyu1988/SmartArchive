import React, { useState } from 'react';
import {
  FolderTree,
  Folder,
  FileText,
  Search,
  Printer,
  Download,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronRight,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  Clock,
  UserCheck,
  Building2,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

export interface PendingDestroyItem {
  id: string;
  status: '待销毁';
  fondsNo: string;
  year: number;
  refCode: string;
  title: string;
  securityLevel: '公开' | '内部' | '秘密' | '机密';
  retention: '10年' | '30年' | '永久';
  docNo: string;
  folderName: string;
  archivedDate: string;
}

export interface DestroyHistoryItem {
  id: string;
  status: '已销毁';
  fondsNo: string;
  year: number;
  refCode: string;
  title: string;
  securityLevel: '公开' | '内部' | '秘密' | '机密';
  retention: '10年' | '30年' | '永久';
  docNo: string;
  folderName: string;
  destroyDate: string;
  supervisor: string;
}

interface ArchiveDestroyViewProps {
  onShowMessage: (msg: string) => void;
  onSelectRecord?: (rec: any) => void;
}

// 1. 初始待办销毁数据集 (15条真实且不重复的数据，近期时间 2026-11，年份 2024-2026，降序排列)
const initialPendingDestroyList: PendingDestroyItem[] = [
  {
    id: 'p-dest-01',
    status: '待销毁',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0018',
    title: '成都市住房和城乡建设局2026年第一季度临时办公设备检修记录',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成住建发〔2026〕12号',
    folderName: '文书档案',
    archivedDate: '2026-11-05',
  },
  {
    id: 'p-dest-02',
    status: '待销毁',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-TE·2026-Y-BGS-0021',
    title: '2026年度市级机关事业单位办公耗材临时采购发票复印件汇编',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成财采复〔2026〕08号',
    folderName: '会计档案',
    archivedDate: '2026-11-05',
  },
  {
    id: 'p-dest-03',
    status: '待销毁',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-JJ·2025-Y-BGS-0034',
    title: '成都市三环路主干道绿化带临时修剪工程监理旁站记录表',
    securityLevel: '内部',
    retention: '10年',
    docNo: '成绿规〔2025〕45号',
    folderName: '基建档案',
    archivedDate: '2026-11-04',
  },
  {
    id: 'p-dest-04',
    status: '待销毁',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-SB·2025-Y-BGS-0012',
    title: '全市水利设施防汛自动监测网络过渡期打印纸质日志案卷',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成水应急〔2025〕19号',
    folderName: '设备档案',
    archivedDate: '2026-11-04',
  },
  {
    id: 'p-dest-05',
    status: '待销毁',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-ZP·2025-Y-BGS-0009',
    title: '2025年全市建设工程质量监督抽查现场模糊测试影像废盘',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成质监通〔2025〕33号',
    folderName: '照片档案',
    archivedDate: '2026-11-03',
  },
  {
    id: 'p-dest-06',
    status: '待销毁',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-GD·2025-Y-BGS-0015',
    title: '2025年全市公用气象观测站点测试性录音数据挂接清册',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成气象发〔2025〕07号',
    folderName: '声像档案',
    archivedDate: '2026-11-03',
  },
  {
    id: 'p-dest-07',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-SW·2024-Y-BGS-0004',
    title: '成都市政务服务中心大楼旧办公桌椅调拨实物标签备案卷',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成机关办〔2024〕61号',
    folderName: '实物档案',
    archivedDate: '2026-11-02',
  },
  {
    id: 'p-dest-08',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0056',
    title: '关于印发2024年度全市建筑工地防尘降尘临时抽查通知草稿',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成住建办〔2024〕104号',
    folderName: '文书档案',
    archivedDate: '2026-11-02',
  },
  {
    id: 'p-dest-09',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-TE·2024-Y-BGS-0041',
    title: '2024年市属机关内部零星维修劳务费记账凭证辅助明细页',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成财审〔2024〕88号',
    folderName: '会计档案',
    archivedDate: '2026-11-02',
  },
  {
    id: 'p-dest-10',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-JJ·2024-Y-BGS-0029',
    title: '天府新区临时工棚搭设与现场环境清理核查会签记录表',
    securityLevel: '内部',
    retention: '10年',
    docNo: '成天规函〔2024〕15号',
    folderName: '基建档案',
    archivedDate: '2026-11-01',
  },
  {
    id: 'p-dest-11',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-SB·2024-Y-BGS-0018',
    title: '成都市图书馆老旧电子阅览终端报废预审评定清单卷',
    securityLevel: '公开',
    retention: '10年',
    docNo: '文广旅发〔2024〕22号',
    folderName: '设备档案',
    archivedDate: '2026-11-01',
  },
  {
    id: 'p-dest-12',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-ZP·2024-Y-BGS-0033',
    title: '2024年市住房保障中心常规政策宣讲会未留存定帧工作照',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成房保字〔2024〕09号',
    folderName: '照片档案',
    archivedDate: '2026-11-01',
  },
  {
    id: 'p-dest-13',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-GD·2024-Y-BGS-0027',
    title: '2024年市属医院数字化医疗窗口试运行录屏废弃源文件',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成卫健通〔2024〕51号',
    folderName: '声像档案',
    archivedDate: '2026-11-01',
  },
  {
    id: 'p-dest-14',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-SW·2024-Y-BGS-0011',
    title: '2024年全市城市绿化示范小区活动废弃宣传挂图样张',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成园林字〔2024〕30号',
    folderName: '实物档案',
    archivedDate: '2026-11-01',
  },
  {
    id: 'p-dest-15',
    status: '待销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0089',
    title: '成都市关于规范机关食堂日常保洁管理临时制度废案',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成机事发〔2024〕14号',
    folderName: '文书档案',
    archivedDate: '2026-11-01',
  },
];

// 2. 初始历史销毁数据集 (15条真实且不重复的数据，时间降序)
const initialDestroyHistoryList: DestroyHistoryItem[] = [
  {
    id: 'h-dest-01',
    status: '已销毁',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0002',
    title: '成都市建设工程防雷安全临时巡检日志明细卷',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成气防字〔2026〕04号',
    folderName: '文书档案',
    destroyDate: '2026-11-05 14:30',
    supervisor: '赵保平 / 孙建明',
  },
  {
    id: 'h-dest-02',
    status: '已销毁',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-TE·2026-Y-BGS-0011',
    title: '2026年市属单位固定资产清查临时汇总工作表底稿',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成财资发〔2026〕15号',
    folderName: '会计档案',
    destroyDate: '2026-11-04 16:10',
    supervisor: '李维敏 / 张建国',
  },
  {
    id: 'h-dest-03',
    status: '已销毁',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-JJ·2025-Y-BGS-0018',
    title: '成都市中心城区地下管线临时施工安全告示牌会签表',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成城管发〔2025〕28号',
    folderName: '基建档案',
    destroyDate: '2026-11-04 10:25',
    supervisor: '王志远 / 李博文',
  },
  {
    id: 'h-dest-04',
    status: '已销毁',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-SB·2025-Y-BGS-0005',
    title: '2025年全市环境噪声自动化监测站常规更换零部件质保单',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成环监发〔2025〕41号',
    folderName: '设备档案',
    destroyDate: '2026-11-03 15:40',
    supervisor: '赵保平 / 孙建明',
  },
  {
    id: 'h-dest-05',
    status: '已销毁',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-ZP·2025-Y-BGS-0021',
    title: '2025年成都市绿化观摩会非核心背景花絮照片光盘',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成绿采字〔2025〕12号',
    folderName: '照片档案',
    destroyDate: '2026-11-03 09:15',
    supervisor: '李维敏 / 王志远',
  },
  {
    id: 'h-dest-06',
    status: '已销毁',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-GD·2025-Y-BGS-0019',
    title: '2025年市综合行政执法局培训录像无声音废卷',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成执法通〔2025〕67号',
    folderName: '声像档案',
    destroyDate: '2026-11-02 16:50',
    supervisor: '张建国 / 孙建明',
  },
  {
    id: 'h-dest-07',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-SW·2024-Y-BGS-0008',
    title: '2024年市档案局业务大楼老旧防潮箱废弃封条样张',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成档发〔2024〕19号',
    folderName: '实物档案',
    destroyDate: '2026-11-02 11:30',
    supervisor: '李博文 / 范建平',
  },
  {
    id: 'h-dest-08',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0072',
    title: '成都市关于规范机关车辆出勤登记临时试行办法废文本',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成机关发〔2024〕33号',
    folderName: '文书档案',
    destroyDate: '2026-11-02 09:20',
    supervisor: '赵保平 / 王志远',
  },
  {
    id: 'h-dest-09',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-TE·2024-Y-BGS-0055',
    title: '2024年市属机关打印机纸张退货与核销辅助小票汇总卷',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成财销字〔2024〕04号',
    folderName: '会计档案',
    destroyDate: '2026-11-01 17:00',
    supervisor: '孙建明 / 李维敏',
  },
  {
    id: 'h-dest-10',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-JJ·2024-Y-BGS-0048',
    title: '2024年市建委办公区临时隔断施工安全防火告知书',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成建安发〔2024〕82号',
    folderName: '基建档案',
    destroyDate: '2026-11-01 14:15',
    supervisor: '张建国 / 郭德成',
  },
  {
    id: 'h-dest-11',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-SB·2024-Y-BGS-0036',
    title: '成都市档案馆废旧空调换热器报废拆解过磅记录表',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成档后字〔2024〕11号',
    folderName: '设备档案',
    destroyDate: '2026-11-01 10:40',
    supervisor: '李博文 / 钱卫国',
  },
  {
    id: 'h-dest-12',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-ZP·2024-Y-BGS-0044',
    title: '2024年市房管局老旧小区改造技术交底会模糊随手拍照',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成房发〔2024〕95号',
    folderName: '照片档案',
    destroyDate: '2026-11-01 09:10',
    supervisor: '赵保平 / 王志远',
  },
  {
    id: 'h-dest-13',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-GD·2024-Y-BGS-0038',
    title: '2024年市水务局防汛演练无线电对讲测试片段',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成水防通〔2024〕23号',
    folderName: '声像档案',
    destroyDate: '2026-11-01 08:30',
    supervisor: '孙建明 / 李维敏',
  },
  {
    id: 'h-dest-14',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-SW·2024-Y-BGS-0022',
    title: '2024年机关节能减排宣传周退役展板底架清册',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成节能发〔2024〕09号',
    folderName: '实物档案',
    destroyDate: '2026-11-01 08:00',
    supervisor: '张建国 / 许华敏',
  },
  {
    id: 'h-dest-15',
    status: '已销毁',
    fondsNo: '0110',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0099',
    title: '关于规范档案保管库房日常保洁与除尘临时通知稿',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成档保发〔2024〕02号',
    folderName: '文书档案',
    destroyDate: '2026-11-01 07:45',
    supervisor: '李博文 / 孙浩',
  },
];

export const ArchiveDestroyView: React.FC<ArchiveDestroyViewProps> = ({
  onShowMessage,
  onSelectRecord,
}) => {
  // Main Sub-Tab: 'pending' (待办销毁) | 'history' (历史销毁)
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  // Directory Tree Filter State
  const [selectedFolder, setSelectedFolder] = useState<string>('全部目录');
  const [selectedYear, setSelectedYear] = useState<string>('全部年份');
  const [expandedFolders, setExpandedFolders] = useState<string[]>([
    '文书档案',
    '会计档案',
    '基建档案',
  ]);

  // Title Search Query
  const [titleQuery, setTitleQuery] = useState('');

  // Main Datasets
  const [pendingList, setPendingList] = useState<PendingDestroyItem[]>(initialPendingDestroyList);
  const [historyList, setHistoryList] = useState<DestroyHistoryItem[]>(initialDestroyHistoryList);

  // Checkbox Selection for Pending & History
  const [selectedPendingIds, setSelectedPendingIds] = useState<string[]>([]);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);

  // Pagination States (10 items per page)
  const [currentPendingPage, setCurrentPendingPage] = useState(1);
  const [currentHistoryPage, setCurrentHistoryPage] = useState(1);
  const PAGE_SIZE = 10;

  // Destruction Action Modal State
  const [isDestroyModalOpen, setIsDestroyModalOpen] = useState(false);
  const [destroyBatchNo, setDestroyBatchNo] = useState('成建销批〔2026〕12号');
  const [supervisor1, setSupervisor1] = useState('');
  const [supervisor2, setSupervisor2] = useState('');
  const [destroyReason, setDestroyReason] = useState('经鉴定委员会审定，已满保管期限且确无保留价值，批准合规销毁。');

  // Toggle Folder Expansion in Tree
  const toggleFolder = (folderName: string) => {
    setExpandedFolders((prev) =>
      prev.includes(folderName) ? prev.filter((f) => f !== folderName) : [...prev, folderName]
    );
  };

  // Select Folder or Year Node in Left Directory Tree ("点击左侧，右侧数据也跟着编")
  const handleSelectTreeNode = (folderName: string, year?: string) => {
    setSelectedFolder(folderName);
    if (year) {
      setSelectedYear(year);
    } else {
      setSelectedYear('全部年份');
    }
    setCurrentPendingPage(1);
    setCurrentHistoryPage(1);
    onShowMessage(`已选择目录 [${folderName}${year ? ' - ' + year : ''}]，右侧销毁列表已联动更新`);
  };

  // Reset Tree Selection
  const handleResetTree = () => {
    setSelectedFolder('全部目录');
    setSelectedYear('全部年份');
    setTitleQuery('');
    setCurrentPendingPage(1);
    setCurrentHistoryPage(1);
    onShowMessage('已重置目录筛选，展示全量档案销毁数据');
  };

  // Filtered Pending Destroy List (Descending Order by Date)
  const filteredPendingList = pendingList
    .filter((item) => {
      const matchesFolder = selectedFolder === '全部目录' || item.folderName === selectedFolder;
      const matchesYear =
        selectedYear === '全部年份' || item.year.toString() === selectedYear.replace('年', '');
      const matchesTitle =
        !titleQuery ||
        item.title.toLowerCase().includes(titleQuery.toLowerCase()) ||
        item.refCode.toLowerCase().includes(titleQuery.toLowerCase()) ||
        item.docNo.toLowerCase().includes(titleQuery.toLowerCase());
      return matchesFolder && matchesYear && matchesTitle;
    })
    .sort((a, b) => (b.archivedDate || '').localeCompare(a.archivedDate || ''));

  const paginatedPendingList = filteredPendingList.slice(
    (currentPendingPage - 1) * PAGE_SIZE,
    currentPendingPage * PAGE_SIZE
  );

  // Filtered History Destroy List (Descending Order by Date)
  const filteredHistoryList = historyList
    .filter((item) => {
      const matchesFolder = selectedFolder === '全部目录' || item.folderName === selectedFolder;
      const matchesYear =
        selectedYear === '全部年份' || item.year.toString() === selectedYear.replace('年', '');
      const matchesTitle =
        !titleQuery ||
        item.title.toLowerCase().includes(titleQuery.toLowerCase()) ||
        item.refCode.toLowerCase().includes(titleQuery.toLowerCase()) ||
        item.docNo.toLowerCase().includes(titleQuery.toLowerCase());
      return matchesFolder && matchesYear && matchesTitle;
    })
    .sort((a, b) => (b.destroyDate || '').localeCompare(a.destroyDate || ''));

  const paginatedHistoryList = filteredHistoryList.slice(
    (currentHistoryPage - 1) * PAGE_SIZE,
    currentHistoryPage * PAGE_SIZE
  );

  // Open Destruction Modal
  const handleOpenDestroyModal = () => {
    if (selectedPendingIds.length === 0) {
      onShowMessage('请先勾选需要办理销毁的档案条目');
      return;
    }
    setSupervisor1('赵保平 (质检员)');
    setSupervisor2('孙建明 (安全员)');
    setIsDestroyModalOpen(true);
  };

  // Submit Destruction
  const handleConfirmDestruction = () => {
    if (!supervisor1.trim() || !supervisor2.trim()) {
      onShowMessage('请填写完整的双人监督签名（监督员1与监督员2）');
      return;
    }

    const itemsToDestroy = pendingList.filter((item) => selectedPendingIds.includes(item.id));
    const nowStr = '2026-11-05 16:30';

    const newHistoryItems: DestroyHistoryItem[] = itemsToDestroy.map((item) => ({
      id: `h-dest-${Date.now()}-${item.id}`,
      status: '已销毁',
      fondsNo: item.fondsNo,
      year: item.year,
      refCode: item.refCode,
      title: item.title,
      securityLevel: item.securityLevel,
      retention: item.retention,
      docNo: item.docNo,
      folderName: item.folderName,
      destroyDate: nowStr,
      supervisor: `${supervisor1.split(' ')[0]} / ${supervisor2.split(' ')[0]}`,
    }));

    setHistoryList((prev) => [...newHistoryItems, ...prev]);
    setPendingList((prev) => prev.filter((item) => !selectedPendingIds.includes(item.id)));
    setSelectedPendingIds([]);
    setIsDestroyModalOpen(false);

    onShowMessage(`已成功为选中的 ${itemsToDestroy.length} 卷/件档案完成双人监督合规销毁`);
  };

  // Directory Tree Node Structure (2024, 2025, 2026 recent years, no old years!)
  const directoryTree = [
    { name: '文书档案', years: ['2026年', '2025年', '2024年'] },
    { name: '会计档案', years: ['2026年', '2025年', '2024年'] },
    { name: '基建档案', years: ['2026年', '2025年', '2024年'] },
    { name: '设备档案', years: ['2026年', '2025年', '2024年'] },
    { name: '照片档案', years: ['2026年', '2025年', '2024年'] },
    { name: '声像档案', years: ['2026年', '2025年', '2024年'] },
    { name: '实物档案', years: ['2026年', '2025年', '2024年'] },
  ];

  const hasActiveTreeFilter = selectedFolder !== '全部目录' || selectedYear !== '全部年份';

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 min-h-screen text-xs space-y-4">
      {/* Top Main Section matching Screenshot Layout */}
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* LEFT COLUMN: 档案目录树 (Directory Tree Panel) */}
        <div className="w-full lg:w-60 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-xs">
              <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              档案目录树
            </h2>
            {hasActiveTreeFilter && (
              <button
                onClick={handleResetTree}
                title="重置选中的目录"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-[11px] flex items-center gap-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                重置
              </button>
            )}
          </div>

          <div className="p-2 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto font-mono text-xs">
            {/* Root Node */}
            <div className="px-2 py-1 flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>成都市建设局档案馆</span>
            </div>

            {/* Folder List */}
            <div className="pl-3 space-y-1">
              {directoryTree.map((folder) => {
                const isExpanded = expandedFolders.includes(folder.name);
                const isFolderSelected = selectedFolder === folder.name && selectedYear === '全部年份';

                return (
                  <div key={folder.name} className="space-y-0.5">
                    <div
                      className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                        isFolderSelected
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                      onClick={() => handleSelectTreeNode(folder.name)}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFolder(folder.name);
                          }}
                          className="text-slate-400 hover:text-slate-600 p-0.5"
                        >
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isExpanded ? 'rotate-90' : ''
                            }`}
                          />
                        </button>
                        <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{folder.name}</span>
                      </div>
                    </div>

                    {/* Sub-years (2026年, 2025年, 2024年 - No old years!) */}
                    {isExpanded && (
                      <div className="pl-6 space-y-0.5 border-l border-slate-200 dark:border-slate-700 ml-3">
                        {folder.years.map((year) => {
                          const isYearSelected =
                            selectedFolder === folder.name && selectedYear === year;

                          return (
                            <div
                              key={year}
                              onClick={() => handleSelectTreeNode(folder.name, year)}
                              className={`flex items-center gap-1.5 px-2 py-0.5 rounded cursor-pointer transition-colors text-[11px] ${
                                isYearSelected
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold'
                                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50'
                              }`}
                            >
                              <FileText className="w-3 h-3 text-slate-400" />
                              <span>{year}</span>
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

        {/* RIGHT WORKSPACE AREA */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Dynamic Tree Indicator Tag */}
          {hasActiveTreeFilter && (
            <div className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 flex items-center justify-between gap-2 text-xs text-blue-900 dark:text-blue-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5" />
                  <span>右侧销毁表联动生效:</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 font-semibold font-mono">
                  {selectedFolder} {selectedYear !== '全部年份' ? `(${selectedYear})` : ''}
                </span>
              </div>
              <button
                onClick={handleResetTree}
                className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>显示全部目录</span>
              </button>
            </div>
          )}

          {/* Main Card with Tabs & Toolbar */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Navigation Tabs Header */}
            <div className="border-b border-slate-200 dark:border-slate-700 px-4 pt-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${
                    activeTab === 'pending'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span>待办销毁</span>
                  <span
                    className={`px-1.5 py-0.5 text-[11px] rounded-full font-bold ${
                      activeTab === 'pending'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {filteredPendingList.length}
                  </span>
                  {activeTab === 'pending' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('history')}
                  className={`pb-2.5 text-xs sm:text-sm font-semibold transition-colors relative flex items-center gap-1.5 ${
                    activeTab === 'history'
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <span>历史销毁</span>
                  <span
                    className={`px-1.5 py-0.5 text-[11px] rounded-full font-bold ${
                      activeTab === 'history'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {filteredHistoryList.length}
                  </span>
                  {activeTab === 'history' && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Action Bar & Search Bar matching screenshots */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              {/* Left Action Buttons */}
              <div className="flex items-center gap-2">
                {activeTab === 'pending' && (
                  <button
                    onClick={handleOpenDestroyModal}
                    className="px-3 py-1 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    销毁
                  </button>
                )}
                <button
                  onClick={() => onShowMessage('已发送销毁清单打印指令')}
                  className="px-3 py-1 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  打印
                </button>
                <button
                  onClick={() =>
                    onShowMessage(
                      `已成功导出选中的 ${
                        activeTab === 'pending'
                          ? selectedPendingIds.length
                          : selectedHistoryIds.length
                      } 项档案销毁清册`
                    )
                  }
                  className="px-3 py-1 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  导出选中
                </button>
                <button
                  onClick={() => onShowMessage('已成功导出全量符合条件的档案销毁记录')}
                  className="px-3 py-1 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  导出全部
                </button>
              </div>

              {/* Right Search Input matching screenshot */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  题名:
                </span>
                <input
                  type="text"
                  placeholder="搜索题名/档号/文号..."
                  value={titleQuery}
                  onChange={(e) => {
                    setTitleQuery(e.target.value);
                    setCurrentPendingPage(1);
                    setCurrentHistoryPage(1);
                  }}
                  className="w-48 sm:w-60 px-2.5 py-1 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  onClick={() => onShowMessage('已执行条件检索')}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
                >
                  检索
                </button>
                <button
                  onClick={() => onShowMessage('已打开高级检索弹窗')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  高级检索
                </button>
              </div>
            </div>

            {/* TAB CONTENT 1: 待办销毁 */}
            {activeTab === 'pending' && (
              <div className="p-4 space-y-3">
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left border-collapse text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-10">
                          <input
                            type="checkbox"
                            checked={
                              selectedPendingIds.length === paginatedPendingList.length &&
                              paginatedPendingList.length > 0
                            }
                            onChange={() => {
                              if (selectedPendingIds.length === paginatedPendingList.length) {
                                setSelectedPendingIds([]);
                              } else {
                                setSelectedPendingIds(paginatedPendingList.map((i) => i.id));
                              }
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 px-3 text-center w-12 whitespace-nowrap">序号</th>
                        <th className="py-2.5 px-3 w-24 whitespace-nowrap">档案状态</th>
                        <th className="py-2.5 px-3 w-20 whitespace-nowrap">全宗号</th>
                        <th className="py-2.5 px-3 w-20 whitespace-nowrap">年度</th>
                        <th className="py-2.5 px-3 w-48 whitespace-nowrap">档号</th>
                        <th className="py-2.5 px-3 min-w-[200px]">题名</th>
                        <th className="py-2.5 px-3 w-20 whitespace-nowrap">密级</th>
                        <th className="py-2.5 px-3 w-20 whitespace-nowrap">期限</th>
                        <th className="py-2.5 px-3 w-36 whitespace-nowrap">文号</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 bg-white dark:bg-slate-800">
                      {paginatedPendingList.length > 0 ? (
                        paginatedPendingList.map((item, index) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={selectedPendingIds.includes(item.id)}
                                onChange={() =>
                                  setSelectedPendingIds((prev) =>
                                    prev.includes(item.id)
                                      ? prev.filter((i) => i !== item.id)
                                      : [...prev, item.id]
                                  )
                                }
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                              {(currentPendingPage - 1) * PAGE_SIZE + index + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60">
                                <AlertCircle className="w-3 h-3 text-rose-500" />
                                {item.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">{item.fondsNo}</td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                              {item.year}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                              {item.refCode}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-100">
                              {item.title}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  item.securityLevel === '机密'
                                    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                    : item.securityLevel === '秘密'
                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {item.securityLevel}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-semibold">
                              {item.retention}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                              {item.docNo}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={10} className="py-10 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-1.5">
                              <AlertCircle className="w-6 h-6 text-slate-300" />
                              <span>暂无符合条件的待办销毁档案</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredPendingList.length > 0 && (
                  <div className="pt-1">
                    <Pagination
                      currentPage={currentPendingPage}
                      totalItems={filteredPendingList.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setCurrentPendingPage}
                    />
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: 历史销毁 */}
            {activeTab === 'history' && (
              <div className="p-4 space-y-3">
                <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                  <table className="w-full text-left border-collapse text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-10">
                          <input
                            type="checkbox"
                            checked={
                              selectedHistoryIds.length === paginatedHistoryList.length &&
                              paginatedHistoryList.length > 0
                            }
                            onChange={() => {
                              if (selectedHistoryIds.length === paginatedHistoryList.length) {
                                setSelectedHistoryIds([]);
                              } else {
                                setSelectedHistoryIds(paginatedHistoryList.map((i) => i.id));
                              }
                            }}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </th>
                        <th className="py-2.5 px-3 text-center w-12 whitespace-nowrap">序号</th>
                        <th className="py-2.5 px-3 w-24 whitespace-nowrap">档案状态</th>
                        <th className="py-2.5 px-3 w-20 whitespace-nowrap">全宗号</th>
                        <th className="py-2.5 px-3 w-20 whitespace-nowrap">年度</th>
                        <th className="py-2.5 px-3 w-48 whitespace-nowrap">档号</th>
                        <th className="py-2.5 px-3 min-w-[200px]">题名</th>
                        <th className="py-2.5 px-3 w-20 whitespace-nowrap">密级</th>
                        <th className="py-2.5 px-3 w-20 whitespace-nowrap">期限</th>
                        <th className="py-2.5 px-3 w-36 whitespace-nowrap">文号</th>
                        <th className="py-2.5 px-3 w-32 whitespace-nowrap">销毁时间</th>
                        <th className="py-2.5 px-3 w-32 whitespace-nowrap">双人监督员</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 bg-white dark:bg-slate-800">
                      {paginatedHistoryList.length > 0 ? (
                        paginatedHistoryList.map((item, index) => (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={selectedHistoryIds.includes(item.id)}
                                onChange={() =>
                                  setSelectedHistoryIds((prev) =>
                                    prev.includes(item.id)
                                      ? prev.filter((i) => i !== item.id)
                                      : [...prev, item.id]
                                  )
                                }
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                              {(currentHistoryPage - 1) * PAGE_SIZE + index + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                {item.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono">{item.fondsNo}</td>
                            <td className="py-2.5 px-3 font-mono font-semibold text-slate-800 dark:text-slate-200">
                              {item.year}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-slate-700 dark:text-slate-300">
                              {item.refCode}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-100">
                              {item.title}
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  item.securityLevel === '机密'
                                    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300'
                                    : item.securityLevel === '秘密'
                                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                                }`}
                              >
                                {item.securityLevel}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300 font-semibold">
                              {item.retention}
                            </td>
                            <td className="py-2.5 px-3 text-slate-500 font-mono text-[11px]">
                              {item.docNo}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">
                              {item.destroyDate}
                            </td>
                            <td className="py-2.5 px-3 font-medium text-slate-700 dark:text-slate-300">
                              {item.supervisor}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={12} className="py-10 text-center text-slate-400">
                            <div className="flex flex-col items-center justify-center gap-1.5">
                              <AlertCircle className="w-6 h-6 text-slate-300" />
                              <span>暂无档案销毁历史记录</span>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {filteredHistoryList.length > 0 && (
                  <div className="pt-1">
                    <Pagination
                      currentPage={currentHistoryPage}
                      totalItems={filteredHistoryList.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setCurrentHistoryPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Destruction Action Modal (合规销毁审查双人加锁确认弹窗) */}
      {isDestroyModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-rose-50 dark:bg-rose-950/40">
              <h3 className="text-sm font-bold text-rose-800 dark:text-rose-200 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-rose-600" />
                档案合规销毁双人确认与签发
              </h3>
              <button
                onClick={() => setIsDestroyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-lg border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-[11px] space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>严正提示: 销毁操作不可逆！</span>
                </div>
                <p>
                  已选中 <strong className="font-bold text-rose-600 dark:text-rose-400">{selectedPendingIds.length}</strong> 卷/件待销毁档案。提交后将生成合规销毁审计凭证，并在系统与底层物理存储中执行安全物理/逻辑抹除。
                </p>
              </div>

              {/* Approval Batch Number Input */}
              <div className="space-y-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  销毁批复文号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={destroyBatchNo}
                  onChange={(e) => setDestroyBatchNo(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Dual Supervisors Verification Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    执行监督员 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={supervisor1}
                    onChange={(e) => setSupervisor1(e.target.value)}
                    placeholder="例如: 赵保平 (质检员)"
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    安全保密员 2 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={supervisor2}
                    onChange={(e) => setSupervisor2(e.target.value)}
                    placeholder="例如: 孙建明 (安全员)"
                    className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Reason Input */}
              <div className="space-y-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  销毁原因及审定结论说明
                </label>
                <textarea
                  rows={2.5}
                  value={destroyReason}
                  onChange={(e) => setDestroyReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDestroyModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDestruction}
                className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-medium transition-colors shadow-xs"
              >
                确认合规销毁
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
