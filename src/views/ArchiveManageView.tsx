import React, { useState, useRef } from 'react';
import {
  Search,
  Filter,
  Plus,
  FileText,
  CheckCircle2,
  Download,
  RefreshCw,
  FolderTree,
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Building2,
  Copy,
  Edit3,
  Trash2,
  Printer,
  ShieldCheck,
  Combine,
  Scissors,
  Layers,
  RotateCcw,
  X,
  Upload,
  Check,
  Send,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

interface ArchiveManageViewProps {
  onSelectRecord: (record: any) => void;
  onShowMessage: (msg: string) => void;
}

// 1. 档案管理 - 文件列表数据项接口
export interface ManageFileItem {
  id: string;
  status: '在档保管' | '待期满鉴定' | '四性检测合格' | '已归档盘点' | '转交中' | '借阅锁定';
  source: '机关归档' | '综合档案馆移交' | '在线实时归档' | '数字档案室同步';
  title: string;
  fondsNo: string;
  year: number;
  refCode: string;
  docNo: string;
  author: string;
  writtenDate: string;
  securityLevel: '公开' | '内部' | '秘密' | '机密';
  retention: '永久' | '30年' | '10年';
  unit: string;
  archivedDate: string;
  folderName: string;
  className: string;
}

// 2. 档案管理 - 案卷列表数据项接口
export interface ManageVolumeItem {
  id: string;
  status: '在档保管' | '卷内已盘点' | '鉴定预备' | '四性复测通过';
  source: '机关归档' | '综合档案馆移交' | '工程审批系统' | '在线实时归档';
  title: string;
  fondsNo: string;
  year: number;
  volumeNo: string;
  itemIndex: number;
  refCode: string;
  dateRange: string;
  pageCount: number;
  fileCount: number;
  orgUnit: string;
  prepDate: string;
  author: string;
  writtenDate: string;
  securityLevel: '公开' | '内部' | '秘密' | '机密';
  retention: '永久' | '30年' | '10年';
  unit: string;
  archivedDate: string;
  folderName: string;
  className: string;
}

// 初始在档文件数据集 (全新规范数据)
const initialManageFileListData: ManageFileItem[] = [
  {
    id: 'mf-01',
    status: '在档保管',
    source: '机关归档',
    title: '成都市住房和城乡建设局关于2026年度地下管网智慧化改造工程归档方案',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0101',
    docNo: '成住建发〔2026〕28号',
    author: '成都市住房和城乡建设局',
    writtenDate: '2026-11-01',
    securityLevel: '秘密',
    retention: '永久',
    unit: '市住建局档案馆',
    archivedDate: '2026-11-03',
    folderName: '基建工程档案',
    className: '生产技术管理',
  },
  {
    id: 'mf-02',
    status: '四性检测合格',
    source: '在线实时归档',
    title: '关于批准2026年第二批高新技术企业研发财政补贴的批复',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-TE·2026-Y-BGS-0102',
    docNo: '成财企〔2026〕65号',
    author: '成都市财政局',
    writtenDate: '2026-11-05',
    securityLevel: '内部',
    retention: '30年',
    unit: '财政局档案室',
    archivedDate: '2026-11-02',
    folderName: '会计档案',
    className: '财务审计',
  },
  {
    id: 'mf-03',
    status: '在档保管',
    source: '机关归档',
    title: '成都市全域土地空间利用与生态保护红线划定决议',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0103',
    docNo: '成资规发〔2026〕14号',
    author: '成都市规划和自然资源局',
    writtenDate: '2026-11-05',
    securityLevel: '机密',
    retention: '永久',
    unit: '资规局档案室',
    archivedDate: '2026-11-01',
    folderName: '文书档案',
    className: '经营管理',
  },
  {
    id: 'mf-04',
    status: '已归档盘点',
    source: '数字档案室同步',
    title: '成都市“十四五”电子政务数字孪生平台运维管理规范',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-QE·2026-Y-BGS-0104',
    docNo: '成发改规〔2026〕05号',
    author: '成都市发展和改革委员会',
    writtenDate: '2026-11-04',
    securityLevel: '内部',
    retention: '30年',
    unit: '市发改委信息中心',
    archivedDate: '2026-11-05',
    folderName: '声像电子档案',
    className: '生产技术管理',
  },
  {
    id: 'mf-05',
    status: '借阅锁定',
    source: '综合档案馆移交',
    title: '成都市促进青年人才就创业与住房保障实施细则',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0105',
    docNo: '成人社字〔2026〕102号',
    author: '成都市人力资源和社会保障局',
    writtenDate: '2026-11-04',
    securityLevel: '公开',
    retention: '30年',
    unit: '人社局档案中心',
    archivedDate: '2026-11-04',
    folderName: '文书档案',
    className: '人力资源管理',
  },
  {
    id: 'mf-06',
    status: '在档保管',
    source: '机关归档',
    title: '成都市智能网联汽车试点路段测绘与数据共享协议',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-JT·2026-Y-BGS-0106',
    docNo: '成交规〔2026〕19号',
    author: '成都市交通运输局',
    writtenDate: '2026-11-03',
    securityLevel: '机密',
    retention: '永久',
    unit: '交通局档案室',
    archivedDate: '2026-11-04',
    folderName: '设备设施档案',
    className: '生产技术管理',
  },
  {
    id: 'mf-07',
    status: '四性检测合格',
    source: '在线实时归档',
    title: '关于发布2026年度市级公共文化设施提升改造工程立项审查报告',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0107',
    docNo: '成文广旅发〔2026〕33号',
    author: '成都市文化广电旅游局',
    writtenDate: '2026-11-03',
    securityLevel: '公开',
    retention: '30年',
    unit: '文广旅局办公室',
    archivedDate: '2026-11-04',
    folderName: '文书档案',
    className: '行政管理',
  },
  {
    id: 'mf-08',
    status: '待期满鉴定',
    source: '机关归档',
    title: '2016年成都市重点水利枢纽建设工程完工竣工验收纪要',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-SL·2016-Y-BGS-0088',
    docNo: '成水字〔2016〕45号',
    author: '成都市水务局',
    writtenDate: '2016-11-10',
    securityLevel: '秘密',
    retention: '10年',
    unit: '水务局档案馆',
    archivedDate: '2016-11-15',
    folderName: '基建工程档案',
    className: '行政管理',
  },
  {
    id: 'mf-09',
    status: '在档保管',
    source: '机关归档',
    title: '成都市生态环境局2026年三季度重点污染源在线监控电子记录清册',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-GD·2026-Y-BGS-0109',
    docNo: '成环监控〔2026〕12号',
    author: '成都市生态环境局',
    writtenDate: '2026-11-02',
    securityLevel: '公开',
    retention: '30年',
    unit: '环境局档案室',
    archivedDate: '2026-11-03',
    folderName: '声像电子档案',
    className: '党群工作',
  },
  {
    id: 'mf-10',
    status: '已归档盘点',
    source: '数字档案室同步',
    title: '成都市市场监督管理局关于规范知识产权商标转让备案的批复',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-KJ·2026-Y-BGS-0110',
    docNo: '成市监字〔2026〕51号',
    author: '成都市市场监督管理局',
    writtenDate: '2026-11-01',
    securityLevel: '公开',
    retention: '永久',
    unit: '市监局档案馆',
    archivedDate: '2026-11-02',
    folderName: '文书档案',
    className: '经营管理',
  },
  {
    id: 'mf-11',
    status: '在档保管',
    source: '综合档案馆移交',
    title: '成都市住建系统2025年度优质建筑工程“蜀安杯”颁奖典礼视频光盘',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-ZP·2025-Y-BGS-0099',
    docNo: '成住建奖〔2025〕18号',
    author: '成都市住房和城乡建设局',
    writtenDate: '2026-11-04',
    securityLevel: '公开',
    retention: '永久',
    unit: '市档案馆',
    archivedDate: '2026-11-05',
    folderName: '照片图音档案',
    className: '党群工作',
  },
  {
    id: 'mf-12',
    status: '四性检测合格',
    source: '机关归档',
    title: '成都市住房公积金管理中心全国示范窗口铜牌挂接记录',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-SW·2025-Y-BGS-0044',
    docNo: '成公积金〔2025〕08号',
    author: '成都住房公积金管理中心',
    writtenDate: '2026-11-03',
    securityLevel: '公开',
    retention: '永久',
    unit: '荣誉陈列室',
    archivedDate: '2026-11-04',
    folderName: '实物荣誉档案',
    className: '行政管理',
  },
];

// 初始在档案卷数据集
const initialManageVolumeListData: ManageVolumeItem[] = [
  {
    id: 'mv-01',
    status: '在档保管',
    source: '机关归档',
    title: '成都市住房和城乡建设局2026年轨道交通延伸线规划与土地预审案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 1,
    refCode: '0110-WS·2026-Y-BGS-0201',
    dateRange: '2026-11-01 - 2026-11-01',
    pageCount: 168,
    fileCount: 15,
    orgUnit: '成都市住房和城乡建设局',
    prepDate: '2026-11-02',
    author: '局行政审批处',
    writtenDate: '2026-11-01',
    securityLevel: '机密',
    retention: '永久',
    unit: '档案管理中心',
    archivedDate: '2026-11-03',
    folderName: '基建工程档案',
    className: '生产技术管理',
  },
  {
    id: 'mv-02',
    status: '四性复测通过',
    source: '在线实时归档',
    title: '2026年全市保障性租赁住房专项资金划拨与绩效评价汇总卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 2,
    refCode: '0110-WS·2026-Y-BGS-0202',
    dateRange: '2026-11-02 - 2026-11-05',
    pageCount: 192,
    fileCount: 18,
    orgUnit: '成都市财政局',
    prepDate: '2026-11-05',
    author: '住房保障与预算处',
    writtenDate: '2026-11-05',
    securityLevel: '秘密',
    retention: '30年',
    unit: '财政局档案室',
    archivedDate: '2026-11-01',
    folderName: '会计档案',
    className: '财务审计',
  },
  {
    id: 'mv-03',
    status: '卷内已盘点',
    source: '机关归档',
    title: '成都市人力资源和社会保障局2026年高校毕业生创业补贴审核卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 3,
    refCode: '0110-WS·2026-Y-BGS-0203',
    dateRange: '2026-11-01 - 2026-11-04',
    pageCount: 130,
    fileCount: 12,
    orgUnit: '成都市人力资源和社会保障局',
    prepDate: '2026-11-05',
    author: '就业促进处',
    writtenDate: '2026-11-04',
    securityLevel: '内部',
    retention: '30年',
    unit: '人社局档案室',
    archivedDate: '2026-11-05',
    folderName: '文书档案',
    className: '人力资源管理',
  },
  {
    id: 'mv-04',
    status: '在档保管',
    source: '综合档案馆移交',
    title: '成都市“十四五”智慧城市算力中心全过程规划与基建卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 4,
    refCode: '0110-WS·2026-Y-BGS-0204',
    dateRange: '2026-11-05 - 2026-11-03',
    pageCount: 310,
    fileCount: 22,
    orgUnit: '成都市发展和改革委员会',
    prepDate: '2026-11-04',
    author: '高技术产业处',
    writtenDate: '2026-11-03',
    securityLevel: '机密',
    retention: '永久',
    unit: '市发改委档案馆',
    archivedDate: '2026-11-04',
    folderName: '基建工程档案',
    className: '生产技术管理',
  },
  {
    id: 'mv-05',
    status: '四性复测通过',
    source: '在线实时归档',
    title: '2026年市级财政直达资金国库集中支付与审计核查卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '002',
    itemIndex: 1,
    refCode: '0110-WS·2026-Y-BGS-0205',
    dateRange: '2026-11-01 - 2026-11-03',
    pageCount: 205,
    fileCount: 16,
    orgUnit: '成都市财政局',
    prepDate: '2026-11-03',
    author: '国库支付中心',
    writtenDate: '2026-11-03',
    securityLevel: '秘密',
    retention: '30年',
    unit: '财政局档案室',
    archivedDate: '2026-11-04',
    folderName: '会计档案',
    className: '财务审计',
  },
  {
    id: 'mv-06',
    status: '在档保管',
    source: '工程审批系统',
    title: '成都市智能网联汽车高精地图数字化检测与安全评估案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '002',
    itemIndex: 2,
    refCode: '0110-WS·2026-Y-BGS-0206',
    dateRange: '2026-11-01 - 2026-11-02',
    pageCount: 175,
    fileCount: 14,
    orgUnit: '成都市交通运输局',
    prepDate: '2026-11-03',
    author: '科技信息处',
    writtenDate: '2026-11-02',
    securityLevel: '机密',
    retention: '30年',
    unit: '交通局档案馆',
    archivedDate: '2026-11-03',
    folderName: '设备设施档案',
    className: '生产技术管理',
  },
  {
    id: 'mv-07',
    status: '卷内已盘点',
    source: '工程审批系统',
    title: '中心城区地下综合管廊三维地理信息全景数据归档卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '002',
    itemIndex: 3,
    refCode: '0110-WS·2026-Y-BGS-0207',
    dateRange: '2026-11-01 - 2026-11-01',
    pageCount: 280,
    fileCount: 19,
    orgUnit: '成都市规划和自然资源局',
    prepDate: '2026-11-02',
    author: '地理信息管理处',
    writtenDate: '2026-11-01',
    securityLevel: '秘密',
    retention: '永久',
    unit: '资规局档案馆',
    archivedDate: '2026-11-02',
    folderName: '基建工程档案',
    className: '经营管理',
  },
  {
    id: 'mv-08',
    status: '鉴定预备',
    source: '机关归档',
    title: '2016年市水务局重点防汛水库大坝安全鉴定卷',
    fondsNo: '0110',
    year: 2016,
    volumeNo: '001',
    itemIndex: 1,
    refCode: '0110-SL·2016-Y-BGS-0090',
    dateRange: '2016-05-01 - 2016-10-30',
    pageCount: 110,
    fileCount: 8,
    orgUnit: '成都市水务局',
    prepDate: '2016-11-02',
    author: '工程管理处',
    writtenDate: '2016-10-30',
    securityLevel: '公开',
    retention: '10年',
    unit: '水务局档案室',
    archivedDate: '2016-11-05',
    folderName: '设备设施档案',
    className: '行政管理',
  },
  {
    id: 'mv-09',
    status: '在档保管',
    source: '机关归档',
    title: '2026年三季度全市重点企业排污核算及碳减排合规卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '003',
    itemIndex: 1,
    refCode: '0110-GD·2026-Y-BGS-0209',
    dateRange: '2026-11-01 - 2026-11-05',
    pageCount: 140,
    fileCount: 11,
    orgUnit: '成都市生态环境局',
    prepDate: '2026-11-01',
    author: '气候变化处',
    writtenDate: '2026-11-05',
    securityLevel: '公开',
    retention: '30年',
    unit: '环境局档案室',
    archivedDate: '2026-11-02',
    folderName: '声像电子档案',
    className: '党群工作',
  },
  {
    id: 'mv-10',
    status: '四性复测通过',
    source: '工程审批系统',
    title: '2026年全市知识产权质押融资风险补偿金备案案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '003',
    itemIndex: 2,
    refCode: '0110-KJ·2026-Y-BGS-0210',
    dateRange: '2026-11-02 - 2026-11-01',
    pageCount: 125,
    fileCount: 10,
    orgUnit: '成都市市场监督管理局',
    prepDate: '2026-11-03',
    author: '知识产权服务处',
    writtenDate: '2026-11-01',
    securityLevel: '公开',
    retention: '永久',
    unit: '市监局档案馆',
    archivedDate: '2026-11-01',
    folderName: '文书档案',
    className: '经营管理',
  },
  {
    id: 'mv-11',
    status: '在档保管',
    source: '机关归档',
    title: '2025年成都市住建局天府杯示范工程质量评定总结案卷',
    fondsNo: '0110',
    year: 2025,
    volumeNo: '002',
    itemIndex: 1,
    refCode: '0110-SX·2025-Y-BGS-0080',
    dateRange: '2026-11-01 - 2026-11-02',
    pageCount: 185,
    fileCount: 14,
    orgUnit: '成都市住房和城乡建设局',
    prepDate: '2026-11-03',
    author: '质监站室',
    writtenDate: '2026-11-02',
    securityLevel: '机密',
    retention: '30年',
    unit: '档案馆',
    archivedDate: '2026-11-04',
    folderName: '声像电子档案',
    className: '经营管理',
  },
  {
    id: 'mv-12',
    status: '卷内已盘点',
    source: '综合档案馆移交',
    title: '成都住房公积金管理中心全国表彰及实物证书移交卷',
    fondsNo: '0110',
    year: 2025,
    volumeNo: '002',
    itemIndex: 2,
    refCode: '0110-SW·2025-Y-BGS-0081',
    dateRange: '2026-11-01 - 2026-11-03',
    pageCount: 95,
    fileCount: 8,
    orgUnit: '成都住房公积金管理中心',
    prepDate: '2026-11-03',
    author: '综合处',
    writtenDate: '2026-11-03',
    securityLevel: '公开',
    retention: '永久',
    unit: '荣誉陈列室',
    archivedDate: '2026-11-04',
    folderName: '实物荣誉档案',
    className: '行政管理',
  },
];

export const ArchiveManageView: React.FC<ArchiveManageViewProps> = ({
  onSelectRecord,
  onShowMessage,
}) => {
  // Tabs: 'files' (文件列表) vs 'volumes' (案卷列表)
  const [activeTab, setActiveTab] = useState<'files' | 'volumes'>('files');

  // Main Datasets
  const [fileList, setFileList] = useState<ManageFileItem[]>(initialManageFileListData);
  const [volumeList, setVolumeList] = useState<ManageVolumeItem[]>(initialManageVolumeListData);

  // Filter & Search states
  const [titleSearch, setTitleSearch] = useState('');
  const [currentFilePage, setCurrentFilePage] = useState(1);
  const [currentVolumePage, setCurrentVolumePage] = useState(1);
  const PAGE_SIZE = 10;

  // Tree selection state
  const [selectedFolder, setSelectedFolder] = useState<string>('全部目录');
  const [selectedYear, setSelectedYear] = useState<string>('全部年份');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部分类');

  // Checkbox selections
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [selectedVolumeIds, setSelectedVolumeIds] = useState<string[]>([]);

  // Hidden native file input ref for real local file uploads
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Action Modal States
  const [modalType, setModalType] = useState<
    | 'add_file'
    | 'add_volume'
    | 'edit'
    | 'copy'
    | 'delete_confirm'
    | 'submit'
    | 'export_selected'
    | 'export_all'
    | 'print'
    | 'four_testing'
    | 'merge'
    | 'split'
    | null
  >(null);

  // Modal Form Inputs
  const [formFondsNo, setFormFondsNo] = useState('');
  const [formYear, setFormYear] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formClassNo, setFormClassNo] = useState('');
  const [formBoxNo, setFormBoxNo] = useState('');
  const [formItemNo, setFormItemNo] = useState('');
  const [formRefCode, setFormRefCode] = useState('');
  const [formVolumeNo, setFormVolumeNo] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDocNo, setFormDocNo] = useState('');
  const [formAuthor, setFormAuthor] = useState('');
  const [formWrittenDate, setFormWrittenDate] = useState('');
  const [formRetention, setFormRetention] = useState<string>('');
  const [formSecurity, setFormSecurity] = useState<string>('');
  const [formPageCount, setFormPageCount] = useState('');
  const [formFileCount, setFormFileCount] = useState('');
  const [formUnit, setFormUnit] = useState('');
  const [formArchivedDate, setFormArchivedDate] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formRemark, setFormRemark] = useState('');

  // Electronic attachments list inside Add File modal
  const [fileAttachments, setFileAttachments] = useState<
    Array<{ id: string; name: string; type: string; size: string; checked: boolean }>
  >([]);

  // Open Add File Modal with CLEARED form fields
  const handleOpenAddFile = () => {
    setFormFondsNo('0110');
    setFormYear('2026');
    setFormCategory('');
    setFormBoxNo('');
    setFormItemNo('');
    setFormRefCode('');
    setFormTitle('');
    setFormDocNo('');
    setFormAuthor('');
    setFormWrittenDate('');
    setFormRetention('');
    setFormSecurity('');
    setFormPageCount('');
    setFormUnit('');
    setFormArchivedDate('');
    setFormLocation('');
    setFormRemark('');
    setFileAttachments([]);
    setModalType('add_file');
  };

  // Trigger Native File Selector
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Handle Native File Selection directly from OS file picker
  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAttachments: Array<{
      id: string;
      name: string;
      type: string;
      size: string;
      checked: boolean;
    }> = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const ext = '.' + (f.name.split('.').pop() || 'bin');
      const formattedSize =
        f.size > 1024 * 1024
          ? (f.size / (1024 * 1024)).toFixed(1) + 'MB'
          : Math.max(1, Math.round(f.size / 1024)) + 'KB';

      newAttachments.push({
        id: `att-${Date.now()}-${i}`,
        name: f.name,
        type: ext,
        size: formattedSize,
        checked: false,
      });
    }

    setFileAttachments((prev) => [...prev, ...newAttachments]);

    // Auto fill formTitle if empty
    if (!formTitle && files.length > 0) {
      const firstName = files[0].name;
      const baseTitle = firstName.substring(0, firstName.lastIndexOf('.')) || firstName;
      setFormTitle(baseTitle);
    }

    onShowMessage(`已成功真实选择并导入 ${files.length} 个本地电子原件文件！`);
    e.target.value = '';
  };

  // Open Copy Modal
  const handleOpenCopy = () => {
    const target =
      activeTab === 'files'
        ? fileList.find((f) => selectedFileIds.includes(f.id)) || fileList[0]
        : volumeList.find((v) => selectedVolumeIds.includes(v.id)) || volumeList[0];

    if (target) {
      setFormTitle(`[副本] ${target.title}`);
      setFormDocNo('docNo' in target ? target.docNo : target.volumeNo);
      setFormAuthor(target.author);
      setFormSecurity(target.securityLevel);
      setFormRetention(target.retention);
      setModalType('copy');
    }
  };

  // Save Copied Record
  const handleSaveCopy = () => {
    if (activeTab === 'files') {
      const newFile: ManageFileItem = {
        id: `mf-${Date.now()}`,
        status: '在档保管',
        source: '机关归档',
        title: formTitle || '副本电子文件',
        fondsNo: '0110',
        year: 2026,
        refCode: `0110-WS·2026-Y-BGS-0${fileList.length + 101}`,
        docNo: formDocNo || '成住建发〔2026〕99号',
        author: formAuthor || '成都市住房和城乡建设局',
        writtenDate: '2026-11-04',
        securityLevel: (formSecurity as any) || '秘密',
        retention: (formRetention as any) || '30年',
        unit: '市住建局档案馆',
        archivedDate: '2026-11-04',
        folderName: selectedFolder !== '全部目录' ? selectedFolder : '文书档案',
        className: '行政管理',
      };
      setFileList([newFile, ...fileList]);
    }
    setModalType(null);
    onShowMessage(`已成功复制并生成新的在档元数据记录`);
  };

  // Open Add Volume Modal (cleared input fields)
  const handleOpenAddVolume = () => {
    setFormFondsNo('');
    setFormYear('');
    setFormRefCode('');
    setFormVolumeNo('');
    setFormCategory('');
    setFormClassNo('');
    setFormTitle('');
    setFormRetention('');
    setFormSecurity('');
    setFormPageCount('');
    setFormFileCount('');
    setFormAuthor('');
    setFormWrittenDate('');
    setFormUnit('');
    setFormArchivedDate('');
    setFormLocation('');
    setFormRemark('');
    setModalType('add_volume');
  };

  // Submit Add File
  const handleSaveAddFile = () => {
    const newFile: ManageFileItem = {
      id: `mf-${Date.now()}`,
      status: '在档保管',
      source: '在线实时归档',
      title: formTitle || '新建在档归档文件',
      fondsNo: formFondsNo || '0110',
      year: parseInt(formYear) || 2026,
      refCode: formRefCode || `0110-WS·2026-Y-BGS-0${fileList.length + 101}`,
      docNo: formDocNo || '成住建发〔2026〕101号',
      author: formAuthor || '成都市住房和城乡建设局',
      writtenDate: formWrittenDate || '2026-11-05',
      securityLevel: (formSecurity as any) || '公开',
      retention: (formRetention as any) || '30年',
      unit: formUnit || '市住建局档案馆',
      archivedDate: formArchivedDate || '2026-11-05',
      folderName: selectedFolder !== '全部目录' ? selectedFolder : '文书档案',
      className: formCategory || '行政管理',
    };
    setFileList([newFile, ...fileList]);
    setModalType(null);
    onShowMessage(`已成功添加在档文件 [${newFile.title}]`);
  };

  // Submit Add Volume
  const handleSaveAddVolume = () => {
    const newVol: ManageVolumeItem = {
      id: `mv-${Date.now()}`,
      status: '在档保管',
      source: '工程审批系统',
      title: formTitle || '新建工程管理案卷',
      fondsNo: formFondsNo || '0110',
      year: parseInt(formYear) || 2026,
      volumeNo: formVolumeNo || '001',
      itemIndex: volumeList.length + 1,
      refCode: formRefCode || `0110-WS·2026-Y-BGS-0${volumeList.length + 201}`,
      dateRange: `${formWrittenDate || '2026-11-01'} - ${formArchivedDate || '2026-11-05'}`,
      pageCount: parseInt(formPageCount) || 120,
      fileCount: parseInt(formFileCount) || 10,
      orgUnit: formAuthor || '成都市住房和城乡建设局',
      prepDate: formWrittenDate || '2026-11-05',
      author: formAuthor || '市住建局办公室',
      writtenDate: formWrittenDate || '2026-11-05',
      securityLevel: (formSecurity as any) || '公开',
      retention: (formRetention as any) || '30年',
      unit: formUnit || '档案管理中心',
      archivedDate: formArchivedDate || '2026-11-05',
      folderName: selectedFolder !== '全部目录' ? selectedFolder : '基建工程档案',
      className: formCategory || '生产技术管理',
    };
    setVolumeList([newVol, ...volumeList]);
    setModalType(null);
    onShowMessage(`成功立卷新案卷 [${newVol.title}]`);
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    const target =
      activeTab === 'files'
        ? fileList.find((f) => selectedFileIds.includes(f.id)) || fileList[0]
        : volumeList.find((v) => selectedVolumeIds.includes(v.id)) || volumeList[0];

    if (target) {
      setFormTitle(target.title);
      setFormDocNo('docNo' in target ? target.docNo : target.volumeNo);
      setFormAuthor(target.author);
      setFormSecurity(target.securityLevel);
      setFormRetention(target.retention);
      setModalType('edit');
    }
  };

  // Tree selection handlers
  const handleSelectFolder = (folderName: string, year?: string) => {
    setSelectedFolder(folderName);
    if (year) {
      setSelectedYear(year);
    } else {
      setSelectedYear('全部年份');
    }
    setCurrentFilePage(1);
    setCurrentVolumePage(1);
    onShowMessage(`已选择目录 [${folderName}${year ? ' - ' + year : ''}]，右侧列表已同步切换数据`);
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentFilePage(1);
    setCurrentVolumePage(1);
    onShowMessage(`已选择分类 [${categoryName}]，右侧列表已同步过滤数据`);
  };

  const handleResetFilters = () => {
    setSelectedFolder('全部目录');
    setSelectedYear('全部年份');
    setSelectedCategory('全部分类');
    setTitleSearch('');
    setCurrentFilePage(1);
    setCurrentVolumePage(1);
    onShowMessage('已重置所有左侧筛选条件，显示全量在档数据');
  };

  // Filtered File Data with Left-Tree Dynamic Matching
  const filteredFiles = fileList.filter((item) => {
    const matchesFolder =
      selectedFolder === '全部目录' || item.folderName === selectedFolder;

    const matchesYear =
      selectedYear === '全部年份' || item.year.toString() === selectedYear.replace('年', '');

    const cleanCategory = selectedCategory.replace(/（.*）/, '');
    const matchesCategory =
      selectedCategory === '全部分类' ||
      item.className.includes(cleanCategory) ||
      cleanCategory.includes(item.className);

    const matchesSearch =
      !titleSearch ||
      item.title.toLowerCase().includes(titleSearch.toLowerCase()) ||
      item.refCode.toLowerCase().includes(titleSearch.toLowerCase()) ||
      item.author.toLowerCase().includes(titleSearch.toLowerCase());

    return matchesFolder && matchesYear && matchesCategory && matchesSearch;
  }).sort((a, b) => (b.archivedDate || b.writtenDate || "").localeCompare(a.archivedDate || a.writtenDate || ""));

  const paginatedFiles = filteredFiles.slice(
    (currentFilePage - 1) * PAGE_SIZE,
    currentFilePage * PAGE_SIZE
  );

  // Filtered Volume Data with Left-Tree Dynamic Matching
  const filteredVolumes = volumeList.filter((item) => {
    const matchesFolder =
      selectedFolder === '全部目录' || item.folderName === selectedFolder;

    const matchesYear =
      selectedYear === '全部年份' || item.year.toString() === selectedYear.replace('年', '');

    const cleanCategory = selectedCategory.replace(/（.*）/, '');
    const matchesCategory =
      selectedCategory === '全部分类' ||
      item.className.includes(cleanCategory) ||
      cleanCategory.includes(item.className);

    const matchesSearch =
      !titleSearch ||
      item.title.toLowerCase().includes(titleSearch.toLowerCase()) ||
      item.refCode.toLowerCase().includes(titleSearch.toLowerCase()) ||
      item.orgUnit.toLowerCase().includes(titleSearch.toLowerCase());

    return matchesFolder && matchesYear && matchesCategory && matchesSearch;
  }).sort((a, b) => (b.archivedDate || b.dateRange || "").localeCompare(a.archivedDate || a.dateRange || ""));

  const paginatedVolumes = filteredVolumes.slice(
    (currentVolumePage - 1) * PAGE_SIZE,
    currentVolumePage * PAGE_SIZE
  );

  const toggleSelectFile = (id: string) => {
    setSelectedFileIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectVolume = (id: string) => {
    setSelectedVolumeIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const hasActiveFilters =
    selectedFolder !== '全部目录' ||
    selectedYear !== '全部年份' ||
    selectedCategory !== '全部分类' ||
    titleSearch !== '';

  return (
    <div className="flex flex-col lg:flex-row gap-5 animate-in fade-in duration-300">
      {/* Hidden Native File Selector */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleNativeFileUpload}
        multiple
        className="hidden"
        accept=".pdf,.ofd,.docx,.xlsx,.doc,.xls,.png,.jpg,.zip"
      />

      {/* LEFT SIDEBAR PANELS */}
      <div className="w-full lg:w-64 space-y-4 shrink-0">
        {/* Panel 1: 档案目录树 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>档案目录树</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">0110全宗</span>
          </div>

          <div className="space-y-1 text-xs font-mono">
            {/* Root Org Node */}
            <button
              onClick={() => handleResetFilters()}
              className={`w-full flex items-center gap-1.5 text-left py-1.5 px-2 rounded transition-colors ${
                selectedFolder === '全部目录'
                  ? 'bg-blue-600 text-white font-bold'
                  : 'text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className={`w-4 h-4 ${selectedFolder === '全部目录' ? 'text-white' : 'text-amber-500'}`} />
              <span className="truncate">成都市住房和城乡建设局</span>
            </button>

            {/* Folder Tree Items */}
            <div className="pl-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pt-1">
              {[
                { name: '文书档案', years: ['2026年', '2025年'] },
                { name: '会计档案', years: ['2026年'] },
                { name: '基建工程档案', years: ['2026年', '2016年'] },
                { name: '设备设施档案', years: ['2026年', '2016年'] },
                { name: '照片图音档案', years: ['2025年'] },
                { name: '声像电子档案', years: ['2026年', '2025年'] },
                { name: '实物荣誉档案', years: ['2025年'] },
              ].map((cat) => {
                const isSelectedFolder = selectedFolder === cat.name;
                return (
                  <div key={cat.name} className="space-y-0.5">
                    <button
                      onClick={() => handleSelectFolder(cat.name)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
                        isSelectedFolder
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border-l-2 border-blue-600'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 truncate">
                        <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 text-slate-400 transition-transform ${isSelectedFolder ? 'rotate-90' : ''}`} />
                    </button>

                    {/* Sub-years */}
                    {isSelectedFolder && (
                      <div className="pl-5 space-y-0.5 border-l border-blue-200 dark:border-blue-900 ml-2 py-0.5">
                        {cat.years.map((y) => {
                          const isSelectedYear = selectedYear === y;
                          return (
                            <button
                              key={y}
                              onClick={() => handleSelectFolder(cat.name, y)}
                              className={`w-full flex items-center gap-1.5 py-1 px-2 text-[11px] rounded transition-colors text-left ${
                                isSelectedYear
                                  ? 'bg-blue-600 text-white font-bold'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100'
                              }`}
                            >
                              <File className="w-3 h-3 shrink-0" />
                              <span>{y}</span>
                            </button>
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

        {/* Panel 2: 分类表 */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>分类表</span>
            </h3>
          </div>

          <div className="space-y-1 text-xs font-mono">
            {[
              '全部分类',
              '党群工作（党务信息）',
              '行政管理（公文发文）',
              '经营管理（招投标卷）',
              '生产技术管理（技术文件）',
              '财务审计（会计凭证）',
              '人力资源管理（社保名册）',
            ].map((cls) => {
              const isSelected = selectedCategory === cls;
              return (
                <button
                  key={cls}
                  onClick={() => handleSelectCategory(cls)}
                  className={`w-full text-left px-2 py-1.5 rounded transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {cls}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RIGHT MAIN WORKSPACE: Dual Tabs & Enhanced Table */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Dynamic Filter Banner indicator */}
        {hasActiveFilters && (
          <div className="p-3 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 flex items-center justify-between gap-2 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>右侧列表动态联动中:</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 font-semibold">
                目录: {selectedFolder} {selectedYear !== '全部年份' ? `(${selectedYear})` : ''}
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 font-semibold">
                分类: {selectedCategory}
              </span>
              <span className="text-slate-500">
                (匹配到 {activeTab === 'files' ? filteredFiles.length : filteredVolumes.length} 条记录)
              </span>
            </div>

            <button
              onClick={handleResetFilters}
              className="px-2.5 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置筛选</span>
            </button>
          </div>
        )}

        {/* Main Header Tabs */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-200 dark:border-slate-800 pb-2 sm:pb-0">
            <button
              onClick={() => setActiveTab('files')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'files'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              文件列表 ({filteredFiles.length})
            </button>
            <button
              onClick={() => setActiveTab('volumes')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'volumes'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              案卷列表 ({filteredVolumes.length})
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono">
            已勾选: <span className="font-bold text-blue-600">{activeTab === 'files' ? selectedFileIds.length : selectedVolumeIds.length} 项</span>
          </div>
        </div>

        {/* Action Toolbar for Active Tab with FULL ACTION MODALS */}
        {activeTab === 'files' ? (
          /* 文件列表 Toolbar */
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenAddFile}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加文件</span>
              </button>
              <button
                onClick={() => setModalType('submit')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>提交文件</span>
              </button>
              <button
                onClick={handleOpenCopy}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>复制</span>
              </button>
              <button
                onClick={handleOpenEdit}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>编辑</span>
              </button>
              <button
                onClick={() => setModalType('delete_confirm')}
                className="px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 text-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>
              <button
                onClick={() => setModalType('export_selected')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors"
              >
                导出选中
              </button>
              <button
                onClick={() => setModalType('export_all')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors"
              >
                导出全部
              </button>
              <button
                onClick={() => setModalType('print')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印</span>
              </button>
              <button
                onClick={() => setModalType('four_testing')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>四性检测</span>
              </button>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索文件题名/档号/文号..."
                value={titleSearch}
                onChange={(e) => {
                  setTitleSearch(e.target.value);
                  setCurrentFilePage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
            </div>
          </div>
        ) : (
          /* 案卷列表 Toolbar */
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleOpenAddVolume}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加案卷</span>
              </button>
              <button
                onClick={() => setModalType('submit')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" />
                <span>提交案卷</span>
              </button>
              <button
                onClick={handleOpenEdit}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>编辑</span>
              </button>
              <button
                onClick={() => {
                  setVolumeList(volumeList.filter((v) => !selectedVolumeIds.includes(v.id)));
                  setSelectedVolumeIds([]);
                  onShowMessage(`已移除选中的案卷项`);
                }}
                className="px-2.5 py-1.5 rounded-lg border border-red-200 dark:border-red-900 text-red-600 hover:bg-red-50 text-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>
              <button
                onClick={() => setModalType('merge')}
                className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <Combine className="w-3.5 h-3.5" />
                <span>合并</span>
              </button>
              <button
                onClick={() => setModalType('split')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>打散</span>
              </button>
              <button
                onClick={() => onShowMessage('已调起打印机，开始打印案卷脊背与卷内备考表')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印</span>
              </button>
            </div>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索案卷题名/档号..."
                value={titleSearch}
                onChange={(e) => {
                  setTitleSearch(e.target.value);
                  setCurrentVolumePage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* DATA TABLE SECTION: 文件/案卷 列表 */}
        {activeTab === 'files' ? (
          /* 文件列表 Table */
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-x-auto">
            {paginatedFiles.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <File className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs">未找到匹配的在档文件记录</p>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  清除左侧目录/分类筛选
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-medium">
                    <th className="py-3 px-3 w-10 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedFileIds.length === paginatedFiles.length && paginatedFiles.length > 0}
                        onChange={() => {
                          if (selectedFileIds.length === paginatedFiles.length) setSelectedFileIds([]);
                          else setSelectedFileIds(paginatedFiles.map((d) => d.id));
                        }}
                        className="rounded border-slate-300"
                      />
                    </th>
                    <th className="py-3 px-3 w-12 text-center whitespace-nowrap">序号</th>
                    <th className="py-3 px-3 min-w-[96px] text-center whitespace-nowrap">档案状态</th>
                    <th className="py-3 px-3 min-w-[120px] whitespace-nowrap">档案来源</th>
                    <th className="py-3 px-3 min-w-[240px]">文件题名</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">全宗号</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">年度</th>
                    <th className="py-3 px-3 min-w-[170px] whitespace-nowrap">档号</th>
                    <th className="py-3 px-3 min-w-[140px] whitespace-nowrap">文号</th>
                    <th className="py-3 px-3 min-w-[150px]">责任者</th>
                    <th className="py-3 px-3 w-24 whitespace-nowrap">成文日期</th>
                    <th className="py-3 px-3 w-16 whitespace-nowrap">密级</th>
                    <th className="py-3 px-3 w-20 whitespace-nowrap">保管期限</th>
                    <th className="py-3 px-3 min-w-[120px] whitespace-nowrap">归档单位</th>
                    <th className="py-3 px-3 w-24 whitespace-nowrap">归档日期</th>
                    <th className="py-3 px-3 min-w-[90px] text-right whitespace-nowrap sticky right-0 bg-slate-50 dark:bg-slate-850">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {paginatedFiles.map((item, index) => {
                    const isSelected = selectedFileIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors ${
                          isSelected ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectFile(item.id)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-400 whitespace-nowrap">
                          {(currentFilePage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="py-3 px-3 text-center font-sans whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 text-[10px] font-bold inline-block whitespace-nowrap">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.source}
                        </td>
                        <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                          <button
                            onClick={() => onSelectRecord(item)}
                            className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                          >
                            {item.title}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.fondsNo}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.year}
                        </td>
                        <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {item.refCode}
                        </td>
                        <td className="py-3 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.docNo}
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300">
                          {item.author}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{item.writtenDate}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold whitespace-nowrap">
                            {item.securityLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">{item.retention}</td>
                        <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.unit}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{item.archivedDate}</td>
                        <td className="py-3 px-3 text-right font-sans whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900">
                          <button
                            onClick={() => onSelectRecord(item)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-bold text-[11px] underline whitespace-nowrap inline-block shrink-0"
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        ) : (
          /* 案卷列表 Table */
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-x-auto">
            {paginatedVolumes.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Folder className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-700" />
                <p className="text-xs">未找到匹配的在档案卷记录</p>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline"
                >
                  清除左侧目录/分类筛选
                </button>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-medium">
                    <th className="py-3 px-3 w-10 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedVolumeIds.length === paginatedVolumes.length && paginatedVolumes.length > 0}
                        onChange={() => {
                          if (selectedVolumeIds.length === paginatedVolumes.length) setSelectedVolumeIds([]);
                          else setSelectedVolumeIds(paginatedVolumes.map((d) => d.id));
                        }}
                        className="rounded border-slate-300"
                      />
                    </th>
                    <th className="py-3 px-3 w-12 text-center whitespace-nowrap">序号</th>
                    <th className="py-3 px-3 min-w-[96px] text-center whitespace-nowrap">档案状态</th>
                    <th className="py-3 px-3 min-w-[120px] whitespace-nowrap">档案来源</th>
                    <th className="py-3 px-3 min-w-[240px]">案卷题名</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">全宗号</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">年度</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">案卷号</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">卷内序号</th>
                    <th className="py-3 px-3 min-w-[170px] whitespace-nowrap">档号</th>
                    <th className="py-3 px-3 min-w-[170px] whitespace-nowrap">起止日期</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">总页数</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">文件件数</th>
                    <th className="py-3 px-3 min-w-[150px]">编制单位</th>
                    <th className="py-3 px-3 w-24 whitespace-nowrap">编制日期</th>
                    <th className="py-3 px-3 min-w-[140px]">责任者</th>
                    <th className="py-3 px-3 w-24 whitespace-nowrap">成文日期</th>
                    <th className="py-3 px-3 w-16 whitespace-nowrap">密级</th>
                    <th className="py-3 px-3 w-20 whitespace-nowrap">保管期限</th>
                    <th className="py-3 px-3 min-w-[120px] whitespace-nowrap">归档单位</th>
                    <th className="py-3 px-3 w-24 whitespace-nowrap">归档日期</th>
                    <th className="py-3 px-3 min-w-[90px] text-right whitespace-nowrap sticky right-0 bg-slate-50 dark:bg-slate-850">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {paginatedVolumes.map((item, index) => {
                    const isSelected = selectedVolumeIds.includes(item.id);
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors ${
                          isSelected ? 'bg-blue-50/60 dark:bg-blue-950/40' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelectVolume(item.id)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-400 whitespace-nowrap">
                          {(currentVolumePage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="py-3 px-3 text-center font-sans whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[10px] font-bold inline-block whitespace-nowrap">
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.source}
                        </td>
                        <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                          <button
                            onClick={() => onSelectRecord(item)}
                            className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                          >
                            {item.title}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.fondsNo}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.year}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-blue-600 whitespace-nowrap">
                          {item.volumeNo}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.itemIndex}
                        </td>
                        <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {item.refCode}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{item.dateRange}</td>
                        <td className="py-3 px-3 text-center font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.pageCount}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-indigo-600 whitespace-nowrap">
                          {item.fileCount}
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300">
                          {item.orgUnit}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{item.prepDate}</td>
                        <td className="py-3 px-3 font-sans text-slate-700 dark:text-slate-300">
                          {item.author}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{item.writtenDate}</td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold whitespace-nowrap">
                            {item.securityLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">{item.retention}</td>
                        <td className="py-3 px-3 font-sans text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {item.unit}
                        </td>
                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{item.archivedDate}</td>
                        <td className="py-3 px-3 text-right font-sans whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900">
                          <button
                            onClick={() => onSelectRecord(item)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-bold text-[11px] underline whitespace-nowrap inline-block shrink-0"
                          >
                            查看详情
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PAGINATION BAR */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
          <Pagination
            currentPage={activeTab === 'files' ? currentFilePage : currentVolumePage}
            totalItems={activeTab === 'files' ? filteredFiles.length : filteredVolumes.length}
            pageSize={PAGE_SIZE}
            onPageChange={(page) => {
              if (activeTab === 'files') setCurrentFilePage(page);
              else setCurrentVolumePage(page);
            }}
          />
        </div>
      </div>

      {/* ================= MODAL DIALOGS FOR BUTTON ACTIONS ================= */}

      {/* 1. 添加文件弹窗 */}
      {modalType === 'add_file' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>档案管理 - 文件信息录入与电子原件关联</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SECTION 1: 文件信息 */}
            <div className="space-y-3.5">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-l-4 border-blue-600 pl-2">
                文件信息
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    全宗号:
                  </label>
                  <input
                    type="text"
                    value={formFondsNo}
                    onChange={(e) => setFormFondsNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    年度:
                  </label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono cursor-pointer"
                  >
                    <option value="2026">2026年</option>
                    <option value="2025">2025年</option>
                    <option value="2024">2024年</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    分类:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans cursor-pointer"
                  >
                    <option value="行政管理">行政管理</option>
                    <option value="党群工作">党群工作</option>
                    <option value="生产技术管理">生产技术管理</option>
                    <option value="经营管理">经营管理</option>
                    <option value="财务审计">财务审计</option>
                    <option value="人力资源管理">人力资源管理</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    盒号:
                  </label>
                  <input
                    type="text"
                    value={formBoxNo}
                    onChange={(e) => setFormBoxNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    件号:
                  </label>
                  <input
                    type="text"
                    value={formItemNo}
                    onChange={(e) => setFormItemNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    档号:
                  </label>
                  <input
                    type="text"
                    value={formRefCode}
                    onChange={(e) => setFormRefCode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-blue-600 font-semibold"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    题名:
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans font-semibold text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    文号:
                  </label>
                  <input
                    type="text"
                    value={formDocNo}
                    onChange={(e) => setFormDocNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    责任者:
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    成文日期:
                  </label>
                  <input
                    type="date"
                    value={formWrittenDate}
                    onChange={(e) => setFormWrittenDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    保管期限:
                  </label>
                  <select
                    value={formRetention}
                    onChange={(e) => setFormRetention(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans cursor-pointer"
                  >
                    <option value="永久">永久</option>
                    <option value="30年">30年</option>
                    <option value="10年">10年</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    密级:
                  </label>
                  <select
                    value={formSecurity}
                    onChange={(e) => setFormSecurity(e.target.value as any)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans cursor-pointer"
                  >
                    <option value="公开">公开</option>
                    <option value="内部">内部</option>
                    <option value="秘密">秘密</option>
                    <option value="机密">机密</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    页数:
                  </label>
                  <input
                    type="text"
                    value={formPageCount}
                    onChange={(e) => setFormPageCount(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    归档单位:
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    归档日期:
                  </label>
                  <input
                    type="date"
                    value={formArchivedDate}
                    onChange={(e) => setFormArchivedDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    库房位置:
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    备注:
                  </label>
                  <input
                    type="text"
                    value={formRemark}
                    onChange={(e) => setFormRemark(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: 电子文件信息 */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-l-4 border-blue-600 pl-2">
                    电子文件信息
                  </h4>
                  <span className="text-xs text-slate-400 font-normal">支持拖拽排序与实时上传</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={triggerFileUpload}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>上传</span>
                  </button>

                  <button
                    onClick={() => onShowMessage(`已成功批量打包下载当前 ${fileAttachments.length} 份电子原件附件`)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>批量下载</span>
                  </button>

                  <button
                    onClick={() => onShowMessage('已保存电子文件附件拖拽排序结果')}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>保存排序</span>
                  </button>
                </div>
              </div>

              {/* Attachments Table */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-xs">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-medium">
                      <th className="py-2.5 px-3 w-12 text-center">序号</th>
                      <th className="py-2.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={fileAttachments.length > 0 && fileAttachments.every((a) => a.checked)}
                          onChange={() => {
                            const allChecked = fileAttachments.every((a) => a.checked);
                            setFileAttachments(fileAttachments.map((a) => ({ ...a, checked: !allChecked })));
                          }}
                          className="rounded border-slate-300"
                        />
                      </th>
                      <th className="py-2.5 px-3 min-w-[220px]">文件名称</th>
                      <th className="py-2.5 px-3 w-24 text-center">文件类型</th>
                      <th className="py-2.5 px-3 w-24 text-center">文件大小</th>
                      <th className="py-2.5 px-3 text-right min-w-[140px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {fileAttachments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400">
                          <div
                            onClick={triggerFileUpload}
                            className="cursor-pointer border-2 border-dashed border-blue-200 dark:border-blue-900 rounded-xl p-5 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-colors inline-block w-full max-w-md mx-auto space-y-1"
                          >
                            <Upload className="w-7 h-7 text-blue-600 dark:text-blue-400 mx-auto mb-1 animate-bounce" />
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                              点击此处直接选择本地电子文件上传
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono">
                              支持 .pdf, .ofd, .docx, .xlsx 等归档原件
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      fileAttachments.map((att, idx) => (
                        <tr key={att.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors">
                          <td className="py-2.5 px-3 text-center font-bold text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={att.checked}
                              onChange={() => {
                                setFileAttachments(
                                  fileAttachments.map((a) => (a.id === att.id ? { ...a, checked: !a.checked } : a))
                                );
                              }}
                              className="rounded border-slate-300"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                            {att.name}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-blue-600 dark:text-blue-400 font-bold">
                            {att.type}
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500">{att.size}</td>
                          <td className="py-2.5 px-3 text-right font-sans">
                            <div className="flex items-center justify-end gap-2.5">
                              <button
                                onClick={() => onShowMessage(`开始浏览与预览附件 [${att.name}]`)}
                                className="text-blue-600 dark:text-blue-400 hover:underline font-bold text-[11px]"
                              >
                                预览
                              </button>
                              <button
                                onClick={() =>
                                  setFileAttachments(fileAttachments.filter((a) => a.id !== att.id))
                                }
                                className="text-red-500 hover:underline font-bold text-[11px]"
                              >
                                删除
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleSaveAddFile}
                className="px-8 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors"
              >
                确定
              </button>
              <button
                onClick={() => setModalType(null)}
                className="px-8 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 添加案卷弹窗 */}
      {modalType === 'add_volume' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                添加案卷
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                案卷信息
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    全宗号:
                  </label>
                  <input
                    type="text"
                    value={formFondsNo}
                    onChange={(e) => setFormFondsNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    年度:
                  </label>
                  <select
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono cursor-pointer"
                  >
                    <option value="">请选择</option>
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    案卷档号:
                  </label>
                  <input
                    type="text"
                    value={formRefCode}
                    onChange={(e) => setFormRefCode(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    案卷号:
                  </label>
                  <input
                    type="text"
                    value={formVolumeNo}
                    onChange={(e) => setFormVolumeNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    分类:
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans cursor-pointer"
                  >
                    <option value="">请选择</option>
                    <option value="行政管理">行政管理</option>
                    <option value="党群工作">党群工作</option>
                    <option value="生产技术管理">生产技术管理</option>
                    <option value="经营管理">经营管理</option>
                    <option value="财务审计">财务审计</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    分类号:
                  </label>
                  <input
                    type="text"
                    value={formClassNo}
                    onChange={(e) => setFormClassNo(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    案卷题名:
                  </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    保管期限:
                  </label>
                  <select
                    value={formRetention}
                    onChange={(e) => setFormRetention(e.target.value as any)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans cursor-pointer"
                  >
                    <option value="">请选择</option>
                    <option value="永久">永久</option>
                    <option value="30年">30年</option>
                    <option value="10年">10年</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    密级:
                  </label>
                  <select
                    value={formSecurity}
                    onChange={(e) => setFormSecurity(e.target.value as any)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans cursor-pointer"
                  >
                    <option value="">请选择</option>
                    <option value="公开">公开</option>
                    <option value="内部">内部</option>
                    <option value="秘密">秘密</option>
                    <option value="机密">机密</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    总页数:
                  </label>
                  <input
                    type="text"
                    value={formPageCount}
                    onChange={(e) => setFormPageCount(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    文件件数:
                  </label>
                  <input
                    type="text"
                    value={formFileCount}
                    onChange={(e) => setFormFileCount(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    编制单位:
                  </label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => setFormAuthor(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    编制日期:
                  </label>
                  <input
                    type="date"
                    value={formWrittenDate}
                    onChange={(e) => setFormWrittenDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    归档单位:
                  </label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    归档日期:
                  </label>
                  <input
                    type="date"
                    value={formArchivedDate}
                    onChange={(e) => setFormArchivedDate(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    库房位置:
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
                  />
                </div>

                <div className="md:col-span-3">
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    备注:
                  </label>
                  <input
                    type="text"
                    value={formRemark}
                    onChange={(e) => setFormRemark(e.target.value)}
                    className="w-full p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handleSaveAddVolume}
                className="px-6 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs shadow-xs transition-colors"
              >
                确定
              </button>
              <button
                onClick={() => setModalType(null)}
                className="px-6 py-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 提交文件/提交案卷弹窗 */}
      {modalType === 'submit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-blue-600">
              <Send className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认提交在档审核？
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              您当前已选中{' '}
              <span className="font-bold text-blue-600">
                {activeTab === 'files' ? selectedFileIds.length : selectedVolumeIds.length}
              </span>{' '}
              项档案。提交后将触发自动四性深度质检与归档封包。
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage(`已成功提交 ${activeTab === 'files' ? selectedFileIds.length : selectedVolumeIds.length} 项档案至预立卷系统！`);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 删除确认弹窗 */}
      {modalType === 'delete_confirm' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认移除档案数据？
              </h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              该操作将从库房列表中移除选中的档案元数据记录，移除后可在回收站恢复。
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'files') {
                    setFileList(fileList.filter((f) => !selectedFileIds.includes(f.id)));
                    setSelectedFileIds([]);
                  } else {
                    setVolumeList(volumeList.filter((v) => !selectedVolumeIds.includes(v.id)));
                    setSelectedVolumeIds([]);
                  }
                  setModalType(null);
                  onShowMessage(`已成功删除选中的档案记录`);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 复制弹窗 */}
      {modalType === 'copy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Copy className="w-5 h-5 text-blue-600" />
              <span>复制档案记录</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  新文件题名:
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleSaveCopy}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                生成副本
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. 编辑弹窗 */}
      {modalType === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-blue-600" />
              <span>编辑档案属性元数据</span>
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  题名:
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                />
              </div>
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  责任者:
                </label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage(`已保存修改后的档案信息`);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                保存更新
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 7. 导出与打印弹窗 */}
      {(modalType === 'export_selected' || modalType === 'export_all' || modalType === 'print' || modalType === 'four_testing' || modalType === 'merge' || modalType === 'split') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {modalType === 'export_selected' && '导出选中档案包 (EEP/Excel)'}
              {modalType === 'export_all' && '导出全量符合条件的档案目录'}
              {modalType === 'print' && '调起档案脊背与卷内目录打印机'}
              {modalType === 'four_testing' && '手动触发深度四性检测校验'}
              {modalType === 'merge' && '合并案卷项'}
              {modalType === 'split' && '打散案卷结构'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              系统已准备就绪，点击确定后将执行对应的后台任务并下载/打印凭证。
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage(`操作成功！已完成对应的处理流程。`);
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                确认执行
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
