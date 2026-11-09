import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  FileCheck,
  User,
  X,
  AlertCircle,
  Check,
} from 'lucide-react';
import { Pagination } from '../components/Pagination';

export interface PendingApprovalItem {
  id: string;
  status: '鉴定审批中';
  type: '保管鉴定' | '密级鉴定';
  applicant: string;
  result: string;
  reason: string;
  applyTime: string;
}

export interface ApprovalHistoryItem {
  id: string;
  status: '已处理审批';
  type: '保管鉴定' | '密级鉴定';
  applicant: string;
  result: string;
  reason: string;
  applyTime: string;
  approveTime: string;
  approveResult: '同意' | '不同意' | string;
}

interface AppraisalApprovalViewProps {
  onShowMessage: (msg: string) => void;
  onSelectRecord?: (rec: any) => void;
}

// 初始待我审批数据 (共 15 条，日期均限定为2026年11月份)
const initialPendingList: PendingApprovalItem[] = [
  {
    id: 'appr-p-01',
    status: '鉴定审批中',
    type: '保管鉴定',
    applicant: '李博文',
    result: '销毁档案',
    reason: '已满保管期限且经评估属于无价值档案',
    applyTime: '2026-11-05 09:30',
  },
  {
    id: 'appr-p-02',
    status: '鉴定审批中',
    type: '保管鉴定',
    applicant: '张建国',
    result: '还原档案，秘密——>机密，保管期限：10年',
    reason: '属于高价值建设工程勘测核心资料，有长期保留价值',
    applyTime: '2026-11-05 14:20',
  },
  {
    id: 'appr-p-03',
    status: '鉴定审批中',
    type: '密级鉴定',
    applicant: '孙建明',
    result: '秘密——>机密',
    reason: '涉及市级网络安全与高精度测绘核心成果，需升密防护',
    applyTime: '2026-11-05 11:05',
  },
  {
    id: 'appr-p-04',
    status: '鉴定审批中',
    type: '密级鉴定',
    applicant: '陈明',
    result: '秘密——>机密',
    reason: '核心规划文件重新认定具有高度敏感性，申请升密',
    applyTime: '2026-11-04 16:45',
  },
  {
    id: 'appr-p-05',
    status: '鉴定审批中',
    type: '保管鉴定',
    applicant: '周丽',
    result: '保管期限：10年——>30年',
    reason: '十四五重点工程全过程跟踪档案，建议延长保管期限',
    applyTime: '2026-11-04 10:15',
  },
  {
    id: 'appr-p-06',
    status: '鉴定审批中',
    type: '密级鉴定',
    applicant: '赵保平',
    result: '机密——>解密公开',
    reason: '保密期满且内容已全面向社会公示，符合解密条件',
    applyTime: '2026-11-04 15:30',
  },
  {
    id: 'appr-p-07',
    status: '鉴定审批中',
    type: '保管鉴定',
    applicant: '王志强',
    result: '保管期限：30年——>永久',
    reason: '重大行政执法复议定性全宗档案，系永久保存范畴',
    applyTime: '2026-11-04 09:00',
  },
  {
    id: 'appr-p-08',
    status: '鉴定审批中',
    type: '保管鉴定',
    applicant: '刘洋',
    result: '销毁档案',
    reason: '临时办公设备巡检日志档案，过期无继续留存价值',
    applyTime: '2026-11-04 14:10',
  },
  {
    id: 'appr-p-09',
    status: '鉴定审批中',
    type: '密级鉴定',
    applicant: '许华敏',
    result: '机密——>秘密',
    reason: '密级评估会认定安全风险降低，建议降密为秘密',
    applyTime: '2026-11-04 16:00',
  },
  {
    id: 'appr-p-10',
    status: '鉴定审批中',
    type: '保管鉴定',
    applicant: '孙浩',
    result: '保管期限：10年——>30年',
    reason: '水利设施防汛历史台账，系长期应急备查依据',
    applyTime: '2026-11-04 11:25',
  },
  {
    id: 'appr-p-11',
    status: '鉴定审批中',
    type: '密级鉴定',
    applicant: '范建平',
    result: '内部——>解密公开',
    reason: '已纳入政务信息主动公开目录，申请解除内部限定',
    applyTime: '2026-11-03 15:50',
  },
  {
    id: 'appr-p-12',
    status: '鉴定审批中',
    type: '保管鉴定',
    applicant: '郭德成',
    result: '销毁档案',
    reason: '2016年度一般性办公耗材采购发票复印件汇总案卷',
    applyTime: '2026-11-03 08:40',
  },
  {
    id: 'appr-p-13',
    status: '鉴定审批中',
    type: '密级鉴定',
    applicant: '郑新民',
    result: '秘密——>机密',
    reason: '高敏感度规划矢量图数据需要加固安全保障级别',
    applyTime: '2026-11-03 13:20',
  },
  {
    id: 'appr-p-14',
    status: '鉴定审批中',
    type: '保管鉴定',
    applicant: '钱卫国',
    result: '保管期限：10年——>永久',
    reason: '全国示范政务窗口荣誉创建全过程全景记载档册',
    applyTime: '2026-11-03 10:10',
  },
  {
    id: 'appr-p-15',
    status: '鉴定审批中',
    type: '密级鉴定',
    applicant: '李振清',
    result: '机密——>秘密',
    reason: '项目技术交底期满，技术泄露风险可控',
    applyTime: '2026-11-03 16:30',
  },
];

// 初始审批历史数据 (共 15 条，日期均限定为2026年11月份)
const initialHistoryList: ApprovalHistoryItem[] = [
  {
    id: 'appr-h-01',
    status: '已处理审批',
    type: '保管鉴定',
    applicant: '李博文',
    result: '销毁档案',
    reason: '无价值档案',
    applyTime: '2026-11-04 09:00',
    approveTime: '2026-11-05 10:30',
    approveResult: '同意',
  },
  {
    id: 'appr-h-02',
    status: '已处理审批',
    type: '保管鉴定',
    applicant: '张建国',
    result: '还原档案，秘密——>机密，保管期限：10年',
    reason: '有保留价值',
    applyTime: '2026-11-04 14:00',
    approveTime: '2026-11-04 11:15',
    approveResult: '不同意（无价值档案，请按正常流程销毁）',
  },
  {
    id: 'appr-h-03',
    status: '已处理审批',
    type: '密级鉴定',
    applicant: '孙建明',
    result: '秘密——>机密',
    reason: '有保留价值，升密保护',
    applyTime: '2026-11-04 10:20',
    approveTime: '2026-11-04 09:40',
    approveResult: '同意',
  },
  {
    id: 'appr-h-04',
    status: '已处理审批',
    type: '密级鉴定',
    applicant: '陈明',
    result: '秘密——>机密',
    reason: '有保留价值',
    applyTime: '2026-11-04 16:10',
    approveTime: '2026-11-04 14:00',
    approveResult: '同意',
  },
  {
    id: 'appr-h-05',
    status: '已处理审批',
    type: '保管鉴定',
    applicant: '周丽',
    result: '保管期限：10年——>30年',
    reason: '工程重大节点需要长期备查',
    applyTime: '2026-11-04 11:00',
    approveTime: '2026-11-04 09:20',
    approveResult: '同意',
  },
  {
    id: 'appr-h-06',
    status: '已处理审批',
    type: '密级鉴定',
    applicant: '赵保平',
    result: '机密——>解密公开',
    reason: '解密期限届满，自动解密',
    applyTime: '2026-11-03 15:00',
    approveTime: '2026-11-04 10:10',
    approveResult: '同意',
  },
  {
    id: 'appr-h-07',
    status: '已处理审批',
    type: '保管鉴定',
    applicant: '王志强',
    result: '销毁档案',
    reason: '超期无留存价值凭证',
    applyTime: '2026-11-03 09:30',
    approveTime: '2026-11-03 11:45',
    approveResult: '同意',
  },
  {
    id: 'appr-h-08',
    status: '已处理审批',
    type: '密级鉴定',
    applicant: '徐华敏',
    result: '机密——>秘密',
    reason: '经鉴定风险降低，申请降密',
    applyTime: '2026-11-03 14:20',
    approveTime: '2026-11-03 16:00',
    approveResult: '不同意（依据不充分，维持原机密级别）',
  },
  {
    id: 'appr-h-09',
    status: '已处理审批',
    type: '保管鉴定',
    applicant: '孙浩',
    result: '保管期限：30年——>永久',
    reason: '城市核心基础设施建设永久性记载',
    applyTime: '2026-11-03 10:00',
    approveTime: '2026-11-03 09:15',
    approveResult: '同意',
  },
  {
    id: 'appr-h-10',
    status: '已处理审批',
    type: '密级鉴定',
    applicant: '刘洋',
    result: '内部——>解密公开',
    reason: '拟纳入信息主动公开事项',
    applyTime: '2026-11-03 16:30',
    approveTime: '2026-11-03 10:50',
    approveResult: '同意',
  },
  {
    id: 'appr-h-11',
    status: '已处理审批',
    type: '保管鉴定',
    applicant: '范建平',
    result: '销毁档案',
    reason: '不具备归档价值之临时性文字稿件',
    applyTime: '2026-11-02 08:50',
    approveTime: '2026-11-03 11:20',
    approveResult: '同意',
  },
  {
    id: 'appr-h-12',
    status: '已处理审批',
    type: '密级鉴定',
    applicant: '郭德成',
    result: '秘密——>机密',
    reason: '增加防泄漏保护保护等级',
    applyTime: '2026-11-02 13:40',
    approveTime: '2026-11-02 15:10',
    approveResult: '同意',
  },
  {
    id: 'appr-h-13',
    status: '已处理审批',
    type: '保管鉴定',
    applicant: '郑新民',
    result: '保管期限：10年——>30年',
    reason: '生态环境保护跟踪监察档案',
    applyTime: '2026-11-02 11:10',
    approveTime: '2026-11-02 09:30',
    approveResult: '同意',
  },
  {
    id: 'appr-h-14',
    status: '已处理审批',
    type: '密级鉴定',
    applicant: '钱卫国',
    result: '机密——>解密公开',
    reason: '解密审核小组统一审定公开',
    applyTime: '2026-11-02 14:00',
    approveTime: '2026-11-02 16:40',
    approveResult: '同意',
  },
  {
    id: 'appr-h-15',
    status: '已处理审批',
    type: '保管鉴定',
    applicant: '李振清',
    result: '销毁档案',
    reason: '过保修期零配件清单电子影像',
    applyTime: '2026-11-02 10:20',
    approveTime: '2026-11-02 11:00',
    approveResult: '同意',
  },
];

export const AppraisalApprovalView: React.FC<AppraisalApprovalViewProps> = ({
  onShowMessage,
  onSelectRecord,
}) => {
  // Active Tab: 'pending' (待我审批) | 'history' (审批历史)
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');

  // Search Query for Applicant Name
  const [applicantQuery, setApplicantQuery] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  // Main Datasets
  const [pendingList, setPendingList] = useState<PendingApprovalItem[]>(initialPendingList);
  const [historyList, setHistoryList] = useState<ApprovalHistoryItem[]>(initialHistoryList);

  // Pagination
  const [pendingPage, setPendingPage] = useState(1);
  const [historyPage, setHistoryPage] = useState(1);
  const PAGE_SIZE = 10;

  // Processing Modal State
  const [activeItem, setActiveItem] = useState<PendingApprovalItem | null>(null);
  const [approvalDecision, setApprovalDecision] = useState<'agree' | 'reject'>('agree');
  const [approvalComment, setApprovalComment] = useState('');

  // Handle Search Trigger
  const handleSearch = () => {
    setActiveSearchTerm(applicantQuery.trim());
    setPendingPage(1);
    setHistoryPage(1);
    if (applicantQuery.trim()) {
      onShowMessage(`已筛选申请人包含 [${applicantQuery.trim()}] 的鉴定审批记录`);
    } else {
      onShowMessage('已重置申请人筛选条件，显示全量鉴定审批数据');
    }
  };

  const handleResetSearch = () => {
    setApplicantQuery('');
    setActiveSearchTerm('');
    setPendingPage(1);
    setHistoryPage(1);
    onShowMessage('已重置搜索条件');
  };

  // Filtered Lists
  const filteredPendingList = pendingList.filter((item) =>
    !activeSearchTerm || item.applicant.includes(activeSearchTerm)
  ).sort((a, b) => (b.applyTime || "").localeCompare(a.applyTime || ""));

  const paginatedPendingList = filteredPendingList.slice(
    (pendingPage - 1) * PAGE_SIZE,
    pendingPage * PAGE_SIZE
  );

  const filteredHistoryList = historyList.filter((item) =>
    !activeSearchTerm || item.applicant.includes(activeSearchTerm)
  ).sort((a, b) => (b.applyTime || "").localeCompare(a.applyTime || ""));

  const paginatedHistoryList = filteredHistoryList.slice(
    (historyPage - 1) * PAGE_SIZE,
    historyPage * PAGE_SIZE
  );

  // Open Approval Modal
  const handleOpenApprovalModal = (item: PendingApprovalItem) => {
    setActiveItem(item);
    setApprovalDecision('agree');
    setApprovalComment('');
  };

  // Submit Approval
  const handleConfirmApproval = () => {
    if (!activeItem) return;

    // Use October date to stay consistent
    const nowStr = `2026-11-05 17:00`;
    const finalResult =
      approvalDecision === 'agree'
        ? '同意'
        : `不同意 (${approvalComment || '无价值档案，请按正常流程处理'})`;

    // Add to history
    const newHistoryItem: ApprovalHistoryItem = {
      id: `appr-h-${Date.now()}`,
      status: '已处理审批',
      type: activeItem.type,
      applicant: activeItem.applicant,
      result: activeItem.result,
      reason: activeItem.reason,
      applyTime: activeItem.applyTime,
      approveTime: nowStr,
      approveResult: finalResult,
    };

    setHistoryList((prev) => [newHistoryItem, ...prev]);

    // Remove from pending
    setPendingList((prev) => prev.filter((i) => i.id !== activeItem.id));

    // Reset modal
    setActiveItem(null);

    onShowMessage(
      `已完成对 [${activeItem.applicant}] 提交的 [${activeItem.type}] 审核（审批结果：${
        approvalDecision === 'agree' ? '同意' : '驳回'
      }）`
    );
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 dark:bg-slate-900 min-h-screen text-xs">
      {/* Top Header Card - Font scale aligned with other views */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xs border border-slate-200 dark:border-slate-800 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            鉴定审批管理
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            审定档案保管期限变更、解密降密及档案销毁申请，确保档案处理全程留痕与合规性。
          </p>
        </div>

        {/* Search Bar matching screenshot format */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700">
            <span className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap font-medium">
              申请人:
            </span>
            <input
              type="text"
              value={applicantQuery}
              onChange={(e) => setApplicantQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="请输入申请人"
              className="w-36 bg-transparent text-xs text-slate-800 dark:text-slate-200 outline-none placeholder:text-slate-400"
            />
            {applicantQuery && (
              <button
                onClick={handleResetSearch}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={handleSearch}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1 shadow-xs"
          >
            <Search className="w-3.5 h-3.5" />
            检索
          </button>
        </div>
      </div>

      {/* Main Content Area */}
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
              <span>待我审批</span>
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
              <span>审批历史</span>
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

          {activeSearchTerm && (
            <div className="mb-2 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span>检索模式: 申请人 =</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                "{activeSearchTerm}"
              </span>
              <button
                onClick={handleResetSearch}
                className="ml-2 text-slate-400 hover:text-red-500 text-xs underline"
              >
                清除
              </button>
            </div>
          )}
        </div>

        {/* Tab Content 1: 待我审批 */}
        {activeTab === 'pending' && (
          <div className="p-4 space-y-3">
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left border-collapse text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12 whitespace-nowrap">序号</th>
                    <th className="py-2.5 px-3 w-28 whitespace-nowrap">审批状态</th>
                    <th className="py-2.5 px-3 w-28 whitespace-nowrap">鉴定类型</th>
                    <th className="py-2.5 px-3 w-24 whitespace-nowrap">申请人</th>
                    <th className="py-2.5 px-3">鉴定结果</th>
                    <th className="py-2.5 px-3">理由</th>
                    <th className="py-2.5 px-3 text-center w-24 whitespace-nowrap">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 bg-white dark:bg-slate-800">
                  {paginatedPendingList.length > 0 ? (
                    paginatedPendingList.map((item, index) => (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                          {(pendingPage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60">
                            <Clock className="w-3 h-3 animate-pulse" />
                            {item.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                              item.type === '保管鉴定'
                                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                : 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                            }`}
                          >
                            {item.type}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                          {item.applicant}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-100">
                          {item.result}
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                          {item.reason}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleOpenApprovalModal(item)}
                            className="px-2.5 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-medium transition-colors shadow-xs inline-flex items-center gap-1"
                          >
                            处理
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <AlertCircle className="w-6 h-6 text-slate-300" />
                          <span>暂无待处理的鉴定审批记录</span>
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
                  currentPage={pendingPage}
                  totalItems={filteredPendingList.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setPendingPage}
                />
              </div>
            )}
          </div>
        )}

        {/* Tab Content 2: 审批历史 */}
        {activeTab === 'history' && (
          <div className="p-4 space-y-3">
            <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full text-left border-collapse text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 text-center w-12 whitespace-nowrap">序号</th>
                    <th className="py-2.5 px-3 w-24 whitespace-nowrap">审批状态</th>
                    <th className="py-2.5 px-3 w-24 whitespace-nowrap">鉴定类型</th>
                    <th className="py-2.5 px-3 w-20 whitespace-nowrap">申请人</th>
                    <th className="py-2.5 px-3">鉴定结果</th>
                    <th className="py-2.5 px-3">理由</th>
                    <th className="py-2.5 px-3 w-32 whitespace-nowrap">申请时间</th>
                    <th className="py-2.5 px-3 w-32 whitespace-nowrap">审批时间</th>
                    <th className="py-2.5 px-3 w-40 whitespace-nowrap">审批结果</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/80 bg-white dark:bg-slate-800">
                  {paginatedHistoryList.length > 0 ? (
                    paginatedHistoryList.map((item, index) => {
                      const isAgree = item.approveResult.startsWith('同意');
                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-700/50 transition-colors"
                        >
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono">
                            {(historyPage - 1) * PAGE_SIZE + index + 1}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                              <CheckCircle2 className="w-3 h-3 text-slate-500" />
                              {item.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                                item.type === '保管鉴定'
                                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                  : 'bg-purple-50 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                              }`}
                            >
                              {item.type}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">
                            {item.applicant}
                          </td>
                          <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-100">
                            {item.result}
                          </td>
                          <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-xs truncate">
                            {item.reason}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {item.applyTime}
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            {item.approveTime}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                                isAgree
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800/60'
                              }`}
                            >
                              {isAgree ? (
                                <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <XCircle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                              )}
                              {item.approveResult}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        <div className="flex flex-col items-center justify-center gap-1.5">
                          <AlertCircle className="w-6 h-6 text-slate-300" />
                          <span>暂无鉴定审批历史记录</span>
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
                  currentPage={historyPage}
                  totalItems={filteredHistoryList.length}
                  pageSize={PAGE_SIZE}
                  onPageChange={setHistoryPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approval Handling Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-xs">
            {/* Modal Header */}
            <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/80">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-blue-600" />
                办理档案鉴定审批
              </h3>
              <button
                onClick={() => setActiveItem(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 space-y-4">
              {/* Item Overview Card */}
              <div className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-lg border border-slate-200/80 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">单号: {activeItem.id}</span>
                  <span className="px-1.5 py-0.5 rounded text-[11px] font-semibold bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
                    {activeItem.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300 text-[11px]">
                  <div>
                    <span className="text-slate-400">申请人：</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-100">
                      {activeItem.applicant}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">申请时间：</span>
                    <span>{activeItem.applyTime}</span>
                  </div>
                </div>

                <div className="text-[11px]">
                  <span className="text-slate-400">鉴定拟定结果：</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {activeItem.result}
                  </span>
                </div>

                <div className="text-[11px] pt-1 border-t border-slate-200 dark:border-slate-700/60">
                  <span className="text-slate-400">申请理由：</span>
                  <span className="text-slate-700 dark:text-slate-300">{activeItem.reason}</span>
                </div>
              </div>

              {/* Approval Decision Radio */}
              <div className="space-y-1.5">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  审批决定 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setApprovalDecision('agree')}
                    className={`p-2.5 rounded-lg border text-center font-medium transition-all flex items-center justify-center gap-1.5 ${
                      approvalDecision === 'agree'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 ring-1 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    同意通过
                  </button>

                  <button
                    type="button"
                    onClick={() => setApprovalDecision('reject')}
                    className={`p-2.5 rounded-lg border text-center font-medium transition-all flex items-center justify-center gap-1.5 ${
                      approvalDecision === 'reject'
                        ? 'border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 ring-1 ring-rose-500/20'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                    驳回申请
                  </button>
                </div>
              </div>

              {/* Approval Comment */}
              <div className="space-y-1">
                <label className="block font-medium text-slate-700 dark:text-slate-300">
                  审批意见 / 备注说明
                </label>
                <textarea
                  rows={2.5}
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder={
                    approvalDecision === 'agree'
                      ? '请输入审批通过意见（选填，默认同意义见）'
                      : '请输入具体驳回理由（例如：无价值档案，请按正常流程销毁）'
                  }
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 font-medium transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmApproval}
                className={`px-4 py-1.5 rounded-lg text-white font-medium transition-colors shadow-xs ${
                  approvalDecision === 'agree'
                    ? 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                    : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                }`}
              >
                提交审批结果
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
