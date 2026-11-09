import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Key, FileCheck, Clock, Download, CheckCircle2, Lock } from 'lucide-react';
import { Pagination } from '../components/Pagination';

interface MyAccountViewProps {
  onShowMessage: (msg: string) => void;
}

interface PersonalTask {
  id: string;
  taskNo: string;       // 任务单号
  taskName: string;     // 任务事项名称
  taskType: string;     // 事项类型
  submitTime: string;   // 提交时间
  deadline: string;     // 办理期限
  securityLevel: string;// 密级要求
  status: string;       // 当前进度
}

const mockPersonalTasks: PersonalTask[] = [
  { id: 'task-01', taskNo: 'MY-20261103-01', taskName: '复核【市数字化智能交通三期工程竣工验收报告】借阅密级', taskType: '借阅审签', submitTime: '2026-11-03 16:30:00', deadline: '2026-11-04 17:00:00', securityLevel: '内部', status: '待我审核' },
  { id: 'task-02', taskNo: 'MY-20261103-02', taskName: '签署【2026年第三季度全市国资决算表】防篡改电子水印授权', taskType: '安全加印', submitTime: '2026-11-03 15:40:00', deadline: '2026-11-04 12:00:00', securityLevel: '秘密', status: '待我审核' },
  { id: 'task-03', taskNo: 'MY-20261102-05', taskName: '确认【智能密集架 A区 01-12】RFID盘点账实相符离盘结果', taskType: '库房盘点', submitTime: '2026-11-02 17:15:00', deadline: '2026-11-03 18:00:00', securityLevel: '普通', status: '处理中' },
  { id: 'task-04', taskNo: 'MY-20261102-01', taskName: '审核【局机关处级干部考核机密卷宗】三员鉴权借阅回执', taskType: '三员鉴权', submitTime: '2026-11-02 14:10:00', deadline: '2026-11-03 17:00:00', securityLevel: '机密', status: '已完成' },
  { id: 'task-05', taskNo: 'MY-20261101-08', taskName: '校验【市中心水厂智能化改造CAD模型】四性合规重新封装', taskType: '四性检测复测', submitTime: '2026-11-01 16:20:00', deadline: '2026-11-02 17:00:00', securityLevel: '内部', status: '已完成' },
  { id: 'task-06', taskNo: 'MY-20261101-02', taskName: '签发【破产小微国企过期限单据销毁】鉴定委员会最终意见', taskType: '到期销毁', submitTime: '2026-11-01 09:30:00', deadline: '2026-11-02 12:00:00', securityLevel: '普通', status: '已完成' },
  { id: 'task-07', taskNo: 'MY-20261031-09', taskName: '审核【老旧小区微改造二期项目立项与稳评】公开调阅申请', taskType: '借阅审签', submitTime: '2026-11-05 11:20:00', deadline: '2026-11-01 17:00:00', securityLevel: '公开', status: '已完成' },
  { id: 'task-08', taskNo: 'MY-20261030-04', taskName: '例行检查【政务云平台等保三级测评报告】硬件Ukey持有凭证', taskType: '安全巡检', submitTime: '2026-11-05 10:15:00', deadline: '2026-11-05 18:00:00', securityLevel: '机密', status: '已完成' },
  { id: 'task-09', taskNo: 'MY-20261029-06', taskName: '审核【园博会筹委会新闻发布会4K视频】归档元数据完整性', taskType: '归档审核', submitTime: '2026-11-05 15:50:00', deadline: '2026-11-05 17:00:00', securityLevel: '公开', status: '已完成' },
  { id: 'task-10', taskNo: 'MY-20261028-11', taskName: '确认【防汛抗旱指挥部超强台风防汛日志】纸质打印防伪水印', taskType: '打印核销', submitTime: '2026-11-05 16:15:00', deadline: '2026-11-05 17:00:00', securityLevel: '公开', status: '已完成' },
  { id: 'task-11', taskNo: 'MY-20261027-03', taskName: '核验【残保金专项审计终结报告】调阅到期归还注销', taskType: '借阅归还', submitTime: '2026-11-05 14:40:00', deadline: '2026-11-05 17:00:00', securityLevel: '内部', status: '已完成' },
  { id: 'task-12', taskNo: 'MY-20261026-07', taskName: '更新【档案馆智慧馆库数字孪生三维建图】物联网节点秘钥', taskType: '秘钥轮转', submitTime: '2026-11-04 15:10:00', deadline: '2026-11-05 18:00:00', securityLevel: '内部', status: '已完成' },
];

export const MyAccountView: React.FC<MyAccountViewProps> = ({ onShowMessage }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  const paginatedData = mockPersonalTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Profile Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center border-2 border-blue-400 shadow-md">
            张
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold">张建国</h2>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
                安全保密员 (安全鉴权组)
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono">
              工号: SEC-20260982 · 所属部门: 档案馆安全保密处 · 证书: 国密UKey令牌双因子激活
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onShowMessage('已成功更换硬件Ukey验签口令')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/10 transition-all flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5" />
            <span>更换密钥口令</span>
          </button>
        </div>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">待办审批事项</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">2 件需处理</div>
          </div>
          <Clock className="w-6 h-6 text-amber-500" />
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">经手核准卷宗</div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 font-mono">1,420 卷</div>
          </div>
          <FileCheck className="w-6 h-6 text-blue-500" />
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">安全保密零违规履历</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">1,280 天</div>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-500" />
        </div>
      </div>

      {/* Personal Tasks Table with exact 10 items per page */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-xs">
        <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 font-bold text-xs text-slate-900 dark:text-white flex items-center justify-between">
          <span>我的待办与处理履历 (按时间降序)</span>
          <span className="text-[11px] font-normal text-slate-400 font-mono">显示最近 12 项工作任务</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4 whitespace-nowrap">任务单号</th>
                <th className="py-3 px-4 min-w-[240px]">任务事项名称</th>
                <th className="py-3 px-4 whitespace-nowrap">事项类型</th>
                <th className="py-3 px-4 whitespace-nowrap">提交时间</th>
                <th className="py-3 px-4 whitespace-nowrap">办理期限</th>
                <th className="py-3 px-4 whitespace-nowrap">密级要求</th>
                <th className="py-3 px-4 whitespace-nowrap">当前进度</th>
                <th className="py-3 px-4 whitespace-nowrap text-right">操作</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
              {paginatedData.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                    {row.taskNo}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    <div className="line-clamp-2" title={row.taskName}>
                      {row.taskName}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {row.taskType}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {row.submitTime}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {row.deadline}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                      {row.securityLevel}
                    </span>
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      row.status === '已完成'
                        ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                        : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={() => onShowMessage(`已处理事项 [${row.taskNo}]，结果已录入审计日志`)}
                      className="px-2.5 py-1 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 font-medium transition-colors"
                    >
                      {row.status === '已完成' ? '查阅凭证' : '快速办理'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination displaying exactly 10 items per page */}
        <Pagination
          currentPage={currentPage}
          totalItems={mockPersonalTasks.length}
          pageSize={PAGE_SIZE}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};
