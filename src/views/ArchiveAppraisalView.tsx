import React, { useState } from 'react';
import {
  Search,
  Printer,
  Download,
  FolderTree,
  Folder,
  File,
  ChevronRight,
  Building2,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  RotateCcw,
  SlidersHorizontal,
  CheckSquare,
  FileText,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

interface ArchiveAppraisalViewProps {
  onSelectRecord: (record: any) => void;
  onShowMessage: (msg: string) => void;
  defaultSubmodule?: 'archive_eval' | 'eval_approve' | 'archive_destroy';
}

// 1. 保管到期列表数据项接口
export interface ExpirationItem {
  id: string;
  status: '待鉴定' | '已延期' | '待销毁';
  archivedDate: string;
  retention: '10年' | '30年' | '永久';
  fondsNo: string;
  year: number;
  refCode: string;
  title: string;
  securityLevel: '公开' | '内部' | '秘密' | '机密';
  folderName: string;
}

// 2. 保管鉴定 / 密级鉴定 数据项接口
export interface AppraisalTaskItem {
  id: string;
  status: '待鉴定' | '审批中' | '已通过' | '被驳回';
  title: string;
  applicant: string;
  applyTime: string;
  folderName: string;
  currentSecurity?: string;
  targetSecurity?: string;
  currentRetention?: string;
  targetRetention?: string;
}

// 初始保管到期列表 (全量真实近期数据 - 30条)
const initialExpirationList: ExpirationItem[] = [
  {
    id: 'exp-01',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-WS·2016-Y-BGS-0001',
    title: '关于成立成都市就业工作领导小组的通知',
    securityLevel: '机密',
    folderName: '文书档案',
  },
  {
    id: 'exp-02',
    status: '待鉴定',
    archivedDate: '2026-11-05',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-WS·2021-Y-BGS-0002',
    title: '成都市住房和城乡建设局2021年建筑工程竣工归档规定',
    securityLevel: '秘密',
    folderName: '文书档案',
  },
  {
    id: 'exp-03',
    status: '待鉴定',
    archivedDate: '2026-11-04',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-WS·2021-Y-BGS-0003',
    title: '2021年重点促进就业与企业扶持政策实施细则通知',
    securityLevel: '秘密',
    folderName: '文书档案',
  },
  {
    id: 'exp-04',
    status: '待鉴定',
    archivedDate: '2026-11-03',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-CW·2021-Y-BGS-0004',
    title: '成都市“十四五”数字政府建设与政务档案规划纲要',
    securityLevel: '内部',
    folderName: '声像档案',
  },
  {
    id: 'exp-05',
    status: '待鉴定',
    archivedDate: '2026-11-02',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-TE·2021-Y-BGS-0005',
    title: '关于下达2021年全域电子会计凭证与电子归档资金预算通知',
    securityLevel: '秘密',
    folderName: '会计档案',
  },
  {
    id: 'exp-06',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-JJ·2016-Y-BGS-0006',
    title: '成都市中心城区地下综合管廊一期立项与施工审查纪要',
    securityLevel: '公开',
    folderName: '基建档案',
  },
  {
    id: 'exp-07',
    status: '待鉴定',
    archivedDate: '2026-11-05',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-SB·2021-Y-BGS-0007',
    title: '成都市智能网联汽车高精度地图数据安全与监控记录',
    securityLevel: '机密',
    folderName: '设备档案',
  },
  {
    id: 'exp-08',
    status: '待鉴定',
    archivedDate: '2026-11-05',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-SL·2016-Y-BGS-0008',
    title: '成都市防汛抗旱指挥部2016年主汛期水利设施巡检汇总表',
    securityLevel: '公开',
    folderName: '设备档案',
  },
  {
    id: 'exp-09',
    status: '待鉴定',
    archivedDate: '2026-11-03',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-GD·2021-Y-BGS-0009',
    title: '2021年重点排污单位碳排放核查与备案电子档案',
    securityLevel: '公开',
    folderName: '声像档案',
  },
  {
    id: 'exp-10',
    status: '待鉴定',
    archivedDate: '2026-11-02',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-ZP·2016-Y-BGS-0010',
    title: '成都市住建系统2016年度建设工程表彰大会合影照片',
    securityLevel: '公开',
    folderName: '照片档案',
  },
  {
    id: 'exp-11',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-SW·2021-Y-BGS-0011',
    title: '成都市住房公积金管理中心全国示范窗口荣誉证书与奖牌清册',
    securityLevel: '公开',
    folderName: '实物档案',
  },
  {
    id: 'exp-12',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-KJ·2016-Y-BGS-0012',
    title: '2016年全市知识产权质押融资登记档案规范化建设文件',
    securityLevel: '公开',
    folderName: '文书档案',
  },
  {
    id: 'exp-13',
    status: '待鉴定',
    archivedDate: '2026-11-05',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-WS·2021-Y-BGS-0013',
    title: '成都市关于优化涉企行政审批流程与归档改革方案',
    securityLevel: '内部',
    folderName: '文书档案',
  },
  {
    id: 'exp-14',
    status: '待鉴定',
    archivedDate: '2026-11-03',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-TE·2016-Y-BGS-0014',
    title: '2016年市级公费医疗与卫生健康资金直达拨款凭证',
    securityLevel: '秘密',
    folderName: '会计档案',
  },
  {
    id: 'exp-15',
    status: '待鉴定',
    archivedDate: '2026-11-02',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-JJ·2021-Y-BGS-0015',
    title: '成都市三环路立交桥提升改造工程设计与审计勘测档案',
    securityLevel: '机密',
    folderName: '基建档案',
  },
  {
    id: 'exp-16',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-SB·2016-Y-BGS-0016',
    title: '成都市市属国家档案馆服务器与机房运维检修卷',
    securityLevel: '内部',
    folderName: '设备档案',
  },
  {
    id: 'exp-17',
    status: '待鉴定',
    archivedDate: '2026-11-05',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-ZP·2021-Y-BGS-0017',
    title: '2021年成都市公园城市建设现场推进会影音记录光盘',
    securityLevel: '公开',
    folderName: '照片档案',
  },
  {
    id: 'exp-18',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-GD·2016-Y-BGS-0018',
    title: '2016年全市环境噪声污染防治重点监察视频数据',
    securityLevel: '公开',
    folderName: '声像档案',
  },
  {
    id: 'exp-19',
    status: '待鉴定',
    archivedDate: '2026-11-04',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-SW·2021-Y-BGS-0019',
    title: '全国政务公开先进集体表彰奖章与归档证书',
    securityLevel: '公开',
    folderName: '实物档案',
  },
  {
    id: 'exp-20',
    status: '待鉴定',
    archivedDate: '2026-11-03',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-WS·2016-Y-BGS-0020',
    title: '关于规范全市机关事务办公用房管理与核查意见',
    securityLevel: '机密',
    folderName: '文书档案',
  },
  {
    id: 'exp-21',
    status: '待鉴定',
    archivedDate: '2026-11-02',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-TE·2021-Y-BGS-021',
    title: '成都市市级机关事业单位养老保险划拨会计凭证',
    securityLevel: '秘密',
    folderName: '会计档案',
  },
  {
    id: 'exp-22',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-JJ·2016-Y-BGS-0022',
    title: '成都市天府新区核心区道路网一期竣工规划档案',
    securityLevel: '秘密',
    folderName: '基建档案',
  },
  {
    id: 'exp-23',
    status: '待鉴定',
    archivedDate: '2026-11-05',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-SB·2021-Y-BGS-0023',
    title: '全市水情灾情自动监测站网络硬件升级维护卷',
    securityLevel: '内部',
    folderName: '设备档案',
  },
  {
    id: 'exp-24',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-ZP·2016-Y-BGS-0024',
    title: '2016年成都市国际马拉松比赛官方声像影像档案',
    securityLevel: '公开',
    folderName: '照片档案',
  },
  {
    id: 'exp-25',
    status: '待鉴定',
    archivedDate: '2026-11-04',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-GD·2021-Y-BGS-0025',
    title: '2021年全市医疗卫生机构数字化电子病历移交卷',
    securityLevel: '秘密',
    folderName: '声像档案',
  },
  {
    id: 'exp-26',
    status: '待鉴定',
    archivedDate: '2026-11-03',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-SW·2016-Y-BGS-0026',
    title: '全国节能减排先进单位实体奖牌清册',
    securityLevel: '公开',
    folderName: '实物档案',
  },
  {
    id: 'exp-27',
    status: '待鉴定',
    archivedDate: '2026-11-02',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-WS·2021-Y-BGS-0027',
    title: '成都市“十四五”人才优先发展战略实施评估报告',
    securityLevel: '公开',
    folderName: '文书档案',
  },
  {
    id: 'exp-28',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-TE·2016-Y-BGS-0028',
    title: '2016年市级基建预备资金拨付凭证卷',
    securityLevel: '秘密',
    folderName: '会计档案',
  },
  {
    id: 'exp-29',
    status: '待鉴定',
    archivedDate: '2026-11-05',
    retention: '30年',
    fondsNo: '0110',
    year: 2021,
    refCode: '0110-JJ·2021-Y-BGS-0029',
    title: '成都市东部新区基础设施一体化建设项目立项卷',
    securityLevel: '机密',
    folderName: '基建档案',
  },
  {
    id: 'exp-30',
    status: '待鉴定',
    archivedDate: '2026-11-01',
    retention: '10年',
    fondsNo: '0110',
    year: 2016,
    refCode: '0110-SB·2016-Y-BGS-0030',
    title: '2016年市图书馆电子图书阅览设备采购及质保档案',
    securityLevel: '公开',
    folderName: '设备档案',
  },
];

// 初始保管鉴定列表 (40条数据，确保每个状态都有10条以上)
const initialRetentionAppraisalList: AppraisalTaskItem[] = [
  // 待鉴定 (12条)
  {
    id: 'ret-01',
    status: '待鉴定',
    title: '关于成立成都市就业工作领导小组的通知',
    applicant: '李博文',
    applyTime: '2026-11-03',
    folderName: '文书档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-02',
    status: '待鉴定',
    title: '成都市中心城区地下综合管廊一期立项与施工审查纪要',
    applicant: '陈明',
    applyTime: '2026-11-04',
    folderName: '基建档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-03',
    status: '待鉴定',
    title: '关于下达2021年全域电子会计凭证与电子归档资金预算通知',
    applicant: '赵强',
    applyTime: '2026-11-04',
    folderName: '会计档案',
    currentRetention: '30年',
    targetRetention: '调整为永久',
  },
  {
    id: 'ret-04',
    status: '待鉴定',
    title: '成都市“十四五”数字政府建设与政务档案规划纲要',
    applicant: '刘洋',
    applyTime: '2026-11-04',
    folderName: '声像档案',
    currentRetention: '10年',
    targetRetention: '延期20年',
  },
  {
    id: 'ret-05',
    status: '待鉴定',
    title: '2016年成都市防汛抗旱水利设施巡检表',
    applicant: '孙浩',
    applyTime: '2026-11-03',
    folderName: '设备档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-06',
    status: '待鉴定',
    title: '2021年成都市公园城市建设现场推进会影音记录光盘',
    applicant: '周丽',
    applyTime: '2026-11-03',
    folderName: '照片档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-07',
    status: '待鉴定',
    title: '成都市住建系统2016年度建设工程表彰合影',
    applicant: '王芳',
    applyTime: '2026-11-02',
    folderName: '照片档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-08',
    status: '待鉴定',
    title: '成都市天府新区核心区道路网一期竣工规划档案',
    applicant: '张伟',
    applyTime: '2026-11-02',
    folderName: '基建档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-09',
    status: '待鉴定',
    title: '2016年全市知识产权质押融资登记档案规范化建设文件',
    applicant: '张建国',
    applyTime: '2026-11-01',
    folderName: '文书档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-10',
    status: '待鉴定',
    title: '成都市市属国家档案馆服务器与机房运维检修卷',
    applicant: '赵强',
    applyTime: '2026-11-01',
    folderName: '设备档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-11',
    status: '待鉴定',
    title: '2016年市级公费医疗与卫生健康资金直达拨款凭证',
    applicant: '陈明',
    applyTime: '2026-11-05',
    folderName: '会计档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-12',
    status: '待鉴定',
    title: '成都市关于规范全市机关事务办公用房管理意见',
    applicant: '刘洋',
    applyTime: '2026-11-02',
    folderName: '文书档案',
    currentRetention: '10年',
    targetRetention: '调整为永久',
  },

  // 审批中 (10条)
  {
    id: 'ret-13',
    status: '审批中',
    title: '成都市住房和城乡建设局2021年工程归档规定',
    applicant: '张伟',
    applyTime: '2026-11-02',
    folderName: '文书档案',
    currentRetention: '30年',
    targetRetention: '调整为永久',
  },
  {
    id: 'ret-14',
    status: '审批中',
    title: '成都市智能网联汽车高精度地图数据安全与监控记录',
    applicant: '周丽',
    applyTime: '2026-11-04',
    folderName: '设备档案',
    currentRetention: '30年',
    targetRetention: '调整为永久',
  },
  {
    id: 'ret-15',
    status: '审批中',
    title: '成都市三环路立交桥提升改造工程设计与审计勘测档案',
    applicant: '李振清',
    applyTime: '2026-11-03',
    folderName: '基建档案',
    currentRetention: '30年',
    targetRetention: '调整为永久',
  },
  {
    id: 'ret-16',
    status: '审批中',
    title: '2021年重点排污单位碳排放核查与备案电子档案',
    applicant: '王芳',
    applyTime: '2026-11-02',
    folderName: '声像档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-17',
    status: '审批中',
    title: '成都市住房公积金管理中心全国示范窗口荣誉证书与奖牌清册',
    applicant: '孙浩',
    applyTime: '2026-11-02',
    folderName: '实物档案',
    currentRetention: '10年',
    targetRetention: '调整为永久',
  },
  {
    id: 'ret-18',
    status: '审批中',
    title: '成都市市级机关事业单位养老保险划拨会计凭证',
    applicant: '赵强',
    applyTime: '2026-11-01',
    folderName: '会计档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-19',
    status: '审批中',
    title: '全市水情灾情自动监测站网络硬件升级维护卷',
    applicant: '陈明',
    applyTime: '2026-11-01',
    folderName: '设备档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-20',
    status: '审批中',
    title: '2021年全市医疗卫生机构数字化电子病历移交卷',
    applicant: '刘洋',
    applyTime: '2026-11-01',
    folderName: '声像档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-21',
    status: '审批中',
    title: '成都市“十四五”人才优先发展战略实施评估报告',
    applicant: '张伟',
    applyTime: '2026-11-04',
    folderName: '文书档案',
    currentRetention: '10年',
    targetRetention: '调整为永久',
  },
  {
    id: 'ret-22',
    status: '审批中',
    title: '成都市东部新区基础设施一体化建设项目立项卷',
    applicant: '孙建明',
    applyTime: '2026-11-01',
    folderName: '基建档案',
    currentRetention: '30年',
    targetRetention: '调整为永久',
  },

  // 已通过 (10条)
  {
    id: 'ret-23',
    status: '已通过',
    title: '2021年重点促进就业与企业扶持政策实施细则通知',
    applicant: '王芳',
    applyTime: '2026-11-01',
    folderName: '文书档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-24',
    status: '已通过',
    title: '成都市防汛抗旱指挥部2016年主汛期水利设施巡检汇总表',
    applicant: '孙浩',
    applyTime: '2026-11-03',
    folderName: '设备档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-25',
    status: '已通过',
    title: '2016年全市环境噪声污染防治重点监察视频数据',
    applicant: '赵强',
    applyTime: '2026-11-03',
    folderName: '声像档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-26',
    status: '已通过',
    title: '2016年成都市国际马拉松比赛官方声像影像档案',
    applicant: '陈明',
    applyTime: '2026-11-02',
    folderName: '照片档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-27',
    status: '已通过',
    title: '全国节能减排先进单位实体奖牌清册',
    applicant: '刘洋',
    applyTime: '2026-11-01',
    folderName: '实物档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-28',
    status: '已通过',
    title: '2016年市级基建预备资金拨付凭证卷',
    applicant: '张伟',
    applyTime: '2026-11-01',
    folderName: '会计档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-29',
    status: '已通过',
    title: '2016年市图书馆电子图书阅览设备采购及质保档案',
    applicant: '赵保平',
    applyTime: '2026-11-05',
    folderName: '设备档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-30',
    status: '已通过',
    title: '成都市关于优化涉企行政审批流程与归档改革方案',
    applicant: '王芳',
    applyTime: '2026-11-03',
    folderName: '文书档案',
    currentRetention: '10年',
    targetRetention: '延期30年',
  },
  {
    id: 'ret-31',
    status: '已通过',
    title: '全国政务公开先进集体表彰奖章与归档证书',
    applicant: '周丽',
    applyTime: '2026-11-05',
    folderName: '实物档案',
    currentRetention: '10年',
    targetRetention: '调整为永久',
  },
  {
    id: 'ret-32',
    status: '已通过',
    title: '成都市轨道交通2021年基建规划用地审核卷',
    applicant: '孙浩',
    applyTime: '2026-11-05',
    folderName: '基建档案',
    currentRetention: '30年',
    targetRetention: '调整为永久',
  },

  // 被驳回 (8条)
  {
    id: 'ret-33',
    status: '被驳回',
    title: '成都市“十四五”数字政府建设与政务档案规划纲要',
    applicant: '刘洋',
    applyTime: '2026-11-05',
    folderName: '声像档案',
    currentRetention: '10年',
    targetRetention: '延期20年',
  },
  {
    id: 'ret-34',
    status: '被驳回',
    title: '关于下达2021年全域电子会计凭证与电子归档资金预算通知',
    applicant: '赵强',
    applyTime: '2026-11-05',
    folderName: '会计档案',
    currentRetention: '30年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-35',
    status: '被驳回',
    title: '2016年成都市重点水利枢纽建设完工纪要',
    applicant: '陈明',
    applyTime: '2026-11-03',
    folderName: '基建档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-36',
    status: '被驳回',
    title: '成都市环境空气质量实时监测网络硬件建设卷',
    applicant: '张伟',
    applyTime: '2026-11-03',
    folderName: '设备档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-37',
    status: '被驳回',
    title: '成都市市属高校2016年毕业生补贴发放名册',
    applicant: '王志强',
    applyTime: '2026-11-02',
    folderName: '文书档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-38',
    status: '被驳回',
    title: '成都市2021年工程质量监管通报视频档案',
    applicant: '王芳',
    applyTime: '2026-11-02',
    folderName: '声像档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-39',
    status: '被驳回',
    title: '全市防汛物资储备与调度会计凭证卷',
    applicant: '周丽',
    applyTime: '2026-11-01',
    folderName: '会计档案',
    currentRetention: '10年',
    targetRetention: '准予销毁',
  },
  {
    id: 'ret-40',
    status: '被驳回',
    title: '成都市历史文化名城保护规划与实物图录',
    applicant: '孙浩',
    applyTime: '2026-11-01',
    folderName: '实物档案',
    currentRetention: '30年',
    targetRetention: '准予销毁',
  },
];

// 初始密级鉴定列表 (40条数据，确保每个状态都有10条以上)
const initialSecurityAppraisalList: AppraisalTaskItem[] = [
  // 待鉴定 (12条)
  {
    id: 'sec-01',
    status: '待鉴定',
    title: '关于成立成都市就业工作领导小组的通知',
    applicant: '李博文',
    applyTime: '2026-11-03',
    folderName: '文书档案',
    currentSecurity: '机密',
    targetSecurity: '降密为秘密',
  },
  {
    id: 'sec-02',
    status: '待鉴定',
    title: '成都市智能网联汽车高精度地图数据安全与监控记录',
    applicant: '陈明',
    applyTime: '2026-11-04',
    folderName: '设备档案',
    currentSecurity: '机密',
    targetSecurity: '降密为内部',
  },
  {
    id: 'sec-03',
    status: '待鉴定',
    title: '成都市三环路立交桥提升改造工程设计与审计勘测档案',
    applicant: '赵强',
    applyTime: '2026-11-04',
    folderName: '基建档案',
    currentSecurity: '机密',
    targetSecurity: '降密为秘密',
  },
  {
    id: 'sec-04',
    status: '待鉴定',
    title: '成都市“十四五”数字政府建设与政务档案规划纲要',
    applicant: '刘洋',
    applyTime: '2026-11-03',
    folderName: '声像档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-05',
    status: '待鉴定',
    title: '关于下达2021年全域电子会计凭证与电子归档资金预算通知',
    applicant: '张伟',
    applyTime: '2026-11-03',
    folderName: '会计档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-06',
    status: '待鉴定',
    title: '成都市天府新区核心区道路网一期竣工规划档案',
    applicant: '王芳',
    applyTime: '2026-11-02',
    folderName: '基建档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-07',
    status: '待鉴定',
    title: '成都市关于规范全市机关事务办公用房管理意见',
    applicant: '周丽',
    applyTime: '2026-11-02',
    folderName: '文书档案',
    currentSecurity: '机密',
    targetSecurity: '降密为秘密',
  },
  {
    id: 'sec-08',
    status: '待鉴定',
    title: '成都市市级机关事业单位养老保险划拨会计凭证',
    applicant: '孙浩',
    applyTime: '2026-11-02',
    folderName: '会计档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-09',
    status: '待鉴定',
    title: '成都市东部新区基础设施一体化建设项目立项卷',
    applicant: '张建国',
    applyTime: '2026-11-01',
    folderName: '基建档案',
    currentSecurity: '机密',
    targetSecurity: '降密为内部',
  },
  {
    id: 'sec-10',
    status: '待鉴定',
    title: '2021年全市医疗卫生机构数字化电子病历移交卷',
    applicant: '陈明',
    applyTime: '2026-11-01',
    folderName: '声像档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-11',
    status: '待鉴定',
    title: '成都市全域土地空间利用与生态保护红线划定决议',
    applicant: '赵强',
    applyTime: '2026-11-05',
    folderName: '文书档案',
    currentSecurity: '机密',
    targetSecurity: '降密为秘密',
  },
  {
    id: 'sec-12',
    status: '待鉴定',
    title: '全市水情灾情自动监测站网络硬件升级维护卷',
    applicant: '刘洋',
    applyTime: '2026-11-02',
    folderName: '设备档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },

  // 审批中 (10条)
  {
    id: 'sec-13',
    status: '审批中',
    title: '成都市住房和城乡建设局2021年工程归档规定',
    applicant: '张伟',
    applyTime: '2026-11-02',
    folderName: '文书档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-14',
    status: '审批中',
    title: '2021年重点促进就业与企业扶持政策实施细则通知',
    applicant: '王芳',
    applyTime: '2026-11-05',
    folderName: '文书档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-15',
    status: '审批中',
    title: '2021年重点排污单位碳排放核查与备案电子档案',
    applicant: '周丽',
    applyTime: '2026-11-04',
    folderName: '声像档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-16',
    status: '审批中',
    title: '成都市住房公积金管理中心全国示范窗口荣誉证书与奖牌清册',
    applicant: '孙浩',
    applyTime: '2026-11-04',
    folderName: '实物档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-17',
    status: '审批中',
    title: '成都市“十四五”人才优先发展战略实施评估报告',
    applicant: '李振清',
    applyTime: '2026-11-03',
    folderName: '文书档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-18',
    status: '审批中',
    title: '成都市关于优化涉企行政审批流程与归档改革方案',
    applicant: '陈明',
    applyTime: '2026-11-03',
    folderName: '文书档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-19',
    status: '审批中',
    title: '全国政务公开先进集体表彰奖章与归档证书',
    applicant: '赵强',
    applyTime: '2026-11-03',
    folderName: '实物档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-20',
    status: '审批中',
    title: '成都市轨道交通2021年基建规划用地审核卷',
    applicant: '刘洋',
    applyTime: '2026-11-02',
    folderName: '基建档案',
    currentSecurity: '机密',
    targetSecurity: '降密为秘密',
  },
  {
    id: 'sec-21',
    status: '审批中',
    title: '成都市中心城区地下综合管廊一期立项与施工审查纪要',
    applicant: '张伟',
    applyTime: '2026-11-02',
    folderName: '基建档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-22',
    status: '审批中',
    title: '成都市防汛抗旱指挥部2016年主汛期水利设施巡检汇总表',
    applicant: '王芳',
    applyTime: '2026-11-01',
    folderName: '设备档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },

  // 已通过 (10条)
  {
    id: 'sec-23',
    status: '已通过',
    title: '2021年重点促进就业与企业扶持政策实施细则通知',
    applicant: '王芳',
    applyTime: '2026-11-01',
    folderName: '文书档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-24',
    status: '已通过',
    title: '2016年成都市重点水利枢纽建设工程完工竣工验收纪要',
    applicant: '周丽',
    applyTime: '2026-11-05',
    folderName: '基建档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-25',
    status: '已通过',
    title: '成都市住建系统2016年度建设工程表彰大会合影照片',
    applicant: '孙浩',
    applyTime: '2026-11-04',
    folderName: '照片档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-26',
    status: '已通过',
    title: '2016年全市知识产权质押融资登记档案规范化建设文件',
    applicant: '孙建明',
    applyTime: '2026-11-04',
    folderName: '文书档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-27',
    status: '已通过',
    title: '2016年市级公费医疗与卫生健康资金直达拨款凭证',
    applicant: '陈明',
    applyTime: '2026-11-03',
    folderName: '会计档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-28',
    status: '已通过',
    title: '成都市市属国家档案馆服务器与机房运维检修卷',
    applicant: '赵强',
    applyTime: '2026-11-02',
    folderName: '设备档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-29',
    status: '已通过',
    title: '2021年成都市公园城市建设现场推进会影音记录光盘',
    applicant: '刘洋',
    applyTime: '2026-11-01',
    folderName: '照片档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-30',
    status: '已通过',
    title: '2016年全市环境噪声污染防治重点监察视频数据',
    applicant: '张伟',
    applyTime: '2026-11-01',
    folderName: '声像档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-31',
    status: '已通过',
    title: '2016年成都市国际马拉松比赛官方声像影像档案',
    applicant: '王芳',
    applyTime: '2026-11-04',
    folderName: '照片档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-32',
    status: '已通过',
    title: '全国节能减排先进单位实体奖牌清册',
    applicant: '周丽',
    applyTime: '2026-11-01',
    folderName: '实物档案',
    currentSecurity: '内部',
    targetSecurity: '解密公开',
  },

  // 被驳回 (8条)
  {
    id: 'sec-33',
    status: '被驳回',
    title: '成都市“十四五”数字政府建设与政务档案规划纲要',
    applicant: '刘洋',
    applyTime: '2026-11-05',
    folderName: '声像档案',
    currentSecurity: '内部',
    targetSecurity: '升密为秘密',
  },
  {
    id: 'sec-34',
    status: '被驳回',
    title: '关于下达2021年全域电子会计凭证与电子归档资金预算通知',
    applicant: '赵强',
    applyTime: '2026-11-05',
    folderName: '会计档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-35',
    status: '被驳回',
    title: '成都市核心地理信息三维立体测绘成果卷',
    applicant: '陈明',
    applyTime: '2026-11-04',
    folderName: '基建档案',
    currentSecurity: '机密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-36',
    status: '被驳回',
    title: '成都市政务云数据中心核心防火墙安全日志卷',
    applicant: '孙浩',
    applyTime: '2026-11-03',
    folderName: '设备档案',
    currentSecurity: '机密',
    targetSecurity: '降密为内部',
  },
  {
    id: 'sec-37',
    status: '被驳回',
    title: '成都市重点保密单位人事编制与薪酬档案',
    applicant: '张伟',
    applyTime: '2026-11-02',
    folderName: '文书档案',
    currentSecurity: '机密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-38',
    status: '被驳回',
    title: '成都市防汛抗旱应急预案机密附件包',
    applicant: '赵保平',
    applyTime: '2026-11-02',
    folderName: '文书档案',
    currentSecurity: '机密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-39',
    status: '被驳回',
    title: '全市重特大自然灾害现场应急指挥影音档案',
    applicant: '王芳',
    applyTime: '2026-11-01',
    folderName: '声像档案',
    currentSecurity: '秘密',
    targetSecurity: '解密公开',
  },
  {
    id: 'sec-40',
    status: '被驳回',
    title: '成都市市属重点国有资产划转批复协议文件',
    applicant: '周丽',
    applyTime: '2026-11-05',
    folderName: '文书档案',
    currentSecurity: '秘密',
  },
];

export const ArchiveAppraisalView: React.FC<ArchiveAppraisalViewProps> = ({
  onSelectRecord,
  onShowMessage,
  defaultSubmodule = 'archive_eval',
}) => {
  // Main Sub-Tab: 'expiration' (保管到期列表) | 'retention' (保管鉴定) | 'security' (密级鉴定)
  const [activeMainTab, setActiveMainTab] = useState<'expiration' | 'retention' | 'security'>(
    defaultSubmodule === 'eval_approve'
      ? 'retention'
      : defaultSubmodule === 'archive_destroy'
      ? 'expiration'
      : 'expiration'
  );

  // Sub-status pill filter for 保管鉴定 & 密级鉴定 ('全量' | '待鉴定' | '审批中' | '已通过' | '被驳回')
  const [taskStatusPill, setTaskStatusPill] = useState<string>('待鉴定');

  // Main Datasets State
  const [expirationList, setExpirationList] = useState<ExpirationItem[]>(initialExpirationList);
  const [retentionTasks, setRetentionTasks] = useState<AppraisalTaskItem[]>(initialRetentionAppraisalList);
  const [securityTasks, setSecurityTasks] = useState<AppraisalTaskItem[]>(initialSecurityAppraisalList);

  // Selected Checkboxes for Expiration List
  const [selectedExpIds, setSelectedExpIds] = useState<string[]>([]);

  // Tree selection state
  const [selectedFolder, setSelectedFolder] = useState<string>('全部目录');
  const [selectedYear, setSelectedYear] = useState<string>('全部年份');

  // Search Input State
  const [titleQuery, setTitleQuery] = useState('');

  // Pagination States
  const [currentExpPage, setCurrentExpPage] = useState(1);
  const [currentRetPage, setCurrentRetPage] = useState(1);
  const [currentSecPage, setCurrentSecPage] = useState(1);
  const PAGE_SIZE = 10;

  // Action Modals State
  const [modalType, setModalType] = useState<
    'extend' | 'destroy' | 'handle_retention' | 'handle_security' | 'advanced_search' | null
  >(null);
  const [activeHandlingTask, setActiveHandlingTask] = useState<AppraisalTaskItem | null>(null);

  // Modal Form Inputs (Start CLEARED)
  const [formExtendYears, setFormExtendYears] = useState('30年');
  const [formReason, setFormReason] = useState('');
  const [formVerifier1, setFormVerifier1] = useState('');
  const [formVerifier2, setFormVerifier2] = useState('');
  const [formConclusion, setFormConclusion] = useState('同意延期');

  // Tree Node Selection Handler ("点击左侧内容，右侧的会跟着切换")
  const handleSelectFolder = (folderName: string, year?: string) => {
    setSelectedFolder(folderName);
    if (year) {
      setSelectedYear(year);
    } else {
      setSelectedYear('全部年份');
    }
    setCurrentExpPage(1);
    setCurrentRetPage(1);
    setCurrentSecPage(1);
    onShowMessage(`已选择目录 [${folderName}${year ? ' - ' + year : ''}]，右侧鉴定列表已更新`);
  };

  const handleResetTree = () => {
    setSelectedFolder('全部目录');
    setSelectedYear('全部年份');
    setTitleQuery('');
    setCurrentExpPage(1);
    setCurrentRetPage(1);
    setCurrentSecPage(1);
    onShowMessage('已重置目录筛选，展示全量待鉴定档案数据');
  };

  // Dynamic Filtering for Tab 1: 保管到期列表
  const filteredExpList = expirationList.filter((item) => {
    const matchesFolder = selectedFolder === '全部目录' || item.folderName === selectedFolder;
    const matchesYear = selectedYear === '全部年份' || item.year.toString() === selectedYear.replace('年', '');
    const matchesTitle = !titleQuery || item.title.toLowerCase().includes(titleQuery.toLowerCase()) || item.refCode.toLowerCase().includes(titleQuery.toLowerCase());
    return matchesFolder && matchesYear && matchesTitle;
  }).sort((a, b) => (b.archivedDate || "").localeCompare(a.archivedDate || ""));

  const paginatedExpList = filteredExpList.slice(
    (currentExpPage - 1) * PAGE_SIZE,
    currentExpPage * PAGE_SIZE
  );

  // Dynamic Filtering for Tab 2: 保管鉴定
  const filteredRetentionList = retentionTasks.filter((item) => {
    const matchesFolder = selectedFolder === '全部目录' || item.folderName === selectedFolder;
    const matchesPill = taskStatusPill === '全量' || item.status === taskStatusPill;
    const matchesTitle = !titleQuery || item.title.toLowerCase().includes(titleQuery.toLowerCase()) || item.applicant.includes(titleQuery);
    return matchesFolder && matchesPill && matchesTitle;
  }).sort((a, b) => (b.applyTime || "").localeCompare(a.applyTime || ""));

  const paginatedRetentionList = filteredRetentionList.slice(
    (currentRetPage - 1) * PAGE_SIZE,
    currentRetPage * PAGE_SIZE
  );

  // Dynamic Filtering for Tab 3: 密级鉴定
  const filteredSecurityList = securityTasks.filter((item) => {
    const matchesFolder = selectedFolder === '全部目录' || item.folderName === selectedFolder;
    const matchesPill = taskStatusPill === '全量' || item.status === taskStatusPill;
    const matchesTitle = !titleQuery || item.title.toLowerCase().includes(titleQuery.toLowerCase()) || item.applicant.includes(titleQuery);
    return matchesFolder && matchesPill && matchesTitle;
  }).sort((a, b) => (b.applyTime || "").localeCompare(a.applyTime || ""));

  const paginatedSecurityList = filteredSecurityList.slice(
    (currentSecPage - 1) * PAGE_SIZE,
    currentSecPage * PAGE_SIZE
  );

  // Open Extend Modal
  const handleOpenExtend = () => {
    setFormExtendYears('30年');
    setFormReason('');
    setModalType('extend');
  };

  // Submit Extend Retention
  const handleConfirmExtend = () => {
    setExpirationList((prev) =>
      prev.map((item) =>
        selectedExpIds.includes(item.id) ? { ...item, status: '已延期' } : item
      )
    );
    setSelectedExpIds([]);
    setModalType(null);
    onShowMessage(`已成功为选中的档案办理鉴定延期（延期至 ${formExtendYears}）`);
  };

  // Open Destroy Modal
  const handleOpenDestroy = () => {
    setFormReason('');
    setFormVerifier1('');
    setFormVerifier2('');
    setModalType('destroy');
  };

  // Submit Destroy Mark
  const handleConfirmDestroy = () => {
    setExpirationList((prev) =>
      prev.map((item) =>
        selectedExpIds.includes(item.id) ? { ...item, status: '待销毁' } : item
      )
    );
    setSelectedExpIds([]);
    setModalType(null);
    onShowMessage(`已提交销毁申请并生成合规审查记录，双人确认锁已加固`);
  };

  // Open Handling Task Modal
  const handleOpenTaskModal = (task: AppraisalTaskItem, type: 'handle_retention' | 'handle_security') => {
    setActiveHandlingTask(task);
    setFormConclusion('同意鉴定结论');
    setFormReason('');
    setModalType(type);
  };

  // Submit Task Handling
  const handleConfirmTaskHandling = () => {
    if (!activeHandlingTask) return;

    if (modalType === 'handle_retention') {
      setRetentionTasks((prev) =>
        prev.map((t) => (t.id === activeHandlingTask.id ? { ...t, status: '已通过' } : t))
      );
      onShowMessage(`档案 [${activeHandlingTask.title}] 保管期鉴定审核已完成并在系统中生效`);
    } else if (modalType === 'handle_security') {
      setSecurityTasks((prev) =>
        prev.map((t) => (t.id === activeHandlingTask.id ? { ...t, status: '已通过' } : t))
      );
      onShowMessage(`档案 [${activeHandlingTask.title}] 划密降密/解密鉴定审核已完成`);
    }

    setModalType(null);
    setActiveHandlingTask(null);
  };

  const hasActiveTreeFilter = selectedFolder !== '全部目录' || selectedYear !== '全部年份';

  return (
    <div className="flex flex-col lg:flex-row gap-5 animate-in fade-in duration-300">
      {/* LEFT SIDEBAR: 档案目录树 */}
      <div className="w-full lg:w-64 space-y-4 shrink-0">
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>档案目录树</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400">0110全宗</span>
          </div>

          <div className="space-y-1 text-xs font-mono">
            {/* Root Org Node */}
            <button
              onClick={() => handleResetTree()}
              className={`w-full flex items-center gap-1.5 text-left py-1.5 px-2 rounded transition-colors ${
                selectedFolder === '全部目录'
                  ? 'bg-purple-600 text-white font-bold'
                  : 'text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Building2 className={`w-4 h-4 ${selectedFolder === '全部目录' ? 'text-white' : 'text-amber-500'}`} />
              <span className="truncate">成都市住房和城乡建设局</span>
            </button>

            {/* Folder Tree Items */}
            <div className="pl-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-800 ml-2 pt-1">
              {[
                { name: '文书档案', years: ['2026年', '2025年', '2021年', '2016年'] },
                { name: '会计档案', years: ['2026年', '2021年'] },
                { name: '基建档案', years: ['2026年', '2021年', '2016年'] },
                { name: '设备档案', years: ['2026年', '2021年', '2016年'] },
                { name: '照片档案', years: ['2025年', '2016年'] },
                { name: '声像档案', years: ['2026年', '2021年'] },
                { name: '实物档案', years: ['2025年', '2021年'] },
              ].map((cat) => {
                const isSelectedFolder = selectedFolder === cat.name;
                return (
                  <div key={cat.name} className="space-y-0.5">
                    <button
                      onClick={() => handleSelectFolder(cat.name)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-left transition-colors ${
                        isSelectedFolder
                          ? 'bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 font-bold border-l-2 border-purple-600'
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
                      <div className="pl-5 space-y-0.5 border-l border-purple-200 dark:border-purple-900 ml-2 py-0.5">
                        {cat.years.map((y) => {
                          const isSelectedYear = selectedYear === y;
                          return (
                            <button
                              key={y}
                              onClick={() => handleSelectFolder(cat.name, y)}
                              className={`w-full flex items-center gap-1.5 py-1 px-2 text-[11px] rounded transition-colors text-left ${
                                isSelectedYear
                                  ? 'bg-purple-600 text-white font-bold'
                                  : 'text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-slate-100'
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
      </div>

      {/* RIGHT WORKSPACE */}
      <div className="flex-1 min-w-0 space-y-4">
        {/* Dynamic Tree Matching Indicator */}
        {hasActiveTreeFilter && (
          <div className="p-3 rounded-xl border border-purple-200 dark:border-purple-900 bg-purple-50/70 dark:bg-purple-950/40 flex items-center justify-between gap-2 text-xs text-purple-900 dark:text-purple-200 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 flex-wrap font-mono">
              <span className="font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                <Folder className="w-3.5 h-3.5" />
                <span>右侧鉴定表动态联动中:</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800 font-semibold">
                {selectedFolder} {selectedYear !== '全部年份' ? `(${selectedYear})` : ''}
              </span>
            </div>

            <button
              onClick={handleResetTree}
              className="px-2.5 py-1 rounded-lg bg-purple-600 text-white text-[11px] font-bold hover:bg-purple-700 transition-colors shrink-0 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>显示全部</span>
            </button>
          </div>
        )}

        {/* Top 3 Main Sub-Tabs Matching Screenshot 1/2/3/4 */}
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 border-b sm:border-b-0 border-slate-200 dark:border-slate-800 pb-2 sm:pb-0">
            <button
              onClick={() => setActiveMainTab('expiration')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMainTab === 'expiration'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              保管到期列表 ({filteredExpList.length})
            </button>
            <button
              onClick={() => setActiveMainTab('retention')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMainTab === 'retention'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              保管鉴定 ({filteredRetentionList.length})
            </button>
            <button
              onClick={() => setActiveMainTab('security')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeMainTab === 'security'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              密级鉴定 ({filteredSecurityList.length})
            </button>
          </div>
        </div>

        {/* TAB 1: 保管到期列表 WORKSPACE */}
        {activeMainTab === 'expiration' && (
          <div className="space-y-4">
            {/* Toolbar Matching Screenshot 1 & 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleOpenExtend}
                  className="px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>鉴定延期</span>
                </button>
                <button
                  onClick={handleOpenDestroy}
                  className="px-3 py-1.5 rounded-lg border border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>鉴定销毁</span>
                </button>
                <button
                  onClick={() => onShowMessage('已开始生成保管到期档案打印报告')}
                  className="px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs transition-colors flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印</span>
                </button>
                <button
                  onClick={() => onShowMessage(`已成功导出选中的 ${selectedExpIds.length} 项到期档案明细`)}
                  className="px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs transition-colors"
                >
                  导出选中
                </button>
                <button
                  onClick={() => onShowMessage('已成功导出全量符合条件的保管到期档案清单')}
                  className="px-3 py-1.5 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-xs transition-colors"
                >
                  导出全部
                </button>
              </div>

              {/* Search Toolbar */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">题名:</span>
                <input
                  type="text"
                  placeholder="搜索档案题名/档号..."
                  value={titleQuery}
                  onChange={(e) => {
                    setTitleQuery(e.target.value);
                    setCurrentExpPage(1);
                  }}
                  className="w-48 sm:w-64 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
                <button
                  onClick={() => onShowMessage('已执行条件检索')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  检索
                </button>
                <button
                  onClick={() => setModalType('advanced_search')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1"
                >
                  高级检索
                </button>
              </div>
            </div>

            {/* Table Matching Screenshot 1 & 2 */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-medium">
                    <th className="py-3 px-3 w-10 text-center whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedExpIds.length === paginatedExpList.length && paginatedExpList.length > 0}
                        onChange={() => {
                          if (selectedExpIds.length === paginatedExpList.length) setSelectedExpIds([]);
                          else setSelectedExpIds(paginatedExpList.map((d) => d.id));
                        }}
                        className="rounded border-slate-300"
                      />
                    </th>
                    <th className="py-3 px-3 w-12 text-center whitespace-nowrap">序号</th>
                    <th className="py-3 px-3 min-w-[84px] text-center whitespace-nowrap">档案状态</th>
                    <th className="py-3 px-3 w-28 whitespace-nowrap">归档日期</th>
                    <th className="py-3 px-3 w-20 whitespace-nowrap">保管期限</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">全宗号</th>
                    <th className="py-3 px-3 w-16 text-center whitespace-nowrap">年度</th>
                    <th className="py-3 px-3 min-w-[180px] whitespace-nowrap">档号</th>
                    <th className="py-3 px-3 min-w-[260px]">题名</th>
                    <th className="py-3 px-3 w-16 whitespace-nowrap">密级</th>
                    <th className="py-3 px-3 min-w-[90px] text-right whitespace-nowrap sticky right-0 bg-slate-50 dark:bg-slate-850">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {paginatedExpList.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="py-12 text-center text-slate-400">
                        暂无符合条件的保管到期档案数据
                      </td>
                    </tr>
                  ) : (
                    paginatedExpList.map((item, index) => {
                      const isSelected = selectedExpIds.includes(item.id);
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
                              onChange={() => {
                                setSelectedExpIds((prev) =>
                                  prev.includes(item.id)
                                    ? prev.filter((i) => i !== item.id)
                                    : [...prev, item.id]
                                );
                              }}
                              className="rounded border-slate-300"
                            />
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-slate-400 whitespace-nowrap">
                            {(currentExpPage - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="py-3 px-3 text-center font-sans whitespace-nowrap">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block whitespace-nowrap ${
                                item.status === '待鉴定'
                                  ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                  : item.status === '已延期'
                                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                  : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                              }`}
                            >
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{item.archivedDate}</td>
                          <td className="py-3 px-3 font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {item.retention}
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
                          <td className="py-3 px-3 font-sans font-semibold text-slate-900 dark:text-slate-100">
                            <button
                              onClick={() => onSelectRecord(item)}
                              className="hover:text-blue-600 dark:hover:text-blue-400 text-left transition-colors"
                            >
                              {item.title}
                            </button>
                          </td>
                          <td className="py-3 px-3 whitespace-nowrap">
                            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                              {item.securityLevel}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right font-sans whitespace-nowrap sticky right-0 bg-white dark:bg-slate-900">
                            <button
                              onClick={() => onSelectRecord(item)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 font-bold text-[11px] underline whitespace-nowrap"
                            >
                              查看详情
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <Pagination
                currentPage={currentExpPage}
                totalItems={filteredExpList.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => setCurrentExpPage(p)}
              />
            </div>
          </div>
        )}

        {/* TAB 2: 保管鉴定 WORKSPACE (Matching Screenshot 3) */}
        {activeMainTab === 'retention' && (
          <div className="space-y-4">
            {/* Status Pills & Search Bar Matching Screenshot 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
              {/* Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: '全量', count: retentionTasks.length },
                  { label: '待鉴定', count: retentionTasks.filter((t) => t.status === '待鉴定').length },
                  { label: '审批中', count: retentionTasks.filter((t) => t.status === '审批中').length },
                  { label: '已通过', count: retentionTasks.filter((t) => t.status === '已通过').length },
                  { label: '被驳回', count: retentionTasks.filter((t) => t.status === '被驳回').length },
                ].map((pill) => {
                  const isActive = taskStatusPill === pill.label;
                  return (
                    <button
                      key={pill.label}
                      onClick={() => setTaskStatusPill(pill.label)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {pill.label} ({pill.count})
                    </button>
                  );
                })}
              </div>

              {/* Search Toolbar */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">题名:</span>
                <input
                  type="text"
                  placeholder="搜索题目/申请人..."
                  value={titleQuery}
                  onChange={(e) => {
                    setTitleQuery(e.target.value);
                    setCurrentRetPage(1);
                  }}
                  className="w-48 sm:w-64 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
                <button
                  onClick={() => onShowMessage('已按条件筛选保管鉴定数据')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  检索
                </button>
                <button
                  onClick={() => setModalType('advanced_search')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1"
                >
                  高级检索
                </button>
              </div>
            </div>

            {/* Table Matching Screenshot 3 */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-medium">
                    <th className="py-3 px-4 w-14 text-center whitespace-nowrap">序号</th>
                    <th className="py-3 px-4 min-w-[90px] text-center whitespace-nowrap">档案状态</th>
                    <th className="py-3 px-4 min-w-[320px]">题名</th>
                    <th className="py-3 px-4 w-28 whitespace-nowrap">申请人</th>
                    <th className="py-3 px-4 w-32 whitespace-nowrap">申请时间</th>
                    <th className="py-3 px-4 w-24 text-right whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {paginatedRetentionList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        暂无保管鉴定审核数据
                      </td>
                    </tr>
                  ) : (
                    paginatedRetentionList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400 whitespace-nowrap">
                          {(currentRetPage - 1) * PAGE_SIZE + idx + 1}
                        </td>
                        <td className="py-3.5 px-4 text-center font-sans whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold inline-block whitespace-nowrap ${
                              item.status === '待鉴定'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                : item.status === '审批中'
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                : item.status === '已通过'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 font-sans text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.applicant}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">{item.applyTime}</td>
                        <td className="py-3.5 px-4 text-right font-sans whitespace-nowrap">
                          {item.status === '待鉴定' ? (
                            <button
                              onClick={() => handleOpenTaskModal(item, 'handle_retention')}
                              className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-xs"
                            >
                              处理
                            </button>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">--</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <Pagination
                currentPage={currentRetPage}
                totalItems={filteredRetentionList.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => setCurrentRetPage(p)}
              />
            </div>
          </div>
        )}

        {/* TAB 3: 密级鉴定 WORKSPACE (Matching Screenshot 4) */}
        {activeMainTab === 'security' && (
          <div className="space-y-4">
            {/* Status Pills & Search Bar Matching Screenshot 4 */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
              {/* Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: '全量', count: securityTasks.length },
                  { label: '待鉴定', count: securityTasks.filter((t) => t.status === '待鉴定').length },
                  { label: '审批中', count: securityTasks.filter((t) => t.status === '审批中').length },
                  { label: '已通过', count: securityTasks.filter((t) => t.status === '已通过').length },
                  { label: '被驳回', count: securityTasks.filter((t) => t.status === '被驳回').length },
                ].map((pill) => {
                  const isActive = taskStatusPill === pill.label;
                  return (
                    <button
                      key={pill.label}
                      onClick={() => setTaskStatusPill(pill.label)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-50 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 border border-blue-300 dark:border-blue-700 shadow-2xs'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                      }`}
                    >
                      {pill.label} ({pill.count})
                    </button>
                  );
                })}
              </div>

              {/* Search Toolbar */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">题名:</span>
                <input
                  type="text"
                  placeholder="搜索题目/申请人..."
                  value={titleQuery}
                  onChange={(e) => {
                    setTitleQuery(e.target.value);
                    setCurrentSecPage(1);
                  }}
                  className="w-48 sm:w-64 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
                <button
                  onClick={() => onShowMessage('已按条件筛选密级鉴定数据')}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors"
                >
                  检索
                </button>
                <button
                  onClick={() => setModalType('advanced_search')}
                  className="text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline ml-1"
                >
                  高级检索
                </button>
              </div>
            </div>

            {/* Table Matching Screenshot 4 (Order: 序号 | 档案状态 | 申请人 | 申请时间 | 题名 | 操作) */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 font-medium">
                    <th className="py-3 px-4 w-14 text-center whitespace-nowrap">序号</th>
                    <th className="py-3 px-4 min-w-[90px] text-center whitespace-nowrap">档案状态</th>
                    <th className="py-3 px-4 w-28 whitespace-nowrap">申请人</th>
                    <th className="py-3 px-4 w-32 whitespace-nowrap">申请时间</th>
                    <th className="py-3 px-4 min-w-[320px]">题名</th>
                    <th className="py-3 px-4 w-24 text-right whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                  {paginatedSecurityList.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        暂无密级鉴定审核数据
                      </td>
                    </tr>
                  ) : (
                    paginatedSecurityList.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-950/30 transition-colors">
                        <td className="py-3.5 px-4 text-center font-bold text-slate-400 whitespace-nowrap">
                          {(currentSecPage - 1) * PAGE_SIZE + idx + 1}
                        </td>
                        <td className="py-3.5 px-4 text-center font-sans whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded text-[11px] font-bold inline-block whitespace-nowrap ${
                              item.status === '待鉴定'
                                ? 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                : item.status === '审批中'
                                ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                : item.status === '已通过'
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                                : 'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {item.applicant}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">{item.applyTime}</td>
                        <td className="py-3.5 px-4 font-sans font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </td>
                        <td className="py-3.5 px-4 text-right font-sans whitespace-nowrap">
                          {item.status === '待鉴定' ? (
                            <button
                              onClick={() => handleOpenTaskModal(item, 'handle_security')}
                              className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-xs"
                            >
                              处理
                            </button>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">--</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
              <Pagination
                currentPage={currentSecPage}
                totalItems={filteredSecurityList.length}
                pageSize={PAGE_SIZE}
                onPageChange={(p) => setCurrentSecPage(p)}
              />
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL DIALOGS FOR APPRAISAL ACTIONS ================= */}

      {/* 1. 鉴定延期弹窗 */}
      {modalType === 'extend' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>办理鉴定延期</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                已选中 <span className="font-bold text-blue-600">{selectedExpIds.length}</span> 项保管到期档案。
              </p>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  延长保管期限:
                </label>
                <select
                  value={formExtendYears}
                  onChange={(e) => setFormExtendYears(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans cursor-pointer"
                >
                  <option value="10年">延长 10年</option>
                  <option value="30年">延长 30年</option>
                  <option value="50年">延长 50年</option>
                  <option value="永久">调整为 永久保管</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  鉴定延期原因及专家审查意见:
                </label>
                <textarea
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="请输入鉴定延期的具体依据与专家组结论..."
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
                onClick={handleConfirmExtend}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
              >
                确认延期
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 鉴定销毁弹窗 */}
      {modalType === 'destroy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>到期档案鉴定销毁申请</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                您正准备对已选中的 <span className="font-bold text-red-600">{selectedExpIds.length}</span> 项档案提交销毁申请。
              </p>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  销毁申请理由与鉴定期满凭证:
                </label>
                <textarea
                  rows={2}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="请输入到期销毁的合规审查依据..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    物理销毁确认人 A:
                  </label>
                  <input
                    type="text"
                    value={formVerifier1}
                    onChange={(e) => setFormVerifier1(e.target.value)}
                    placeholder="例如: 张伟 (档案管理员)"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                    保密审查复核人 B:
                  </label>
                  <input
                    type="text"
                    value={formVerifier2}
                    onChange={(e) => setFormVerifier2(e.target.value)}
                    placeholder="例如: 李振清 (安全保密员)"
                    className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDestroy}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-xs"
              >
                提交销毁签发
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 鉴定任务处理弹窗 (保管鉴定 / 密级鉴定 点击【处理】) */}
      {(modalType === 'handle_retention' || modalType === 'handle_security') && activeHandlingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-blue-600" />
                <span>
                  {modalType === 'handle_retention' ? '保管期限鉴定处理' : '密级划密/降密鉴定处理'}
                </span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                  {activeHandlingTask.title}
                </div>
                <div className="flex justify-between text-slate-500 font-mono text-[11px]">
                  <span>申请人: {activeHandlingTask.applicant}</span>
                  <span>申请时间: {activeHandlingTask.applyTime}</span>
                </div>
                {modalType === 'handle_retention' ? (
                  <div className="text-blue-600 font-semibold font-mono">
                    期望保管变更: {activeHandlingTask.currentRetention} → {activeHandlingTask.targetRetention}
                  </div>
                ) : (
                  <div className="text-indigo-600 font-semibold font-mono">
                    期望密级变更: {activeHandlingTask.currentSecurity} → {activeHandlingTask.targetSecurity}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  鉴定结论签发:
                </label>
                <select
                  value={formConclusion}
                  onChange={(e) => setFormConclusion(e.target.value)}
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans cursor-pointer"
                >
                  <option value="同意鉴定结论">同意鉴定结论（准予签署）</option>
                  <option value="驳回修正">驳回（需补交专家鉴定书）</option>
                  <option value="提请局长办公会讨论">提请局领导办公会议讨论</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  专家小组审查意见与签署依据:
                </label>
                <textarea
                  rows={3}
                  value={formReason}
                  onChange={(e) => setFormReason(e.target.value)}
                  placeholder="请输入审查核验签署的具体意见..."
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={handleConfirmTaskHandling}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 shadow-xs"
              >
                确认签发
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 高级检索弹窗 */}
      {modalType === 'advanced_search' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-blue-600" />
                <span>档案鉴定高级检索</span>
              </h3>
              <button onClick={() => setModalType(null)} className="p-1 rounded text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  全宗号 / 档号:
                </label>
                <input
                  type="text"
                  placeholder="例如: 0110-WS·2021"
                  className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  成文 / 归档年份:
                </label>
                <select className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono cursor-pointer">
                  <option value="">全部分限</option>
                  <option value="2026">2026年</option>
                  <option value="2021">2021年</option>
                  <option value="2016">2016年</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 font-medium mb-1">
                  密级限制:
                </label>
                <select className="w-full p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-sans cursor-pointer">
                  <option value="">全部密级</option>
                  <option value="公开">公开</option>
                  <option value="内部">内部</option>
                  <option value="秘密">秘密</option>
                  <option value="机密">机密</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setModalType(null);
                  onShowMessage('高级检索筛选已成功应用！');
                }}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                开始高级检索
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
