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
  Send,
  AlertCircle,
  Hash,
  Sparkles,
  FileCode,
  Check,
  Tag,
  Clock,
  Eye,
  CornerUpLeft,
  Archive,
  Upload,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';
import { ModalDetail } from '../components/ModalDetail';

interface InflowOrganizeViewProps {
  onSelectRecord?: (record: any) => void;
  onShowMessage: (msg: string) => void;
}

// 1. 文件列表数据项接口
export interface OrganizeFileItem {
  id: string;
  status: '整编中' | '已编件号' | '已退回' | '已归档';
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
export interface OrganizeVolumeItem {
  id: string;
  status: '整编中' | '已归档' | '已编目';
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

const generate100OrganizeFiles = (): OrganizeFileItem[] => {
  const folders = ['文书档案', '会计档案', '基建档案', '设备档案', '照片档案', '声像档案', '实物档案'];
  const categories = ['行政管理', '党群工作', '生产技术管理', '经营管理', '财务审计', '人力资源管理'];
  const depts = [
    '成都市人民政府办公室',
    '成都市住房和城乡建设局',
    '成都市人力资源和社会保障局',
    '成都市发展和改革委员会',
    '成都市财政局',
    '成都市交通运输局',
    '成都市规划和自然资源局',
    '成都市水务局',
    '成都市生态环境局',
    '成都市市场监督管理局',
  ];
  const statuses: ('整编中' | '已编件号' | '已退回' | '已归档')[] = ['整编中', '已编件号', '已退回', '已归档'];
  const sources: ('OA归档文件' | '电子文件登记' | '接口采集' | '离线EEP包')[] = ['OA归档文件', '电子文件登记', '接口采集', '离线EEP包'];
  const securities: ('公开' | '内部' | '秘密' | '机密')[] = ['公开', '内部', '秘密', '机密'];
  const retentions: ('永久' | '30年' | '10年')[] = ['永久', '30年', '10年'];

  const topics = [
    '关于成立成都市就业工作领导小组的通知',
    '成都市住房和城乡建设局关于2026年建筑工程竣工归档范围的规定',
    '关于印发重点促进就业与企业扶持政策实施细则的通知',
    '成都市“十四五”数字政府建设与政务档案数字孪生规划纲要',
    '关于下达全域电子会计凭证与电子归档资金预算的通知',
    '成都市智能网联汽车高精度地图数据安全与归档管理办法',
    '成都市中心城区国土空间规划地下管线数字化档案汇编',
    '成都市防汛抗旱指挥部主汛期水利设施巡检归档汇总表',
    '第三季度全市重点排污单位碳排放核查与备案档案',
    '关于开展全市知识产权质押融资登记档案规范化建设的通知',
    '成都市机关事务管理局公车电子化派车与里程核算档案',
    '成都市教育局关于深化数字校园建设与电子学籍档案归档通知',
    '成都市卫生健康委员会医疗机构电子病历与归档安全抽检表',
    '成都市农业农村局高标准农田建设工程竣工归档卷',
    '成都市商务局关于开展内外贸一体化发展专项资金审计清册',
    '成都市文化广电旅游局关于古籍与历史档案数字化保护方案',
    '成都市应急管理局应急物资储备库房数字化设备运行档案',
    '成都市退役军人事务局安置清册与优抚资金电子凭证归档',
    '成都市统计局关于半年度全市GDP核算原始电子表格',
    '成都市地方金融监督管理局金融风险防范预警月度归档汇总',
  ];

  const list: OrganizeFileItem[] = [];

  for (let i = 0; i < 100; i++) {
    const pageNum = Math.floor(i / 10) + 1; // 1..10
    const isRecent = pageNum <= 5; // 前5页 (1-50): 近3个月 (2026-11-02 ~ 2026-11-05)

    let writtenDate: string;
    let archivedDate: string;

    if (isRecent) {
      // Pages 1 to 5: 近3个月 (2026-11-02 to 2026-11-05)
      const daysOffset = Math.floor((i / 49) * 82);
      const d = new Date(2026, 10, 5); // 2026-11-05
      d.setDate(d.getDate() - daysOffset);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      writtenDate = `${yyyy}-${mm}-${dd}`;

      const dArch = new Date(d);
      dArch.setDate(dArch.getDate() + 1);
      const mmA = String(dArch.getMonth() + 1).padStart(2, '0');
      const ddA = String(dArch.getDate()).padStart(2, '0');
      archivedDate = `${dArch.getFullYear()}-${mmA}-${ddA}`;
    } else {
      // Pages 6 to 10: 前3个月 (2026-11-01 to 2026-11-02)
      const stepIdx = i - 50;
      const daysOffset = Math.floor((stepIdx / 49) * 105);
      const d = new Date(2026, 7, 14); // 2026-11-02
      d.setDate(d.getDate() - daysOffset);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      writtenDate = `${yyyy}-${mm}-${dd}`;

      const dArch = new Date(d);
      dArch.setDate(dArch.getDate() + 1);
      const mmA = String(dArch.getMonth() + 1).padStart(2, '0');
      const ddA = String(dArch.getDate()).padStart(2, '0');
      archivedDate = `${dArch.getFullYear()}-${mmA}-${ddA}`;
    }

    const topicBase = topics[i % topics.length];
    const dept = depts[i % depts.length];
    const folder = folders[i % folders.length];
    const cat = categories[i % categories.length];
    const status = statuses[i % statuses.length];
    const source = sources[i % sources.length];
    const sec = securities[i % securities.length];
    const ret = retentions[i % retentions.length];
    const itemNum = String(i + 1).padStart(4, '0');

    list.push({
      id: `org-f-${String(i + 1).padStart(3, '0')}`,
      status,
      source,
      title: `${topicBase} (整编件号${i + 1})`,
      fondsNo: '0110',
      year: 2026,
      refCode: `0110-WS·2026-Y-BGS-${itemNum}`,
      docNo: `成住建整发〔2026〕${100 + i}号`,
      author: dept,
      writtenDate,
      securityLevel: sec,
      retention: ret,
      unit: dept.includes('局') ? dept : '局档案馆',
      archivedDate,
      folderName: folder,
      className: cat,
    });
  }

  return list;
};

const generate100OrganizeVolumes = (): OrganizeVolumeItem[] => {
  const folders = ['文书档案', '会计档案', '基建档案', '设备档案', '照片档案', '声像档案', '实物档案'];
  const categories = ['行政管理', '党群工作', '生产技术管理', '经营管理', '财务审计', '人力资源管理'];
  const depts = [
    '成都市住房和城乡建设局',
    '成都市人力资源和社会保障局',
    '成都市发展和改革委员会',
    '成都市财政局',
    '成都市交通运输局',
    '成都市规划和自然资源局',
    '成都市水务局',
    '成都市生态环境局',
    '成都市市场监督管理局',
    '成都市人民政府办公室',
  ];
  const statuses: ('整编中' | '已归档' | '已编目')[] = ['整编中', '已编目', '已归档'];
  const sources: ('OA归档文件' | '电子文件登记' | '工程审批系统' | '接口采集')[] = ['OA归档文件', '电子文件登记', '工程审批系统', '接口采集'];
  const securities: ('公开' | '内部' | '秘密' | '机密')[] = ['公开', '内部', '秘密', '机密'];
  const retentions: ('永久' | '30年' | '10年')[] = ['永久', '30年', '10年'];

  const volTopics = [
    '重点工程竣工验收与综合测绘整编案卷',
    '全域保障性住房建设资金清算与补贴发放整编案卷',
    '高校毕业生稳岗就业与技能培训专项整编案卷',
    '“十四五”数字政务与智算中心基础设施建设卷',
    '市级财政电子会计凭证与预算直达审计案卷',
    '智能网联汽车测试场及路侧数字设施竣工测量卷',
    '中心城区地下综合管廊管线探查三维模型案卷',
    '主汛期重点水库安全责任人履职与巡检案卷',
    '重点排污企业碳核算与评估监测案卷',
    '全市知识产权质押融资与商标保护登记案卷',
    '轨道交通新线工程全周期质量监管案卷',
    '城市绿道与公园城市建设专项督查案卷',
  ];

  const list: OrganizeVolumeItem[] = [];

  for (let i = 0; i < 100; i++) {
    const pageNum = Math.floor(i / 10) + 1; // 1..10
    const isRecent = pageNum <= 5; // 前5页: 近3个月; 后5页: 前3个月

    let writtenDate: string;
    let archivedDate: string;
    let dateRange: string;

    if (isRecent) {
      // Pages 1 to 5: 近3个月 (2026-11-02 to 2026-11-05)
      const daysOffset = Math.floor((i / 49) * 82);
      const dEnd = new Date(2026, 10, 5);
      dEnd.setDate(dEnd.getDate() - daysOffset);

      const dStart = new Date(dEnd);
      dStart.setDate(dStart.getDate() - 14);

      const y1 = dStart.getFullYear();
      const m1 = String(dStart.getMonth() + 1).padStart(2, '0');
      const d1Str = String(dStart.getDate()).padStart(2, '0');

      const y2 = dEnd.getFullYear();
      const m2 = String(dEnd.getMonth() + 1).padStart(2, '0');
      const d2Str = String(dEnd.getDate()).padStart(2, '0');

      writtenDate = `${y2}-${m2}-${d2Str}`;
      archivedDate = `${y2}-${m2}-${d2Str}`;
      dateRange = `${y1}-${m1}-${d1Str} - ${y2}-${m2}-${d2Str}`;
    } else {
      // Pages 6 to 10: 前3个月 (2026-11-01 to 2026-11-02)
      const stepIdx = i - 50;
      const daysOffset = Math.floor((stepIdx / 49) * 105);
      const dEnd = new Date(2026, 7, 14);
      dEnd.setDate(dEnd.getDate() - daysOffset);

      const dStart = new Date(dEnd);
      dStart.setDate(dStart.getDate() - 14);

      const y1 = dStart.getFullYear();
      const m1 = String(dStart.getMonth() + 1).padStart(2, '0');
      const d1Str = String(dStart.getDate()).padStart(2, '0');

      const y2 = dEnd.getFullYear();
      const m2 = String(dEnd.getMonth() + 1).padStart(2, '0');
      const d2Str = String(dEnd.getDate()).padStart(2, '0');

      writtenDate = `${y2}-${m2}-${d2Str}`;
      archivedDate = `${y2}-${m2}-${d2Str}`;
      dateRange = `${y1}-${m1}-${d1Str} - ${y2}-${m2}-${d2Str}`;
    }

    const topicBase = volTopics[i % volTopics.length];
    const dept = depts[i % depts.length];
    const folder = folders[i % folders.length];
    const cat = categories[i % categories.length];
    const status = statuses[i % statuses.length];
    const source = sources[i % sources.length];
    const sec = securities[i % securities.length];
    const ret = retentions[i % retentions.length];
    const itemNum = String(i + 1).padStart(4, '0');
    const volNo = String(Math.floor(i / 3) + 1).padStart(3, '0');

    list.push({
      id: `org-v-${String(i + 1).padStart(3, '0')}`,
      status,
      source,
      title: `${dept}${topicBase} (整编第${i + 1}卷)`,
      fondsNo: '0110',
      year: 2026,
      volumeNo: volNo,
      itemIndex: (i % 5) + 1,
      refCode: `0110-WS·2026-Y-BGS-${itemNum}`,
      dateRange,
      pageCount: 90 + (i % 40) * 3,
      fileCount: 8 + (i % 12),
      orgUnit: dept,
      prepDate: writtenDate,
      author: dept,
      writtenDate,
      securityLevel: sec,
      retention: ret,
      unit: '局档案馆',
      archivedDate,
      folderName: folder,
      className: cat,
    });
  }

  return list;
};

const initialFileListData: OrganizeFileItem[] = generate100OrganizeFiles();
const initialVolumeListData: OrganizeVolumeItem[] = generate100OrganizeVolumes();

export const InflowOrganizeView: React.FC<InflowOrganizeViewProps> = ({
  onSelectRecord,
  onShowMessage,
}) => {
  // Tabs: 'files' (文件列表) vs 'volumes' (案卷列表)
  const [activeTab, setActiveTab] = useState<'files' | 'volumes'>('files');

  // Datasets
  const [fileList, setFileList] = useState<OrganizeFileItem[]>(initialFileListData);
  const [volumeList, setVolumeList] = useState<OrganizeVolumeItem[]>(initialVolumeListData);

  // Search & Pagination
  const [titleSearch, setTitleSearch] = useState('');
  const [currentFilePage, setCurrentFilePage] = useState(1);
  const [currentVolumePage, setCurrentVolumePage] = useState(1);
  const PAGE_SIZE = 10;

  // Left Tree Filter State
  const [selectedFolder, setSelectedFolder] = useState<string>('全部目录');
  const [selectedYear, setSelectedYear] = useState<string>('全部年份');
  const [selectedCategory, setSelectedCategory] = useState<string>('全部分类');

  // Checkbox Selections
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [selectedVolumeIds, setSelectedVolumeIds] = useState<string[]>([]);

  // Action Modals & Detail Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [activeRecordForDetail, setActiveRecordForDetail] = useState<any>(null);

  const [modalType, setModalType] = useState<
    | 'add_file'
    | 'archive_file'
    | 'encode_no'
    | 'send_back'
    | 'edit_file'
    | 'four_testing'
    | 'add_volume'
    | 'archive_volume'
    | 'merge'
    | 'split'
    | null
  >(null);

  // Modal Form State matching image_df9360f4.png & image_09cc0a30.png
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
  const [rejectReason, setRejectReason] = useState('元数据不完整，缺乏签章章印');

  // Electronic attachments list inside Add File modal
  const [fileAttachments, setFileAttachments] = useState<
    Array<{ id: string; name: string; type: string; size: string; checked: boolean }>
  >([]);

  // Hidden native file input ref for real local file uploads
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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

    if (!formTitle && files.length > 0) {
      const firstName = files[0].name;
      const baseTitle = firstName.substring(0, firstName.lastIndexOf('.')) || firstName;
      setFormTitle(baseTitle);
    }

    onShowMessage(`已成功真实选择并导入 ${files.length} 个本地电子原件文件！`);
    e.target.value = '';
  };

  // Tree Selection Handlers
  const handleSelectFolder = (folderName: string, year?: string) => {
    setSelectedFolder(folderName);
    if (year) {
      setSelectedYear(year);
    } else {
      setSelectedYear('全部年份');
    }
    setCurrentFilePage(1);
    setCurrentVolumePage(1);
    onShowMessage(`已选择目录 [${folderName}${year ? ' - ' + year : ''}]，右侧列表已同步过滤`);
  };

  const handleSelectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
    setCurrentFilePage(1);
    setCurrentVolumePage(1);
    onShowMessage(`已选择分类 [${categoryName}]，右侧列表已同步过滤`);
  };

  const handleResetFilters = () => {
    setSelectedFolder('全部目录');
    setSelectedYear('全部年份');
    setSelectedCategory('全部分类');
    setTitleSearch('');
    setCurrentFilePage(1);
    setCurrentVolumePage(1);
    onShowMessage('已重置所有筛选条件，展示全部档案数据');
  };

  // Open Detail Modal
  const handleOpenDetail = (record: any) => {
    if (onSelectRecord) {
      onSelectRecord(record);
    } else {
      setActiveRecordForDetail(record);
      setDetailModalOpen(true);
    }
  };

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

  // Save Add File
  const handleSaveAddFile = () => {
    const newFile: OrganizeFileItem = {
      id: `org-f-${Date.now()}`,
      status: '整编中',
      source: '电子文件登记',
      title: formTitle || '新建整编归档文件',
      fondsNo: formFondsNo || '0110',
      year: parseInt(formYear) || 2026,
      refCode: formRefCode || `0110-WS·2026-Y-BGS-00${fileList.length + 1}`,
      docNo: formDocNo || '成住建发〔2026〕88号',
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
    onShowMessage(`成功新增整编文件 [${newFile.title}]`);
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

  // Save Add Volume
  const handleSaveAddVolume = () => {
    const newVol: OrganizeVolumeItem = {
      id: `org-v-${Date.now()}`,
      status: '整编中',
      source: '工程审批系统',
      title: formTitle || '新建整编工程案卷',
      fondsNo: formFondsNo || '0110',
      year: parseInt(formYear) || 2026,
      volumeNo: formVolumeNo || '001',
      itemIndex: volumeList.length + 1,
      refCode: formRefCode || `0110-WS·2026-Y-BGS-00${volumeList.length + 1}`,
      dateRange: `${formWrittenDate || '2026-11-01'} - ${formArchivedDate || '2026-11-05'}`,
      pageCount: parseInt(formPageCount) || 160,
      fileCount: parseInt(formFileCount) || 10,
      orgUnit: formAuthor || '成都市住房和城乡建设局',
      prepDate: formWrittenDate || '2026-11-05',
      author: formAuthor || '市住建局质监站',
      writtenDate: formWrittenDate || '2026-11-05',
      securityLevel: (formSecurity as any) || '公开',
      retention: (formRetention as any) || '30年',
      unit: formUnit || '档案管理中心',
      archivedDate: formArchivedDate || '2026-11-05',
      folderName: selectedFolder !== '全部目录' ? selectedFolder : '基建档案',
      className: formCategory || '生产技术管理',
    };
    setVolumeList([newVol, ...volumeList]);
    setModalType(null);
    onShowMessage(`成功新建整编案卷 [${newVol.title}]`);
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
      setModalType('edit_file');
    }
  };

  // Save Edit Modal
  const handleSaveEdit = () => {
    if (activeTab === 'files') {
      const targetId = selectedFileIds[0] || fileList[0]?.id;
      setFileList((prev) =>
        prev.map((f) =>
          f.id === targetId
            ? {
                ...f,
                title: formTitle,
                docNo: formDocNo,
                author: formAuthor,
                securityLevel: (formSecurity as any) || '公开',
                retention: (formRetention as any) || '30年',
              }
            : f
        )
      );
    } else {
      const targetId = selectedVolumeIds[0] || volumeList[0]?.id;
      setVolumeList((prev) =>
        prev.map((v) =>
          v.id === targetId
            ? {
                ...v,
                title: formTitle,
                author: formAuthor,
                securityLevel: (formSecurity as any) || '公开',
                retention: (formRetention as any) || '30年',
              }
            : v
        )
      );
    }
    setModalType(null);
    onShowMessage('已修改更新所选档案的元数据信息');
  };

  // Handle Archive Action (归档)
  const handleExecuteArchive = () => {
    if (activeTab === 'files') {
      const targetIds = selectedFileIds.length > 0 ? selectedFileIds : [fileList[0].id];
      setFileList((prev) =>
        prev.map((f) => (targetIds.includes(f.id) ? { ...f, status: '已归档' } : f))
      );
      setSelectedFileIds([]);
      onShowMessage(`已将 ${targetIds.length} 份整编文件归档入库`);
    } else {
      const targetIds = selectedVolumeIds.length > 0 ? selectedVolumeIds : [volumeList[0].id];
      setVolumeList((prev) =>
        prev.map((v) => (targetIds.includes(v.id) ? { ...v, status: '已归档' } : v))
      );
      setSelectedVolumeIds([]);
      onShowMessage(`已将 ${targetIds.length} 份整编案卷归档入库`);
    }
    setModalType(null);
  };

  // Handle Encoding件号
  const handleExecuteEncode = () => {
    const targetIds = selectedFileIds.length > 0 ? selectedFileIds : [fileList[0].id];
    setFileList((prev) =>
      prev.map((f) => (targetIds.includes(f.id) ? { ...f, status: '已编件号' } : f))
    );
    setSelectedFileIds([]);
    setModalType(null);
    onShowMessage(`已根据DA/T 46-2009标准自动为 ${targetIds.length} 份文件完成件号编制`);
  };

  // Handle Send Back (退回)
  const handleExecuteSendBack = () => {
    const targetIds = selectedFileIds.length > 0 ? selectedFileIds : [fileList[0].id];
    setFileList((prev) =>
      prev.map((f) => (targetIds.includes(f.id) ? { ...f, status: '已退回' } : f))
    );
    setSelectedFileIds([]);
    setModalType(null);
    onShowMessage(`已将所选文件退回至收集端，原因: ${rejectReason}`);
  };

  // Filter Data Logic
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
      item.author.toLowerCase().includes(titleSearch.toLowerCase()) ||
      item.docNo.toLowerCase().includes(titleSearch.toLowerCase());

    return matchesFolder && matchesYear && matchesCategory && matchesSearch;
  }).sort((a, b) => (b.archivedDate || b.writtenDate || "").localeCompare(a.archivedDate || a.writtenDate || ""));

  const paginatedFiles = filteredFiles.slice(
    (currentFilePage - 1) * PAGE_SIZE,
    currentFilePage * PAGE_SIZE
  );

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

  const getFileStatusBadge = (status: OrganizeFileItem['status']) => {
    switch (status) {
      case '整编中':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold">
            整编中
          </span>
        );
      case '已编件号':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 text-[11px] font-bold">
            已编件号
          </span>
        );
      case '已退回':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-red-50 dark:bg-red-950/80 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 text-[11px] font-bold">
            已退回
          </span>
        );
      case '已归档':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
            已归档
          </span>
        );
    }
  };

  const getVolumeStatusBadge = (status: OrganizeVolumeItem['status']) => {
    switch (status) {
      case '整编中':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-bold">
            整编中
          </span>
        );
      case '已编目':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[11px] font-bold">
            已编目
          </span>
        );
      case '已归档':
        return (
          <span className="whitespace-nowrap inline-block px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
            已归档
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 animate-in fade-in duration-300">
      {/* Hidden Native File Selector */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleNativeFileUpload}
        multiple
        className="hidden"
        accept=".pdf,.ofd,.docx,.xlsx,.doc,.xls,.png,.jpg,.zip"
      />

      {/* LEFT SIDEBAR DIRECTORY & CLASSIFICATION TREES */}
      <div className="w-full lg:w-60 space-y-3 shrink-0">
        {/* Tree 1: 档案目录树 */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2.5">
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
              <Building2 className={`w-3.5 h-3.5 ${selectedFolder === '全部目录' ? 'text-white' : 'text-amber-500'}`} />
              <span className="truncate">成都市住房和城乡建设局</span>
            </button>

            {/* Folder Tree Nodes */}
            <div className="pl-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pt-1">
              {[
                { name: '文书档案', years: ['2026年', '2025年'] },
                { name: '会计档案', years: ['2026年'] },
                { name: '基建档案', years: ['2026年'] },
                { name: '设备档案', years: ['2026年'] },
                { name: '照片档案', years: ['2025年'] },
                { name: '声像档案', years: ['2026年', '2025年'] },
                { name: '实物档案', years: ['2025年'] },
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
                      <ChevronRight
                        className={`w-3 h-3 text-slate-400 transition-transform ${
                          isSelectedFolder ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

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

        {/* Tree 2: 分类表 */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-2.5">
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
              '行政管理',
              '经营管理',
              '生产技术管理（技术文件）',
              '财务审计',
              '人力资源管理',
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

      {/* RIGHT MAIN CONTAINER */}
      <div className="flex-1 min-w-0 space-y-3.5">
        {/* Dynamic Filter Indicator */}
        {hasActiveFilters && (
          <div className="p-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/40 flex items-center justify-between gap-2 text-xs text-blue-900 dark:text-blue-200 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <span className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>动态联动中:</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 font-semibold text-[11px]">
                目录: {selectedFolder} {selectedYear !== '全部年份' ? `(${selectedYear})` : ''}
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-800 font-semibold text-[11px]">
                分类: {selectedCategory}
              </span>
              <span className="text-slate-500 text-[11px]">
                (匹配到 {activeTab === 'files' ? filteredFiles.length : filteredVolumes.length} 条)
              </span>
            </div>

            <button
              onClick={handleResetFilters}
              className="px-2 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors shrink-0 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>重置</span>
            </button>
          </div>
        )}

        {/* Top Header Tabs */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
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

          <div className="text-xs text-slate-400 font-mono">
            已勾选 <span className="font-bold text-blue-600">{activeTab === 'files' ? selectedFileIds.length : selectedVolumeIds.length}</span> 项
          </div>
        </div>

        {/* Action Toolbar */}
        {activeTab === 'files' ? (
          /* 文件列表 Toolbar for 收集整编 */
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={handleOpenAddFile}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加文件</span>
              </button>

              <button
                onClick={() => setModalType('archive_file')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>归档文件</span>
              </button>

              <button
                onClick={() => setModalType('encode_no')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1"
              >
                <Hash className="w-3.5 h-3.5" />
                <span>编件号</span>
              </button>

              <button
                onClick={() => setModalType('send_back')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <CornerUpLeft className="w-3.5 h-3.5" />
                <span>退回</span>
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
                  setFileList(fileList.filter((f) => !selectedFileIds.includes(f.id)));
                  setSelectedFileIds([]);
                  onShowMessage('已从列表移除选中文件');
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>

              <button
                onClick={() => onShowMessage(`已成功导出 ${selectedFileIds.length || filteredFiles.length} 份整编文件数据`)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors"
              >
                导出选中
              </button>

              <button
                onClick={() => onShowMessage(`正在导出整编文件库全量 ${filteredFiles.length} 项记录`)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors"
              >
                导出全部
              </button>

              <button
                onClick={() => onShowMessage('已调起打印机，准备打印目录套打单')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印</span>
              </button>

              <button
                onClick={() => setModalType('four_testing')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>四性检测</span>
              </button>
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="题名"
                value={titleSearch}
                onChange={(e) => {
                  setTitleSearch(e.target.value);
                  setCurrentFilePage(1);
                }}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
            </div>
          </div>
        ) : (
          /* 案卷列表 Toolbar for 收集整编 */
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={handleOpenAddVolume}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加案卷</span>
              </button>

              <button
                onClick={() => setModalType('archive_volume')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>归档案卷</span>
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
                  onShowMessage('已从列表移除选中案卷');
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>

              <button
                onClick={() => setModalType('merge')}
                className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Combine className="w-3.5 h-3.5" />
                <span>合并</span>
                <span className="w-4 h-4 rounded bg-amber-400 text-slate-900 text-[10px] font-extrabold flex items-center justify-center">
                  1
                </span>
              </button>

              <button
                onClick={() => setModalType('split')}
                className="px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-50 flex items-center gap-1.5"
              >
                <Scissors className="w-3.5 h-3.5" />
                <span>打散</span>
                <span className="w-4 h-4 rounded bg-amber-400 text-slate-900 text-[10px] font-extrabold flex items-center justify-center">
                  2
                </span>
              </button>

              <button
                onClick={() => onShowMessage('已调起打印机，准备打印案卷封面及卷内文件目录')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs transition-colors flex items-center gap-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印</span>
              </button>
            </div>

            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="题名"
                value={titleSearch}
                onChange={(e) => {
                  setTitleSearch(e.target.value);
                  setCurrentVolumePage(1);
                }}
                className="w-full pl-8 pr-3 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* TABLE COMPONENT */}
        {activeTab === 'files' ? (
          /* 文件列表 Table */
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-medium">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedFileIds.length === paginatedFiles.length && paginatedFiles.length > 0
                      }
                      onChange={() => {
                        if (selectedFileIds.length === paginatedFiles.length) setSelectedFileIds([]);
                        else setSelectedFileIds(paginatedFiles.map((d) => d.id));
                      }}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="py-2.5 px-3 w-12 text-center whitespace-nowrap">序号</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">档案状态</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">档案来源</th>
                  <th className="py-2.5 px-3 min-w-[220px]">文件题名</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">全宗号</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">年度</th>
                  <th className="py-2.5 px-3 min-w-[170px]">档号</th>
                  <th className="py-2.5 px-3 min-w-[140px]">文号</th>
                  <th className="py-2.5 px-3 min-w-[130px]">责任者</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">成文日期</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">密级</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">保管期限</th>
                  <th className="py-2.5 px-3 min-w-[100px]">归档单位</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">归档日期</th>
                  <th className="py-2.5 px-3 text-right min-w-[140px] sticky right-0 bg-slate-50/90 dark:bg-slate-850 whitespace-nowrap">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {paginatedFiles.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="py-12 text-center text-slate-400 font-sans">
                      未检索到匹配的整编文件数据
                    </td>
                  </tr>
                ) : (
                  paginatedFiles.map((item, index) => {
                    const isSelected = selectedFileIds.includes(item.id);
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
                            onChange={() => toggleSelectFile(item.id)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-400 whitespace-nowrap">
                          {(currentFilePage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {getFileStatusBadge(item.status)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                            {item.source}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="text-left hover:text-blue-600 hover:underline"
                          >
                            {item.title}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.fondsNo}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.year}</td>
                        <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {item.refCode}
                        </td>
                        <td className="py-2.5 px-3 font-sans whitespace-nowrap text-slate-600 dark:text-slate-400">
                          {item.docNo}
                        </td>
                        <td className="py-2.5 px-3 font-sans whitespace-nowrap">{item.author}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.writtenDate}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.securityLevel}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.retention}</td>
                        <td className="py-2.5 px-3 font-sans whitespace-nowrap">{item.unit}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.archivedDate}</td>
                        <td className="py-2.5 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 whitespace-nowrap">
                          <div className="whitespace-nowrap inline-flex items-center justify-end gap-2 font-sans">
                            <button
                              onClick={() => handleOpenDetail(item)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-semibold flex items-center gap-0.5"
                            >
                              <Eye className="w-3 h-3" />
                              <span>查看详情</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedFileIds([item.id]);
                                handleOpenEdit();
                              }}
                              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 text-xs font-medium"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => {
                                setFileList(fileList.filter((f) => f.id !== item.id));
                                onShowMessage(`已删除记录: ${item.title}`);
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 text-xs font-medium"
                            >
                              删除
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
        ) : (
          /* 案卷列表 Table */
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-x-auto shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-850 text-slate-600 dark:text-slate-400 font-medium">
                  <th className="py-2.5 px-3 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedVolumeIds.length === paginatedVolumes.length &&
                        paginatedVolumes.length > 0
                      }
                      onChange={() => {
                        if (selectedVolumeIds.length === paginatedVolumes.length)
                          setSelectedVolumeIds([]);
                        else setSelectedVolumeIds(paginatedVolumes.map((d) => d.id));
                      }}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="py-2.5 px-3 w-12 text-center whitespace-nowrap">序号</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">档案状态</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">档案来源</th>
                  <th className="py-2.5 px-3 min-w-[220px]">文件/案卷题名</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">全宗号</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">年度</th>
                  <th className="py-2.5 px-3 min-w-[170px]">档号</th>
                  <th className="py-2.5 px-3 min-w-[150px]">起止日期</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">页数</th>
                  <th className="py-2.5 px-3 text-center whitespace-nowrap">件数</th>
                  <th className="py-2.5 px-3 min-w-[130px]">立卷单位</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">组卷日期</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">密级</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">保管期限</th>
                  <th className="py-2.5 px-3 text-right min-w-[140px] sticky right-0 bg-slate-50/90 dark:bg-slate-850 whitespace-nowrap">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                {paginatedVolumes.length === 0 ? (
                  <tr>
                    <td colSpan={16} className="py-12 text-center text-slate-400 font-sans">
                      未检索到匹配的案卷整编数据
                    </td>
                  </tr>
                ) : (
                  paginatedVolumes.map((item, index) => {
                    const isSelected = selectedVolumeIds.includes(item.id);
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
                            onChange={() => toggleSelectVolume(item.id)}
                            className="rounded border-slate-300"
                          />
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-400 whitespace-nowrap">
                          {(currentVolumePage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          {getVolumeStatusBadge(item.status)}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap font-sans">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px]">
                            {item.source}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                          <button
                            onClick={() => handleOpenDetail(item)}
                            className="text-left hover:text-blue-600 hover:underline"
                          >
                            {item.title}
                          </button>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.fondsNo}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.year}</td>
                        <td className="py-2.5 px-3 font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {item.refCode}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.dateRange}</td>
                        <td className="py-2.5 px-3 text-center font-bold whitespace-nowrap">
                          {item.pageCount}
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold whitespace-nowrap">
                          {item.fileCount}
                        </td>
                        <td className="py-2.5 px-3 font-sans whitespace-nowrap">{item.orgUnit}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.prepDate}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.securityLevel}</td>
                        <td className="py-2.5 px-3 whitespace-nowrap">{item.retention}</td>
                        <td className="py-2.5 px-3 text-right sticky right-0 bg-white dark:bg-slate-900 whitespace-nowrap">
                          <div className="whitespace-nowrap inline-flex items-center justify-end gap-2 font-sans">
                            <button
                              onClick={() => handleOpenDetail(item)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-xs font-semibold flex items-center gap-0.5"
                            >
                              <Eye className="w-3 h-3" />
                              <span>查看详情</span>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVolumeIds([item.id]);
                                handleOpenEdit();
                              }}
                              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 text-xs font-medium"
                            >
                              编辑
                            </button>
                            <button
                              onClick={() => {
                                setVolumeList(volumeList.filter((v) => v.id !== item.id));
                                onShowMessage(`已删除案卷: ${item.title}`);
                              }}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 text-xs font-medium"
                            >
                              删除
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
        )}

        {/* PAGINATION BAR */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
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

      {/* MODAL 1: Detail Drawer Modal */}
      <ModalDetail
        isOpen={detailModalOpen}
        title="整编档案条目与元数据详情"
        onClose={() => setDetailModalOpen(false)}
        data={activeRecordForDetail}
        type="inflow"
        onActionSuccess={onShowMessage}
      />

      {/* MODAL 2: Add File Modal (根据 image_df9360f4.png 还原) */}
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
                    <option value="">请选择</option>
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
                    <option value="">请选择</option>
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
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans cursor-pointer"
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
                    页数:
                  </label>
                  <input
                    type="number"
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
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: 电子文件信息 */}
            <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 border-l-4 border-blue-600 pl-2 flex items-center gap-2">
                  <span>电子文件信息</span>
                  <span className="text-[11px] font-normal text-slate-400">支持拖拽排序与本地导入</span>
                </h4>

                <div className="flex items-center gap-2">
                  <button
                    onClick={triggerFileUpload}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>上传文件</span>
                  </button>

                  <button
                    onClick={() => {
                      const selectedAtts = fileAttachments.filter((a) => a.checked);
                      if (selectedAtts.length === 0) {
                        onShowMessage('请先勾选需要批量下载的电子附件');
                      } else {
                        onShowMessage(`已开始打包并下载 ${selectedAtts.length} 个电子文件原件`);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>批量下载</span>
                  </button>

                  <button
                    onClick={() => onShowMessage('电子附件重组顺序已保存封包')}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium transition-colors"
                  >
                    保存排序
                  </button>
                </div>
              </div>

              {/* Attachments Table */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium">
                      <th className="py-2.5 px-3 w-12 text-center">序号</th>
                      <th className="py-2.5 px-3 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={fileAttachments.length > 0 && fileAttachments.every((a) => a.checked)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setFileAttachments(fileAttachments.map((a) => ({ ...a, checked })));
                          }}
                          className="rounded border-slate-300"
                        />
                      </th>
                      <th className="py-2.5 px-3">文件名称</th>
                      <th className="py-2.5 px-3 w-24 text-center">文件类型</th>
                      <th className="py-2.5 px-3 w-24 text-center">文件大小</th>
                      <th className="py-2.5 px-3 w-32 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {fileAttachments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-slate-400 font-sans">
                          暂无上传的电子文件附件，请点击右上角【上传文件】选择本地文件
                        </td>
                      </tr>
                    ) : (
                      fileAttachments.map((att, index) => (
                        <tr key={att.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-2.5 px-3 text-center font-mono text-slate-400">{index + 1}</td>
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

      {/* MODAL 3: 添加案卷弹窗 matching image_09cc0a30.png */}
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

      {/* MODAL 4: Archive Confirmation Modal (归档文件 / 归档案卷) */}
      {(modalType === 'archive_file' || modalType === 'archive_volume') && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Archive className="w-5 h-5 text-blue-600" />
                <span>确认归档入库</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              确定要将选中的{' '}
              <span className="font-bold text-blue-600 font-mono">
                {modalType === 'archive_file'
                  ? selectedFileIds.length || 1
                  : selectedVolumeIds.length || 1}
              </span>{' '}
              项整编{modalType === 'archive_file' ? '文件' : '案卷'}转移至正式档案库库位？归档后将自动封包并生成国密数字校验哈希。
            </p>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
              <div className="text-slate-500">目标全宗: 0110 (成都市住房和城乡建设局)</div>
              <div className="text-slate-500">归档分区: 2026年标准文书/工程档案库房A区</div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleExecuteArchive}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
              >
                确认归档入库
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: Encode件号 Modal */}
      {modalType === 'encode_no' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Hash className="w-5 h-5 text-indigo-600" />
                <span>DA/T 46-2009 标准编件号规则</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              系统将根据电子文件年度、保管期限及全宗号自动排列流水顺序，编制件号。
            </p>

            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2 text-xs font-mono">
              <div className="font-bold text-indigo-900 dark:text-indigo-200">预生成档号示例:</div>
              <div className="bg-white dark:bg-slate-900 p-2 rounded border border-indigo-200 text-blue-600 font-bold">
                0110-WS·2026-30Y-BGS-0015
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleExecuteEncode}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
              >
                执行批量编件号
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: Send Back Modal (退回) */}
      {modalType === 'send_back' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CornerUpLeft className="w-5 h-5 text-amber-600" />
                <span>退回整编文件</span>
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
                  退回原因类型
                </label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
                >
                  <option value="元数据不完整，缺乏签章章印">元数据不完整，缺乏签章章印</option>
                  <option value="成文日期与文号不匹配">成文日期与文号不匹配</option>
                  <option value="电子原件正文清晰度不足">电子原件正文清晰度不足</option>
                  <option value="归档范围类别划分错误">归档范围类别划分错误</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  详细说明
                </label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleExecuteSendBack}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
              >
                确认退回
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: Merge Modal (合并 - Badge 1) */}
      {modalType === 'merge' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Combine className="w-5 h-5 text-indigo-600" />
                <span>合并案卷 (顺序标记 1)</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              将选中的多个独立案卷合为一个主卷，卷内文件顺序将自动按时间线重组。
            </p>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs space-y-1 font-mono">
              <div className="font-bold text-slate-800 dark:text-slate-200">
                主案卷题名: 成都市住房和城乡建设局2026年综合重点工程案卷
              </div>
              <div className="text-slate-500">包含文件数: 23 件</div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage('所选案卷合并成功，已更新卷内件数');
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs"
              >
                确认合并
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: Split Modal (打散 - Badge 2) */}
      {modalType === 'split' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-5 h-5 text-amber-600" />
                <span>打散案卷 (顺序标记 2)</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              确定要将选中的案卷拆分为独立电子文件？拆分后卷内文件将重新回归未组卷文件列表。
            </p>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage('案卷已解包打散为单件文件');
                }}
                className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs"
              >
                确认打散
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: Four Testing Modal (四性检测) */}
      {modalType === 'four_testing' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>DA/T 92-2022 电子档案“四性检测”报告</span>
              </h3>
              <button
                onClick={() => setModalType(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>真实性 (Authenticity)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  国密SM2电子签章及时间戳哈希校验通过
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>完整性 (Integrity)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  全宗号/档号/元数据卡片等完整无缺
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>可用性 (Usability)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  OFD/A-1及PDF正文解析无损坏
                </div>
              </div>

              <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/60 dark:bg-emerald-950/40 space-y-1">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                  <span>安全性 (Security)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-mono">
                  病毒扫描清白，绝密权限加密保护
                </div>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage('四性检测符合性报告导出完成');
                }}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs"
              >
                导出四性检测报告
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: Edit Form Modal */}
      {modalType === 'edit_file' && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>编辑整编条目元数据</span>
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
                  题名
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                  责任者
                </label>
                <input
                  type="text"
                  value={formAuthor}
                  onChange={(e) => setFormAuthor(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    密级
                  </label>
                  <select
                    value={formSecurity}
                    onChange={(e: any) => setFormSecurity(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
                  >
                    <option value="公开">公开</option>
                    <option value="内部">内部</option>
                    <option value="秘密">秘密</option>
                    <option value="机密">机密</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">
                    保管期限
                  </label>
                  <select
                    value={formRetention}
                    onChange={(e: any) => setFormRetention(e.target.value)}
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium cursor-pointer"
                  >
                    <option value="永久">永久</option>
                    <option value="30年">30年</option>
                    <option value="10年">10年</option>
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
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs"
              >
                保存修改
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
