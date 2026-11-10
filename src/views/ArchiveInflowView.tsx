import React, { useState } from 'react';
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
  ArrowRight,
  RotateCcw,
  X,
  Upload,
  Check,
  Send,
  AlertCircle,
  FileCode,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

interface ArchiveInflowViewProps {
  onSelectRecord: (record: any) => void;
  onShowMessage: (msg: string) => void;
}

// 1. 文件列表数据项接口
export interface InflowFileItem {
  id: string;
  status: '收集中' | '待提交' | '已提交' | '已审查';
  source: 'OA归档文件' | '电子文件登记' | '接口采集' | '离线EEP包';
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

// 2. 案卷列表数据项接口
export interface InflowVolumeItem {
  id: string;
  status: '收集中' | '组卷完成' | '已提交';
  source: 'OA归档文件' | '电子文件登记' | '工程审批系统' | '接口采集';
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

const initialFileListData: InflowFileItem[] = [
  {
    id: 'f-01',
    status: '收集中',
    source: 'OA归档文件',
    title: '关于成立成都市就业工作领导小组的通知',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0001',
    docNo: '成办发〔2026〕001号',
    author: '成都市人民政府办公室',
    writtenDate: '2026-11-03',
    securityLevel: '机密',
    retention: '永久',
    unit: '市政府办公室',
    archivedDate: '2026-11-04',
    folderName: '文书档案',
    className: '行政管理',
  },
  {
    id: 'f-02',
    status: '收集中',
    source: 'OA归档文件',
    title: '成都市住房和城乡建设局关于2026年建筑工程竣工归档范围的规定',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-BS·2026-Y-BGS-0002',
    docNo: '成住建发〔2026〕18号',
    author: '成都市住房和城乡建设局',
    writtenDate: '2026-11-02',
    securityLevel: '秘密',
    retention: '30年',
    unit: '档案馆',
    archivedDate: '2026-11-03',
    folderName: '文书档案',
    className: '生产技术管理',
  },
  {
    id: 'f-03',
    status: '收集中',
    source: 'OA归档文件',
    title: '关于印发2026年重点促进就业与企业扶持政策实施细则的通知',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-WS·2026-Y-BGS-0003',
    docNo: '成人社发〔2026〕25号',
    author: '成都市人力资源和社会保障局',
    writtenDate: '2026-11-01',
    securityLevel: '秘密',
    retention: '30年',
    unit: '人社局办公室',
    archivedDate: '2026-11-02',
    folderName: '文书档案',
    className: '人力资源管理',
  },
  {
    id: 'f-04',
    status: '收集中',
    source: '电子文件登记',
    title: '成都市“十四五”数字政府建设与政务档案数字孪生规划纲要',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-QE·2026-Y-BGS-0004',
    docNo: '成发改发〔2026〕42号',
    author: '成都市发展和改革委员会',
    writtenDate: '2026-11-05',
    securityLevel: '内部',
    retention: '永久',
    unit: '市发改委档案室',
    archivedDate: '2026-11-01',
    folderName: '声像电子档案',
    className: '生产技术管理',
  },
  {
    id: 'f-05',
    status: '收集中',
    source: '电子文件登记',
    title: '关于下达2026年全域电子会计凭证与电子归档资金预算的通知',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-TE·2026-Y-BGS-0005',
    docNo: '成财预〔2026〕89号',
    author: '成都市财政局',
    writtenDate: '2026-11-05',
    securityLevel: '秘密',
    retention: '30年',
    unit: '财政局档案室',
    archivedDate: '2026-11-05',
    folderName: '会计档案',
    className: '财务审计',
  },
  {
    id: 'f-06',
    status: '待提交',
    source: '接口采集',
    title: '成都市智能网联汽车高精度地图数据安全与归档管理办法',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-JT·2026-Y-BGS-0006',
    docNo: '成交发〔2026〕31号',
    author: '成都市交通运输局',
    writtenDate: '2026-11-05',
    securityLevel: '机密',
    retention: '30年',
    unit: '交通局信息中心',
    archivedDate: '2026-11-05',
    folderName: '设备设施档案',
    className: '生产技术管理',
  },
  {
    id: 'f-07',
    status: '待提交',
    source: '接口采集',
    title: '成都市中心城区国土空间规划地下管线数字化档案汇编',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-CW·2026-Y-BGS-0007',
    docNo: '成资规划〔2026〕56号',
    author: '成都市规划和自然资源局',
    writtenDate: '2026-11-05',
    securityLevel: '秘密',
    retention: '永久',
    unit: '资规局档案馆',
    archivedDate: '2026-11-05',
    folderName: '基建工程档案',
    className: '经营管理',
  },
  {
    id: 'f-08',
    status: '已提交',
    source: '离线EEP包',
    title: '成都市防汛抗旱指挥部2026年主汛期水利设施巡检归档汇总表',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-YB·2026-Y-BGS-0008',
    docNo: '成水函〔2026〕12号',
    author: '成都市水务局',
    writtenDate: '2026-11-05',
    securityLevel: '公开',
    retention: '10年',
    unit: '水务局办公室',
    archivedDate: '2026-11-05',
    folderName: '设备设施档案',
    className: '行政管理',
  },
  {
    id: 'f-09',
    status: '已提交',
    source: '离线EEP包',
    title: '2026年第三季度全市重点排污单位碳排放核查与备案档案',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-GD·2026-Y-BGS-0009',
    docNo: '成环备〔2026〕78号',
    author: '成都市生态环境局',
    writtenDate: '2026-11-04',
    securityLevel: '公开',
    retention: '30年',
    unit: '环境局档案室',
    archivedDate: '2026-11-05',
    folderName: '声像电子档案',
    className: '党群工作',
  },
  {
    id: 'f-10',
    status: '已审查',
    source: 'OA归档文件',
    title: '关于开展全市知识产权质押融资登记档案规范化建设的通知',
    fondsNo: '0110',
    year: 2026,
    refCode: '0110-KJ·2026-Y-BGS-0010',
    docNo: '成市监发〔2026〕64号',
    author: '成都市市场监督管理局',
    writtenDate: '2026-11-04',
    securityLevel: '公开',
    retention: '永久',
    unit: '市监局办公室',
    archivedDate: '2026-11-04',
    folderName: '文书档案',
    className: '经营管理',
  },
  {
    id: 'f-11',
    status: '已审查',
    source: 'OA归档文件',
    title: '成都市2025年度住建系统先进个人表彰照片及光盘记录',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-ZP·2025-Y-BGS-0005',
    docNo: '成住建表〔2025〕09号',
    author: '成都市住房和城乡建设局',
    writtenDate: '2026-11-05',
    securityLevel: '公开',
    retention: '永久',
    unit: '局办公室',
    archivedDate: '2026-11-05',
    folderName: '照片图音档案',
    className: '党群工作',
  },
  {
    id: 'f-12',
    status: '已审查',
    source: '接口采集',
    title: '成都市住房和城乡建设局荣获全国住房公积金示范窗口实体奖牌清册',
    fondsNo: '0110',
    year: 2025,
    refCode: '0110-SW·2025-Y-BGS-0001',
    docNo: '成住建奖〔2025〕02号',
    author: '成都市住房和城乡建设局',
    writtenDate: '2026-11-02',
    securityLevel: '公开',
    retention: '永久',
    unit: '荣誉陈列室',
    archivedDate: '2026-11-03',
    folderName: '实物荣誉档案',
    className: '行政管理',
  },
];

// Expanded to 12 items for full 10/page display
const initialVolumeListData: InflowVolumeItem[] = [
  {
    id: 'v-01',
    status: '收集中',
    source: 'OA归档文件',
    title: '成都市住房和城乡建设局2026年首批重点工程竣工验收案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 1,
    refCode: '0110-WS·2026-Y-BGS-0001',
    dateRange: '2026-11-01 - 2026-11-05',
    pageCount: 111,
    fileCount: 12,
    orgUnit: '成都市住房和城乡建设局',
    prepDate: '2026-11-03',
    author: '市住建局办公室',
    writtenDate: '2026-11-02',
    securityLevel: '机密',
    retention: '永久',
    unit: '档案管理中心',
    archivedDate: '2026-11-04',
    folderName: '文书档案',
    className: '行政管理',
  },
  {
    id: 'v-02',
    status: '收集中',
    source: 'OA归档文件',
    title: '2026年全域保障性住房建设资金清算与补贴发放案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 2,
    refCode: '0110-WS·2026-Y-BGS-0002',
    dateRange: '2026-11-02 - 2026-11-04',
    pageCount: 145,
    fileCount: 11,
    orgUnit: '成都市住房和城乡建设局',
    prepDate: '2026-11-03',
    author: '住房保障处',
    writtenDate: '2026-11-02',
    securityLevel: '秘密',
    retention: '30年',
    unit: '档案管理中心',
    archivedDate: '2026-11-04',
    folderName: '会计档案',
    className: '财务审计',
  },
  {
    id: 'v-03',
    status: '收集中',
    source: 'OA归档文件',
    title: '成都市人力资源和社会保障局2026年高校毕业生稳岗就业案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 3,
    refCode: '0110-WS·2026-Y-BGS-0003',
    dateRange: '2026-11-01 - 2026-11-04',
    pageCount: 98,
    fileCount: 14,
    orgUnit: '成都市人力资源和社会保障局',
    prepDate: '2026-11-03',
    author: '就业促进处',
    writtenDate: '2026-11-02',
    securityLevel: '秘密',
    retention: '30年',
    unit: '人社局档案室',
    archivedDate: '2026-11-04',
    folderName: '文书档案',
    className: '人力资源管理',
  },
  {
    id: 'v-04',
    status: '收集中',
    source: '电子文件登记',
    title: '成都市“十四五”数字政务与智算中心基础设施建设卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 4,
    refCode: '0110-WS·2026-Y-BGS-0004',
    dateRange: '2026-11-05 - 2026-11-04',
    pageCount: 220,
    fileCount: 15,
    orgUnit: '成都市发展和改革委员会',
    prepDate: '2026-11-03',
    author: '高技术产业处',
    writtenDate: '2026-11-01',
    securityLevel: '机密',
    retention: '永久',
    unit: '发改委档案馆',
    archivedDate: '2026-11-04',
    folderName: '基建工程档案',
    className: '生产技术管理',
  },
  {
    id: 'v-05',
    status: '组卷完成',
    source: '电子文件登记',
    title: '2026年市级财政电子会计凭证与预算直达审计案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '001',
    itemIndex: 5,
    refCode: '0110-WS·2026-Y-BGS-0005',
    dateRange: '2026-11-01 - 2026-11-03',
    pageCount: 180,
    fileCount: 18,
    orgUnit: '成都市财政局',
    prepDate: '2026-11-02',
    author: '预算处',
    writtenDate: '2026-11-01',
    securityLevel: '秘密',
    retention: '30年',
    unit: '财政局档案室',
    archivedDate: '2026-11-03',
    folderName: '会计档案',
    className: '财务审计',
  },
  {
    id: 'v-06',
    status: '组卷完成',
    source: '工程审批系统',
    title: '成都市智能网联汽车测试场及路侧数字设施竣工测量卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '002',
    itemIndex: 1,
    refCode: '0110-WS·2026-Y-BGS-0006',
    dateRange: '2026-11-01 - 2026-11-03',
    pageCount: 160,
    fileCount: 10,
    orgUnit: '成都市交通运输局',
    prepDate: '2026-11-02',
    author: '公路处',
    writtenDate: '2026-11-05',
    securityLevel: '机密',
    retention: '30年',
    unit: '交通局档案馆',
    archivedDate: '2026-11-03',
    folderName: '设备设施档案',
    className: '生产技术管理',
  },
  {
    id: 'v-07',
    status: '已提交',
    source: '工程审批系统',
    title: '中心城区地下综合管廊管线探查及防篡改三维模型案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '002',
    itemIndex: 2,
    refCode: '0110-WS·2026-Y-BGS-0007',
    dateRange: '2026-11-01 - 2026-11-02',
    pageCount: 240,
    fileCount: 16,
    orgUnit: '成都市规划和自然资源局',
    prepDate: '2026-11-02',
    author: '测绘管理处',
    writtenDate: '2026-11-02',
    securityLevel: '秘密',
    retention: '永久',
    unit: '资规局档案室',
    archivedDate: '2026-11-03',
    folderName: '基建工程档案',
    className: '经营管理',
  },
  {
    id: 'v-08',
    status: '已提交',
    source: 'OA归档文件',
    title: '2026年市水务局主汛期重点水库安全责任人履职案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '002',
    itemIndex: 3,
    refCode: '0110-WS·2026-Y-BGS-0008',
    dateRange: '2026-11-01 - 2026-11-01',
    pageCount: 90,
    fileCount: 9,
    orgUnit: '成都市水务局',
    prepDate: '2026-11-02',
    author: '水管处',
    writtenDate: '2026-11-05',
    securityLevel: '公开',
    retention: '10年',
    unit: '水务局档案室',
    archivedDate: '2026-11-03',
    folderName: '设备设施档案',
    className: '行政管理',
  },
  {
    id: 'v-09',
    status: '组卷完成',
    source: 'OA归档文件',
    title: '2026年第三季度成都市重点排污企业碳核算与评估案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '002',
    itemIndex: 4,
    refCode: '0110-GD·2026-Y-BGS-0009',
    dateRange: '2026-11-01 - 2026-11-01',
    pageCount: 130,
    fileCount: 13,
    orgUnit: '成都市生态环境局',
    prepDate: '2026-11-01',
    author: '大气监测处',
    writtenDate: '2026-11-04',
    securityLevel: '公开',
    retention: '30年',
    unit: '环境局档案室',
    archivedDate: '2026-11-02',
    folderName: '声像电子档案',
    className: '党群工作',
  },
  {
    id: 'v-10',
    status: '已提交',
    source: '工程审批系统',
    title: '2026年全市知识产权质押融资与商标保护登记案卷',
    fondsNo: '0110',
    year: 2026,
    volumeNo: '003',
    itemIndex: 1,
    refCode: '0110-KJ·2026-Y-BGS-0010',
    dateRange: '2026-11-02 - 2026-11-05',
    pageCount: 110,
    fileCount: 12,
    orgUnit: '成都市市场监督管理局',
    prepDate: '2026-11-01',
    author: '知识产权保护处',
    writtenDate: '2026-11-03',
    securityLevel: '公开',
    retention: '永久',
    unit: '市监局档案馆',
    archivedDate: '2026-11-02',
    folderName: '文书档案',
    className: '经营管理',
  },
  {
    id: 'v-11',
    status: '组卷完成',
    source: 'OA归档文件',
    title: '2025年成都市住建局重大基建工程验收及声像视频资料卷',
    fondsNo: '0110',
    year: 2025,
    volumeNo: '003',
    itemIndex: 2,
    refCode: '0110-SX·2025-Y-BGS-0002',
    dateRange: '2026-11-01 - 2026-11-03',
    pageCount: 160,
    fileCount: 10,
    orgUnit: '成都市住房和城乡建设局',
    prepDate: '2026-11-03',
    author: '基建处',
    writtenDate: '2026-11-05',
    securityLevel: '机密',
    retention: '30年',
    unit: '档案馆',
    archivedDate: '2026-11-04',
    folderName: '声像电子档案',
    className: '经营管理',
  },
  {
    id: 'v-12',
    status: '已提交',
    source: '接口采集',
    title: '成都市住房和城乡建设局荣获全国住房公积金示范窗口案卷',
    fondsNo: '0110',
    year: 2025,
    volumeNo: '003',
    itemIndex: 3,
    refCode: '0110-SW·2025-Y-BGS-0003',
    dateRange: '2026-11-01 - 2026-11-03',
    pageCount: 85,
    fileCount: 6,
    orgUnit: '成都市住房和城乡建设局',
    prepDate: '2026-11-04',
    author: '局办公室',
    writtenDate: '2026-11-02',
    securityLevel: '公开',
    retention: '永久',
    unit: '荣誉陈列室',
    archivedDate: '2026-11-04',
    folderName: '实物荣誉档案',
    className: '行政管理',
  },
];

export const ArchiveInflowView: React.FC<ArchiveInflowViewProps> = ({
  onSelectRecord,
  onShowMessage,
}) => {
  // Tabs: 'files' (文件列表) vs 'volumes' (案卷列表)
  const [activeTab, setActiveTab] = useState<'files' | 'volumes'>('files');

  // Main Datasets
  const [fileList, setFileList] = useState<InflowFileItem[]>(initialFileListData);
  const [volumeList, setVolumeList] = useState<InflowVolumeItem[]>(initialVolumeListData);

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
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Modal Form Inputs matching image_df9360f4.png & image_09cc0a30.png
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
      const newFile: InflowFileItem = {
        id: `f-${Date.now()}`,
        status: '收集中',
        source: 'OA归档文件',
        title: formTitle || '副本电子文件',
        fondsNo: '0110',
        year: 2026,
        refCode: `0110-WS·2026-Y-BGS-00${fileList.length + 1}`,
        docNo: formDocNo || '成办复〔2026〕001号',
        author: formAuthor || '成都市人民政府办公室',
        writtenDate: '2026-11-04',
        securityLevel: (formSecurity as any) || '秘密',
        retention: (formRetention as any) || '30年',
        unit: '局档案馆',
        archivedDate: '2026-11-04',
        folderName: selectedFolder !== '全部目录' ? selectedFolder : '文书档案',
        className: '行政管理',
      };
      setFileList([newFile, ...fileList]);
    }
    setModalType(null);
    onShowMessage(`已成功复制并生成新的档案元数据记录`);
  };

  // Open Add Volume Modal (cleared input fields as requested)
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
    const newFile: InflowFileItem = {
      id: `f-${Date.now()}`,
      status: '收集中',
      source: '电子文件登记',
      title: formTitle || '新建归档电子文件',
      fondsNo: formFondsNo || '0110',
      year: parseInt(formYear) || 2026,
      refCode: formRefCode || `0110-WS·2026-Y-BGS-00${fileList.length + 1}`,
      docNo: formDocNo || '成住建发〔2026〕99号',
      author: formAuthor || '成都市住房和城乡建设局',
      writtenDate: formWrittenDate || '2026-11-04',
      securityLevel: (formSecurity as any) || '公开',
      retention: (formRetention as any) || '30年',
      unit: formUnit || '局档案馆',
      archivedDate: formArchivedDate || '2026-11-04',
      folderName: selectedFolder !== '全部目录' ? selectedFolder : '文书档案',
      className: formCategory || '行政管理',
    };
    setFileList([newFile, ...fileList]);
    setModalType(null);
    onShowMessage(`已新建并成功添加电子文件 [${newFile.title}]，已同步填报元数据`);
  };

  // Submit Add Volume
  const handleSaveAddVolume = () => {
    const newVol: InflowVolumeItem = {
      id: `v-${Date.now()}`,
      status: '收集中',
      source: '工程审批系统',
      title: formTitle || '新建工程组卷案卷',
      fondsNo: formFondsNo || '0110',
      year: parseInt(formYear) || 2026,
      volumeNo: formVolumeNo || '001',
      itemIndex: volumeList.length + 1,
      refCode: formRefCode || `0110-WS·2026-Y-BGS-00${volumeList.length + 1}`,
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
    onShowMessage(`成功立卷组卷案卷 [${newVol.title}]`);
  };

  // Open Edit Modal with selected record or explicitly passed item
  const handleOpenEdit = (specificItem?: any) => {
    // Safely check if specificItem is a data record object rather than a React SyntheticEvent
    let target = (specificItem && typeof specificItem === 'object' && 'id' in specificItem && !('nativeEvent' in specificItem) && !('target' in specificItem))
      ? specificItem
      : undefined;

    if (!target) {
      if (activeTab === 'files') {
        if (selectedFileIds.length === 0) {
          onShowMessage('请先在列表中勾选要编辑的文件');
          return;
        }
        const lastSelectedId = selectedFileIds[selectedFileIds.length - 1];
        target = fileList.find((f) => f.id === lastSelectedId) || fileList.find((f) => selectedFileIds.includes(f.id));
      } else {
        if (selectedVolumeIds.length === 0) {
          onShowMessage('请先在列表中勾选要编辑的案卷');
          return;
        }
        const lastSelectedId = selectedVolumeIds[selectedVolumeIds.length - 1];
        target = volumeList.find((v) => v.id === lastSelectedId) || volumeList.find((v) => selectedVolumeIds.includes(v.id));
      }
    }

    if (target) {
      setEditingItemId(target.id);
      setFormFondsNo(target.fondsNo || '0110');
      setFormYear(target.year ? String(target.year) : '2026');
      setFormCategory(target.category || target.className || target.folderName || '行政管理');
      setFormRefCode(target.refCode || target.archiveNo || '');
      setFormTitle(target.title || '');
      setFormDocNo('docNo' in target ? (target.docNo || '') : (target.volumeNo || ''));
      setFormAuthor(target.author || target.orgUnit || '');
      setFormWrittenDate(target.writtenDate || target.prepDate || '2026-11-05');
      setFormRetention(target.retention || '30年');
      setFormSecurity(target.securityLevel || '公开');
      setFormPageCount(target.pageCount ? String(target.pageCount) : (target.totalPages ? String(target.totalPages) : '1'));
      setFormFileCount(target.fileCount ? String(target.fileCount) : '1');
      setFormUnit(target.unit || target.orgUnit || '档案管理中心');
      setFormArchivedDate(target.archivedDate || '2026-11-05');
      setFormRemark(target.remark || '');
      setModalType('edit');
    } else {
      onShowMessage('未找到要编辑的档案记录');
    }
  };

  const handleSaveEdit = () => {
    if (!formTitle.trim()) {
      onShowMessage('请输入题名');
      return;
    }
    if (activeTab === 'files') {
      setFileList((prev) =>
        prev.map((f) => {
          if (f.id === editingItemId) {
            return {
              ...f,
              title: formTitle.trim(),
              docNo: formDocNo.trim() || f.docNo,
              author: formAuthor.trim() || f.author,
              securityLevel: (formSecurity as any) || f.securityLevel,
              retention: (formRetention as any) || f.retention,
              fondsNo: formFondsNo || f.fondsNo,
              year: Number(formYear) || f.year,
              writtenDate: formWrittenDate || f.writtenDate,
              unit: formUnit || f.unit,
              refCode: formRefCode || f.refCode,
            };
          }
          return f;
        })
      );
      onShowMessage(`已成功保存编辑的文件 [${formTitle.trim()}]`);
    } else {
      setVolumeList((prev) =>
        prev.map((v) => {
          if (v.id === editingItemId) {
            return {
              ...v,
              title: formTitle.trim(),
              volumeNo: formDocNo.trim() || v.volumeNo,
              author: formAuthor.trim() || v.author,
              securityLevel: (formSecurity as any) || v.securityLevel,
              retention: (formRetention as any) || v.retention,
              fondsNo: formFondsNo || v.fondsNo,
              year: Number(formYear) || v.year,
              writtenDate: formWrittenDate || v.writtenDate,
              unit: formUnit || v.unit,
              refCode: formRefCode || v.refCode,
              pageCount: Number(formPageCount) || v.pageCount,
              fileCount: Number(formFileCount) || v.fileCount,
            };
          }
          return v;
        })
      );
      onShowMessage(`已成功保存编辑的案卷 [${formTitle.trim()}]`);
    }
    setModalType(null);
    setEditingItemId(null);
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
    onShowMessage('已重置所有左侧筛选条件，显示全量档案数据');
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
                { name: '基建工程档案', years: ['2026年'] },
                { name: '设备设施档案', years: ['2026年'] },
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
                onClick={() => handleOpenEdit()}
                disabled={selectedFileIds.length === 0}
                title={selectedFileIds.length === 0 ? "请先在列表中勾选要编辑的数据" : "编辑选中的文件数据"}
                className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                  selectedFileIds.length === 0
                    ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 bg-slate-100/50 dark:bg-slate-800/30 cursor-not-allowed opacity-60'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-xs font-semibold'
                }`}
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
                onClick={() => handleOpenEdit()}
                disabled={selectedVolumeIds.length === 0}
                title={selectedVolumeIds.length === 0 ? "请先在列表中勾选要编辑的数据" : "编辑选中的案卷数据"}
                className={`px-2.5 py-1.5 rounded-lg border text-xs transition-all flex items-center gap-1 ${
                  selectedVolumeIds.length === 0
                    ? 'border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600 bg-slate-100/50 dark:bg-slate-800/30 cursor-not-allowed opacity-60'
                    : 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shadow-xs font-semibold'
                }`}
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
                <span className="w-4 h-4 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              </button>
              <button
                onClick={() => setModalType('split')}
                className="px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-700 border border-amber-200 dark:border-amber-800 text-xs font-semibold flex items-center gap-1.5"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>打散</span>
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center">
                  2
                </span>
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
                <p className="text-xs">未找到匹配的档案文件记录</p>
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
                    <th className="py-3 px-3 min-w-[84px] text-center whitespace-nowrap">档案状态</th>
                    <th className="py-3 px-3 min-w-[100px] whitespace-nowrap">档案来源</th>
                    <th className="py-3 px-3 min-w-[220px]">文件题名</th>
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
                        <td className="py-3 px-3 text-right font-sans whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-bold text-[11px] underline whitespace-nowrap inline-block shrink-0"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => onSelectRecord(item)}
                            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 font-bold text-[11px] underline whitespace-nowrap inline-block shrink-0"
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
                <p className="text-xs">未找到匹配的案卷记录</p>
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
                    <th className="py-3 px-3 min-w-[84px] text-center whitespace-nowrap">档案状态</th>
                    <th className="py-3 px-3 min-w-[100px] whitespace-nowrap">档案来源</th>
                    <th className="py-3 px-3 min-w-[220px]">案卷题名</th>
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
                        <td className="py-3 px-3 text-right font-sans whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900 flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-bold text-[11px] underline whitespace-nowrap inline-block shrink-0"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => onSelectRecord(item)}
                            className="text-slate-600 hover:text-slate-800 dark:text-slate-400 font-bold text-[11px] underline whitespace-nowrap inline-block shrink-0"
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

      {/* 1. 添加文件弹窗 (根据 image_df9360f4.png 还原) */}
      {modalType === 'add_file' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <span>文件信息录入与电子文件归集</span>
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
                {/* Line 1 */}
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

                {/* Line 2 */}
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

                {/* Line 3 (Full Width Title) */}
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

                {/* Line 4 */}
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

                {/* Line 5 */}
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

                {/* Line 6 */}
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

                {/* Line 7 (Full Width Remark) */}
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

            {/* SECTION 2: 电子文件信息 支持拖拽排序 */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-l-4 border-blue-600 pl-2">
                    电子文件信息
                  </h4>
                  <span className="text-xs text-slate-400 font-normal">支持拖拽排序</span>
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
                    onClick={() => onShowMessage(`已成功批量打包下载当前 ${fileAttachments.length} 份电子附件`)}
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
                              onClick={() => onShowMessage(`正在预览电子原件 [${att.name}] (OFD/A-1板式)`)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-semibold"
                            >
                              浏览
                            </button>
                            <button
                              onClick={() => onShowMessage(`开始下载电子文件 [${att.name}]`)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-semibold"
                            >
                              下载
                            </button>
                            <button
                              onClick={() => {
                                setFileAttachments(fileAttachments.filter((a) => a.id !== att.id));
                                onShowMessage(`已移除附件 [${att.name}]`);
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 text-xs font-medium"
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

            {/* Bottom Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalType(null)}
                className="px-5 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleSaveAddFile}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                保存文件
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 编辑文件/案卷 弹窗 */}
      {modalType === 'edit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>{activeTab === 'files' ? '编辑文件元数据与条目' : '编辑案卷元数据与条目'}</span>
              </h3>
              <button
                onClick={() => {
                  setModalType(null);
                  setEditingItemId(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected item status banner */}
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs text-blue-900 dark:text-blue-200">
              <div className="flex items-center gap-2 font-mono">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <span>已同步选中数据 (条目ID: <strong>{editingItemId}</strong>)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-sans text-[11px] font-bold">
                修改实时生效
              </span>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    placeholder="如 2026"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    分类:
                  </label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="如 行政管理 / 生产技术管理"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    档号 / 拟定档号:
                  </label>
                  <input
                    type="text"
                    value={formRefCode}
                    onChange={(e) => setFormRefCode(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono text-blue-600 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    {activeTab === 'files' ? '文号:' : '案卷号:'}
                  </label>
                  <input
                    type="text"
                    value={formDocNo}
                    onChange={(e) => setFormDocNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  <span className="text-rose-500 mr-1">*</span>{activeTab === 'files' ? '文件题名:' : '案卷题名:'}
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="请输入题名..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans font-semibold text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    责任者 / 编制单位:
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
                    成文日期 / 起止日期:
                  </label>
                  <input
                    type="text"
                    value={formWrittenDate}
                    onChange={(e) => setFormWrittenDate(e.target.value)}
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    密级:
                  </label>
                  <select
                    value={formSecurity}
                    onChange={(e) => setFormSecurity(e.target.value)}
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
                    保管期限:
                  </label>
                  <select
                    value={formRetention}
                    onChange={(e) => setFormRetention(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans cursor-pointer"
                  >
                    <option value="10年">10年</option>
                    <option value="30年">30年</option>
                    <option value="永久">永久</option>
                  </select>
                </div>
              </div>

              {activeTab === 'volumes' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      总页数:
                    </label>
                    <input
                      type="number"
                      value={formPageCount}
                      onChange={(e) => setFormPageCount(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                      文件件数:
                    </label>
                    <input
                      type="number"
                      value={formFileCount}
                      onChange={(e) => setFormFileCount(e.target.value)}
                      className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setModalType(null);
                  setEditingItemId(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 添加案卷弹窗 matching image_09cc0a30.png */}
      {modalType === 'add_volume' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">添加案卷</h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[85vh] overflow-y-auto">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">案卷信息</h4>

              <div className="space-y-4 text-xs font-sans">
                {/* Row 1: 全宗号, 年度, 案卷档号 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">全宗号:</label>
                    <input
                      type="text"
                      value={formFondsNo}
                      onChange={(e) => setFormFondsNo(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">年度:</label>
                    <select
                      value={formYear}
                      onChange={(e) => setFormYear(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="2026">2026</option>
                      <option value="2025">2025</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">案卷档号:</label>
                    <input
                      type="text"
                      value={formRefCode}
                      onChange={(e) => setFormRefCode(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 2: 案卷号, 分类, 分类号 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">案卷号:</label>
                    <input
                      type="text"
                      value={formVolumeNo}
                      onChange={(e) => setFormVolumeNo(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">分类:</label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="行政管理">行政文书</option>
                      <option value="财务审计">财务管理</option>
                      <option value="生产技术管理">工程档案</option>
                      <option value="人力资源管理">人事档案</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">分类号:</label>
                    <input
                      type="text"
                      value={formClassNo}
                      onChange={(e) => setFormClassNo(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 3: 案卷题名 */}
                <div className="flex items-center gap-2">
                  <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">案卷题名:</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Row 4: 保管期限, 密级, 总页数 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">保管期限:</label>
                    <select
                      value={formRetention}
                      onChange={(e) => setFormRetention(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="永久">永久</option>
                      <option value="30年">30年</option>
                      <option value="10年">10年</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">密级:</label>
                    <select
                      value={formSecurity}
                      onChange={(e) => setFormSecurity(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    >
                      <option value="">请选择</option>
                      <option value="公开">公开</option>
                      <option value="内部">内部</option>
                      <option value="秘密">秘密</option>
                      <option value="机密">机密</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">总页数:</label>
                    <input
                      type="text"
                      value={formPageCount}
                      onChange={(e) => setFormPageCount(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 5: 文件件数, 编制单位, 编制日期 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">文件件数:</label>
                    <input
                      type="text"
                      value={formFileCount}
                      onChange={(e) => setFormFileCount(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">编制单位:</label>
                    <input
                      type="text"
                      value={formAuthor}
                      onChange={(e) => setFormAuthor(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">编制日期:</label>
                    <input
                      type="date"
                      value={formWrittenDate}
                      onChange={(e) => setFormWrittenDate(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 6: 归档单位, 归档日期, 库房位置 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">归档单位:</label>
                    <input
                      type="text"
                      value={formUnit}
                      onChange={(e) => setFormUnit(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">归档日期:</label>
                    <input
                      type="date"
                      value={formArchivedDate}
                      onChange={(e) => setFormArchivedDate(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">库房位置:</label>
                    <input
                      type="text"
                      value={formLocation}
                      onChange={(e) => setFormLocation(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Row 7: 备注 */}
                <div className="flex items-center gap-2">
                  <label className="w-20 text-right text-slate-700 dark:text-slate-300 shrink-0 font-medium">备注:</label>
                  <input
                    type="text"
                    value={formRemark}
                    onChange={(e) => setFormRemark(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action Buttons Centered */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={handleSaveAddVolume}
                  className="px-6 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
                >
                  确定
                </button>
                <button
                  onClick={() => setModalType(null)}
                  className="px-6 py-1.5 rounded border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. 提交审核弹窗 */}
      {modalType === 'submit' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-600" />
                <span>提交收集归档审查</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              确定要将选中的 <strong className="text-blue-600 font-bold">{activeTab === 'files' ? selectedFileIds.length || 1 : selectedVolumeIds.length || 1}</strong> 项记录提交至档案管理员进行归档四性与终审？
            </p>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 font-mono space-y-1">
              <div>审查节点: 成都市住建局档案馆三员审计</div>
              <div>预计复核响应时间: 1 个工作日内</div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-medium"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage('提交审查请求成功，状态已更改为 [已提交]');
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 四性检测报告弹窗 */}
      {modalType === 'four_testing' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>电子档案“四性”合规检测报告</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-emerald-900 dark:text-emerald-300">检测结论: 合格 (100分)</div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">符合 GB/T 39362-2020 电子档案四性检测规范</div>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white font-sans">1. 真实性检测 (100分)</div>
                <p className="text-[11px] text-slate-500">国密 SM3 杂交散列哈希校验无篡改，时间戳证书有效。</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white font-sans">2. 完整性检测 (100分)</div>
                <p className="text-[11px] text-slate-500">归档元数据 42 项要素完整，OFD 关联文件无缺失。</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white font-sans">3. 可用性检测 (100分)</div>
                <p className="text-[11px] text-slate-500">OFD 版式符合国家通用阅读引擎，可跨平台长久查阅。</p>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white font-sans">4. 安全性检测 (100分)</div>
                <p className="text-[11px] text-slate-500">病毒木马扫描 0 风险，具备国密硬件秘钥防护。</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                下载四性报告 (.pdf)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 合并案卷弹窗 */}
      {modalType === 'merge' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Combine className="w-4 h-4 text-indigo-600" />
                <span>案卷合卷处理</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              将所选的 2 份分册案卷重组合并为同一主案卷，卷内文件件数将自动按形成时间连续编号。
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setModalType(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">取消</button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage('案卷合并成功，已重新生成卷内备考表');
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold"
              >
                确认合并
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. 打散案卷弹窗 */}
      {modalType === 'split' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-4 h-4 text-amber-600" />
                <span>案卷打散解组</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
              确定要将选中的案卷打散拆解为单件档案文件并转入文件列表中？
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button onClick={() => setModalType(null)} className="px-4 py-2 rounded-lg border border-slate-300 text-xs">取消</button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage('案卷拆解打散完成，解组文件已退回文件列表');
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                确认打散
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
