import React, { useState } from 'react';
import { Search, ShieldAlert, Lock, UserCheck, ShieldCheck, Download, AlertTriangle } from 'lucide-react';
import { SystemAuditRecord } from '../types/archive';
import { mockSystemAuditLogs } from '../data/mockData';
import { Pagination } from '../components/Pagination';

interface SystemAuditViewProps {
  onSelectRecord: (record: SystemAuditRecord) => void;
  onShowMessage: (msg: string) => void;
}

export const SystemAuditView: React.FC<SystemAuditViewProps> = ({
  onSelectRecord,
  onShowMessage,
}) => {
  const [dataList, setDataList] = useState<SystemAuditRecord[]>(mockSystemAuditLogs);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('全部角色');
  const [riskFilter, setRiskFilter] = useState('全部级别');
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 10;

  const filteredData = dataList.filter((item) => {
    const matchesSearch =
      item.logNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.module.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.detail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === '全部角色' || item.roleType === roleFilter;

    const matchesRisk =
      riskFilter === '全部级别' || item.securityLevel === riskFilter;

    return matchesSearch && matchesRole && matchesRisk;
  }).sort((a, b) => (b.operationTime || "").localeCompare(a.operationTime || ""));

  // Sort descending by operationTime
  const sortedData = [...filteredData].sort(
    (a, b) => new Date(b.operationTime).getTime() - new Date(a.operationTime).getTime()
  );

  const paginatedData = sortedData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Banner */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span>系统管理与审计</span>
            <span className="text-xs font-normal text-slate-500 font-mono">(三员独立分立权限体制)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            贯彻“三员分立”（系统管理员、安全保密员、安全审计员）权责隔离审计机制，全日志区块链防篡改。
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowMessage('已执行三员交叉鉴权与安全审计自检')}
            className="px-3.5 py-1.5 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>三员交叉验签</span>
          </button>
        </div>
      </div>

      {/* Three Roles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">系统管理员</div>
            <div className="text-[11px] text-slate-500">负责系统运维、全宗配置与环境监控</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">安全保密员</div>
            <div className="text-[11px] text-slate-500">负责用户权限划定、密级授权与安全策略</div>
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-red-50 dark:bg-red-950/60 text-red-600 flex items-center justify-center font-bold">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">安全审计员</div>
            <div className="text-[11px] text-slate-500">负责所有操作记录审查与违规行为追溯</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索日志编号、操作人员、IP地址、模块..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>角色类别:</span>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
            >
              <option value="全部角色">全部角色</option>
              <option value="系统管理员">系统管理员</option>
              <option value="安全保密员">安全保密员</option>
              <option value="安全审计员">安全审计员</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>安全级别:</span>
            <select
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
            >
              <option value="全部级别">全部级别</option>
              <option value="普通">普通</option>
              <option value="警告">警告</option>
              <option value="高风险">高风险</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => onShowMessage('已导出三员安全审计日志归档包 (带哈希密印)')}
          className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 flex items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          <span>导出审计日志</span>
        </button>
      </div>

      {/* Main Table with exact headers */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            {/* Table Header preserving exact headers */}
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">日志编号</th>
                <th className="py-3 px-4 whitespace-nowrap">操作人员</th>
                <th className="py-3 px-4 whitespace-nowrap">角色类别</th>
                <th className="py-3 px-4 whitespace-nowrap">操作类型</th>
                <th className="py-3 px-4 whitespace-nowrap">操作模块</th>
                <th className="py-3 px-4 whitespace-nowrap">IP地址</th>
                <th className="py-3 px-4 whitespace-nowrap">操作时间</th>
                <th className="py-3 px-4 whitespace-nowrap">操作结果</th>
                <th className="py-3 px-4 whitespace-nowrap">安全级别</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-slate-400">
                    暂无相关审计日志记录
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {/* 日志编号 */}
                    <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      {row.logNo}
                    </td>

                    {/* 操作人员 */}
                    <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {row.operator}
                    </td>

                    {/* 角色类别 */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                          row.roleType === '安全保密员'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : row.roleType === '安全审计员'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                            : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        }`}
                      >
                        {row.roleType}
                      </span>
                    </td>

                    {/* 操作类型 */}
                    <td className="py-3 px-4 text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      {row.operationType}
                    </td>

                    {/* 操作模块 */}
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                      {row.module}
                    </td>

                    {/* IP地址 */}
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {row.ipAddress}
                    </td>

                    {/* 操作时间 */}
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {row.operationTime}
                    </td>

                    {/* 操作结果 */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={
                          row.result === '成功'
                            ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                            : 'text-amber-600 dark:text-amber-400 font-medium'
                        }
                      >
                        {row.result}
                      </span>
                    </td>

                    {/* 安全级别 */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          row.securityLevel === '高风险'
                            ? 'bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300'
                            : row.securityLevel === '警告'
                            ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {row.securityLevel}
                      </span>
                    </td>

                    {/* 操作 */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectRecord(row)}
                          className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                        >
                          详情
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination displaying exactly 10 items per page */}
        <Pagination
          currentPage={currentPage}
          totalItems={sortedData.length}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};
