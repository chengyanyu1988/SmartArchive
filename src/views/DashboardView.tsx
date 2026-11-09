import React, { useState } from 'react';
import {
  Inbox,
  Layers,
  Archive,
  Trash2,
  Bell,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Send,
  Calendar,
  BarChart2,
  PieChart,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { NavigationModule } from '../types/archive';

interface DashboardViewProps {
  onNavigate: (module: NavigationModule) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  // Chart tab state for 档案借阅统计 (本周 / 本月)
  const [trendTab, setTrendTab] = useState<'week' | 'month'>('week');
  // Selected filter for 待办事项
  const [todoFilter, setTodoFilter] = useState<'all' | 'borrow' | 'appraisal'>('all');
  // Interactive hover point on trend chart
  const [hoveredTrendIdx, setHoveredTrendIdx] = useState<number | null>(6);

  // 1. KPI Data with recent November 2026 context
  const kpiData = [
    {
      title: '本月文件收集',
      count: '1,842',
      unit: '件',
      change: '+12.4% 较上月',
      desc: '涉及OA、ERP等7大业务系统',
      icon: Inbox,
      color: 'from-blue-500 to-indigo-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/60',
      borderColor: 'border-blue-200 dark:border-blue-900/60',
    },
    {
      title: '本月收集整编',
      count: '1,620',
      unit: '卷',
      change: '+8.1% 较上月',
      desc: '元数据完备率 99.8%',
      icon: Layers,
      color: 'from-cyan-500 to-blue-600',
      textColor: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/60',
      borderColor: 'border-cyan-200 dark:border-cyan-900/60',
    },
    {
      title: '本月档案入库',
      count: '1,510',
      unit: '卷',
      change: '+15.2% 较上月',
      desc: '智慧馆库RFID自动定位排架',
      icon: Archive,
      color: 'from-emerald-500 to-teal-600',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/60',
      borderColor: 'border-emerald-200 dark:border-emerald-900/60',
    },
    {
      title: '本月销毁档案',
      count: '240',
      unit: '卷',
      change: '-5.0% 较上月',
      desc: '合规出库双人擦除完结',
      icon: Trash2,
      color: 'from-amber-500 to-orange-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/60',
      borderColor: 'border-amber-200 dark:border-amber-900/60',
    },
  ];

  // 2. 待办事项 dataset (Recent dates in late Oct / Nov 2026)
  const todoItems = [
    {
      id: 'td-1',
      type: 'borrow',
      title: '张建国 申请借阅《市数字化智能交通三期工程竣工验收报告》，请及时处理！',
      time: '2026-11-03 16:45',
      shortDate: '11-03',
      priority: '高优先级',
      user: '张建国 (审计局)',
    },
    {
      id: 'td-2',
      type: 'appraisal',
      title: '《2006年度局机关财政零星报销单据卷宗》待鉴定到期处置，请及时处理！',
      time: '2026-11-03 14:20',
      shortDate: '11-03',
      priority: '中优先级',
      user: '鉴定委员会',
    },
    {
      id: 'td-3',
      type: 'borrow',
      title: '您的借阅申请《2026年第三季度全市国资运营财务决算表》已通过，请及时查询！',
      time: '2026-11-02 11:15',
      shortDate: '11-02',
      priority: '已核准',
      user: '系统自动化',
    },
    {
      id: 'td-4',
      type: 'borrow',
      title: '您的借阅申请《东部新区绿色生态示范区建设规划许可批复正本》已通过，请及时查询！',
      time: '2026-11-01 09:30',
      shortDate: '11-01',
      priority: '已核准',
      user: '系统自动化',
    },
  ];

  const filteredTodos = todoItems.filter((item) => {
    if (todoFilter === 'borrow') return item.type === 'borrow';
    if (todoFilter === 'appraisal') return item.type === 'appraisal';
    return true;
  });

  // 3. 归还提醒 dataset (Recent 2026 dates)
  const returnReminders = [
    { id: 'rr-1', title: '《市中心水厂智能化改造工程CAD施工图纸》', borrower: '张建国', dept: '水务质检科', returnDate: '2026-11-03', status: '今日到期' },
    { id: 'rr-2', title: '《2026年全域水污染防治攻坚战现场督查卷宗》', borrower: '李博文', dept: '生态执法队', returnDate: '2026-11-04', status: '剩余1天' },
    { id: 'rr-3', title: '《新建市民文化艺术中心地下停车楼消防合格证》', borrower: '王志强', dept: '消防救援支队', returnDate: '2026-11-05', status: '剩余2天' },
    { id: 'rr-4', title: '《市招商引资重点汽车产业园投资合作协议》', borrower: '赵光远', dept: '经合局招商组', returnDate: '2026-11-01', status: '正常借阅' },
  ];

  // 4. 公告通知 dataset (Recent 2026 dates)
  const announcements = [
    { id: 'an-1', tag: '系统维护', title: '关于全国政企数字档案管理系统服务器例行安全维保的通知', date: '2026-11-03', isNew: true },
    { id: 'an-2', tag: '标准更新', title: '关于全面贯彻执行国家档案局《电子档案四性检测指南》的通知', date: '2026-11-02', isNew: true },
    { id: 'an-3', tag: '业务通告', title: '关于开展2026年第三季度全市全宗档案归档移交核查的通知', date: '2026-11-05', isNew: false },
    { id: 'an-4', tag: '培训通知', title: '关于举办全市各单位档案三员保密管理与RFID智慧馆库培训的通知', date: '2026-11-05', isNew: false },
  ];

  // 5. 档案类型占比 dataset
  const categoryChartData = [
    { name: '文书档案', pct: '32.68%', value: 32.68, color: 'bg-blue-500', barColor: '#3b82f6' },
    { name: '照片档案', pct: '25.75%', value: 25.75, color: 'bg-emerald-500', barColor: '#10b981' },
    { name: '产品科技档案', pct: '16.87%', value: 16.87, color: 'bg-indigo-500', barColor: '#6366f1' },
    { name: '实物档案', pct: '12.43%', value: 12.43, color: 'bg-amber-500', barColor: '#f59e0b' },
    { name: '会计档案', pct: '12.26%', value: 12.26, color: 'bg-purple-500', barColor: '#a855f7' },
  ];

  // 6. 档案借阅统计 (Up to current date 2026-11-04)
  const weekTrendData = [
    { date: '10-29', borrow: 38, returnItem: 42 },
    { date: '10-30', borrow: 45, returnItem: 38 },
    { date: '10-31', borrow: 18, returnItem: 12 },
    { date: '11-01', borrow: 22, returnItem: 28 },
    { date: '11-02', borrow: 38, returnItem: 32 },
    { date: '11-03', borrow: 52, returnItem: 48 },
    { date: '11-04', borrow: 29, returnItem: 31 }, // 今日截止
  ];

  const monthTrendData = [
    { date: '11-01', borrow: 22, returnItem: 28 },
    { date: '11-02', borrow: 38, returnItem: 32 },
    { date: '11-03', borrow: 52, returnItem: 48 },
    { date: '11-04', borrow: 29, returnItem: 31 }, // 今日截止
  ];

  const activeTrendData = trendTab === 'week' ? weekTrendData : monthTrendData;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Executive Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-blue-400 text-xs font-mono font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>档案智能管理平台 · 工作台控制中心</span>
            <span>·</span>
            <span>2026年11月实时状态</span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            欢迎使用 档案智能管理工作台
          </h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            重构档案全生命周期的可视化管理大盘，集成智能收集整编、四性合规校验、借阅归还追踪与库房物联网监控。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('archive_inflow')}
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md flex items-center gap-2"
          >
            <Inbox className="w-4 h-4" />
            <span>档案收集与接收</span>
          </button>
          <button
            onClick={() => onNavigate('archive_catalog')}
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/10 transition-all flex items-center gap-2"
          >
            <BarChart2 className="w-4 h-4" />
            <span>全馆档案检索</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Redesigned 4 KPI Cards (Non-identical to default, rich metric tags) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className={`p-5 rounded-2xl border ${kpi.borderColor} ${kpi.bgColor} shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-3 relative overflow-hidden group`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
                    {kpi.title}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                      {kpi.count}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {kpi.unit}
                    </span>
                  </div>
                </div>

                <div className={`w-11 h-11 rounded-xl bg-white dark:bg-slate-900 shadow-xs border border-slate-200/80 dark:border-slate-800 flex items-center justify-center ${kpi.textColor} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
                  <TrendingUp className="w-3 h-3" />
                  {kpi.change}
                </span>
                <span className="text-slate-500 dark:text-slate-400 line-clamp-1">
                  {kpi.desc}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SECTION 2: Re-arranged Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* BLOCK 1: 档案借阅统计 (Re-styled Line Graph Area) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span>档案借阅统计</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {trendTab === 'week'
                    ? '全馆档案近7日（截至 11-04）每日借阅与归还对账趋势'
                    : '全馆档案本月至今（11-01 至 11-04）每日借阅与归还对账趋势'}
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* Legend */}
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">档案借阅</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-slate-600 dark:text-slate-400 font-medium">档案归还</span>
                  </div>
                </div>

                {/* Week/Month Filter Tabs */}
                <div className="flex items-center p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-medium">
                  <button
                    onClick={() => {
                      setTrendTab('week');
                      setHoveredTrendIdx(6);
                    }}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      trendTab === 'week'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    本周
                  </button>
                  <button
                    onClick={() => {
                      setTrendTab('month');
                      setHoveredTrendIdx(3);
                    }}
                    className={`px-3 py-1 rounded-md transition-colors ${
                      trendTab === 'month'
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                    }`}
                  >
                    本月
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Interactive Responsive Chart View */}
            <div className="space-y-2">
              <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-4 border-b border-slate-100 dark:border-slate-800 relative">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-x-0 top-0 border-b border-dashed border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 font-mono">75</div>
                <div className="absolute inset-x-0 top-1/3 border-b border-dashed border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 font-mono">50</div>
                <div className="absolute inset-x-0 top-2/3 border-b border-dashed border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-400 font-mono">25</div>

                {/* Interactive Bar/Line Columns */}
                {activeTrendData.map((d, idx) => {
                  const maxVal = 70;
                  const borrowH = (d.borrow / maxVal) * 100;
                  const returnH = (d.returnItem / maxVal) * 100;
                  const isHovered = hoveredTrendIdx === idx;

                  return (
                    <div
                      key={d.date}
                      onMouseEnter={() => setHoveredTrendIdx(idx)}
                      className="flex-1 flex flex-col items-center justify-end h-full z-10 group cursor-pointer"
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute top-1 z-20 p-2.5 rounded-lg bg-slate-900 text-white text-[11px] shadow-xl border border-slate-700 space-y-1 font-mono pointer-events-none animate-in fade-in duration-150">
                          <div className="font-bold text-slate-300">2026-{d.date}</div>
                          <div className="flex items-center gap-2 text-blue-400">
                            <span>借阅:</span>
                            <strong className="text-white">{d.borrow} 件</strong>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-400">
                            <span>归还:</span>
                            <strong className="text-white">{d.returnItem} 件</strong>
                          </div>
                        </div>
                      )}

                      {/* Bar Indicators */}
                      <div className="flex items-end gap-1.5 w-full max-w-[28px] justify-center h-full pt-4">
                        <div
                          className={`w-3 rounded-t-md transition-all duration-300 ${
                            isHovered ? 'bg-blue-600 scale-x-110 shadow-xs' : 'bg-blue-500/80'
                          }`}
                          style={{ height: `${borrowH}%` }}
                        />
                        <div
                          className={`w-3 rounded-t-md transition-all duration-300 ${
                            isHovered ? 'bg-emerald-600 scale-x-110 shadow-xs' : 'bg-emerald-500/80'
                          }`}
                          style={{ height: `${returnH}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Date X-Axis */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400 px-4 pt-1">
                {activeTrendData.map((d) => (
                  <span
                    key={`x-${d.date}`}
                    className={`text-center font-medium ${
                      d.date === '11-04' ? 'text-blue-600 dark:text-blue-400 font-bold' : ''
                    }`}
                  >
                    {d.date}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* BLOCK 2: 待办事项 (Re-styled Card with Filters & Actions) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">待办事项与批示</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-[10px] font-mono font-bold">
                  {filteredTodos.length} 项待处理
                </span>
              </div>

              {/* Todo Category filter tabs */}
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setTodoFilter('all')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    todoFilter === 'all'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  全部待办
                </button>
                <button
                  onClick={() => setTodoFilter('borrow')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    todoFilter === 'borrow'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  借阅审批
                </button>
                <button
                  onClick={() => setTodoFilter('appraisal')}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    todoFilter === 'appraisal'
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  鉴定处置
                </button>
              </div>
            </div>

            {/* Todo List */}
            <div className="space-y-2.5">
              {filteredTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 hover:bg-blue-50/40 dark:hover:bg-blue-950/20 hover:border-blue-300 transition-all flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0" />
                      <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                        {todo.title}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-3 pl-3 font-mono">
                      <span>提交人/节点: {todo.user}</span>
                      <span>·</span>
                      <span>时间: {todo.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">
                      {todo.priority}
                    </span>
                    <button
                      onClick={() => onNavigate(todo.type === 'borrow' ? 'archive_borrow' : 'four_testing')}
                      className="px-3 py-1 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1 shadow-xs"
                    >
                      <span>及时处理</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN (1/3 width) */}
        <div className="space-y-6">

          {/* BLOCK 3: 档案类型占比 (Re-styled Segment Chart & Legend) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>档案类型占比</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">2026年最新分布</span>
            </div>

            {/* Segment Progress Stack */}
            <div className="space-y-3">
              <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800 flex overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                {categoryChartData.map((c) => (
                  <div
                    key={c.name}
                    className={`h-full ${c.color} first:rounded-l-full last:rounded-r-full hover:opacity-90 transition-opacity cursor-pointer`}
                    style={{ width: c.pct }}
                    title={`${c.name}: ${c.pct}`}
                  />
                ))}
              </div>

              {/* Legend Items */}
              <div className="space-y-2 pt-2">
                {categoryChartData.map((c) => (
                  <div key={c.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${c.color} shrink-0`} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{c.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{c.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* BLOCK 4: 归还提醒 (Re-styled Table View) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>归还提醒</span>
              </h3>
              <button
                onClick={() => onNavigate('archive_borrow')}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                查看全部借阅台账 →
              </button>
            </div>

            <div className="space-y-2.5">
              {returnReminders.map((rem) => (
                <div
                  key={rem.id}
                  className="p-3 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 truncate">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate" title={rem.title}>
                      {rem.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                      借阅人: {rem.borrower} ({rem.dept})
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">
                      {rem.returnDate}
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      {rem.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCK 5: 公告通知 (Re-styled Editorial List) */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>公告通知</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-mono">官方业务例行公示</span>
            </div>

            <div className="space-y-3">
              {announcements.map((anc) => (
                <div
                  key={anc.id}
                  className="space-y-1 group cursor-pointer p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-semibold shrink-0">
                        {anc.tag}
                      </span>
                      <span className="text-slate-900 dark:text-slate-100 font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate transition-colors">
                        {anc.title}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400 shrink-0 ml-2">
                      {anc.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
