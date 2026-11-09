import React, { useState } from 'react';
import { Bookmark, Search, Trash2, ExternalLink, FileText, CheckSquare, Square, FileCheck, Filter, X, Landmark } from 'lucide-react';
import { Pagination } from '../components/Pagination';

interface MyFavoritesViewProps {
  onShowMessage: (msg: string) => void;
}

interface FavoriteItem {
  id: string;
  status: string;
  fondsNo: string;
  year: string;
  archiveNo: string;
  title: string;
  security: string;
  retention: string;
  docNo: string;
  starTime: string;
  category: string;
  level: string;
  medium: string;
}

const mockFavorites: FavoriteItem[] = [
  { id: 'fav-1', status: '档案馆', fondsNo: '0110', year: '2026', archiveNo: '0110-WS-2026-Y-BGS-0001', title: '关于成立成都市就业工作领导小组的通知', security: '机密', retention: '永久', docNo: '省办公厅[2026]001号', starTime: '2026-11-05 14:20:10', category: '文书档案', level: '文件', medium: '实体、电子' },
  { id: 'fav-2', status: '档案馆', fondsNo: '0110', year: '2026', archiveNo: '0110-WS-2026-Y-BGS-0002', title: '成都市人民政府关于促进数字经济高质量发展的实施意见', security: '秘密', retention: '30年', docNo: '成府发[2026]015号', starTime: '2026-11-04 11:15:30', category: '文书档案', level: '卷盒', medium: '实体、电子' },
  { id: 'fav-3', status: '档案馆', fondsNo: '0110', year: '2026', archiveNo: '0110-WS-2026-Y-BGS-0003', title: '成都市财政局关于下达2026年市级重点产业专项资金预算的通知', security: '秘密', retention: '30年', docNo: '成财预[2026]088号', starTime: '2026-11-04 09:40:00', category: '会计档案', level: '凭证', medium: '电子' },
  { id: 'fav-4', status: '档案馆', fondsNo: '0110', year: '2026', archiveNo: '0110-WS-2026-Y-BGS-0004', title: '成都市住房和城乡建设局关于印发城市更新重点项目三年行动方案的通知', security: '公开', retention: '10年', docNo: '成住建发[2026]204号', starTime: '2026-11-03 16:50:15', category: '基建档案', level: '项目', medium: '实体' },
  { id: 'fav-5', status: '档案馆', fondsNo: '0110', year: '2026', archiveNo: '0110-WS-2026-Y-BGS-0005', title: '关于推进全市老旧小区智慧安防与加装电梯联动机制的指导意见', security: '公开', retention: '10年', docNo: '成办函[2026]312号', starTime: '2026-11-03 14:10:20', category: '文书档案', level: '文件', medium: '实体、电子' },
  { id: 'fav-6', status: '档案馆', fondsNo: '0110', year: '2025', archiveNo: '0110-WS-2025-Y-BGS-0012', title: '成都市交通运输局关于天府国际机场配套高快速路网工程验收纪要', security: '内部', retention: '30年', docNo: '成交运[2025]099号', starTime: '2026-11-02 15:30:00', category: '工程档案', level: '卷', medium: '实体、电子' },
  { id: 'fav-7', status: '档案馆', fondsNo: '0110', year: '2025', archiveNo: '0110-WS-2025-Y-BGS-0018', title: '成都市国资委关于市属国有企业混合所有制改革专项审计报告', security: '机密', retention: '永久', docNo: '成国资审[2025]045号', starTime: '2026-11-02 10:25:40', category: '会计档案', level: '账簿', medium: '电子' },
  { id: 'fav-8', status: '档案馆', fondsNo: '0110', year: '2025', archiveNo: '0110-WS-2025-Y-BGS-0025', title: '成都市规划和自然资源局关于历史文化街区保护规划修编方案', security: '公开', retention: '永久', docNo: '成规自[2025]110号', starTime: '2026-11-01 16:00:00', category: '文书档案', level: '文件', medium: '实体、电子' },
  { id: 'fav-9', status: '档案馆', fondsNo: '0110', year: '2025', archiveNo: '0110-WS-2025-Y-BGS-0033', title: '成都市应急管理局关于切实做好汛期城市排涝应急响应的紧急通知', security: '内部', retention: '30年', docNo: '成应急[2025]078号', starTime: '2026-11-01 09:15:30', category: '文书档案', level: '文件', medium: '电子' },
  { id: 'fav-10', status: '档案馆', fondsNo: '0110', year: '2025', archiveNo: '0110-WS-2025-Y-BGS-0040', title: '成都市科技局关于高密度城市群防灾减灾物联网科研项目立项批复', security: '公开', retention: '10年', docNo: '成科计[2025]022号', starTime: '2026-10-31 17:00:00', category: '科研档案', level: '项目', medium: '实体、电子' },
  { id: 'fav-11', status: '档案馆', fondsNo: '0110', year: '2025', archiveNo: '0110-WS-2025-Y-BGS-0049', title: '成都市人民政府办公厅关于印发政务服务一网通办改革实施方案的通知', security: '公开', retention: '永久', docNo: '成办发[2025]056号', starTime: '2026-10-30 11:20:10', category: '文书档案', level: '文件', medium: '实体、电子' },
];

export const MyFavoritesView: React.FC<MyFavoritesViewProps> = ({ onShowMessage }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(mockFavorites);
  const [searchKey, setSearchKey] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [advancedTitle, setAdvancedTitle] = useState('');
  const [advancedDocNo, setAdvancedDocNo] = useState('');
  const [advancedYear, setAdvancedYear] = useState('');

  // 档案详情弹窗（点击每个项目对应生成页面）
  const [activeArchiveDetail, setActiveArchiveDetail] = useState<FavoriteItem | null>(null);

  // 申请借阅模态框状态
  const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
  const [borrowList, setBorrowList] = useState<FavoriteItem[]>([]);
  const [borrowNo] = useState('DAJY-20261106-001');
  const [borrowUser] = useState('周明远');
  const [borrowDept] = useState('技术研发部');
  const [borrowType, setBorrowType] = useState<'实体档案' | '电子档案'>('实体档案');
  const [borrowDate, setBorrowDate] = useState('2026-11-06');
  const [returnDate, setReturnDate] = useState('2026-12-06');
  const [borrowPurpose, setBorrowPurpose] = useState('');
  const [borrowRemark, setBorrowRemark] = useState('');

  const PAGE_SIZE = 10;

  const filtered = favorites.filter((item) => {
    const matchKey =
      item.title.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.archiveNo.toLowerCase().includes(searchKey.toLowerCase()) ||
      item.docNo.toLowerCase().includes(searchKey.toLowerCase());

    const matchTitle = !advancedTitle || item.title.includes(advancedTitle);
    const matchDocNo = !advancedDocNo || item.docNo.includes(advancedDocNo);
    const matchYear = !advancedYear || item.year === advancedYear;

    return matchKey && matchTitle && matchDocNo && matchYear;
  });

  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSelectAll = () => {
    if (selectedIds.length === paginated.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginated.map((item) => item.id));
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleRemoveSelected = () => {
    if (selectedIds.length === 0) {
      onShowMessage('请先勾选需要移出收藏的档案记录');
      return;
    }
    setFavorites(favorites.filter((item) => !selectedIds.includes(item.id)));
    onShowMessage(`已成功将 ${selectedIds.length} 条记录移出收藏`);
    setSelectedIds([]);
  };

  const handleOpenBorrowModal = () => {
    if (selectedIds.length === 0) {
      onShowMessage('请先勾选需要申请借阅的档案记录');
      return;
    }
    const selectedItems = favorites.filter((item) => selectedIds.includes(item.id));
    setBorrowList(selectedItems);
    setBorrowPurpose('因项目研发与查阅需要申请借阅');
    setBorrowRemark('');
    setIsBorrowModalOpen(true);
  };

  const handleRemoveItemFromBorrow = (id: string) => {
    setBorrowList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSubmitBorrow = () => {
    if (borrowList.length === 0) {
      onShowMessage('申请借阅的档案列表不能为空');
      return;
    }
    if (!borrowPurpose.trim()) {
      onShowMessage('请填写借阅目的');
      return;
    }
    setIsBorrowModalOpen(false);
    onShowMessage(`已成功提交 ${borrowList.length} 条档案的借阅申请（单号：${borrowNo}），请在【我的借阅】中查看审批进度。`);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Action & Search Toolbar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleOpenBorrowModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5"
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>申请借阅</span>
          </button>
          <button
            type="button"
            onClick={handleRemoveSelected}
            className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-rose-600 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-medium transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>移出收藏</span>
          </button>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">题名:</span>
            <input
              type="text"
              placeholder="请输入题名或档号关键词"
              value={searchKey}
              onChange={(e) => {
                setSearchKey(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden w-56 md:w-64"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setCurrentPage(1);
              onShowMessage('已执行快速检索');
            }}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
          >
            检索
          </button>
          <button
            type="button"
            onClick={() => setShowAdvancedSearch(true)}
            className="px-3.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium transition-colors border border-slate-200 dark:border-slate-700 flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>高级检索</span>
          </button>
        </div>
      </div>

      {/* Table Panel (th:nth-of-type(6) 档号 column removed per focus mode) */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="py-3 px-4 text-center w-12">
                  <button type="button" onClick={handleSelectAll} className="inline-flex items-center text-slate-500 hover:text-blue-600">
                    {selectedIds.length > 0 && selectedIds.length === paginated.length ? (
                      <FileCheck className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 text-center w-14">序号</th>
                <th className="py-3 px-4 whitespace-nowrap">档案状态</th>
                <th className="py-3 px-4 whitespace-nowrap">全宗号</th>
                <th className="py-3 px-4 whitespace-nowrap">年度</th>
                <th className="py-3 px-4 min-w-[300px]">题名</th>
                <th className="py-3 px-4 whitespace-nowrap text-center">密级</th>
                <th className="py-3 px-4 whitespace-nowrap">期限</th>
                <th className="py-3 px-4 whitespace-nowrap">文号</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    暂无收藏记录
                  </td>
                </tr>
              ) : (
                paginated.map((row, index) => {
                  const isChecked = selectedIds.includes(row.id);
                  return (
                    <tr
                      key={row.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        isChecked ? 'bg-blue-50/50 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <button type="button" onClick={() => handleSelectOne(row.id)} className="inline-flex items-center text-slate-400 hover:text-blue-600">
                          {isChecked ? <FileCheck className="w-4 h-4 text-blue-600" /> : <Square className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-slate-500">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {row.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {row.fondsNo}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {row.year}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">
                        <button
                          type="button"
                          onClick={() => setActiveArchiveDetail(row)}
                          className="line-clamp-2 hover:text-blue-600 hover:underline transition-colors text-left font-semibold"
                          title="点击查看档号对应的档案详细页面"
                        >
                          {row.title} <span className="text-[11px] font-mono text-blue-600 ml-1">[{row.archiveNo}]</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            row.security === '机密'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : row.security === '秘密'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {row.security}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400 whitespace-nowrap">
                        {row.retention}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {row.docNo}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-mono">
            已选 <span className="font-bold text-blue-600">{selectedIds.length}</span> 项，显示第 {(currentPage - 1) * PAGE_SIZE + 1} -{' '}
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} 条，共{' '}
            <span className="font-bold text-slate-900 dark:text-white">{filtered.length}</span> 条收藏记录
          </div>
          <Pagination
            currentPage={currentPage}
            totalItems={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* 档案详细信息页面/弹窗（点击每个收藏档案生成） */}
      {activeArchiveDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-2xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Landmark className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">收藏档案详细页面 - {activeArchiveDetail.archiveNo}</h3>
              </div>
              <button onClick={() => setActiveArchiveDetail(null)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="text-xs font-mono text-blue-600 font-bold">{activeArchiveDetail.archiveNo}</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">{activeArchiveDetail.title}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block mb-1">档案状态</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeArchiveDetail.status}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">全宗号</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeArchiveDetail.fondsNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">年度</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeArchiveDetail.year}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">档案门类</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeArchiveDetail.category}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">密级</span>
                  <span className="font-semibold text-rose-600">{activeArchiveDetail.security}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">保管期限</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeArchiveDetail.retention}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">文号</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{activeArchiveDetail.docNo}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">收藏时间</span>
                  <span className="font-mono text-slate-800 dark:text-slate-200">{activeArchiveDetail.starTime}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 text-blue-700 dark:text-blue-300">
                该收藏档案已被区块链安全存证，支持在线调阅原文与OFD版式查看。
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveArchiveDetail(null)}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                关闭页面
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 申请借阅弹窗 */}
      {isBorrowModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">申请借阅</h3>
              <button
                type="button"
                onClick={() => setIsBorrowModalOpen(false)}
                className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto text-xs flex-1">
              <div className="space-y-3">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">申请借阅的档案</h4>
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-white dark:bg-slate-900">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-3 text-center w-12">序号</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">档案类型</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">档案级别</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">档案形态</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">年度</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">全宗号</th>
                        <th className="py-2.5 px-3 whitespace-nowrap">档号</th>
                        <th className="py-2.5 px-3 min-w-[240px]">题名</th>
                        <th className="py-2.5 px-3 text-right whitespace-nowrap">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-800 dark:text-slate-200">
                      {borrowList.length === 0 ? (
                        <tr>
                          <td colSpan={9} className="py-8 text-center text-slate-400">
                            暂无待借阅档案，请从收藏列表勾选
                          </td>
                        </tr>
                      ) : (
                        borrowList.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-3 text-center font-mono text-slate-500">{idx + 1}</td>
                            <td className="py-2.5 px-3 whitespace-nowrap">{item.category}</td>
                            <td className="py-2.5 px-3 whitespace-nowrap">{item.level}</td>
                            <td className="py-2.5 px-3 whitespace-nowrap">{item.medium}</td>
                            <td className="py-2.5 px-3 font-mono whitespace-nowrap">{item.year}</td>
                            <td className="py-2.5 px-3 font-mono whitespace-nowrap">{item.fondsNo}</td>
                            <td className="py-2.5 px-3 font-mono text-blue-600 font-semibold whitespace-nowrap">{item.archiveNo}</td>
                            <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white line-clamp-1">{item.title}</td>
                            <td className="py-2.5 px-3 text-right whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() => handleRemoveItemFromBorrow(item.id)}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                移除
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">填写借阅单</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-right font-medium text-slate-600 dark:text-slate-400">借阅单号：</span>
                    <input
                      type="text"
                      readOnly
                      value={borrowNo}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-right font-medium text-slate-600 dark:text-slate-400">借阅人：</span>
                    <input
                      type="text"
                      readOnly
                      value={borrowUser}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-right font-medium text-slate-600 dark:text-slate-400">借阅部门：</span>
                    <input
                      type="text"
                      readOnly
                      value={borrowDept}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-right font-medium text-slate-600 dark:text-slate-400">
                      <span className="text-rose-500 mr-0.5">*</span>借阅类型：
                    </span>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="borrowType"
                          checked={borrowType === '实体档案'}
                          onChange={() => setBorrowType('实体档案')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>实体档案</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="borrowType"
                          checked={borrowType === '电子档案'}
                          onChange={() => setBorrowType('电子档案')}
                          className="text-blue-600 focus:ring-blue-500"
                        />
                        <span>电子档案</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-right font-medium text-slate-600 dark:text-slate-400">
                      <span className="text-rose-500 mr-0.5">*</span>借阅时间：
                    </span>
                    <input
                      type="date"
                      value={borrowDate}
                      onChange={(e) => setBorrowDate(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-20 text-right font-medium text-slate-600 dark:text-slate-400">
                      <span className="text-rose-500 mr-0.5">*</span>归还时间：
                    </span>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1 pt-1">
                  <label className="block font-medium text-slate-600 dark:text-slate-400">
                    <span className="text-rose-500 mr-0.5">*</span>借阅目的：
                  </label>
                  <textarea
                    rows={3}
                    placeholder="请输入借阅目的..."
                    value={borrowPurpose}
                    onChange={(e) => setBorrowPurpose(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-medium text-slate-600 dark:text-slate-400">备注：</label>
                  <textarea
                    rows={2}
                    placeholder="选填"
                    value={borrowRemark}
                    onChange={(e) => setBorrowRemark(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleSubmitBorrow}
                className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                确定
              </button>
              <button
                type="button"
                onClick={() => setIsBorrowModalOpen(false)}
                className="px-6 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-100"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-150">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">高级检索 - 我的收藏</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">档案题名关键字</label>
                <input
                  type="text"
                  placeholder="请输入题名包含的关键词..."
                  value={advancedTitle}
                  onChange={(e) => setAdvancedTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">发文字号</label>
                <input
                  type="text"
                  placeholder="例如：省办公厅[2026]"
                  value={advancedDocNo}
                  onChange={(e) => setAdvancedDocNo(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">所属年度</label>
                <select
                  value={advancedYear}
                  onChange={(e) => setAdvancedYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-hidden"
                >
                  <option value="">全部年度</option>
                  <option value="2026">2026年</option>
                  <option value="2025">2025年</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setAdvancedTitle('');
                  setAdvancedDocNo('');
                  setAdvancedYear('');
                  setShowAdvancedSearch(false);
                }}
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50"
              >
                重置
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentPage(1);
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
