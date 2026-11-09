import React from 'react';
import { Archive, Bell, Moon, Sun, Search, Building2, UserCheck, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentFonds: string;
  onFondsChange: (fonds: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  globalSearchQuery: string;
  onGlobalSearchChange: (q: string) => void;
  onLogout?: () => void;
}

const FONDS_LIST = [
  '全馆所有全宗',
  '市交通运输局全宗 (F012)',
  '市国资委全宗 (F008)',
  '市行政审批局全宗 (F003)',
  '市发改委全宗 (F004)',
  '市大数据局全宗 (F002)',
  '市自然资源局全宗 (F009)',
  '市委组织部全宗 (F001)',
  '市财政局全宗 (F005)',
  '市生态环境局全宗 (F014)',
];

export const Header: React.FC<HeaderProps> = ({
  currentFonds,
  onFondsChange,
  isDarkMode,
  onToggleTheme,
  globalSearchQuery,
  onGlobalSearchChange,
  onLogout,
}) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between gap-6 sticky top-0 z-30 transition-colors">
      {/* Zone 1: Single element brand title wordmark & Fonds Select */}
      <div className="flex items-center gap-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 dark:bg-blue-600 flex items-center justify-center text-white shadow-xs">
            <Archive className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              档案智能管理平台
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              DIGITAL ARCHIVES SYSTEM
            </span>
          </div>
        </div>

        {/* Fonds Selection dropdown */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="text-slate-400 dark:text-slate-500">当前全宗:</span>
          <select
            value={currentFonds}
            onChange={(e) => onFondsChange(e.target.value)}
            className="bg-transparent font-medium text-slate-800 dark:text-slate-200 focus:outline-hidden cursor-pointer"
          >
            {FONDS_LIST.map((fonds) => (
              <option key={fonds} value={fonds} className="dark:bg-slate-900 dark:text-slate-100">
                {fonds}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Zone 2: Global Search */}
      <div className="flex-1 max-w-md hidden md:block">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="搜索全馆档案题名、档号、责任者或文号..."
            value={globalSearchQuery}
            onChange={(e) => onGlobalSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-hidden focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Zone 3: Actions & User Info */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Security Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>三员密级审计已激活</span>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleTheme}
          title={isDarkMode ? '切换为亮色视图' : '切换为夜间视图'}
          className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            3
          </span>
        </div>

        {/* User Badge & Logout */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-slate-200 flex items-center justify-center font-bold text-xs">
              张
            </div>
            <div className="hidden xl:flex flex-col text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">张建国</span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">安全保密员</span>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="px-2.5 py-1 text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-800 cursor-pointer font-medium"
              title="退出登录"
            >
              退出
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
