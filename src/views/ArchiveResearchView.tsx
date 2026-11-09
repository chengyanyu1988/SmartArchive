import React, { useState } from 'react';
import {
  FolderTree,
  Folder,
  FileText,
  Search,
  Plus,
  Trash2,
  Share2,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  ChevronRight,
  Send,
  Building2,
  ShieldCheck,
  Calendar,
  Layers,
  BookOpen,
  Filter,
  Check,
  Clock,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

export interface TopicArchiveItem {
  id: string;
  status: '正式库';
  publishStatus: '已发布' | '未发布';
  topic: '大事记' | '重点项目' | '机构沿革';
  year: number;
  refCode: string;
  title: string;
  securityLevel: '公开' | '内部' | '秘密' | '机密';
  retention: '10年' | '30年' | '永久';
  docNo: string;
  archivedDate: string;
  publishDate?: string;
  publishChannel?: string;
}

interface ArchiveResearchViewProps {
  onShowMessage: (msg: string) => void;
  onSelectRecord?: (record: any) => void;
}

// 初始真实专题档案数据 (30+条真实数据，覆盖大事记、重点项目、机构沿革，近3年2024-2026，无xxx，近期的2026-11月份)
const initialTopicArchives: TopicArchiveItem[] = [
  // 大事记 - 2026年
  {
    id: 'tp-01',
    status: '正式库',
    publishStatus: '已发布',
    topic: '大事记',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0001',
    title: '成都市推进数字经济核心产业突破性发展实施意见出台决议',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成发改发〔2026〕18号',
    archivedDate: '2026-11-05',
    publishDate: '2026-11-05 14:20',
    publishChannel: '档案馆编研专刊',
  },
  {
    id: 'tp-02',
    status: '正式库',
    publishStatus: '未发布',
    topic: '大事记',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0004',
    title: '关于印发2026年全域深化政务服务“一网通办”效能提升工作方案',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成府办发〔2026〕23号',
    archivedDate: '2026-11-05',
  },
  {
    id: 'tp-03',
    status: '正式库',
    publishStatus: '已发布',
    topic: '大事记',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0008',
    title: '成都市第十八届人民代表大会第四次会议市政规划决议要点',
    securityLevel: '机密',
    retention: '永久',
    docNo: '成人大发〔2026〕05号',
    archivedDate: '2026-11-04',
    publishDate: '2026-11-04 16:30',
    publishChannel: '政务内网编研共享',
  },
  {
    id: 'tp-04',
    status: '正式库',
    publishStatus: '未发布',
    topic: '大事记',
    year: 2026,
    refCode: '0110-KJ·2026-Y-BGS-0012',
    title: '2026年成都市科学技术奖励大会暨科技创新攻坚行动部署纪要',
    securityLevel: '秘密',
    retention: '30年',
    docNo: '成科发〔2026〕31号',
    archivedDate: '2026-11-04',
  },
  {
    id: 'tp-05',
    status: '正式库',
    publishStatus: '已发布',
    topic: '大事记',
    year: 2026,
    refCode: '0110-JJ·2026-Y-BGS-0019',
    title: '成都市中心城区地下综合管廊二期贯通工程竣工验收现场纪要',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成住建发〔2026〕42号',
    archivedDate: '2026-11-03',
    publishDate: '2026-11-03 11:15',
    publishChannel: '档案馆编研专刊',
  },

  // 大事记 - 2025年
  {
    id: 'tp-06',
    status: '正式库',
    publishStatus: '已发布',
    topic: '大事记',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0015',
    title: '2025年成都市建设践行新发展理念的公园城市示范区推进成果汇编',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成发改发〔2025〕66号',
    archivedDate: '2026-11-03',
    publishDate: '2026-11-03 09:30',
    publishChannel: '门户网站专题专栏',
  },
  {
    id: 'tp-07',
    status: '正式库',
    publishStatus: '未发布',
    topic: '大事记',
    year: 2025,
    refCode: '0110-CW·2025-Y-BGS-0027',
    title: '成都市2025年度财政预算执行情况与决算草案专题审查报告',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成财预〔2025〕89号',
    archivedDate: '2026-11-02',
  },
  {
    id: 'tp-08',
    status: '正式库',
    publishStatus: '已发布',
    topic: '大事记',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0033',
    title: '成都市关于优化涉企营商环境提升涉税便利度联合通知文件',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成税务发〔2025〕14号',
    archivedDate: '2026-11-02',
    publishDate: '2026-11-02 15:40',
    publishChannel: '档案馆编研专刊',
  },
  {
    id: 'tp-09',
    status: '正式库',
    publishStatus: '未发布',
    topic: '大事记',
    year: 2025,
    refCode: '0110-ZP·2025-Y-BGS-0008',
    title: '2025年成都世运会城市基础设施改造升级工程指挥部会议实录',
    securityLevel: '秘密',
    retention: '30年',
    docNo: '成体育字〔2025〕09号',
    archivedDate: '2026-11-01',
  },

  // 大事记 - 2024年
  {
    id: 'tp-10',
    status: '正式库',
    publishStatus: '已发布',
    topic: '大事记',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0051',
    title: '成都市2024年重大产业化项目促建与工业母机集群培育会议备忘',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成经信发〔2024〕48号',
    archivedDate: '2026-11-01',
    publishDate: '2026-11-01 10:20',
    publishChannel: '档案馆编研专刊',
  },
  {
    id: 'tp-11',
    status: '正式库',
    publishStatus: '未发布',
    topic: '大事记',
    year: 2024,
    refCode: '0110-TE·2024-Y-BGS-0038',
    title: '成都市“十四五”综合交通运输体系建设中期评估决议文件',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成交运函〔2024〕35号',
    archivedDate: '2026-11-01',
  },

  // 重点项目 - 2026年
  {
    id: 'tp-12',
    status: '正式库',
    publishStatus: '已发布',
    topic: '重点项目',
    year: 2026,
    refCode: '0110-JJ·2026-Y-BGS-0005',
    title: '天府国际机场航空货运智慧枢纽二期扩建工程可行性研究批复卷',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成发改交〔2026〕29号',
    archivedDate: '2026-11-05',
    publishDate: '2026-11-05 16:00',
    publishChannel: '档案馆编研专刊',
  },
  {
    id: 'tp-13',
    status: '正式库',
    publishStatus: '未发布',
    topic: '重点项目',
    year: 2026,
    refCode: '0110-JJ·2026-Y-BGS-0009',
    title: '成都市智算中心二期扩容与城市AI大模型超算平台建设项目档案',
    securityLevel: '机密',
    retention: '永久',
    docNo: '成科技发〔2026〕15号',
    archivedDate: '2026-11-05',
  },
  {
    id: 'tp-14',
    status: '正式库',
    publishStatus: '已发布',
    topic: '重点项目',
    year: 2026,
    refCode: '0110-JJ·2026-Y-BGS-0014',
    title: '成都轨道交通19号线二期工程全线地下车站防水抗渗施工特辑',
    securityLevel: '秘密',
    retention: '30年',
    docNo: '成轨监通〔2026〕18号',
    archivedDate: '2026-11-04',
    publishDate: '2026-11-04 14:10',
    publishChannel: '政务内网编研共享',
  },
  {
    id: 'tp-15',
    status: '正式库',
    publishStatus: '未发布',
    topic: '重点项目',
    year: 2026,
    refCode: '0110-JJ·2026-Y-BGS-0022',
    title: '成都市沱江流域水生态环境保护与防洪堤防护岸提标工程卷',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成水环发〔2026〕37号',
    archivedDate: '2026-11-03',
  },

  // 重点项目 - 2025年
  {
    id: 'tp-16',
    status: '正式库',
    publishStatus: '已发布',
    topic: '重点项目',
    year: 2025,
    refCode: '0110-JJ·2025-Y-BGS-0045',
    title: '成都医学城生物医药研发转化中心一期工程竣工图纸与测绘卷',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成住规发〔2025〕52号',
    archivedDate: '2026-11-03',
    publishDate: '2026-11-03 10:45',
    publishChannel: '档案馆编研专刊',
  },
  {
    id: 'tp-17',
    status: '正式库',
    publishStatus: '未发布',
    topic: '重点项目',
    year: 2025,
    refCode: '0110-JJ·2025-Y-BGS-0062',
    title: '成都市东部新区智能网联汽车封闭测试基地建设验收档案',
    securityLevel: '秘密',
    retention: '30年',
    docNo: '成经信函〔2025〕68号',
    archivedDate: '2026-11-02',
  },
  {
    id: 'tp-18',
    status: '正式库',
    publishStatus: '已发布',
    topic: '重点项目',
    year: 2025,
    refCode: '0110-JJ·2025-Y-BGS-0078',
    title: '成都市青龙湖湿地公园水质生态涵养与生物多样性保护工程编纂',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成园林发〔2025〕25号',
    archivedDate: '2026-11-02',
    publishDate: '2026-11-02 11:20',
    publishChannel: '门户网站专题专栏',
  },

  // 重点项目 - 2024年
  {
    id: 'tp-19',
    status: '正式库',
    publishStatus: '已发布',
    topic: '重点项目',
    year: 2024,
    refCode: '0110-JJ·2024-Y-BGS-0081',
    title: '成都市金沙演艺综合体建设工程消防安全性能化评估专项报告',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成消评字〔2024〕19号',
    archivedDate: '2026-11-01',
    publishDate: '2026-11-01 15:10',
    publishChannel: '档案馆编研专刊',
  },
  {
    id: 'tp-20',
    status: '正式库',
    publishStatus: '未发布',
    topic: '重点项目',
    year: 2024,
    refCode: '0110-JJ·2024-Y-BGS-0095',
    title: '成都市三环路成渝立交节点快速化改造工程全过程质量监督手册',
    securityLevel: '公开',
    retention: '10年',
    docNo: '成交质管〔2024〕30号',
    archivedDate: '2026-11-01',
  },

  // 机构沿革 - 2026年
  {
    id: 'tp-21',
    status: '正式库',
    publishStatus: '已发布',
    topic: '机构沿革',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0010',
    title: '成都市住房和城乡建设局2026年机关内部职能配置与内设机构调整',
    securityLevel: '机密',
    retention: '永久',
    docNo: '成编发〔2026〕03号',
    archivedDate: '2026-11-05',
    publishDate: '2026-11-05 15:30',
    publishChannel: '政务内网编研共享',
  },
  {
    id: 'tp-22',
    status: '正式库',
    publishStatus: '未发布',
    topic: '机构沿革',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0016',
    title: '成都市城建档案馆增设数字化档案安全监管科室批复文件',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成编函〔2026〕12号',
    archivedDate: '2026-11-04',
  },
  {
    id: 'tp-23',
    status: '正式库',
    publishStatus: '已发布',
    topic: '机构沿革',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0025',
    title: '关于调整成都市历史文化名城保护委员会组成人员的通知',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成府办字〔2026〕09号',
    archivedDate: '2026-11-03',
    publishDate: '2026-11-03 14:00',
    publishChannel: '档案馆编研专刊',
  },

  // 机构沿革 - 2025年
  {
    id: 'tp-24',
    status: '正式库',
    publishStatus: '已发布',
    topic: '机构沿革',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0040',
    title: '成都市建设工程质量安全监督站深化事业单位改革实施方案',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成住建发〔2025〕78号',
    archivedDate: '2026-11-03',
    publishDate: '2026-11-03 09:10',
    publishChannel: '档案馆编研专刊',
  },
  {
    id: 'tp-25',
    status: '正式库',
    publishStatus: '未发布',
    topic: '机构沿革',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0055',
    title: '成都市关于撤销部分临时现场指挥部及档案移交归集清册',
    securityLevel: '内部',
    retention: '30年',
    docNo: '成机管发〔2025〕34号',
    archivedDate: '2026-11-02',
  },
  {
    id: 'tp-26',
    status: '正式库',
    publishStatus: '已发布',
    topic: '机构沿革',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0070',
    title: '成都市住房保障中心机构职能转入市住房公积金管理中心交接卷',
    securityLevel: '机密',
    retention: '永久',
    docNo: '成编发〔2025〕28号',
    archivedDate: '2026-11-02',
    publishDate: '2026-11-02 16:20',
    publishChannel: '政务内网编研共享',
  },

  // 机构沿革 - 2024年
  {
    id: 'tp-27',
    status: '正式库',
    publishStatus: '已发布',
    topic: '机构沿革',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0063',
    title: '成都市深化工程建设项目审批制度改革工作领导小组机构沿革表',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成府函〔2024〕81号',
    archivedDate: '2026-11-01',
    publishDate: '2026-11-01 11:35',
    publishChannel: '档案馆编研专刊',
  },
  {
    id: 'tp-28',
    status: '正式库',
    publishStatus: '未发布',
    topic: '机构沿革',
    year: 2024,
    refCode: '0110-WS·2024-Y-BGS-0077',
    title: '成都市市属国家档案馆馆藏数字化工程专班工作机构印章停用销毁凭证',
    securityLevel: '秘密',
    retention: '30年',
    docNo: '成档发〔2024〕40号',
    archivedDate: '2026-11-01',
  },
];

// 正式库待导入候选档案池 (用于“导入专题”弹窗)
const candidateOfficialArchives: TopicArchiveItem[] = [
  {
    id: 'cand-01',
    status: '正式库',
    publishStatus: '未发布',
    topic: '大事记',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0033',
    title: '成都市城市地下管网三维数字化建模验收与全景展示方案决议',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成住建发〔2026〕67号',
    archivedDate: '2026-11-05',
  },
  {
    id: 'cand-02',
    status: '正式库',
    publishStatus: '未发布',
    topic: '重点项目',
    year: 2026,
    refCode: '0110-JJ·2026-Y-BGS-0041',
    title: '成都市锦江公园两岸慢行步道互通立体交叉节点贯通纪要',
    securityLevel: '公开',
    retention: '30年',
    docNo: '成规建发〔2026〕54号',
    archivedDate: '2026-11-04',
  },
  {
    id: 'cand-03',
    status: '正式库',
    publishStatus: '未发布',
    topic: '机构沿革',
    year: 2025,
    refCode: '0110-WS·2025-Y-BGS-0082',
    title: '关于成都市绿色低碳产业建圈强链专家咨询委员会成立文件',
    securityLevel: '公开',
    retention: '永久',
    docNo: '成发改字〔2025〕93号',
    archivedDate: '2026-11-03',
  },
  {
    id: 'cand-04',
    status: '正式库',
    publishStatus: '未发布',
    topic: '重点项目',
    year: 2025,
    refCode: '0110-SB·2025-Y-BGS-0017',
    title: '成都市水环境监测船载雷达与无人自动采样系统试航记录',
    securityLevel: '内部',
    retention: '10年',
    docNo: '成环测发〔2025〕31号',
    archivedDate: '2026-11-02',
  },
];

export const ArchiveResearchView: React.FC<ArchiveResearchViewProps> = ({
  onShowMessage,
  onSelectRecord,
}) => {
  // Left Tree Filter State
  const [selectedTopic, setSelectedTopic] = useState<string>('专题列表');
  const [selectedYear, setSelectedYear] = useState<string>('全部年份');
  const [expandedTopics, setExpandedTopics] = useState<string[]>([
    '大事记',
    '重点项目',
    '机构沿革',
  ]);

  // Main Dataset State
  const [topicArchives, setTopicArchives] = useState<TopicArchiveItem[]>(initialTopicArchives);

  // Search Input State
  const [titleQuery, setTitleQuery] = useState('');

  // Row Selection Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination State (10 items per page)
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Modals for each button ("每个按钮都也都帮我加上对应的功能页面")
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<TopicArchiveItem | null>(null);

  // Form states for Import Modal
  const [importCandidateSelectedIds, setImportCandidateSelectedIds] = useState<string[]>([]);
  const [importTargetTopic, setImportTargetTopic] = useState<'大事记' | '重点项目' | '机构沿革'>('大事记');
  const [importRemarks, setImportRemarks] = useState('');

  // Form states for Publish Modal
  const [publishChannel, setPublishChannel] = useState('档案馆编研专刊');
  const [publishRemarks, setPublishRemarks] = useState('');

  // Form states for Revoke Modal
  const [revokeReason, setRevokeReason] = useState('专题编研小组重新核定，需修正部分考证注释');

  // Form states for Advanced Search Modal
  const [advTitle, setAdvTitle] = useState('');
  const [advRefCode, setAdvRefCode] = useState('');
  const [advDocNo, setAdvDocNo] = useState('');
  const [advYear, setAdvYear] = useState('');
  const [advPublishStatus, setAdvPublishStatus] = useState<'全部' | '已发布' | '未发布'>('全部');
  const [advSecurity, setAdvSecurity] = useState('');

  // Toggle Left Tree Node
  const toggleTopic = (topicName: string) => {
    setExpandedTopics((prev) =>
      prev.includes(topicName) ? prev.filter((t) => t !== topicName) : [...prev, topicName]
    );
  };

  // Click on Left Tree Node ("点击左侧，右侧数据也跟着编")
  const handleSelectTreeNode = (topicName: string, year?: string) => {
    setSelectedTopic(topicName);
    if (year) {
      setSelectedYear(year);
    } else {
      setSelectedYear('全部年份');
    }
    setCurrentPage(1);
    setSelectedIds([]);
    onShowMessage(
      `已切换专题 [${topicName}${year ? ' · ' + year : ''}]，右侧编研成果列表已联动更新`
    );
  };

  const handleResetTree = () => {
    setSelectedTopic('专题列表');
    setSelectedYear('全部年份');
    setTitleQuery('');
    setCurrentPage(1);
    setSelectedIds([]);
    onShowMessage('已重置专题筛选，显示全量编研档案');
  };

  // Filtered dataset matching Left-Tree and Search (Recent descending order by date)
  const filteredArchives = topicArchives
    .filter((item) => {
      const matchesTopic = selectedTopic === '专题列表' || item.topic === selectedTopic;
      const matchesYear =
        selectedYear === '全部年份' || item.year.toString() === selectedYear.replace('年', '');
      const matchesSearch =
        !titleQuery ||
        item.title.toLowerCase().includes(titleQuery.toLowerCase()) ||
        item.refCode.toLowerCase().includes(titleQuery.toLowerCase()) ||
        item.docNo.toLowerCase().includes(titleQuery.toLowerCase());

      const matchesAdvTitle = !advTitle || item.title.includes(advTitle);
      const matchesAdvRef = !advRefCode || item.refCode.includes(advRefCode);
      const matchesAdvDoc = !advDocNo || item.docNo.includes(advDocNo);
      const matchesAdvYear = !advYear || item.year.toString() === advYear;
      const matchesAdvPub =
        advPublishStatus === '全部' || item.publishStatus === advPublishStatus;
      const matchesAdvSec = !advSecurity || item.securityLevel === advSecurity;

      return (
        matchesTopic &&
        matchesYear &&
        matchesSearch &&
        matchesAdvTitle &&
        matchesAdvRef &&
        matchesAdvDoc &&
        matchesAdvYear &&
        matchesAdvPub &&
        matchesAdvSec
      );
    })
    .sort((a, b) => (b.archivedDate || '').localeCompare(a.archivedDate || ''));

  const paginatedArchives = filteredArchives.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // 1. Button action: 导入专题
  const handleOpenImportModal = () => {
    setImportCandidateSelectedIds([]);
    setImportTargetTopic(
      selectedTopic !== '专题列表'
        ? (selectedTopic as '大事记' | '重点项目' | '机构沿革')
        : '大事记'
    );
    setImportRemarks('');
    setIsImportModalOpen(true);
  };

  const handleConfirmImport = () => {
    if (importCandidateSelectedIds.length === 0) {
      onShowMessage('请先勾选需要导入专题的正式库档案');
      return;
    }

    const selectedCandidates = candidateOfficialArchives.filter((c) =>
      importCandidateSelectedIds.includes(c.id)
    );

    const newImportedItems: TopicArchiveItem[] = selectedCandidates.map((c) => ({
      ...c,
      id: `tp-${Date.now()}-${c.id}`,
      topic: importTargetTopic,
      publishStatus: '未发布',
    }));

    setTopicArchives((prev) => [...newImportedItems, ...prev]);
    setIsImportModalOpen(false);
    onShowMessage(
      `已成功将 ${newImportedItems.length} 项正式库档案导入至 [${importTargetTopic}] 专题`
    );
  };

  // 2. Button action: 移除专题
  const handleOpenRemoveModal = () => {
    if (selectedIds.length === 0) {
      onShowMessage('请先勾选需要从专题中移除的档案条目');
      return;
    }
    setIsRemoveModalOpen(true);
  };

  const handleConfirmRemove = () => {
    setTopicArchives((prev) => prev.filter((item) => !selectedIds.includes(item.id)));
    const count = selectedIds.length;
    setSelectedIds([]);
    setIsRemoveModalOpen(false);
    onShowMessage(`已成功从专题中移除 ${count} 卷/件编研档案关联（正式库档案原卷不受影响）`);
  };

  // 3. Button action: 发布
  const handleOpenPublishModal = () => {
    if (selectedIds.length === 0) {
      onShowMessage('请先勾选需要发布的档案条目');
      return;
    }
    setIsPublishModalOpen(true);
  };

  const handleConfirmPublish = () => {
    const nowStr = '2026-11-05 16:40';
    setTopicArchives((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? {
              ...item,
              publishStatus: '已发布',
              publishDate: nowStr,
              publishChannel: publishChannel,
            }
          : item
      )
    );
    const count = selectedIds.length;
    setSelectedIds([]);
    setIsPublishModalOpen(false);
    onShowMessage(`已成功将 ${count} 项档案发布至 [${publishChannel}]`);
  };

  // 4. Button action: 撤销发布
  const handleOpenRevokeModal = () => {
    if (selectedIds.length === 0) {
      onShowMessage('请先勾选需要撤销发布的档案条目');
      return;
    }
    setIsRevokeModalOpen(true);
  };

  const handleConfirmRevoke = () => {
    setTopicArchives((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id)
          ? { ...item, publishStatus: '未发布', publishDate: undefined }
          : item
      )
    );
    const count = selectedIds.length;
    setSelectedIds([]);
    setIsRevokeModalOpen(false);
    onShowMessage(`已成功撤销 ${count} 项档案的发布状态，已重置为未发布`);
  };

  // Left Tree Data Structure (2026, 2025, 2024 - "右侧的年份不要太早")
  const topicTreeData = [
    {
      name: '大事记',
      years: ['2026年', '2025年', '2024年'],
    },
    {
      name: '重点项目',
      years: ['2026年', '2025年', '2024年'],
    },
    {
      name: '机构沿革',
      years: ['2026年', '2025年', '2024年'],
    },
  ];

  const hasActiveTreeFilter = selectedTopic !== '专题列表' || selectedYear !== '全部年份';

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-900 min-h-screen text-xs space-y-4">
      {/* Top Main Flex Container matching Screenshot */}
      <div className="flex flex-col lg:flex-row items-start gap-4">
        {/* LEFT COLUMN: 专题列表 Tree Panel */}
        <div className="w-full lg:w-60 bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 shrink-0 overflow-hidden">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 text-xs">
              <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              专题列表
            </h2>
            {hasActiveTreeFilter && (
              <button
                onClick={handleResetTree}
                title="重置专题筛选"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 text-[11px] flex items-center gap-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                重置
              </button>
            )}
          </div>

          <div className="p-2 space-y-1 max-h-[calc(100vh-220px)] overflow-y-auto font-mono text-xs">
            {/* Root Topic Node */}
            <div
              onClick={() => handleSelectTreeNode('专题列表')}
              className={`px-2 py-1.5 rounded flex items-center gap-1.5 font-bold cursor-pointer transition-colors ${
                selectedTopic === '专题列表'
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300'
                  : 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/60'
              }`}
            >
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>专题列表</span>
            </div>

            {/* Sub-Topics List matching screenshot */}
            <div className="pl-3 space-y-1">
              {topicTreeData.map((topic) => {
                const isExpanded = expandedTopics.includes(topic.name);
                const isTopicSelected =
                  selectedTopic === topic.name && selectedYear === '全部年份';

                return (
                  <div key={topic.name} className="space-y-0.5">
                    <div
                      className={`group flex items-center justify-between px-2 py-1 rounded cursor-pointer transition-colors ${
                        isTopicSelected
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                      onClick={() => handleSelectTreeNode(topic.name)}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleTopic(topic.name);
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
                        <span className="truncate">{topic.name}</span>
                      </div>
                    </div>

                    {/* Sub-Years (2026年, 2025年, 2024年 - No old years!) */}
                    {isExpanded && (
                      <div className="pl-6 space-y-0.5 border-l border-slate-200 dark:border-slate-700 ml-3">
                        {topic.years.map((year) => {
                          const isYearSelected =
                            selectedTopic === topic.name && selectedYear === year;

                          return (
                            <div
                              key={year}
                              onClick={() => handleSelectTreeNode(topic.name, year)}
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
          {/* Dynamic Linkage Indicator Tag */}
          {hasActiveTreeFilter && (
            <div className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 flex items-center justify-between gap-2 text-xs text-blue-900 dark:text-blue-200">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Folder className="w-3.5 h-3.5" />
                  <span>当前编研专题联动中:</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 font-semibold font-mono">
                  {selectedTopic} {selectedYear !== '全部年份' ? `(${selectedYear})` : ''}
                </span>
              </div>
              <button
                onClick={handleResetTree}
                className="px-2 py-0.5 rounded bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>显示全量编研</span>
              </button>
            </div>
          )}

          {/* Table Container Card */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden">
            {/* Top Toolbar matching user screenshots:
                [导入专题] [移除专题] [发布] [撤销发布] ... 题名: [input] [检索] [高级检索] */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
              {/* Left Action Buttons */}
              <div className="flex items-center gap-2">
                {/* 导入专题 - Solid primary blue */}
                <button
                  onClick={handleOpenImportModal}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  导入专题
                </button>

                {/* 移除专题 - Blue border */}
                <button
                  onClick={handleOpenRemoveModal}
                  className="px-3.5 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  移除专题
                </button>

                {/* 发布 - Blue border */}
                <button
                  onClick={handleOpenPublishModal}
                  className="px-3.5 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" />
                  发布
                </button>

                {/* 撤销发布 - Blue border */}
                <button
                  onClick={handleOpenRevokeModal}
                  className="px-3.5 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  撤销发布
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
                    setCurrentPage(1);
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
                  onClick={() => setIsAdvancedSearchOpen(true)}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  高级检索
                </button>
              </div>
            </div>

            {/* Table Area matching screenshots */}
            <div className="p-4 space-y-3">
              <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left border-collapse text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">
                        <input
                          type="checkbox"
                          checked={
                            selectedIds.length === paginatedArchives.length &&
                            paginatedArchives.length > 0
                          }
                          onChange={() => {
                            if (selectedIds.length === paginatedArchives.length) {
                              setSelectedIds([]);
                            } else {
                              setSelectedIds(paginatedArchives.map((i) => i.id));
                            }
                          }}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
                      <th className="py-2.5 px-3 text-center w-12 whitespace-nowrap">序号</th>
                      <th className="py-2.5 px-3 w-24 whitespace-nowrap">档案状态</th>
                      <th className="py-2.5 px-3 w-24 whitespace-nowrap">发布状态</th>
                      <th className="py-2.5 px-3 w-20 whitespace-nowrap">年度</th>
                      <th className="py-2.5 px-3 w-48 whitespace-nowrap">档号</th>
                      <th className="py-2.5 px-3 min-w-[220px]">题名</th>
                      <th className="py-2.5 px-3 w-20 whitespace-nowrap">密级</th>
                      <th className="py-2.5 px-3 w-20 whitespace-nowrap">期限</th>
                      <th className="py-2.5 px-3 w-36 whitespace-nowrap">文号</th>
                      <th className="py-2.5 px-3 text-center w-24 whitespace-nowrap">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 bg-white dark:bg-slate-800">
                    {paginatedArchives.length > 0 ? (
                      paginatedArchives.map((item, index) => {
                        const isPublished = item.publishStatus === '已发布';
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <td className="py-2.5 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() =>
                                  setSelectedIds((prev) =>
                                    prev.includes(item.id)
                                      ? prev.filter((i) => i !== item.id)
                                      : [...prev, item.id]
                                  )
                                }
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>
                            <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                              {(currentPage - 1) * PAGE_SIZE + index + 1}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60">
                                <CheckCircle2 className="w-3 h-3 text-blue-600" />
                                {item.status}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                  isPublished
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                    : 'bg-slate-100 text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                }`}
                              >
                                {isPublished ? (
                                  <Check className="w-3 h-3 text-emerald-500" />
                                ) : (
                                  <Clock className="w-3 h-3 text-slate-400" />
                                )}
                                {item.publishStatus}
                              </span>
                            </td>
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
                            <td className="py-2.5 px-3 text-center">
                              <button
                                onClick={() => setDetailItem(item)}
                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium hover:underline text-[11px]"
                              >
                                详情
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={11} className="py-10 text-center text-slate-400">
                          <div className="flex flex-col items-center justify-center gap-1.5">
                            <AlertCircle className="w-6 h-6 text-slate-300" />
                            <span>暂无符合条件的专题编研档案数据</span>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {filteredArchives.length > 0 && (
                <div className="pt-1">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={filteredArchives.length}
                    pageSize={PAGE_SIZE}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 1. 导入专题弹窗页面 (Import to Topic Modal) */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-blue-600" />
                从正式库导入档案至编研专题
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-950/40 p-2.5 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">目标专题分类:</span>
                <div className="flex items-center gap-2">
                  {(['大事记', '重点项目', '机构沿革'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setImportTargetTopic(t)}
                      className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                        importTargetTopic === t
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  可导入正式库档案列表 (勾选后导入):
                </span>
                <div className="max-h-60 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2 px-3 text-center w-10">选择</th>
                        <th className="py-2 px-3 w-40">档号</th>
                        <th className="py-2 px-3">题名</th>
                        <th className="py-2 px-3 w-20">年度</th>
                        <th className="py-2 px-3 w-24">文号</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700 bg-white dark:bg-slate-800">
                      {candidateOfficialArchives.map((cand) => (
                        <tr key={cand.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50">
                          <td className="py-2 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={importCandidateSelectedIds.includes(cand.id)}
                              onChange={() =>
                                setImportCandidateSelectedIds((prev) =>
                                  prev.includes(cand.id)
                                    ? prev.filter((id) => id !== cand.id)
                                    : [...prev, cand.id]
                                )
                              }
                              className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                          </td>
                          <td className="py-2 px-3 font-mono">{cand.refCode}</td>
                          <td className="py-2 px-3 font-medium text-slate-800 dark:text-slate-200">
                            {cand.title}
                          </td>
                          <td className="py-2 px-3 font-mono">{cand.year}</td>
                          <td className="py-2 px-3 font-mono text-[11px] text-slate-500">
                            {cand.docNo}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  导入说明与编研入卷备注
                </label>
                <textarea
                  rows={2}
                  value={importRemarks}
                  onChange={(e) => setImportRemarks(e.target.value)}
                  placeholder="请输入编研入卷原由、史料考证依据等..."
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium shadow-xs"
              >
                确认导入专题 ({importCandidateSelectedIds.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 移除专题确认弹窗页面 (Remove from Topic Modal) */}
      {isRemoveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-amber-50 dark:bg-amber-950/40">
              <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                从编研专题中移除档案
              </h3>
              <button
                onClick={() => setIsRemoveModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-slate-700 dark:text-slate-300">
                您确定要将选中的 <strong className="text-blue-600 font-bold">{selectedIds.length}</strong> 项档案从当前编研专题中解除关联吗？
              </p>
              <div className="p-2.5 rounded bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-slate-500 text-[11px]">
                提示：移除操作仅解除该档案在编研成果专栏的归集引用，不会删除正式库中的原始档案卷件。
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRemoveModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmRemove}
                className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-xs"
              >
                确认移除专题
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 发布专题成果弹窗页面 (Publish Modal) */}
      {isPublishModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-blue-50 dark:bg-blue-950/40">
              <h3 className="text-sm font-bold text-blue-800 dark:text-blue-200 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-blue-600" />
                发布编研成果专栏
              </h3>
              <button
                onClick={() => setIsPublishModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                已选择发布条目: <strong className="text-blue-600 font-bold">{selectedIds.length}</strong> 卷/件
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  发布展示渠道 <span className="text-red-500">*</span>
                </label>
                <select
                  value={publishChannel}
                  onChange={(e) => setPublishChannel(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="档案馆编研专刊">档案馆编研专刊 (内网电子刊)</option>
                  <option value="政务内网编研共享">政务内网编研共享 (局机关全员可读)</option>
                  <option value="门户网站专题专栏">门户网站专题专栏 (政务公开合规版面)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  发布说明 / 批复签发备忘
                </label>
                <textarea
                  rows={2.5}
                  value={publishRemarks}
                  onChange={(e) => setPublishRemarks(e.target.value)}
                  placeholder="经编研委员会主任签署发布核准..."
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsPublishModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmPublish}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium shadow-xs"
              >
                确认正式发布
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 撤销发布弹窗页面 (Revoke Publish Modal) */}
      {isRevokeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-100 dark:bg-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-blue-600" />
                撤销已发布成果
              </h3>
              <button
                onClick={() => setIsRevokeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <p className="text-slate-700 dark:text-slate-300">
                将对选中的 <strong className="text-blue-600 font-bold">{selectedIds.length}</strong> 项已发布档案执行下架与撤销发布操作。
              </p>

              <div className="space-y-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  撤销发布原因 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={revokeReason}
                  onChange={(e) => setRevokeReason(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRevokeModalOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-medium"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmRevoke}
                className="px-4 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-800 text-white font-medium shadow-xs"
              >
                确认撤销下线
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 高级检索弹窗页面 (Advanced Search Modal) */}
      {isAdvancedSearchOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                档案编研高级条件检索
              </h3>
              <button
                onClick={() => setIsAdvancedSearchOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-slate-600 dark:text-slate-400 font-medium">题名包含</label>
                <input
                  type="text"
                  value={advTitle}
                  onChange={(e) => setAdvTitle(e.target.value)}
                  placeholder="例如: 实施意见"
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 dark:text-slate-400 font-medium">档号包含</label>
                <input
                  type="text"
                  value={advRefCode}
                  onChange={(e) => setAdvRefCode(e.target.value)}
                  placeholder="例如: 0110-WS"
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 dark:text-slate-400 font-medium">文号包含</label>
                <input
                  type="text"
                  value={advDocNo}
                  onChange={(e) => setAdvDocNo(e.target.value)}
                  placeholder="例如: 成发改"
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 dark:text-slate-400 font-medium">归档年度</label>
                <select
                  value={advYear}
                  onChange={(e) => setAdvYear(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="">全部年度</option>
                  <option value="2026">2026年</option>
                  <option value="2025">2025年</option>
                  <option value="2024">2024年</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 dark:text-slate-400 font-medium">发布状态</label>
                <select
                  value={advPublishStatus}
                  onChange={(e) => setAdvPublishStatus(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="全部">全部发布状态</option>
                  <option value="已发布">已发布</option>
                  <option value="未发布">未发布</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-slate-600 dark:text-slate-400 font-medium">密级要求</label>
                <select
                  value={advSecurity}
                  onChange={(e) => setAdvSecurity(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 outline-none"
                >
                  <option value="">全部密级</option>
                  <option value="公开">公开</option>
                  <option value="内部">内部</option>
                  <option value="秘密">秘密</option>
                  <option value="机密">机密</option>
                </select>
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setAdvTitle('');
                  setAdvRefCode('');
                  setAdvDocNo('');
                  setAdvYear('');
                  setAdvPublishStatus('全部');
                  setAdvSecurity('');
                }}
                className="text-slate-500 hover:text-slate-700 text-xs underline"
              >
                重置检索条件
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAdvancedSearchOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 font-medium"
                >
                  关闭
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsAdvancedSearchOpen(false);
                    onShowMessage('已应用高级检索条件');
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-xs"
                >
                  开始检索
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. 查看档案详情弹窗 */}
      {detailItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                编研专题档案详细信息
              </h3>
              <button
                onClick={() => setDetailItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 font-mono">
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm font-sans">
                    {detailItem.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                    {detailItem.topic}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-xs">
                  <div>
                    <span className="text-slate-400">档号：</span>
                    {detailItem.refCode}
                  </div>
                  <div>
                    <span className="text-slate-400">文号：</span>
                    {detailItem.docNo}
                  </div>
                  <div>
                    <span className="text-slate-400">年度：</span>
                    {detailItem.year}年
                  </div>
                  <div>
                    <span className="text-slate-400">密级：</span>
                    {detailItem.securityLevel}
                  </div>
                  <div>
                    <span className="text-slate-400">保管期限：</span>
                    {detailItem.retention}
                  </div>
                  <div>
                    <span className="text-slate-400">归档时间：</span>
                    {detailItem.archivedDate}
                  </div>
                  <div>
                    <span className="text-slate-400">发布状态：</span>
                    <span className={detailItem.publishStatus === '已发布' ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                      {detailItem.publishStatus}
                    </span>
                  </div>
                  {detailItem.publishDate && (
                    <div>
                      <span className="text-slate-400">发布时间：</span>
                      {detailItem.publishDate}
                    </div>
                  )}
                </div>

                {detailItem.publishChannel && (
                  <div className="text-xs pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span className="text-slate-400">发布渠道：</span>
                    <span className="text-blue-600 dark:text-blue-400 font-semibold font-sans">
                      {detailItem.publishChannel}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-xs"
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
