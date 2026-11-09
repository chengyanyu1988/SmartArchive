import React, { useState, useEffect } from 'react';
import {
  Landmark,
  Layers,
  FolderTree,
  Network,
  Clock,
  Lock,
  Sparkles,
  Sliders,
  ShieldCheck,
  FileSpreadsheet,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  X,
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Save,
  Check,
  Eye,
  RefreshCw,
  AlertTriangle,
  Building2,
  PlusCircle,
  FileCheck,
  Shield,
  CheckSquare,
  Square,
  Copy,
  Printer,
  FileDown,
  BookOpen
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

export type SettingsSubmodule =
  | 'setting_fonds'               // 全宗管理
  | 'setting_archive_types'       // 档案类型管理
  | 'setting_classification'      // 分类设置
  | 'setting_catalog_tree'        // 目录树维护
  | 'setting_retention_period'    // 保管期限
  | 'setting_security_level'      // 密级
  | 'setting_special_topics'      // 专题类型设置
  | 'setting_metadata_rules'      // 著录项规则设置
  | 'setting_default_permissions' // 默认数据权限
  | 'setting_report_maintenance'; // 报表维护

interface ArchiveSettingsViewProps {
  submodule?: string;
  onNavigate?: (submodule: any) => void;
  onShowMessage: (msg: string) => void;
}

export const ArchiveSettingsView: React.FC<ArchiveSettingsViewProps> = ({
  submodule = 'setting_fonds',
  onNavigate,
  onShowMessage,
}) => {
  const [activeTab, setActiveTab] = useState<SettingsSubmodule>(
    (submodule as SettingsSubmodule) || 'setting_fonds'
  );

  useEffect(() => {
    if (submodule && submodule.startsWith('setting_')) {
      setActiveTab(submodule as SettingsSubmodule);
    }
  }, [submodule]);

  // Common interactive modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'detail'>('add');
  const [currentEditItem, setCurrentEditItem] = useState<any>(null);

  // Common pagination size
  const PAGE_SIZE = 10;

  // ==========================================
  // 1. 全宗管理 (setting_fonds) - 数据结构与状态
  // ==========================================
  interface FondsNode {
    id: string;
    name: string;
    parentId: string | null;
    unitName: string;
    unitCode: string;
    fondsNo: string;
    fondsName: string;
    remark: string;
    isRoot?: boolean;
  }

  interface FondsArchiveItem {
    id: string;
    fondsId: string;
    archiveCode: string;
    title: string;
    category: string;
    retention: string;
    security: string;
    pieceCount: number;
    author: string;
    archiveDate: string;
    status: string;
  }

  const initialFondsNodes: FondsNode[] = [
    {
      id: 'root',
      name: '全宗列表',
      parentId: null,
      unitName: '成都市数字档案馆总控中心',
      unitCode: 'CD-ARCH-ROOT',
      fondsNo: 'ROOT00',
      fondsName: '成都市数字档案馆总库',
      remark: '全宗目录树顶层根节点，统筹纳管集团总部及各直属分公司全宗。',
      isRoot: true,
    },
    {
      id: 'grp_01',
      name: '天府数智科技集团',
      parentId: 'root',
      unitName: '天府数智科技集团总部',
      unitCode: 'TF-GROUP-CORP',
      fondsNo: 'TFJT001',
      fondsName: '天府数智科技集团',
      remark: '主要纳管集团董事会决议、党组会公文、重大投融资决策及数字档案发展战略文件。',
    },
    {
      id: 'fonds_fz',
      name: '福州分公司',
      parentId: 'grp_01',
      unitName: '福州分公司',
      unitCode: 'FZ-TECH-2026',
      fondsNo: 'FZFGS02',
      fondsName: '福州分公司',
      remark: '负责东南沿海信创研发、海洋经济数字化档案汇编与海峡数字成果典藏。',
    },
    {
      id: 'fonds_cd',
      name: '成都分公司',
      parentId: 'grp_01',
      unitName: '成都分公司',
      unitCode: 'CD-TECH-2026',
      fondsNo: 'CDFGS03',
      fondsName: '成都分公司',
      remark: '立足成渝极核，负责高新技术智算中心、政务云平台及自主可控软件研发归档。',
    },
    {
      id: 'fonds_sc',
      name: '四川分公司',
      parentId: 'grp_01',
      unitName: '四川分公司',
      unitCode: 'SC-TECH-2026',
      fondsNo: 'SCFGS01',
      fondsName: '四川分公司',
      remark: '主要纳管西南及四川区域综合行政、科研研发与工程项目数字化档案卷宗。',
    },
    {
      id: 'fonds_cq',
      name: '重庆分公司',
      parentId: 'grp_01',
      unitName: '重庆分公司',
      unitCode: 'CQ-TECH-2026',
      fondsNo: 'CQFGS04',
      fondsName: '重庆分公司',
      remark: '重庆两江新区数智装备制造基地与工业互联网专案档案归集。',
    },
    {
      id: 'fonds_bj',
      name: '北京研发中心',
      parentId: 'grp_01',
      unitName: '北京研发中心',
      unitCode: 'BJ-RD-2026',
      fondsNo: 'BJFGS05',
      fondsName: '北京研发中心',
      remark: '国家重点实验室前沿AI大模型算法与信息技术底座攻关项目档案。',
    },
  ];

  const configuredUnits = [
    { name: '四川分公司', code: 'SC-TECH-2026', defaultFondsNo: 'SCFGS01' },
    { name: '福州分公司', code: 'FZ-TECH-2026', defaultFondsNo: 'FZFGS02' },
    { name: '成都分公司', code: 'CD-TECH-2026', defaultFondsNo: 'CDFGS03' },
    { name: '重庆分公司', code: 'CQ-TECH-2026', defaultFondsNo: 'CQFGS04' },
    { name: '北京研发中心', code: 'BJ-RD-2026', defaultFondsNo: 'BJFGS05' },
    { name: '深圳创新基地', code: 'SZ-INNO-2026', defaultFondsNo: 'SZFGS06' },
    { name: '天府数智科技集团总部', code: 'TF-GROUP-CORP', defaultFondsNo: 'TFJT001' },
    { name: '杭州产业基地', code: 'HZ-DIGI-2026', defaultFondsNo: 'HZFGS08' },
  ];

  const initialFondsArchives: Record<string, FondsArchiveItem[]> = {
    fonds_sc: [
      { id: 'sc-1', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-WS-2026-Y-0001', title: '四川分公司2026年度党总支委与经营管理办公会决议', category: '文书档案', retention: '永久', security: '内部', pieceCount: 18, author: '周明远', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'sc-2', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-KJ-2026-D30-0002', title: '四川分公司2026年三季度企业财会核算与原始发票凭证汇总', category: '会计档案', retention: '30年', security: '内部', pieceCount: 42, author: '张玉婷', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'sc-3', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-JJ-2026-Y-0003', title: '天府新区智算产业研发园区一期基建智能化工程施工图件', category: '基建工程', retention: '永久', security: '公开', pieceCount: 65, author: '陈宏博', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'sc-4', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-KY-2026-D30-0004', title: '自主可控数字档案安全流转与国密加密算法研发测试报告', category: '科研档案', retention: '30年', security: '内部', pieceCount: 26, author: '林思源', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'sc-5', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-WS-2026-D10-0005', title: '2026年度秋季全员综合安全生产大检查与消防整改销号台账', category: '文书档案', retention: '10年', security: '公开', pieceCount: 12, author: '郭建平', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'sc-6', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-WS-2026-Y-0006', title: '四川分公司机构编制三定方案与重点技术骨干任免批复通知', category: '文书档案', retention: '永久', security: '内部', pieceCount: 15, author: '周明远', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'sc-7', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-KJ-2026-D30-0007', title: '2026年四川省级重点专精特新产业专项研发补贴资金决算书', category: '会计档案', retention: '30年', security: '内部', pieceCount: 30, author: '张玉婷', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'sc-8', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-SX-2026-Y-0008', title: '四川分公司入驻成都科学城产业港揭牌仪式高清影像与口述史', category: '声像档案', retention: '永久', security: '公开', pieceCount: 8, author: '孙雅丽', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'sc-9', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-WS-2026-D10-0009', title: '2026年四川分公司服务器集中采购招投标文件及履约评价单', category: '文书档案', retention: '10年', security: '内部', pieceCount: 35, author: '王志刚', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'sc-10', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-JJ-2026-Y-0010', title: '超算实验室机房恒温恒湿电气环控系统联合竣工验收记录表', category: '基建工程', retention: '永久', security: '内部', pieceCount: 22, author: '陈宏博', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'sc-11', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-KY-2026-D30-0011', title: '档案全生命周期管理系统智能元数据解析组件发明专利申报材料', category: '科研档案', retention: '30年', security: '公开', pieceCount: 14, author: '林思源', archiveDate: '2026-11-06', status: '正常在档' },
      { id: 'sc-12', fondsId: 'fonds_sc', archiveCode: 'SCFGS01-WS-2026-D10-0012', title: '2026年度职工代表大会审议通过的公司考勤与薪酬管理细则', category: '文书档案', retention: '10年', security: '公开', pieceCount: 9, author: '郭建平', archiveDate: '2026-11-06', status: '正常在档' },
    ],
    fonds_fz: [
      { id: 'fz-1', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-WS-2026-Y-0001', title: '福州分公司2026年度东南数智港建设项目深化合作框架协议', category: '文书档案', retention: '永久', security: '内部', pieceCount: 20, author: '郑海荣', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'fz-2', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-KJ-2026-D30-0002', title: '2026年第三季度海洋大数据云平台专项财务支出台账及记账凭证', category: '会计档案', retention: '30年', security: '内部', pieceCount: 38, author: '许秀芳', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'fz-3', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-KY-2026-D30-0003', title: '闽江流域智慧水文全息监测数据采集系统软件设计成果', category: '科研档案', retention: '30年', security: '公开', pieceCount: 45, author: '黄建国', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'fz-4', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-WS-2026-D10-0004', title: '福州分公司办公用房租赁与物业综合管理服务外包合同', category: '文书档案', retention: '10年', security: '内部', pieceCount: 16, author: '吴丽华', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'fz-5', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-JJ-2026-Y-0005', title: '海峡两岸数字交流展示中心智能化布展工程隐蔽记录及决算', category: '基建工程', retention: '永久', security: '公开', pieceCount: 52, author: '陈德胜', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'fz-6', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-WS-2026-Y-0006', title: '关于表彰2026年度福州分公司信创攻坚党员先锋岗的表彰决定', category: '文书档案', retention: '永久', security: '公开', pieceCount: 7, author: '郑海荣', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'fz-7', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-KJ-2026-D30-0007', title: '2026年福州市高成长性企业研发费用加计扣除专项审计鉴证底稿', category: '会计档案', retention: '30年', security: '内部', pieceCount: 29, author: '许秀芳', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'fz-8', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-SX-2026-Y-0008', title: '数字中国建设峰会福州分公司参展全景纪实影像与访谈素材', category: '声像档案', retention: '永久', security: '公开', pieceCount: 12, author: '林欣欣', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'fz-9', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-WS-2026-D10-0009', title: '福州分公司2026年第三季度员工绩效考核与转正定级名册', category: '文书档案', retention: '10年', security: '内部', pieceCount: 24, author: '吴丽华', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'fz-10', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-KY-2026-D30-0010', title: '跨区域分布式档案容灾备份同步节点中间件测试验收报告', category: '科研档案', retention: '30年', security: '公开', pieceCount: 33, author: '黄建国', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'fz-11', fondsId: 'fonds_fz', archiveCode: 'FZFGS02-WS-2026-D10-0011', title: '福州分公司内部信息网络安全渗透应急演练全流程总结报告', category: '文书档案', retention: '10年', security: '内部', pieceCount: 15, author: '陈德胜', archiveDate: '2026-11-06', status: '正常在档' },
    ],
    fonds_cd: [
      { id: 'cd-1', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-WS-2026-Y-0001', title: '成都分公司2026年度参与智慧蓉城核心中枢系统研发工作计划', category: '文书档案', retention: '永久', security: '内部', pieceCount: 25, author: '李成峰', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'cd-2', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-KJ-2026-D30-0002', title: '2026年三季度成都高新区软件产业专项资金扶持资金台账', category: '会计档案', retention: '30年', security: '内部', pieceCount: 46, author: '唐梦琪', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'cd-3', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-KY-2026-D30-0003', title: '高并发数字档案OFD版式转换服务集群性能压测评估结论', category: '科研档案', retention: '30年', security: '公开', pieceCount: 31, author: '赵子豪', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'cd-4', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-JJ-2026-Y-0004', title: '天府软件园G区成都分公司研发中心弱电及精密空调维保工程', category: '基建工程', retention: '永久', security: '内部', pieceCount: 19, author: '杨志成', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'cd-5', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-WS-2026-D10-0005', title: '成都分公司办公区安保门禁与机房出入生物识别认证管理规范', category: '文书档案', retention: '10年', security: '公开', pieceCount: 11, author: '李成峰', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'cd-6', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-WS-2026-Y-0006', title: '2026年成都市重点工业软件自主创新产品认定申报审批全套卷宗', category: '文书档案', retention: '永久', security: '内部', pieceCount: 38, author: '唐梦琪', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'cd-7', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-KJ-2026-D30-0007', title: '2026年第三季度成都分公司企业银行账户对账单与电子凭证回单', category: '会计档案', retention: '30年', security: '内部', pieceCount: 54, author: '唐梦琪', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'cd-8', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-SX-2026-Y-0008', title: '成都数字经济产业峰会主题演讲与自主可控产品发布高清视频', category: '声像档案', retention: '永久', security: '公开', pieceCount: 10, author: '何晓燕', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'cd-9', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-WS-2026-D10-0009', title: '成都分公司2026届高校毕业生校园招聘及三方协议签署名册', category: '文书档案', retention: '10年', security: '内部', pieceCount: 28, author: '李成峰', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'cd-10', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-KY-2026-D30-0010', title: '基于国产操作系统的数字档案离线封印与时间戳验证工具软件', category: '科研档案', retention: '30年', security: '公开', pieceCount: 22, author: '赵子豪', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'cd-11', fondsId: 'fonds_cd', archiveCode: 'CDFGS03-WS-2026-D10-0011', title: '成都分公司2026年工会关爱员工慰问与劳动保护用品发放清册', category: '文书档案', retention: '10年', security: '公开', pieceCount: 8, author: '何晓燕', archiveDate: '2026-11-06', status: '正常在档' },
    ],
    grp_01: [
      { id: 'grp-1', fondsId: 'grp_01', archiveCode: 'TFJT001-WS-2026-Y-0001', title: '天府数智科技集团2026年度第一次股东会暨董事会决议全案', category: '文书档案', retention: '永久', security: '内部', pieceCount: 32, author: '韩建华', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'grp-2', fondsId: 'grp_01', archiveCode: 'TFJT001-WS-2026-Y-0002', title: '集团党委会关于贯彻落实国家档案局“十四五”规划专题会议纪要', category: '文书档案', retention: '永久', security: '内部', pieceCount: 16, author: '韩建华', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'grp-3', fondsId: 'grp_01', archiveCode: 'TFJT001-KJ-2026-D30-0003', title: '天府数智科技集团2026年半年度集团合并财务报表与外部审计报告', category: '会计档案', retention: '30年', security: '内部', pieceCount: 80, author: '严美兰', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'grp-4', fondsId: 'grp_01', archiveCode: 'TFJT001-KY-2026-Y-0004', title: '全国一体化算力网络成渝枢纽节点国家级重大专项技术总体方案', category: '科研档案', retention: '永久', security: '公开', pieceCount: 68, author: '张远航', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'grp-5', fondsId: 'grp_01', archiveCode: 'TFJT001-WS-2026-D10-0005', title: '集团总部各职能中心2026年四季度目标责任书及考核细则', category: '文书档案', retention: '10年', security: '内部', pieceCount: 22, author: '彭少青', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'grp-6', fondsId: 'grp_01', archiveCode: 'TFJT001-WS-2026-Y-0006', title: '关于设立天府数智科技集团档案全生命周期管理研究院的通知批复', category: '文书档案', retention: '永久', security: '公开', pieceCount: 12, author: '韩建华', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'grp-7', fondsId: 'grp_01', archiveCode: 'TFJT001-JJ-2026-Y-0007', title: '集团总部科技数智大厦智能化集成弱电工程招投标文件及决算', category: '基建工程', retention: '永久', security: '内部', pieceCount: 50, author: '宋伟强', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'grp-8', fondsId: 'grp_01', archiveCode: 'TFJT001-SX-2026-Y-0008', title: '天府数智科技集团成立十周年庆典高清纪录片及珍贵创业相册', category: '声像档案', retention: '永久', security: '公开', pieceCount: 15, author: '刘婷婷', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'grp-9', fondsId: 'grp_01', archiveCode: 'TFJT001-KJ-2026-D30-0009', title: '2026年度各下属分公司上缴集团综合管理费台账及凭证分录', category: '会计档案', retention: '30年', security: '内部', pieceCount: 36, author: '严美兰', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'grp-10', fondsId: 'grp_01', archiveCode: 'TFJT001-WS-2026-D10-0010', title: '集团商业机密保护规程与涉密人员定期保密审查评估意见表', category: '文书档案', retention: '10年', security: '内部', pieceCount: 25, author: '彭少青', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'grp-11', fondsId: 'grp_01', archiveCode: 'TFJT001-KY-2026-Y-0011', title: '多模态混合结构电子档案长期保存四性检测国标实施标准白皮书', category: '科研档案', retention: '永久', security: '公开', pieceCount: 40, author: '张远航', archiveDate: '2026-11-06', status: '正常在档' },
    ],
    fonds_cq: [
      { id: 'cq-1', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-WS-2026-Y-0001', title: '重庆分公司2026年度两江新区工业智能网联专项示范基地批复', category: '文书档案', retention: '永久', security: '内部', pieceCount: 21, author: '邓建国', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'cq-2', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-KJ-2026-D30-0002', title: '2026年三季度重庆智能网联基地制造装备固定资产折旧计提总账', category: '会计档案', retention: '30年', security: '内部', pieceCount: 33, author: '袁静', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'cq-3', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-KY-2026-D30-0003', title: '基于数字孪生技术的汽车整车焊装车间质量数据归档分析方案', category: '科研档案', retention: '30年', security: '公开', pieceCount: 48, author: '罗成军', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'cq-4', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-JJ-2026-Y-0004', title: '重庆分公司两江研发基地二期智能立体库房钢结构隐蔽工程验收', category: '基建工程', retention: '永久', security: '内部', pieceCount: 36, author: '黄显峰', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'cq-5', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-WS-2026-D10-0005', title: '重庆分公司2026年度车间劳保防护与安全环保达标考核自查通报', category: '文书档案', retention: '10年', security: '公开', pieceCount: 14, author: '邓建国', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'cq-6', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-WS-2026-Y-0006', title: '重庆分公司关于成渝地区双城经济圈重点算力协同保密协议', category: '文书档案', retention: '永久', security: '内部', pieceCount: 18, author: '袁静', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'cq-7', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-KJ-2026-D30-0007', title: '2026年重庆市制造业高质量发展专项补贴资金下达及核算原始单', category: '会计档案', retention: '30年', security: '内部', pieceCount: 27, author: '袁静', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'cq-8', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-SX-2026-Y-0008', title: '重庆两江工业互联网大会分公司产品展示与产线实况航拍', category: '声像档案', retention: '永久', security: '公开', pieceCount: 9, author: '曹倩', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'cq-9', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-WS-2026-D10-0009', title: '2026年重庆分公司工业自动化备品备件联合采购协议', category: '文书档案', retention: '10年', security: '内部', pieceCount: 22, author: '黄显峰', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'cq-10', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-KY-2026-D30-0010', title: '跨区域高速工业总线通信数据包实时压缩加密与固化组件', category: '科研档案', retention: '30年', security: '公开', pieceCount: 30, author: '罗成军', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'cq-11', fondsId: 'fonds_cq', archiveCode: 'CQFGS04-WS-2026-D10-0011', title: '重庆分公司2026年秋季团支部青年技能大赛表彰光荣榜', category: '文书档案', retention: '10年', security: '公开', pieceCount: 6, author: '曹倩', archiveDate: '2026-11-06', status: '正常在档' },
    ],
    fonds_bj: [
      { id: 'bj-1', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-WS-2026-Y-0001', title: '北京研发中心2026年度承担国家重点实验室联合攻关任务协议书', category: '文书档案', retention: '永久', security: '内部', pieceCount: 28, author: '徐晓峰', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'bj-2', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-KJ-2026-D30-0002', title: '2026年三季度前沿大模型算力租赁与算法研发费用专项凭证分录', category: '会计档案', retention: '30年', security: '内部', pieceCount: 40, author: '白露', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'bj-3', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-KY-2026-Y-0003', title: '面向档案古籍图像超分辨率修复的深度神经网络算法模型全集', category: '科研档案', retention: '永久', security: '公开', pieceCount: 62, author: '程子墨', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'bj-4', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-WS-2026-D10-0004', title: '北京研发中心中关村软件园办公场地租赁与知识产权保密协议', category: '文书档案', retention: '10年', security: '内部', pieceCount: 19, author: '徐晓峰', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'bj-5', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-JJ-2026-Y-0005', title: '北京中关村研发中心GPU高密算力服务器机房屏蔽改造工程验收表', category: '基建工程', retention: '永久', security: '内部', pieceCount: 30, author: '陆建民', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'bj-6', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-WS-2026-Y-0006', title: '关于引进海外高层次人工智能领军人才特聘专家协议及审批单', category: '文书档案', retention: '永久', security: '内部', pieceCount: 14, author: '徐晓峰', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'bj-7', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-KJ-2026-D30-0007', title: '2026年北京市海淀区科技创新基金配套研发经费使用决算报告', category: '会计档案', retention: '30年', security: '内部', pieceCount: 35, author: '白露', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'bj-8', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-SX-2026-Y-0008', title: '国家人工智能标准化总体组档案信息化工作组北京研讨会影像', category: '声像档案', retention: '永久', security: '公开', pieceCount: 11, author: '金灵', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'bj-9', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-WS-2026-D10-0009', title: '北京研发中心2026年高端学术期刊论文发表奖励审批与报销台账', category: '文书档案', retention: '10年', security: '公开', pieceCount: 16, author: '白露', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'bj-10', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-KY-2026-Y-0010', title: '海量多源异构数字档案智能分级与脱敏核心技术发明专利卷宗', category: '科研档案', retention: '永久', security: '公开', pieceCount: 44, author: '程子墨', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'bj-11', fondsId: 'fonds_bj', archiveCode: 'BJFGS05-WS-2026-D10-0011', title: '北京研发中心2026年第四季度信息安全意识培训签到与随堂测试', category: '文书档案', retention: '10年', security: '公开', pieceCount: 9, author: '金灵', archiveDate: '2026-11-06', status: '正常在档' },
    ],
    root: [
      { id: 'rt-1', fondsId: 'root', archiveCode: 'ROOT00-WS-2026-Y-0001', title: '数字档案馆全宗体系设立与各分支机构档案移交管理通则', category: '文书档案', retention: '永久', security: '内部', pieceCount: 35, author: '档案馆总编审', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'rt-2', fondsId: 'root', archiveCode: 'ROOT00-WS-2026-Y-0002', title: '国家档案局关于开展全国示范数字档案馆评估验收的工作方案', category: '文书档案', retention: '永久', security: '公开', pieceCount: 20, author: '综合科', archiveDate: '2026-11-01', status: '正常在档' },
      { id: 'rt-3', fondsId: 'root', archiveCode: 'ROOT00-KJ-2026-D30-0003', title: '成都市数字档案馆基础软硬件设施建设专项资金财政决算总汇编', category: '会计档案', retention: '30年', security: '内部', pieceCount: 92, author: '财会处', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'rt-4', fondsId: 'root', archiveCode: 'ROOT00-KY-2026-Y-0004', title: '电子档案长期保存多层级固化与区块链存证防篡改体系技术规范', category: '科研档案', retention: '永久', security: '公开', pieceCount: 75, author: '科技处', archiveDate: '2026-11-02', status: '正常在档' },
      { id: 'rt-5', fondsId: 'root', archiveCode: 'ROOT00-JJ-2026-Y-0005', title: '成都市天府新区档案综合大楼主体工程竣工验收与抗震抗火档案', category: '基建工程', retention: '永久', security: '内部', pieceCount: 110, author: '工程专班', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'rt-6', fondsId: 'root', archiveCode: 'ROOT00-WS-2026-Y-0006', title: '关于印发全馆涉密公文与敏感信息数据访问权限隔离矩阵的通知', category: '文书档案', retention: '永久', security: '内部', pieceCount: 28, author: '保密办', archiveDate: '2026-11-03', status: '正常在档' },
      { id: 'rt-7', fondsId: 'root', archiveCode: 'ROOT00-SX-2026-Y-0007', title: '2026年度四川省档案数字化建设成果汇报会实况全套声像资料', category: '声像档案', retention: '永久', security: '公开', pieceCount: 18, author: '宣教室', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'rt-8', fondsId: 'root', archiveCode: 'ROOT00-WS-2026-D10-0008', title: '全馆安全生产、防汛防汛及库房恒温恒湿监控季度检查记录', category: '文书档案', retention: '10年', security: '公开', pieceCount: 16, author: '物业安全科', archiveDate: '2026-11-04', status: '正常在档' },
      { id: 'rt-9', fondsId: 'root', archiveCode: 'ROOT00-KJ-2026-D30-0009', title: '2026年度档案保护修复专用耗材及数字化加工服务政府采购凭据', category: '会计档案', retention: '30年', security: '内部', pieceCount: 44, author: '财会处', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'rt-10', fondsId: 'root', archiveCode: 'ROOT00-KY-2026-D30-0010', title: 'AI智能辅助著录与语义检索技术在全宗历史档案目录中的应用研究', category: '科研档案', retention: '30年', security: '公开', pieceCount: 38, author: '技术开发科', archiveDate: '2026-11-05', status: '正常在档' },
      { id: 'rt-11', fondsId: 'root', archiveCode: 'ROOT00-WS-2026-D10-0011', title: '2026年度馆藏重点档案巡检盘点及虫霉防治专项作业工作报告', category: '文书档案', retention: '10年', security: '公开', pieceCount: 13, author: '保管处', archiveDate: '2026-11-06', status: '正常在档' },
    ],
  };

  // Fonds Management States
  const [fondsNodes, setFondsNodes] = useState<FondsNode[]>(initialFondsNodes);
  const [selectedFondsId, setSelectedFondsId] = useState<string>('fonds_sc'); // 默认选中四川分公司
  const [expandedNodeIds, setExpandedNodeIds] = useState<string[]>(['root', 'grp_01']);

  // Right Form inputs state
  const [formUnitName, setFormUnitName] = useState<string>('四川分公司');
  const [formUnitCode, setFormUnitCode] = useState<string>('SC-TECH-2026');
  const [formFondsNo, setFormFondsNo] = useState<string>('SCFGS01');
  const [formFondsName, setFormFondsName] = useState<string>('四川分公司');
  const [formRemark, setFormRemark] = useState<string>('主要纳管西南及四川区域综合行政、科研研发与工程项目数字化档案卷宗。');

  // Archive files state
  const [fondsArchives, setFondsArchives] = useState<Record<string, FondsArchiveItem[]>>(initialFondsArchives);
  const [archiveSearch, setArchiveSearch] = useState<string>('');
  const [archiveCategoryFilter, setArchiveCategoryFilter] = useState<string>('全部');
  const [archivePage, setArchivePage] = useState<number>(1);

  // New Fonds Modal state
  const [isAddFondsModalOpen, setIsAddFondsModalOpen] = useState<boolean>(false);
  const [newFondsParentId, setNewFondsParentId] = useState<string>('grp_01');
  const [newFondsUnitName, setNewFondsUnitName] = useState<string>('深圳创新基地');
  const [newFondsUnitCode, setNewFondsUnitCode] = useState<string>('SZ-INNO-2026');
  const [newFondsNo, setNewFondsNo] = useState<string>('SZFGS06');
  const [newFondsName, setNewFondsName] = useState<string>('深圳创新基地');
  const [newFondsRemark, setNewFondsRemark] = useState<string>('粤港澳大湾区算力集群与前沿人工智能档案归集。');

  // Archive File Modals (Add / Edit / Detail / Delete)
  const [isArchiveItemModalOpen, setIsArchiveItemModalOpen] = useState<boolean>(false);
  const [archiveItemModalMode, setArchiveItemModalMode] = useState<'add' | 'edit' | 'detail'>('add');
  const [selectedArchiveItem, setSelectedArchiveItem] = useState<FondsArchiveItem | null>(null);
  const [archiveFormTitle, setArchiveFormTitle] = useState('');
  const [archiveFormCode, setArchiveFormCode] = useState('');
  const [archiveFormCategory, setArchiveFormCategory] = useState('文书档案');
  const [archiveFormRetention, setArchiveFormRetention] = useState('永久');
  const [archiveFormSecurity, setArchiveFormSecurity] = useState('内部');
  const [archiveFormPieceCount, setArchiveFormPieceCount] = useState(18);
  const [archiveFormAuthor, setArchiveFormAuthor] = useState('周明远');

  // Delete Fonds Confirmation & Rule blocking dialog
  const [deleteRuleNotice, setDeleteRuleNotice] = useState<{
    open: boolean;
    ruleNumber?: number;
    title: string;
    message: string;
    canConfirm?: boolean;
  } | null>(null);

  // Delete file confirmation modal
  const [fileToDelete, setFileToDelete] = useState<FondsArchiveItem | null>(null);

  // ==========================================
  // 2. 档案类型管理 (setting_archive_types) - 依据截图还原字段配置体系
  // ==========================================
  interface ArchiveTypeNode {
    id: string;
    name: string;
    parentId: string | null;
    levelTag: string;
    isCategory?: boolean;
    code?: string;
  }

  interface ArchiveFieldItem {
    id: string;
    fieldCode: string; // 带 * 为系统字段，例如 '* fondsCode'
    isSystem: boolean; // 是否系统字段，带 * 不能被删除
    chineseName: string;
    fieldType: string; // 字符型, 整型, 枚举型, 日期型, 长文本型
    fieldLength: number;
    showInList: boolean;
    showInSearch: boolean;
    showInEntry: boolean;
    canEdit: boolean;
    isUnique: boolean;
    isRequired: boolean;
    remark: string;
  }

  const initialArchiveTypeNodes: ArchiveTypeNode[] = [
    { id: 'root_type', name: '档案类型列表', parentId: null, levelTag: '根目录', isCategory: true },
    { id: 'ws_doc', name: '文书档案（文件）', parentId: 'root_type', levelTag: '件级归档', isCategory: true, code: 'WS_DOC' },
    { id: 'ws_doc_file', name: '文件', parentId: 'ws_doc', levelTag: '文件级', isCategory: false, code: 'WS_DOC_FILE' },
    { id: 'ws_box', name: '文书档案（盒/案卷）', parentId: 'root_type', levelTag: '卷盒两级', isCategory: true, code: 'WS_BOX' },
    { id: 'ws_box_file', name: '文件', parentId: 'ws_box', levelTag: '文件级', isCategory: false, code: 'WS_BOX_FILE' },
    { id: 'ws_box_vol', name: '案卷', parentId: 'ws_box', levelTag: '案卷级', isCategory: false, code: 'WS_BOX_VOL' },
    { id: 'eng_proj', name: '工程档案', parentId: 'root_type', levelTag: '项目卷件三级', isCategory: true, code: 'ENG' },
    { id: 'eng_proj_file', name: '文件', parentId: 'eng_proj', levelTag: '文件级', isCategory: false, code: 'ENG_FILE' },
    { id: 'eng_proj_vol', name: '案卷', parentId: 'eng_proj', levelTag: '案卷级', isCategory: false, code: 'ENG_VOL' },
    { id: 'eng_proj_item', name: '项目', parentId: 'eng_proj', levelTag: '项目级', isCategory: false, code: 'ENG_PROJ' },
    { id: 'acc_fonds', name: '会计档案', parentId: 'root_type', levelTag: '凭证账簿级', isCategory: true, code: 'KJ' },
    { id: 'acc_voucher', name: '凭证', parentId: 'acc_fonds', levelTag: '凭证级', isCategory: false, code: 'KJ_VOUCHER' },
    { id: 'acc_ledger', name: '账簿', parentId: 'acc_fonds', levelTag: '账簿级', isCategory: false, code: 'KJ_LEDGER' },
    { id: 'av_fonds', name: '声像档案', parentId: 'root_type', levelTag: '视音频级', isCategory: true, code: 'SX' },
    { id: 'av_photo', name: '照片', parentId: 'av_fonds', levelTag: '单张照片级', isCategory: false, code: 'SX_PHOTO' },
  ];

  const initialArchiveFieldsMap: Record<string, ArchiveFieldItem[]> = {
    // 1. 文书档案（文件）- 文件级 (严格对应截图 image_0a10f615.png 与 image_9a2c75fa.png，去除xxx，21项真实数据)
    ws_doc_file: [
      { id: 'fld_1', fieldCode: '* fondsCode', isSystem: true, chineseName: '全宗号', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '全宗统一编码映射关系' },
      { id: 'fld_2', fieldCode: '* years', isSystem: true, chineseName: '年度', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '4位公历成文年份' },
      { id: 'fld_3', fieldCode: '* boxNo', isSystem: true, chineseName: '盒号', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '实体排架档案盒编码' },
      { id: 'fld_4', fieldCode: '* arcNo', isSystem: true, chineseName: '件号', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '盒内顺序流水件号' },
      { id: 'fld_5', fieldCode: '* arcCode', isSystem: true, chineseName: '档号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '符合DA/T 22国家标准规范档号' },
      { id: 'fld_6', fieldCode: '* title', isSystem: true, chineseName: '题名', fieldType: '字符型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '公文正题名、副题名' },
      { id: 'fld_7', fieldCode: '* docNo', isSystem: true, chineseName: '文号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '发文机关正式字号' },
      { id: 'fld_8', fieldCode: '* classifyId', isSystem: true, chineseName: '分类名称', fieldType: '枚举型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '党群、行政、业务一级门类' },
      { id: 'fld_9', fieldCode: '* classifyIdCode', isSystem: true, chineseName: '分类号', fieldType: '字符型', fieldLength: 400, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '分类设置规则代码' },
      { id: 'fld_10', fieldCode: '* termId', isSystem: true, chineseName: '保管期限', fieldType: '枚举型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '永久/30年/10年' },
      { id: 'fld_11', fieldCode: '* secretLevelId', isSystem: true, chineseName: '密级', fieldType: '枚举型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '公开/内部/秘密/机密' },
      { id: 'fld_12', fieldCode: '* filingDepCode', isSystem: true, chineseName: '归档单位', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '立卷移交部门编码' },
      { id: 'fld_13', fieldCode: '* filingDate', isSystem: true, chineseName: '归档日期', fieldType: '日期型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '近期2026-11归档入库' },
      { id: 'fld_14', fieldCode: '* zrr', isSystem: true, chineseName: '责任者', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '公文签发承办责任人员' },
      { id: 'fld_15', fieldCode: '* pageNum', isSystem: true, chineseName: '页数', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '数字版式OFD总页数' },
      { id: 'fld_16', fieldCode: '* pageNums', isSystem: true, chineseName: '张数', fieldType: '整型', fieldLength: 0, showInList: false, showInSearch: false, showInEntry: false, canEdit: true, isUnique: false, isRequired: false, remark: '实物原件折合张数' },
      { id: 'fld_17', fieldCode: '* storeRoomPosition', isSystem: true, chineseName: '库房位置', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '实体库房智能密集架架位号' },
      { id: 'fld_18', fieldCode: 'summary', isSystem: false, chineseName: '备注', fieldType: '字符型', fieldLength: 50, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '立卷编目特别备忘事项' },
      { id: 'fld_19', fieldCode: 'createdDate', isSystem: false, chineseName: '成文日期', fieldType: '字符型', fieldLength: 50, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '公文签署生效成文日期' },
      { id: 'fld_20', fieldCode: 'carrierMedium', isSystem: false, chineseName: '载体形态', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '原生电子/纸质数字化双套制' },
      { id: 'fld_21', fieldCode: 'sm3Hash', isSystem: false, chineseName: '国密特征值', fieldType: '字符型', fieldLength: 64, showInList: false, showInSearch: true, showInEntry: false, canEdit: false, isUnique: true, isRequired: false, remark: 'DA/T 46真实性SM3哈希凭证' },
    ],

    // 2. 文书档案（盒/案卷）- 案卷级
    ws_box_vol: [
      { id: 'vb_1', fieldCode: '* fondsCode', isSystem: true, chineseName: '全宗号', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '全宗编码' },
      { id: 'vb_2', fieldCode: '* years', isSystem: true, chineseName: '年度', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '立卷归档年度' },
      { id: 'vb_3', fieldCode: '* volumeNo', isSystem: true, chineseName: '案卷号', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '案卷顺序号' },
      { id: 'vb_4', fieldCode: '* volumeCode', isSystem: true, chineseName: '案卷档号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '案卷级标准档号' },
      { id: 'vb_5', fieldCode: '* volumeTitle', isSystem: true, chineseName: '案卷题名', fieldType: '字符型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '案卷总体题名概括' },
      { id: 'vb_6', fieldCode: '* startEndDate', isSystem: true, chineseName: '起止日期', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '卷内最早与最晚文件时间' },
      { id: 'vb_7', fieldCode: '* totalPieces', isSystem: true, chineseName: '卷内件数', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '卷内包含文件份数' },
      { id: 'vb_8', fieldCode: '* totalSheets', isSystem: true, chineseName: '卷内总页数', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '卷内累计总页数' },
      { id: 'vb_9', fieldCode: '* classifyId', isSystem: true, chineseName: '分类名称', fieldType: '枚举型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '门类分类名称' },
      { id: 'vb_10', fieldCode: '* termId', isSystem: true, chineseName: '保管期限', fieldType: '枚举型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '永久/30年/10年' },
      { id: 'vb_11', fieldCode: '* secretLevelId', isSystem: true, chineseName: '密级', fieldType: '枚举型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '公开/内部/秘密/机密' },
      { id: 'vb_12', fieldCode: '* boxNo', isSystem: true, chineseName: '盒号', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '归属档案盒号' },
      { id: 'vb_13', fieldCode: '* zrr', isSystem: true, chineseName: '立卷人', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '案卷组卷责任人' },
      { id: 'vb_14', fieldCode: '* storeRoomPosition', isSystem: true, chineseName: '库房架位', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '物理库房密集架排位' },
      { id: 'vb_15', fieldCode: 'reviewer', isSystem: false, chineseName: '检查人', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '档案案卷质量复核人' },
      { id: 'vb_16', fieldCode: 'remarkNote', isSystem: false, chineseName: '备考表说明', fieldType: '长文本型', fieldLength: 500, showInList: false, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '案卷备考说明破损涂改记录' },
    ],

    // 3. 文书档案（盒/案卷）- 文件级
    ws_box_file: [
      { id: 'bf_1', fieldCode: '* fondsCode', isSystem: true, chineseName: '全宗号', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '全宗统一编码' },
      { id: 'bf_2', fieldCode: '* volumeCode', isSystem: true, chineseName: '案卷档号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '上级案卷档号' },
      { id: 'bf_3', fieldCode: '* arcNo', isSystem: true, chineseName: '卷内序号', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '卷内文件自然流水' },
      { id: 'bf_4', fieldCode: '* title', isSystem: true, chineseName: '文件题名', fieldType: '字符型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '公文题名' },
      { id: 'bf_5', fieldCode: '* docNo', isSystem: true, chineseName: '发文字号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '公文字号' },
      { id: 'bf_6', fieldCode: '* createdDate', isSystem: true, chineseName: '成文日期', fieldType: '日期型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '发文成文时间' },
      { id: 'bf_7', fieldCode: '* zrr', isSystem: true, chineseName: '责任者', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '发文责任机构或人员' },
      { id: 'bf_8', fieldCode: '* pageStart', isSystem: true, chineseName: '起页号', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '卷内文件起始页码' },
      { id: 'bf_9', fieldCode: '* pageEnd', isSystem: true, chineseName: '止页号', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '卷内文件终止页码' },
      { id: 'bf_10', fieldCode: '* secretLevelId', isSystem: true, chineseName: '密级', fieldType: '枚举型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '文件密级' },
      { id: 'bf_11', fieldCode: 'docDigest', isSystem: false, chineseName: '公文摘要', fieldType: '长文本型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '内容核心摘要' },
      { id: 'bf_12', fieldCode: 'sealStatus', isSystem: false, chineseName: '电子印章核验', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: false, canEdit: false, isUnique: false, isRequired: false, remark: '国家密码管理局签章有效' },
    ],

    // 4. 工程档案 - 项目级
    eng_proj_item: [
      { id: 'ep_1', fieldCode: '* fondsCode', isSystem: true, chineseName: '全宗号', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '全宗编号' },
      { id: 'ep_2', fieldCode: '* projectCode', isSystem: true, chineseName: '项目代码', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: true, isRequired: true, remark: '发改立项唯一项目代码' },
      { id: 'ep_3', fieldCode: '* projectName', isSystem: true, chineseName: '项目名称', fieldType: '字符型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: true, remark: '工程建设项目全称' },
      { id: 'ep_4', fieldCode: '* constructUnit', isSystem: true, chineseName: '建设单位', fieldType: '字符型', fieldLength: 128, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '项目业主单位' },
      { id: 'ep_5', fieldCode: '* designUnit', isSystem: true, chineseName: '勘察设计单位', fieldType: '字符型', fieldLength: 128, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '设计出图单位' },
      { id: 'ep_6', fieldCode: '* superviseUnit', isSystem: true, chineseName: '监理单位', fieldType: '字符型', fieldLength: 128, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '工程质量监理单位' },
      { id: 'ep_7', fieldCode: '* investAmount', isSystem: true, chineseName: '概算总投资(万)', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '立项概算总金额' },
      { id: 'ep_8', fieldCode: '* startDate', isSystem: true, chineseName: '开工日期', fieldType: '日期型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '开工许可证批准时间' },
      { id: 'ep_9', fieldCode: '* finishDate', isSystem: true, chineseName: '竣工验收日期', fieldType: '日期型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '竣工联合验收时间' },
      { id: 'ep_10', fieldCode: '* projectLeader', isSystem: true, chineseName: '项目负责人', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '业主项目总指挥' },
      { id: 'ep_11', fieldCode: '* approvalDocNo', isSystem: true, chineseName: '立项批文号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '立项可研批复公文号' },
      { id: 'ep_12', fieldCode: '* secretLevelId', isSystem: true, chineseName: '密级', fieldType: '枚举型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '工程档案保密等级' },
      { id: 'ep_13', fieldCode: 'storageSpecialRoom', isSystem: false, chineseName: '专库架位', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '基建工程特种图纸密集架' },
      { id: 'ep_14', fieldCode: 'bimModelPath', isSystem: false, chineseName: 'BIM轻量模型挂接', fieldType: '字符型', fieldLength: 128, showInList: false, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '建筑信息模型数据挂接' },
      { id: 'ep_15', fieldCode: 'projectRemark', isSystem: false, chineseName: '工程特别备忘', fieldType: '长文本型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '重大基建工程立项备考' },
    ],

    // 5. 工程档案 - 案卷级
    eng_proj_vol: [
      { id: 'ev_1', fieldCode: '* fondsCode', isSystem: true, chineseName: '全宗号', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '全宗编号' },
      { id: 'ev_2', fieldCode: '* projectCode', isSystem: true, chineseName: '项目代码', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '归属基建项目' },
      { id: 'ev_3', fieldCode: '* volumeNo', isSystem: true, chineseName: '案卷号', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '工程卷号流水' },
      { id: 'ev_4', fieldCode: '* volumeCode', isSystem: true, chineseName: '工程卷档号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: 'GB/T 50328规范档号' },
      { id: 'ev_5', fieldCode: '* volumeTitle', isSystem: true, chineseName: '案卷题名', fieldType: '字符型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '分部工程卷内题名' },
      { id: 'ev_6', fieldCode: '* phaseCode', isSystem: true, chineseName: '建设阶段', fieldType: '枚举型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '前期/施工/监理/竣工' },
      { id: 'ev_7', fieldCode: '* drawingCount', isSystem: true, chineseName: '图纸张数', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '卷内大样图张数' },
      { id: 'ev_8', fieldCode: '* termId', isSystem: true, chineseName: '保管期限', fieldType: '枚举型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '工程生命周期永久' },
      { id: 'ev_9', fieldCode: '* secretLevelId', isSystem: true, chineseName: '密级', fieldType: '枚举型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '公开/内部/秘密' },
      { id: 'ev_10', fieldCode: '* zrr', isSystem: true, chineseName: '立卷责任人', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '施工单位资料员' },
      { id: 'ev_11', fieldCode: 'drawingScale', isSystem: false, chineseName: '主要图纸比例尺', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '1:100 / 1:50等' },
      { id: 'ev_12', fieldCode: 'qualitySeal', isSystem: false, chineseName: '质监竣工图章', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '注册建造师及监理盖印' },
    ],

    // 6. 工程档案 - 文件级
    eng_proj_file: [
      { id: 'ef_1', fieldCode: '* volumeCode', isSystem: true, chineseName: '案卷档号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '上级工程案卷档号' },
      { id: 'ef_2', fieldCode: '* docCode', isSystem: true, chineseName: '图号/文件号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '设计施工图编号' },
      { id: 'ef_3', fieldCode: '* title', isSystem: true, chineseName: '图纸/文件题名', fieldType: '字符型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '图纸正题名' },
      { id: 'ef_4', fieldCode: '* drawingScale', isSystem: true, chineseName: '比例尺', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '图纸缩放标准比例' },
      { id: 'ef_5', fieldCode: '* designer', isSystem: true, chineseName: '主创设计师', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '注册建筑师/结构师' },
      { id: 'ef_6', fieldCode: '* pageNum', isSystem: true, chineseName: '页数/图幅', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: 'A0/A1/A2图幅折合' },
      { id: 'ef_7', fieldCode: '* createdDate', isSystem: true, chineseName: '出图成文日期', fieldType: '日期型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '设计出图签署时间' },
      { id: 'ef_8', fieldCode: 'cadFormat', isSystem: false, chineseName: 'CAD/DWG源文件', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '矢量图纸源文件关联' },
      { id: 'ef_9', fieldCode: 'auditSign', isSystem: false, chineseName: '施工图审查结论', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '图审机构合格书' },
    ],

    // 7. 会计档案 - 凭证级
    acc_voucher: [
      { id: 'ac_1', fieldCode: '* fondsCode', isSystem: true, chineseName: '全宗号', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '全宗编号' },
      { id: 'ac_2', fieldCode: '* years', isSystem: true, chineseName: '会计年度', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '会计核算年度' },
      { id: 'ac_3', fieldCode: '* month', isSystem: true, chineseName: '会计月份', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '1~12月会计期间' },
      { id: 'ac_4', fieldCode: '* voucherNo', isSystem: true, chineseName: '记账凭证号/册号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '凭证汇总册流水编号' },
      { id: 'ac_5', fieldCode: '* totalAmount', isSystem: true, chineseName: '凭证总金额', fieldType: '双精度型', fieldLength: 18, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '借贷平衡总金额' },
      { id: 'ac_6', fieldCode: '* voucherCount', isSystem: true, chineseName: '原始附件张数', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '发票报销原始单据总数' },
      { id: 'ac_7', fieldCode: '* termId', isSystem: true, chineseName: '保管期限', fieldType: '枚举型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '30年' },
      { id: 'ac_8', fieldCode: '* accountant', isSystem: true, chineseName: '主管会计', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '财务审签主管' },
      { id: 'ac_9', fieldCode: 'xmlInvoiceCount', isSystem: false, chineseName: '数电发票XML份数', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '税务数电发票电子原件' },
      { id: 'ac_10', fieldCode: 'bankStatement', isSystem: false, chineseName: '银行电子回单包', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '网银交易对账回单哈希' },
    ],

    // 8. 声像档案 - 照片级
    av_photo: [
      { id: 'ph_1', fieldCode: '* fondsCode', isSystem: true, chineseName: '全宗号', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '全宗统一编码' },
      { id: 'ph_2', fieldCode: '* years', isSystem: true, chineseName: '拍摄年度', fieldType: '字符型', fieldLength: 32, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '照片拍摄年度' },
      { id: 'ph_3', fieldCode: '* photoCode', isSystem: true, chineseName: '照片档号', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: true, isRequired: true, remark: 'GB/T 11821照片规范档号' },
      { id: 'ph_4', fieldCode: '* title', isSystem: true, chineseName: '照片题名/图注', fieldType: '字符型', fieldLength: 500, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: true, remark: '六要素文字生动图注' },
      { id: 'ph_5', fieldCode: '* photographer', isSystem: true, chineseName: '摄影者', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '快门拍摄创作人' },
      { id: 'ph_6', fieldCode: '* shootDate', isSystem: true, chineseName: '拍摄时间', fieldType: '日期型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '快门记录时间' },
      { id: 'ph_7', fieldCode: '* shootLocation', isSystem: true, chineseName: '拍摄地点', fieldType: '字符型', fieldLength: 128, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '地理空间拍摄坐标位置' },
      { id: 'ph_8', fieldCode: '* resolutionDpi', isSystem: true, chineseName: '分辨率(DPI)', fieldType: '整型', fieldLength: 0, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '扫描光学指标>=300DPI' },
      { id: 'ph_9', fieldCode: 'exifMetadata', isSystem: false, chineseName: '相机EXIF参数', fieldType: '字符型', fieldLength: 128, showInList: false, showInSearch: true, showInEntry: false, canEdit: false, isUnique: false, isRequired: false, remark: '镜头光圈快门ISO' },
      { id: 'ph_10', fieldCode: 'copyrightOwner', isSystem: false, chineseName: '著作版权归属', fieldType: '字符型', fieldLength: 64, showInList: true, showInSearch: true, showInEntry: true, canEdit: true, isUnique: false, isRequired: false, remark: '数字版权持有机构' },
    ],
  };

  // 档案类型管理状态
  const [archiveTypeNodes, setArchiveTypeNodes] = useState<ArchiveTypeNode[]>(initialArchiveTypeNodes);
  const [selectedTypeId, setSelectedTypeId] = useState<string>('ws_doc_file'); // 默认选中 文书档案（文件）- 文件
  const [expandedTypeIds, setExpandedTypeIds] = useState<string[]>(['root_type', 'ws_doc', 'ws_box', 'eng_proj', 'acc_fonds']);
  const [archiveFieldsMap, setArchiveFieldsMap] = useState<Record<string, ArchiveFieldItem[]>>(initialArchiveFieldsMap);
  const [selectedFieldIds, setSelectedFieldIds] = useState<string[]>([]);
  const [typeSearch, setTypeSearch] = useState<string>('');
  const [typePage, setTypePage] = useState<number>(1);

  // 档案类型模态框
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = useState<boolean>(false);
  const [newTypeName, setNewTypeName] = useState<string>('');
  const [newTypeCode, setNewTypeCode] = useState<string>('');
  const [newTypeParentId, setNewTypeParentId] = useState<string>('root_type');
  const [newTypeLevelTag, setNewTypeLevelTag] = useState<string>('文件级');

  // 著录字段添加 / 编辑模态框
  const [isFieldModalOpen, setIsFieldModalOpen] = useState<boolean>(false);
  const [fieldModalMode, setFieldModalMode] = useState<'add' | 'edit' | 'detail'>('add');
  const [currentFieldItem, setCurrentFieldItem] = useState<ArchiveFieldItem | null>(null);

  // 字段表单输入状态
  const [fieldFormCode, setFieldFormCode] = useState<string>('');
  const [fieldFormChineseName, setFieldFormChineseName] = useState<string>('');
  const [fieldFormType, setFieldFormType] = useState<string>('字符型');
  const [fieldFormLength, setFieldFormLength] = useState<number>(64);
  const [fieldFormShowInList, setFieldFormShowInList] = useState<boolean>(true);
  const [fieldFormShowInSearch, setFieldFormShowInSearch] = useState<boolean>(true);
  const [fieldFormShowInEntry, setFieldFormShowInEntry] = useState<boolean>(true);
  const [fieldFormCanEdit, setFieldFormCanEdit] = useState<boolean>(true);
  const [fieldFormIsUnique, setFieldFormIsUnique] = useState<boolean>(false);
  const [fieldFormIsRequired, setFieldFormIsRequired] = useState<boolean>(false);
  const [fieldFormRemark, setFieldFormRemark] = useState<string>('');

  // 系统字段删除拦截警告弹窗
  const [systemFieldWarning, setSystemFieldWarning] = useState<{ open: boolean; systemFields: string[] } | null>(null);

  // 删除自定义字段确认弹窗
  const [deleteFieldsConfirm, setDeleteFieldsConfirm] = useState<{ open: boolean; ids: string[]; names: string[] } | null>(null);
  const [singleFieldToDelete, setSingleFieldToDelete] = useState<ArchiveFieldItem | null>(null);


  // ==========================================
  // 3. 分类设置 (setting_classification)
  // ==========================================
  const classTree = [
    { id: 'DQ', name: '党群工作类', count: 6 },
    { id: 'XZ', name: '行政管理类', count: 8 },
    { id: 'YW', name: '业务工作类', count: 12 },
    { id: 'WS', name: '外事活动类', count: 4 },
    { id: 'SB', name: '资产设备类', count: 5 },
    { id: 'CW', name: '财会审计类', count: 7 },
  ];
  const [selectedClassId, setSelectedClassId] = useState('XZ');

  const classDetailData: Record<string, any[]> = {
    DQ: [
      { id: 'DQ11', code: 'DQ11', name: '党委会会议记录与决议', retention: '永久', range: '党委会决定、政治决议、议案纪要', sort: 1, date: '2026-11-02' },
      { id: 'DQ12', code: 'DQ12', name: '基层党组织建设与换届选举', retention: '30年', range: '支部设立批复、换届选举报告、党费收缴凭据', sort: 2, date: '2026-11-02' },
      { id: 'DQ13', code: 'DQ13', name: '纪检巡视与廉政监督工作', retention: '永久', range: '党风廉政建设责任制、监督执纪审查结论', sort: 3, date: '2026-11-02' },
      { id: 'DQ14', code: 'DQ14', name: '工会、共青团与群团组织工作', retention: '10年', range: '工会会员代表大会、青年志愿者活动方案', sort: 4, date: '2026-11-03' },
      { id: 'DQ15', code: 'DQ15', name: '统战与对台港澳工作事务', retention: '30年', range: '统战对象联谊、海外华侨交流合作档案', sort: 5, date: '2026-11-03' },
      { id: 'DQ16', code: 'DQ16', name: '思想政治宣传与意识形态专项', retention: '30年', range: '意识形态研判报告、中心组理论学习台账', sort: 6, date: '2026-11-04' },
    ],
    XZ: [
      { id: 'XZ11', code: 'XZ11', name: '局长办公会与党组会纪要', retention: '永久', range: '行政办公例会、重大三重一大决策决议', sort: 1, date: '2026-11-02' },
      { id: 'XZ12', code: 'XZ12', name: '年度综合发展规划与工作总结', retention: '永久', range: '国民经济五年规划分解、年度总体工作总结', sort: 2, date: '2026-11-02' },
      { id: 'XZ13', code: 'XZ13', name: '规章制度与规范性文件制定', retention: '永久', range: '局内管理规范、面向社会颁布的行政规范文件', sort: 3, date: '2026-11-03' },
      { id: 'XZ14', code: 'XZ14', name: '机构编制与干部人事调配', retention: '永久', range: '三定方案、处室职责设定、领导任免批复', sort: 4, date: '2026-11-03' },
      { id: 'XZ15', code: 'XZ15', name: '政务公开与信息公开答复', retention: '10年', range: '主动公开台账、依申请公开答复书卷宗', sort: 5, date: '2026-11-04' },
      { id: 'XZ16', code: 'XZ16', name: '机要保密与密码通信管理', retention: '30年', range: '保密审查表、商业秘密界定、涉密载体销毁清册', sort: 6, date: '2026-11-04' },
      { id: 'XZ17', code: 'XZ17', name: '信访举报与热线督查督办', retention: '10年', range: '12345热线交办单、群众信访处理答复书', sort: 7, date: '2026-11-05' },
      { id: 'XZ18', code: 'XZ18', name: '后勤保障与安全生产责任制', retention: '10年', range: '机关后勤采购合同、消防安全检查记录', sort: 8, date: '2026-11-05' },
      { id: 'XZ19', code: 'XZ19', name: '重大突发公共事件应急处置', retention: '永久', range: '应急预案编制、突发事件指挥协调纪要', sort: 9, date: '2026-11-05' },
      { id: 'XZ20', code: 'XZ20', name: '督查督办与绩效考核通报', retention: '30年', range: '市委市政府重点目标考核、平时绩效评分', sort: 10, date: '2026-11-06' },
      { id: 'XZ21', code: 'XZ21', name: '法治政府建设与行政复议应诉', retention: '永久', range: '行政复议决定书、行政诉讼代理与法院判决', sort: 11, date: '2026-11-06' },
    ],
    YW: [
      { id: 'YW11', code: 'YW11', name: '重大产业项目投资审批审批件', retention: '永久', range: '发改立项批复、产业基金投资审议决议', sort: 1, date: '2026-11-03' },
      { id: 'YW12', code: 'YW12', name: '国土空间总体规划与土地指标', retention: '永久', range: '三区三线划定图件、土地规划审批红线', sort: 2, date: '2026-11-03' },
      { id: 'YW13', code: 'YW13', name: '高新技术企业认定与科技补贴', retention: '30年', range: '企业申报书、专家评审意见、财政补贴下达', sort: 3, date: '2026-11-04' },
      { id: 'YW14', code: 'YW14', name: '城市基础设施重大工程监理档案', retention: '永久', range: '开工报告、隐蔽工程验收记录、竣工决算', sort: 4, date: '2026-11-04' },
      { id: 'YW15', code: 'YW15', name: '智慧蓉城城市大脑算力枢纽建设', retention: '永久', range: '架构设计书、数据中台验收、信息系统密评', sort: 5, date: '2026-11-05' },
      { id: 'YW16', code: 'YW16', name: '生态环境保护综合执法巡查卷宗', retention: '30年', range: '排污许可核发、生态督察整改销号台账', sort: 6, date: '2026-11-05' },
    ],
    WS: [
      { id: 'WS11', code: 'WS11', name: '国际友好城市缔结与交往协议', retention: '永久', range: '缔结协议书、互访备忘录、使节礼品清单', sort: 1, date: '2026-11-03' },
      { id: 'WS12', code: 'WS12', name: '重大国际展会及领事馆互通公函', retention: '30年', range: '驻蓉领馆来函、国际友城交流日活动纪要', sort: 2, date: '2026-11-04' },
      { id: 'WS13', code: 'WS13', name: '公务出国境审批与出访报告', retention: '10年', range: '出国任务批件、因公护照收缴与考察总结', sort: 3, date: '2026-11-04' },
      { id: 'WS14', code: 'WS14', name: '外事接待与涉外重大安全保障', retention: '30年', range: '接待方案、礼宾安排、涉外安保专项预案', sort: 4, date: '2026-11-05' },
    ],
    SB: [
      { id: 'SB11', code: 'SB11', name: '服务器与核心交换机固定资产', retention: '30年', range: '设备采购发票、出厂检测合格证、维保协议', sort: 1, date: '2026-11-02' },
      { id: 'SB12', code: 'SB12', name: '智能密集架与恒温恒湿空调机组', retention: '30年', range: '安装工程图、消防联动调试报告、年检证书', sort: 2, date: '2026-11-03' },
      { id: 'SB13', code: 'SB13', name: '高速非接触式档案扫描仪系统', retention: '10年', range: '软件授权许可、光学镜头标定档案', sort: 3, date: '2026-11-04' },
    ],
    CW: [
      { id: 'CW11', code: 'CW11', name: '年度财政预决算及部门决算报告', retention: '永久', range: '市人大审议通过的预算书、决算公开批复', sort: 1, date: '2026-11-01' },
      { id: 'CW12', code: 'CW12', name: '原始会计凭证与电子发票归档包', retention: '30年', range: '记账凭证、银行电子对账单、XML发票', sort: 2, date: '2026-11-02' },
      { id: 'CW13', code: 'CW13', name: '总账、明细账及会计科目日记账', retention: '30年', range: '年度打印总账册、电子明细账哈希归档包', sort: 3, date: '2026-11-03' },
    ]
  };

  const currentClassItems = classDetailData[selectedClassId] || [];
  const [classPage, setClassPage] = useState(1);

  // ==========================================
  // 4. 目录树维护 (setting_catalog_tree)
  // ==========================================
  const catalogTreeNodes = [
    { id: 'N-01', code: 'ROOT', name: '成都市数字档案馆藏总库', level: '根节点', fonds: '全部全宗 (12个)', type: '系统虚拟根', sort: 1, auth: '全员可见', status: '正常' },
    { id: 'N-02', code: '0001-WS', name: '市委办公厅文书档案库', level: '全宗门类', fonds: '0001 中共成都市委办公厅', type: '实体数据树', sort: 2, auth: '部门授权', status: '正常' },
    { id: 'N-03', code: '0001-WS-2026', name: '2026年度归档文件', level: '年度节点', fonds: '0001 中共成都市委办公厅', type: '动态聚合树', sort: 3, auth: '部门授权', status: '正常' },
    { id: 'N-04', code: '0002-WS', name: '市人民政府办公厅文书档案库', level: '全宗门类', fonds: '0002 成都市人民政府办公厅', type: '实体数据树', sort: 4, auth: '部门授权', status: '正常' },
    { id: 'N-05', code: '0003-JJ', name: '市发改委重大基建项目档案库', level: '全宗门类', fonds: '0003 成都市发展和改革委员会', type: '实体数据树', sort: 5, auth: '专案授权', status: '正常' },
    { id: 'N-06', code: '0006-KJ', name: '市财政局财政会计档案专库', level: '全宗门类', fonds: '0006 成都市财政局', type: '实体数据树', sort: 6, auth: '财务密级', status: '正常' },
    { id: 'N-07', code: '0007-GZ', name: '市规自局测绘地理空间档案库', level: '全宗门类', fonds: '0007 成都市规划和自然资源局', type: 'GIS挂接', sort: 7, auth: '专案授权', status: '正常' },
    { id: 'N-08', code: 'ZT-GREEN', name: '“雪山下的公园城市”生态文明专题库', level: '虚拟专题', fonds: '全馆多全宗自动归集', type: '智能检索树', sort: 8, auth: '馆内公开', status: '正常' },
    { id: 'N-09', code: 'ZT-METRO', name: '成都城市轨道交通建设工程特藏', level: '虚拟专题', fonds: '多单位联合全宗', type: '专案专题', sort: 9, auth: '馆内公开', status: '正常' },
    { id: 'N-10', code: 'TC-HISTORY', name: '成都历史文化名城珍贵地情档案', level: '特藏文献', fonds: '名城保护中心全宗', type: '数字化珍藏', sort: 10, auth: '全员受限', status: '正常' },
    { id: 'N-11', code: 'N-EXPIRE', name: '到期待鉴定与销毁暂存库', level: '系统管理', fonds: '系统隔离容器', type: '流程节点', sort: 11, auth: '仅三员', status: '受控运行' },
  ];
  const [treeList, setTreeList] = useState(catalogTreeNodes);
  const [treePage, setTreePage] = useState(1);

  // ==========================================
  // 5. 保管期限 (setting_retention_period) - 依据截图还原版本列表体系
  // ==========================================
  interface RetentionVersion {
    id: string;
    name: string;
    isDefault: boolean;
    code: string;
    publishDate: string;
    description: string;
  }

  interface RetentionPeriodItem {
    id: string;
    code: string;
    name: string;
    years: number;
    remark: string;
  }

  const initialRetentionVersions: RetentionVersion[] = [
    { id: 'ver_1', name: '第一版 (默认)', isDefault: true, code: 'GB-2026-V1', publishDate: '2026-11-01', description: '国家档案局8号令《机关文件材料归档范围和文书档案保管期限规定》执行的标准基准版本' },
    { id: 'ver_2', name: '第二版', isDefault: false, code: 'GB-2026-V2', publishDate: '2026-11-03', description: '重点工程建设项目及科技研发专项档案扩展保管期限体系' },
    { id: 'ver_3', name: '第三版', isDefault: false, code: 'GB-2026-V3', publishDate: '2026-11-05', description: '财政部与国家档案局第79号令《会计档案管理办法》及涉密档案专用版本' },
  ];

  const initialRetentionItemsMap: Record<string, RetentionPeriodItem[]> = {
    // 第一版 (默认) - 严格依截图前三项 (D10 10年 10, D30 30年 30, Y 永久 9999) 并补充真实合规数据至16条 (每页严格10条)
    ver_1: [
      { id: 'ret_1_1', code: 'D10', name: '10年', years: 10, remark: '依据国家档案局第8号令，适用于机关一般行政事务公文、通用通知及日常管理记录' },
      { id: 'ret_1_2', code: 'D30', name: '30年', years: 30, remark: '依据国家档案局第8号令，适用于反映机关主要业务、中长期发展规划及重大履职文件' },
      { id: 'ret_1_3', code: 'Y', name: '永久', years: 9999, remark: '反映机关主要职能活动、代表性成果、具有长远利用价值的核心公文与历史档案' },
      { id: 'ret_1_4', code: 'D5', name: '5年', years: 5, remark: '机关内部事务备忘、普发性公文参考材料及一般性日常考勤统计' },
      { id: 'ret_1_5', code: 'D15', name: '15年', years: 15, remark: '部门专项业务总结、中短期科研课题记录及一般经济合同协议' },
      { id: 'ret_1_6', code: 'D20', name: '20年', years: 20, remark: '固定资产投资台账、一般基建修缮记录及重要仪器设备使用履历' },
      { id: 'ret_1_7', code: 'D25', name: '25年', years: 25, remark: '重大采购招标文件、阶段性质量验收评估报告及业务往来清册' },
      { id: 'ret_1_8', code: 'D50', name: '50年', years: 50, remark: '重大水利、交通等重大基础设施建设全过程特种工程档案' },
      { id: 'ret_1_9', code: 'D60', name: '60年', years: 60, remark: '城市规划控制性详规、不动产权籍调查及土地征收补偿卷宗' },
      { id: 'ret_1_10', code: 'D100', name: '100年', years: 100, remark: '具有重大区域历史意义的名人档案、建市建区重大文史特藏' },
      { id: 'ret_1_11', code: 'KJ30', name: '会计凭证30年', years: 30, remark: '《会计档案管理办法》原始凭证、记账凭证及总账明细账' },
      { id: 'ret_1_12', code: 'KJ10', name: '月度财务报告10年', years: 10, remark: '月度与季度财务会计报表、银行对账单及银行存款余额调节表' },
      { id: 'ret_1_13', code: 'KJ-Y', name: '会计决算永久', years: 9999, remark: '年度财务决算会计报表、财政审计查账结论报告及会计档案保管清册' },
      { id: 'ret_1_14', code: 'SPE-RS', name: '干部人事终生', years: 9999, remark: '干部职工履历表、自传、鉴定考核材料及退休离职终生档案' },
      { id: 'ret_1_15', code: 'MED-50', name: '重大病案50年', years: 50, remark: '三级甲等综合医院重大手术病历、罕见病临床医学研究案卷' },
      { id: 'ret_1_16', code: 'TEMP', name: '临时留存1年', years: 1, remark: '归档待整理过渡性文件、暂未定密复核材料及收文登记清册' },
    ],
    // 第二版 - 重点工程与科研体系 (12条，分页生效)
    ver_2: [
      { id: 'ret_2_1', code: 'D10', name: '10年', years: 10, remark: '工程施工日常日志、监理周报、普通材料进场检验单据' },
      { id: 'ret_2_2', code: 'D30', name: '30年', years: 30, remark: '单项工程竣工验收记录、分部工程质量验评报告及关键设计图纸' },
      { id: 'ret_2_3', code: 'Y', name: '永久', years: 9999, remark: '工程立项批文、全套工程综合竣工图纸、地质勘察总报告及主体结构隐蔽工程记录' },
      { id: 'ret_2_4', code: 'ENG-50', name: '特种工程50年', years: 50, remark: '城市地下管网综合管廊工程、特大桥梁隧道生命周期维保档案' },
      { id: 'ret_2_5', code: 'ENG-20', name: '设备安装20年', years: 20, remark: '机电设备开箱验收记录、强电弱电隐蔽布线图及运行调试报告' },
      { id: 'ret_2_6', code: 'TECH-Y', name: '科技发明永久', years: 9999, remark: '国家与部级重大科技研发课题结题证书、核心发明专利技术成果及原始实验记录' },
      { id: 'ret_2_7', code: 'TECH-30', name: '科研成果30年', years: 30, remark: '企事业单位技术革新方案、软件著作权申请书及行业技术规范研制报告' },
      { id: 'ret_2_8', code: 'TECH-10', name: '试验测试10年', years: 10, remark: '阶段性科学试验测试报告、原型样机测试数据及环境可靠性检测记录' },
      { id: 'ret_2_9', code: 'ENV-30', name: '环评监测30年', years: 30, remark: '重大建设项目环境影响评价报告、碳排放核查报告及水土保持专项验收批复' },
      { id: 'ret_2_10', code: 'SAFETY-Y', name: '安全责任永久', years: 9999, remark: '安全生产主体责任全过程追溯档案、危化品特种监管及重大事故调查处理结论' },
      { id: 'ret_2_11', code: 'BID-15', name: '招投标标书15年', years: 15, remark: '工程公开招标投标文件、专家评审打分记录及中标通知书与合同协议' },
      { id: 'ret_2_12', code: 'SURVEY-20', name: '测绘成果20年', years: 20, remark: '工程施工控制网测绘成果、沉降观测与变形位移定期监测报告' },
    ],
    // 第三版 - 财会审计与特种资产 (14条，分页生效)
    ver_3: [
      { id: 'ret_3_1', code: 'KJ-D30', name: '会计凭证30年', years: 30, remark: '会计凭证（原始凭证、记账凭证）、总账、明细账、日记账及其他辅助性账簿' },
      { id: 'ret_3_2', code: 'KJ-D10', name: '财务报告10年', years: 10, remark: '月度、季度、半年度财务会计报告、银行对账单、银行存款余额调节表' },
      { id: 'ret_3_3', code: 'KJ-Y', name: '会计决算永久', years: 9999, remark: '年度财务会计报告（决算）、会计档案保管清册、会计档案销毁清册、会计档案鉴定意见书' },
      { id: 'ret_3_4', code: 'TAX-30', name: '涉税发票30年', years: 30, remark: '增值税专用发票存根联、出口退税凭证及税企电子数据对账包' },
      { id: 'ret_3_5', code: 'AUDIT-Y', name: '国家审计永久', years: 9999, remark: '审计署与特派办国家重大政策落实审计报告、领导干部经济责任审计结论' },
      { id: 'ret_3_6', code: 'AUDIT-30', name: '专项审计30年', years: 30, remark: '企业年度财务报表外部审计报告、重大投资并购尽职调查审计底稿' },
      { id: 'ret_3_7', code: 'AUDIT-10', name: '内部审计10年', years: 10, remark: '机关企事业单位内部日常审计底稿、内控体系符合性测试报告' },
      { id: 'ret_3_8', code: 'CAPITAL-Y', name: '产权资本永久', years: 9999, remark: '企业设立验资报告、国有资产产权登记证及股权转让重大决议' },
      { id: 'ret_3_9', code: 'PAYROLL-30', name: '工资薪金30年', years: 30, remark: '单位工资发放明细表、社会保险及住房公积金代扣代缴清册' },
      { id: 'ret_3_10', code: 'CONTRACT-30', name: '重大合同30年', years: 30, remark: '标的额重大的经济贸易合同、战略合作协议及涉外涉港澳台合同' },
      { id: 'ret_3_11', code: 'CUSTOM-15', name: '海关报关15年', years: 15, remark: '进出口货物报关单据、原产地证明及海关保税监管台账' },
      { id: 'ret_3_12', code: 'BONDS-30', name: '债券发行30年', years: 30, remark: '企业债券、中期票据发行全套法律意见书、评级报告及兑付凭证' },
      { id: 'ret_3_13', code: 'ASSET-20', name: '资产盘点20年', years: 20, remark: '国有资产全面清查盘点报告、资产报废核销批复及损失认定清册' },
      { id: 'ret_3_14', code: 'TEMP-KJ', name: '财务过渡1年', years: 1, remark: '日常差旅报销暂存票据、零星办公备用金借支条及财务收据存根' },
    ],
  };

  const [retentionVersions, setRetentionVersions] = useState<RetentionVersion[]>(initialRetentionVersions);
  const [selectedRetentionVerId, setSelectedRetentionVerId] = useState<string>('ver_1');
  const [retentionItemsMap, setRetentionItemsMap] = useState<Record<string, RetentionPeriodItem[]>>(initialRetentionItemsMap);
  const [selectedRetentionItemIds, setSelectedRetentionItemIds] = useState<string[]>([]);
  const [retentionSearch, setRetentionSearch] = useState<string>('');
  const [retentionPage, setRetentionPage] = useState<number>(1);
  const [isVersionTreeExpanded, setIsVersionTreeExpanded] = useState<boolean>(true);

  // 版本创建模态框
  const [isAddVersionModalOpen, setIsAddVersionModalOpen] = useState<boolean>(false);
  const [newVersionName, setNewVersionName] = useState<string>('');
  const [newVersionCode, setNewVersionCode] = useState<string>('');
  const [newVersionIsDefault, setNewVersionIsDefault] = useState<boolean>(false);
  const [newVersionDesc, setNewVersionDesc] = useState<string>('');

  // 保管期限添加 / 编辑模态框
  const [isRetentionItemModalOpen, setIsRetentionItemModalOpen] = useState<boolean>(false);
  const [retentionModalMode, setRetentionModalMode] = useState<'add' | 'edit' | 'detail'>('add');
  const [currentRetentionItem, setCurrentRetentionItem] = useState<RetentionPeriodItem | null>(null);

  const [retentionFormCode, setRetentionFormCode] = useState<string>('');
  const [retentionFormName, setRetentionFormName] = useState<string>('');
  const [retentionFormYears, setRetentionFormYears] = useState<number>(10);
  const [retentionFormRemark, setRetentionFormRemark] = useState<string>('');

  // 删除保管期限模态框
  const [deleteRetentionConfirm, setDeleteRetentionConfirm] = useState<{ open: boolean; ids: string[]; names: string[] } | null>(null);
  const [singleRetentionToDelete, setSingleRetentionToDelete] = useState<RetentionPeriodItem | null>(null);

  // 保管期限计算与交互函数
  const currentRetentionVersion =
    retentionVersions.find((v) => v.id === selectedRetentionVerId) || retentionVersions[0];
  const allCurrentRetentionItems = retentionItemsMap[selectedRetentionVerId] || [];

  const filteredRetentionItems = allCurrentRetentionItems.filter((item) => {
    if (!retentionSearch.trim()) return true;
    const q = retentionSearch.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      String(item.years).includes(q) ||
      item.remark.toLowerCase().includes(q)
    );
  });

  const paginatedRetentionItems = filteredRetentionItems.slice(
    (retentionPage - 1) * PAGE_SIZE,
    retentionPage * PAGE_SIZE
  );

  const handleToggleSelectAllRetention = () => {
    const currentPageIds = paginatedRetentionItems.map((item) => item.id);
    const allSelected = currentPageIds.every((id) => selectedRetentionItemIds.includes(id));
    if (allSelected) {
      setSelectedRetentionItemIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedRetentionItemIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleToggleSelectRetentionItem = (id: string) => {
    setSelectedRetentionItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenAddRetentionModal = () => {
    setRetentionModalMode('add');
    setCurrentRetentionItem(null);
    setRetentionFormCode('');
    setRetentionFormName('');
    setRetentionFormYears(10);
    setRetentionFormRemark('');
    setIsRetentionItemModalOpen(true);
  };

  const handleOpenEditRetentionModal = (item?: RetentionPeriodItem) => {
    const target =
      item ||
      (selectedRetentionItemIds.length > 0
        ? allCurrentRetentionItems.find((r) => r.id === selectedRetentionItemIds[0])
        : null);

    if (!target) {
      onShowMessage('请先在表格左侧勾选要编辑的保管期限！');
      return;
    }

    setCurrentRetentionItem(target);
    setRetentionModalMode('edit');
    setRetentionFormCode(target.code);
    setRetentionFormName(target.name);
    setRetentionFormYears(target.years);
    setRetentionFormRemark(target.remark);
    setIsRetentionItemModalOpen(true);
  };

  const handleSaveRetentionSubmit = () => {
    if (!retentionFormCode.trim() || !retentionFormName.trim()) {
      onShowMessage('请填写保管期限编码与名称！');
      return;
    }

    if (retentionModalMode === 'add') {
      const newItem: RetentionPeriodItem = {
        id: `ret_${Date.now()}`,
        code: retentionFormCode.trim().toUpperCase(),
        name: retentionFormName.trim(),
        years: Number(retentionFormYears) || 0,
        remark: retentionFormRemark.trim() || '依据档案管理规范设定的保管期限标准',
      };
      setRetentionItemsMap((prev) => ({
        ...prev,
        [selectedRetentionVerId]: [...(prev[selectedRetentionVerId] || []), newItem],
      }));
      setIsRetentionItemModalOpen(false);
      onShowMessage(`已成功新增保管期限【${newItem.name}】！`);
    } else if (retentionModalMode === 'edit' && currentRetentionItem) {
      setRetentionItemsMap((prev) => ({
        ...prev,
        [selectedRetentionVerId]: (prev[selectedRetentionVerId] || []).map((item) =>
          item.id === currentRetentionItem.id
            ? {
                ...item,
                code: retentionFormCode.trim().toUpperCase(),
                name: retentionFormName.trim(),
                years: Number(retentionFormYears) || 0,
                remark: retentionFormRemark.trim(),
              }
            : item
        ),
      }));
      setIsRetentionItemModalOpen(false);
      onShowMessage(`已成功修改保管期限【${retentionFormName}】！`);
    }
  };

  const handleDeleteSelectedRetention = () => {
    if (selectedRetentionItemIds.length === 0) {
      onShowMessage('请先在表格左侧勾选要删除的保管期限！');
      return;
    }
    const targetItems = allCurrentRetentionItems.filter((r) => selectedRetentionItemIds.includes(r.id));
    setDeleteRetentionConfirm({
      open: true,
      ids: selectedRetentionItemIds,
      names: targetItems.map((t) => `${t.name} (${t.code})`),
    });
  };

  const handleConfirmDeleteRetention = () => {
    if (!deleteRetentionConfirm) return;
    setRetentionItemsMap((prev) => ({
      ...prev,
      [selectedRetentionVerId]: (prev[selectedRetentionVerId] || []).filter(
        (item) => !deleteRetentionConfirm.ids.includes(item.id)
      ),
    }));
    setSelectedRetentionItemIds([]);
    setDeleteRetentionConfirm(null);
    onShowMessage('已成功删除所选保管期限！');
  };

  const handleSingleRetentionDelete = (item: RetentionPeriodItem) => {
    setSingleRetentionToDelete(item);
  };

  const handleConfirmSingleRetentionDelete = () => {
    if (!singleRetentionToDelete) return;
    setRetentionItemsMap((prev) => ({
      ...prev,
      [selectedRetentionVerId]: (prev[selectedRetentionVerId] || []).filter(
        (item) => item.id !== singleRetentionToDelete.id
      ),
    }));
    const name = singleRetentionToDelete.name;
    setSingleRetentionToDelete(null);
    onShowMessage(`已成功删除保管期限【${name}】！`);
  };

  const handleAddNewRetentionVersion = () => {
    if (!newVersionName.trim()) {
      onShowMessage('请填写版本名称！');
      return;
    }
    const newVerId = `ver_${Date.now()}`;
    const newVer: RetentionVersion = {
      id: newVerId,
      name: newVersionName.trim(),
      isDefault: newVersionIsDefault,
      code: newVersionCode.trim() || `GB-2026-V${retentionVersions.length + 1}`,
      publishDate: '2026-11-06',
      description: newVersionDesc.trim() || '依据档案管理条例制定的业务保管期限版本',
    };

    setRetentionVersions((prev) => {
      if (newVersionIsDefault) {
        return [...prev.map((v) => ({ ...v, isDefault: false })), newVer];
      }
      return [...prev, newVer];
    });

    setRetentionItemsMap((prev) => ({
      ...prev,
      [newVerId]: [...(prev['ver_1'] || [])],
    }));

    setSelectedRetentionVerId(newVerId);
    setSelectedRetentionItemIds([]);
    setRetentionPage(1);
    setIsAddVersionModalOpen(false);
    onShowMessage(`已成功设立保管期限新版本【${newVer.name}】！`);
  };

  // ==========================================
  // 6. 密级 (setting_security_level) - 依据截图还原版本列表体系
  // ==========================================
  interface SecurityVersion {
    id: string;
    name: string;
    isDefault: boolean;
    code: string;
    publishDate: string;
    description: string;
  }

  interface SecurityLevelItem {
    id: string;
    code: string; // 3, 2, 1, 0, 4, 5...
    name: string; // 绝密, 机密, 秘密, 公开, 内部...
    years: number; // 3, 2, 1, 5, 10, 20, 30, 0...
    remark: string;
  }

  const initialSecurityVersions: SecurityVersion[] = [
    { id: 'sec_ver_1', name: '第一版 (默认)', isDefault: true, code: 'SEC-2026-V1', publishDate: '2026-11-01', description: '国家保密局《保守国家秘密法》及政企档案定密工作基准版本' },
    { id: 'sec_ver_2', name: '第二版', isDefault: false, code: 'SEC-2026-V2', publishDate: '2026-11-03', description: '重点国防科技、涉密军工科研与关键基础设施保密体系版本' },
    { id: 'sec_ver_3', name: '第三版', isDefault: false, code: 'SEC-2026-V3', publishDate: '2026-11-05', description: '国密SM4硬件加密体系与重要行政执法、司法及专案特管版本' },
  ];

  const initialSecurityItemsMap: Record<string, SecurityLevelItem[]> = {
    // 第一版 (默认) - 严格依截图前三项 (3 绝密 3, 2 机密 2, 1 秘密 1) 并补充真实合规数据至16条 (每页严格10条)
    sec_ver_1: [
      { id: 'sec_1_1', code: '3', name: '绝密', years: 3, remark: '国家最高秘密等级，关系国家特别重大安全与根本利益，专人专机专库物理隔绝特管' },
      { id: 'sec_1_2', code: '2', name: '机密', years: 2, remark: '国家重要秘密等级，关系国家安全和重大利益，受控网络环境及国密SM4加密管控' },
      { id: 'sec_1_3', code: '1', name: '秘密', years: 1, remark: '国家一般秘密等级，泄露会使国家安全和利益遭受损害，定密责任人与授权人员调阅' },
      { id: 'sec_1_4', code: '0', name: '公开', years: 0, remark: '主动公开与依申请公开政务档案，全网全员可检索查阅并提供出证溯源码' },
      { id: 'sec_1_5', code: '4', name: '内部', years: 5, remark: '机关内部工作事务公文，仅限本馆及移交单位依职能授权查阅，强制动态水印' },
      { id: 'sec_1_6', code: '5', name: '工作秘密', years: 5, remark: '机关行政履行职责中产生的不宜公开事项，内部专班流转，禁止互联网传播' },
      { id: 'sec_1_7', code: '6', name: '商业秘密-核心', years: 10, remark: '企事业单位关键核心技术配方、招投标底价及重大商业谈判协议，签署保密协议查阅' },
      { id: 'sec_1_8', code: '7', name: '个人敏感信息(PII)', years: 30, remark: '涉及公民个人生物特征、身份证、健康生理隐私及重大涉案笔录，严格脱敏处理' },
      { id: 'sec_1_9', code: '8', name: '专案特别受控', years: 20, remark: '纪检监察审查调查、重大专项巡视卷宗，独立物理光闸传输与双人双锁审签' },
      { id: 'sec_1_10', code: '9', name: '未定密文件(待定密)', years: 1, remark: '归档初审流转阶段临时管控标识，归档入库30日内必须由定密责任人完成定密' },
      { id: 'sec_1_11', code: '10', name: '解密开放档案', years: 0, remark: '保密期满经馆藏解密评审委员会审核通过，面向社会公众依法一体化开放利用' },
      { id: 'sec_1_12', code: '11', name: '知识产权与版权保护', years: 50, remark: '拥有独立版权的科研图纸、专著手稿、数字音视频原件，受知识产权法保护' },
      { id: 'sec_1_13', code: '12', name: '城市基础设施关键信息', years: 30, remark: '城市地下管网、特大桥梁隐蔽结构等涉及公共安全及防灾应急的关键工程图档' },
      { id: 'sec_1_14', code: '13', name: '特种涉外公文档案', years: 20, remark: '涉及双边多边国际合作、涉外涉港澳台重要外交领事档案，执行外事保密纪律' },
      { id: 'sec_1_15', code: '14', name: '历史特藏孤本凭证', years: 100, remark: '珍贵革命历史文献、清代民国孤本珍本原件，执行数字化特藏保护与恒温恒湿金库管理' },
      { id: 'sec_1_16', code: '15', name: '涉密载体销毁留存清册', years: 30, remark: '国家秘密载体物理销毁交接单、监销记录及密码机解密日志存根' },
    ],
    // 第二版 - 重点国防科技与关键基础设施保密体系 (12条，分页生效)
    sec_ver_2: [
      { id: 'sec_2_1', code: '3', name: '绝密(核心国防)', years: 3, remark: '国家重大战略武器装备研发总图样及关键控制算法源代码' },
      { id: 'sec_2_2', code: '2', name: '机密(专项试验)', years: 2, remark: '涉密外场遥测实验原始数据、高精度弹道遥测参数记录' },
      { id: 'sec_2_3', code: '1', name: '秘密(协作配套)', years: 1, remark: '军民融合协作配套元器件采购清单及技术指标检测合格证' },
      { id: 'sec_2_4', code: 'A1', name: '战略基础设施A级', years: 30, remark: '国家电网超高压特高压枢纽变电站核心拓扑网络施工图' },
      { id: 'sec_2_5', code: 'A2', name: '战略交通枢纽B级', years: 20, remark: '国际大型枢纽机场空管指挥塔台精密导航设备布防档案' },
      { id: 'sec_2_6', code: 'B1', name: '企业顶级商密', years: 10, remark: '稀土新材料提纯专利制备工艺配方及关键催化剂参数' },
      { id: 'sec_2_7', code: 'B2', name: '商务竞标底价', years: 5, remark: '跨国海外工程EPC总承包项目商务标投标报价核算底稿' },
      { id: 'sec_2_8', code: 'C1', name: '受限内部工作', years: 5, remark: '机关重要干部廉政档案抽查核实情况及离任审计通报' },
      { id: 'sec_2_9', code: 'C2', name: '政务依申请开放', years: 0, remark: '自然资源规划征地拆迁补偿协议卷宗按申请依规核验查阅' },
      { id: 'sec_2_10', code: 'D1', name: '解密开放地情文史', years: 0, remark: '经省市保密局审核解密的抗战历史文献及地方志珍贵原稿' },
      { id: 'sec_2_11', code: 'E1', name: '生物医药核心遗传数据', years: 50, remark: '中国人类遗传资源采集审批材料及重大传染病样本基因库' },
      { id: 'sec_2_12', code: 'T1', name: '跨部门协作暂定密', years: 1, remark: '联合执法检查专项行动形成材料流转期临时保护标识' },
    ],
    // 第三版 - 国密SM4与行政执法专案体系 (13条，分页生效)
    sec_ver_3: [
      { id: 'sec_3_1', code: 'SM4-JM', name: '绝密(国密甲级物理隔离)', years: 3, remark: '国密一级硬件加密机硬件保护、红黑物理电源隔离专用终端存储' },
      { id: 'sec_3_2', code: 'SM4-MM', name: '机密(硬件芯片加密)', years: 2, remark: '国密SM4-CBC 256bit专网高速加密传输、双因子动态Ukey身份核验' },
      { id: 'sec_3_3', code: 'SM4-BM', name: '秘密(全生命周期盲水印)', years: 1, remark: '数字版式OFD全帧隐形盲水印、溯源防拍摄防截屏防篡改保护' },
      { id: 'sec_3_4', code: 'LAW-01', name: '重大行政执法待结案', years: 5, remark: '生态环境重大污染事故行政处罚未公开取证笔录与现场勘验图' },
      { id: 'sec_3_5', code: 'LAW-02', name: '行政复议与应诉卷宗', years: 10, remark: '重大行政纠纷司法诉讼答辩状、法院二审与再审闭门庭审记录' },
      { id: 'sec_3_6', code: 'FIN-01', name: '特种财政转移支付', years: 15, remark: '国家战略物资储备财政调拨凭证、中央救灾储备粮调拨清册' },
      { id: 'sec_3_7', code: 'FIN-02', name: '跨境投融资审计', years: 10, remark: '主权财富基金跨境投资法律尽调底稿与汇率避险协议' },
      { id: 'sec_3_8', code: 'PII-01', name: '重大疾病患者隐私', years: 30, remark: '传染病专科医院重点监测病例病历与流行病学排查个案' },
      { id: 'sec_3_9', code: 'PII-02', name: '未成年人保护封存', years: 99, remark: '青少年司法保护专属档案、依法永久受控封存非经法定程序不得启封' },
      { id: 'sec_3_10', code: 'PUB-01', name: '政务主动公开服务', years: 0, remark: '成都市人民政府现行规章及行政规范性文件全库公开发布' },
      { id: 'sec_3_11', code: 'PUB-02', name: '民生查档出证专用', years: 0, remark: '面向群众调取婚姻登记、知青下乡、独生子女证跨馆通办' },
      { id: 'sec_3_12', code: 'TOPIC-01', name: '世园会重大活动文献', years: 10, remark: '重大国际展会筹备组织策划全套工作档案及赞助商合作细则' },
      { id: 'sec_3_13', code: 'VER-EXP', name: '期满自动移交公开', years: 0, remark: '内部管控期满经综合研判依法面向社会开放查阅的公文' },
    ],
  };

  const [securityVersions, setSecurityVersions] = useState<SecurityVersion[]>(initialSecurityVersions);
  const [selectedSecurityVerId, setSelectedSecurityVerId] = useState<string>('sec_ver_1');
  const [securityItemsMap, setSecurityItemsMap] = useState<Record<string, SecurityLevelItem[]>>(initialSecurityItemsMap);
  const [selectedSecurityItemIds, setSelectedSecurityItemIds] = useState<string[]>([]);
  const [securitySearch, setSecuritySearch] = useState<string>('');
  const [securityPage, setSecurityPage] = useState<number>(1);
  const [isSecurityVersionTreeExpanded, setIsSecurityVersionTreeExpanded] = useState<boolean>(true);

  // 版本创建模态框
  const [isAddSecurityVersionModalOpen, setIsAddSecurityVersionModalOpen] = useState<boolean>(false);
  const [newSecurityVerName, setNewSecurityVerName] = useState<string>('');
  const [newSecurityVerCode, setNewSecurityVerCode] = useState<string>('');
  const [newSecurityVerIsDefault, setNewSecurityVerIsDefault] = useState<boolean>(false);
  const [newSecurityVerDesc, setNewSecurityVerDesc] = useState<string>('');

  // 密级添加 / 编辑模态框
  const [isSecurityItemModalOpen, setIsSecurityItemModalOpen] = useState<boolean>(false);
  const [securityModalMode, setSecurityModalMode] = useState<'add' | 'edit' | 'detail'>('add');
  const [currentSecurityItem, setCurrentSecurityItem] = useState<SecurityLevelItem | null>(null);

  const [securityFormCode, setSecurityFormCode] = useState<string>('');
  const [securityFormName, setSecurityFormName] = useState<string>('');
  const [securityFormYears, setSecurityFormYears] = useState<number>(1);
  const [securityFormRemark, setSecurityFormRemark] = useState<string>('');

  // 删除密级模态框
  const [deleteSecurityConfirm, setDeleteSecurityConfirm] = useState<{ open: boolean; ids: string[]; names: string[] } | null>(null);
  const [singleSecurityToDelete, setSingleSecurityToDelete] = useState<SecurityLevelItem | null>(null);

  // 密级计算与交互函数
  const currentSecurityVersion =
    securityVersions.find((v) => v.id === selectedSecurityVerId) || securityVersions[0];
  const allCurrentSecurityItems = securityItemsMap[selectedSecurityVerId] || [];

  const filteredSecurityItems = allCurrentSecurityItems.filter((item) => {
    if (!securitySearch.trim()) return true;
    const q = securitySearch.toLowerCase();
    return (
      item.code.toLowerCase().includes(q) ||
      item.name.toLowerCase().includes(q) ||
      String(item.years).includes(q) ||
      item.remark.toLowerCase().includes(q)
    );
  });

  const paginatedSecurityItems = filteredSecurityItems.slice(
    (securityPage - 1) * PAGE_SIZE,
    securityPage * PAGE_SIZE
  );

  const handleToggleSelectAllSecurity = () => {
    const currentPageIds = paginatedSecurityItems.map((item) => item.id);
    const allSelected = currentPageIds.every((id) => selectedSecurityItemIds.includes(id));
    if (allSelected) {
      setSelectedSecurityItemIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedSecurityItemIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleToggleSelectSecurityItem = (id: string) => {
    setSelectedSecurityItemIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenAddSecurityModal = () => {
    setSecurityModalMode('add');
    setCurrentSecurityItem(null);
    setSecurityFormCode('');
    setSecurityFormName('');
    setSecurityFormYears(1);
    setSecurityFormRemark('');
    setIsSecurityItemModalOpen(true);
  };

  const handleOpenEditSecurityModal = (item?: SecurityLevelItem) => {
    const target =
      item ||
      (selectedSecurityItemIds.length > 0
        ? allCurrentSecurityItems.find((s) => s.id === selectedSecurityItemIds[0])
        : null);

    if (!target) {
      onShowMessage('请先在表格左侧勾选要编辑的密级！');
      return;
    }

    setCurrentSecurityItem(target);
    setSecurityModalMode('edit');
    setSecurityFormCode(target.code);
    setSecurityFormName(target.name);
    setSecurityFormYears(target.years);
    setSecurityFormRemark(target.remark);
    setIsSecurityItemModalOpen(true);
  };

  const handleSaveSecuritySubmit = () => {
    if (!securityFormCode.trim() || !securityFormName.trim()) {
      onShowMessage('请填写密级编码与名称！');
      return;
    }

    if (securityModalMode === 'add') {
      const newItem: SecurityLevelItem = {
        id: `sec_${Date.now()}`,
        code: securityFormCode.trim(),
        name: securityFormName.trim(),
        years: Number(securityFormYears) || 0,
        remark: securityFormRemark.trim() || '依据定密管理条例设定的密级标准',
      };
      setSecurityItemsMap((prev) => ({
        ...prev,
        [selectedSecurityVerId]: [...(prev[selectedSecurityVerId] || []), newItem],
      }));
      setIsSecurityItemModalOpen(false);
      onShowMessage(`已成功新增密级【${newItem.name}】！`);
    } else if (securityModalMode === 'edit' && currentSecurityItem) {
      setSecurityItemsMap((prev) => ({
        ...prev,
        [selectedSecurityVerId]: (prev[selectedSecurityVerId] || []).map((item) =>
          item.id === currentSecurityItem.id
            ? {
                ...item,
                code: securityFormCode.trim(),
                name: securityFormName.trim(),
                years: Number(securityFormYears) || 0,
                remark: securityFormRemark.trim(),
              }
            : item
        ),
      }));
      setIsSecurityItemModalOpen(false);
      onShowMessage(`已成功修改密级【${securityFormName}】！`);
    }
  };

  const handleDeleteSelectedSecurity = () => {
    if (selectedSecurityItemIds.length === 0) {
      onShowMessage('请先在表格左侧勾选要删除的密级！');
      return;
    }
    const targetItems = allCurrentSecurityItems.filter((s) => selectedSecurityItemIds.includes(s.id));
    setDeleteSecurityConfirm({
      open: true,
      ids: selectedSecurityItemIds,
      names: targetItems.map((t) => `${t.name} (编码 ${t.code})`),
    });
  };

  const handleConfirmDeleteSecurity = () => {
    if (!deleteSecurityConfirm) return;
    setSecurityItemsMap((prev) => ({
      ...prev,
      [selectedSecurityVerId]: (prev[selectedSecurityVerId] || []).filter(
        (item) => !deleteSecurityConfirm.ids.includes(item.id)
      ),
    }));
    setSelectedSecurityItemIds([]);
    setDeleteSecurityConfirm(null);
    onShowMessage('已成功删除所选密级！');
  };

  const handleSingleSecurityDelete = (item: SecurityLevelItem) => {
    setSingleSecurityToDelete(item);
  };

  const handleConfirmSingleSecurityDelete = () => {
    if (!singleSecurityToDelete) return;
    setSecurityItemsMap((prev) => ({
      ...prev,
      [selectedSecurityVerId]: (prev[selectedSecurityVerId] || []).filter(
        (item) => item.id !== singleSecurityToDelete.id
      ),
    }));
    const name = singleSecurityToDelete.name;
    setSingleSecurityToDelete(null);
    onShowMessage(`已成功删除密级【${name}】！`);
  };

  const handleAddNewSecurityVersion = () => {
    if (!newSecurityVerName.trim()) {
      onShowMessage('请填写版本名称！');
      return;
    }
    const newVerId = `sec_ver_${Date.now()}`;
    const newVer: SecurityVersion = {
      id: newVerId,
      name: newSecurityVerName.trim(),
      isDefault: newSecurityVerIsDefault,
      code: newSecurityVerCode.trim() || `SEC-2026-V${securityVersions.length + 1}`,
      publishDate: '2026-11-06',
      description: newSecurityVerDesc.trim() || '依据保密法规制定的业务定密版本',
    };

    setSecurityVersions((prev) => {
      if (newSecurityVerIsDefault) {
        return [...prev.map((v) => ({ ...v, isDefault: false })), newVer];
      }
      return [...prev, newVer];
    });

    setSecurityItemsMap((prev) => ({
      ...prev,
      [newVerId]: [...(prev['sec_ver_1'] || [])],
    }));

    setSelectedSecurityVerId(newVerId);
    setSelectedSecurityItemIds([]);
    setSecurityPage(1);
    setIsAddSecurityVersionModalOpen(false);
    onShowMessage(`已成功设立密级新版本【${newVer.name}】！`);
  };

  // ==========================================
  // 7. 专题类型设置 (setting_special_topics) - 数据结构与状态
  // ==========================================
  interface ThematicCategory {
    id: string;
    name: string;
    parentId: string | null;
    code: string;
    description: string;
    isRoot?: boolean;
  }

  interface ThematicTopicItem {
    id: string;
    categoryId: string;
    categoryPath: string;
    name: string;
    code: string;
    leadDept: string;
    volumeCount: number;
    securityLevel: string;
    createDate: string;
    status: string;
    remark: string;
  }

  const initialTopicCategories: ThematicCategory[] = [
    {
      id: 'root',
      name: '专题列表',
      parentId: null,
      code: 'ROOT_TOPIC',
      description: '全馆专题目录树顶层根节点，统筹全市重大决策、工程专案与特色档案专题库',
      isRoot: true,
    },
    {
      id: 'dsj',
      name: '大事记',
      parentId: 'root',
      code: 'DSJ',
      description: '收录历年重大决策、战略转型、重大活动与行政体制机制创新纪实',
    },
    {
      id: 'dsj_2026',
      name: '2026年',
      parentId: 'dsj',
      code: 'DSJ-2026',
      description: '2026年度全市与集团重大决策、产业创新与数字发展纪实',
    },
    {
      id: 'dsj_2025',
      name: '2025年',
      parentId: 'dsj',
      code: 'DSJ-2025',
      description: '2025年度智算中心集群投运与高质量产业攻坚大事记',
    },
    {
      id: 'dsj_2024',
      name: '2024年',
      parentId: 'dsj',
      code: 'DSJ-2024',
      description: '2024年度成渝双城经济圈毗邻合作与重大招商引资大事记',
    },
    {
      id: 'dsj_2023',
      name: '2023年',
      parentId: 'dsj',
      code: 'DSJ-2023',
      description: '2023年度大运会筹办举办与城市基础设施能级跃升纪实',
    },
    {
      id: 'dsj_2022',
      name: '2022年',
      parentId: 'dsj',
      code: 'DSJ-2022',
      description: '2022年度超大城市现代化治理与稳增长纾困攻坚大事记',
    },
    {
      id: 'dsj_2021',
      name: '2021年',
      parentId: 'dsj',
      code: 'DSJ-2021',
      description: '2021年度天府国际机场正式通航运营与综合交通枢纽建设大事记',
    },
    {
      id: 'zdxm',
      name: '重点项目',
      parentId: 'root',
      code: 'ZDXM',
      description: '覆盖超大城市基础设施、新一代算力网络、生态公园城市重大建设专案',
    },
    {
      id: 'jgyg',
      name: '机构沿革',
      parentId: 'root',
      code: 'JGYG',
      description: '各委办局、事业单位及市属国企机构调整、职能转变与干部人事变迁专卷',
    },
    {
      id: 'rwzt',
      name: '人物专题',
      parentId: 'root',
      code: 'RWZT',
      description: '两院院士、时代楷模、老革命与全国劳模口述档案及生平档案特藏',
    },
  ];

  const initialThematicItems: ThematicTopicItem[] = [
    // 大事记 - 2026年
    { id: 'top-1', categoryId: 'dsj_2026', categoryPath: '大事记 / 2026年', name: '2026年度市级重大决策与行政体制改革大事记', code: 'ZT-DSJ-2026-01', leadDept: '市委办公厅/市政府研究室', volumeCount: 185, securityLevel: '内部', createDate: '2026-11-01', status: '持续归集', remark: '汇集2026年度全市重大战略合作协议、市委常委会公文决议及数字化转型改革纪实' },
    { id: 'top-2', categoryId: 'dsj_2026', categoryPath: '大事记 / 2026年', name: '2026年下半年天府智算高新技术产业集群攻坚纪实', code: 'ZT-DSJ-2026-02', leadDept: '市经济和信息化局', volumeCount: 142, securityLevel: '公开', createDate: '2026-11-01', status: '持续归集', remark: '收录天府智算集群正式开服运营、百亿级国产算力产业联盟落户成都里程碑事件' },
    { id: 'top-3', categoryId: 'dsj_2026', categoryPath: '大事记 / 2026年', name: '2026年上半年招商引资“建圈强链”战略合作签约大事记', code: 'ZT-DSJ-2026-03', leadDept: '市投资促进局', volumeCount: 126, securityLevel: '内部', createDate: '2026-11-02', status: '持续归集', remark: '重点产业建圈强链重大项目集中签约、全球跨国企业高管访蓉对话与合作协议全宗' },
    { id: 'top-4', categoryId: 'dsj_2026', categoryPath: '大事记 / 2026年', name: '2026年度数字档案全生命周期治理合规标准化建设大事记', code: 'ZT-DSJ-2026-04', leadDept: '市档案馆科技处', volumeCount: 96, securityLevel: '公开', createDate: '2026-11-02', status: '持续归集', remark: '电子公文四性检测国密SM3存证评测通过、全国数字档案标杆平台认定纪实' },
    { id: 'top-14', categoryId: 'dsj_2026', categoryPath: '大事记 / 2026年', name: '2026年第三季度集团党组决策与理论中心组学习大事记', code: 'ZT-DSJ-2026-05', leadDept: '集团党群工作部', volumeCount: 88, securityLevel: '内部', createDate: '2026-11-05', status: '持续归集', remark: '党委理论中心组深度研讨新质生产力、集团三重一大议题决策与纪检监督巡查' },
    
    // 大事记 - 2025年
    { id: 'top-5', categoryId: 'dsj_2025', categoryPath: '大事记 / 2025年', name: '2025年度成都市国民经济与社会发展成就大事记', code: 'ZT-DSJ-2025-01', leadDept: '市统计局/市发改委', volumeCount: 210, securityLevel: '公开', createDate: '2026-11-02', status: '已汇编成册', remark: '全市地区生产总值迈上新台阶、高技术制造业与外贸进出口突破性成就历史记录' },
    { id: 'top-6', categoryId: 'dsj_2025', categoryPath: '大事记 / 2025年', name: '2025年度市属国企战略性重组与数智化转型专件纪实', code: 'ZT-DSJ-2025-02', leadDept: '市国资委企业改革处', volumeCount: 168, securityLevel: '工作秘密', createDate: '2026-11-03', status: '已汇编成册', remark: '城投、兴城、轨道交通三大平台整合重组、新质生产力国有资本布局调整全记录' },
    { id: 'top-7', categoryId: 'dsj_2025', categoryPath: '大事记 / 2025年', name: '2025年度西部金融中心交子科技金融创新大事记', code: 'ZT-DSJ-2025-03', leadDept: '市委金融办', volumeCount: 135, securityLevel: '公开', createDate: '2026-11-03', status: '已汇编成册', remark: '国家绿色金融改革创新试验区批复、交子金融科技指数发布及资本市场服务专案' },
    { id: 'top-15', categoryId: 'dsj_2025', categoryPath: '大事记 / 2025年', name: '2025年度智慧蓉城“微网实格”基层治理创新大事记', code: 'ZT-DSJ-2025-04', leadDept: '市委社工部/政法委', volumeCount: 164, securityLevel: '内部', createDate: '2026-11-06', status: '已汇编成册', remark: '党建引领网格化治理体系成型、12345热线智慧接诉即办机制推广落地实录' },

    // 大事记 - 2024年
    { id: 'top-8', categoryId: 'dsj_2024', categoryPath: '大事记 / 2024年', name: '2024年度成渝地区双城经济圈毗邻合作示范大事记', code: 'ZT-DSJ-2024-01', leadDept: '市发改委区域合作处', volumeCount: 220, securityLevel: '内部', createDate: '2026-11-03', status: '已汇编成册', remark: '成渝中线高铁全线开工、两市跨区域政务协同311项政务服务川渝通办创新实践' },
    { id: 'top-9', categoryId: 'dsj_2024', categoryPath: '大事记 / 2024年', name: '2024年度国家城乡融合发展综合改革试验大事记', code: 'ZT-DSJ-2024-02', leadDept: '市委农村工作领导小组', volumeCount: 156, securityLevel: '公开', createDate: '2026-11-04', status: '已汇编成册', remark: '农村集体经营性建设用地入市试点、农村产权交易所交易量突破性进展历史档案' },
    { id: 'top-16', categoryId: 'dsj_2024', categoryPath: '大事记 / 2024年', name: '2024年度生态环境保护与锦江水系治理大事记', code: 'ZT-DSJ-2024-03', leadDept: '市生态环境局/水务局', volumeCount: 182, securityLevel: '公开', createDate: '2026-11-06', status: '已汇编成册', remark: '锦江流域地表水质优良率达到100%、空气质量优良天数创历史新高攻坚实录' },

    // 大事记 - 2023年
    { id: 'top-10', categoryId: 'dsj_2023', categoryPath: '大事记 / 2023年', name: '2023年度第31届世界大学生夏季运动会举办全景纪实', code: 'ZT-DSJ-2023-01', leadDept: '大运会执委会/市文旅局', volumeCount: 520, securityLevel: '公开', createDate: '2026-11-04', status: '永久典藏', remark: '从申办、筹备、场馆落成、志愿服务到精彩闭幕全周期影像与公文历史全宗' },
    { id: 'top-11', categoryId: 'dsj_2023', categoryPath: '大事记 / 2023年', name: '2023年度天府绿道环城生态区全线贯通大事记', code: 'ZT-DSJ-2023-02', leadDept: '兴城集团/市林草局', volumeCount: 245, securityLevel: '公开', createDate: '2026-11-04', status: '永久典藏', remark: '100公里一级绿道全线贯通、78座特色桥梁合龙与生态修复农田复垦全过程图集' },

    // 大事记 - 2022年与2021年
    { id: 'top-12', categoryId: 'dsj_2022', categoryPath: '大事记 / 2022年', name: '2022年度超大城市现代化治理与应急协同大事记', code: 'ZT-DSJ-2022-01', leadDept: '市政府应急管理办', volumeCount: 290, securityLevel: '内部', createDate: '2026-11-05', status: '永久典藏', remark: '超强极端高温保供电、企业稳产稳岗与多方联防联控应急指挥调度决议汇编' },
    { id: 'top-13', categoryId: 'dsj_2021', categoryPath: '大事记 / 2021年', name: '2021年度成都天府国际机场通航运营大事记', code: 'ZT-DSJ-2021-01', leadDept: '市交通运输局/机场指挥部', volumeCount: 310, securityLevel: '公开', createDate: '2026-11-05', status: '永久典藏', remark: '我国十三五规划投产最大民用航空枢纽工程投运、双流机场与天府机场两场一体运营启航' },

    // 重点项目 (14条)
    { id: 'top-17', categoryId: 'zdxm', categoryPath: '重点项目', name: '国家自主创新示范区智算中心二期扩容工程专集', code: 'ZT-XM-001', leadDept: '高新区科技局', volumeCount: 228, securityLevel: '内部', createDate: '2026-11-01', status: '持续归集', remark: '工程立项批复、机房绿色节能设计施工图、国产化算力服务器上架联合核验文档' },
    { id: 'top-18', categoryId: 'zdxm', categoryPath: '重点项目', name: '天府绿道环城生态区100公里一级绿道全线贯通工程', code: 'ZT-XM-002', leadDept: '兴城集团/市林草局', volumeCount: 345, securityLevel: '公开', createDate: '2026-11-01', status: '永久典藏', remark: '生态修复景观营造、桥梁特色节点深化设计、农田水利贯通工程全套移交图集' },
    { id: 'top-19', categoryId: 'zdxm', categoryPath: '重点项目', name: '成德眉资同城化S3/S5/S11轨道交通都市圈联通工程', code: 'ZT-XM-003', leadDept: '成都轨道集团', volumeCount: 412, securityLevel: '内部', createDate: '2026-11-02', status: '持续归集', remark: '跨市域快速轨道交通盾构区间施工、电力牵引变电所安装调试与运营安全评估' },
    { id: 'top-20', categoryId: 'zdxm', categoryPath: '重点项目', name: '天府实验室生命健康与脑科学前沿研究平台建设', code: 'ZT-XM-004', leadDept: '市科技局/天府实验室', volumeCount: 180, securityLevel: '机密', createDate: '2026-11-02', status: '持续归集', remark: '大科学装置精密仪器采购、GMP实验室净化工程验收及首批国家重大课题申报卷宗' },
    { id: 'top-21', categoryId: 'zdxm', categoryPath: '重点项目', name: '东数西算国家一体化大数据中心成渝枢纽节点项目', code: 'ZT-XM-005', leadDept: '市数据局/发改委', volumeCount: 290, securityLevel: '内部', createDate: '2026-11-02', status: '持续归集', remark: '数据中心PUE能耗指标审查、光纤专网互联架构方案、算力网络调度平台全套文档' },
    { id: 'top-22', categoryId: 'zdxm', categoryPath: '重点项目', name: '锦江水生态综合治理与百里锦江夜游文旅提升工程', code: 'ZT-XM-006', leadDept: '市水务局/文旅集团', volumeCount: 215, securityLevel: '公开', createDate: '2026-11-03', status: '已汇编成册', remark: '流域截污干管改造工程、码头驿站仿古建筑施工图、水生植被修复监测历史台账' },
    { id: 'top-23', categoryId: 'zdxm', categoryPath: '重点项目', name: '成都国际铁路港亚欧供应链冷链多式联运智慧物流园', code: 'ZT-XM-007', leadDept: '青白江自贸区管委会', volumeCount: 160, securityLevel: '内部', createDate: '2026-11-03', status: '已汇编成册', remark: '自动化立体冷库建造技术、海关保税监管场所验收批文、公铁联运调度系统文档' },
    { id: 'top-24', categoryId: 'zdxm', categoryPath: '重点项目', name: '新能源汽车高端动力电池与固态电池量产研发基地', code: 'ZT-XM-008', leadDept: '龙泉驿区经信局', volumeCount: 174, securityLevel: '商业秘密', createDate: '2026-11-04', status: '持续归集', remark: '电池模组智能化自动化产线设计规范、防爆安全生产许可文件及环保排污监测台账' },
    { id: 'top-25', categoryId: 'zdxm', categoryPath: '重点项目', name: '历史文化名城街区保护与白家塘古建筑原址修缮工程', code: 'ZT-XM-009', leadDept: '市住建局文保处', volumeCount: 198, securityLevel: '公开', createDate: '2026-11-04', status: '已汇编成册', remark: '清代穿斗式民居测绘图、古砖瓦木构件修缮复原记录及街区消防微型站配置档案' },
    { id: 'top-26', categoryId: 'zdxm', categoryPath: '重点项目', name: '成都市城市地下综合管廊一期工程及智慧监控中心', code: 'ZT-XM-010', leadDept: '市城管委/管廊公司', volumeCount: 388, securityLevel: '秘密', createDate: '2026-11-05', status: '永久典藏', remark: '高压电力入廊工程、燃气管线独立舱室安全监测系统与三维GIS管网建模成果' },
    { id: 'top-27', categoryId: 'zdxm', categoryPath: '重点项目', name: '成渝中线高铁成都站综合枢纽扩能改造工程', code: 'ZT-XM-011', leadDept: '中国铁路成都局', volumeCount: 360, securityLevel: '内部', createDate: '2026-11-05', status: '持续归集', remark: '既有火车站站房改建施工组织设计、轨道咽喉区信号联锁换装记录与交通接驳方案' },
    { id: 'top-28', categoryId: 'zdxm', categoryPath: '重点项目', name: '天府智慧政务大厅与政务服务一体化平台升级工程', code: 'ZT-XM-012', leadDept: '市政务服务管理办', volumeCount: 145, securityLevel: '内部', createDate: '2026-11-06', status: '持续归集', remark: '一网通办业务流程再造方案、AI智能审批导办系统源码审查及电子印章接入协议' },
    { id: 'top-29', categoryId: 'zdxm', categoryPath: '重点项目', name: '成都生物医药前沿创新中心研发成果孵化平台', code: 'ZT-XM-013', leadDept: '温江区科技局', volumeCount: 132, securityLevel: '公开', createDate: '2026-11-06', status: '持续归集', remark: '抗体药物中试放大生产车间环评批文、实验动物中心无菌净化工程全套图纸' },
    { id: 'top-30', categoryId: 'zdxm', categoryPath: '重点项目', name: '金沙演艺综合体与古蜀文化数字艺术体验中心', code: 'ZT-XM-014', leadDept: '市文联/金牛区文广旅局', volumeCount: 156, securityLevel: '公开', createDate: '2026-11-06', status: '已汇编成册', remark: '大跨度钢结构悬挑屋面吊装方案、舞台机械声光电设备调试及沉浸式数字化展示方案' },

    // 机构沿革 (12条)
    { id: 'top-31', categoryId: 'jgyg', categoryPath: '机构沿革', name: '成都市政务服务与数据管理局机构组建与编制沿革', code: 'ZT-YG-001', leadDept: '市委编办/人社局', volumeCount: 78, securityLevel: '内部', createDate: '2026-11-01', status: '已汇编成册', remark: '2026年机构改革方案中关于数据要素治理与数字化发展职能整合的划转批复全套公文' },
    { id: 'top-32', categoryId: 'jgyg', categoryPath: '机构沿革', name: '市属重点国有企业战略性重组与整合组建沿革专卷', code: 'ZT-YG-002', leadDept: '市国资委', volumeCount: 135, securityLevel: '工作秘密', createDate: '2026-11-01', status: '已汇编成册', remark: '城投、兴城、交投三大投资平台资本重组方案、产权界定报告与干部人事任免通报' },
    { id: 'top-33', categoryId: 'jgyg', categoryPath: '机构沿革', name: '成都市数字档案馆从传统综合档案室到副省级现代馆沿革', code: 'ZT-YG-003', leadDept: '市委办公厅档案局', volumeCount: 192, securityLevel: '公开', createDate: '2026-11-02', status: '永久典藏', remark: '1959年建馆至今历次编制调整、馆舍搬迁、国家数字档案馆全国特级测评认定档案' },
    { id: 'top-34', categoryId: 'jgyg', categoryPath: '机构沿革', name: '历届市委领导班子组成人员与分工调整历史汇编', code: 'ZT-YG-004', leadDept: '市委组织部', volumeCount: 160, securityLevel: '机密', createDate: '2026-11-02', status: '永久典藏', remark: '历届党代会选举结果报批公文、常委班子成员履历任免通报及退休离任审计报告' },
    { id: 'top-35', categoryId: 'jgyg', categoryPath: '机构沿革', name: '高新技术产业开发区管委会职能深化与扩区沿革', code: 'ZT-YG-005', leadDept: '高新区管委会办公室', volumeCount: 110, securityLevel: '公开', createDate: '2026-11-03', status: '已汇编成册', remark: '南区、西区、东部新区生物城等代管街道行政区划划转协议及经济自主权授权批件' },
    { id: 'top-36', categoryId: 'jgyg', categoryPath: '机构沿革', name: '市级规划与自然资源局多规合一机构整合历程档案', code: 'ZT-YG-006', leadDept: '市规自局人事处', volumeCount: 85, securityLevel: '内部', createDate: '2026-11-03', status: '已汇编成册', remark: '原国土局、规划局、林业局涉自然资源管理职能统一合并的编制红头文件集' },
    { id: 'top-37', categoryId: 'jgyg', categoryPath: '机构沿革', name: '市监察委员会与市纪律检查委员会合署办公沿革专集', code: 'ZT-YG-007', leadDept: '市纪委监委办公室', volumeCount: 95, securityLevel: '机密', createDate: '2026-11-04', status: '永久典藏', remark: '监察体制改革试点方案、派驻纪检监察组机构全覆盖与执纪审查业务衔接指引' },
    { id: 'top-38', categoryId: 'jgyg', categoryPath: '机构沿革', name: '司法行政系统与强制隔离戒毒体制改革沿革档案', code: 'ZT-YG-008', leadDept: '市司法局政治部', volumeCount: 72, securityLevel: '内部', createDate: '2026-11-04', status: '已汇编成册', remark: '政府法制办与司法局合并重组、基层司法所规范化建设与人员转隶方案全集' },
    { id: 'top-39', categoryId: 'jgyg', categoryPath: '机构沿革', name: '市生态环境局垂管改革与跨区域执法支队机构沿革', code: 'ZT-YG-009', leadDept: '市生态环境局', volumeCount: 88, securityLevel: '内部', createDate: '2026-11-05', status: '已汇编成册', remark: '区县生态环境分局由属地管理调整为市局直接派驻垂直管理的历史公文与编制名册' },
    { id: 'top-40', categoryId: 'jgyg', categoryPath: '机构沿革', name: '成都市科学技术协会所属学会协会历年发展沿革', code: 'ZT-YG-010', leadDept: '市科协学会部', volumeCount: 104, securityLevel: '公开', createDate: '2026-11-05', status: '已汇编成册', remark: '自然科学类、工程技术类学会成立批复、法人证书副本、换届选举大会纪要汇编' },
    { id: 'top-41', categoryId: 'jgyg', categoryPath: '机构沿革', name: '市文化广电旅游局文旅文博融合机构沿革全宗', code: 'ZT-YG-011', leadDept: '市文广旅局', volumeCount: 96, securityLevel: '公开', createDate: '2026-11-06', status: '持续归集', remark: '原文化局、旅游局、广电局机构三合一调整，文物保护中心专设独立法人审批文件' },
    { id: 'top-42', categoryId: 'jgyg', categoryPath: '机构沿革', name: '天府数智科技集团各直属分公司成立与股权变更档案', code: 'ZT-YG-012', leadDept: '集团投资与法务部', volumeCount: 120, securityLevel: '商业秘密', createDate: '2026-11-06', status: '持续归集', remark: '福州分公司、成都分公司、北京研发中心设立股东会决议、工商营业执照变更公函' },

    // 人物专题 (12条)
    { id: 'top-43', categoryId: 'rwzt', categoryPath: '人物专题', name: '两院院士天府创新历程与科学报国口述档案专集', code: 'ZT-RW-001', leadDept: '市科协/市委人才办', volumeCount: 115, securityLevel: '公开', createDate: '2026-11-01', status: '持续归集', remark: '在蓉两院院士科研攻坚手稿、音视频口述采访实录、学术手记与国家大奖证书' },
    { id: 'top-44', categoryId: 'rwzt', categoryPath: '人物专题', name: '成都市首届“天府工匠”与技能大师技术创新攻关专卷', code: 'ZT-RW-002', leadDept: '市总工会', volumeCount: 88, securityLevel: '公开', createDate: '2026-11-01', status: '已汇编成册', remark: '一线产业工人精密加工发明专利、劳模工作室技改攻关项目纪录与高清作业影像' },
    { id: 'top-45', categoryId: 'rwzt', categoryPath: '人物专题', name: '抗战老兵与离休干部口述革命历史与亲笔书信专藏', code: 'ZT-RW-003', leadDept: '市委老干部局/市档案馆', volumeCount: 140, securityLevel: '内部', createDate: '2026-11-02', status: '永久典藏', remark: '128位老八路、解放军南下干部珍贵音视频口述实录、战地家书原件与立功喜报' },
    { id: 'top-46', categoryId: 'rwzt', categoryPath: '人物专题', name: '新中国成立初期老劳模、先进工作者风采档案汇编', code: 'ZT-RW-004', leadDept: '市总工会生产保护部', volumeCount: 95, securityLevel: '公开', createDate: '2026-11-02', status: '永久典藏', remark: '1950-1960年代成渝铁路修建、东郊工业基地建设功勋劳模先进事迹材料与生平卷宗' },
    { id: 'top-47', categoryId: 'rwzt', categoryPath: '人物专题', name: '大运会杰出青年志愿者代表口述纪实与风采录', code: 'ZT-RW-005', leadDept: '团市委青年志愿部', volumeCount: 120, securityLevel: '公开', createDate: '2026-11-03', status: '已汇编成册', remark: '“小青椒”志愿者服务国际赛会心路历程口述、双语日记、志愿荣誉勋章实物扫描' },
    { id: 'top-48', categoryId: 'rwzt', categoryPath: '人物专题', name: '当代知名文史学者与地方志编纂专家学术档案专架', code: 'ZT-RW-006', leadDept: '市地方志办/市文史馆', volumeCount: 106, securityLevel: '公开', createDate: '2026-11-03', status: '持续归集', remark: '方志学者考据巴蜀历史文献底稿、蓉城历代古籍翻印校注手稿及学术通信汇集' },
    { id: 'top-49', categoryId: 'rwzt', categoryPath: '人物专题', name: '首批天府特聘专家关键技术成果与科研手稿专册', code: 'ZT-RW-007', leadDept: '高新区党群部人才处', volumeCount: 78, securityLevel: '机密', createDate: '2026-11-04', status: '持续归集', remark: '芯片半导体、生物医药创新领军人才实验记录本底稿、发明专利授权书原件' },
    { id: 'top-50', categoryId: 'rwzt', categoryPath: '人物专题', name: '蓉城杰出教育家与名校名师从教档案专题汇集', code: 'ZT-RW-008', leadDept: '市教育局教师工作处', volumeCount: 110, securityLevel: '公开', createDate: '2026-11-04', status: '已汇编成册', remark: '百年名校名校长治校理念文稿、特级教师精品教案手稿与教书育人感人回忆录' },
    { id: 'top-51', categoryId: 'rwzt', categoryPath: '人物专题', name: '三线建设时期功勋专家与一线劳动模范亲历记', code: 'ZT-RW-009', leadDept: '市发改委国防动员处', volumeCount: 130, securityLevel: '工作秘密', createDate: '2026-11-05', status: '永久典藏', remark: '三线军工企业内迁西南口述实录、老厂房拓荒图纸、干部职工日记与生产生活手记' },
    { id: 'top-52', categoryId: 'rwzt', categoryPath: '人物专题', name: '川剧代表性传承人与国家级非遗大师影像全集', code: 'ZT-RW-010', leadDept: '市川剧研究院/文旅局', volumeCount: 165, securityLevel: '公开', createDate: '2026-11-05', status: '永久典藏', remark: '著名川剧表演艺术家身段图谱、传统唱腔母带原盘、戏本善本手抄件与服化道绝活' },
    { id: 'top-53', categoryId: 'rwzt', categoryPath: '人物专题', name: '四川籍全国脱贫攻坚楷模生平与扎根基层事迹卷宗', code: 'ZT-RW-011', leadDept: '市乡村振兴局', volumeCount: 92, securityLevel: '公开', createDate: '2026-11-06', status: '永久典藏', remark: '驻村第一书记脱贫攻坚民情日记、扶贫项目台账、群众按红手印感谢信与表彰公文' },
    { id: 'top-54', categoryId: 'rwzt', categoryPath: '人物专题', name: '改革开放初期蓉城知名民营企业家创业口述史', code: 'ZT-RW-012', leadDept: '市工商联宣传部', volumeCount: 84, securityLevel: '公开', createDate: '2026-11-06', status: '已汇编成册', remark: '民营经济首批弄潮儿下海创业艰辛历程口述、首张私营企业执照影印件与创业手记' },
  ];

  const [topicCategories, setTopicCategories] = useState<ThematicCategory[]>(initialTopicCategories);
  const [topicList, setTopicList] = useState<ThematicTopicItem[]>(initialThematicItems);
  const [selectedTopicCatId, setSelectedTopicCatId] = useState<string>('dsj');
  const [expandedTopicCatIds, setExpandedTopicCatIds] = useState<string[]>(['root', 'dsj', 'zdxm', 'jgyg']);
  const [topicSearch, setTopicSearch] = useState<string>('');
  const [topicPage, setTopicPage] = useState<number>(1);
  const [selectedTopicItemIds, setSelectedTopicItemIds] = useState<string[]>([]);
  const [topicViewMode, setTopicViewMode] = useState<'table' | 'card'>('table');

  // 模态框状态
  const [isAddTopicCategoryModalOpen, setIsAddTopicCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatParentId, setNewCatParentId] = useState('root');
  const [newCatCode, setNewCatCode] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const [isTopicItemModalOpen, setIsTopicItemModalOpen] = useState(false);
  const [topicModalMode, setTopicModalMode] = useState<'add' | 'edit' | 'detail'>('add');
  const [currentTopicItem, setCurrentTopicItem] = useState<ThematicTopicItem | null>(null);
  const [topicFormName, setTopicFormName] = useState('');
  const [topicFormCatId, setTopicFormCatId] = useState('dsj_2026');
  const [topicFormCode, setTopicFormCode] = useState('');
  const [topicFormDept, setTopicFormDept] = useState('');
  const [topicFormSec, setTopicFormSec] = useState('内部');
  const [topicFormStatus, setTopicFormStatus] = useState('持续归集');
  const [topicFormVolume, setTopicFormVolume] = useState(10);
  const [topicFormRemark, setTopicFormRemark] = useState('');

  const [deleteTopicConfirm, setDeleteTopicConfirm] = useState<{
    open: boolean;
    ids: string[];
    names: string[];
  } | null>(null);
  const [singleTopicToDelete, setSingleTopicToDelete] = useState<ThematicTopicItem | null>(null);

  // 辅助函数：根据选中的分类筛选专题数据
  const currentCategoryObj = topicCategories.find((c) => c.id === selectedTopicCatId) || topicCategories[0];

  const getFilteredTopicItems = () => {
    let list = topicList;

    // 树分类过滤：若选 root 则显示所有；若选父级如 dsj 则显示 dsj 及所有子年份；若选子项如 dsj_2026 则精确过滤
    if (selectedTopicCatId !== 'root') {
      const childCatIds = topicCategories.filter((c) => c.parentId === selectedTopicCatId).map((c) => c.id);
      const targetCatIds = [selectedTopicCatId, ...childCatIds];
      list = list.filter((item) => targetCatIds.includes(item.categoryId));
    }

    // 搜索过滤
    if (topicSearch.trim()) {
      const q = topicSearch.trim().toLowerCase();
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.leadDept.toLowerCase().includes(q) ||
          item.remark.toLowerCase().includes(q) ||
          item.securityLevel.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filteredTopicItems = getFilteredTopicItems();
  const paginatedTopicItems = filteredTopicItems.slice((topicPage - 1) * PAGE_SIZE, topicPage * PAGE_SIZE);

  // 切换折叠树节点
  const handleToggleTopicCategoryExpand = (catId: string) => {
    setExpandedTopicCatIds((prev) =>
      prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
    );
  };

  // 选择分类节点（联动右侧表格）
  const handleSelectTopicCategory = (catId: string) => {
    setSelectedTopicCatId(catId);
    setTopicPage(1);
    setSelectedTopicItemIds([]);
  };

  // 表格复选框交互
  const handleToggleSelectAllTopics = () => {
    const currentPageIds = paginatedTopicItems.map((item) => item.id);
    const allSelected = currentPageIds.every((id) => selectedTopicItemIds.includes(id));
    if (allSelected) {
      setSelectedTopicItemIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedTopicItemIds, ...currentPageIds]));
      setSelectedTopicItemIds(merged);
    }
  };

  const handleToggleSelectTopicItem = (id: string) => {
    setSelectedTopicItemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 打开添加专题模态框
  const handleOpenAddTopicModal = () => {
    setTopicModalMode('add');
    setCurrentTopicItem(null);
    setTopicFormName('');
    setTopicFormCatId(selectedTopicCatId === 'root' ? 'dsj_2026' : selectedTopicCatId);
    setTopicFormCode(`ZT-${Date.now().toString().slice(-4)}`);
    setTopicFormDept('市委办公厅 / 战略发展部');
    setTopicFormSec('内部');
    setTopicFormStatus('持续归集');
    setTopicFormVolume(18);
    setTopicFormRemark('');
    setIsTopicItemModalOpen(true);
  };

  // 打开编辑专题模态框
  const handleOpenEditTopicModal = (item?: ThematicTopicItem) => {
    let target = item;
    if (!target) {
      if (selectedTopicItemIds.length === 0) {
        onShowMessage('请先在表格左侧勾选需要编辑的专题！');
        return;
      }
      target = topicList.find((i) => i.id === selectedTopicItemIds[0]);
    }
    if (!target) return;

    setTopicModalMode('edit');
    setCurrentTopicItem(target);
    setTopicFormName(target.name);
    setTopicFormCatId(target.categoryId);
    setTopicFormCode(target.code);
    setTopicFormDept(target.leadDept);
    setTopicFormSec(target.securityLevel);
    setTopicFormStatus(target.status);
    setTopicFormVolume(target.volumeCount);
    setTopicFormRemark(target.remark);
    setIsTopicItemModalOpen(true);
  };

  // 保存专题表单提交
  const handleSaveTopicSubmit = () => {
    if (!topicFormName.trim()) {
      onShowMessage('请填写专题名称！');
      return;
    }
    const cat = topicCategories.find((c) => c.id === topicFormCatId);
    const catPath = cat ? cat.name : '专题列表';

    if (topicModalMode === 'add') {
      const newItem: ThematicTopicItem = {
        id: `top_${Date.now()}`,
        categoryId: topicFormCatId,
        categoryPath: catPath,
        name: topicFormName.trim(),
        code: topicFormCode.trim() || `ZT-${Date.now().toString().slice(-4)}`,
        leadDept: topicFormDept.trim() || '成都市数字档案馆科技处',
        volumeCount: Number(topicFormVolume) || 1,
        securityLevel: topicFormSec,
        createDate: '2026-11-06',
        status: topicFormStatus,
        remark: topicFormRemark.trim() || '依据档案专题编研工作规范最新立卷汇集之重要档案专卷',
      };
      setTopicList((prev) => [newItem, ...prev]);
      setIsTopicItemModalOpen(false);
      setTopicPage(1);
      onShowMessage(`已成功设立专题【${topicFormName}】！`);
    } else if (topicModalMode === 'edit' && currentTopicItem) {
      setTopicList((prev) =>
        prev.map((item) =>
          item.id === currentTopicItem.id
            ? {
                ...item,
                categoryId: topicFormCatId,
                categoryPath: catPath,
                name: topicFormName.trim(),
                code: topicFormCode.trim(),
                leadDept: topicFormDept.trim(),
                volumeCount: Number(topicFormVolume) || item.volumeCount,
                securityLevel: topicFormSec,
                status: topicFormStatus,
                remark: topicFormRemark.trim(),
              }
            : item
        )
      );
      setIsTopicItemModalOpen(false);
      onShowMessage(`已成功修改专题【${topicFormName}】！`);
    }
  };

  // 批量删除
  const handleDeleteSelectedTopics = () => {
    if (selectedTopicItemIds.length === 0) {
      onShowMessage('请先在表格左侧勾选要删除的专题！');
      return;
    }
    const targetItems = topicList.filter((s) => selectedTopicItemIds.includes(s.id));
    setDeleteTopicConfirm({
      open: true,
      ids: selectedTopicItemIds,
      names: targetItems.map((t) => `${t.name} (${t.code})`),
    });
  };

  const handleConfirmDeleteTopics = () => {
    if (!deleteTopicConfirm) return;
    setTopicList((prev) => prev.filter((item) => !deleteTopicConfirm.ids.includes(item.id)));
    setSelectedTopicItemIds([]);
    setDeleteTopicConfirm(null);
    onShowMessage('已成功删除所选专题！');
  };

  // 单条删除
  const handleSingleTopicDelete = (item: ThematicTopicItem) => {
    setSingleTopicToDelete(item);
  };

  const handleConfirmSingleTopicDelete = () => {
    if (!singleTopicToDelete) return;
    setTopicList((prev) => prev.filter((item) => item.id !== singleTopicToDelete.id));
    const name = singleTopicToDelete.name;
    setSingleTopicToDelete(null);
    onShowMessage(`已成功删除专题【${name}】！`);
  };

  // 新增分类节点
  const handleAddNewTopicCategory = () => {
    if (!newCatName.trim()) {
      onShowMessage('请填写分类名称！');
      return;
    }
    const newCatId = `cat_${Date.now()}`;
    const newCat: ThematicCategory = {
      id: newCatId,
      name: newCatName.trim(),
      parentId: newCatParentId,
      code: newCatCode.trim() || `ZT-CAT-${topicCategories.length + 1}`,
      description: newCatDesc.trim() || '依据档案编研与特色专藏制度设立的专题分类',
    };
    setTopicCategories((prev) => [...prev, newCat]);
    setSelectedTopicCatId(newCatId);
    setExpandedTopicCatIds((prev) => Array.from(new Set([...prev, newCatParentId, newCatId])));
    setIsAddTopicCategoryModalOpen(false);
    setNewCatName('');
    setNewCatCode('');
    setNewCatDesc('');
    onShowMessage(`已成功新增专题分类【${newCat.name}】！`);
  };

  // ==========================================
  // 8. 著录项规则设置 (setting_metadata_rules) - 数据结构与状态
  // ==========================================
  interface ArchiveTypeRuleNode {
    id: string;
    name: string;
    parentId: string | null;
    code: string;
    level?: string;
    isRoot?: boolean;
  }

  interface MetadataRuleItem {
    id: string;
    typeNodeId: string;
    typeName: string;
    fieldItem: string;
    ruleExpr: string;
    status: '启用' | '禁用';
    description: string;
    example: string;
    updateTime: string;
  }

  const initialRuleTypeNodes: ArchiveTypeRuleNode[] = [
    { id: 'root', name: '档案类型列表', parentId: null, code: 'ROOT', isRoot: true },
    { id: 'ws_file', name: '文书档案（文件）', parentId: 'root', code: 'WS_FILE' },
    { id: 'ws_file_doc', name: '文件', parentId: 'ws_file', code: 'WS_FILE_DOC', level: '文件' },
    { id: 'ws_box', name: '文书档案（盒/案卷）', parentId: 'root', code: 'WS_BOX' },
    { id: 'ws_box_doc', name: '文件', parentId: 'ws_box', code: 'WS_BOX_DOC', level: '文件' },
    { id: 'ws_box_vol', name: '案卷', parentId: 'ws_box', code: 'WS_BOX_VOL', level: '案卷' },
    { id: 'eng', name: '工程档案', parentId: 'root', code: 'ENG' },
    { id: 'eng_file', name: '文件', parentId: 'eng', code: 'ENG_FILE', level: '文件' },
    { id: 'eng_vol', name: '案卷', parentId: 'eng', code: 'ENG_VOL', level: '案卷' },
    { id: 'eng_proj', name: '项目', parentId: 'eng', code: 'ENG_PROJ', level: '项目' },
    { id: 'kj', name: '会计档案', parentId: 'root', code: 'KJ' },
    { id: 'kj_voucher', name: '凭证', parentId: 'kj', code: 'KJ_VOUCHER', level: '凭证' },
    { id: 'kj_book', name: '账簿', parentId: 'kj', code: 'KJ_BOOK', level: '账簿' },
  ];

  const initialMetadataRulesMap: Record<string, MetadataRuleItem[]> = {
    // 1. 文书档案（文件） - 文件 (严格还原原型截图前两项及扩充真实业务数据)
    ws_file_doc: [
      { id: 'r-wsf-1', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '档号', ruleExpr: '[全宗号]-[年度]-[分类号]-[件号]', status: '启用', description: '国家标准DA/T 13-2022文书档案核心件级档号，由全宗代字、立卷年度、一级分类号与顺序流水件号拼接而成', example: 'SCFGS01-2026-WS01-0018', updateTime: '2026-11-06' },
      { id: 'r-wsf-2', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '案卷', ruleExpr: '[年度]--[分类号]--[案卷号]', status: '禁用', description: '案卷级备用目录匹配规则，单件归档模式下默认暂置为禁用状态', example: '2026--WS01--AJ003', updateTime: '2026-11-06' },
      { id: 'r-wsf-3', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '文号', ruleExpr: '[发文机关代字]〔[年度]〕[顺序号]号', status: '启用', description: '党政机关公文格式GB/T 9704标准发文字号规则，四性检测必验公文字号', example: '蓉府发〔2026〕18号', updateTime: '2026-11-06' },
      { id: 'r-wsf-4', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '题名', ruleExpr: '[责任者]关于[事由]的[文种]', status: '启用', description: '规范公文题名经典三要素语法规则，严禁空缺，四性检测前置必检', example: '成都市人民政府办公厅关于推进数字档案创新发展的通知', updateTime: '2026-11-05' },
      { id: 'r-wsf-5', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '全宗号', ruleExpr: '[单位代字][全宗类型代码:4位]', status: '启用', description: '依据成都市档案馆全宗编目规范设立之固定四位法人全宗代码', example: 'SCFGS0001', updateTime: '2026-11-05' },
      { id: 'r-wsf-6', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '分类号', ruleExpr: '[大类字母].[二级数字代码]', status: '启用', description: '文书档案十进制分类细目编码，对应党群综合与行政管理门类', example: 'WS.01', updateTime: '2026-11-04' },
      { id: 'r-wsf-7', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '成文日期', ruleExpr: '[YYYY]-[MM]-[DD]', status: '启用', description: 'ISO 8601标准规范成文签署生效日期，精确到日', example: '2026-11-06', updateTime: '2026-11-04' },
      { id: 'r-wsf-8', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '责任者', ruleExpr: '[法定机构全称或标准化简称]', status: '启用', description: '发文机关或主办单位法定全称，严禁使用非标准俗称', example: '成都市发展和改革委员会', updateTime: '2026-11-03' },
      { id: 'r-wsf-9', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '保管期限', ruleExpr: '[字典:永久|30年|10年]', status: '启用', description: '国家档案局8号令归档范围及保管期限法定规范枚举值', example: '30年', updateTime: '2026-11-03' },
      { id: 'r-wsf-10', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '密级', ruleExpr: '[字典:公开|内部|工作秘密|秘密|机密]', status: '启用', description: '国家保密法与单位定密审核责任规程绑定的涉密属性', example: '内部', updateTime: '2026-11-02' },
      { id: 'r-wsf-11', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '数字指纹SM3', ruleExpr: 'SM3:[64位防篡改特征码]', status: '启用', description: '国产密码SM3散列算法计算生成之电子文件长期真实性存证凭据', example: 'SM3:9a8b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b', updateTime: '2026-11-02' },
      { id: 'r-wsf-12', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '页数', ruleExpr: '[正整数页码总和]', status: '启用', description: '正文附页全部物理单页累加数值，入库检测自动核验比对', example: '24', updateTime: '2026-11-01' },
      { id: 'r-wsf-13', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '实体盒号', ruleExpr: '[全宗号]-[年度]-[盒号:3位]', status: '启用', description: '库房装盒实体上架脊面编码，支持扫描条形码/RFID精准定位', example: 'SCFGS01-2026-005', updateTime: '2026-11-01' },
      { id: 'r-wsf-14', typeNodeId: 'ws_file_doc', typeName: '文书档案（文件）- 文件', fieldItem: '排架位置', ruleExpr: '[库区号]-[列]-[节]-[层]', status: '启用', description: '现代化恒温恒湿智能密集架空间三维物理排架坐标代码', example: 'KF11-03-08-04', updateTime: '2026-11-01' },
    ],

    // 2. 文书档案（盒/案卷） - 文件
    ws_box_doc: [
      { id: 'r-wbd-1', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '卷内文件档号', ruleExpr: '[全宗号]-[年度]-[案卷号]-[卷内序号:3位]', status: '启用', description: '案卷管理模式下卷内单份文件标准档号规则', example: 'SCFGS01-2026-AJ008-003', updateTime: '2026-11-06' },
      { id: 'r-wbd-2', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '卷内序号', ruleExpr: '[顺序递增序号:3位]', status: '启用', description: '卷内文件排列顺序流水号，从001开始连续编号', example: '003', updateTime: '2026-11-05' },
      { id: 'r-wbd-3', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '文号', ruleExpr: '[发文字号规范表达式]', status: '启用', description: '文件发文字号，如无字号则填报呈批件发文编号', example: '川办发〔2026〕32号', updateTime: '2026-11-05' },
      { id: 'r-wbd-4', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '题名', ruleExpr: '[卷内公文正题名]', status: '启用', description: '卷内单件文件正题名，严禁擅自删减核心事由', example: '四川省人民政府办公厅关于印发全省重点产业扶持办法的批复', updateTime: '2026-11-04' },
      { id: 'r-wbd-5', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '责任者', ruleExpr: '[公文落款制发机构]', status: '启用', description: '公文制发机关或牵头主责单位', example: '四川省人民政府办公厅', updateTime: '2026-11-04' },
      { id: 'r-wbd-6', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '成文日期', ruleExpr: '[YYYYMMDD]', status: '启用', description: '文件最后签署或发文日期，8位数字连写', example: '20261102', updateTime: '2026-11-03' },
      { id: 'r-wbd-7', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '起止页号', ruleExpr: '[起始页]-[终止页]', status: '启用', description: '卷内文件在案卷中的绝对起始与终止页码', example: '15-28', updateTime: '2026-11-03' },
      { id: 'r-wbd-8', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '页数', ruleExpr: '[计算:终止页-起始页+1]', status: '启用', description: '系统根据起止页码自动校验计算并回填', example: '14', updateTime: '2026-11-02' },
      { id: 'r-wbd-9', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '密级', ruleExpr: '[字典:公开|内部|秘密|机密]', status: '启用', description: '卷内单件涉密等级，不得高于案卷总密级', example: '内部', updateTime: '2026-11-02' },
      { id: 'r-wbd-10', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '载体形态', ruleExpr: '[原件纸质|数字化副本|OFD版式]', status: '启用', description: '物理实体与电子文件双套制载体形式标识', example: 'OFD版式', updateTime: '2026-11-01' },
      { id: 'r-wbd-11', typeNodeId: 'ws_box_doc', typeName: '文书档案（盒/案卷）- 文件', fieldItem: '备注', ruleExpr: '[文本说明:最大200字]', status: '启用', description: '附注说明及附件特殊说明', example: '含红头盖印正本扫描件与OFD结构化签章包', updateTime: '2026-11-01' },
    ],

    // 3. 文书档案（盒/案卷） - 案卷
    ws_box_vol: [
      { id: 'r-wbv-1', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '案卷号', ruleExpr: '[年度]--[分类号]--[案卷号]', status: '启用', description: '文书盒卷管理中案卷外封面核心标识规则', example: '2026--WS01--0012', updateTime: '2026-11-06' },
      { id: 'r-wbv-2', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '案卷题名', ruleExpr: '[立卷年度]+[机构/分类]+[主要问题]+[案卷名称]', status: '启用', description: '综合反映卷内全部公文集合的主题统称', example: '2026年度党组会决策决议与重要公文案卷', updateTime: '2026-11-06' },
      { id: 'r-wbv-3', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '全宗号', ruleExpr: '[全宗代字代码]', status: '启用', description: '所属法人全宗单位代字', example: 'SCFGS01', updateTime: '2026-11-05' },
      { id: 'r-wbv-4', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '起止件号', ruleExpr: '[起始件号]-[终止件号]', status: '启用', description: '卷内第一份至最后一份文件的件号区间', example: '001-028', updateTime: '2026-11-05' },
      { id: 'r-wbv-5', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '起止日期', ruleExpr: '[最早成文日]至[最迟成文日]', status: '启用', description: '卷内文件跨越的最早时间与最迟时间跨度', example: '2026-01-08至2026-11-04', updateTime: '2026-11-04' },
      { id: 'r-wbv-6', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '总件数', ruleExpr: '[卷内收纳文件数量汇总]', status: '启用', description: '卷内目录核定通过之有效公文总份数', example: '28', updateTime: '2026-11-04' },
      { id: 'r-wbv-7', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '总页数', ruleExpr: '[卷内全部文件页码总计]', status: '启用', description: '整卷实体装订有效页码累计总数', example: '186', updateTime: '2026-11-03' },
      { id: 'r-wbv-8', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '编制部门', ruleExpr: '[立卷归档责任处室]', status: '启用', description: '承担该案卷整理与移交审查的内设业务部门', example: '党委组织部（人力资源部）', updateTime: '2026-11-03' },
      { id: 'r-wbv-9', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '立卷人', ruleExpr: '[实名档案员姓名]', status: '启用', description: '组卷与初步鉴定的立卷责任人实名', example: '陈雅文', updateTime: '2026-11-02' },
      { id: 'r-wbv-10', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '保管期限', ruleExpr: '[取卷内文件最长保管期限]', status: '启用', description: '从长原则，自动继承卷内涉保管要求最长之文件属性', example: '永久', updateTime: '2026-11-02' },
      { id: 'r-wbv-11', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '密级', ruleExpr: '[取卷内文件最高定密等级]', status: '启用', description: '从严原则，自动以卷内最高涉密等级作为案卷整体密级', example: '内部', updateTime: '2026-11-01' },
      { id: 'r-wbv-12', typeNodeId: 'ws_box_vol', typeName: '文书档案（盒/案卷）- 案卷', fieldItem: '盒脊标签', ruleExpr: '[全宗名]+[年度]+[分类]+[案卷号]', status: '启用', description: '实体档案盒侧脊印刷或打印标签排版规范', example: '四川分公司 2026年 综合行政 AJ0012', updateTime: '2026-11-01' },
    ],

    // 4. 工程档案 - 项目 / 案卷 / 文件
    eng_proj: [
      { id: 'r-ep-1', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '工程项目代码', ruleExpr: '[国家固定资产项目24位统一代码]', status: '启用', description: '发改委与住建委固定资产投资项目在线审批监管统一代码', example: '2026-510100-04-01-987211', updateTime: '2026-11-06' },
      { id: 'r-ep-2', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '工程档案总号', ruleExpr: '[全宗号]-GC-[项目代字:6位]', status: '启用', description: '成都市建设工程城建档案规范编目总索引号', example: 'SCFGS01-GC-202601', updateTime: '2026-11-06' },
      { id: 'r-ep-3', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '工程名称', ruleExpr: '[立项批复法定工程全称]', status: '启用', description: '必须与可行性研究批复及规划施工许可证载明名称严格一致', example: '天府新区高新智算产业基地一期基建智能化工程', updateTime: '2026-11-05' },
      { id: 'r-ep-4', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '建设单位', ruleExpr: '[业主法人单位规范全称]', status: '启用', description: '工程投资建设法人责任主体', example: '天府数智科技集团成都分公司', updateTime: '2026-11-05' },
      { id: 'r-ep-5', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '设计勘察单位', ruleExpr: '[勘察院名称]+[设计院名称]', status: '启用', description: '地质勘察与工程方案设计中标甲级资质单位全称', example: '西南电力建筑设计院', updateTime: '2026-11-04' },
      { id: 'r-ep-6', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '施工总包单位', ruleExpr: '[特级/一级施工总包单位全称]', status: '启用', description: '负责土建施工与安装总承包责任单位', example: '中国建筑第八工程局有限公司', updateTime: '2026-11-04' },
      { id: 'r-ep-7', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '监理单位', ruleExpr: '[工程综合监理机构全称]', status: '启用', description: '承担全过程质量及安全监督的独立监理法人', example: '四川铁科工程监理咨询有限公司', updateTime: '2026-11-03' },
      { id: 'r-ep-8', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '开竣工日期', ruleExpr: '[开工YYYY-MM]至[竣工验收YYYY-MM]', status: '启用', description: '施工许可证核定开工至竣工验收备案全周期区间', example: '2025-03至2026-10', updateTime: '2026-11-03' },
      { id: 'r-ep-9', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '工程总造价', ruleExpr: '[竣工决算审定金额:万元]', status: '启用', description: '经第三方财评审定之最终竣工决算造价', example: '28650.00万元', updateTime: '2026-11-02' },
      { id: 'r-ep-10', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '保管期限', ruleExpr: '[固定:永久]', status: '启用', description: '重大基础设施工程档案依据住建部规程依法实行永久保存', example: '永久', updateTime: '2026-11-02' },
      { id: 'r-ep-11', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: '质检合格证号', ruleExpr: '[质监站工程质量合格监督报告书号]', status: '启用', description: '成都市建设工程质量监督站备案核发编号', example: '蓉建质监备字[2026]第0882号', updateTime: '2026-11-01' },
      { id: 'r-ep-12', typeNodeId: 'eng_proj', typeName: '工程档案 - 项目', fieldItem: 'BIM数字交付包', ruleExpr: 'IFC/Revit_[SM3国密散列存证凭据]', status: '启用', description: 'BIM三维模型与竣工图纸数字化双套制交付归档包', example: 'BIM_LOD400_SM3:7a6c5e...8f9d', updateTime: '2026-11-01' },
    ],

    eng_vol: [
      { id: 'r-ev-1', typeNodeId: 'eng_vol', typeName: '工程档案 - 案卷', fieldItem: '工程档号', ruleExpr: '[全宗号]-[项目代号]-[类别]-[卷号:4位]', status: '启用', description: '建设工程案卷级档号标准格式，涵盖立项批复/施工/监理/竣工图等分册', example: 'SCFGS01-GC202601-SG-0012', updateTime: '2026-11-06' },
      { id: 'r-ev-2', typeNodeId: 'eng_vol', typeName: '工程档案 - 案卷', fieldItem: '案卷题名', ruleExpr: '[工程项目名称]+[分部工程]+[文件类别]', status: '启用', description: '工程案卷标准题名，清晰指明建筑部位与图纸属性', example: '智算中心二期综合动力机房高压配电施工与调试图纸案卷', updateTime: '2026-11-06' },
      { id: 'r-ev-3', typeNodeId: 'eng_vol', typeName: '工程档案 - 案卷', fieldItem: '图纸总张数', ruleExpr: '[有效折叠标准A4图纸张数]', status: '启用', description: '白图或蓝图换算为1号图折合张数统计标准', example: '85张', updateTime: '2026-11-05' },
      { id: 'r-ev-4', typeNodeId: 'eng_vol', typeName: '工程档案 - 案卷', fieldItem: '编制单位', ruleExpr: '[参建单位全称]', status: '启用', description: '负责本卷图纸绘制与出具的施工总包或专业分包企业', example: '中建八局安装工程有限公司', updateTime: '2026-11-04' },
      { id: 'r-ev-5', typeNodeId: 'eng_vol', typeName: '工程档案 - 案卷', fieldItem: '密级', ruleExpr: '[商业秘密|机密|公开]', status: '启用', description: '核心基础设施施工拓扑与管网涉密等级', example: '商业秘密', updateTime: '2026-11-03' },
      { id: 'r-ev-6', typeNodeId: 'eng_vol', typeName: '工程档案 - 案卷', fieldItem: '保管期限', ruleExpr: '[永久|长期]', status: '启用', description: '工程重要隐蔽工程及结构图件保管要求', example: '永久', updateTime: '2026-11-02' },
      { id: 'r-ev-7', typeNodeId: 'eng_vol', typeName: '工程档案 - 案卷', fieldItem: '库房排架位置', ruleExpr: '[特种工程图纸专用库区]-[抽屉号]', status: '启用', description: '大型工程图纸柜平放保存物理定位', example: 'GCKF-02-TZG-06', updateTime: '2026-11-01' },
    ],

    eng_file: [
      { id: 'r-ef-1', typeNodeId: 'eng_file', typeName: '工程档案 - 文件', fieldItem: '图纸/文件代号', ruleExpr: '[专业代码]-[图纸流水号:3位]', status: '启用', description: '设计图纸右下角标准图签编号', example: 'JG-DW-025', updateTime: '2026-11-06' },
      { id: 'r-ef-2', typeNodeId: 'eng_file', typeName: '工程档案 - 文件', fieldItem: '图纸比例尺', ruleExpr: '[1:50|1:100|1:200|1:500]', status: '启用', description: '国家工程制图标准比例尺枚举值', example: '1:100', updateTime: '2026-11-05' },
      { id: 'r-ef-3', typeNodeId: 'eng_file', typeName: '工程档案 - 文件', fieldItem: '图幅规格', ruleExpr: '[A0|A1|A2|A3|A4加长]', status: '启用', description: '工程图纸物理打印幅面标准', example: 'A1', updateTime: '2026-11-04' },
      { id: 'r-ef-4', typeNodeId: 'eng_file', typeName: '工程档案 - 文件', fieldItem: '设计注册工程师', ruleExpr: '[实名]+[国家一级注册印章号]', status: '启用', description: '承担工程图纸终身责任的一级注册结构/建筑师', example: '张建军 (建执字第5100238号)', updateTime: '2026-11-03' },
      { id: 'r-ef-5', typeNodeId: 'eng_file', typeName: '工程档案 - 文件', fieldItem: '出图日期', ruleExpr: '[YYYY-MM-DD]', status: '启用', description: '图纸审查合格加盖施工图审查章之确切出图日', example: '2026-10-18', updateTime: '2026-11-02' },
    ],

    // 5. 会计档案 - 凭证 / 账簿
    kj_voucher: [
      { id: 'r-kjv-1', typeNodeId: 'kj_voucher', typeName: '会计档案 - 凭证', fieldItem: '凭证档号', ruleExpr: '[全宗号]-KJ-[年度]-[凭证类型]-[册号:3位]', status: '启用', description: '企业会计档案管理办法GB/T 39784会计凭证标准档号', example: 'SCFGS01-KJ-2026-JZ-018', updateTime: '2026-11-06' },
      { id: 'r-kjv-2', typeNodeId: 'kj_voucher', typeName: '会计档案 - 凭证', fieldItem: '凭证起止号', ruleExpr: '[字号]第[起号]号至第[止号]号', status: '启用', description: '本册凭证包含记账凭证连续编号区间', example: '记字第001号至第050号', updateTime: '2026-11-06' },
      { id: 'r-kjv-3', typeNodeId: 'kj_voucher', typeName: '会计档案 - 凭证', fieldItem: '凭证张数', ruleExpr: '[单册原始凭证与记账凭证总张数]', status: '启用', description: '装订封签核定之实有有效凭证张数', example: '142张', updateTime: '2026-11-05' },
      { id: 'r-kjv-4', typeNodeId: 'kj_voucher', typeName: '会计档案 - 凭证', fieldItem: '借贷合计金额', ruleExpr: '¥[核算金额合计:两位小数]', status: '启用', description: '本册凭证借贷发生额精准核算合计', example: '¥18,452,900.50', updateTime: '2026-11-04' },
      { id: 'r-kjv-5', typeNodeId: 'kj_voucher', typeName: '会计档案 - 凭证', fieldItem: '主管会计', ruleExpr: '[财务负责人实名]', status: '启用', description: '会计机构负责人审签印章实名', example: '唐晓薇', updateTime: '2026-11-03' },
      { id: 'r-kjv-6', typeNodeId: 'kj_voucher', typeName: '会计档案 - 凭证', fieldItem: '保管期限', ruleExpr: '[固定:30年]', status: '启用', description: '会计凭证依据财政部国家档案局令第79号依法保管30年', example: '30年', updateTime: '2026-11-02' },
      { id: 'r-kjv-7', typeNodeId: 'kj_voucher', typeName: '会计档案 - 凭证', fieldItem: '密级', ruleExpr: '[固定:商业秘密]', status: '启用', description: '企业核心财务收支涉及公司商业机密', example: '商业秘密', updateTime: '2026-11-01' },
    ],

    kj_book: [
      { id: 'r-kjb-1', typeNodeId: 'kj_book', typeName: '会计档案 - 账簿', fieldItem: '账簿档号', ruleExpr: '[全宗号]-KJ-[年度]-ZB-[账簿序号:2位]', status: '启用', description: '总账、明细账、日记账会计账簿规范档号', example: 'SCFGS01-KJ-2026-ZB-01', updateTime: '2026-11-06' },
      { id: 'r-kjb-2', typeNodeId: 'kj_book', typeName: '会计档案 - 账簿', fieldItem: '账簿名称', ruleExpr: '[会计科目]+[日记账/明细分类账/总账]', status: '启用', description: '财务核算规范账簿分类科目全称', example: '银行存款日记账与主营业务收入明细账', updateTime: '2026-11-05' },
      { id: 'r-kjb-3', typeNodeId: 'kj_book', typeName: '会计档案 - 账簿', fieldItem: '保管期限', ruleExpr: '[固定:30年]', status: '启用', description: '法定总账及明细账保管时限', example: '30年', updateTime: '2026-11-04' },
      { id: 'r-kjb-4', typeNodeId: 'kj_book', typeName: '会计档案 - 账簿', fieldItem: '电子账套哈希', ruleExpr: 'SM3:[财务软件数据库备份存证哈希]', status: '启用', description: '用友/金蝶财务数据备份归档凭据', example: 'SM3:8b4e2f...3c1a', updateTime: '2026-11-03' },
    ]
  };

  const [ruleTypeNodes] = useState<ArchiveTypeRuleNode[]>(initialRuleTypeNodes);
  const [metadataRulesMap, setMetadataRulesMap] = useState<Record<string, MetadataRuleItem[]>>(initialMetadataRulesMap);
  const [selectedRuleNodeId, setSelectedRuleNodeId] = useState<string>('ws_file_doc');
  const [expandedRuleNodeIds, setExpandedRuleNodeIds] = useState<string[]>(['root', 'ws_file', 'ws_box', 'eng', 'kj']);
  const [ruleSearch, setRuleSearch] = useState<string>('');
  const [rulePage, setRulePage] = useState<number>(1);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [ruleViewMode, setRuleViewMode] = useState<'table' | 'preview'>('table');

  // 模态框状态
  const [isRuleItemModalOpen, setIsRuleItemModalOpen] = useState(false);
  const [ruleModalMode, setRuleModalMode] = useState<'add' | 'edit' | 'detail'>('add');
  const [currentRuleItem, setCurrentRuleItem] = useState<MetadataRuleItem | null>(null);
  const [ruleFormField, setRuleFormField] = useState('');
  const [ruleFormExpr, setRuleFormExpr] = useState('');
  const [ruleFormStatus, setRuleFormStatus] = useState<'启用' | '禁用'>('启用');
  const [ruleFormExample, setRuleFormExample] = useState('');
  const [ruleFormDesc, setRuleFormDesc] = useState('');

  const [deleteRuleConfirm, setDeleteRuleConfirm] = useState<{
    open: boolean;
    ids: string[];
    names: string[];
  } | null>(null);
  const [singleRuleToDelete, setSingleRuleToDelete] = useState<MetadataRuleItem | null>(null);

  // 辅助函数：根据选中的树节点获取规则列表
  const currentRuleNode = ruleTypeNodes.find((n) => n.id === selectedRuleNodeId) || ruleTypeNodes[2];

  const getFilteredRuleItems = () => {
    const rawItems = metadataRulesMap[selectedRuleNodeId] || [];
    if (!ruleSearch.trim()) return rawItems;
    const q = ruleSearch.trim().toLowerCase();
    return rawItems.filter(
      (r) =>
        r.fieldItem.toLowerCase().includes(q) ||
        r.ruleExpr.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q) ||
        r.example.toLowerCase().includes(q)
    );
  };

  const currentTypeRuleItems = metadataRulesMap[selectedRuleNodeId] || [];
  const filteredRuleItems = getFilteredRuleItems();
  const paginatedRuleItems = filteredRuleItems.slice((rulePage - 1) * PAGE_SIZE, rulePage * PAGE_SIZE);

  // 树折叠展开
  const handleToggleRuleNodeExpand = (nodeId: string) => {
    setExpandedRuleNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // 选择树节点（联动右侧表格）
  const handleSelectRuleNode = (node: ArchiveTypeRuleNode) => {
    if (node.isRoot) return;
    // 如果选中的是父节点且有子节点，默认选中其第一个子节点
    const children = ruleTypeNodes.filter((n) => n.parentId === node.id);
    if (children.length > 0) {
      setSelectedRuleNodeId(children[0].id);
      setExpandedRuleNodeIds((prev) => Array.from(new Set([...prev, node.id])));
    } else {
      setSelectedRuleNodeId(node.id);
    }
    setRulePage(1);
    setSelectedRuleIds([]);
  };

  // 表格复选框交互
  const handleToggleSelectAllRules = () => {
    const currentPageIds = paginatedRuleItems.map((item) => item.id);
    const allSelected = currentPageIds.every((id) => selectedRuleIds.includes(id));
    if (allSelected) {
      setSelectedRuleIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      const merged = Array.from(new Set([...selectedRuleIds, ...currentPageIds]));
      setSelectedRuleIds(merged);
    }
  };

  const handleToggleSelectRuleItem = (id: string) => {
    setSelectedRuleIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // 打开添加规则模态框 (默认状态为启用，呼应截图说明)
  const handleOpenAddRuleModal = () => {
    setRuleModalMode('add');
    setCurrentRuleItem(null);
    setRuleFormField('');
    setRuleFormExpr('[全宗号]-[年度]-[分类号]-[序号]');
    setRuleFormStatus('启用'); // 新增规则默认是启用状态
    setRuleFormExample('SCFGS01-2026-WS01-001');
    setRuleFormDesc('依据档案著录国家行业标准DA/T 46自动解析格式规则');
    setIsRuleItemModalOpen(true);
  };

  // 打开编辑规则模态框
  const handleOpenEditRuleModal = (item?: MetadataRuleItem) => {
    let target = item;
    if (!target) {
      if (selectedRuleIds.length === 0) {
        onShowMessage('请先在表格左侧勾选要编辑的著录项规则！');
        return;
      }
      target = currentTypeRuleItems.find((r) => r.id === selectedRuleIds[0]);
    }
    if (!target) return;

    setRuleModalMode('edit');
    setCurrentRuleItem(target);
    setRuleFormField(target.fieldItem);
    setRuleFormExpr(target.ruleExpr);
    setRuleFormStatus(target.status);
    setRuleFormExample(target.example);
    setRuleFormDesc(target.description);
    setIsRuleItemModalOpen(true);
  };

  // 保存规则提交
  const handleSaveRuleSubmit = () => {
    if (!ruleFormField.trim()) {
      onShowMessage('请填写著录项名称！');
      return;
    }
    if (!ruleFormExpr.trim()) {
      onShowMessage('请配置规则表达式！');
      return;
    }

    if (ruleModalMode === 'add') {
      const newRule: MetadataRuleItem = {
        id: `rule_${Date.now()}`,
        typeNodeId: selectedRuleNodeId,
        typeName: currentRuleNode.name,
        fieldItem: ruleFormField.trim(),
        ruleExpr: ruleFormExpr.trim(),
        status: ruleFormStatus,
        description: ruleFormDesc.trim() || '依据档案著录规范最新配置的自定义生成表达式',
        example: ruleFormExample.trim() || 'SCFGS01-2026-AUTOGEN-01',
        updateTime: '2026-11-06',
      };
      setMetadataRulesMap((prev) => ({
        ...prev,
        [selectedRuleNodeId]: [newRule, ...(prev[selectedRuleNodeId] || [])],
      }));
      setIsRuleItemModalOpen(false);
      setRulePage(1);
      onShowMessage(`已成功为【${currentRuleNode.name}】添加著录项规则【${ruleFormField}】！新增规则默认启用。`);
    } else if (ruleModalMode === 'edit' && currentRuleItem) {
      setMetadataRulesMap((prev) => ({
        ...prev,
        [selectedRuleNodeId]: (prev[selectedRuleNodeId] || []).map((r) =>
          r.id === currentRuleItem.id
            ? {
                ...r,
                fieldItem: ruleFormField.trim(),
                ruleExpr: ruleFormExpr.trim(),
                status: ruleFormStatus,
                description: ruleFormDesc.trim(),
                example: ruleFormExample.trim(),
                updateTime: '2026-11-06',
              }
            : r
        ),
      }));
      setIsRuleItemModalOpen(false);
      onShowMessage(`已成功更新著录项规则【${ruleFormField}】！`);
    }
  };

  // 批量启用规则
  const handleBatchEnableRules = () => {
    if (selectedRuleIds.length === 0) {
      onShowMessage('请先在表格左侧勾选需要启用的著录项规则！');
      return;
    }
    setMetadataRulesMap((prev) => ({
      ...prev,
      [selectedRuleNodeId]: (prev[selectedRuleNodeId] || []).map((r) =>
        selectedRuleIds.includes(r.id) ? { ...r, status: '启用', updateTime: '2026-11-06' } : r
      ),
    }));
    onShowMessage(`已成功批量启用 ${selectedRuleIds.length} 条著录项规则！`);
  };

  // 批量禁用规则
  const handleBatchDisableRules = () => {
    if (selectedRuleIds.length === 0) {
      onShowMessage('请先在表格左侧勾选需要禁用的著录项规则！');
      return;
    }
    setMetadataRulesMap((prev) => ({
      ...prev,
      [selectedRuleNodeId]: (prev[selectedRuleNodeId] || []).map((r) =>
        selectedRuleIds.includes(r.id) ? { ...r, status: '禁用', updateTime: '2026-11-06' } : r
      ),
    }));
    onShowMessage(`已成功批量禁用 ${selectedRuleIds.length} 条著录项规则！`);
  };

  // 批量删除规则
  const handleDeleteSelectedRules = () => {
    if (selectedRuleIds.length === 0) {
      onShowMessage('请先在表格左侧勾选要删除的著录项规则！');
      return;
    }
    const targetRules = currentTypeRuleItems.filter((r) => selectedRuleIds.includes(r.id));
    setDeleteRuleConfirm({
      open: true,
      ids: selectedRuleIds,
      names: targetRules.map((t) => t.fieldItem),
    });
  };

  const handleConfirmDeleteRules = () => {
    if (!deleteRuleConfirm) return;
    setMetadataRulesMap((prev) => ({
      ...prev,
      [selectedRuleNodeId]: (prev[selectedRuleNodeId] || []).filter(
        (r) => !deleteRuleConfirm.ids.includes(r.id)
      ),
    }));
    setSelectedRuleIds([]);
    setDeleteRuleConfirm(null);
    onShowMessage('已成功删除所选著录项规则！');
  };

  // 单条删除
  const handleSingleRuleDelete = (item: MetadataRuleItem) => {
    setSingleRuleToDelete(item);
  };

  const handleConfirmSingleRuleDelete = () => {
    if (!singleRuleToDelete) return;
    setMetadataRulesMap((prev) => ({
      ...prev,
      [selectedRuleNodeId]: (prev[selectedRuleNodeId] || []).filter(
        (r) => r.id !== singleRuleToDelete.id
      ),
    }));
    const name = singleRuleToDelete.fieldItem;
    setSingleRuleToDelete(null);
    onShowMessage(`已成功删除著录项【${name}】的规则配置！`);
  };

  // 单行快捷切换启用/禁用状态
  const handleToggleSingleRuleStatus = (item: MetadataRuleItem) => {
    const nextStatus = item.status === '启用' ? '禁用' : '启用';
    setMetadataRulesMap((prev) => ({
      ...prev,
      [selectedRuleNodeId]: (prev[selectedRuleNodeId] || []).map((r) =>
        r.id === item.id ? { ...r, status: nextStatus, updateTime: '2026-11-06' } : r
      ),
    }));
    onShowMessage(`已将著录项【${item.fieldItem}】规则切换为【${nextStatus}】状态！`);
  };

  // 辅助变量：用于兼容 submodulesConfig
  const currentMetaItems = currentTypeRuleItems;
  const metaPage = rulePage;
  const setMetaPage = setRulePage;

  // ==========================================
  // 9. 默认数据权限 (setting_default_permissions)
  // ==========================================
  interface PermArchiveTypeItem {
    id: string;
    name: string;
    code: string;
    category: string;
    desc: string;
  }

  interface CategoryFormPerms {
    insideScope: {
      catalogBrowse: boolean;      // 条目信息浏览
      electronicBrowse: boolean;   // 电子文件浏览
      electronicPrint: boolean;    // 电子文件打印
      electronicDownload: boolean; // 电子文件下载
      physicalBorrow: boolean;     // 档案实体借阅
    };
    outsideScope: {
      catalogBrowse: boolean;      // 条目信息浏览
      electronicBrowse: boolean;   // 电子文件浏览
      electronicPrint: boolean;    // 电子文件打印
      electronicDownload: boolean; // 电子文件下载
      physicalBorrow: boolean;     // 档案实体借阅
    };
    updatedAt: string;
  }

  interface DefaultPermRuleRow {
    id: string;
    name: string;
    scopeType: '在知悉范围内' | '在知悉范围外';
    policy: '默认允许' | '需审批' | '默认禁止';
    desc: string;
    targetModule: string;
    updatedAt: string;
  }

  const permArchiveTypeList: PermArchiveTypeItem[] = [
    { id: 'ws_file', name: '文书档案（文件）', code: 'WS_DOC', category: '文书档案', desc: '机关文书归档单件公文、会议纪要与函电' },
    { id: 'ws_box', name: '文书档案（盒/案卷）', code: 'WS_VOL', category: '文书档案', desc: '文书组卷、卷内文件与档案盒实体管理' },
    { id: 'eng_proj', name: '工程档案', code: 'ENG', category: '工程基建', desc: '基建工程项目立项、勘测、施工与竣工图纸' },
    { id: 'photo', name: '照片档案', code: 'PHOTO', category: '多媒体特藏', desc: '历史底片、重大活动合影与数字相片' },
    { id: 'audio_video', name: '声像档案', code: 'AV', category: '多媒体特藏', desc: '重要会议音视频、历史磁带与光盘' },
    { id: 'physical', name: '实物档案', code: 'PHYS', category: '实物印章', desc: '单位公章、奖杯印章、锦旗与贵重题词' },
    { id: 'accounting', name: '会计档案', code: 'ACC', category: '财务会计', desc: '财务凭证、总账明细账与年度决算报表' },
    { id: 'science', name: '科技档案', code: 'SCI', category: '科技研发', desc: '科研攻关报告、科技成果评定与技术图纸' },
    { id: 'personnel', name: '人事档案', code: 'PER', category: '干部人事', desc: '干部履历表、自传、考察材料与奖惩记录' },
    { id: 'electronic_doc', name: '电子公文', code: 'EDOC', category: '数字公文', desc: '党政机关电子公文OFD原文与版式签批包' },
  ];

  // 各档案门类表单多选配置（严格对齐截图 image_81d7ca89.png）
  const initialCategoryFormPermsMap: Record<string, CategoryFormPerms> = {
    ws_file: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: true, electronicDownload: true, physicalBorrow: false },
      outsideScope: { catalogBrowse: true, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-06 09:30',
    },
    ws_box: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: true, electronicDownload: true, physicalBorrow: false },
      outsideScope: { catalogBrowse: true, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-06 09:30',
    },
    eng_proj: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: true, electronicDownload: false, physicalBorrow: false },
      outsideScope: { catalogBrowse: true, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-05 16:20',
    },
    photo: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: true, electronicDownload: true, physicalBorrow: false },
      outsideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-05 14:15',
    },
    audio_video: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: false, electronicDownload: true, physicalBorrow: false },
      outsideScope: { catalogBrowse: true, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-05 11:40',
    },
    physical: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      outsideScope: { catalogBrowse: true, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-05 10:00',
    },
    accounting: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: true, electronicDownload: false, physicalBorrow: false },
      outsideScope: { catalogBrowse: false, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-04 17:30',
    },
    science: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: true, electronicDownload: true, physicalBorrow: false },
      outsideScope: { catalogBrowse: true, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-04 15:10',
    },
    personnel: {
      insideScope: { catalogBrowse: true, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      outsideScope: { catalogBrowse: false, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-04 14:00',
    },
    electronic_doc: {
      insideScope: { catalogBrowse: true, electronicBrowse: true, electronicPrint: true, electronicDownload: true, physicalBorrow: false },
      outsideScope: { catalogBrowse: true, electronicBrowse: false, electronicPrint: false, electronicDownload: false, physicalBorrow: false },
      updatedAt: '2026-11-06 08:50',
    },
  };

  // 各门类明细表格数据（每类 12~14 条真实数据，用于表格视图与每页10条分页展示）
  const initialCategoryTableRulesMap: Record<string, DefaultPermRuleRow[]> = {
    ws_file: [
      { id: 'ws_f_1', name: '条目信息浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '在知悉范围内允许对本档案库目录条目进行全量检索与属性查看', targetModule: '档案检索模块', updatedAt: '2026-11-06' },
      { id: 'ws_f_2', name: '电子文件浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '在线调用OFD/PDF原生双层排版阅读器直接查阅文件正文', targetModule: '电子查阅模块', updatedAt: '2026-11-06' },
      { id: 'ws_f_3', name: '电子文件打印', scopeType: '在知悉范围内', policy: '默认允许', desc: '允许在线打印原文，打印附带经办人与安全审计暗水印', targetModule: '档案利用模块', updatedAt: '2026-11-06' },
      { id: 'ws_f_4', name: '电子文件下载', scopeType: '在知悉范围内', policy: '默认允许', desc: '允许下载电子原文副本附件（格式限定为PDF/A与OFD）', targetModule: '档案利用模块', updatedAt: '2026-11-06' },
      { id: 'ws_f_5', name: '档案实体借阅', scopeType: '在知悉范围内', policy: '需审批', desc: '有权限管理员就可借出，无权限档案的借阅需要分管领导审批', targetModule: '库房实体借还', updatedAt: '2026-11-06' },
      { id: 'ws_f_6', name: '条目信息浏览', scopeType: '在知悉范围外', policy: '默认允许', desc: '没有权限的用户不能对本档案库进行条目浏览和查询，公开目录除外', targetModule: '档案检索模块', updatedAt: '2026-11-05' },
      { id: 'ws_f_7', name: '电子文件浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '没有权限则用户只能看到附件名称，但是不能在线浏览', targetModule: '电子查阅模块', updatedAt: '2026-11-05' },
      { id: 'ws_f_8', name: '电子文件打印', scopeType: '在知悉范围外', policy: '默认禁止', desc: '无权限不能在线打印，违规尝试将触发安全预警日志', targetModule: '档案利用模块', updatedAt: '2026-11-05' },
      { id: 'ws_f_9', name: '电子文件下载', scopeType: '在知悉范围外', policy: '默认禁止', desc: '没有权限则不能对附件进行下载，防止敏感资产外泄', targetModule: '档案利用模块', updatedAt: '2026-11-05' },
      { id: 'ws_f_10', name: '档案实体借阅', scopeType: '在知悉范围外', policy: '需审批', desc: '有权限管理员就可借出，无权限档案的借阅需要领导审批', targetModule: '库房实体借还', updatedAt: '2026-11-05' },
      { id: 'ws_f_11', name: '敏感著录项动态脱敏', scopeType: '在知悉范围外', policy: '默认允许', desc: '对公民身份证号、银行账号、私人手机号字段执行掩码遮蔽', targetModule: '全局检索展示', updatedAt: '2026-11-05' },
      { id: 'ws_f_12', name: '高保真防伪水印加载', scopeType: '在知悉范围外', policy: '默认允许', desc: '外部门浏览时强制以点阵隐形水印叠加查阅人员姓名工号', targetModule: '电子原文阅读器', updatedAt: '2026-11-04' },
      { id: 'ws_f_13', name: '历史修改痕迹调阅', scopeType: '在知悉范围外', policy: '默认禁止', desc: '历次立卷整编的版本修改痕迹仅对归档责任处室开放', targetModule: '版本控制中心', updatedAt: '2026-11-04' },
      { id: 'ws_f_14', name: '涉密档案移交清册浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '绝密/机密/秘密级别在知悉范围外完全不可见', targetModule: '移交接收模块', updatedAt: '2026-11-04' },
    ],
    ws_box: [
      { id: 'ws_b_1', name: '案卷目录浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '允许查阅整盒案卷封面、卷内目录与卷内备考表', targetModule: '档案检索模块', updatedAt: '2026-11-06' },
      { id: 'ws_b_2', name: '卷内全文浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '批量浏览卷内所有单件公文电子原文', targetModule: '电子查阅模块', updatedAt: '2026-11-06' },
      { id: 'ws_b_3', name: '案卷封面打印', scopeType: '在知悉范围内', policy: '默认允许', desc: '支持标准盒脊背签与案卷封面合格标签打印', targetModule: '排架标签打印', updatedAt: '2026-11-06' },
      { id: 'ws_b_4', name: '整卷数据包打包导出', scopeType: '在知悉范围内', policy: '需审批', desc: '整卷原始EEP数据包下载必须提交档案馆借阅利用审批单', targetModule: '数据包封装中心', updatedAt: '2026-11-06' },
      { id: 'ws_b_5', name: '整盒实体外借出库', scopeType: '在知悉范围内', policy: '需审批', desc: '案卷实体整盒出库需经库房专员审核并绑定RFID标签', targetModule: '实体借还台账', updatedAt: '2026-11-06' },
      { id: 'ws_b_6', name: '案卷目录浏览', scopeType: '在知悉范围外', policy: '默认允许', desc: '无权限用户仅可查看案卷题名与档号，不展示卷内明细', targetModule: '档案检索模块', updatedAt: '2026-11-05' },
      { id: 'ws_b_7', name: '卷内全文浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外用户禁止展开卷内原文，需发起跨部门申请', targetModule: '电子查阅模块', updatedAt: '2026-11-05' },
      { id: 'ws_b_8', name: '案卷封面打印', scopeType: '在知悉范围外', policy: '默认禁止', desc: '非责任部门禁止打印案卷条码与封面', targetModule: '排架标签打印', updatedAt: '2026-11-05' },
      { id: 'ws_b_9', name: '整卷数据包打包导出', scopeType: '在知悉范围外', policy: '默认禁止', desc: '禁止任何知悉范围外用户批量获取归档包', targetModule: '数据包封装中心', updatedAt: '2026-11-05' },
      { id: 'ws_b_10', name: '整盒实体外借出库', scopeType: '在知悉范围外', policy: '需审批', desc: '知悉范围外必须由局级分管领导双签审批后方可提调', targetModule: '实体借还台账', updatedAt: '2026-11-05' },
      { id: 'ws_b_11', name: '盒内位置明细查阅', scopeType: '在知悉范围外', policy: '默认禁止', desc: '密集架排架精确坐标不对外展示，防止库房实体盗损', targetModule: '库房微定位', updatedAt: '2026-11-04' },
      { id: 'ws_b_12', name: '四性检测合规报告调阅', scopeType: '在知悉范围外', policy: '默认允许', desc: '允许查阅该案卷国家档案局四性检测合格绿标', targetModule: '质量溯源中心', updatedAt: '2026-11-04' },
    ],
    eng_proj: [
      { id: 'eng_1', name: '工程项目概况浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '查阅工程立项批文、规划许可证与参建各方信息', targetModule: '工程检索模块', updatedAt: '2026-11-06' },
      { id: 'eng_2', name: '竣工图纸DWG/BIM浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '基于Web矢量轻量化引擎在线查看工程竣工图与三维模型', targetModule: '工程看图模块', updatedAt: '2026-11-06' },
      { id: 'eng_3', name: '工程图纸带签打印', scopeType: '在知悉范围内', policy: '默认允许', desc: '支持0号/1号大幅面图纸打样输出并附带项目红线章', targetModule: '工程出图中心', updatedAt: '2026-11-06' },
      { id: 'eng_4', name: '矢量施工图下载', scopeType: '在知悉范围内', policy: '需审批', desc: '涉及结构配筋、地下隐蔽管网的图纸下载需经总工签批', targetModule: '工程图纸库', updatedAt: '2026-11-06' },
      { id: 'eng_5', name: '工程纸质底图借阅', scopeType: '在知悉范围内', policy: '需审批', desc: '羊皮纸/硫酸纸手工工程图纸原件必须在特藏室内阅览', targetModule: '特藏库房管理', updatedAt: '2026-11-06' },
      { id: 'eng_6', name: '工程项目概况浏览', scopeType: '在知悉范围外', policy: '默认允许', desc: '开放查阅已竣工验收的市政非涉密工程登记摘要', targetModule: '工程检索模块', updatedAt: '2026-11-05' },
      { id: 'eng_7', name: '竣工图纸DWG/BIM浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '禁止非项目建设单位在线查阅详细节点详图', targetModule: '工程看图模块', updatedAt: '2026-11-05' },
      { id: 'eng_8', name: '工程图纸带签打印', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外用户无打印权限', targetModule: '工程出图中心', updatedAt: '2026-11-05' },
      { id: 'eng_9', name: '矢量施工图下载', scopeType: '在知悉范围外', policy: '默认禁止', desc: '严禁外部单位拷贝下载防空、管线、防汛核心图纸', targetModule: '工程图纸库', updatedAt: '2026-11-05' },
      { id: 'eng_10', name: '工程纸质底图借阅', scopeType: '在知悉范围外', policy: '需审批', desc: '城市建设协同借用须提供市住建局正式公函', targetModule: '特藏库房管理', updatedAt: '2026-11-05' },
      { id: 'eng_11', name: '施工隐蔽工程影像查阅', scopeType: '在知悉范围外', policy: '默认禁止', desc: '桩基沉降与钢筋探伤全息扫描影像非立卷单位受限', targetModule: '多媒体工程档', updatedAt: '2026-11-04' },
    ],
    photo: [
      { id: 'ph_1', name: '照片缩略图瀑布流浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '高清缩略图网格与EXIF拍摄参数快速预览', targetModule: '声像检索模块', updatedAt: '2026-11-06' },
      { id: 'ph_2', name: 'RAW格式无损原图查阅', scopeType: '在知悉范围内', policy: '默认允许', desc: '允许查看无损RAW/TIFF大图及色彩直方图', targetModule: '高清看图器', updatedAt: '2026-11-06' },
      { id: 'ph_3', name: '照片冲印高保真打印', scopeType: '在知悉范围内', policy: '默认允许', desc: '经本部门核准后送专业相片打印机输出', targetModule: '影像输出模块', updatedAt: '2026-11-06' },
      { id: 'ph_4', name: '高清照片批量打包下载', scopeType: '在知悉范围内', policy: '默认允许', desc: '包含拍摄地点、摄影师署名及故事说明全量下载', targetModule: '媒体导出中心', updatedAt: '2026-11-06' },
      { id: 'ph_5', name: '历史相纸与底片借出', scopeType: '在知悉范围内', policy: '需审批', desc: '恒温恒湿防褪色专用库房原件提调需保密科批准', targetModule: '底片库房管理', updatedAt: '2026-11-06' },
      { id: 'ph_6', name: '照片缩略图瀑布流浏览', scopeType: '在知悉范围外', policy: '默认允许', desc: '仅允许浏览已公开或外宣发布的高清压缩预览图', targetModule: '声像检索模块', updatedAt: '2026-11-05' },
      { id: 'ph_7', name: 'RAW格式无损原图查阅', scopeType: '在知悉范围外', policy: '默认禁止', desc: '非宣传主管或原作者不可调阅未裁切底稿原片', targetModule: '高清看图器', updatedAt: '2026-11-05' },
      { id: 'ph_8', name: '照片冲印高保真打印', scopeType: '在知悉范围外', policy: '默认禁止', desc: '外部门查阅不提供无水印照片冲印', targetModule: '影像输出模块', updatedAt: '2026-11-05' },
      { id: 'ph_9', name: '高清照片批量打包下载', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外严禁批量导出大图，防止版权及肖像争议', targetModule: '媒体导出中心', updatedAt: '2026-11-05' },
      { id: 'ph_10', name: '历史相纸与底片借出', scopeType: '在知悉范围外', policy: '需审批', desc: '展览陈列需要借调底片必须由馆务会议研究决定', targetModule: '底片库房管理', updatedAt: '2026-11-05' },
    ],
    audio_video: [
      { id: 'av_1', name: '音视频片段在线试听试看', scopeType: '在知悉范围内', policy: '默认允许', desc: '基于流媒体服务在线试听试看720P转码切片文件', targetModule: '流媒体播放器', updatedAt: '2026-11-06' },
      { id: 'av_2', name: '4K超清广播级母带浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '支持广播级ProRes母带在线校准与分镜拉片', targetModule: '专业剪辑工作台', updatedAt: '2026-11-06' },
      { id: 'av_3', name: '语音智能转录文本查阅', scopeType: '在知悉范围内', policy: '默认允许', desc: '自动匹配语音转文字字幕与时间轴逐字稿', targetModule: '智能转写中心', updatedAt: '2026-11-06' },
      { id: 'av_4', name: '音视频原文件分段下载', scopeType: '在知悉范围内', policy: '默认允许', desc: '支持带时间戳分段截取下载，方便宣传剪辑利用', targetModule: '媒体分发中心', updatedAt: '2026-11-06' },
      { id: 'av_5', name: '广播开盘带/磁带实物调阅', scopeType: '在知悉范围内', policy: '需审批', desc: '珍贵录音磁带出库播放必须由专业音像工程师操作', targetModule: '磁介质保护库', updatedAt: '2026-11-06' },
      { id: 'av_6', name: '音视频片段在线试听试看', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外用户仅可读取题名、时长、主讲人等元数据', targetModule: '流媒体播放器', updatedAt: '2026-11-05' },
      { id: 'av_7', name: '4K超清广播级母带浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '未经许可严禁播放内部非公开工作会议实况', targetModule: '专业剪辑工作台', updatedAt: '2026-11-05' },
      { id: 'av_8', name: '语音智能转录文本查阅', scopeType: '在知悉范围外', policy: '默认禁止', desc: '逐字速记稿涉及发言原声，非授权人员不可查阅', targetModule: '智能转写中心', updatedAt: '2026-11-05' },
      { id: 'av_9', name: '音视频原文件分段下载', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外禁止下载任何音视频成片与素材', targetModule: '媒体分发中心', updatedAt: '2026-11-05' },
      { id: 'av_10', name: '广播开盘带/磁带实物调阅', scopeType: '在知悉范围外', policy: '需审批', desc: '必须由申请人分管领导提出专题使用申请', targetModule: '磁介质保护库', updatedAt: '2026-11-05' },
    ],
    physical: [
      { id: 'ph_o_1', name: '实物三维全景模型浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '实物3D扫描白光点云与全方位可旋转仿真模型', targetModule: '3D数字展馆', updatedAt: '2026-11-06' },
      { id: 'ph_o_2', name: '印章印模高清图谱查阅', scopeType: '在知悉范围内', policy: '默认允许', desc: '查看历史撤销机关公章、钢印高清1:1扫描图谱', targetModule: '印章印模管理', updatedAt: '2026-11-06' },
      { id: 'ph_o_3', name: '实物鉴定说明与保管卡打印', scopeType: '在知悉范围内', policy: '默认允许', desc: '打印实物展签、材质鉴定证书与防伪二维码', targetModule: '展品标签中心', updatedAt: '2026-11-06' },
      { id: 'ph_o_4', name: '实物展品出库外展申请', scopeType: '在知悉范围内', policy: '需审批', desc: '涉及国家一级/二级文物的实物展出需省级主管部门签章', targetModule: '实物库房管理', updatedAt: '2026-11-06' },
      { id: 'ph_o_5', name: '废旧公章销毁监督记录', scopeType: '在知悉范围内', policy: '需审批', desc: '废旧印章截角、送熔必须由纪检监察人员现场监督', targetModule: '印章全生命周期', updatedAt: '2026-11-06' },
      { id: 'ph_o_6', name: '实物三维全景模型浏览', scopeType: '在知悉范围外', policy: '默认允许', desc: '公共爱国主义教育基地展品对政务外网全员开放3D浏览', targetModule: '3D数字展馆', updatedAt: '2026-11-05' },
      { id: 'ph_o_7', name: '印章印模高清图谱查阅', scopeType: '在知悉范围外', policy: '默认禁止', desc: '印模严防仿冒印章，知悉范围外严禁调阅矢量印谱', targetModule: '印章印模管理', updatedAt: '2026-11-05' },
      { id: 'ph_o_8', name: '实物鉴定说明与保管卡打印', scopeType: '在知悉范围外', policy: '默认禁止', desc: '非馆内保管专员不可打印实物台账卡', targetModule: '展品标签中心', updatedAt: '2026-11-05' },
      { id: 'ph_o_9', name: '实物展品出库外展申请', scopeType: '在知悉范围外', policy: '需审批', desc: '外借实物必须开具等值保函并由局党组集体审定', targetModule: '实物库房管理', updatedAt: '2026-11-05' },
      { id: 'ph_o_10', name: '贵重字画库温湿度与防盗实时数据', scopeType: '在知悉范围外', policy: '默认禁止', desc: '库房环境与安防探头对知悉范围外完全隔离', targetModule: '智能安防总控', updatedAt: '2026-11-05' },
    ],
    accounting: [
      { id: 'acc_1', name: '会计凭证条目检索', scopeType: '在知悉范围内', policy: '默认允许', desc: '按记账凭证号、科目代码、摘要快速定位记账凭证', targetModule: '财务档案检索', updatedAt: '2026-11-06' },
      { id: 'acc_2', name: '电子会计凭证原件浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '查阅发票电子原文、银行电子回单与记账凭证封面', targetModule: '电子凭证查阅', updatedAt: '2026-11-06' },
      { id: 'acc_3', name: '会计凭证附件打印', scopeType: '在知悉范围内', policy: '默认允许', desc: '在线打印记账凭证原件并加盖审计专用水印', targetModule: '财务利用中心', updatedAt: '2026-11-06' },
      { id: 'acc_4', name: '原始发票XML/OFD下载', scopeType: '在知悉范围内', policy: '需审批', desc: '电子发票原件下载需经财务科长授权核验', targetModule: '财务凭证归档', updatedAt: '2026-11-06' },
      { id: 'acc_5', name: '纸质会计账簿实体调阅', scopeType: '在知悉范围内', policy: '需审批', desc: '纸质总账/日记账原件借调必须在财务保密室内查阅', targetModule: '财务凭证库房', updatedAt: '2026-11-06' },
      { id: 'acc_6', name: '会计凭证条目检索', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外严禁跨部门检索其他单位的记账明细与科目', targetModule: '财务档案检索', updatedAt: '2026-11-05' },
      { id: 'acc_7', name: '电子会计凭证原件浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '非财务或专项审计人员完全屏蔽凭证图像', targetModule: '电子凭证查阅', updatedAt: '2026-11-05' },
      { id: 'acc_8', name: '会计凭证附件打印', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外无打印授权', targetModule: '财务利用中心', updatedAt: '2026-11-05' },
      { id: 'acc_9', name: '原始发票XML/OFD下载', scopeType: '在知悉范围外', policy: '默认禁止', desc: '严格阻断发票原件违规流出', targetModule: '财务凭证归档', updatedAt: '2026-11-05' },
      { id: 'acc_10', name: '纸质会计账簿实体调阅', scopeType: '在知悉范围外', policy: '需审批', desc: '纪检审计调查取证须凭正式协助调查函特批借出', targetModule: '财务凭证库房', updatedAt: '2026-11-05' },
      { id: 'acc_11', name: '银行对账单回单查验', scopeType: '在知悉范围外', policy: '默认禁止', desc: '银行资金往来对账单对外部业务处室不予开放', targetModule: '银企对账中心', updatedAt: '2026-11-04' },
      { id: 'acc_12', name: '年度财务决算综合报表查阅', scopeType: '在知悉范围外', policy: '需审批', desc: '已解密的综合统计报表需经财务分管领导批复后可查', targetModule: '决算报表专区', updatedAt: '2026-11-04' },
    ],
    science: [
      { id: 'sci_1', name: '科研成果与课题检索', scopeType: '在知悉范围内', policy: '默认允许', desc: '课题立项书、研究报告与实验原始记录条目查阅', targetModule: '科研档案检索', updatedAt: '2026-11-06' },
      { id: 'sci_2', name: '核心实验数据电子浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '在线查阅原始试验数据表、代码及测试分析报表', targetModule: '科技成果利用', updatedAt: '2026-11-06' },
      { id: 'sci_3', name: '专利文件带印打印', scopeType: '在知悉范围内', policy: '默认允许', desc: '打印专利证书复印件与申报文本', targetModule: '知识产权服务', updatedAt: '2026-11-06' },
      { id: 'sci_4', name: '实验原始记录包下载', scopeType: '在知悉范围内', policy: '需审批', desc: '核心算法模型与试验原始数据包下载须经课题负责人批准', targetModule: '数据资产保护', updatedAt: '2026-11-06' },
      { id: 'sci_5', name: '科研实物样品借出', scopeType: '在知悉范围内', policy: '需审批', desc: '科技攻关样机与标准样品借用需科研管理处双人验签', targetModule: '样品标本库房', updatedAt: '2026-11-06' },
      { id: 'sci_6', name: '科研成果与课题检索', scopeType: '在知悉范围外', policy: '默认允许', desc: '已公开技术专利与公开论文成果对全馆开放目录检索', targetModule: '科研档案检索', updatedAt: '2026-11-05' },
      { id: 'sci_7', name: '核心实验数据电子浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '未公开核心试验数据知悉范围外严禁查阅', targetModule: '科技成果利用', updatedAt: '2026-11-05' },
      { id: 'sci_8', name: '专利文件带印打印', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外用户无打印权限', targetModule: '知识产权服务', updatedAt: '2026-11-05' },
      { id: 'sci_9', name: '实验原始记录包下载', scopeType: '在知悉范围外', policy: '默认禁止', desc: '杜绝跨单位非法拷贝核心知识产权', targetModule: '数据资产保护', updatedAt: '2026-11-05' },
      { id: 'sci_10', name: '科研实物样品借出', scopeType: '在知悉范围外', policy: '需审批', desc: '外单位样品借用需科技局官方借阅批复', targetModule: '样品标本库房', updatedAt: '2026-11-05' },
    ],
    personnel: [
      { id: 'per_1', name: '干部人事目录核实', scopeType: '在知悉范围内', policy: '默认允许', desc: '组织人事部门在线核对干部基本履历条目与归档卷数', targetModule: '干部人事档案', updatedAt: '2026-11-06' },
      { id: 'per_2', name: '干部数字档案高清浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '中组部十大类标准规范下的高清全本电子阅卷', targetModule: '专网数字阅卷室', updatedAt: '2026-11-06' },
      { id: 'per_3', name: '干部履历表摘录打印', scopeType: '在知悉范围内', policy: '需审批', desc: '打印干部任免审批表必须在专用专网脱机打印机执行', targetModule: '任免考核中心', updatedAt: '2026-11-06' },
      { id: 'per_4', name: '电子人事档案包导出', scopeType: '在知悉范围内', policy: '默认禁止', desc: '人事数字公文包严禁直接拷贝导出，仅限专机专网运转', targetModule: '保密数据防护', updatedAt: '2026-11-06' },
      { id: 'per_5', name: '正本纸质干部档案出库借调', scopeType: '在知悉范围内', policy: '需审批', desc: '查借阅干部档案必须两名中共党员持介绍信同行审批', targetModule: '人事保密库房', updatedAt: '2026-11-06' },
      { id: 'per_6', name: '干部人事目录核实', scopeType: '在知悉范围外', policy: '默认禁止', desc: '非组织人事部门完全不可检索人事档案条目', targetModule: '干部人事档案', updatedAt: '2026-11-05' },
      { id: 'per_7', name: '干部数字档案高清浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外严禁进入数字阅卷室，违规将触发保密预警', targetModule: '专网数字阅卷室', updatedAt: '2026-11-05' },
      { id: 'per_8', name: '干部履历表摘录打印', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外无打印权限', targetModule: '任免考核中心', updatedAt: '2026-11-05' },
      { id: 'per_9', name: '电子人事档案包导出', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外无下载权限', targetModule: '保密数据防护', updatedAt: '2026-11-05' },
      { id: 'per_10', name: '正本纸质干部档案出库借调', scopeType: '在知悉范围外', policy: '需审批', desc: '涉及纪检巡视立案审查方可通过特殊保密通道调阅', targetModule: '人事保密库房', updatedAt: '2026-11-05' },
    ],
    electronic_doc: [
      { id: 'ed_1', name: '电子公文条目与元数据检索', scopeType: '在知悉范围内', policy: '默认允许', desc: '检索党政机关公文文号、题名、发文机关及签发人元数据', targetModule: '电子公文平台', updatedAt: '2026-11-06' },
      { id: 'ed_2', name: 'OFD电子公文正文版式浏览', scopeType: '在知悉范围内', policy: '默认允许', desc: '在线调用国家OFD版式阅读器查看加盖电子印章正文', targetModule: 'OFD版式阅读器', updatedAt: '2026-11-06' },
      { id: 'ed_3', name: '公文带红头套打输出', scopeType: '在知悉范围内', policy: '默认允许', desc: '经授权后在线套打红头文件并加注安全追溯水印', targetModule: '公文印制服务', updatedAt: '2026-11-06' },
      { id: 'ed_4', name: 'OFD版式公文电子正文下载', scopeType: '在知悉范围内', policy: '默认允许', desc: '下载原格式OFD电子文件包与数字签名证据链', targetModule: '公文利用分发', updatedAt: '2026-11-06' },
      { id: 'ed_5', name: '公文流转办理底稿原件借阅', scopeType: '在知悉范围内', policy: '需审批', desc: '纸质草稿拟文单原件提调需综合处主管领导签批', targetModule: '公文档案库房', updatedAt: '2026-11-06' },
      { id: 'ed_6', name: '电子公文条目与元数据检索', scopeType: '在知悉范围外', policy: '默认允许', desc: '知悉范围外用户仅可查询主动公开类政府公文目录', targetModule: '电子公文平台', updatedAt: '2026-11-05' },
      { id: 'ed_7', name: 'OFD电子公文正文版式浏览', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外用户禁止在线查阅内部公文OFD正文', targetModule: 'OFD版式阅读器', updatedAt: '2026-11-05' },
      { id: 'ed_8', name: '公文带红头套打输出', scopeType: '在知悉范围外', policy: '默认禁止', desc: '知悉范围外用户无打印权限', targetModule: '公文印制服务', updatedAt: '2026-11-05' },
      { id: 'ed_9', name: 'OFD版式公文电子正文下载', scopeType: '在知悉范围外', policy: '默认禁止', desc: '防止公文原文被非相关单位违规扩散', targetModule: '公文利用分发', updatedAt: '2026-11-05' },
      { id: 'ed_10', name: '公文流转办理底稿原件借阅', scopeType: '在知悉范围外', policy: '需审批', desc: '需经市委办公厅/市政府办公厅正式转交公函审批', targetModule: '公文档案库房', updatedAt: '2026-11-05' },
    ],
  };

  // 默认数据权限组件交互状态
  const [selectedPermTypeId, setSelectedPermTypeId] = useState<string>('ws_file');
  const [permViewMode, setPermViewMode] = useState<'form' | 'table'>('form');
  const [categoryFormPerms, setCategoryFormPerms] = useState(initialCategoryFormPermsMap);
  const [categoryTableRules, setCategoryTableRules] = useState(initialCategoryTableRulesMap);
  const [permTablePage, setPermTablePage] = useState<number>(1);
  const [permSearch, setPermSearch] = useState<string>('');
  const [permScopeFilter, setPermScopeFilter] = useState<'all' | '在知悉范围内' | '在知悉范围外'>('all');
  const [selectedPermRuleIds, setSelectedPermRuleIds] = useState<string[]>([]);

  // 默认数据权限弹窗状态
  const [isAddPermRuleModalOpen, setIsAddPermRuleModalOpen] = useState(false);
  const [isEditPermRuleModalOpen, setIsEditPermRuleModalOpen] = useState(false);
  const [editingPermRule, setEditingPermRule] = useState<DefaultPermRuleRow | null>(null);
  const [isScopeHelpModalOpen, setIsScopeHelpModalOpen] = useState(false);
  const [isSyncCategoryModalOpen, setIsSyncCategoryModalOpen] = useState(false);
  const [syncTargetCategoryIds, setSyncTargetCategoryIds] = useState<string[]>([]);
  const [deletePermRuleConfirm, setDeletePermRuleConfirm] = useState<{ ids: string[]; names: string[] } | null>(null);
  const [singlePermRuleToDelete, setSinglePermRuleToDelete] = useState<DefaultPermRuleRow | null>(null);

  // 表单字段绑定
  const [permRuleFormName, setPermRuleFormName] = useState('');
  const [permRuleFormScope, setPermRuleFormScope] = useState<'在知悉范围内' | '在知悉范围外'>('在知悉范围内');
  const [permRuleFormPolicy, setPermRuleFormPolicy] = useState<'默认允许' | '需审批' | '默认禁止'>('默认允许');
  const [permRuleFormDesc, setPermRuleFormDesc] = useState('');
  const [permRuleFormModule, setPermRuleFormModule] = useState('档案检索模块');

  // 当前选中的门类与数据对象
  const currentPermType = permArchiveTypeList.find((t) => t.id === selectedPermTypeId) || permArchiveTypeList[0];
  const currentCategoryForm = categoryFormPerms[selectedPermTypeId] || categoryFormPerms.ws_file;
  const currentCategoryRules = categoryTableRules[selectedPermTypeId] || [];

  // 表单模式：切换复选框状态
  const handleToggleFormCheckbox = (scope: 'insideScope' | 'outsideScope', field: keyof CategoryFormPerms['insideScope']) => {
    setCategoryFormPerms((prev) => {
      const current = prev[selectedPermTypeId] || prev.ws_file;
      return {
        ...prev,
        [selectedPermTypeId]: {
          ...current,
          [scope]: {
            ...current[scope],
            [field]: !current[scope][field],
          },
        },
      };
    });
  };

  // 表单模式：保存默认数据权限
  const handleSaveFormPerms = () => {
    const nowTime = '2026-11-06 10:15';
    setCategoryFormPerms((prev) => ({
      ...prev,
      [selectedPermTypeId]: {
        ...prev[selectedPermTypeId],
        updatedAt: nowTime,
      },
    }));
    onShowMessage(`已保存【${currentPermType.name}】的默认数据权限配置，生效时间已刷新为近期时间 (2026/11/06)`);
  };

  // 表单模式：恢复为原型默认
  const handleResetFormPerms = () => {
    setCategoryFormPerms((prev) => ({
      ...prev,
      [selectedPermTypeId]: {
        ...initialCategoryFormPermsMap[selectedPermTypeId],
        updatedAt: '2026-11-06 10:15',
      },
    }));
    onShowMessage(`已将【${currentPermType.name}】恢复为系统标准默认权限配置`);
  };

  // 表单模式：打开一键同步弹窗
  const handleOpenSyncModal = () => {
    setSyncTargetCategoryIds(permArchiveTypeList.filter((t) => t.id !== selectedPermTypeId).map((t) => t.id));
    setIsSyncCategoryModalOpen(true);
  };

  // 表单模式：执行一键同步
  const handleExecuteSyncCategories = () => {
    if (syncTargetCategoryIds.length === 0) {
      onShowMessage('请先勾选需要同步的目标档案门类');
      return;
    }
    const sourceConfig = categoryFormPerms[selectedPermTypeId];
    setCategoryFormPerms((prev) => {
      const nextMap = { ...prev };
      syncTargetCategoryIds.forEach((catId) => {
        nextMap[catId] = {
          insideScope: { ...sourceConfig.insideScope },
          outsideScope: { ...sourceConfig.outsideScope },
          updatedAt: '2026-11-06 10:15',
        };
      });
      return nextMap;
    });
    setIsSyncCategoryModalOpen(false);
    onShowMessage(`成功将【${currentPermType.name}】的默认权限配置一键同步至 ${syncTargetCategoryIds.length} 个档案门类！`);
  };

  // 表格模式：筛选与分页
  const filteredPermRules = currentCategoryRules.filter((rule) => {
    const matchSearch =
      rule.name.toLowerCase().includes(permSearch.toLowerCase()) ||
      rule.desc.toLowerCase().includes(permSearch.toLowerCase()) ||
      rule.targetModule.toLowerCase().includes(permSearch.toLowerCase());
    const matchScope = permScopeFilter === 'all' || rule.scopeType === permScopeFilter;
    return matchSearch && matchScope;
  });

  const currentPagedPermRules = filteredPermRules.slice((permTablePage - 1) * PAGE_SIZE, permTablePage * PAGE_SIZE);

  // 表格多选
  const handleToggleSelectAllPermRules = () => {
    if (selectedPermRuleIds.length === currentPagedPermRules.length && currentPagedPermRules.length > 0) {
      setSelectedPermRuleIds([]);
    } else {
      setSelectedPermRuleIds(currentPagedPermRules.map((r) => r.id));
    }
  };

  const handleToggleSelectPermRuleItem = (id: string) => {
    setSelectedPermRuleIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // 表格新增规则
  const handleOpenAddPermRuleModal = () => {
    setPermRuleFormName('');
    setPermRuleFormScope('在知悉范围内');
    setPermRuleFormPolicy('默认允许');
    setPermRuleFormDesc('');
    setPermRuleFormModule('档案检索模块');
    setIsAddPermRuleModalOpen(true);
  };

  // 表格编辑规则
  const handleOpenEditPermRuleModal = (rule?: DefaultPermRuleRow) => {
    const target = rule || currentCategoryRules.find((r) => selectedPermRuleIds.includes(r.id));
    if (!target) {
      onShowMessage('请先选择要编辑的权限项规则');
      return;
    }
    setEditingPermRule(target);
    setPermRuleFormName(target.name);
    setPermRuleFormScope(target.scopeType);
    setPermRuleFormPolicy(target.policy);
    setPermRuleFormDesc(target.desc);
    setPermRuleFormModule(target.targetModule);
    setIsEditPermRuleModalOpen(true);
  };

  // 保存新增/编辑
  const handleSavePermRuleSubmit = (isEdit: boolean) => {
    if (!permRuleFormName.trim()) {
      onShowMessage('请输入权限项名称');
      return;
    }
    if (!permRuleFormDesc.trim()) {
      onShowMessage('请输入权限控制说明');
      return;
    }
    if (isEdit && editingPermRule) {
      setCategoryTableRules((prev) => ({
        ...prev,
        [selectedPermTypeId]: prev[selectedPermTypeId].map((r) =>
          r.id === editingPermRule.id
            ? {
                ...r,
                name: permRuleFormName.trim(),
                scopeType: permRuleFormScope,
                policy: permRuleFormPolicy,
                desc: permRuleFormDesc.trim(),
                targetModule: permRuleFormModule.trim(),
                updatedAt: '2026-11-06',
              }
            : r
        ),
      }));
      setIsEditPermRuleModalOpen(false);
      onShowMessage(`已更新权限项【${permRuleFormName}】控制策略，近期时间 2026-11-06`);
    } else {
      const newRule: DefaultPermRuleRow = {
        id: `perm_${Date.now()}`,
        name: permRuleFormName.trim(),
        scopeType: permRuleFormScope,
        policy: permRuleFormPolicy,
        desc: permRuleFormDesc.trim(),
        targetModule: permRuleFormModule.trim(),
        updatedAt: '2026-11-06',
      };
      setCategoryTableRules((prev) => ({
        ...prev,
        [selectedPermTypeId]: [newRule, ...prev[selectedPermTypeId]],
      }));
      setIsAddPermRuleModalOpen(false);
      onShowMessage(`已成功为【${currentPermType.name}】新增权限项【${newRule.name}】！`);
    }
  };

  // 表格批量修改策略
  const handleBatchSetPolicy = (policy: '默认允许' | '需审批' | '默认禁止') => {
    if (selectedPermRuleIds.length === 0) {
      onShowMessage('请先在表格左侧勾选要操作的权限项');
      return;
    }
    setCategoryTableRules((prev) => ({
      ...prev,
      [selectedPermTypeId]: prev[selectedPermTypeId].map((r) =>
        selectedPermRuleIds.includes(r.id) ? { ...r, policy, updatedAt: '2026-11-06' } : r
      ),
    }));
    onShowMessage(`已将所选 ${selectedPermRuleIds.length} 个权限项策略批量设置为【${policy}】`);
  };

  // 表格批量删除
  const handleBatchDeletePermRules = () => {
    if (selectedPermRuleIds.length === 0) {
      onShowMessage('请先在表格左侧勾选要删除的权限项');
      return;
    }
    const names = currentCategoryRules.filter((r) => selectedPermRuleIds.includes(r.id)).map((r) => r.name);
    setDeletePermRuleConfirm({ ids: selectedPermRuleIds, names });
  };

  const handleConfirmBatchDeletePermRules = () => {
    if (!deletePermRuleConfirm) return;
    setCategoryTableRules((prev) => ({
      ...prev,
      [selectedPermTypeId]: prev[selectedPermTypeId].filter((r) => !deletePermRuleConfirm.ids.includes(r.id)),
    }));
    setSelectedPermRuleIds([]);
    setDeletePermRuleConfirm(null);
    onShowMessage(`已成功批量删除 ${deletePermRuleConfirm.ids.length} 个权限项规则！`);
  };

  // 单行操作
  const handleSinglePermRuleDelete = (row: DefaultPermRuleRow) => {
    setSinglePermRuleToDelete(row);
  };

  const handleConfirmSinglePermRuleDelete = () => {
    if (!singlePermRuleToDelete) return;
    setCategoryTableRules((prev) => ({
      ...prev,
      [selectedPermTypeId]: prev[selectedPermTypeId].filter((r) => r.id !== singlePermRuleToDelete.id),
    }));
    setSinglePermRuleToDelete(null);
    onShowMessage(`已删除权限规则【${singlePermRuleToDelete.name}】`);
  };

  const handleToggleSinglePolicy = (row: DefaultPermRuleRow) => {
    const nextPolicy: '默认允许' | '需审批' | '默认禁止' =
      row.policy === '默认允许' ? '需审批' : row.policy === '需审批' ? '默认禁止' : '默认允许';
    setCategoryTableRules((prev) => ({
      ...prev,
      [selectedPermTypeId]: prev[selectedPermTypeId].map((r) =>
        r.id === row.id ? { ...r, policy: nextPolicy, updatedAt: '2026-11-06' } : r
      ),
    }));
    onShowMessage(`【${row.name}】策略已快捷切换为：${nextPolicy}`);
  };

  // ==========================================
  // 10. 报表维护 (setting_report_maintenance)
  // ==========================================
  interface ReportMaintenanceTreeNode {
    id: string;
    name: string;
    level: number;
    parentId?: string;
    isLeaf?: boolean;
  }

  interface MaintenanceReportItem {
    id: string;
    name: string;
    desc: string;
    paperSpec: string;
    engine: string;
    updateTime: string;
  }

  const initialReportTreeNodes: ReportMaintenanceTreeNode[] = [
    // 根节点 1: 档案类型列表
    { id: 'root_type_list', name: '档案类型列表', level: 0 },
    { id: 'ws_simple', name: '文书档案（简化）', level: 1, parentId: 'root_type_list' },
    { id: 'ws_simple_file', name: '文件', level: 2, parentId: 'ws_simple', isLeaf: true },
    { id: 'ws_trad', name: '文书档案（传统）', level: 1, parentId: 'root_type_list' },
    { id: 'ws_trad_file', name: '文件', level: 2, parentId: 'ws_trad', isLeaf: true },
    { id: 'ws_trad_vol', name: '案卷', level: 2, parentId: 'ws_trad', isLeaf: true },
    { id: 'eng_build', name: '基建档案', level: 1, parentId: 'root_type_list' },
    { id: 'eng_build_proj', name: '项目', level: 2, parentId: 'eng_build', isLeaf: true },
    { id: 'eng_build_vol', name: '案卷', level: 2, parentId: 'eng_build', isLeaf: true },
    { id: 'eng_build_file', name: '文件', level: 2, parentId: 'eng_build', isLeaf: true },
    { id: 'acc', name: '会计档案', level: 1, parentId: 'root_type_list', isLeaf: true },
    { id: 'per', name: '人事档案', level: 1, parentId: 'root_type_list', isLeaf: true },
    { id: 'equip', name: '设备档案', level: 1, parentId: 'root_type_list', isLeaf: true },
    { id: 'photo', name: '照片档案', level: 1, parentId: 'root_type_list', isLeaf: true },
    { id: 'av', name: '声像档案', level: 1, parentId: 'root_type_list', isLeaf: true },
    { id: 'phys', name: '实物档案', level: 1, parentId: 'root_type_list', isLeaf: true },
    { id: 'prod', name: '产品档案', level: 1, parentId: 'root_type_list', isLeaf: true },
    { id: 'sci', name: '科研档案', level: 1, parentId: 'root_type_list', isLeaf: true },

    // 根节点 2: 档案销毁表
    { id: 'root_destroy_list', name: '档案销毁表', level: 0 },
    { id: 'des_ws_simple', name: '文书档案（简化）', level: 1, parentId: 'root_destroy_list' },
    { id: 'des_ws_simple_file', name: '文件', level: 2, parentId: 'des_ws_simple', isLeaf: true },
    { id: 'des_ws_trad', name: '文书档案（传统）', level: 1, parentId: 'root_destroy_list' },
    { id: 'des_ws_trad_file', name: '文件', level: 2, parentId: 'des_ws_trad', isLeaf: true },
    { id: 'des_ws_trad_vol', name: '案卷', level: 2, parentId: 'des_ws_trad', isLeaf: true },
    { id: 'des_eng_build', name: '基建档案', level: 1, parentId: 'root_destroy_list' },
    { id: 'des_eng_build_proj', name: '项目', level: 2, parentId: 'des_eng_build', isLeaf: true },
    { id: 'des_eng_build_vol', name: '案卷', level: 2, parentId: 'des_eng_build', isLeaf: true },
    { id: 'des_eng_build_file', name: '文件', level: 2, parentId: 'des_eng_build', isLeaf: true },
    { id: 'des_acc', name: '会计档案', level: 1, parentId: 'root_destroy_list', isLeaf: true },
    { id: 'des_per', name: '人事档案', level: 1, parentId: 'root_destroy_list', isLeaf: true },
    { id: 'des_equip', name: '设备档案', level: 1, parentId: 'root_destroy_list', isLeaf: true },
    { id: 'des_photo', name: '照片档案', level: 1, parentId: 'root_destroy_list', isLeaf: true },
    { id: 'des_av', name: '声像档案', level: 1, parentId: 'root_destroy_list', isLeaf: true },
    { id: 'des_phys', name: '实物档案', level: 1, parentId: 'root_destroy_list', isLeaf: true },
    { id: 'des_prod', name: '产品档案', level: 1, parentId: 'root_destroy_list', isLeaf: true },
    { id: 'des_sci', name: '科研档案', level: 1, parentId: 'root_destroy_list', isLeaf: true },
  ];

  // 各目录树节点的真实报表模板数据集（严格对齐截图前两行真实化，每类10~12条，近期时间2026年11月）
  const initialMaintenanceReportsMap: Record<string, MaintenanceReportItem[]> = {
    // 截图默认选中节点：文书档案（传统） -> 案卷
    ws_trad_vol: [
      { id: 'rep_wt_v_1', name: '备考表', desc: '传统文书案卷卷内备考表（包含件数统计、页数汇总、立卷人与检查人手写签章栏）', paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-06 09:20:15' },
      { id: 'rep_wt_v_2', name: '卷内目录', desc: '传统文书卷内文件目录清册（包含顺序号、文号、责任者、题名、成文日期、页号）', paperSpec: 'A4横版', engine: 'JasperReports引擎', updateTime: '2026-11-06 08:45:10' },
      { id: 'rep_wt_v_3', name: '案卷封面', desc: '归档案卷标准外封面（全宗号、目录号、案卷号、案卷题名、起止日期、保管期限、密级）', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-06 08:30:00' },
      { id: 'rep_wt_v_4', name: '档案盒脊背签', desc: '标准归档盒脊背标识签（全宗号、年度、分类号、起止件号、盒流水号、排架号）', paperSpec: '脊背标签连续纸', engine: 'FastReport引擎', updateTime: '2026-11-05 17:15:20' },
      { id: 'rep_wt_v_5', name: '案卷移交交接凭单', desc: '部门立卷向机关综合档案室批量移交接收签章凭单', paperSpec: 'A4竖版', engine: 'Excel数据套打', updateTime: '2026-11-05 16:40:11' },
      { id: 'rep_wt_v_6', name: '案卷借阅利用审批单', desc: '涉及秘密及受控案卷查借阅审批与实体出库登记联单', paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-05 15:20:00' },
      { id: 'rep_wt_v_7', name: '组卷质量终验合格凭证', desc: '组卷四性检测与著录规范性终验合格报告单', paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-05 14:10:30' },
      { id: 'rep_wt_v_8', name: '案卷排架导引定位卡', desc: '库房密集架列/节/层物理位置指引与条码识别单', paperSpec: 'A5横版', engine: 'FastReport引擎', updateTime: '2026-11-05 11:35:45' },
      { id: 'rep_wt_v_9', name: '卷内文件著录项明细表', desc: '全宗下卷内各单件电子全文关联与元数据清单', paperSpec: 'A4横版', engine: 'Excel数据套打', updateTime: '2026-11-04 16:50:18' },
      { id: 'rep_wt_v_10', name: '案卷密级划定审核表', desc: '保密委员会定密、解密与保密期限审核表决单', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-04 15:30:10' },
      { id: 'rep_wt_v_11', name: '保管期限届满鉴定清册', desc: '达到保管期限的待鉴定案卷专家评估审查清册', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-04 11:15:00' },
      { id: 'rep_wt_v_12', name: '案卷数字化扫描清册', desc: '原件拆卷、扫描数字化加工、质检验收流转单', paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-04 09:40:22' },
    ],
    // 文书档案（传统） -> 文件
    ws_trad_file: [
      { id: 'rep_wt_f_1', name: '归档文件目录', desc: '传统文书归档文件件次目录（DA/T 18-1999规范格式）', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-06 09:10:00' },
      { id: 'rep_wt_f_2', name: '公文发文登记簿', desc: '机关发文流水号、发文主送机关、拟稿人与成文日期清册', paperSpec: 'A4横版', engine: 'Excel数据套打', updateTime: '2026-11-06 08:55:00' },
      { id: 'rep_wt_f_3', name: '收文呈批办理便笺', desc: '外部来文收文登记、领导批示与承办科室办理流转单', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-05 16:30:00' },
      { id: 'rep_wt_f_4', name: '单件归档章套打', desc: '全宗号/年度/保管期限/机构/件号归档章印戳套打模板', paperSpec: '印戳固定尺寸', engine: 'FastReport引擎', updateTime: '2026-11-05 14:20:00' },
      { id: 'rep_wt_f_5', name: '会议纪要专项目录', desc: '局党组会议与办公会议纪要编研专用检索清册', paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-05 11:10:00' },
      { id: 'rep_wt_f_6', name: '电子文件固化验签单', desc: '单件公文电子正文SM3国密散列值与时间戳固化凭证', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-04 17:00:00' },
      { id: 'rep_wt_f_7', name: '红头文件清退记录单', desc: '涉密与受控红头公文清退、销毁与注销明细凭据', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-04 15:00:00' },
      { id: 'rep_wt_f_8', name: '文件摘录利用证明书', desc: '档案查阅窗口出具加盖电子业务印章的档案摘录证明', paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-04 10:30:00' },
      { id: 'rep_wt_f_9', name: '发文代字代号统计表', desc: '按主办处室及字轨汇总发文总件数及页数统计表', paperSpec: 'A4横版', engine: 'Excel数据套打', updateTime: '2026-11-03 16:40:00' },
      { id: 'rep_wt_f_10', name: '未归档公文催交通知单', desc: '督促业务处室按期完成本年度应归档公文档案移交通知', paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-03 14:15:00' },
      { id: 'rep_wt_f_11', name: '跨年度公文档案关联清单', desc: '跨年度办理延续公文与原件案卷关联指引表', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-03 09:20:00' },
    ],
    // 文书档案（简化） -> 文件
    ws_simple_file: [
      { id: 'rep_ws_f_1', name: '归档文件目录 (DA/T 13-2022)', desc: '国家标准《归档文件整理规则》法定格式文件件次目录', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-06 09:30:00' },
      { id: 'rep_ws_f_2', name: '归档章自动套打单', desc: '全宗号/年度/室编件号/馆编件号一体化归档章批量套打', paperSpec: '印戳套打', engine: 'FastReport引擎', updateTime: '2026-11-06 09:00:00' },
      { id: 'rep_ws_f_3', name: '盒内文件清单', desc: '标准档案盒内单件文件按顺序号排架明细表', paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-05 16:50:00' },
      { id: 'rep_ws_f_4', name: '盒脊背签 (简化装订)', desc: '按盒立卷简易脊背标签（全宗号、年度、保管期限、盒号）', paperSpec: '脊背标签连续纸', engine: 'FastReport引擎', updateTime: '2026-11-05 14:30:00' },
      { id: 'rep_ws_f_5', name: '归档文件移交目录', desc: '简化装订文书档案批量移交馆藏交接签字清册', paperSpec: 'A4横版', engine: 'Excel数据套打', updateTime: '2026-11-05 11:20:00' },
      { id: 'rep_ws_f_6', name: '四性检测批量合格证书', desc: '真实性/完整性/可用性/安全性全自动四性校验单', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-04 17:15:00' },
      { id: 'rep_ws_f_7', name: '单件借阅凭单', desc: '政务大厅借阅单件文书实体与电子版调阅凭单', paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-04 15:40:00' },
      { id: 'rep_ws_f_8', name: '档案分类消长明细单', desc: '按十进制定额分类法统计划分文件件数与张数消长表', paperSpec: 'A4横版', engine: 'Excel数据套打', updateTime: '2026-11-04 10:10:00' },
      { id: 'rep_ws_f_9', name: '缺件与错号排查清册', desc: '系统件号流水断号、重号与空号智能核查结果清册', paperSpec: 'A4横版', engine: 'JasperReports引擎', updateTime: '2026-11-03 16:30:00' },
      { id: 'rep_ws_f_10', name: '密级转换与降密备查表', desc: '定期涉密公文解密判定会签与备查记录单', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-03 14:00:00' },
      { id: 'rep_ws_f_11', name: '电子文件格式转换检测单', desc: 'DOCX转OFD版式转换合规性排版质检记录表', paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-03 11:00:00' },
    ],
    // 基建档案 -> 项目
    eng_build_proj: [
      { id: 'rep_eng_p_1', name: '建设项目档案总目录', desc: '立项批复、规划许可、招投标、施工、监理至竣工总清册', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-06 09:15:00' },
      { id: 'rep_eng_p_2', name: '工程竣工验收备案鉴定表', desc: '建设/勘察/设计/施工/监理五方责任主体签署验收报告', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-06 08:40:00' },
      { id: 'rep_eng_p_3', name: '工程图纸折叠封签', desc: '标准手风琴式工程图纸折叠背签与工程编号条码', paperSpec: '工程图折标签', engine: 'FastReport引擎', updateTime: '2026-11-05 16:10:00' },
      { id: 'rep_eng_p_4', name: '基建项目交接凭证', desc: '城建档案馆与项目建设单位工程资料交接法定凭证', paperSpec: 'A4竖版', engine: 'Excel数据套打', updateTime: '2026-11-05 14:00:00' },
      { id: 'rep_eng_p_5', name: '隐蔽工程验收记录汇总', desc: '地基与主体结构隐蔽工程全流程签字质量汇总表', paperSpec: 'A4横版', engine: 'JasperReports引擎', updateTime: '2026-11-05 10:50:00' },
      { id: 'rep_eng_p_6', name: '重大设计变更台账', desc: '工程设计修改通知书、工程技术核定单按图纸序号索引表', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-04 16:30:00' },
      { id: 'rep_eng_p_7', name: '工程质量终身责任承诺卡', desc: '各专业注册建造师、总监理工程师终身质量责任清册', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-04 14:40:00' },
      { id: 'rep_eng_p_8', name: '基建图纸大幅面晒图单', desc: '0号/1号大幅面图纸外协晒图与底图借阅结算单', paperSpec: 'A4横版', engine: 'Excel数据套打', updateTime: '2026-11-04 09:50:00' },
      { id: 'rep_eng_p_9', name: '沉降观测全周期记录表', desc: '主体建筑施工期至交付后沉降观测水准测量记录表', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-03 15:20:00' },
      { id: 'rep_eng_p_10', name: 'BIM数字模型交付证明', desc: '三维建筑信息模型LOD400交付与数据验签报告', paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-03 11:30:00' },
    ],
    // 档案销毁表 -> 文书档案（传统） -> 案卷
    des_ws_trad_vol: [
      { id: 'rep_des_1', name: '档案保管期限届满销毁清册', desc: '依法对保管期限届满且无利用价值案卷集体评估的销毁清册', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-06 09:40:00' },
      { id: 'rep_des_2', name: '档案销毁监销确认单', desc: '办公厅保密办、纪检监察室与档案局三方现场监销双签单', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-06 08:50:00' },
      { id: 'rep_des_3', name: '涉密档案特批销毁审批公函', desc: '涉密档案销毁前经市委保密委员会批复的正式同意公函', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-05 16:20:00' },
      { id: 'rep_des_4', name: '档案送熔保密运输押运单', desc: '销毁实体押送造纸厂或专业化碎浆厂武装押运交接单', paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-05 14:10:00' },
      { id: 'rep_des_5', name: '电子文件彻底粉碎清零凭证', desc: '涉密存储介质物理消磁与电子数据七次覆写不可恢复凭证', paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-05 11:00:00' },
      { id: 'rep_des_6', name: '专家鉴定评审打分表决表', desc: '档案鉴定专家组关于存毁意见的逐卷记名投票审查表', paperSpec: 'A4横版', engine: 'Excel数据套打', updateTime: '2026-11-04 16:45:00' },
      { id: 'rep_des_7', name: '销毁案卷历史利用频次分析表', desc: '被提请销毁案卷在近十年间的借阅利用频次统计核验单', paperSpec: 'A4横版', engine: 'Excel数据套打', updateTime: '2026-11-04 15:10:00' },
      { id: 'rep_des_8', name: '销毁案卷元数据永久归档卡', desc: '实体销毁后目录元数据加注【已销毁】标记永久留存备查卡', paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-04 10:20:00' },
      { id: 'rep_des_9', name: '局务会销毁议案决议摘录', desc: '局长办公会集体研究同意档案销毁议案会议记录摘抄件', paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-03 16:15:00' },
      { id: 'rep_des_10', name: '年度档案销毁综合通报单', desc: '报送上级国家档案主管部门的年度例行销毁统计通报表', paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-03 11:20:00' },
    ],
  };

  // 默认通用的节点报表数据集兜底生成器（确保每个节点均有10条真实数据）
  const getFallbackReportsForNode = (nodeName: string): MaintenanceReportItem[] => [
    { id: `rep_fb_1`, name: `${nodeName}分类总目录表`, desc: `国家标准规范下${nodeName}标准化全宗分类汇总目录清单`, paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-06 09:10:00' },
    { id: `rep_fb_2`, name: `${nodeName}卷皮外封面`, desc: `标准专用装具封面印刷套打模板（全宗/年度/目录号/题名）`, paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-06 08:35:00' },
    { id: `rep_fb_3`, name: `${nodeName}卷内备考表`, desc: `记录${nodeName}组卷时间、张数统计、立卷人检查人签章专用单`, paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-05 16:45:00' },
    { id: `rep_fb_4`, name: `${nodeName}移交进馆凭证`, desc: `${nodeName}按批次验收进馆双签凭单与质量终检证明书`, paperSpec: 'A4竖版', engine: 'Excel数据套打', updateTime: '2026-11-05 14:15:00' },
    { id: `rep_fb_5`, name: `${nodeName}排架定位标签`, desc: `库房密集架物理坐标RFID/条码一体化标签连续纸打印模板`, paperSpec: '脊背标签连续纸', engine: 'FastReport引擎', updateTime: '2026-11-05 11:25:00' },
    { id: `rep_fb_6`, name: `${nodeName}借阅出证专用单`, desc: `面向政务外网及公众出具的${nodeName}复印认证证明公函`, paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-04 16:30:00' },
    { id: `rep_fb_7`, name: `${nodeName}四性检测质检报告`, desc: `真实性、完整性、可用性、安全性全生命周期国标质检表`, paperSpec: 'A4竖版', engine: 'OFD版式套打', updateTime: '2026-11-04 14:20:00' },
    { id: `rep_fb_8`, name: `${nodeName}密级定密审批表`, desc: `根据保密法评定的${nodeName}密级期限与知悉范围审核联单`, paperSpec: 'A4竖版', engine: 'FastReport引擎', updateTime: '2026-11-04 10:15:00' },
    { id: `rep_fb_9`, name: `${nodeName}期满鉴定清册`, desc: `保管期限届满延期或合规销毁评估清册`, paperSpec: 'A4横版', engine: 'FastReport引擎', updateTime: '2026-11-03 16:00:00' },
    { id: `rep_fb_10`, name: `${nodeName}数字化验收单`, desc: `高清扫描图像质量验收与元数据挂接验收凭据`, paperSpec: 'A4竖版', engine: 'JasperReports引擎', updateTime: '2026-11-03 11:30:00' },
  ];

  // 报表维护核心交互状态
  const [selectedReportTreeNodeId, setSelectedReportTreeNodeId] = useState<string>('ws_trad_vol');
  const [expandedReportTreeNodes, setExpandedReportTreeNodes] = useState<string[]>([
    'root_type_list',
    'ws_trad',
    'ws_simple',
    'root_destroy_list',
    'des_ws_trad',
  ]);
  const [maintenanceReportsMap, setMaintenanceReportsMap] = useState<Record<string, MaintenanceReportItem[]>>(initialMaintenanceReportsMap);
  const [reportPage, setReportPage] = useState<number>(1);
  const [reportSearch, setReportSearch] = useState<string>('');
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [reportViewMode, setReportViewMode] = useState<'table' | 'cards'>('table');

  // 模态框状态
  const [isNewReportModalOpen, setIsNewReportModalOpen] = useState<boolean>(false);
  const [isEditReportModalOpen, setIsEditReportModalOpen] = useState<boolean>(false);
  const [isDesignReportModalOpen, setIsDesignReportModalOpen] = useState<boolean>(false);
  const [isPreviewReportModalOpen, setIsPreviewReportModalOpen] = useState<boolean>(false);
  const [deleteReportConfirm, setDeleteReportConfirm] = useState<{ ids: string[]; names: string[] } | null>(null);
  const [singleReportToDelete, setSingleReportToDelete] = useState<MaintenanceReportItem | null>(null);

  // 表单状态与当前操作项
  const [activeReportItem, setActiveReportItem] = useState<MaintenanceReportItem | null>(null);
  const [reportFormName, setReportFormName] = useState<string>('');
  const [reportFormDesc, setReportFormDesc] = useState<string>('');
  const [reportFormPaper, setReportFormPaper] = useState<string>('A4竖版');
  const [reportFormEngine, setReportFormEngine] = useState<string>('FastReport引擎');

  // 当前树节点与当前报表列表计算
  const currentReportTreeNode =
    initialReportTreeNodes.find((n) => n.id === selectedReportTreeNodeId) ||
    initialReportTreeNodes.find((n) => n.id === 'ws_trad_vol')!;

  const currentRawReports =
    maintenanceReportsMap[selectedReportTreeNodeId] ||
    getFallbackReportsForNode(currentReportTreeNode.name);

  const filteredMaintenanceReports = currentRawReports.filter((item) => {
    return (
      item.name.toLowerCase().includes(reportSearch.toLowerCase()) ||
      item.desc.toLowerCase().includes(reportSearch.toLowerCase()) ||
      item.paperSpec.toLowerCase().includes(reportSearch.toLowerCase()) ||
      item.engine.toLowerCase().includes(reportSearch.toLowerCase())
    );
  });

  const currentPagedMaintenanceReports = filteredMaintenanceReports.slice(
    (reportPage - 1) * PAGE_SIZE,
    reportPage * PAGE_SIZE
  );

  // 树节点折叠展开切换
  const handleToggleReportTreeExpand = (nodeId: string) => {
    setExpandedReportTreeNodes((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // 选择树节点
  const handleSelectReportTreeNode = (node: ReportMaintenanceTreeNode) => {
    setSelectedReportTreeNodeId(node.id);
    setReportPage(1);
    setSelectedReportIds([]);
    // 确保父节点展开
    if (node.parentId && !expandedReportTreeNodes.includes(node.parentId)) {
      setExpandedReportTreeNodes((prev) => [...prev, node.parentId!]);
    }
  };

  // 表格多选切换
  const handleToggleSelectAllReports = () => {
    if (selectedReportIds.length === currentPagedMaintenanceReports.length && currentPagedMaintenanceReports.length > 0) {
      setSelectedReportIds([]);
    } else {
      setSelectedReportIds(currentPagedMaintenanceReports.map((r) => r.id));
    }
  };

  const handleToggleSelectReportItem = (id: string) => {
    setSelectedReportIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
  };

  // 打开新建报表模态框
  const handleOpenNewReportModal = () => {
    setReportFormName('');
    setReportFormDesc('');
    setReportFormPaper('A4竖版');
    setReportFormEngine('FastReport引擎');
    setIsNewReportModalOpen(true);
  };

  // 打开编辑报表模态框
  const handleOpenEditReportModal = (item?: MaintenanceReportItem) => {
    const target = item || currentRawReports.find((r) => selectedReportIds.includes(r.id));
    if (!target) {
      onShowMessage('请先在表格中勾选要编辑的报表模板');
      return;
    }
    setActiveReportItem(target);
    setReportFormName(target.name);
    setReportFormDesc(target.desc);
    setReportFormPaper(target.paperSpec);
    setReportFormEngine(target.engine);
    setIsEditReportModalOpen(true);
  };

  // 打开设计器
  const handleOpenDesignReportModal = (item?: MaintenanceReportItem) => {
    const target = item || currentRawReports.find((r) => selectedReportIds.includes(r.id)) || currentPagedMaintenanceReports[0];
    if (!target) {
      onShowMessage('请先选择要设计的报表模板');
      return;
    }
    setActiveReportItem(target);
    setIsDesignReportModalOpen(true);
  };

  // 打开打印预览
  const handleOpenPreviewReportModal = (item: MaintenanceReportItem) => {
    setActiveReportItem(item);
    setIsPreviewReportModalOpen(true);
  };

  // 保存新建/编辑报表
  const handleSaveReportSubmit = (isEdit: boolean) => {
    if (!reportFormName.trim()) {
      onShowMessage('请输入报表名称');
      return;
    }
    const nowTime = '2026-11-06 10:25:00';
    if (isEdit && activeReportItem) {
      setMaintenanceReportsMap((prev) => {
        const list = prev[selectedReportTreeNodeId] || getFallbackReportsForNode(currentReportTreeNode.name);
        return {
          ...prev,
          [selectedReportTreeNodeId]: list.map((r) =>
            r.id === activeReportItem.id
              ? {
                  ...r,
                  name: reportFormName.trim(),
                  desc: reportFormDesc.trim() || '标准归档报表输出模板',
                  paperSpec: reportFormPaper,
                  engine: reportFormEngine,
                  updateTime: nowTime,
                }
              : r
          ),
        };
      });
      setIsEditReportModalOpen(false);
      onShowMessage(`已成功更新报表【${reportFormName}】模板定义！`);
    } else {
      const newReport: MaintenanceReportItem = {
        id: `rep_${Date.now()}`,
        name: reportFormName.trim(),
        desc: reportFormDesc.trim() || '标准归档报表输出模板',
        paperSpec: reportFormPaper,
        engine: reportFormEngine,
        updateTime: nowTime,
      };
      setMaintenanceReportsMap((prev) => {
        const list = prev[selectedReportTreeNodeId] || getFallbackReportsForNode(currentReportTreeNode.name);
        return {
          ...prev,
          [selectedReportTreeNodeId]: [newReport, ...list],
        };
      });
      setIsNewReportModalOpen(false);
      onShowMessage(`已成功为【${currentReportTreeNode.name}】新建报表【${newReport.name}】！`);
    }
  };

  // 批量删除
  const handleBatchDeleteReports = () => {
    if (selectedReportIds.length === 0) {
      onShowMessage('请先在表格左侧勾选要删除的报表模板');
      return;
    }
    const names = currentRawReports.filter((r) => selectedReportIds.includes(r.id)).map((r) => r.name);
    setDeleteReportConfirm({ ids: selectedReportIds, names });
  };

  const handleConfirmBatchDeleteReports = () => {
    if (!deleteReportConfirm) return;
    setMaintenanceReportsMap((prev) => {
      const list = prev[selectedReportTreeNodeId] || getFallbackReportsForNode(currentReportTreeNode.name);
      return {
        ...prev,
        [selectedReportTreeNodeId]: list.filter((r) => !deleteReportConfirm.ids.includes(r.id)),
      };
    });
    setSelectedReportIds([]);
    setDeleteReportConfirm(null);
    onShowMessage(`已成功批量删除 ${deleteReportConfirm.ids.length} 个报表模板！`);
  };

  // 单行删除
  const handleSingleReportDelete = (item: MaintenanceReportItem) => {
    setSingleReportToDelete(item);
  };

  const handleConfirmSingleReportDelete = () => {
    if (!singleReportToDelete) return;
    setMaintenanceReportsMap((prev) => {
      const list = prev[selectedReportTreeNodeId] || getFallbackReportsForNode(currentReportTreeNode.name);
      return {
        ...prev,
        [selectedReportTreeNodeId]: list.filter((r) => r.id !== singleReportToDelete.id),
      };
    });
    setSingleReportToDelete(null);
    onShowMessage(`已成功删除报表【${singleReportToDelete.name}】`);
  };

  // Tab configurations
  const submodulesConfig = [
    { key: 'setting_fonds', label: '全宗管理', icon: Landmark, count: fondsNodes.length },
    { key: 'setting_archive_types', label: '档案类型管理', icon: Layers, count: archiveTypeNodes.length },
    { key: 'setting_classification', label: '分类设置', icon: FolderTree, count: classTree.length },
    { key: 'setting_catalog_tree', label: '目录树维护', icon: Network, count: treeList.length },
    { key: 'setting_retention_period', label: '保管期限', icon: Clock, count: allCurrentRetentionItems.length },
    { key: 'setting_security_level', label: '密级', icon: Lock, count: allCurrentSecurityItems.length },
    { key: 'setting_special_topics', label: '专题类型设置', icon: Sparkles, count: topicList.length },
    { key: 'setting_metadata_rules', label: '著录项规则设置', icon: Sliders, count: currentMetaItems.length },
    { key: 'setting_default_permissions', label: '默认数据权限', icon: ShieldCheck, count: permArchiveTypeList.length },
    { key: 'setting_report_maintenance', label: '报表维护', icon: FileSpreadsheet, count: initialReportTreeNodes.length },
  ];

  // Common submodules modal handler
  const openActionModal = (mode: 'add' | 'edit' | 'detail', title: string, item?: any) => {
    setModalMode(mode);
    setModalTitle(title);
    setCurrentEditItem(item || null);
    setIsModalOpen(true);
  };

  // Fonds helper calculations
  const currentFondsNode = fondsNodes.find((n) => n.id === selectedFondsId) || fondsNodes[0];
  const allCurrentArchives = fondsArchives[selectedFondsId] || [];
  const filteredCurrentArchives = allCurrentArchives.filter((item) => {
    const matchesSearch =
      archiveSearch.trim() === '' ||
      item.archiveCode.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      item.title.toLowerCase().includes(archiveSearch.toLowerCase()) ||
      item.author.toLowerCase().includes(archiveSearch.toLowerCase());
    const matchesCategory =
      archiveCategoryFilter === '全部' || item.category === archiveCategoryFilter;
    return matchesSearch && matchesCategory;
  });
  const paginatedCurrentArchives = filteredCurrentArchives.slice(
    (archivePage - 1) * PAGE_SIZE,
    archivePage * PAGE_SIZE
  );

  // Handler for selecting node in tree
  const handleSelectFondsNode = (node: FondsNode) => {
    setSelectedFondsId(node.id);
    setFormUnitName(node.unitName);
    setFormUnitCode(node.unitCode);
    setFormFondsNo(node.fondsNo);
    setFormFondsName(node.fondsName);
    setFormRemark(node.remark);
    setArchivePage(1);
    setArchiveSearch('');
  };

  // Toggle tree node expansion
  const toggleNodeExpanded = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // Handler for unit name dropdown change
  const handleUnitNameChange = (unitName: string) => {
    setFormUnitName(unitName);
    const matched = configuredUnits.find((u) => u.name === unitName);
    if (matched) {
      setFormUnitCode(matched.code);
      setFormFondsNo(matched.defaultFondsNo);
      setFormFondsName(matched.name);
    }
  };

  // Save current fonds
  const handleSaveFonds = () => {
    setFondsNodes((prev) =>
      prev.map((n) =>
        n.id === selectedFondsId
          ? {
              ...n,
              name: formFondsName,
              unitName: formUnitName,
              unitCode: formUnitCode,
              fondsNo: formFondsNo,
              fondsName: formFondsName,
              remark: formRemark,
            }
          : n
      )
    );
    onShowMessage(`已成功保存【${formFondsName}】全宗信息，国密配置已更新！`);
  };

  // Delete Fonds with 4 rules check
  const handleDeleteFonds = () => {
    const currentNode = fondsNodes.find((n) => n.id === selectedFondsId);
    if (!currentNode) return;

    // Rule 1: 顶级全宗单位不能被删除
    if (currentNode.isRoot || currentNode.id === 'root') {
      setDeleteRuleNotice({
        open: true,
        ruleNumber: 1,
        title: '【规则约束 1】顶级全宗单位不能被删除',
        message: '系统顶层【全宗列表】为根全宗单位，属于国家档案管理体系法定根节点，受底座永久保护，禁止删除。',
        canConfirm: false,
      });
      return;
    }

    // Rule 2: 有子节点的全宗无法删除，需要先删除子节点；
    const childNodes = fondsNodes.filter((n) => n.parentId === currentNode.id);
    if (childNodes.length > 0) {
      setDeleteRuleNotice({
        open: true,
        ruleNumber: 2,
        title: '【规则约束 2】有子节点的全宗无法删除',
        message: `当前全宗【${currentNode.name}】下仍挂载 ${childNodes.length} 个下属机构全宗节点（如：${childNodes.map((c) => c.name).slice(0, 3).join('、')}等），需要先逐一清空或注销全部子节点后方可删除。`,
        canConfirm: false,
      });
      return;
    }

    // Rule 3: 全宗里有正式档案库文件的也无法被删除，需要先删除档案
    const currentFiles = fondsArchives[currentNode.id] || [];
    if (currentFiles.length > 0) {
      setDeleteRuleNotice({
        open: true,
        ruleNumber: 3,
        title: '【规则约束 3】全宗里有正式档案库文件无法删除',
        message: `全宗【${currentNode.name}】名下尚存有 ${currentFiles.length} 卷/件正式在库归档文件，无法被删除！需要先在下方明细台账中清空或移交全部档案卷宗后方可注销。`,
        canConfirm: false,
      });
      return;
    }

    // Rule 4: 删除后，非档案库文件将一并删除
    setDeleteRuleNotice({
      open: true,
      ruleNumber: 4,
      title: '【规则 4 确认】删除后，非档案库文件将一并删除',
      message: `经校验，当前全宗【${currentNode.name}】已无在库正式档案及下属子节点。确认执行注销后，非档案库文件、历史编制缓存及机构关联配置将一并永久删除。是否确定删除？`,
      canConfirm: true,
    });
  };

  // Confirm delete fonds
  const handleConfirmDeleteFonds = () => {
    if (!selectedFondsId) return;
    const targetNode = fondsNodes.find((n) => n.id === selectedFondsId);
    const parentId = targetNode?.parentId || 'root';
    setFondsNodes((prev) => prev.filter((n) => n.id !== selectedFondsId));
    setDeleteRuleNotice(null);
    setSelectedFondsId(parentId);
    const parentNode = fondsNodes.find((n) => n.id === parentId);
    if (parentNode) {
      handleSelectFondsNode(parentNode);
    }
    onShowMessage(`全宗【${targetNode?.name || ''}】已成功注销删除！`);
  };

  // Add new fonds submit
  const handleAddNewFondsSubmit = () => {
    if (!newFondsName.trim() || !newFondsNo.trim()) {
      onShowMessage('请完整填写全宗号和全宗名称！');
      return;
    }
    const newId = `fonds_${Date.now()}`;
    const newNode: FondsNode = {
      id: newId,
      name: newFondsName.trim(),
      parentId: newFondsParentId,
      unitName: newFondsUnitName,
      unitCode: newFondsUnitCode,
      fondsNo: newFondsNo.trim(),
      fondsName: newFondsName.trim(),
      remark: newFondsRemark,
    };
    setFondsNodes((prev) => [...prev, newNode]);
    setFondsArchives((prev) => ({
      ...prev,
      [newId]: [],
    }));
    setIsAddFondsModalOpen(false);
    handleSelectFondsNode(newNode);
    onShowMessage(`已成功新增全宗节点【${newFondsName}】！`);
  };

  // Add / Edit archive item submit
  const handleSaveArchiveItem = () => {
    if (!archiveFormTitle.trim() || !archiveFormCode.trim()) {
      onShowMessage('请填写档号和文件题名！');
      return;
    }
    if (archiveItemModalMode === 'add') {
      const newItem: FondsArchiveItem = {
        id: `arc_${Date.now()}`,
        fondsId: selectedFondsId,
        archiveCode: archiveFormCode.trim(),
        title: archiveFormTitle.trim(),
        category: archiveFormCategory,
        retention: archiveFormRetention,
        security: archiveFormSecurity,
        pieceCount: Number(archiveFormPieceCount) || 1,
        author: archiveFormAuthor.trim() || '业务归档员',
        archiveDate: '2026-11-06',
        status: '正常在档',
      };
      setFondsArchives((prev) => ({
        ...prev,
        [selectedFondsId]: [newItem, ...(prev[selectedFondsId] || [])],
      }));
      setIsArchiveItemModalOpen(false);
      onShowMessage(`已成功新增归档文件【${newItem.title}】！`);
    } else if (archiveItemModalMode === 'edit' && selectedArchiveItem) {
      setFondsArchives((prev) => ({
        ...prev,
        [selectedFondsId]: (prev[selectedFondsId] || []).map((item) =>
          item.id === selectedArchiveItem.id
            ? {
                ...item,
                archiveCode: archiveFormCode.trim(),
                title: archiveFormTitle.trim(),
                category: archiveFormCategory,
                retention: archiveFormRetention,
                security: archiveFormSecurity,
                pieceCount: Number(archiveFormPieceCount) || 1,
                author: archiveFormAuthor.trim(),
              }
            : item
        ),
      }));
      setIsArchiveItemModalOpen(false);
      onShowMessage(`已更新归档文件【${archiveFormTitle}】信息！`);
    }
  };

  // Delete archive item confirmation
  const handleConfirmDeleteArchiveItem = () => {
    if (!fileToDelete) return;
    setFondsArchives((prev) => ({
      ...prev,
      [selectedFondsId]: (prev[selectedFondsId] || []).filter((item) => item.id !== fileToDelete.id),
    }));
    const deletedName = fileToDelete.title;
    setFileToDelete(null);
    onShowMessage(`已成功移出档案文件【${deletedName}】！`);
  };

  // Recursive Tree Rendering
  const renderTree = (parentId: string | null = null, depth: number = 0) => {
    const nodes = fondsNodes.filter((n) => n.parentId === parentId);
    if (nodes.length === 0) return null;

    return (
      <div className={depth > 0 ? 'ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 mt-1' : 'space-y-1'}>
        {nodes.map((node) => {
          const children = fondsNodes.filter((n) => n.parentId === node.id);
          const hasChildren = children.length > 0;
          const isExpanded = expandedNodeIds.includes(node.id);
          const isSelected = selectedFondsId === node.id;
          const fileCount = (fondsArchives[node.id] || []).length;

          return (
            <div key={node.id} className="text-xs">
              <div
                onClick={() => handleSelectFondsNode(node)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => toggleNodeExpanded(node.id, e)}
                      className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ) : (
                    <span className="w-3.5" />
                  )}

                  {hasChildren ? (
                    isExpanded ? (
                      <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                    )
                  ) : (
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  )}

                  <span className="truncate">{node.name}</span>
                </div>

                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {fileCount}
                </span>
              </div>

              {hasChildren && isExpanded && renderTree(node.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  // ==========================================
  // 档案类型管理 (setting_archive_types) 辅助计算与交互函数
  // ==========================================
  const currentTypeNode =
    archiveTypeNodes.find((n) => n.id === selectedTypeId) || archiveTypeNodes[2];
  const parentCategoryNode =
    archiveTypeNodes.find((n) => n.id === currentTypeNode.parentId) || currentTypeNode;
  const allCurrentFields = archiveFieldsMap[selectedTypeId] || [];

  const filteredTypeFields = allCurrentFields.filter((item) => {
    if (!typeSearch.trim()) return true;
    const q = typeSearch.toLowerCase();
    return (
      item.fieldCode.toLowerCase().includes(q) ||
      item.chineseName.toLowerCase().includes(q) ||
      item.fieldType.toLowerCase().includes(q) ||
      item.remark.toLowerCase().includes(q)
    );
  });

  const paginatedTypeFields = filteredTypeFields.slice(
    (typePage - 1) * PAGE_SIZE,
    typePage * PAGE_SIZE
  );

  // 树节点选中联动
  const handleSelectTypeNode = (node: ArchiveTypeNode) => {
    if (node.isCategory) {
      setExpandedTypeIds((prev) =>
        prev.includes(node.id) ? prev : [...prev, node.id]
      );
      const firstChild = archiveTypeNodes.find(
        (n) => n.parentId === node.id && !n.isCategory
      );
      if (firstChild) {
        setSelectedTypeId(firstChild.id);
        setSelectedFieldIds([]);
        setTypePage(1);
        setTypeSearch('');
      }
      return;
    }
    setSelectedTypeId(node.id);
    setSelectedFieldIds([]);
    setTypePage(1);
    setTypeSearch('');
  };

  // 树展开折叠
  const toggleTypeNodeExpanded = (nodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedTypeIds((prev) =>
      prev.includes(nodeId) ? prev.filter((id) => id !== nodeId) : [...prev, nodeId]
    );
  };

  // 复选框全选 / 取消全选
  const handleToggleSelectAllFields = () => {
    const currentPageIds = paginatedTypeFields.map((f) => f.id);
    const allSelected = currentPageIds.every((id) => selectedFieldIds.includes(id));
    if (allSelected) {
      setSelectedFieldIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
    } else {
      setSelectedFieldIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleToggleSelectField = (id: string) => {
    setSelectedFieldIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // 打开添加字段模态框
  const handleOpenAddFieldModal = () => {
    setFieldModalMode('add');
    setCurrentFieldItem(null);
    setFieldFormCode('');
    setFieldFormChineseName('');
    setFieldFormType('字符型');
    setFieldFormLength(64);
    setFieldFormShowInList(true);
    setFieldFormShowInSearch(true);
    setFieldFormShowInEntry(true);
    setFieldFormCanEdit(true);
    setFieldFormIsUnique(false);
    setFieldFormIsRequired(false);
    setFieldFormRemark('');
    setIsFieldModalOpen(true);
  };

  // 打开编辑字段（工具栏或行级触发）
  const handleOpenEditFieldModal = (item?: ArchiveFieldItem) => {
    const target =
      item ||
      (selectedFieldIds.length > 0
        ? allCurrentFields.find((f) => f.id === selectedFieldIds[0])
        : null);

    if (!target) {
      onShowMessage('请先在表格左侧勾选要编辑的字段！');
      return;
    }

    setCurrentFieldItem(target);
    setFieldModalMode('edit');
    setFieldFormCode(target.fieldCode);
    setFieldFormChineseName(target.chineseName);
    setFieldFormType(target.fieldType);
    setFieldFormLength(target.fieldLength);
    setFieldFormShowInList(target.showInList);
    setFieldFormShowInSearch(target.showInSearch);
    setFieldFormShowInEntry(target.showInEntry);
    setFieldFormCanEdit(target.canEdit);
    setFieldFormIsUnique(target.isUnique);
    setFieldFormIsRequired(target.isRequired);
    setFieldFormRemark(target.remark);
    setIsFieldModalOpen(true);
  };

  // 保存字段配置
  const handleSaveFieldSubmit = () => {
    if (!fieldFormCode.trim() || !fieldFormChineseName.trim()) {
      onShowMessage('请填写字段名与中文名称！');
      return;
    }
    const cleanCode = fieldFormCode.trim().replace(/^\*/, ''); // 新增非系统字段不带星号

    if (fieldModalMode === 'add') {
      const newField: ArchiveFieldItem = {
        id: `fld_${Date.now()}`,
        fieldCode: cleanCode,
        isSystem: false,
        chineseName: fieldFormChineseName.trim(),
        fieldType: fieldFormType,
        fieldLength: Number(fieldFormLength) || 0,
        showInList: fieldFormShowInList,
        showInSearch: fieldFormShowInSearch,
        showInEntry: fieldFormShowInEntry,
        canEdit: fieldFormCanEdit,
        isUnique: fieldFormIsUnique,
        isRequired: fieldFormIsRequired,
        remark: fieldFormRemark.trim() || '业务自定义著录项',
      };
      setArchiveFieldsMap((prev) => ({
        ...prev,
        [selectedTypeId]: [...(prev[selectedTypeId] || []), newField],
      }));
      setIsFieldModalOpen(false);
      onShowMessage(`已成功新增著录项字段【${newField.chineseName}】！`);
    } else if (fieldModalMode === 'edit' && currentFieldItem) {
      setArchiveFieldsMap((prev) => ({
        ...prev,
        [selectedTypeId]: (prev[selectedTypeId] || []).map((f) =>
          f.id === currentFieldItem.id
            ? {
                ...f,
                chineseName: fieldFormChineseName.trim(),
                fieldType: fieldFormType,
                fieldLength: Number(fieldFormLength) || 0,
                showInList: fieldFormShowInList,
                showInSearch: fieldFormShowInSearch,
                showInEntry: fieldFormShowInEntry,
                canEdit: fieldFormCanEdit,
                isUnique: fieldFormIsUnique,
                isRequired: fieldFormIsRequired,
                remark: fieldFormRemark.trim(),
              }
            : f
        ),
      }));
      setIsFieldModalOpen(false);
      onShowMessage(`已成功保存字段【${fieldFormChineseName}】配置！`);
    }
  };

  // 删除字段（严格核验：带* 为系统字段，不能被删除）
  const handleDeleteSelectedFields = () => {
    if (selectedFieldIds.length === 0) {
      onShowMessage('请先在表格左侧勾选要删除的字段！');
      return;
    }

    const selectedList = allCurrentFields.filter((f) => selectedFieldIds.includes(f.id));
    const systemItems = selectedList.filter((f) => f.isSystem || f.fieldCode.startsWith('*'));

    // 如果选中的包含系统字段，弹出黄色/红色拦截警告
    if (systemItems.length > 0) {
      setSystemFieldWarning({
        open: true,
        systemFields: systemItems.map((s) => `${s.fieldCode}（${s.chineseName}）`),
      });
      return;
    }

    // 全是非系统自定义字段，弹出确认
    setDeleteFieldsConfirm({
      open: true,
      ids: selectedFieldIds,
      names: selectedList.map((s) => s.chineseName),
    });
  };

  // 确认删除自定义字段
  const handleConfirmDeleteFields = () => {
    if (!deleteFieldsConfirm) return;
    setArchiveFieldsMap((prev) => ({
      ...prev,
      [selectedTypeId]: (prev[selectedTypeId] || []).filter(
        (f) => !deleteFieldsConfirm.ids.includes(f.id)
      ),
    }));
    setSelectedFieldIds([]);
    setDeleteFieldsConfirm(null);
    onShowMessage('已成功删除所选自定义著录项字段！');
  };

  // 单行删除
  const handleSingleFieldDelete = (item: ArchiveFieldItem) => {
    if (item.isSystem || item.fieldCode.startsWith('*')) {
      setSystemFieldWarning({
        open: true,
        systemFields: [`${item.fieldCode}（${item.chineseName}）`],
      });
      return;
    }
    setSingleFieldToDelete(item);
  };

  const handleConfirmSingleDelete = () => {
    if (!singleFieldToDelete) return;
    setArchiveFieldsMap((prev) => ({
      ...prev,
      [selectedTypeId]: (prev[selectedTypeId] || []).filter(
        (f) => f.id !== singleFieldToDelete.id
      ),
    }));
    const name = singleFieldToDelete.chineseName;
    setSingleFieldToDelete(null);
    onShowMessage(`已成功删除字段【${name}】！`);
  };

  // 新建档案类型提交
  const handleAddNewArchiveType = () => {
    if (!newTypeName.trim()) {
      onShowMessage('请填写档案类型名称！');
      return;
    }
    const newCatId = `type_cat_${Date.now()}`;
    const newLevelId = `type_level_${Date.now()}`;
    const newCatNode: ArchiveTypeNode = {
      id: newCatId,
      name: newTypeName.trim(),
      parentId: 'root_type',
      levelTag: newTypeLevelTag,
      isCategory: true,
      code: newTypeCode.trim() || 'CUSTOM',
    };
    const newLevelNode: ArchiveTypeNode = {
      id: newLevelId,
      name: newTypeLevelTag,
      parentId: newCatId,
      levelTag: newTypeLevelTag,
      isCategory: false,
      code: `${newCatNode.code}_LEVEL`,
    };

    setArchiveTypeNodes((prev) => [...prev, newCatNode, newLevelNode]);
    setArchiveFieldsMap((prev) => ({
      ...prev,
      [newLevelId]: [...(prev['ws_doc_file'] || [])],
    }));
    setExpandedTypeIds((prev) => [...prev, newCatId]);
    setSelectedTypeId(newLevelId);
    setIsAddTypeModalOpen(false);
    onShowMessage(`已成功设立新档案类型【${newTypeName}】并挂接【${newTypeLevelTag}】元数据！`);
  };

  // 档案类型列表树递归渲染
  const renderArchiveTypeTree = (parentId: string | null = null, depth: number = 0) => {
    const nodes = archiveTypeNodes.filter((n) => n.parentId === parentId);
    if (nodes.length === 0) return null;

    return (
      <div className={depth > 0 ? 'ml-3 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 mt-1' : 'space-y-1'}>
        {nodes.map((node) => {
          const children = archiveTypeNodes.filter((n) => n.parentId === node.id);
          const hasChildren = children.length > 0;
          const isExpanded = expandedTypeIds.includes(node.id);
          const isSelected = selectedTypeId === node.id;
          const fieldCount = !node.isCategory ? (archiveFieldsMap[node.id] || []).length : 0;

          return (
            <div key={node.id} className="text-xs">
              <div
                onClick={() => handleSelectTypeNode(node)}
                className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  {hasChildren ? (
                    <button
                      type="button"
                      onClick={(e) => toggleTypeNodeExpanded(node.id, e)}
                      className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                    </button>
                  ) : (
                    <span className="w-3.5" />
                  )}

                  {node.isCategory ? (
                    isExpanded ? (
                      <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-blue-500 shrink-0" />
                    )
                  ) : (
                    <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                  )}

                  <span className="truncate">{node.name}</span>
                </div>

                {!node.isCategory && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                      isSelected
                        ? 'bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {fieldCount}
                  </span>
                )}
              </div>

              {hasChildren && isExpanded && renderArchiveTypeTree(node.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header Card */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              {React.createElement(
                submodulesConfig.find((c) => c.key === activeTab)?.icon || Landmark,
                { className: 'w-4 h-4' }
              )}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>档案设置</span>
                <span className="text-slate-400 font-normal">/</span>
                <span className="text-blue-600 dark:text-blue-400">
                  {submodulesConfig.find((c) => c.key === activeTab)?.label}
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                依据《中华人民共和国档案法》及《DA/T 46 电子档案管理系统通用功能要求》严格规范基础元数据、全宗与权限策略。
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowMessage('已成功同步国家档案局最新元数据及规则标准库')}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>同步国标规则</span>
          </button>
          <button
            onClick={() => openActionModal('add', `新增${submodulesConfig.find((c) => c.key === activeTab)?.label}配置`)}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新建配置项</span>
          </button>
        </div>
      </div>


      {/* ========================================================================= */}
      {/* 1. 全宗管理 (setting_fonds) - 依据截图还原全宗树、单位与全宗配置及在库档案明细 */}
      {/* ========================================================================= */}
      {activeTab === 'setting_fonds' && (
        <div className="space-y-4">
          {/* Main 2-column layout: Left Fonds Tree | Right Unit & Fonds Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: 全宗列表树 */}
            <div className="lg:col-span-4 xl:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col">
              {/* Tree Card Header */}
              <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">全宗列表</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewFondsParentId(selectedFondsId || 'grp_01');
                    setIsAddFondsModalOpen(true);
                  }}
                  title="新增全宗节点"
                  className="w-6 h-6 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-500 hover:text-blue-600 flex items-center justify-center transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tree Body */}
              <div className="p-3 max-h-[680px] overflow-y-auto space-y-1">
                {renderTree(null, 0)}
              </div>

              {/* Tree Footer Tips */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] text-slate-500 flex items-center justify-between">
                <span>共纳管全宗：<strong className="text-blue-600 font-mono">{fondsNodes.length}</strong> 个</span>
                <span className="text-slate-400">点击节点联动右侧</span>
              </div>
            </div>

            {/* Right Column: 单位信息 + 全宗信息 + 说明警示 */}
            <div className="lg:col-span-8 xl:col-span-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs p-5 space-y-6">
              {/* Section 1: 单位信息 */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>单位信息</span>
                </h3>

                <div className="space-y-3.5 text-xs">
                  {/* 单位名称 */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="sm:w-24 pt-2 text-slate-700 dark:text-slate-300 font-medium text-right shrink-0">
                      <span className="text-rose-500 font-bold mr-1">*</span>单位名称:
                    </label>
                    <div className="flex-1 space-y-1.5">
                      <select
                        value={formUnitName}
                        onChange={(e) => handleUnitNameChange(e.target.value)}
                        className="w-full sm:w-80 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      >
                        {configuredUnits.map((u) => (
                          <option key={u.name} value={u.name}>
                            {u.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500">
                        单位信息需要在资源中心-》统一用户-》单位管理页面配置
                      </p>
                    </div>
                  </div>

                  {/* 单位标识 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-24 text-slate-700 dark:text-slate-300 font-medium text-right shrink-0">
                      <span className="text-rose-500 font-bold mr-1">*</span>单位标识:
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        readOnly
                        value={formUnitCode}
                        className="w-full sm:w-80 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 font-mono cursor-not-allowed select-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: 全宗信息 */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2.5 flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>全宗信息</span>
                </h3>

                <div className="space-y-3.5 text-xs">
                  {/* 全宗号 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-24 text-slate-700 dark:text-slate-300 font-medium text-right shrink-0">
                      <span className="text-rose-500 font-bold mr-1">*</span>全宗号:
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formFondsNo}
                        onChange={(e) => setFormFondsNo(e.target.value)}
                        placeholder="如 SCFGS01"
                        className="w-full sm:w-80 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 全宗名称 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <label className="sm:w-24 text-slate-700 dark:text-slate-300 font-medium text-right shrink-0">
                      <span className="text-rose-500 font-bold mr-1">*</span>全宗名称:
                    </label>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formFondsName}
                        onChange={(e) => setFormFondsName(e.target.value)}
                        placeholder="如 四川分公司"
                        className="w-full sm:w-80 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* 备注 */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                    <label className="sm:w-24 pt-2 text-slate-700 dark:text-slate-300 font-medium text-right shrink-0">
                      备注:
                    </label>
                    <div className="flex-1">
                      <textarea
                        rows={3}
                        value={formRemark}
                        onChange={(e) => setFormRemark(e.target.value)}
                        placeholder="请填写全宗职责、管辖业务及归档说明..."
                        className="w-full max-w-xl px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-1 focus:ring-blue-500 resize-none shadow-2xs"
                      />
                    </div>
                  </div>

                  {/* Actions: 保存 & 删除全宗 */}
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1">
                    <div className="sm:w-24 shrink-0" />
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={handleSaveFonds}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-2xs flex items-center gap-1.5 transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>保存</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleDeleteFonds}
                        className="px-4 py-2 rounded-lg border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>删除全宗</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: 说明（粉红色警示框，完全还原截图） */}
              <div className="pt-2">
                <div className="p-4 rounded-xl border border-pink-100 dark:border-pink-950/50 bg-pink-50/40 dark:bg-pink-950/20 space-y-2">
                  <div className="text-pink-600 dark:text-pink-400 font-bold text-sm flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                    <span>说明</span>
                  </div>
                  <div className="space-y-1.5 text-pink-600 dark:text-pink-400 font-medium text-xs leading-relaxed pl-1">
                    <p>1、顶级全宗单位不能被删除</p>
                    <p>2、有子节点的全宗无法删除，需要先删除子节点；</p>
                    <p>3、全宗里有正式档案库文件的也无法被删除，需要先删除档案</p>
                    <p>4、删除后，非档案库文件将一并删除</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: 联动展示当前全宗下的正式档案卷库明细台账表格（每页10条真实数据） */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* Table Header and Toolbars */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <span>【{currentFondsNode.name}】正式在档文件明细台账</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      全宗号: {currentFondsNode.fondsNo}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">
                    在档案卷总数：<strong className="text-slate-700 dark:text-slate-300 font-mono">{allCurrentArchives.length}</strong> 件 / 卷（已全部完成四性检测与电子签名固化）
                  </p>
                </div>
              </div>

              {/* Filters & Actions */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Category select */}
                <select
                  value={archiveCategoryFilter}
                  onChange={(e) => {
                    setArchiveCategoryFilter(e.target.value);
                    setArchivePage(1);
                  }}
                  className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden"
                >
                  <option value="全部">全部档案门类</option>
                  <option value="文书档案">文书档案</option>
                  <option value="会计档案">会计档案</option>
                  <option value="基建工程">基建工程</option>
                  <option value="科研档案">科研档案</option>
                  <option value="声像档案">声像档案</option>
                </select>

                {/* Search box */}
                <div className="relative w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索档号、题名、立卷人..."
                    value={archiveSearch}
                    onChange={(e) => {
                      setArchiveSearch(e.target.value);
                      setArchivePage(1);
                    }}
                    className="w-full pl-8 pr-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>

                {/* Add Archive Item */}
                <button
                  type="button"
                  onClick={() => {
                    setArchiveItemModalMode('add');
                    setArchiveFormTitle('');
                    setArchiveFormCode(`${currentFondsNode.fondsNo}-WS-2026-Y-00${allCurrentArchives.length + 1}`);
                    setArchiveFormCategory('文书档案');
                    setArchiveFormRetention('永久');
                    setArchiveFormSecurity('内部');
                    setArchiveFormPieceCount(16);
                    setArchiveFormAuthor('业务归档员');
                    setIsArchiveItemModalOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>新增归档文件</span>
                </button>

                {/* Export button */}
                <button
                  type="button"
                  onClick={() => onShowMessage(`已成功导出【${currentFondsNode.name}】全宗归档清册 (Excel/OFD格式)`)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出清册</span>
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-3.5 whitespace-nowrap text-center w-12">序号</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">档号</th>
                    <th className="py-3 px-3.5 whitespace-nowrap min-w-[240px]">文件 / 案卷题名</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">门类</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">保管期限</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-center">密级</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">卷内件数</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">立卷责任人</th>
                    <th className="py-3 px-3.5 whitespace-nowrap">归档日期</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-center">状态</th>
                    <th className="py-3 px-3.5 whitespace-nowrap text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {paginatedCurrentArchives.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400 dark:text-slate-500">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                          <span>当前全宗暂无正式归档文件记录</span>
                          <span className="text-[11px] text-slate-400">（此时该全宗已满足第3条删除说明要求）</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedCurrentArchives.map((item, index) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3 px-3.5 text-center font-mono text-slate-400">
                          {(archivePage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="py-3 px-3.5 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {item.archiveCode}
                        </td>
                        <td className="py-3 px-3.5 font-medium text-slate-900 dark:text-white">
                          {item.title}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap text-slate-600 dark:text-slate-400 font-mono">
                          {item.retention}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              item.security === '公开'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                : item.security === '内部'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                            }`}
                          >
                            {item.security}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 font-mono text-right font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.pieceCount} 件
                        </td>
                        <td className="py-3 px-3.5 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.author}
                        </td>
                        <td className="py-3 px-3.5 font-mono text-slate-500 whitespace-nowrap">
                          {item.archiveDate}
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle className="w-3 h-3 text-emerald-500" />
                            <span>{item.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedArchiveItem(item);
                                setArchiveItemModalMode('detail');
                                setIsArchiveItemModalOpen(true);
                              }}
                              className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium"
                            >
                              详情
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedArchiveItem(item);
                                setArchiveItemModalMode('edit');
                                setArchiveFormCode(item.archiveCode);
                                setArchiveFormTitle(item.title);
                                setArchiveFormCategory(item.category);
                                setArchiveFormRetention(item.retention);
                                setArchiveFormSecurity(item.security);
                                setArchiveFormPieceCount(item.pieceCount);
                                setArchiveFormAuthor(item.author);
                                setIsArchiveItemModalOpen(true);
                              }}
                              className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium"
                            >
                              编辑
                            </button>
                            <button
                              type="button"
                              onClick={() => setFileToDelete(item)}
                              className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 font-medium"
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

            {/* Pagination */}
            {filteredCurrentArchives.length > 0 && (
              <Pagination
                currentPage={archivePage}
                totalItems={filteredCurrentArchives.length}
                pageSize={PAGE_SIZE}
                onPageChange={setArchivePage}
              />
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. 档案类型管理 (setting_archive_types) */}
      {/* ========================================================================= */}
      {/* 2. 档案类型管理 (setting_archive_types) - 严格依截图还原著录项字段配置体系 */}
      {/* ========================================================================= */}
      {activeTab === 'setting_archive_types' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左侧：档案类型列表树 */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col h-[740px]">
            {/* 树卡片顶部 */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  档案类型列表
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewTypeName('');
                  setNewTypeCode('');
                  setNewTypeLevelTag('文件级');
                  setNewTypeParentId('root_type');
                  setIsAddTypeModalOpen(true);
                }}
                className="w-6 h-6 rounded-md border border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center transition-colors"
                title="新建档案类型"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 树主体内容 */}
            <div className="flex-1 p-3 overflow-y-auto space-y-1">
              {renderArchiveTypeTree(null, 0)}
            </div>

            {/* 底部统计提示 */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] text-slate-500 flex items-center justify-between">
              <span>当前门类：<strong className="text-slate-800 dark:text-slate-200">{parentCategoryNode.name}</strong></span>
              <span className="text-blue-600 font-semibold">{currentTypeNode.name}级</span>
            </div>
          </div>

          {/* 右侧：著录项字段配置表 */}
          <div className="lg:col-span-9 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* 右侧顶部：层级切换标签 */}
            <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 px-4 pt-2.5 flex items-center gap-2 overflow-x-auto">
              {archiveTypeNodes
                .filter((n) => n.parentId === (parentCategoryNode.id || 'ws_doc') && !n.isCategory)
                .map((sibling) => (
                  <button
                    key={sibling.id}
                    type="button"
                    onClick={() => {
                      setSelectedTypeId(sibling.id);
                      setSelectedFieldIds([]);
                      setTypePage(1);
                    }}
                    className={`px-4 py-2 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 ${
                      selectedTypeId === sibling.id
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 rounded-t-md shadow-2xs'
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>{sibling.name}级</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {(archiveFieldsMap[sibling.id] || []).length}
                    </span>
                  </button>
                ))}
            </div>

            {/* 操作工具栏 */}
            <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 添加字段 */}
                <button
                  type="button"
                  onClick={handleOpenAddFieldModal}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加字段</span>
                </button>

                {/* 编辑字段 */}
                <button
                  type="button"
                  onClick={() => handleOpenEditFieldModal()}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>编辑字段</span>
                </button>

                {/* 删除字段 (黄色徽章角标) */}
                <button
                  type="button"
                  onClick={handleDeleteSelectedFields}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 relative shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除字段</span>
                  {selectedFieldIds.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-amber-950 font-bold shadow-2xs">
                      {selectedFieldIds.length}
                    </span>
                  )}
                </button>

                {/* 提示文案 */}
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 select-none flex items-center gap-1">
                  <span>注：带</span>
                  <span className="text-rose-500 font-bold">*</span>
                  <span>为系统字段，不能被删除</span>
                </span>
              </div>

              {/* 右侧搜索与重置 */}
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索字段名、中文名、备注..."
                    value={typeSearch}
                    onChange={(e) => {
                      setTypeSearch(e.target.value);
                      setTypePage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>
                {typeSearch && (
                  <button
                    type="button"
                    onClick={() => setTypeSearch('')}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    重置
                  </button>
                )}
              </div>
            </div>

            {/* 字段表格 (完整14列，横向滚动) */}
            <div className="flex-1 overflow-x-auto min-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-3 text-center w-10">
                      <input
                        type="checkbox"
                        checked={
                          paginatedTypeFields.length > 0 &&
                          paginatedTypeFields.every((f) => selectedFieldIds.includes(f.id))
                        }
                        onChange={handleToggleSelectAllFields}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-3 text-center whitespace-nowrap w-12">序号</th>
                    <th className="py-3 px-3 whitespace-nowrap">字段名</th>
                    <th className="py-3 px-3 whitespace-nowrap">中文名称</th>
                    <th className="py-3 px-3 whitespace-nowrap">字段类型</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">字段长度</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">列表显示</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">搜索显示</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">录入显示</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">是否编辑</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">是否唯一值</th>
                    <th className="py-3 px-3 text-center whitespace-nowrap">是否必填</th>
                    <th className="py-3 px-3 whitespace-nowrap min-w-[150px]">备注</th>
                    <th className="py-3 px-3 text-right whitespace-nowrap min-w-[140px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {paginatedTypeFields.length === 0 ? (
                    <tr>
                      <td colSpan={14} className="py-12 text-center text-slate-400">
                        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <span>暂无符合条件的著录项字段</span>
                      </td>
                    </tr>
                  ) : (
                    paginatedTypeFields.map((item, idx) => {
                      const isChecked = selectedFieldIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isChecked
                              ? 'bg-blue-50/70 dark:bg-blue-950/40'
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectField(item.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-500 whitespace-nowrap">
                            {(typePage - 1) * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="py-2.5 px-3 font-mono whitespace-nowrap">
                            {item.fieldCode.startsWith('*') ? (
                              <span className="font-semibold text-slate-900 dark:text-slate-100 flex items-center">
                                <span className="text-rose-500 font-bold mr-1">*</span>
                                <span>{item.fieldCode.replace(/^\*\s*/, '')}</span>
                              </span>
                            ) : (
                              <span className="text-blue-600 dark:text-blue-400 font-medium">
                                {item.fieldCode}
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            {item.chineseName}
                          </td>
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                              {item.fieldType}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                            {item.fieldLength}
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className={item.showInList ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                              {item.showInList ? '是' : '否'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className={item.showInSearch ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                              {item.showInSearch ? '是' : '否'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className={item.showInEntry ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                              {item.showInEntry ? '是' : '否'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className={item.canEdit ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-400'}>
                              {item.canEdit ? '是' : '否'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className={item.isUnique ? 'text-blue-600 font-semibold' : 'text-slate-400'}>
                              {item.isUnique ? '是' : '否'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center whitespace-nowrap">
                            <span className={item.isRequired ? 'text-rose-600 font-semibold' : 'text-slate-400'}>
                              {item.isRequired ? '是' : '否'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400 whitespace-nowrap max-w-xs truncate" title={item.remark}>
                            {item.remark}
                          </td>
                          <td className="py-2.5 px-3 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditFieldModal(item)}
                                className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-medium transition-colors"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentFieldItem(item);
                                  setFieldModalMode('detail');
                                  setFieldFormCode(item.fieldCode);
                                  setFieldFormChineseName(item.chineseName);
                                  setFieldFormType(item.fieldType);
                                  setFieldFormLength(item.fieldLength);
                                  setFieldFormShowInList(item.showInList);
                                  setFieldFormShowInSearch(item.showInSearch);
                                  setFieldFormShowInEntry(item.showInEntry);
                                  setFieldFormCanEdit(item.canEdit);
                                  setFieldFormIsUnique(item.isUnique);
                                  setFieldFormIsRequired(item.isRequired);
                                  setFieldFormRemark(item.remark);
                                  setIsFieldModalOpen(true);
                                }}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                              >
                                详情
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSingleFieldDelete(item)}
                                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                  item.isSystem || item.fieldCode.startsWith('*')
                                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                                    : 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100'
                                }`}
                                title={item.isSystem || item.fieldCode.startsWith('*') ? '系统字段不能被删除' : '删除该著录项'}
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

            {/* 分页组件：严格每页 10 条数据 */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Pagination
                currentPage={typePage}
                totalItems={filteredTypeFields.length}
                pageSize={PAGE_SIZE}
                onPageChange={setTypePage}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. 分类设置 (setting_classification) - Left Tree / Right Table Linkage */}
      {/* ========================================================================= */}
      {activeTab === 'setting_classification' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Left Tree */}
          <div className="lg:col-span-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-3.5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <FolderTree className="w-4 h-4 text-blue-600" />
                <span>一级公文分类体系</span>
              </span>
              <button
                onClick={() => onShowMessage('已重构分类树索引缓存')}
                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
                title="刷新"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="space-y-1">
              {classTree.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedClassId(item.id);
                    setClassPage(1);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    selectedClassId === item.id
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-900'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Folder className={`w-3.5 h-3.5 ${selectedClassId === item.id ? 'text-blue-600' : 'text-amber-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {item.id}
                  </span>
                </button>
              ))}
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 leading-relaxed">
              提示：点击左侧一级分类类别，右侧将联动刷新显示该体系下细分的子类目、推荐保管期限及归档范围。
            </div>
          </div>

          {/* Right Table */}
          <div className="lg:col-span-3 space-y-4">
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shadow-xs">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300">
                当前大类：<span className="font-bold text-blue-600 dark:text-blue-400">
                  {classTree.find((c) => c.id === selectedClassId)?.name} ({selectedClassId})
                </span>，共归集 <span className="font-bold">{currentClassItems.length}</span> 个细分子类
              </div>
              <button
                onClick={() => openActionModal('add', `在【${classTree.find((c) => c.id === selectedClassId)?.name}】下新增子分类`)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增子分类</span>
              </button>
            </div>

            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3 px-4 whitespace-nowrap">分类编码</th>
                      <th className="py-3 px-4 whitespace-nowrap">子类目全称</th>
                      <th className="py-3 px-4 whitespace-nowrap">推荐保管期限</th>
                      <th className="py-3 px-4">归档范围与文件内容规范</th>
                      <th className="py-3 px-4 whitespace-nowrap text-center">排序</th>
                      <th className="py-3 px-4 whitespace-nowrap">维护日期</th>
                      <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                    {currentClassItems
                      .slice((classPage - 1) * PAGE_SIZE, classPage * PAGE_SIZE)
                      .map((row) => (
                        <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {row.code}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            {row.name}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                row.retention === '永久'
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                              }`}
                            >
                              {row.retention}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 max-w-xs">{row.range}</td>
                          <td className="py-3 px-4 text-center font-mono text-slate-500 whitespace-nowrap">{row.sort}</td>
                          <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">{row.date}</td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openActionModal('edit', `编辑子类目 - ${row.name}`, row)}
                                className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium"
                              >
                                编辑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <Pagination
                currentPage={classPage}
                totalItems={currentClassItems.length}
                pageSize={PAGE_SIZE}
                onPageChange={setClassPage}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. 目录树维护 (setting_catalog_tree) */}
      {/* ========================================================================= */}
      {activeTab === 'setting_catalog_tree' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                当前目录树主挂载节点：<span className="font-bold text-blue-600">{treeList.length}</span> 个虚拟与实体目录节点
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onShowMessage('已重新生成目录树拓扑与全文检索反向索引')}
                className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>重建拓扑树</span>
              </button>
              <button
                onClick={() => openActionModal('add', '新增目录树层级节点')}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新建目录节点</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                  <tr>
                    <th className="py-3 px-4 whitespace-nowrap">节点标识</th>
                    <th className="py-3 px-4 whitespace-nowrap">目录节点名称</th>
                    <th className="py-3 px-4 whitespace-nowrap">层级级别</th>
                    <th className="py-3 px-4 whitespace-nowrap">挂接全宗/来源</th>
                    <th className="py-3 px-4 whitespace-nowrap">挂载类型</th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">排序号</th>
                    <th className="py-3 px-4 whitespace-nowrap">公开访问授权</th>
                    <th className="py-3 px-4 whitespace-nowrap text-center">运行状态</th>
                    <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {treeList.slice((treePage - 1) * PAGE_SIZE, treePage * PAGE_SIZE).map((row) => (
                    <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {row.id}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white whitespace-nowrap flex items-center gap-2">
                        <Folder className="w-3.5 h-3.5 text-blue-500" />
                        <span>{row.name}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{row.level}</td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">{row.fonds}</td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {row.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500 whitespace-nowrap">{row.sort}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">{row.auth}</td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openActionModal('edit', `编辑目录节点 - ${row.name}`, row)}
                            className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium"
                          >
                            编辑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={treePage}
              totalItems={treeList.length}
              pageSize={PAGE_SIZE}
              onPageChange={setTreePage}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. 保管期限 (setting_retention_period) - 严格依截图还原左侧版本树与右侧期限表 */}
      {/* ========================================================================= */}
      {activeTab === 'setting_retention_period' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左侧：保管期限版本列表 */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col h-[740px]">
            {/* 树卡片顶部 */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  保管期限版本列表
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewVersionName('');
                  setNewVersionCode('');
                  setNewVersionIsDefault(false);
                  setNewVersionDesc('');
                  setIsAddVersionModalOpen(true);
                }}
                className="w-6 h-6 rounded-md border border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center transition-colors"
                title="新建保管期限版本"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 版本列表树内容 */}
            <div className="flex-1 p-3 overflow-y-auto space-y-1">
              {/* 根节点：版本列表 */}
              <div className="text-xs">
                <div
                  onClick={() => setIsVersionTreeExpanded(!isVersionTreeExpanded)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors font-medium"
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsVersionTreeExpanded(!isVersionTreeExpanded);
                      }}
                      className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isVersionTreeExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isVersionTreeExpanded ? (
                      <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                    <span>版本列表</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                    {retentionVersions.length}
                  </span>
                </div>

                {/* 子版本列表 */}
                {isVersionTreeExpanded && (
                  <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 mt-1">
                    {retentionVersions.map((ver) => {
                      const isSelected = selectedRetentionVerId === ver.id;
                      const itemCount = (retentionItemsMap[ver.id] || []).length;
                      return (
                        <div
                          key={ver.id}
                          onClick={() => {
                            setSelectedRetentionVerId(ver.id);
                            setSelectedRetentionItemIds([]);
                            setRetentionPage(1);
                            setRetentionSearch('');
                          }}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                            <span className="truncate">{ver.name}</span>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                              isSelected
                                ? 'bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {itemCount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 底部当前版本信息 */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>当前基准：<strong className="text-slate-800 dark:text-slate-200">{currentRetentionVersion.name}</strong></span>
                <span className="font-mono text-blue-600 font-bold">{currentRetentionVersion.code}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                生效时间：{currentRetentionVersion.publishDate}
              </div>
            </div>
          </div>

          {/* 右侧：保管期限表格 */}
          <div className="lg:col-span-9 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* 操作工具栏 - 严格对应截图：添加(蓝底)、编辑(蓝底)、删除(蓝框) */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 添加 */}
                <button
                  type="button"
                  onClick={handleOpenAddRetentionModal}
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加</span>
                </button>

                {/* 编辑 */}
                <button
                  type="button"
                  onClick={() => handleOpenEditRetentionModal()}
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>编辑</span>
                </button>

                {/* 删除 */}
                <button
                  type="button"
                  onClick={handleDeleteSelectedRetention}
                  className="px-4 py-1.5 rounded-md border border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除</span>
                  {selectedRetentionItemIds.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
                      {selectedRetentionItemIds.length}
                    </span>
                  )}
                </button>

                {/* 当前版本提示 */}
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 select-none">
                  版本：<span className="font-medium text-slate-800 dark:text-slate-200">{currentRetentionVersion.name}</span>
                </span>
              </div>

              {/* 右侧搜索与重置 */}
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索期限编码、名称、年限、备注..."
                    value={retentionSearch}
                    onChange={(e) => {
                      setRetentionSearch(e.target.value);
                      setRetentionPage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>
                {retentionSearch && (
                  <button
                    type="button"
                    onClick={() => setRetentionSearch('')}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    重置
                  </button>
                )}
              </div>
            </div>

            {/* 表格：严格按截图列展示（复选框、序号、保管期限编码、保管期限名称、保管期限年限、备注、操作） */}
            <div className="flex-1 overflow-x-auto min-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">
                      <input
                        type="checkbox"
                        checked={
                          paginatedRetentionItems.length > 0 &&
                          paginatedRetentionItems.every((item) => selectedRetentionItemIds.includes(item.id))
                        }
                        onChange={handleToggleSelectAllRetention}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 text-center whitespace-nowrap w-16">序号</th>
                    <th className="py-3 px-4 whitespace-nowrap min-w-[120px]">保管期限编码</th>
                    <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">保管期限名称</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap min-w-[120px]">保管期限年限</th>
                    <th className="py-3 px-4 whitespace-nowrap min-w-[280px]">备注</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap min-w-[130px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {paginatedRetentionItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <span>当前版本下暂无匹配的保管期限数据</span>
                      </td>
                    </tr>
                  ) : (
                    paginatedRetentionItems.map((item, idx) => {
                      const isChecked = selectedRetentionItemIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isChecked
                              ? 'bg-blue-50/70 dark:bg-blue-950/40'
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectRetentionItem(item.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-500 whitespace-nowrap">
                            {(retentionPage - 1) * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {item.code}
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                            {item.name}
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {item.years === 9999 ? (
                              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300">
                                9999 (永久)
                              </span>
                            ) : (
                              <span>{item.years}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                            {item.remark}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditRetentionModal(item)}
                                className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-medium transition-colors"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentRetentionItem(item);
                                  setRetentionModalMode('detail');
                                  setRetentionFormCode(item.code);
                                  setRetentionFormName(item.name);
                                  setRetentionFormYears(item.years);
                                  setRetentionFormRemark(item.remark);
                                  setIsRetentionItemModalOpen(true);
                                }}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                              >
                                详情
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSingleRetentionDelete(item)}
                                className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-medium transition-colors"
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

            {/* 分页组件：严格每页 10 条数据 */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Pagination
                currentPage={retentionPage}
                totalItems={filteredRetentionItems.length}
                pageSize={PAGE_SIZE}
                onPageChange={setRetentionPage}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. 密级 (setting_security_level) - 严格依截图还原左侧密级版本树与右侧密级表 */}
      {/* ========================================================================= */}
      {activeTab === 'setting_security_level' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* 左侧：密级版本列表 */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col h-[740px]">
            {/* 树卡片顶部 */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  密级版本列表
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewSecurityVerName('');
                  setNewSecurityVerCode('');
                  setNewSecurityVerIsDefault(false);
                  setNewSecurityVerDesc('');
                  setIsAddSecurityVersionModalOpen(true);
                }}
                className="w-6 h-6 rounded-md border border-slate-300 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-600 dark:text-slate-300 hover:text-blue-600 flex items-center justify-center transition-colors"
                title="新建密级版本"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 版本列表树内容 */}
            <div className="flex-1 p-3 overflow-y-auto space-y-1">
              {/* 根节点：版本列表 */}
              <div className="text-xs">
                <div
                  onClick={() => setIsSecurityVersionTreeExpanded(!isSecurityVersionTreeExpanded)}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-slate-800 dark:text-slate-200 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition-colors font-medium"
                >
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsSecurityVersionTreeExpanded(!isSecurityVersionTreeExpanded);
                      }}
                      className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {isSecurityVersionTreeExpanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {isSecurityVersionTreeExpanded ? (
                      <FolderOpen className="w-4 h-4 text-blue-500 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-blue-500 shrink-0" />
                    )}
                    <span>版本列表</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                    {securityVersions.length}
                  </span>
                </div>

                {/* 子版本列表 */}
                {isSecurityVersionTreeExpanded && (
                  <div className="ml-4 pl-2 border-l border-slate-200 dark:border-slate-800 space-y-1 mt-1">
                    {securityVersions.map((ver) => {
                      const isSelected = selectedSecurityVerId === ver.id;
                      const itemCount = (securityItemsMap[ver.id] || []).length;
                      return (
                        <div
                          key={ver.id}
                          onClick={() => {
                            setSelectedSecurityVerId(ver.id);
                            setSelectedSecurityItemIds([]);
                            setSecurityPage(1);
                            setSecuritySearch('');
                          }}
                          className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold shadow-2xs'
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <Folder className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                            <span className="truncate">{ver.name}</span>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                              isSelected
                                ? 'bg-blue-200/80 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                            }`}
                          >
                            {itemCount}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 底部当前版本信息 */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-800/40 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>当前基准：<strong className="text-slate-800 dark:text-slate-200">{currentSecurityVersion.name}</strong></span>
                <span className="font-mono text-blue-600 font-bold">{currentSecurityVersion.code}</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                发布实施：{currentSecurityVersion.publishDate}
              </div>
            </div>
          </div>

          {/* 右侧：密级表格 */}
          <div className="lg:col-span-9 flex flex-col rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* 操作工具栏 - 严格对应截图：添加(蓝底)、编辑(蓝底)、删除(蓝框) */}
            <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 添加 */}
                <button
                  type="button"
                  onClick={handleOpenAddSecurityModal}
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加</span>
                </button>

                {/* 编辑 */}
                <button
                  type="button"
                  onClick={() => handleOpenEditSecurityModal()}
                  className="px-4 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>编辑</span>
                </button>

                {/* 删除 */}
                <button
                  type="button"
                  onClick={handleDeleteSelectedSecurity}
                  className="px-4 py-1.5 rounded-md border border-blue-500 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除</span>
                  {selectedSecurityItemIds.length > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-700 font-bold">
                      {selectedSecurityItemIds.length}
                    </span>
                  )}
                </button>

                {/* 当前版本提示 */}
                <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 select-none">
                  版本：<span className="font-medium text-slate-800 dark:text-slate-200">{currentSecurityVersion.name}</span>
                </span>
              </div>

              {/* 右侧搜索与重置 */}
              <div className="flex items-center gap-2">
                <div className="relative w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="搜索密级编码、名称、年限、备注..."
                    value={securitySearch}
                    onChange={(e) => {
                      setSecuritySearch(e.target.value);
                      setSecurityPage(1);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
                  />
                </div>
                {securitySearch && (
                  <button
                    type="button"
                    onClick={() => setSecuritySearch('')}
                    className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                  >
                    重置
                  </button>
                )}
              </div>
            </div>

            {/* 表格：严格按截图列展示（复选框、序号、密级编码、密级名称、保管期限年限、备注、操作） */}
            <div className="flex-1 overflow-x-auto min-h-[500px]">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-3 text-center w-12">
                      <input
                        type="checkbox"
                        checked={
                          paginatedSecurityItems.length > 0 &&
                          paginatedSecurityItems.every((item) => selectedSecurityItemIds.includes(item.id))
                        }
                        onChange={handleToggleSelectAllSecurity}
                        className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                      />
                    </th>
                    <th className="py-3 px-4 text-center whitespace-nowrap w-16">序号</th>
                    <th className="py-3 px-4 whitespace-nowrap min-w-[120px]">密级编码</th>
                    <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">密级名称</th>
                    <th className="py-3 px-4 text-center whitespace-nowrap min-w-[120px]">保管期限年限</th>
                    <th className="py-3 px-4 whitespace-nowrap min-w-[280px]">备注</th>
                    <th className="py-3 px-4 text-right whitespace-nowrap min-w-[130px]">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  {paginatedSecurityItems.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        <Lock className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                        <span>当前版本下暂无匹配的密级配置数据</span>
                      </td>
                    </tr>
                  ) : (
                    paginatedSecurityItems.map((item, idx) => {
                      const isChecked = selectedSecurityItemIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          className={`transition-colors ${
                            isChecked
                              ? 'bg-blue-50/70 dark:bg-blue-950/40'
                              : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleSelectSecurityItem(item.id)}
                              className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4 text-center font-mono text-slate-500 whitespace-nowrap">
                            {(securityPage - 1) * PAGE_SIZE + idx + 1}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                            {item.code}
                          </td>
                          <td className="py-3 px-4 font-medium whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                item.name.includes('绝密')
                                  ? 'bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                                  : item.name.includes('机密')
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
                                  : item.name.includes('秘密')
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                  : item.name.includes('内部')
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {item.name}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {item.years}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                            {item.remark}
                          </td>
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditSecurityModal(item)}
                                className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-medium transition-colors"
                              >
                                编辑
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setCurrentSecurityItem(item);
                                  setSecurityModalMode('detail');
                                  setSecurityFormCode(item.code);
                                  setSecurityFormName(item.name);
                                  setSecurityFormYears(item.years);
                                  setSecurityFormRemark(item.remark);
                                  setIsSecurityItemModalOpen(true);
                                }}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                              >
                                详情
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSingleSecurityDelete(item)}
                                className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-medium transition-colors"
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

            {/* 分页组件：严格每页 10 条数据 */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Pagination
                currentPage={securityPage}
                totalItems={filteredSecurityItems.length}
                pageSize={PAGE_SIZE}
                onPageChange={setSecurityPage}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. 专题类型设置 (setting_special_topics) - 双栏树表联动 */}
      {/* ========================================================================= */}
      {activeTab === 'setting_special_topics' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* 左侧：专题列表树形面板 (对齐原型截图结构) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* 树顶部标题与新增(+)按钮 */}
            <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
                <Folder className="w-4 h-4 text-blue-600" />
                <span>专题列表</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setNewCatName('');
                  setNewCatParentId(selectedTopicCatId === 'root' ? 'root' : selectedTopicCatId);
                  setNewCatCode(`ZT-CAT-${topicCategories.length + 1}`);
                  setNewCatDesc('');
                  setIsAddTopicCategoryModalOpen(true);
                }}
                className="w-6 h-6 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
                title="新建专题分类"
              >
                <PlusCircle className="w-4 h-4" />
              </button>
            </div>

            {/* 树结构内容区 */}
            <div className="p-2 space-y-1 max-h-[640px] overflow-y-auto">
              {/* 根节点：专题列表 */}
              <div>
                <div
                  onClick={() => handleSelectTopicCategory('root')}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                    selectedTopicCatId === 'root'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleTopicCategoryExpand('root');
                      }}
                      className="p-0.5 text-slate-400 hover:text-slate-600"
                    >
                      {expandedTopicCatIds.includes('root') ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {expandedTopicCatIds.includes('root') ? (
                      <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate">专题列表 (全部)</span>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {topicList.length}
                  </span>
                </div>

                {/* 一级子节点 */}
                {expandedTopicCatIds.includes('root') && (
                  <div className="pl-3.5 mt-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-3">
                    {topicCategories
                      .filter((c) => c.parentId === 'root')
                      .map((cat) => {
                        const isExpanded = expandedTopicCatIds.includes(cat.id);
                        const isSelected = selectedTopicCatId === cat.id;
                        const childCats = topicCategories.filter((sub) => sub.parentId === cat.id);
                        const hasChildren = childCats.length > 0;
                        const catItemCount = topicList.filter(
                          (item) => item.categoryId === cat.id || childCats.some((sub) => sub.id === item.categoryId)
                        ).length;

                        return (
                          <div key={cat.id} className="space-y-0.5">
                            <div
                              onClick={() => handleSelectTopicCategory(cat.id)}
                              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                                isSelected
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 font-bold'
                                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                              }`}
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                {hasChildren ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleTopicCategoryExpand(cat.id);
                                    }}
                                    className="p-0.5 text-slate-400 hover:text-slate-600"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                ) : (
                                  <span className="w-3.5 h-3.5 shrink-0" />
                                )}
                                {isExpanded ? (
                                  <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                ) : (
                                  <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                )}
                                <span className="truncate">{cat.name}</span>
                              </div>
                              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500">
                                {catItemCount}
                              </span>
                            </div>

                            {/* 二级子节点（例如 大事记 -> 2026年、2025年、2021年等） */}
                            {hasChildren && isExpanded && (
                              <div className="pl-4 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-3.5">
                                {childCats.map((subCat) => {
                                  const isSubSelected = selectedTopicCatId === subCat.id;
                                  const subCount = topicList.filter((item) => item.categoryId === subCat.id).length;
                                  return (
                                    <div
                                      key={subCat.id}
                                      onClick={() => handleSelectTopicCategory(subCat.id)}
                                      className={`flex items-center justify-between px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                                        isSubSelected
                                          ? 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-semibold'
                                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                      }`}
                                    >
                                      <div className="flex items-center gap-1.5 truncate">
                                        <FileText className="w-3 h-3 text-slate-400" />
                                        <span className="truncate">{subCat.name}</span>
                                      </div>
                                      <span className="text-[10px] font-mono text-slate-400">{subCount}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* 树底部提示 */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              💡 点击左侧专题分类，右侧表格与每页 10 条数据即时联动更新。
            </div>
          </div>

          {/* 右侧：专题数据表与多功能操作栏 */}
          <div className="lg:col-span-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden space-y-0">
            {/* 顶部操作工具栏：包含截图标准三个按钮及功能拓展 */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* [添加] 按钮 - 实心蓝底 */}
                <button
                  type="button"
                  onClick={handleOpenAddTopicModal}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加</span>
                </button>

                {/* [编辑] 按钮 - 实心蓝底 */}
                <button
                  type="button"
                  onClick={() => handleOpenEditTopicModal()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>编辑</span>
                </button>

                {/* [删除] 按钮 - 浅蓝线框 */}
                <button
                  type="button"
                  onClick={handleDeleteSelectedTopics}
                  className="px-4 py-2 rounded-lg border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除</span>
                  {selectedTopicItemIds.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-[10px] font-bold">
                      {selectedTopicItemIds.length}
                    </span>
                  )}
                </button>

                {/* 样式展示切换：表格模式 / 卡片画廊模式 */}
                <div className="h-6 w-px bg-slate-200 dark:border-slate-800 mx-1 hidden sm:block" />
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setTopicViewMode('table')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      topicViewMode === 'table'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    表格视图
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopicViewMode('card')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      topicViewMode === 'card'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    画廊卡片
                  </button>
                </div>
              </div>

              {/* 搜索框与当前分类信息 */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索专题名称、编码、备注..."
                    value={topicSearch}
                    onChange={(e) => {
                      setTopicSearch(e.target.value);
                      setTopicPage(1);
                    }}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden w-56 sm:w-64"
                  />
                  {topicSearch && (
                    <button
                      type="button"
                      onClick={() => setTopicSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 hidden xl:flex items-center gap-1.5">
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    当前分类：{currentCategoryObj.name}
                  </span>
                </div>
              </div>
            </div>

            {/* 表格视图：严格对齐原型列名并丰富业务真实性 */}
            {topicViewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">
                        <input
                          type="checkbox"
                          checked={
                            paginatedTopicItems.length > 0 &&
                            paginatedTopicItems.every((item) => selectedTopicItemIds.includes(item.id))
                          }
                          onChange={handleToggleSelectAllTopics}
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4 text-center whitespace-nowrap w-16">序号</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[200px]">专题名称</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[120px]">专题编码</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">牵头部门</th>
                      <th className="py-3 px-4 text-center whitespace-nowrap min-w-[90px]">关联卷数</th>
                      <th className="py-3 px-4 text-center whitespace-nowrap min-w-[90px]">密级</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[100px]">建立时间</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[240px]">备注</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap min-w-[130px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                    {paginatedTopicItems.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-slate-400">
                          <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                          <span>当前分类下暂无匹配的专题档案数据</span>
                        </td>
                      </tr>
                    ) : (
                      paginatedTopicItems.map((item, idx) => {
                        const isChecked = selectedTopicItemIds.includes(item.id);
                        return (
                          <tr
                            key={item.id}
                            className={`transition-colors ${
                              isChecked
                                ? 'bg-blue-50/70 dark:bg-blue-950/40'
                                : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleSelectTopicItem(item.id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-slate-500 whitespace-nowrap">
                              {(topicPage - 1) * PAGE_SIZE + idx + 1}
                            </td>
                            <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                              <div className="flex items-center gap-1.5">
                                <span>{item.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                              {item.code}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                              {item.leadDept}
                            </td>
                            <td className="py-3 px-4 text-center font-mono font-semibold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                              {item.volumeCount} 卷
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                  item.securityLevel.includes('机密')
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300'
                                    : item.securityLevel.includes('秘密')
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                                    : item.securityLevel.includes('内部') || item.securityLevel.includes('工作秘密')
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                }`}
                              >
                                {item.securityLevel}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                              {item.createDate}
                            </td>
                            <td className="py-3 px-4 text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                              {item.remark}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditTopicModal(item)}
                                  className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-medium transition-colors"
                                >
                                  编辑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentTopicItem(item);
                                    setTopicModalMode('detail');
                                    setIsTopicItemModalOpen(true);
                                  }}
                                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                                >
                                  详情
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSingleTopicDelete(item)}
                                  className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-medium transition-colors"
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
              /* 卡片画廊展示视图（满足用户“调整下其他的展示样式”要求） */
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedTopicItems.map((item) => {
                  const isChecked = selectedTopicItemIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all ${
                        isChecked
                          ? 'border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelectTopicItem(item.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                            {item.code}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.securityLevel.includes('机密')
                              ? 'bg-orange-100 text-orange-700'
                              : item.securityLevel.includes('内部')
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {item.securityLevel}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                        {item.name}
                      </h4>

                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {item.remark}
                      </p>

                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex items-center gap-3">
                          <span>{item.leadDept}</span>
                          <span className="font-semibold text-indigo-600">{item.volumeCount} 卷</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditTopicModal(item)}
                            className="text-blue-600 hover:underline"
                          >
                            编辑
                          </button>
                          <span className="text-slate-300">|</span>
                          <button
                            type="button"
                            onClick={() => {
                              setCurrentTopicItem(item);
                              setTopicModalMode('detail');
                              setIsTopicItemModalOpen(true);
                            }}
                            className="text-slate-600 hover:underline"
                          >
                            详情
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 分页组件：严格每页 10 条数据 */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Pagination
                currentPage={topicPage}
                totalItems={filteredTopicItems.length}
                pageSize={PAGE_SIZE}
                onPageChange={setTopicPage}
              />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. 著录项规则设置 (setting_metadata_rules) - 双栏树表联动 */}
      {/* ========================================================================= */}
      {activeTab === 'setting_metadata_rules' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* 左侧：档案类型列表 树形面板 (对齐原型截图结构) */}
          <div className="lg:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden">
            {/* 树顶部标头 */}
            <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-800 dark:text-slate-100">
                <Folder className="w-4 h-4 text-blue-600" />
                <span>档案类型列表</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                {ruleTypeNodes.filter((n) => n.level).length} 个业务层级
              </span>
            </div>

            {/* 树节点区 */}
            <div className="p-2 space-y-1 max-h-[640px] overflow-y-auto">
              {/* 根节点：档案类型列表 */}
              <div>
                <div
                  className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                  onClick={() => handleToggleRuleNodeExpand('root')}
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRuleNodeExpand('root');
                      }}
                      className="p-0.5 text-slate-400 hover:text-slate-600"
                    >
                      {expandedRuleNodeIds.includes('root') ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {expandedRuleNodeIds.includes('root') ? (
                      <FolderOpen className="w-4 h-4 text-amber-500 shrink-0" />
                    ) : (
                      <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                    )}
                    <span className="truncate">档案类型列表</span>
                  </div>
                </div>

                {/* 一级大类：文书档案（文件）、文书档案（盒/案卷）、工程档案、会计档案 */}
                {expandedRuleNodeIds.includes('root') && (
                  <div className="pl-3.5 mt-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-800 ml-3">
                    {ruleTypeNodes
                      .filter((n) => n.parentId === 'root')
                      .map((cat) => {
                        const isExpanded = expandedRuleNodeIds.includes(cat.id);
                        const childLevels = ruleTypeNodes.filter((sub) => sub.parentId === cat.id);
                        const hasChildren = childLevels.length > 0;

                        return (
                          <div key={cat.id} className="space-y-0.5">
                            <div
                              onClick={() => {
                                handleToggleRuleNodeExpand(cat.id);
                                if (hasChildren) {
                                  handleSelectRuleNode(childLevels[0]);
                                }
                              }}
                              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                {hasChildren ? (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleToggleRuleNodeExpand(cat.id);
                                    }}
                                    className="p-0.5 text-slate-400 hover:text-slate-600"
                                  >
                                    {isExpanded ? (
                                      <ChevronDown className="w-3.5 h-3.5" />
                                    ) : (
                                      <ChevronRight className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                ) : (
                                  <span className="w-3.5 h-3.5 shrink-0" />
                                )}
                                {isExpanded ? (
                                  <FolderOpen className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                ) : (
                                  <Folder className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                )}
                                <span className="truncate font-medium">{cat.name}</span>
                              </div>
                            </div>

                            {/* 二级层级节点：文件 / 案卷 / 项目 */}
                            {hasChildren && isExpanded && (
                              <div className="pl-5 space-y-0.5 border-l border-slate-200 dark:border-slate-800 ml-3.5">
                                {childLevels.map((subNode) => {
                                  const isSelected = selectedRuleNodeId === subNode.id;
                                  const ruleCount = (metadataRulesMap[subNode.id] || []).length;
                                  return (
                                    <div
                                      key={subNode.id}
                                      onClick={() => handleSelectRuleNode(subNode)}
                                      className={`flex items-center justify-between px-3 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                                        isSelected
                                          ? 'bg-blue-100/70 text-blue-700 dark:bg-blue-900/60 dark:text-blue-300 font-bold'
                                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2 truncate">
                                        <FileText className={`w-3.5 h-3.5 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                                        <span className="truncate">{subNode.name}</span>
                                      </div>
                                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                                        {ruleCount}条
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* 树底部提示 */}
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              💡 点击左侧层级节点，右侧表格立即刷新对应著录项规则（每页固定 10 条）。
            </div>
          </div>

          {/* 右侧：规则操作栏、表格与底部说明 */}
          <div className="lg:col-span-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-hidden space-y-0">
            {/* 顶部操作工具栏：严格还原原型截图中五个标准按钮 */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900">
              <div className="flex flex-wrap items-center gap-2.5">
                {/* 1. [添加规则] 按钮 - 实心蓝底 */}
                <button
                  type="button"
                  onClick={handleOpenAddRuleModal}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加规则</span>
                </button>

                {/* 2. [编辑规则] 按钮 - 实心蓝底 */}
                <button
                  type="button"
                  onClick={() => handleOpenEditRuleModal()}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>编辑规则</span>
                </button>

                {/* 3. [删除规则] 按钮 - 浅蓝线框 */}
                <button
                  type="button"
                  onClick={handleDeleteSelectedRules}
                  className="px-4 py-2 rounded-lg border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>删除规则</span>
                  {selectedRuleIds.length > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-full text-[10px] font-bold">
                      {selectedRuleIds.length}
                    </span>
                  )}
                </button>

                {/* 4. [启用] 按钮 - 浅蓝线框 */}
                <button
                  type="button"
                  onClick={handleBatchEnableRules}
                  className="px-4 py-2 rounded-lg border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>启用</span>
                </button>

                {/* 5. [禁用] 按钮 - 浅蓝线框 */}
                <button
                  type="button"
                  onClick={handleBatchDisableRules}
                  className="px-4 py-2 rounded-lg border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>禁用</span>
                </button>

                {/* 样式展示切换 */}
                <div className="h-6 w-px bg-slate-200 dark:border-slate-800 mx-1 hidden sm:block" />
                <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
                  <button
                    type="button"
                    onClick={() => setRuleViewMode('table')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      ruleViewMode === 'table'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    标准表格
                  </button>
                  <button
                    type="button"
                    onClick={() => setRuleViewMode('preview')}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                      ruleViewMode === 'preview'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    语法解析预览
                  </button>
                </div>
              </div>

              {/* 搜索框与当前门类提示 */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="搜索著录项、规则表达式..."
                    value={ruleSearch}
                    onChange={(e) => {
                      setRuleSearch(e.target.value);
                      setRulePage(1);
                    }}
                    className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200 focus:outline-hidden w-52 sm:w-60"
                  />
                  {ruleSearch && (
                    <button
                      type="button"
                      onClick={() => setRuleSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 dark:text-slate-400 hidden xl:flex items-center gap-1.5">
                  <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                    当前层级：{currentRuleNode.name}
                  </span>
                </div>
              </div>
            </div>

            {/* 表格区：严格对齐原型列名（复选框、序号、状态、著录项、规则表达式）并扩展操作列 */}
            {ruleViewMode === 'table' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/70 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold">
                    <tr>
                      <th className="py-3 px-3 text-center w-12">
                        <input
                          type="checkbox"
                          checked={
                            paginatedRuleItems.length > 0 &&
                            paginatedRuleItems.every((item) => selectedRuleIds.includes(item.id))
                          }
                          onChange={handleToggleSelectAllRules}
                          className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                      </th>
                      <th className="py-3 px-4 text-center whitespace-nowrap w-16">序号</th>
                      <th className="py-3 px-4 text-center whitespace-nowrap w-24">状态</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">著录项</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[280px]">规则表达式</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[200px]">示例生成</th>
                      <th className="py-3 px-4 whitespace-nowrap min-w-[100px]">更新时间</th>
                      <th className="py-3 px-4 text-right whitespace-nowrap min-w-[130px]">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                    {paginatedRuleItems.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400">
                          <Sliders className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                          <span>当前档案层级下暂无著录项规则数据</span>
                        </td>
                      </tr>
                    ) : (
                      paginatedRuleItems.map((item, idx) => {
                        const isChecked = selectedRuleIds.includes(item.id);
                        return (
                          <tr
                            key={item.id}
                            className={`transition-colors ${
                              isChecked
                                ? 'bg-blue-50/70 dark:bg-blue-950/40'
                                : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/50'
                            }`}
                          >
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleSelectRuleItem(item.id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                              />
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-slate-500 whitespace-nowrap">
                              {(rulePage - 1) * PAGE_SIZE + idx + 1}
                            </td>
                            <td className="py-3 px-4 text-center whitespace-nowrap">
                              <span
                                className={`px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                                  item.status === '启用'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                              {item.fieldItem}
                            </td>
                            <td className="py-3 px-4 font-mono font-medium text-slate-800 dark:text-slate-200">
                              <code className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-blue-700 dark:text-blue-300 text-xs">
                                {item.ruleExpr}
                              </code>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 text-xs">
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{item.example}</span>
                            </td>
                            <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                              {item.updateTime}
                            </td>
                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditRuleModal(item)}
                                  className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-medium transition-colors"
                                >
                                  编辑
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCurrentRuleItem(item);
                                    setRuleModalMode('detail');
                                    setIsRuleItemModalOpen(true);
                                  }}
                                  className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
                                >
                                  详情
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleToggleSingleRuleStatus(item)}
                                  className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                                    item.status === '启用'
                                      ? 'bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-950/40'
                                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40'
                                  }`}
                                >
                                  {item.status === '启用' ? '停用' : '启用'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSingleRuleDelete(item)}
                                  className="px-2 py-1 rounded bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 hover:bg-rose-100 text-xs font-medium transition-colors"
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
              /* 语法解析预览视图 */
              <div className="p-4 space-y-3">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  当前规则语法解析胶囊卡片（展示著录项拆解与动态拼接预览）：
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {paginatedRuleItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{item.fieldItem}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            item.status === '启用' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 py-1">
                        {item.ruleExpr.split(/([-\[\]\.\/〔〕号])/).filter(Boolean).map((token, tidx) => {
                          if (['[', ']', '-', '.', '/', '〔', '〕', '号'].includes(token)) {
                            return <span key={tidx} className="font-mono text-slate-400 font-bold">{token}</span>;
                          }
                          return (
                            <span
                              key={tidx}
                              className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 text-xs font-mono font-medium"
                            >
                              {token}
                            </span>
                          );
                        })}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        生成示例：<span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.example}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-200 dark:border-slate-700/60 pt-2">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 分页组件：严格每页 10 条数据 */}
            <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
              <Pagination
                currentPage={rulePage}
                totalItems={filteredRuleItems.length}
                pageSize={PAGE_SIZE}
                onPageChange={setRulePage}
              />
            </div>

            {/* 底部业务说明：严格对齐原型截图中的说明板块 */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800/80 bg-white dark:bg-slate-900">
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-rose-500 dark:text-rose-400">
                  说明
                </h4>
                <div className="pl-3 border-l-2 border-rose-500 dark:border-rose-400 text-xs text-rose-500 dark:text-rose-400 leading-relaxed">
                  1、新增的规则默认是启用状态
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. 默认数据权限 (setting_default_permissions) */}
      {/* ========================================================================= */}
      {activeTab === 'setting_default_permissions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 左侧：档案类型列表 */}
            <div className="lg:col-span-3 xl:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">档案类型列表</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold">
                  {permArchiveTypeList.length} 类
                </span>
              </div>

              <div className="p-2 space-y-1">
                {permArchiveTypeList.map((type) => {
                  const isSelected = selectedPermTypeId === type.id;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => {
                        setSelectedPermTypeId(type.id);
                        setPermTablePage(1);
                        setSelectedPermRuleIds([]);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 font-semibold shadow-xs'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {isSelected ? (
                          <FolderOpen className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                        ) : (
                          <Folder className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 shrink-0" />
                        )}
                        <span className="truncate">{type.name}</span>
                      </div>
                      <ChevronRight
                        className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                          isSelected ? 'text-blue-600 dark:text-blue-400 translate-x-0.5' : 'text-slate-300 opacity-0 group-hover:opacity-100'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 leading-relaxed">
                点击左侧档案类型，右侧权限配置与规则表格即时联动更新。
              </div>
            </div>

            {/* 右侧：默认数据权限配置主面板 */}
            <div className="lg:col-span-9 xl:col-span-9 space-y-4">
              {/* 顶部标题与视图切换工具条 */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3 shadow-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      【{currentPermType.name}】默认数据权限设置
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 border border-blue-200 dark:border-blue-800 font-mono">
                      {currentPermType.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    当前门类：{currentPermType.desc} · 最近生效更新：<span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{currentCategoryForm.updatedAt}</span>
                  </p>
                </div>

                {/* 视图样式切换：表单配置视图 vs 权限规则矩阵表格 */}
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                  <button
                    type="button"
                    onClick={() => setPermViewMode('form')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                      permViewMode === 'form'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>表单配置视图 (原型)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPermViewMode('table')}
                    className={`px-3 py-1.5 rounded-md font-medium transition-all flex items-center gap-1.5 ${
                      permViewMode === 'table'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>权限规则矩阵 (表格)</span>
                  </button>
                </div>
              </div>

              {/* 样式 1: 表单配置视图（严格对齐截图 image_81d7ca89.png） */}
              {permViewMode === 'form' && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-xs space-y-8">
                  {/* 区块 1：浏览操作-在知悉范围内 */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      浏览操作-在知悉范围内
                    </h4>

                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      在
                      <button
                        type="button"
                        onClick={() => onShowMessage(`当前选中的档案类型：${currentPermType.name}`)}
                        className="text-blue-600 dark:text-blue-400 underline font-medium mx-1 hover:text-blue-700"
                      >
                        {currentPermType.name}
                      </button>
                      中，在档案检索模块，用户拥有以下权限：
                    </div>

                    <div className="space-y-3.5 pl-1 pt-1 text-xs">
                      {/* 1. 条目信息浏览 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.insideScope.catalogBrowse}
                          onChange={() => handleToggleFormCheckbox('insideScope', 'catalogBrowse')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            条目信息浏览
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            没有权限的用户不能对本档案库进行条目浏览和查询
                          </span>
                        </div>
                      </label>

                      {/* 2. 电子文件浏览 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.insideScope.electronicBrowse}
                          onChange={() => handleToggleFormCheckbox('insideScope', 'electronicBrowse')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            电子文件浏览
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            没有权限则用户只能看到附件名称，但是不能在线浏览
                          </span>
                        </div>
                      </label>

                      {/* 3. 电子文件打印 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.insideScope.electronicPrint}
                          onChange={() => handleToggleFormCheckbox('insideScope', 'electronicPrint')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            电子文件打印
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            无权限不能在线打印
                          </span>
                        </div>
                      </label>

                      {/* 4. 电子文件下载 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.insideScope.electronicDownload}
                          onChange={() => handleToggleFormCheckbox('insideScope', 'electronicDownload')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            电子文件下载
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            没有权限则不能对附件进行下载。
                          </span>
                        </div>
                      </label>

                      {/* 5. 档案实体借阅 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.insideScope.physicalBorrow}
                          onChange={() => handleToggleFormCheckbox('insideScope', 'physicalBorrow')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            档案实体借阅
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            有权限管理员就可借出，无权限档案的借阅需要领导审批。
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 区块 2：浏览操作-在知悉范围外 */}
                  <div className="space-y-4 pt-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      浏览操作-在知悉范围外
                    </h4>

                    <div className="text-xs text-slate-700 dark:text-slate-300">
                      在
                      <button
                        type="button"
                        onClick={() => onShowMessage(`当前选中的档案类型：${currentPermType.name}`)}
                        className="text-blue-600 dark:text-blue-400 underline font-medium mx-1 hover:text-blue-700"
                      >
                        {currentPermType.name}
                      </button>
                      中，在档案检索模块，用户拥有以下权限：
                    </div>

                    <div className="space-y-3.5 pl-1 pt-1 text-xs">
                      {/* 1. 条目信息浏览 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.outsideScope.catalogBrowse}
                          onChange={() => handleToggleFormCheckbox('outsideScope', 'catalogBrowse')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            条目信息浏览
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            没有权限的用户不能对本档案库进行条目浏览和查询
                          </span>
                        </div>
                      </label>

                      {/* 2. 电子文件浏览 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.outsideScope.electronicBrowse}
                          onChange={() => handleToggleFormCheckbox('outsideScope', 'electronicBrowse')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            电子文件浏览
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            没有权限则用户只能看到附件名称，但是不能在线浏览
                          </span>
                        </div>
                      </label>

                      {/* 3. 电子文件打印 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.outsideScope.electronicPrint}
                          onChange={() => handleToggleFormCheckbox('outsideScope', 'electronicPrint')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            电子文件打印
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            无权限不能在线打印
                          </span>
                        </div>
                      </label>

                      {/* 4. 电子文件下载 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.outsideScope.electronicDownload}
                          onChange={() => handleToggleFormCheckbox('outsideScope', 'electronicDownload')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            电子文件下载
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            没有权限则不能对附件进行下载。
                          </span>
                        </div>
                      </label>

                      {/* 5. 档案实体借阅 */}
                      <label className="flex items-start gap-3 cursor-pointer select-none group">
                        <input
                          type="checkbox"
                          checked={currentCategoryForm.outsideScope.physicalBorrow}
                          onChange={() => handleToggleFormCheckbox('outsideScope', 'physicalBorrow')}
                          className="mt-0.5 w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                        />
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                          <span className="font-semibold text-slate-900 dark:text-white min-w-[100px] group-hover:text-blue-600 transition-colors">
                            档案实体借阅
                          </span>
                          <span className="text-slate-500 dark:text-slate-400">
                            有权限管理员就可借出，无权限档案的借阅需要领导审批。
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* 底部按钮栏（严格还原截图中的蓝色 [保存] 按钮，并扩展实用操作） */}
                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={handleSaveFormPerms}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>保存</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleResetFormPerms}
                        className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                        <span>恢复默认</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsScopeHelpModalOpen(true)}
                        className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                        <span>知悉范围判定标准说明</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleOpenSyncModal}
                        className="px-3.5 py-2 rounded-lg border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-medium hover:bg-blue-100 transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Copy className="w-3.5 h-3.5 text-blue-600" />
                        <span>一键同步至其他档案门类</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 样式 2: 权限规则矩阵表格（严格每页10条数据、按钮操作、全功能交互） */}
              {permViewMode === 'table' && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs space-y-4 p-4">
                  {/* 操作按钮区 */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={handleOpenAddPermRuleModal}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>添加权限项</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenEditPermRuleModal()}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>编辑规则</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBatchSetPolicy('默认允许')}
                        className="px-3.5 py-1.5 rounded-lg border border-blue-400/80 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>批量允许</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleBatchSetPolicy('默认禁止')}
                        className="px-3.5 py-1.5 rounded-lg border border-blue-400/80 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <X className="w-3.5 h-3.5 text-rose-500" />
                        <span>批量禁止</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBatchDeletePermRules}
                        className="px-3.5 py-1.5 rounded-lg border border-rose-300 bg-white dark:bg-slate-900 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>删除规则</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={permScopeFilter}
                        onChange={(e) => {
                          setPermScopeFilter(e.target.value as any);
                          setPermTablePage(1);
                        }}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden"
                      >
                        <option value="all">全部知悉范围</option>
                        <option value="在知悉范围内">在知悉范围内</option>
                        <option value="在知悉范围外">在知悉范围外</option>
                      </select>

                      <div className="relative">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="搜索权限项、控制说明..."
                          value={permSearch}
                          onChange={(e) => {
                            setPermSearch(e.target.value);
                            setPermTablePage(1);
                          }}
                          className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden w-48"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 表格主体 */}
                  <div className="overflow-x-auto rounded-lg border border-slate-100 dark:border-slate-800">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3 px-3 text-center w-10">
                            <input
                              type="checkbox"
                              checked={selectedPermRuleIds.length === currentPagedPermRules.length && currentPagedPermRules.length > 0}
                              onChange={handleToggleSelectAllPermRules}
                              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </th>
                          <th className="py-3 px-3 text-center w-12">序号</th>
                          <th className="py-3 px-3 whitespace-nowrap min-w-[120px]">权限名称</th>
                          <th className="py-3 px-3 whitespace-nowrap">知悉范围</th>
                          <th className="py-3 px-3 whitespace-nowrap">授权策略</th>
                          <th className="py-3 px-3 min-w-[280px]">受控业务说明</th>
                          <th className="py-3 px-3 whitespace-nowrap">适用业务模块</th>
                          <th className="py-3 px-3 whitespace-nowrap">更新时间</th>
                          <th className="py-3 px-3 text-right whitespace-nowrap">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                        {currentPagedPermRules.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-10 text-center text-slate-400">
                              未查询到符合条件的默认数据权限规则
                            </td>
                          </tr>
                        ) : (
                          currentPagedPermRules.map((row, index) => {
                            const isChecked = selectedPermRuleIds.includes(row.id);
                            return (
                              <tr
                                key={row.id}
                                className={`transition-colors ${
                                  isChecked ? 'bg-blue-50/50 dark:bg-blue-950/30' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <td className="py-3 px-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleSelectPermRuleItem(row.id)}
                                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                  />
                                </td>
                                <td className="py-3 px-3 text-center font-mono text-slate-500">
                                  {(permTablePage - 1) * PAGE_SIZE + index + 1}
                                </td>
                                <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                                  {row.name}
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                                      row.scopeType === '在知悉范围内'
                                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                                        : 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                                    }`}
                                  >
                                    {row.scopeType}
                                  </span>
                                </td>
                                <td className="py-3 px-3 whitespace-nowrap">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSinglePolicy(row)}
                                    title="点击快捷轮转策略"
                                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                                      row.policy === '默认允许'
                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                        : row.policy === '需审批'
                                        ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                                        : 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                                    }`}
                                  >
                                    {row.policy}
                                  </button>
                                </td>
                                <td className="py-3 px-3 text-slate-600 dark:text-slate-400">
                                  {row.desc}
                                </td>
                                <td className="py-3 px-3 font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                  {row.targetModule}
                                </td>
                                <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                                  {row.updatedAt}
                                </td>
                                <td className="py-3 px-3 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditPermRuleModal(row)}
                                      className="p-1 rounded text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700"
                                      title="编辑规则"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSinglePermRuleDelete(row)}
                                      className="p-1 rounded text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-700"
                                      title="删除规则"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
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

                  {/* 严格分页：每页10条 */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <div className="text-xs text-slate-500 font-mono">
                      显示第 {(permTablePage - 1) * PAGE_SIZE + 1} -{' '}
                      {Math.min(permTablePage * PAGE_SIZE, filteredPermRules.length)} 条，共{' '}
                      <span className="font-bold text-slate-900 dark:text-white">{filteredPermRules.length}</span> 条权限规则
                    </div>
                    <Pagination
                      currentPage={permTablePage}
                      totalItems={filteredPermRules.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setPermTablePage}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. 报表维护 (setting_report_maintenance) */}
      {/* ========================================================================= */}
      {activeTab === 'setting_report_maintenance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* 左侧：档案目录树（严格对齐截图 image_85a648c1.png） */}
            <div className="lg:col-span-3 xl:col-span-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
              <div className="px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">档案目录树</span>
                </div>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-bold">
                  {initialReportTreeNodes.length} 节点
                </span>
              </div>

              {/* 树形列表内容 */}
              <div className="p-2 space-y-0.5 max-h-[680px] overflow-y-auto text-xs select-none">
                {/* 根节点 1: 档案类型列表 */}
                {(() => {
                  const root1 = initialReportTreeNodes.find((n) => n.id === 'root_type_list')!;
                  const isRoot1Expanded = expandedReportTreeNodes.includes(root1.id);
                  const root1Children = initialReportTreeNodes.filter((n) => n.parentId === root1.id);

                  return (
                    <div key={root1.id} className="space-y-0.5">
                      <div
                        onClick={() => handleToggleReportTreeExpand(root1.id)}
                        className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold text-xs transition-colors ${
                          selectedReportTreeNodeId === root1.id
                            ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleReportTreeExpand(root1.id);
                          }}
                          className="p-0.5 text-slate-400 hover:text-slate-600"
                        >
                          {isRoot1Expanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                        <span className="truncate">{root1.name}</span>
                      </div>

                      {/* 根节点 1 的子项 */}
                      {isRoot1Expanded && (
                        <div className="pl-4 space-y-0.5 border-l border-slate-200/80 dark:border-slate-800 ml-3">
                          {root1Children.map((catNode) => {
                            const catChildren = initialReportTreeNodes.filter((n) => n.parentId === catNode.id);
                            const hasChildren = catChildren.length > 0;
                            const isCatExpanded = expandedReportTreeNodes.includes(catNode.id);
                            const isSelected = selectedReportTreeNodeId === catNode.id;

                            return (
                              <div key={catNode.id} className="space-y-0.5">
                                <div
                                  onClick={() => {
                                    if (hasChildren) {
                                      handleToggleReportTreeExpand(catNode.id);
                                    }
                                    handleSelectReportTreeNode(catNode);
                                  }}
                                  className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                                    isSelected
                                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold'
                                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                  }`}
                                >
                                  {hasChildren ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleReportTreeExpand(catNode.id);
                                      }}
                                      className="p-0.5 text-slate-400 hover:text-slate-600"
                                    >
                                      {isCatExpanded ? (
                                        <ChevronDown className="w-3 h-3" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3" />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="w-4" />
                                  )}
                                  <Folder className="w-3.5 h-3.5 text-amber-500/80 shrink-0" />
                                  <span className="truncate">{catNode.name}</span>
                                </div>

                                {/* 第三级节点 (文件、案卷、项目) */}
                                {hasChildren && isCatExpanded && (
                                  <div className="pl-4 space-y-0.5 border-l border-slate-200/60 dark:border-slate-800 ml-3">
                                    {catChildren.map((leafNode) => {
                                      const isLeafSelected = selectedReportTreeNodeId === leafNode.id;
                                      return (
                                        <div
                                          key={leafNode.id}
                                          onClick={() => handleSelectReportTreeNode(leafNode)}
                                          className={`px-2 py-1 rounded-md flex items-center gap-2 cursor-pointer text-xs transition-colors ${
                                            isLeafSelected
                                              ? 'bg-blue-500 text-white font-semibold shadow-xs'
                                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                          }`}
                                        >
                                          <FileText className={`w-3.5 h-3.5 shrink-0 ${isLeafSelected ? 'text-white' : 'text-slate-400'}`} />
                                          <span className="truncate">{leafNode.name}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* 根节点 2: 档案销毁表 */}
                {(() => {
                  const root2 = initialReportTreeNodes.find((n) => n.id === 'root_destroy_list')!;
                  const isRoot2Expanded = expandedReportTreeNodes.includes(root2.id);
                  const root2Children = initialReportTreeNodes.filter((n) => n.parentId === root2.id);

                  return (
                    <div key={root2.id} className="space-y-0.5 pt-2">
                      <div
                        onClick={() => handleToggleReportTreeExpand(root2.id)}
                        className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer font-bold text-xs transition-colors ${
                          selectedReportTreeNodeId === root2.id
                            ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300'
                            : 'text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleReportTreeExpand(root2.id);
                          }}
                          className="p-0.5 text-slate-400 hover:text-slate-600"
                        >
                          {isRoot2Expanded ? (
                            <ChevronDown className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <Folder className="w-4 h-4 text-rose-500 shrink-0" />
                        <span className="truncate">{root2.name}</span>
                      </div>

                      {/* 根节点 2 的子项 */}
                      {isRoot2Expanded && (
                        <div className="pl-4 space-y-0.5 border-l border-slate-200/80 dark:border-slate-800 ml-3">
                          {root2Children.map((catNode) => {
                            const catChildren = initialReportTreeNodes.filter((n) => n.parentId === catNode.id);
                            const hasChildren = catChildren.length > 0;
                            const isCatExpanded = expandedReportTreeNodes.includes(catNode.id);
                            const isSelected = selectedReportTreeNodeId === catNode.id;

                            return (
                              <div key={catNode.id} className="space-y-0.5">
                                <div
                                  onClick={() => {
                                    if (hasChildren) {
                                      handleToggleReportTreeExpand(catNode.id);
                                    }
                                    handleSelectReportTreeNode(catNode);
                                  }}
                                  className={`px-2 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer text-xs transition-colors ${
                                    isSelected
                                      ? 'bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 font-semibold'
                                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                                  }`}
                                >
                                  {hasChildren ? (
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleToggleReportTreeExpand(catNode.id);
                                      }}
                                      className="p-0.5 text-slate-400 hover:text-slate-600"
                                    >
                                      {isCatExpanded ? (
                                        <ChevronDown className="w-3 h-3" />
                                      ) : (
                                        <ChevronRight className="w-3 h-3" />
                                      )}
                                    </button>
                                  ) : (
                                    <span className="w-4" />
                                  )}
                                  <Folder className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                                  <span className="truncate">{catNode.name}</span>
                                </div>

                                {/* 第三级销毁节点 */}
                                {hasChildren && isCatExpanded && (
                                  <div className="pl-4 space-y-0.5 border-l border-slate-200/60 dark:border-slate-800 ml-3">
                                    {catChildren.map((leafNode) => {
                                      const isLeafSelected = selectedReportTreeNodeId === leafNode.id;
                                      return (
                                        <div
                                          key={leafNode.id}
                                          onClick={() => handleSelectReportTreeNode(leafNode)}
                                          className={`px-2 py-1 rounded-md flex items-center gap-2 cursor-pointer text-xs transition-colors ${
                                            isLeafSelected
                                              ? 'bg-rose-600 text-white font-semibold shadow-xs'
                                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                                          }`}
                                        >
                                          <FileText className={`w-3.5 h-3.5 shrink-0 ${isLeafSelected ? 'text-white' : 'text-slate-400'}`} />
                                          <span className="truncate">{leafNode.name}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-500 leading-relaxed">
                点击左侧目录树节点，右侧报表模板列表与设计器即时联动。
              </div>
            </div>

            {/* 右侧：报表维护操作栏与表格面板 */}
            <div className="lg:col-span-9 xl:col-span-9 space-y-4">
              {/* 顶部操作按钮栏（严格对齐截图四个核心按钮：新建、编辑、设计、删除） */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* 新建 (实心蓝底) */}
                  <button
                    type="button"
                    onClick={handleOpenNewReportModal}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>新建</span>
                  </button>

                  {/* 编辑 (实心蓝底) */}
                  <button
                    type="button"
                    onClick={() => handleOpenEditReportModal()}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>编辑</span>
                  </button>

                  {/* 设计 (实心蓝底) */}
                  <button
                    type="button"
                    onClick={() => handleOpenDesignReportModal()}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>设计</span>
                  </button>

                  {/* 删除 (线框浅蓝) */}
                  <button
                    type="button"
                    onClick={handleBatchDeleteReports}
                    className="px-4 py-1.5 rounded-lg border border-blue-400/80 bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>删除</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {/* 视图样式切换：标准表格 vs 模板卡片大纲 */}
                  <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs">
                    <button
                      type="button"
                      onClick={() => setReportViewMode('table')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        reportViewMode === 'table'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      标准表格
                    </button>
                    <button
                      type="button"
                      onClick={() => setReportViewMode('cards')}
                      className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                        reportViewMode === 'cards'
                          ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      卡片大纲
                    </button>
                  </div>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="搜索报表名称、说明..."
                      value={reportSearch}
                      onChange={(e) => {
                        setReportSearch(e.target.value);
                        setReportPage(1);
                      }}
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden w-44"
                    />
                  </div>
                </div>
              </div>

              {/* 样式 1: 标准表格视图（严格对齐截图：复选框、序号、报表名称、说明、最后修改时间） */}
              {reportViewMode === 'table' && (
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <tr>
                          <th className="py-3 px-3 text-center w-10">
                            <input
                              type="checkbox"
                              checked={
                                selectedReportIds.length === currentPagedMaintenanceReports.length &&
                                currentPagedMaintenanceReports.length > 0
                              }
                              onChange={handleToggleSelectAllReports}
                              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                            />
                          </th>
                          <th className="py-3 px-3 text-center w-12">序号</th>
                          <th className="py-3 px-4 whitespace-nowrap min-w-[140px]">报表名称</th>
                          <th className="py-3 px-4 min-w-[320px]">说明</th>
                          <th className="py-3 px-4 whitespace-nowrap">规格/引擎</th>
                          <th className="py-3 px-4 whitespace-nowrap">最后修改时间</th>
                          <th className="py-3 px-4 text-right whitespace-nowrap">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                        {currentPagedMaintenanceReports.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-12 text-center text-slate-400">
                              当前目录节点【{currentReportTreeNode.name}】暂无报表模板定义，点击左上方【新建】添加
                            </td>
                          </tr>
                        ) : (
                          currentPagedMaintenanceReports.map((row, index) => {
                            const isChecked = selectedReportIds.includes(row.id);
                            return (
                              <tr
                                key={row.id}
                                className={`transition-colors ${
                                  isChecked ? 'bg-blue-50/50 dark:bg-blue-950/30' : 'hover:bg-slate-50/80 dark:hover:bg-slate-800/40'
                                }`}
                              >
                                <td className="py-3 px-3 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleToggleSelectReportItem(row.id)}
                                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer"
                                  />
                                </td>
                                <td className="py-3 px-3 text-center font-mono text-slate-500">
                                  {(reportPage - 1) * PAGE_SIZE + index + 1}
                                </td>
                                <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenPreviewReportModal(row)}
                                    className="hover:text-blue-600 hover:underline transition-colors text-left"
                                  >
                                    {row.name}
                                  </button>
                                </td>
                                <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                                  {row.desc}
                                </td>
                                <td className="py-3 px-4 whitespace-nowrap">
                                  <div className="flex items-center gap-1.5">
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
                                      {row.paperSpec}
                                    </span>
                                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 font-mono">
                                      {row.engine}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                                  {row.updateTime}
                                </td>
                                <td className="py-3 px-4 text-right whitespace-nowrap">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => handleOpenDesignReportModal(row)}
                                      className="px-2 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium flex items-center gap-1"
                                      title="可视化设计器"
                                    >
                                      <Sliders className="w-3 h-3" />
                                      <span>设计</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenPreviewReportModal(row)}
                                      className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1"
                                      title="打印预览"
                                    >
                                      <Eye className="w-3 h-3 text-slate-500" />
                                      <span>预览</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleOpenEditReportModal(row)}
                                      className="p-1 rounded text-slate-500 hover:text-blue-600 hover:bg-slate-100"
                                      title="编辑属性"
                                    >
                                      <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleSingleReportDelete(row)}
                                      className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-slate-100"
                                      title="删除模板"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
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

                  {/* 严格分页：每页10条 */}
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="text-xs text-slate-500 font-mono">
                      当前节点：<strong className="text-slate-900 dark:text-white">{currentReportTreeNode.name}</strong> · 显示第{' '}
                      {(reportPage - 1) * PAGE_SIZE + 1} -{' '}
                      {Math.min(reportPage * PAGE_SIZE, filteredMaintenanceReports.length)} 条，共{' '}
                      <span className="font-bold text-slate-900 dark:text-white">{filteredMaintenanceReports.length}</span> 条报表模板
                    </div>
                    <Pagination
                      currentPage={reportPage}
                      totalItems={filteredMaintenanceReports.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setReportPage}
                    />
                  </div>
                </div>
              )}

              {/* 样式 2: 卡片大纲视图（展示样式拓展） */}
              {reportViewMode === 'cards' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentPagedMaintenanceReports.map((row) => (
                      <div
                        key={row.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:border-blue-300 dark:hover:border-blue-800 transition-all space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
                              <FileSpreadsheet className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {row.name}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono">
                                更新时间：{row.updateTime}
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-blue-50 text-blue-700 border border-blue-200">
                            {row.paperSpec}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2">
                          {row.desc}
                        </p>

                        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-500">
                            引擎：{row.engine}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleOpenPreviewReportModal(row)}
                              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3 text-slate-500" />
                              <span>预览</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenDesignReportModal(row)}
                              className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs"
                            >
                              <Sliders className="w-3 h-3" />
                              <span>设计</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
                    <div className="text-xs text-slate-500 font-mono">
                      卡片视图共 <span className="font-bold text-slate-900 dark:text-white">{filteredMaintenanceReports.length}</span> 条模板
                    </div>
                    <Pagination
                      currentPage={reportPage}
                      totalItems={filteredMaintenanceReports.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={setReportPage}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 报表维护专有模态框组：新增、编辑、设计、预览、删除 */}
      {/* ========================================================================= */}

      {/* 1. 新建报表模态框（表单数据默认完全清空） */}
      {isNewReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">新建报表模板</h3>
                  <p className="text-[11px] text-slate-500">当前归属节点：{currentReportTreeNode.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsNewReportModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500 mr-1">*</span>报表名称
                </label>
                <input
                  type="text"
                  placeholder="请输入报表模板名称，如：综合档案统计分析表"
                  value={reportFormName}
                  onChange={(e) => setReportFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">纸张规格</label>
                  <select
                    value={reportFormPaper}
                    onChange={(e) => setReportFormPaper(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="A4竖版">A4竖版</option>
                    <option value="A4横版">A4横版</option>
                    <option value="A5竖版">A5竖版</option>
                    <option value="脊背标签连续纸">脊背标签连续纸</option>
                    <option value="自定义幅面">自定义幅面</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">报表引擎</label>
                  <select
                    value={reportFormEngine}
                    onChange={(e) => setReportFormEngine(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="FastReport引擎">FastReport引擎</option>
                    <option value="JasperReports引擎">JasperReports引擎</option>
                    <option value="OFD版式套打">OFD版式套打</option>
                    <option value="Excel数据套打">Excel数据套打</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">报表说明与备注</label>
                <textarea
                  rows={3}
                  placeholder="请输入该报表模板的适用范围、统计口径与填报说明..."
                  value={reportFormDesc}
                  onChange={(e) => setReportFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsNewReportModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleSaveReportSubmit(false)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存新建</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 编辑报表模态框 */}
      {isEditReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">编辑报表模板</h3>
                  <p className="text-[11px] text-slate-500">修改报表元数据定义与套打引擎属性</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditReportModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500 mr-1">*</span>报表名称
                </label>
                <input
                  type="text"
                  value={reportFormName}
                  onChange={(e) => setReportFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">纸张规格</label>
                  <select
                    value={reportFormPaper}
                    onChange={(e) => setReportFormPaper(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="A4竖版">A4竖版</option>
                    <option value="A4横版">A4横版</option>
                    <option value="A5竖版">A5竖版</option>
                    <option value="脊背标签连续纸">脊背标签连续纸</option>
                    <option value="自定义幅面">自定义幅面</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">报表引擎</label>
                  <select
                    value={reportFormEngine}
                    onChange={(e) => setReportFormEngine(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                  >
                    <option value="FastReport引擎">FastReport引擎</option>
                    <option value="JasperReports引擎">JasperReports引擎</option>
                    <option value="OFD版式套打">OFD版式套打</option>
                    <option value="Excel数据套打">Excel数据套打</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">报表说明与备注</label>
                <textarea
                  rows={3}
                  value={reportFormDesc}
                  onChange={(e) => setReportFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditReportModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleSaveReportSubmit(true)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存修改</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 可视化报表设计器页面/弹窗 (Design) */}
      {isDesignReportModalOpen && activeReportItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 animate-in fade-in">
          <div className="w-full max-w-5xl h-[85vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">可视化报表设计器 - {activeReportItem.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">引擎：{activeReportItem.engine} | 幅面：{activeReportItem.paperSpec}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsDesignReportModalOpen(false);
                    onShowMessage(`报表【${activeReportItem.name}】设计方案已实时保存！`);
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存设计</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsDesignReportModalOpen(false)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Designer Workspace Body */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Toolbox */}
              <div className="w-64 bg-slate-50 dark:bg-slate-800/60 border-r border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto text-xs shrink-0">
                <div className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">报表组件工具箱</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-medium cursor-move hover:border-blue-500 transition-colors">
                    静态文本框
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-medium cursor-move hover:border-blue-500 transition-colors">
                    动态字段绑定
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-medium cursor-move hover:border-blue-500 transition-colors">
                    明细表格 Band
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-medium cursor-move hover:border-blue-500 transition-colors">
                    条形码/二维码
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-medium cursor-move hover:border-blue-500 transition-colors">
                    电子印章签章
                  </div>
                  <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-center font-medium cursor-move hover:border-blue-500 transition-colors">
                    页眉页脚统计
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">可用元数据字段</div>
                  <div className="space-y-1 max-h-48 overflow-y-auto font-mono text-[11px]">
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600">[fondsCode] 全宗号</div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600">[years] 年度</div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600">[archiveNo] 档号</div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600">[title] 题名与摘要</div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600">[docNo] 发文字号</div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600">[security] 密级</div>
                    <div className="px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-blue-600">[retention] 保管期限</div>
                  </div>
                </div>
              </div>

              {/* Center Canvas */}
              <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-6 overflow-y-auto flex items-center justify-center">
                <div className="w-[680px] min-h-[720px] bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-xl rounded-lg p-8 space-y-6 text-slate-800 dark:text-slate-100 relative">
                  {/* Canvas Header Band */}
                  <div className="text-center space-y-1 pb-4 border-b-2 border-slate-900 dark:border-white">
                    <h2 className="text-lg font-bold tracking-widest">{activeReportItem.name}</h2>
                    <p className="text-xs text-slate-500 font-mono">成都市数字档案馆标准化输出凭证 (幅面：{activeReportItem.paperSpec})</p>
                  </div>

                  {/* Canvas Grid Table Band */}
                  <div className="border border-slate-300 dark:border-slate-700 text-xs">
                    <div className="bg-slate-100 dark:bg-slate-800 p-2 grid grid-cols-4 font-bold border-b border-slate-300 dark:border-slate-700 text-center">
                      <div>档号</div>
                      <div>题名概要</div>
                      <div>密级</div>
                      <div>保管期限</div>
                    </div>
                    <div className="p-2 grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 text-center font-mono text-[11px]">
                      <div className="text-blue-600">0110-WS-2026-001</div>
                      <div className="truncate px-1">关于全市数字档案馆建设实施意见...</div>
                      <div>内部</div>
                      <div>永久</div>
                    </div>
                    <div className="p-2 grid grid-cols-4 border-b border-slate-200 dark:border-slate-800 text-center font-mono text-[11px]">
                      <div className="text-blue-600">0110-WS-2026-002</div>
                      <div className="truncate px-1">关于印发电子档案长期保存规范...</div>
                      <div>公开</div>
                      <div>30年</div>
                    </div>
                  </div>

                  {/* Canvas Footer Band */}
                  <div className="pt-12 flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800">
                    <div>制表人：系统管理员</div>
                    <div>审核人：档案馆总编审</div>
                    <div>打印日期：2026-11-06</div>
                  </div>
                </div>
              </div>

              {/* Right Properties Panel */}
              <div className="w-64 bg-slate-50 dark:bg-slate-800/60 border-l border-slate-200 dark:border-slate-800 p-4 space-y-4 overflow-y-auto text-xs shrink-0">
                <div className="font-bold text-slate-800 dark:text-slate-200 uppercase text-[10px] tracking-wider">属性面板</div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">模板名称</label>
                    <input type="text" readOnly value={activeReportItem.name} className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">纸张方向</label>
                    <input type="text" readOnly value={activeReportItem.paperSpec} className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">渲染引擎</label>
                    <input type="text" readOnly value={activeReportItem.engine} className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium" />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-500 mb-1">网格对齐 (Grid)</label>
                    <input type="text" defaultValue="10px x 10px" className="w-full px-2.5 py-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-medium" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. 报表打印预览页面/弹窗 (Preview) */}
      {isPreviewReportModalOpen && activeReportItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-4xl h-[90vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">打印预览 - {activeReportItem.name}</h3>
                  <p className="text-[11px] text-slate-400 font-mono">生成时间：2026-11-06 10:25:00 | 规格：{activeReportItem.paperSpec}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onShowMessage('正在发送至默认网络打印机，请稍候...')}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印报表</span>
                </button>
                <button
                  type="button"
                  onClick={() => onShowMessage(`已成功导出 ${activeReportItem.name} 为 PDF/OFD 正式公文归档文件`)}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出文件</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPreviewReportModalOpen(false)}
                  className="w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Document Paper Body */}
            <div className="flex-1 bg-slate-100 dark:bg-slate-950 p-8 overflow-y-auto flex items-center justify-center">
              <div className="w-[720px] bg-white text-slate-900 shadow-2xl rounded p-10 space-y-6 font-serif">
                <div className="text-center space-y-2 border-b-2 border-slate-900 pb-6">
                  <h1 className="text-xl font-bold tracking-wider text-slate-900">{activeReportItem.name}</h1>
                  <p className="text-xs text-slate-500 font-sans">成都市数字档案馆标准报表中心 · 状态：验签通过</p>
                </div>

                <div className="space-y-4 text-xs font-sans">
                  <div className="flex justify-between text-slate-600 border-b border-slate-200 pb-2">
                    <span>全宗号：0110 (成都市数字档案馆总库)</span>
                    <span>统计年度：2026年度</span>
                  </div>

                  <table className="w-full border-collapse border border-slate-300 text-left">
                    <thead>
                      <tr className="bg-slate-100 text-slate-700">
                        <th className="border border-slate-300 p-2 text-center w-12">序号</th>
                        <th className="border border-slate-300 p-2">档号</th>
                        <th className="border border-slate-300 p-2">档案题名</th>
                        <th className="border border-slate-300 p-2 text-center">密级</th>
                        <th className="border border-slate-300 p-2 text-center">期限</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">1</td>
                        <td className="border border-slate-300 p-2 font-mono text-blue-600">0110-WS-2026-0001</td>
                        <td className="border border-slate-300 p-2">关于成立成都市数字档案馆建设工作领导小组的通知</td>
                        <td className="border border-slate-300 p-2 text-center">机密</td>
                        <td className="border border-slate-300 p-2 text-center">永久</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">2</td>
                        <td className="border border-slate-300 p-2 font-mono text-blue-600">0110-WS-2026-0002</td>
                        <td className="border border-slate-300 p-2">成都市住房和城乡建设局关于印发城市更新重点项目三年行动方案</td>
                        <td className="border border-slate-300 p-2 text-center">秘密</td>
                        <td className="border border-slate-300 p-2 text-center">30年</td>
                      </tr>
                      <tr>
                        <td className="border border-slate-300 p-2 text-center">3</td>
                        <td className="border border-slate-300 p-2 font-mono text-blue-600">0110-WS-2026-0003</td>
                        <td className="border border-slate-300 p-2">成都市财政局关于下达2021年市级重点产业专项资金预算通知</td>
                        <td className="border border-slate-300 p-2 text-center">公开</td>
                        <td className="border border-slate-300 p-2 text-center">10年</td>
                      </tr>
                    </tbody>
                  </table>

                  <div className="pt-8 flex items-center justify-between text-xs text-slate-700">
                    <div>制表单位：成都市数字档案馆综合业务处</div>
                    <div>审核签发：档案馆总编审</div>
                    <div>签发日期：2026-11-06</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. 删除确认弹窗（批量或单条删除） */}
      {(deleteReportConfirm || singleReportToDelete) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">确认删除报表模板？</h3>
                <p className="text-xs text-slate-500">删除后相关套打与导出配置将不可恢复，请谨慎操作。</p>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300">
              {singleReportToDelete ? (
                <span>即将删除报表：<strong className="text-rose-600 font-bold">{singleReportToDelete.name}</strong></span>
              ) : (
                <span>已选中 <strong className="text-rose-600 font-bold">{deleteReportConfirm?.ids.length}</strong> 个报表模板进行批量删除</span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteReportConfirm(null);
                  setSingleReportToDelete(null);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  if (singleReportToDelete) {
                    handleConfirmSingleReportDelete();
                  } else {
                    handleConfirmBatchDeleteReports();
                  }
                }}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Interactive Action Modal (Add / Edit / Detail) */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  {modalMode === 'add' ? <Plus className="w-4 h-4" /> : modalMode === 'edit' ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{modalTitle}</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {modalMode === 'detail' && currentEditItem ? (
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">元数据核心参数</div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                      {Object.entries(currentEditItem).map(([k, v]) => (
                        <div key={k} className="flex flex-col">
                          <span className="text-[10px] text-slate-400 font-mono uppercase">{k}</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{String(v)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300">
                    本记录已通过四性标准校验，并在区块链审计哈希链路上形成防篡改证据。
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">配置代码 / 标识</label>
                      <input
                        type="text"
                        defaultValue={currentEditItem?.code || currentEditItem?.fondsNo || currentEditItem?.fieldName || 'NEW-CONFIG-01'}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">名称 / 题名</label>
                      <input
                        type="text"
                        defaultValue={currentEditItem?.name || currentEditItem?.labelName || '成都市某某单位档案设置项'}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">归属级别 / 门类</label>
                      <select className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden">
                        <option>文书档案 (WS)</option>
                        <option>会计档案 (KJ)</option>
                        <option>基建档案 (JJ)</option>
                        <option>声像档案 (SX)</option>
                        <option>综合设置项</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">启用状态</label>
                      <select className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden">
                        <option>生效中 / 正常启用</option>
                        <option>停用 / 历史归档</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">规则表达式 / 正则校验 / 业务约束</label>
                    <textarea
                      rows={3}
                      defaultValue={currentEditItem?.pattern || currentEditItem?.regex || currentEditItem?.rule || '^[A-Z0-9\\-]+$ ; 严格遵循DA/T 46及GB/T 39784规范'}
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono text-[11px] focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">备注说明</label>
                    <input
                      type="text"
                      defaultValue="近期由安全保密员及系统管理员联合签批核准生效。"
                      className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                关闭
              </button>
              {modalMode !== 'detail' && (
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    onShowMessage(
                      modalMode === 'add'
                        ? `已成功创建新配置项，并广播至系统工作节点！`
                        : `已成功保存修改，国密哈希签名校验通过！`
                    );
                  }}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存配置</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11. 全宗管理专有模态框 (新增全宗节点、4大删除规则校验、归档文件详情/新增/编辑/删除) */}
      {/* ========================================================================= */}

      {/* 11.1 新增全宗节点模态框 */}
      {isAddFondsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">新建全宗节点</h3>
                  <p className="text-[11px] text-slate-500">依据《全宗管理规范》设立新分支机构全宗</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddFondsModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <div className="p-6 space-y-4 text-xs">
              {/* 所属上级全宗 */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500 mr-1">*</span>所属父级全宗节点
                </label>
                <select
                  value={newFondsParentId}
                  onChange={(e) => setNewFondsParentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                >
                  {fondsNodes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.name} ({n.fondsNo})
                    </option>
                  ))}
                </select>
              </div>

              {/* 预设单位快速载入 */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500 mr-1">*</span>单位名称
                </label>
                <input
                  type="text"
                  value={newFondsUnitName}
                  onChange={(e) => {
                    setNewFondsUnitName(e.target.value);
                    if (!newFondsName || newFondsName === newFondsUnitName) {
                      setNewFondsName(e.target.value);
                    }
                  }}
                  placeholder="如：深圳创新基地、杭州数智产业园"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
                <p className="text-[10px] text-slate-400">
                  单位信息需要在资源中心-》统一用户-》单位管理页面配置
                </p>
              </div>

              {/* 单位标识 & 全宗号 */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    <span className="text-rose-500 mr-1">*</span>单位标识
                  </label>
                  <input
                    type="text"
                    value={newFondsUnitCode}
                    onChange={(e) => setNewFondsUnitCode(e.target.value)}
                    placeholder="如 SZ-INNO-2026"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">
                    <span className="text-rose-500 mr-1">*</span>全宗号
                  </label>
                  <input
                    type="text"
                    value={newFondsNo}
                    onChange={(e) => setNewFondsNo(e.target.value)}
                    placeholder="如 SZFGS06"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 全宗名称 */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">
                  <span className="text-rose-500 mr-1">*</span>全宗名称
                </label>
                <input
                  type="text"
                  value={newFondsName}
                  onChange={(e) => setNewFondsName(e.target.value)}
                  placeholder="如：深圳创新基地"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
              </div>

              {/* 备注 */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">备注说明</label>
                <textarea
                  rows={2}
                  value={newFondsRemark}
                  onChange={(e) => setNewFondsRemark(e.target.value)}
                  placeholder="说明该全宗在全生命周期管理系统中的业务归档边界..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:outline-hidden"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddFondsModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white dark:hover:bg-slate-800"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddNewFondsSubmit}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>确认新增全宗</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 11.2 删除全宗 4大规则校验拦截与确认模态框 */}
      {deleteRuleNotice && deleteRuleNotice.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className={`px-6 py-4 flex items-center gap-3 border-b ${
              deleteRuleNotice.canConfirm
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/60'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/60'
            }`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                deleteRuleNotice.canConfirm
                  ? 'bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400'
                  : 'bg-rose-100 dark:bg-rose-900/60 text-rose-600 dark:text-rose-400'
              }`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {deleteRuleNotice.title}
                </h3>
                <p className="text-[11px] text-slate-500">
                  全宗管理说明规则 {deleteRuleNotice.ruleNumber || 0} 自动审计机制
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-xl border border-pink-100 dark:border-pink-950/60 bg-pink-50/50 dark:bg-pink-950/20">
                <div className="text-xs text-pink-700 dark:text-pink-300 font-medium leading-relaxed">
                  {deleteRuleNotice.message}
                </div>
              </div>

              {/* 规则清单温习 */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                <div className="font-semibold text-slate-700 dark:text-slate-300">《全宗管理说明》规范要求：</div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-500 pl-1">
                  <li className={deleteRuleNotice.ruleNumber === 1 ? 'text-pink-600 font-bold' : ''}>1、顶级全宗单位不能被删除</li>
                  <li className={deleteRuleNotice.ruleNumber === 2 ? 'text-pink-600 font-bold' : ''}>2、有子节点的全宗无法删除，需要先删除子节点；</li>
                  <li className={deleteRuleNotice.ruleNumber === 3 ? 'text-pink-600 font-bold' : ''}>3、全宗里有正式档案库文件的也无法被删除，需要先删除档案</li>
                  <li className={deleteRuleNotice.ruleNumber === 4 ? 'text-pink-600 font-bold' : ''}>4、删除后，非档案库文件将一并删除</li>
                </ul>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteRuleNotice(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                {deleteRuleNotice.canConfirm ? '取消' : '我知道了'}
              </button>
              {deleteRuleNotice.canConfirm && (
                <button
                  type="button"
                  onClick={handleConfirmDeleteFonds}
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>确认执行删除</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 11.3 归档文件 详情 / 新增 / 编辑 模态框 */}
      {isArchiveItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold">
                  {archiveItemModalMode === 'detail' ? <Eye className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {archiveItemModalMode === 'detail'
                      ? '档案卷宗详情'
                      : archiveItemModalMode === 'edit'
                      ? '编辑归档文件元数据'
                      : '新增归档文件'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    归属全宗：{currentFondsNode.name} ({currentFondsNode.fondsNo})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsArchiveItemModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-xs">
              {archiveItemModalMode === 'detail' && selectedArchiveItem ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
                    <div className="text-sm font-bold text-slate-900 dark:text-white">
                      {selectedArchiveItem.title}
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 text-slate-600 dark:text-slate-400">
                      <div>
                        <span className="text-slate-400 block text-[10px]">系统档号</span>
                        <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{selectedArchiveItem.archiveCode}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">档案门类</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedArchiveItem.category}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">保管期限</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedArchiveItem.retention}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">密级等级</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedArchiveItem.security}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">卷内件数</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedArchiveItem.pieceCount} 件</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">立卷责任人</span>
                        <span className="font-medium text-slate-800 dark:text-slate-200">{selectedArchiveItem.author}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">归档日期</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{selectedArchiveItem.archiveDate}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px]">当前在库状态</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{selectedArchiveItem.status}</span>
                      </div>
                    </div>
                  </div>

                  {/* 四性检测状态徽章 */}
                  <div className="p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-950/60 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-2">
                    <div className="text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>国标 DA/T 46 四性检测认证凭据</span>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-center text-[10px]">
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-slate-500 block">真实性</span>
                        <strong className="text-emerald-600">SM3合格</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-slate-500 block">完整性</span>
                        <strong className="text-emerald-600">无缺失</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-slate-500 block">可用性</span>
                        <strong className="text-emerald-600">OFD受控</strong>
                      </div>
                      <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-800/60">
                        <span className="text-slate-500 block">安全性</span>
                        <strong className="text-emerald-600">SM4加密</strong>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">
                      <span className="text-rose-500 mr-1">*</span>文件 / 案卷题名
                    </label>
                    <input
                      type="text"
                      value={archiveFormTitle}
                      onChange={(e) => setArchiveFormTitle(e.target.value)}
                      placeholder="如：关于深入推进天府超算中心二期扩容立项批复..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        <span className="text-rose-500 mr-1">*</span>档号
                      </label>
                      <input
                        type="text"
                        value={archiveFormCode}
                        onChange={(e) => setArchiveFormCode(e.target.value)}
                        placeholder="如 SCFGS01-WS-2026-Y-0001"
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">档案门类</label>
                      <select
                        value={archiveFormCategory}
                        onChange={(e) => setArchiveFormCategory(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      >
                        <option>文书档案</option>
                        <option>会计档案</option>
                        <option>基建工程</option>
                        <option>科研档案</option>
                        <option>声像档案</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">保管期限</label>
                      <select
                        value={archiveFormRetention}
                        onChange={(e) => setArchiveFormRetention(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      >
                        <option>永久</option>
                        <option>30年</option>
                        <option>10年</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">密级</label>
                      <select
                        value={archiveFormSecurity}
                        onChange={(e) => setArchiveFormSecurity(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                      >
                        <option>公开</option>
                        <option>内部</option>
                        <option>秘密</option>
                        <option>机密</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-slate-700 dark:text-slate-300">卷内件数</label>
                      <input
                        type="number"
                        min={1}
                        value={archiveFormPieceCount}
                        onChange={(e) => setArchiveFormPieceCount(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">立卷责任人</label>
                    <input
                      type="text"
                      value={archiveFormAuthor}
                      onChange={(e) => setArchiveFormAuthor(e.target.value)}
                      placeholder="如：周明远、张玉婷"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsArchiveItemModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                关闭
              </button>
              {archiveItemModalMode !== 'detail' && (
                <button
                  type="button"
                  onClick={handleSaveArchiveItem}
                  className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存归档文件</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 11.4 移出/删除归档文件确认模态框 */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认移出归档文件？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                您即将从当前全宗【{currentFondsNode.name}】注销档案卷宗：
                <strong className="block text-slate-900 dark:text-white mt-1">
                  {fileToDelete.title} ({fileToDelete.archiveCode})
                </strong>
                移出后该卷宗将解除与当前全宗库的挂接关系。
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteArchiveItem}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认移出</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.5 档案类型管理 - 新建档案类型模态框 */}
      {/* ========================================================================= */}
      {isAddTypeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <FolderTree className="w-4 h-4 text-blue-600" />
                <span>新建档案类型</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTypeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  上级归属节点 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={newTypeParentId}
                  onChange={(e) => setNewTypeParentId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                >
                  <option value="root_type">档案类型根目录（新增顶级门类）</option>
                  {archiveTypeNodes
                    .filter((n) => n.isCategory && n.id !== 'root_type')
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  档案类型名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：科技研发档案、声像多媒体档案"
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  门类唯一代码
                </label>
                <input
                  type="text"
                  placeholder="例如：KJ_ARCHIVE、TECH_PROJ"
                  value={newTypeCode}
                  onChange={(e) => setNewTypeCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  初始管理层级
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {['文件级', '案卷级', '项目级'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setNewTypeLevelTag(lvl)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        newTypeLevelTag === lvl
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddTypeModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddNewArchiveType}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>保存设立</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.6 著录项字段 添加 / 编辑 / 详情 模态框 */}
      {/* ========================================================================= */}
      {isFieldModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                <span>
                  {fieldModalMode === 'add'
                    ? `添加著录字段（${currentTypeNode.name}级）`
                    : fieldModalMode === 'edit'
                    ? `编辑著录字段 - ${fieldFormChineseName}`
                    : `著录字段属性详情 - ${fieldFormChineseName}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsFieldModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    字段名 (fieldCode) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={fieldModalMode !== 'add'}
                    placeholder="例如：docAuthor, dispatchUnit"
                    value={fieldFormCode}
                    onChange={(e) => setFieldFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                  {currentFieldItem?.isSystem && (
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 block">
                      系统预设字段标识不可更改
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    中文名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={fieldModalMode === 'detail'}
                    placeholder="例如：发文拟办人、移交单号"
                    value={fieldFormChineseName}
                    onChange={(e) => setFieldFormChineseName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    字段类型
                  </label>
                  <select
                    disabled={fieldModalMode === 'detail'}
                    value={fieldFormType}
                    onChange={(e) => setFieldFormType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  >
                    <option value="字符型">字符型 (VARCHAR)</option>
                    <option value="整型">整型 (INTEGER)</option>
                    <option value="双精度型">双精度型 (DOUBLE)</option>
                    <option value="枚举型">枚举型 (ENUM/DICTIONARY)</option>
                    <option value="日期型">日期型 (DATE/DATETIME)</option>
                    <option value="长文本型">长文本型 (TEXT/CLOB)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    字段长度 (0为不限/自适应)
                  </label>
                  <input
                    type="number"
                    disabled={fieldModalMode === 'detail'}
                    value={fieldFormLength}
                    onChange={(e) => setFieldFormLength(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* 行为与约束开关组 */}
              <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2.5">
                <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1">
                  显示与约束控制配置
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={fieldModalMode === 'detail'}
                      checked={fieldFormShowInList}
                      onChange={(e) => setFieldFormShowInList(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-700 dark:text-slate-300">列表显示</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={fieldModalMode === 'detail'}
                      checked={fieldFormShowInSearch}
                      onChange={(e) => setFieldFormShowInSearch(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-700 dark:text-slate-300">搜索显示</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={fieldModalMode === 'detail'}
                      checked={fieldFormShowInEntry}
                      onChange={(e) => setFieldFormShowInEntry(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-700 dark:text-slate-300">录入显示</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={fieldModalMode === 'detail'}
                      checked={fieldFormCanEdit}
                      onChange={(e) => setFieldFormCanEdit(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-700 dark:text-slate-300">是否编辑</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={fieldModalMode === 'detail'}
                      checked={fieldFormIsUnique}
                      onChange={(e) => setFieldFormIsUnique(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-0"
                    />
                    <span className="text-slate-700 dark:text-slate-300">是否唯一值</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      disabled={fieldModalMode === 'detail'}
                      checked={fieldFormIsRequired}
                      onChange={(e) => setFieldFormIsRequired(e.target.checked)}
                      className="rounded border-slate-300 text-rose-600 focus:ring-0"
                    />
                    <span className="text-rose-600 font-medium">是否必填</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  备注说明
                </label>
                <textarea
                  rows={2}
                  disabled={fieldModalMode === 'detail'}
                  placeholder="填写该元数据著录项的用途规范或填写指引..."
                  value={fieldFormRemark}
                  onChange={(e) => setFieldFormRemark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsFieldModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                {fieldModalMode === 'detail' ? '关闭' : '取消'}
              </button>
              {fieldModalMode !== 'detail' && (
                <button
                  type="button"
                  onClick={handleSaveFieldSubmit}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存字段配置</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.7 系统字段防删拦截告警弹窗 (注：带* 为系统字段，不能被删除) */}
      {/* ========================================================================= */}
      {systemFieldWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                系统字段受保护，不能被删除！
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                依据档案管理系统安全规范：<br />
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  带【*】标识的字段为核心元数据系统字段
                </span>
                ，为全宗号、档号、年度、分类号等档案检索与排架基石，受到底层数据库只读保护，禁止执行物理删除！
              </p>

              <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                <span className="font-semibold text-amber-800 dark:text-amber-300 block">
                  被拦截的系统字段：
                </span>
                <div className="max-h-24 overflow-y-auto font-mono text-[11px] space-y-0.5">
                  {systemFieldWarning.systemFields.map((field, idx) => (
                    <div key={idx} className="text-rose-600 dark:text-rose-400">
                      • {field}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setSystemFieldWarning(null)}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.8 删除自定义字段二次确认模态框 */}
      {/* ========================================================================= */}
      {deleteFieldsConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认删除所选著录字段？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                您即将从【{currentTypeNode.name}级】删除以下 {deleteFieldsConfirm.names.length} 个自定义著录项：
                <strong className="block text-slate-900 dark:text-white mt-1">
                  {deleteFieldsConfirm.names.join('、')}
                </strong>
                删除后，该层级录入和查询界面将不再显示这些属性。
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteFieldsConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteFields}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.9 单行删除自定义字段二次确认模态框 */}
      {/* ========================================================================= */}
      {singleFieldToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认删除字段【{singleFieldToDelete.chineseName}】？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                字段标识：<code className="font-mono text-blue-600">{singleFieldToDelete.fieldCode}</code><br />
                字段类型：{singleFieldToDelete.fieldType}（长度 {singleFieldToDelete.fieldLength}）<br />
                删除后，该著录项将在当前层级配置中被注销。
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSingleFieldToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.10 保管期限 - 新建版本模态框 */}
      {/* ========================================================================= */}
      {isAddVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>新建保管期限版本</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddVersionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  版本名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：第四版、科研专项扩展版"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  版本代码
                </label>
                <input
                  type="text"
                  placeholder="例如：GB-2026-V4"
                  value={newVersionCode}
                  onChange={(e) => setNewVersionCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newVersionIsDefault}
                    onChange={(e) => setNewVersionIsDefault(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    设为系统全局默认保管期限基准
                  </span>
                </label>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  版本制定依据及适用说明
                </label>
                <textarea
                  rows={3}
                  placeholder="说明该版本引用的国家档案标准规范或适用门类..."
                  value={newVersionDesc}
                  onChange={(e) => setNewVersionDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddVersionModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddNewRetentionVersion}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>确认设立</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.11 保管期限规则 添加 / 编辑 / 详情 模态框 */}
      {/* ========================================================================= */}
      {isRetentionItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>
                  {retentionModalMode === 'add'
                    ? `添加保管期限（${currentRetentionVersion.name}）`
                    : retentionModalMode === 'edit'
                    ? `编辑保管期限 - ${retentionFormName}`
                    : `保管期限规则详情 - ${retentionFormName}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsRetentionItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    保管期限编码 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={retentionModalMode === 'detail'}
                    placeholder="例如：D10、D30、Y"
                    value={retentionFormCode}
                    onChange={(e) => setRetentionFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    保管期限名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={retentionModalMode === 'detail'}
                    placeholder="例如：10年、30年、永久"
                    value={retentionFormName}
                    onChange={(e) => setRetentionFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  保管期限年限（单位：年，永久请输入 9999） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  disabled={retentionModalMode === 'detail'}
                  placeholder="例如：10、30 或 9999"
                  value={retentionFormYears}
                  onChange={(e) => setRetentionFormYears(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  备注说明
                </label>
                <textarea
                  rows={3}
                  disabled={retentionModalMode === 'detail'}
                  placeholder="说明该保管期限的适用文件范围、法规依据或到期处置方式..."
                  value={retentionFormRemark}
                  onChange={(e) => setRetentionFormRemark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRetentionItemModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                {retentionModalMode === 'detail' ? '关闭' : '取消'}
              </button>
              {retentionModalMode !== 'detail' && (
                <button
                  type="button"
                  onClick={handleSaveRetentionSubmit}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存配置</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.12 批量删除保管期限二次确认模态框 */}
      {/* ========================================================================= */}
      {deleteRetentionConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认删除所选保管期限？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                您即将从当前版本【{currentRetentionVersion.name}】删除以下 {deleteRetentionConfirm.names.length} 个保管期限规则：
                <strong className="block text-slate-900 dark:text-white mt-1">
                  {deleteRetentionConfirm.names.join('、')}
                </strong>
                删除后，该期限代码将无法在档案著录时被选取。
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteRetentionConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRetention}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.13 单行删除保管期限二次确认模态框 */}
      {/* ========================================================================= */}
      {singleRetentionToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认删除保管期限【{singleRetentionToDelete.name}】？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                期限编码：<code className="font-mono text-blue-600 font-bold">{singleRetentionToDelete.code}</code><br />
                保管年限：{singleRetentionToDelete.years}年<br />
                适用范围：{singleRetentionToDelete.remark}
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSingleRetentionToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleRetentionDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.14 密级管理 - 新建版本模态框 */}
      {/* ========================================================================= */}
      {isAddSecurityVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>新建密级版本</span>
              </div>
              <button
                type="button"
                onClick={() => setIsAddSecurityVersionModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  版本名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：第四版、涉密军工科研专项版"
                  value={newSecurityVerName}
                  onChange={(e) => setNewSecurityVerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  版本代码
                </label>
                <input
                  type="text"
                  placeholder="例如：SEC-2026-V4"
                  value={newSecurityVerCode}
                  onChange={(e) => setNewSecurityVerCode(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-hidden"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={newSecurityVerIsDefault}
                    onChange={(e) => setNewSecurityVerIsDefault(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-0"
                  />
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    设为系统全局默认密级基准版本
                  </span>
                </label>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  版本制定依据及适用说明
                </label>
                <textarea
                  rows={3}
                  placeholder="说明该密级版本引用的国家保密法规、定密标准及适用涉密机构范围..."
                  value={newSecurityVerDesc}
                  onChange={(e) => setNewSecurityVerDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddSecurityVersionModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddNewSecurityVersion}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>确认设立</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.15 密级配置规则 添加 / 编辑 / 详情 模态框 */}
      {/* ========================================================================= */}
      {isSecurityItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-sm">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>
                  {securityModalMode === 'add'
                    ? `添加密级（${currentSecurityVersion.name}）`
                    : securityModalMode === 'edit'
                    ? `编辑密级配置 - ${securityFormName}`
                    : `密级规则属性详情 - ${securityFormName}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSecurityItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    密级编码 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={securityModalMode === 'detail'}
                    placeholder="例如：3、2、1、0、4"
                    value={securityFormCode}
                    onChange={(e) => setSecurityFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    密级名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={securityModalMode === 'detail'}
                    placeholder="例如：绝密、机密、秘密、内部、公开"
                    value={securityFormName}
                    onChange={(e) => setSecurityFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  保管期限年限（单位：年，公开请输入 0） <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  disabled={securityModalMode === 'detail'}
                  placeholder="例如：3、2、1、10、20、30 或 0"
                  value={securityFormYears}
                  onChange={(e) => setSecurityFormYears(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  备注说明
                </label>
                <textarea
                  rows={3}
                  disabled={securityModalMode === 'detail'}
                  placeholder="说明该密级的定密法规、保密措施要求、授权查阅范围及解密条件..."
                  value={securityFormRemark}
                  onChange={(e) => setSecurityFormRemark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSecurityItemModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                {securityModalMode === 'detail' ? '关闭' : '取消'}
              </button>
              {securityModalMode !== 'detail' && (
                <button
                  type="button"
                  onClick={handleSaveSecuritySubmit}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存配置</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.16 批量删除密级二次确认模态框 */}
      {/* ========================================================================= */}
      {deleteSecurityConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认删除所选密级？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                您即将从当前版本【{currentSecurityVersion.name}】删除以下 {deleteSecurityConfirm.names.length} 个密级配置规则：
                <strong className="block text-slate-900 dark:text-white mt-1">
                  {deleteSecurityConfirm.names.join('、')}
                </strong>
                删除后，相关密级将无法在档案著录、定密和权限矩阵中被选取。
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteSecurityConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteSecurity}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.18 新建专题分类模态框 */}
      {/* ========================================================================= */}
      {isAddTopicCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">新建专题分类节点</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddTopicCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  分类名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：科技成果攻关专题、重大会议专卷、2027年大事记"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    所属上级节点
                  </label>
                  <select
                    value={newCatParentId}
                    onChange={(e) => setNewCatParentId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  >
                    <option value="root">专题列表 (根节点)</option>
                    <option value="dsj">大事记</option>
                    <option value="zdxm">重点项目</option>
                    <option value="jgyg">机构沿革</option>
                    <option value="rwzt">人物专题</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    分类编码
                  </label>
                  <input
                    type="text"
                    placeholder="例如：ZT-KJ"
                    value={newCatCode}
                    onChange={(e) => setNewCatCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  归集范围与分类描述
                </label>
                <textarea
                  rows={3}
                  placeholder="说明该分类所涵盖的归档门类、牵头立卷单位及专题编研要求..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAddTopicCategoryModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleAddNewTopicCategory}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>保存分类</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.19 专题配置规则 添加/编辑/详情模态框 */}
      {/* ========================================================================= */}
      {isTopicItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {topicModalMode === 'add'
                    ? '添加专题配置'
                    : topicModalMode === 'edit'
                    ? `编辑专题 - ${currentTopicItem?.name}`
                    : `专题档案详情 - ${currentTopicItem?.name}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsTopicItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  专题名称 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={topicModalMode === 'detail'}
                  placeholder="例如：2026年度市级重大决策与行政体制改革大事记"
                  value={topicFormName}
                  onChange={(e) => setTopicFormName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    所属分类
                  </label>
                  <select
                    disabled={topicModalMode === 'detail'}
                    value={topicFormCatId}
                    onChange={(e) => setTopicFormCatId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  >
                    {topicCategories.filter((c) => c.id !== 'root').map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    专题编码
                  </label>
                  <input
                    type="text"
                    disabled={topicModalMode === 'detail'}
                    placeholder="例如：ZT-DSJ-2026"
                    value={topicFormCode}
                    onChange={(e) => setTopicFormCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    牵头责任部门
                  </label>
                  <input
                    type="text"
                    disabled={topicModalMode === 'detail'}
                    placeholder="例如：市委办公厅"
                    value={topicFormDept}
                    onChange={(e) => setTopicFormDept(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    密级级别
                  </label>
                  <select
                    disabled={topicModalMode === 'detail'}
                    value={topicFormSec}
                    onChange={(e) => setTopicFormSec(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  >
                    <option value="内部">内部</option>
                    <option value="公开">公开</option>
                    <option value="工作秘密">工作秘密</option>
                    <option value="秘密">秘密</option>
                    <option value="机密">机密</option>
                    <option value="商业秘密">商业秘密</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    归集状态
                  </label>
                  <select
                    disabled={topicModalMode === 'detail'}
                    value={topicFormStatus}
                    onChange={(e) => setTopicFormStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  >
                    <option value="持续归集">持续归集</option>
                    <option value="已汇编成册">已汇编成册</option>
                    <option value="永久典藏">永久典藏</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  关联案卷数（卷）
                </label>
                <input
                  type="number"
                  disabled={topicModalMode === 'detail'}
                  placeholder="例如：18"
                  value={topicFormVolume}
                  onChange={(e) => setTopicFormVolume(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  业务说明与编研纪要
                </label>
                <textarea
                  rows={3}
                  disabled={topicModalMode === 'detail'}
                  placeholder="填写该专题的背景、入选标准、编研成果形式及收录要求..."
                  value={topicFormRemark}
                  onChange={(e) => setTopicFormRemark(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>

              {topicModalMode === 'detail' && currentTopicItem && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-800 dark:text-slate-200">
                    档案汇编与智能归集引擎指标
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-400">
                    <div>建立时间：<span className="font-mono text-slate-800 dark:text-slate-200">{currentTopicItem.createDate}</span></div>
                    <div>分类路径：<span className="text-slate-800 dark:text-slate-200">{currentTopicItem.categoryPath}</span></div>
                    <div>四性检测认证：<span className="text-emerald-600 font-semibold">国密SM3存证合规</span></div>
                    <div>电子文件状态：<span className="text-blue-600 font-semibold">PDF/A-1b 长期归档版</span></div>
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsTopicItemModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                {topicModalMode === 'detail' ? '关闭' : '取消'}
              </button>
              {topicModalMode !== 'detail' && (
                <button
                  type="button"
                  onClick={handleSaveTopicSubmit}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存专题</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.20 批量删除专题二次确认模态框 */}
      {/* ========================================================================= */}
      {deleteTopicConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认批量删除所选专题？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                您即将从系统删除以下 {deleteTopicConfirm.names.length} 个专题定义及关联的智能归集配置：
                <strong className="block text-slate-900 dark:text-white mt-1">
                  {deleteTopicConfirm.names.join('、')}
                </strong>
                删除后，相关专题将不再展示在专题库中。
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteTopicConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTopics}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.21 单行删除专题二次确认模态框 */}
      {/* ========================================================================= */}
      {singleTopicToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认删除专题【{singleTopicToDelete.name}】？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                专题编码：<code className="font-mono text-blue-600 font-bold">{singleTopicToDelete.code}</code><br />
                牵头部门：{singleTopicToDelete.leadDept}（已关联 {singleTopicToDelete.volumeCount} 卷）<br />
                业务说明：{singleTopicToDelete.remark}
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSingleTopicToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmSingleTopicDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.22 著录项规则 添加/编辑/详情模态框 */}
      {/* ========================================================================= */}
      {isRuleItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {ruleModalMode === 'add'
                    ? `为【${currentRuleNode.name}】添加著录项规则`
                    : ruleModalMode === 'edit'
                    ? `编辑著录项规则 - ${currentRuleItem?.fieldItem}`
                    : `著录项规则详情 - ${currentRuleItem?.fieldItem}`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRuleItemModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    著录项名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    disabled={ruleModalMode === 'detail'}
                    placeholder="例如：档号、文号、题名、成文日期"
                    value={ruleFormField}
                    onChange={(e) => setRuleFormField(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    规则启用状态 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    disabled={ruleModalMode === 'detail'}
                    value={ruleFormStatus}
                    onChange={(e) => setRuleFormStatus(e.target.value as '启用' | '禁用')}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden font-medium"
                  >
                    <option value="启用">启用 (默认)</option>
                    <option value="禁用">禁用</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  规则表达式 <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={ruleModalMode === 'detail'}
                  placeholder="例如：[全宗号]-[年度]-[分类号]-[件号]"
                  value={ruleFormExpr}
                  onChange={(e) => setRuleFormExpr(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 font-mono font-bold disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
                <div className="mt-1 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                  <span>常用字段变量：</span>
                  <button type="button" onClick={() => setRuleFormExpr((prev) => prev + '[全宗号]')} className="text-blue-600 hover:underline font-mono">[全宗号]</button>
                  <button type="button" onClick={() => setRuleFormExpr((prev) => prev + '[年度]')} className="text-blue-600 hover:underline font-mono">[年度]</button>
                  <button type="button" onClick={() => setRuleFormExpr((prev) => prev + '[分类号]')} className="text-blue-600 hover:underline font-mono">[分类号]</button>
                  <button type="button" onClick={() => setRuleFormExpr((prev) => prev + '[件号]')} className="text-blue-600 hover:underline font-mono">[件号]</button>
                  <button type="button" onClick={() => setRuleFormExpr((prev) => prev + '[案卷号]')} className="text-blue-600 hover:underline font-mono">[案卷号]</button>
                  <button type="button" onClick={() => setRuleFormExpr((prev) => prev + '[顺序号]')} className="text-blue-600 hover:underline font-mono">[顺序号]</button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  示例生成结果
                </label>
                <input
                  type="text"
                  disabled={ruleModalMode === 'detail'}
                  placeholder="例如：SCFGS01-2026-WS01-0018"
                  value={ruleFormExample}
                  onChange={(e) => setRuleFormExample(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-mono disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  业务说明与规范依据
                </label>
                <textarea
                  rows={3}
                  disabled={ruleModalMode === 'detail'}
                  placeholder="说明该著录项对应国家行业标准、四性检测要求或解析条件..."
                  value={ruleFormDesc}
                  onChange={(e) => setRuleFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 disabled:bg-slate-100 disabled:text-slate-500 focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-lg bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900 text-xs text-pink-700 dark:text-pink-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-pink-600 shrink-0" />
                <span>系统规范：新增的规则默认是启用状态，可在表格操作列随时启停。</span>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsRuleItemModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                {ruleModalMode === 'detail' ? '关闭' : '取消'}
              </button>
              {ruleModalMode !== 'detail' && (
                <button
                  type="button"
                  onClick={handleSaveRuleSubmit}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>保存规则</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.23 批量删除著录项规则确认模态框 */}
      {/* ========================================================================= */}
      {deleteRuleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认批量删除所选著录项规则？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                您即将从当前档案层级【{currentRuleNode.name}】删除以下 {deleteRuleConfirm.names.length} 个著录项规则：
                <strong className="block text-slate-900 dark:text-white mt-1">
                  {deleteRuleConfirm.names.join('、')}
                </strong>
                删除后，归档录入和四性自动生成将不再应用这些拼接规则。
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeleteRuleConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteRules}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.25 默认数据权限：添加/编辑权限项模态框 */}
      {/* ========================================================================= */}
      {(isAddPermRuleModalOpen || isEditPermRuleModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {isEditPermRuleModalOpen ? '编辑权限项规则' : `为【${currentPermType.name}】添加数据权限项`}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsAddPermRuleModalOpen(false);
                  setIsEditPermRuleModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    权限项名称 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：电子全文浏览、打印水印输出"
                    value={permRuleFormName}
                    onChange={(e) => setPermRuleFormName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    知悉范围 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={permRuleFormScope}
                    onChange={(e) => setPermRuleFormScope(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden font-medium"
                  >
                    <option value="在知悉范围内">在知悉范围内</option>
                    <option value="在知悉范围外">在知悉范围外</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    授权策略 <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={permRuleFormPolicy}
                    onChange={(e) => setPermRuleFormPolicy(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden font-semibold"
                  >
                    <option value="默认允许">默认允许 (直接放行)</option>
                    <option value="需审批">需审批 (发起工单)</option>
                    <option value="默认禁止">默认禁止 (阻断访问)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    适用业务模块 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="如：档案检索模块、电子查阅模块"
                    value={permRuleFormModule}
                    onChange={(e) => setPermRuleFormModule(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  受控业务说明 <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="说明该权限无权限时的控制策略、提示语及前置审批条件..."
                  value={permRuleFormDesc}
                  onChange={(e) => setPermRuleFormDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 text-xs text-blue-700 dark:text-blue-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
                <span>保存后将立即写入该门类的行级访问控制（RBAC/ABAC）过滤引擎。</span>
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsAddPermRuleModalOpen(false);
                  setIsEditPermRuleModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => handleSavePermRuleSubmit(isEditPermRuleModalOpen)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>确认保存</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.26 默认数据权限：知悉范围判定标准说明模态框 */}
      {/* ========================================================================= */}
      {isScopeHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  知悉范围判定规则与国家标准指南
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScopeHelpModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs leading-relaxed max-h-[75vh] overflow-y-auto">
              <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                <h4 className="font-bold text-blue-800 dark:text-blue-200 text-xs mb-1.5 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" />
                  一、在知悉范围内（In-Scope）
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  <li><strong>归档业务立卷处室</strong>：文件成文部门、主办处室人员；</li>
                  <li><strong>联合公文发文单位</strong>：联合拟稿、会签或呈报单位中已获授权经办人；</li>
                  <li><strong>工作流指派审批人</strong>：经由协同办公系统流转参与正式签批的干警及领导；</li>
                  <li><strong>专案工作组授权人员</strong>：经保密委与档案局联席备案的专项攻坚专员。</li>
                </ul>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900">
                <h4 className="font-bold text-amber-800 dark:text-amber-200 text-xs mb-1.5 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  二、在知悉范围外（Out-of-Scope）
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                  <li><strong>跨委办局普通人员</strong>：机关内部非主办科室或其他并行业务局室；</li>
                  <li><strong>政务外网借阅申请人</strong>：因政务咨询或科研编研需利用档案的外部读者；</li>
                  <li><strong>受限防护策略</strong>：系统默认仅开放脱敏元数据条目检索，原文浏览与下载一律默认禁止，如需调阅需发起在线借阅审批流。</li>
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                💡 依据《中华人民共和国档案法》及《DA/T 46-2009 文书类电子文件元数据方案》，通过精细化知悉范围判定，确保“按需知悉、受控可溯”。
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsScopeHelpModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.27 默认数据权限：一键同步门类模态框 */}
      {/* ========================================================================= */}
      {isSyncCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Copy className="w-4 h-4 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  一键同步默认权限至其他档案门类
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSyncCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                将当前【<strong>{currentPermType.name}</strong>】设置的默认权限（包括知悉范围内与知悉范围外的查阅、打印、下载、实体借阅配置）批量同步覆写至所选档案门类：
              </p>

              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <span className="font-semibold text-slate-700 dark:text-slate-300">目标档案门类</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSyncTargetCategoryIds(permArchiveTypeList.filter((t) => t.id !== selectedPermTypeId).map((t) => t.id))}
                    className="text-blue-600 hover:underline"
                  >
                    全选
                  </button>
                  <button
                    type="button"
                    onClick={() => setSyncTargetCategoryIds([])}
                    className="text-slate-500 hover:underline"
                  >
                    清空
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {permArchiveTypeList
                  .filter((t) => t.id !== selectedPermTypeId)
                  .map((type) => {
                    const isChecked = syncTargetCategoryIds.includes(type.id);
                    return (
                      <label
                        key={type.id}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center gap-2 transition-all ${
                          isChecked
                            ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-300 text-blue-800 dark:text-blue-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-700 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setSyncTargetCategoryIds((prev) =>
                              prev.includes(type.id) ? prev.filter((id) => id !== type.id) : [...prev, type.id]
                            );
                          }}
                          className="w-3.5 h-3.5 rounded text-blue-600"
                        />
                        <span className="truncate">{type.name}</span>
                      </label>
                    );
                  })}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSyncCategoryModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleExecuteSyncCategories}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Check className="w-3.5 h-3.5" />
                <span>立即同步 ({syncTargetCategoryIds.length})</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.28 默认数据权限：批量删除规则确认模态框 */}
      {/* ========================================================================= */}
      {deletePermRuleConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认批量删除选中的权限项规则？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                您即将从当前门类【{currentPermType.name}】中移除以下 {deletePermRuleConfirm.names.length} 条权限规则：
                <strong className="block text-slate-900 dark:text-white mt-1">
                  {deletePermRuleConfirm.names.join('、')}
                </strong>
                删除后，相关模块将采用系统顶层默认防护策略。
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setDeletePermRuleConfirm(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmBatchDeletePermRules}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 11.29 默认数据权限：单行删除规则确认模态框 */}
      {/* ========================================================================= */}
      {singlePermRuleToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-6 space-y-3.5">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                确认删除权限规则【{singlePermRuleToDelete.name}】？
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                所属门类：{currentPermType.name}<br />
                知悉范围：{singlePermRuleToDelete.scopeType}<br />
                受控业务：{singlePermRuleToDelete.desc}
              </p>
            </div>
            <div className="px-6 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setSinglePermRuleToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmSinglePermRuleDelete}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


