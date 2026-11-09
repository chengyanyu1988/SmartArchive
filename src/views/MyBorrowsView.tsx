import React, { useState } from 'react';
import { BookOpenCheck, Search, Clock, CheckCircle2, RotateCcw, ExternalLink, Filter, FileText, CheckCircle, ShieldAlert, X, Landmark, FileCheck } from 'lucide-react';
import { Pagination } from '../components/Pagination';

interface MyBorrowsViewProps {
  onShowMessage: (msg: string) => void;
}

interface PendingBorrowItem {
  id: string;
  borrowNo: string;
  borrowUser: string;
  borrowType: string;
  borrowDept: string;
  borrowDate: string;
  returnDate: string;
  purpose: string;
  remark: string;
  permission: string;
  archiveTitle: string;
  archiveNo: string;
  status: '待审批';
  fonds: string;
  category: string;
  retention: string;
  security: string;
}

interface HistoryBorrowItem {
  id: string;
  status: '未归还' | '已归还' | '超期';
  borrowNo: string;
  borrowUser: string;
  borrowType: string;
  borrowDept: string;
  borrowDate: string;
  returnDate: string;
  purpose: string;
  remark: string;
  permission: string;
  archiveTitle: string;
  archiveNo: string;
  fonds: string;
  category: string;
  retention: string;
  security: string;
}

const mockPendingBorrows: PendingBorrowItem[] = [
  { id: 'p-1', borrowNo: 'DAJY-20261106-001', borrowUser: '周明远', borrowType: '实体档案', borrowDept: '技术研发部', borrowDate: '2026-11-06', returnDate: '2026-12-06', purpose: '项目参考与课题攻关', remark: '---', permission: '下载、打印', archiveTitle: '关于成立成都市就业工作领导小组的通知', archiveNo: '0110-WS-2021-Y-0001', status: '待审批', fonds: '成都市数字档案馆总库', category: '文书档案', retention: '永久', security: '机密' },
  { id: 'p-2', borrowNo: 'DAJY-20261105-002', borrowUser: '张玉婷', borrowType: '电子档案', borrowDept: '市场营销部', borrowDate: '2026-11-05', returnDate: '2026-12-05', purpose: '竞品分析与数字资产研究', remark: '---', permission: '浏览、下载', archiveTitle: '成都市人民政府关于促进数字经济高质量发展的实施意见', archiveNo: '0110-WS-2021-Y-0002', status: '待审批', fonds: '成都市数字档案馆总库', category: '文书档案', retention: '30年', security: '秘密' },
  { id: 'p-3', borrowNo: 'DAJY-20261104-003', borrowUser: '陈宏博', borrowType: '实体档案', borrowDept: '财务管理部', borrowDate: '2026-11-04', returnDate: '2026-12-04', purpose: '审计核对与决算审计', remark: '---', permission: '浏览', archiveTitle: '成都市财政局关于下达2021年市级重点产业专项资金预算的通知', archiveNo: '0110-KJ-2021-D30-0003', status: '待审批', fonds: '成都市国资委全宗', category: '会计档案', retention: '30年', security: '秘密' },
  { id: 'p-4', borrowNo: 'DAJY-20261103-004', borrowUser: '林思源', borrowType: '电子档案', borrowDept: '人力资源部', borrowDate: '2026-11-03', returnDate: '2026-12-03', purpose: '内部规章制度修订', remark: '---', permission: '---', archiveTitle: '成都市住房和城乡建设局关于印发城市更新重点项目三年行动方案', archiveNo: '0110-WS-2021-Y-0004', status: '待审批', fonds: '成都市住房和城乡建设局全宗', category: '文书档案', retention: '10年', security: '公开' },
  { id: 'p-5', borrowNo: 'DAJY-20261102-005', borrowUser: '郭建平', borrowType: '实体档案', borrowDept: '行政管理部', borrowDate: '2026-11-02', returnDate: '2026-12-02', purpose: '机构资质年审备查', remark: '---', permission: '---', archiveTitle: '关于推进全市老旧小区智慧安防与加装电梯联动机制的指导意见', archiveNo: '0110-WS-2021-Y-0005', status: '待审批', fonds: '成都市住房和城乡建设局全宗', category: '文书档案', retention: '10年', security: '公开' },
  { id: 'p-6', borrowNo: 'DAJY-20261101-006', borrowUser: '郑海荣', borrowType: '电子档案', borrowDept: '工程建设部', borrowDate: '2026-11-01', returnDate: '2026-12-01', purpose: '天府国际机场配套高快速路网工程档案查阅', remark: '加急', permission: '下载、打印', archiveTitle: '成都市交通运输局关于天府国际机场配套高快速路网工程验收纪要', archiveNo: '0110-JJ-2020-Y-0006', status: '待审批', fonds: '成都市交通运输局全宗', category: '基建档案', retention: '永久', security: '内部' },
  { id: 'p-7', borrowNo: 'DAJY-20261030-007', borrowUser: '许秀芳', borrowType: '实体档案', borrowDept: '国资监管处', borrowDate: '2026-10-30', returnDate: '2026-11-30', purpose: '市属国有企业混改专项审计', remark: '---', permission: '浏览', archiveTitle: '成都市国资委关于市属国有企业混合所有制改革专项审计报告', archiveNo: '0110-KJ-2020-D30-0007', status: '待审批', fonds: '成都市国资委全宗', category: '会计档案', retention: '30年', security: '机密' },
  { id: 'p-8', borrowNo: 'DAJY-20261028-008', borrowUser: '黄建国', borrowType: '电子档案', borrowDept: '规划自然资源局', borrowDate: '2026-10-28', returnDate: '2026-11-28', purpose: '历史文化街区保护规划修编', remark: '---', permission: '浏览、下载', archiveTitle: '成都市规划和自然资源局关于历史文化街区保护规划修编方案', archiveNo: '0110-WS-2020-Y-0008', status: '待审批', fonds: '成都市规划和自然资源局全宗', category: '文书档案', retention: '永久', security: '公开' },
  { id: 'p-9', borrowNo: 'DAJY-20261025-009', borrowUser: '李成峰', borrowType: '实体档案', borrowDept: '应急管理局', borrowDate: '2026-10-25', returnDate: '2026-11-25', purpose: '汛期城市排涝应急预案复盘', remark: '---', permission: '---', archiveTitle: '成都市应急管理局关于切实做好汛期城市排涝应急响应的紧急通知', archiveNo: '0110-WS-2020-Y-0009', status: '待审批', fonds: '成都市应急管理局全宗', category: '文书档案', retention: '30年', security: '内部' },
  { id: 'p-10', borrowNo: 'DAJY-20261022-010', borrowUser: '唐梦琪', borrowType: '电子档案', borrowDept: '科技局', borrowDate: '2026-10-22', returnDate: '2026-11-22', purpose: '高密度城市群防灾减灾物联网科研结题', remark: '---', permission: '下载、打印', archiveTitle: '成都市科技局关于高密度城市群防灾减灾物联网科研项目立项批复', archiveNo: '0110-KY-2020-D30-0010', status: '待审批', fonds: '成都市科技局全宗', category: '科研档案', retention: '30年', security: '公开' },
];

const mockHistoryBorrows: HistoryBorrowItem[] = [
  { id: 'h-1', status: '未归还', borrowNo: 'DAJY-20210727-001', borrowUser: '周明远', borrowType: '实体档案', borrowDept: '技术研发部', borrowDate: '2026-10-01', returnDate: '2026-11-01', purpose: '学习参考与标准研读', remark: '---', permission: '下载、打印', archiveTitle: '关于成立成都市就业工作领导小组的通知', archiveNo: '0110-WS-2021-Y-0001', fonds: '成都市数字档案馆总库', category: '文书档案', retention: '永久', security: '机密' },
  { id: 'h-2', status: '已归还', borrowNo: 'DAJY-20210727-002', borrowUser: '张玉婷', borrowType: '电子档案', borrowDept: '市场营销部', borrowDate: '2026-09-15', returnDate: '2026-09-20', purpose: '系统架构调研', remark: '---', permission: '浏览、下载', archiveTitle: '成都市人民政府关于促进数字经济高质量发展的实施意见', archiveNo: '0110-WS-2021-Y-0002', fonds: '成都市数字档案馆总库', category: '文书档案', retention: '30年', security: '秘密' },
  { id: 'h-3', status: '超期', borrowNo: 'DAJY-20210727-003', borrowUser: '陈宏博', borrowType: '电子档案', borrowDept: '财务管理部', borrowDate: '2026-08-10', returnDate: '2026-09-10', purpose: '历史数据对账', remark: '需催缴', permission: '浏览', archiveTitle: '成都市财政局关于下达2021年市级重点产业专项资金预算的通知', archiveNo: '0110-KJ-2021-D30-0003', fonds: '成都市国资委全宗', category: '会计档案', retention: '30年', security: '秘密' },
  { id: 'h-4', status: '未归还', borrowNo: 'DAJY-20210727-004', borrowUser: '林思源', borrowType: '实体档案', borrowDept: '人力资源部', borrowDate: '2026-07-01', returnDate: '2026-08-01', purpose: '项目参考', remark: '---', permission: '---', archiveTitle: '成都市住房和城乡建设局关于印发城市更新重点项目三年行动方案', archiveNo: '0110-WS-2021-Y-0004', fonds: '成都市住房和城乡建设局全宗', category: '文书档案', retention: '10年', security: '公开' },
  { id: 'h-5', status: '已归还', borrowNo: 'DAJY-20210727-005', borrowUser: '郭建平', borrowType: '实体档案', borrowDept: '行政管理部', borrowDate: '2026-06-01', returnDate: '2026-06-15', purpose: '资质年审', remark: '---', permission: '---', archiveTitle: '关于推进全市老旧小区智慧安防与加装电梯联动机制的指导意见', archiveNo: '0110-WS-2021-Y-0005', fonds: '成都市住房和城乡建设局全宗', category: '文书档案', retention: '10年', security: '公开' },
  { id: 'h-6', status: '已归还', borrowNo: 'DAJY-20210727-006', borrowUser: '郑海荣', borrowType: '电子档案', borrowDept: '工程建设部', borrowDate: '2026-05-10', returnDate: '2026-05-20', purpose: '工程图纸比对', remark: '---', permission: '下载、打印', archiveTitle: '成都市交通运输局关于天府国际机场配套高快速路网工程验收纪要', archiveNo: '0110-JJ-2020-Y-0006', fonds: '成都市交通运输局全宗', category: '基建档案', retention: '永久', security: '内部' },
];

export const MyBorrowsView: React.FC<MyBorrowsViewProps> = ({ onShowMessage }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'history'>('pending');
  const [searchKey, setSearchKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  // Modals state
  const [detailItem, setDetailItem] = useState<any | null>(null);
  const [progressItem, setProgressItem] = useState<any | null>(null);
  const [archiveDetailItem, setArchiveDetailItem] = useState<any | null>(null);

  const PAGE_SIZE = 10;

  // Pending filter
  const filteredPending = mockPendingBorrows.filter((item) =>
    item.borrowNo.toLowerCase().includes(searchKey.toLowerCase()) ||
    item.borrowUser.toLowerCase().includes(searchKey.toLowerCase()) ||
    item.archiveTitle.toLowerCase().includes(searchKey.toLowerCase()) ||
    item.archiveNo.toLowerCase().includes(searchKey.toLowerCase())
  );

  // History filter
  const filteredHistory = mockHistoryBorrows.filter((item) =>
    item.borrowNo.toLowerCase().includes(searchKey.toLowerCase()) ||
    item.borrowUser.toLowerCase().includes(searchKey.toLowerCase()) ||
    item.archiveTitle.toLowerCase().includes(searchKey.toLowerCase()) ||
    item.archiveNo.toLowerCase().includes(searchKey.toLowerCase())
  );

  const currentData = activeTab === 'pending' ? filteredPending : filteredHistory;
  const paginatedData = currentData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedData.length && paginatedData.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedData.map((d: any) => d.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Tabs Header (待审批借阅 / 借阅历史) */}
      <div className="flex items-center border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-5 pt-4 rounded-t-xl shadow-xs">
        <button
          type="button"
          onClick={() => {
            setActiveTab('pending');
            setCurrentPage(1);
            setSelectedIds([]);
            setSearchKey('');
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          待审批借阅 ({mockPendingBorrows.length})
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab('history');
            setCurrentPage(1);
            setSelectedIds([]);
            setSearchKey('');
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
          }`}
        >
          借阅历史 ({mockHistoryBorrows.length})
        </button>
      </div>

      {/* Search Bar Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">借阅单号:</span>
          <input
            type="text"
            placeholder="请输入借阅单号、档号或关键字..."
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden w-64"
          />
          <button
            type="button"
            onClick={() => {
              setCurrentPage(1);
              onShowMessage('已执行检索');
            }}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            检索
          </button>
          <button
            type="button"
            onClick={() => setShowAdvancedSearch(true)}
            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>高级检索</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          当前视图：<span className="font-bold text-slate-900 dark:text-white">{activeTab === 'pending' ? '待审批借阅工单' : '历史借阅归档履历'}</span>
        </div>
      </div>

      {/* Table Panel */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-3 text-center w-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 text-center w-12">序号</th>
                {activeTab === 'history' && <th className="py-3 px-3 text-center whitespace-nowrap">状态</th>}
                <th className="py-3 px-4 whitespace-nowrap">借阅单号</th>
                <th className="py-3 px-3 whitespace-nowrap">借阅人</th>
                <th className="py-3 px-3 whitespace-nowrap">借阅类型</th>
                <th className="py-3 px-4 whitespace-nowrap">借阅部门</th>
                <th className="py-3 px-3 whitespace-nowrap">借阅时间</th>
                <th className="py-3 px-3 whitespace-nowrap">归还时间</th>
                <th className="py-3 px-4 min-w-[160px]">借阅目的</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">备注</th>
                <th className="py-3 px-3 whitespace-nowrap">电子文件权限</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">借阅内容</th>
                <th className="py-3 px-3 text-center whitespace-nowrap">{activeTab === 'pending' ? '审批进度' : '审批结果'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    暂无相关借阅记录
                  </td>
                </tr>
              ) : (
                paginatedData.map((row: any, index: number) => {
                  const isChecked = selectedIds.includes(row.id);
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
                          onChange={() => handleSelectOne(row.id)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-3 text-center font-mono text-slate-500">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      {activeTab === 'history' && (
                        <td className="py-3 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.status === '已归还'
                                ? 'bg-emerald-100 text-emerald-700'
                                : row.status === '未归还'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      )}
                      <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {row.borrowNo}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{row.borrowUser}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {row.borrowType}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">{row.borrowDept}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{row.borrowDate}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{row.returnDate}</td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 truncate max-w-[160px]" title={row.purpose}>
                        {row.purpose}
                      </td>
                      <td className="py-3 px-3 text-center text-slate-400">{row.remark}</td>
                      <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{row.permission}</td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setDetailItem(row)}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          查看详情
                        </button>
                      </td>
                      <td className="py-3 px-3 text-center whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setProgressItem(row)}
                          className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          {activeTab === 'pending' ? '查看审批进度' : '查看审批结果'}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination: 10 items per page */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            已选 <span className="font-bold text-blue-600">{selectedIds.length}</span> 项，显示第 {(currentPage - 1) * PAGE_SIZE + 1} -{' '}
            {Math.min(currentPage * PAGE_SIZE, currentData.length)} 条，共{' '}
            <span className="font-bold text-slate-900 dark:text-white">{currentData.length}</span> 条借阅记录
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={currentData.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 1. 档案详细信息弹窗（点击档号触发） */}
      {archiveDetailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">档案元数据详情 档号：{archiveDetailItem.archiveNo}</h3>
              </div>
              <button onClick={() => setArchiveDetailItem(null)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-mono text-blue-600 font-bold">{archiveDetailItem.archiveNo}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{archiveDetailItem.archiveTitle}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-1">所属全宗</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{archiveDetailItem.fonds}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">档案门类分类</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{archiveDetailItem.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">保管期限</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{archiveDetailItem.retention}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">密级标识</span>
                  <span className="font-semibold text-rose-600">{archiveDetailItem.security}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300">
                该电子文件已通过国家档案局“四性”检测，并加盖国密SM3数字时间戳。
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setArchiveDetailItem(null)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
              >
                关闭详情
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 借阅单详情弹窗 (View Detail Modal) */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">借阅单详情凭证 - {detailItem.borrowNo}</h3>
              </div>
              <button onClick={() => setDetailItem(null)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">关联档案信息</div>
                <div className="font-semibold text-slate-900 dark:text-white">{detailItem.archiveTitle}</div>
                <div className="font-mono text-indigo-600">
                  档号：
                  <button
                    type="button"
                    onClick={() => {
                      setDetailItem(null);
                      setArchiveDetailItem(detailItem);
                    }}
                    className="hover:underline font-bold"
                  >
                    {detailItem.archiveNo}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-1">借阅人与部门</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailItem.borrowUser} ({detailItem.borrowDept})</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">借阅目的</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{detailItem.purpose}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">借阅时间</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{detailItem.borrowDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">归还时间</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{detailItem.returnDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                确定关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 审批进度/结果弹窗 */}
      {progressItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {activeTab === 'pending' ? '审批进度详情' : '审批结果归档'} - {progressItem.borrowNo}
                </h3>
              </div>
              <button onClick={() => setProgressItem(null)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs py-2">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">1. 提交借阅申请工单</div>
                    <p className="text-slate-500 text-[11px]">申请人：{progressItem.borrowUser} ({progressItem.borrowDept}) | 时间：{progressItem.borrowDate} 09:30:15</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shrink-0 mt-0.5">✓</div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">2. 部门主管审核（{progressItem.borrowDept}）</div>
                    <p className="text-slate-500 text-[11px]">审核人：周主管 | 意见：同意借阅 | 时间：{progressItem.borrowDate} 11:20:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold shrink-0 mt-0.5 ${activeTab === 'pending' ? 'bg-amber-100 text-amber-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'}`}>
                    {activeTab === 'pending' ? '⏳' : '✓'}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">3. 档案馆馆长审批与授权发布</div>
                    <p className="text-slate-500 text-[11px]">
                      {activeTab === 'pending' ? '当前状态：档案馆保密与业务复核中，预计2小时内完成。' : '审核人：档案馆总编审 | 结果：审批通过并已下发数字水印授权 | 时间：2026-11-06 14:00:00'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setProgressItem(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">高级检索 - 档案借阅工单</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">借阅人姓名</label>
                <input
                  type="text"
                  placeholder="请输入借阅人（如：周明远）..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">借阅部门</label>
                <input
                  type="text"
                  placeholder="例如：技术研发部"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowAdvancedSearch(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdvancedSearch(false);
                  onShowMessage('高级检索条件已应用');
                }}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs"
              >
                确定检索
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
