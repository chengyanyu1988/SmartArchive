import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderSearch,
  FileText,
  Inbox,
  FolderTree,
  CheckCircle2,
  BookOpenCheck,
  Building2,
  BarChart3,
  ShieldAlert,
  UserCheck,
  ChevronDown,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  FileSpreadsheet,
  CheckSquare,
  Trash2,
  BookOpen,
  RotateCcw,
  Clock,
  Eye,
  ClipboardCheck,
  PieChart,
  Settings,
  Landmark,
  Layers,
  Lock,
  Sliders,
  Sparkles,
  ShieldCheck,
  Network,
  Bookmark,
} from 'lucide-react';
import { NavigationModule } from '../types/archive';

interface SidebarProps {
  activeModule: NavigationModule;
  onSelectModule: (module: NavigationModule) => void;
  counts: {
    inflow: number;
    fourTesting: number;
    catalog: number;
    borrow: number;
    disposal: number;
    audit: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  counts,
}) => {
  // Collapsible sidebar state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State for sub-menu expansion under "档案检索"
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(true);
  // State for sub-menu expansion under "档案收集"
  const [isInflowMenuOpen, setIsInflowMenuOpen] = useState(true);
  // State for sub-menu expansion under "档案管理"
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(true);
  // State for sub-menu expansion under "档案利用"
  const [isBorrowMenuOpen, setIsBorrowMenuOpen] = useState(true);
  // State for sub-menu expansion under "库房管理"
  const [isRepoMenuOpen, setIsRepoMenuOpen] = useState(true);
  // State for sub-menu expansion under "档案报表"
  const [isReportsMenuOpen, setIsReportsMenuOpen] = useState(true);
  // State for sub-menu expansion under "档案设置"
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(true);
  // State for sub-menu expansion under "我的"
  const [isMyMenuOpen, setIsMyMenuOpen] = useState(true);

  const isSearchActive = activeModule === 'archive_catalog' || activeModule === 'fulltext_catalog';
  const isInflowActive =
    activeModule === 'archive_inflow' ||
    activeModule === 'inflow_collect' ||
    activeModule === 'inflow_organize' ||
    activeModule === 'inflow_testing';
  const isManageActive =
    activeModule === 'four_testing' ||
    activeModule === 'manage_archive' ||
    activeModule === 'archive_eval' ||
    activeModule === 'eval_approve' ||
    activeModule === 'archive_destroy' ||
    activeModule === 'archive_research';
  const isBorrowActive =
    activeModule === 'archive_borrow' ||
    activeModule === 'borrow_records' ||
    activeModule === 'borrow_approve' ||
    activeModule === 'borrow_return' ||
    activeModule === 'borrow_stats';
  const isRepoActive =
    activeModule === 'repository_manage' ||
    activeModule === 'repo_manage' ||
    activeModule === 'repo_browse' ||
    activeModule === 'repo_daily' ||
    activeModule === 'repo_stats';
  const isReportsActive =
    activeModule === 'archive_reports' ||
    activeModule === 'report_stats' ||
    activeModule === 'report_annual';
  const isSettingsActive =
    activeModule === 'archive_settings' ||
    activeModule === 'setting_fonds' ||
    activeModule === 'setting_archive_types' ||
    activeModule === 'setting_classification' ||
    activeModule === 'setting_catalog_tree' ||
    activeModule === 'setting_retention_period' ||
    activeModule === 'setting_security_level' ||
    activeModule === 'setting_special_topics' ||
    activeModule === 'setting_metadata_rules' ||
    activeModule === 'setting_default_permissions' ||
    activeModule === 'setting_report_maintenance' ||
    activeModule === 'system_audit';
  const isMyActive =
    activeModule === 'my_account' ||
    activeModule === 'my_favorites' ||
    activeModule === 'my_borrows';

  return (
    <aside
      className={`border-r border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60 p-3 flex flex-col justify-between shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-16 items-center' : 'w-56'
      }`}
    >
      <div className="space-y-4 w-full">
        {/* Toggle Collapse Header Button */}
        <div className="flex items-center justify-between px-2 py-1">
          {!isCollapsed && (
            <div className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              导航菜单
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? '展开菜单栏' : '收起菜单栏'}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors mx-auto"
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1 w-full">
          {/* 1. 工作台 */}
          <button
            onClick={() => onSelectModule('dashboard')}
            title="工作台"
            className={`w-full flex items-center ${
              isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
            } rounded-lg text-xs font-medium transition-all ${
              activeModule === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeModule === 'dashboard' ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
              {!isCollapsed && <span className="truncate">工作台</span>}
            </div>
          </button>

          {/* 2. 档案检索 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectModule('archive_catalog');
                } else {
                  setIsSearchMenuOpen(!isSearchMenuOpen);
                  if (!isSearchActive) onSelectModule('archive_catalog');
                }
              }}
              title="档案检索"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
              } rounded-lg text-xs font-medium transition-all ${
                isSearchActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <FolderSearch className={`w-4 h-4 shrink-0 ${isSearchActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">档案检索</span>}
              </div>
              {!isCollapsed && (
                isSearchMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )
              )}
            </button>

            {/* Sub-menu Items when expanded */}
            {!isCollapsed && isSearchMenuOpen && (
              <div className="pl-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900/60 ml-3 py-0.5">
                <button
                  onClick={() => onSelectModule('archive_catalog')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'archive_catalog'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderSearch className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">条目检索</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectModule('fulltext_catalog')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'fulltext_catalog'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">全文检索</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 3. 档案收集 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectModule('archive_inflow');
                } else {
                  setIsInflowMenuOpen(!isInflowMenuOpen);
                  if (!isInflowActive) onSelectModule('archive_inflow');
                }
              }}
              title="档案收集"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
              } rounded-lg text-xs font-medium transition-all ${
                isInflowActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Inbox className={`w-4 h-4 shrink-0 ${isInflowActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">档案收集</span>}
              </div>
              {!isCollapsed && (
                isInflowMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )
              )}
            </button>

            {/* Sub-menu Items */}
            {!isCollapsed && isInflowMenuOpen && (
              <div className="pl-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900/60 ml-3 py-0.5">
                <button
                  onClick={() => onSelectModule('archive_inflow')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'archive_inflow' || activeModule === 'inflow_collect'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Inbox className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">文件收集</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectModule('inflow_organize')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'inflow_organize'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderTree className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">收集整编</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectModule('inflow_testing')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'inflow_testing'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">四性检测</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 4. 档案管理及其 5 个子菜单 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectModule('four_testing');
                } else {
                  setIsManageMenuOpen(!isManageMenuOpen);
                  if (!isManageActive) onSelectModule('four_testing');
                }
              }}
              title="档案管理"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
              } rounded-lg text-xs font-medium transition-all ${
                isManageActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isManageActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">档案管理</span>}
              </div>
              {!isCollapsed && (
                isManageMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )
              )}
            </button>

            {/* Sub-menu Items under 档案管理 */}
            {!isCollapsed && isManageMenuOpen && (
              <div className="pl-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900/60 ml-3 py-0.5">
                {/* 子菜单 1: 档案管理 */}
                <button
                  onClick={() => onSelectModule('manage_archive')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'four_testing' || activeModule === 'manage_archive'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">档案管理</span>
                  </div>
                </button>

                {/* 子菜单 2: 档案鉴定 */}
                <button
                  onClick={() => onSelectModule('archive_eval')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'archive_eval'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">档案鉴定</span>
                  </div>
                </button>

                {/* 子菜单 3: 鉴定审批 */}
                <button
                  onClick={() => onSelectModule('eval_approve')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'eval_approve'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">鉴定审批</span>
                  </div>
                </button>

                {/* 子菜单 4: 档案销毁 */}
                <button
                  onClick={() => onSelectModule('archive_destroy')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'archive_destroy'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Trash2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">档案销毁</span>
                  </div>
                </button>

                {/* 子菜单 5: 档案编研 */}
                <button
                  onClick={() => onSelectModule('archive_research')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'archive_research'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">档案编研</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 5. 档案利用及其 4 个子菜单 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectModule('borrow_records');
                } else {
                  setIsBorrowMenuOpen(!isBorrowMenuOpen);
                  if (!isBorrowActive) onSelectModule('borrow_records');
                }
              }}
              title="档案利用"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
              } rounded-lg text-xs font-medium transition-all ${
                isBorrowActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <BookOpenCheck className={`w-4 h-4 shrink-0 ${isBorrowActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">档案利用</span>}
              </div>
              {!isCollapsed && (
                isBorrowMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )
              )}
            </button>

            {/* Sub-menu Items under 档案利用 */}
            {!isCollapsed && isBorrowMenuOpen && (
              <div className="pl-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900/60 ml-3 py-0.5">
                {/* 子菜单 1: 借阅档案 */}
                <button
                  onClick={() => onSelectModule('borrow_records')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'borrow_records' || activeModule === 'archive_borrow'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <BookOpenCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">借阅档案</span>
                  </div>
                </button>

                {/* 子菜单 2: 借阅审批 */}
                <button
                  onClick={() => onSelectModule('borrow_approve')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'borrow_approve'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <CheckSquare className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">借阅审批</span>
                  </div>
                </button>

                {/* 子菜单 3: 归还管理 */}
                <button
                  onClick={() => onSelectModule('borrow_return')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'borrow_return'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">归还管理</span>
                  </div>
                </button>

                {/* 子菜单 4: 借阅统计 */}
                <button
                  onClick={() => onSelectModule('borrow_stats')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'borrow_stats'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">借阅统计</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 6. 库房管理及其 4 个子菜单 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectModule('repo_manage');
                } else {
                  setIsRepoMenuOpen(!isRepoMenuOpen);
                  if (!isRepoActive) onSelectModule('repo_manage');
                }
              }}
              title="库房管理"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
              } rounded-lg text-xs font-medium transition-all ${
                isRepoActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Building2 className={`w-4 h-4 shrink-0 ${isRepoActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">库房管理</span>}
              </div>
              {!isCollapsed && (
                isRepoMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )
              )}
            </button>

            {/* Sub-menu Items under 库房管理 */}
            {!isCollapsed && isRepoMenuOpen && (
              <div className="pl-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900/60 ml-3 py-0.5">
                {/* 子菜单 1: 库房管理 */}
                <button
                  onClick={() => onSelectModule('repo_manage')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'repo_manage' || activeModule === 'repository_manage'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">库房管理</span>
                  </div>
                </button>

                {/* 子菜单 2: 库房浏览 */}
                <button
                  onClick={() => onSelectModule('repo_browse')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'repo_browse'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Eye className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">库房浏览</span>
                  </div>
                </button>

                {/* 子菜单 3: 日常管理 */}
                <button
                  onClick={() => onSelectModule('repo_daily')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'repo_daily'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <ClipboardCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">日常管理</span>
                  </div>
                </button>

                {/* 子菜单 4: 库房统计 */}
                <button
                  onClick={() => onSelectModule('repo_stats')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'repo_stats'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <PieChart className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">库房统计</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 7. 档案报表及其 2 个子菜单 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectModule('report_stats');
                } else {
                  setIsReportsMenuOpen(!isReportsMenuOpen);
                  if (!isReportsActive) onSelectModule('report_stats');
                }
              }}
              title="档案报表"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
              } rounded-lg text-xs font-medium transition-all ${
                isReportsActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <BarChart3 className={`w-4 h-4 shrink-0 ${isReportsActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">档案报表</span>}
              </div>
              {!isCollapsed && (
                isReportsMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )
              )}
            </button>

            {/* Sub-menu Items under 档案报表 */}
            {!isCollapsed && isReportsMenuOpen && (
              <div className="pl-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900/60 ml-3 py-0.5">
                {/* 子菜单 1: 档案统计 */}
                <button
                  onClick={() => onSelectModule('report_stats')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'report_stats' || activeModule === 'archive_reports'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <BarChart3 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">档案统计</span>
                  </div>
                </button>

                {/* 子菜单 2: 档案年报 */}
                <button
                  onClick={() => onSelectModule('report_annual')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'report_annual'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">档案年报</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 8. 档案设置及其 10 个子菜单 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectModule('setting_fonds');
                } else {
                  setIsSettingsMenuOpen(!isSettingsMenuOpen);
                  if (!isSettingsActive) onSelectModule('setting_fonds');
                }
              }}
              title="档案设置"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
              } rounded-lg text-xs font-medium transition-all ${
                isSettingsActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Settings className={`w-4 h-4 shrink-0 ${isSettingsActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">档案设置</span>}
              </div>
              {!isCollapsed && (
                isSettingsMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )
              )}
            </button>

            {/* Sub-menu Items under 档案设置 */}
            {!isCollapsed && isSettingsMenuOpen && (
              <div className="pl-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900/60 ml-3 py-0.5">
                {/* 1. 全宗管理 */}
                <button
                  onClick={() => onSelectModule('setting_fonds')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_fonds' || activeModule === 'archive_settings'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Landmark className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">全宗管理</span>
                  </div>
                </button>

                {/* 2. 档案类型管理 */}
                <button
                  onClick={() => onSelectModule('setting_archive_types')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_archive_types'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Layers className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">档案类型管理</span>
                  </div>
                </button>

                {/* 3. 分类设置 */}
                <button
                  onClick={() => onSelectModule('setting_classification')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_classification'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FolderTree className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">分类设置</span>
                  </div>
                </button>

                {/* 4. 目录树维护 */}
                <button
                  onClick={() => onSelectModule('setting_catalog_tree')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_catalog_tree'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Network className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">目录树维护</span>
                  </div>
                </button>

                {/* 5. 保管期限 */}
                <button
                  onClick={() => onSelectModule('setting_retention_period')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_retention_period'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Clock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">保管期限</span>
                  </div>
                </button>

                {/* 6. 密级 */}
                <button
                  onClick={() => onSelectModule('setting_security_level')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_security_level'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">密级</span>
                  </div>
                </button>

                {/* 7. 专题类型设置 */}
                <button
                  onClick={() => onSelectModule('setting_special_topics')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_special_topics'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Sparkles className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">专题类型设置</span>
                  </div>
                </button>

                {/* 8. 著录项规则设置 */}
                <button
                  onClick={() => onSelectModule('setting_metadata_rules')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_metadata_rules'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Sliders className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">著录项规则设置</span>
                  </div>
                </button>

                {/* 9. 默认数据权限 */}
                <button
                  onClick={() => onSelectModule('setting_default_permissions')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_default_permissions'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">默认数据权限</span>
                  </div>
                </button>

                {/* 10. 报表维护 */}
                <button
                  onClick={() => onSelectModule('setting_report_maintenance')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'setting_report_maintenance'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">报表维护</span>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* 9. 我的 */}
          <div className="space-y-1">
            <button
              onClick={() => {
                if (isCollapsed) {
                  onSelectModule('my_account');
                } else {
                  setIsMyMenuOpen(!isMyMenuOpen);
                  if (!isMyActive) onSelectModule('my_account');
                }
              }}
              title="我的"
              className={`w-full flex items-center ${
                isCollapsed ? 'justify-center px-0 py-2.5' : 'justify-between px-3 py-2'
              } rounded-lg text-xs font-medium transition-all ${
                isMyActive
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <UserCheck className={`w-4 h-4 shrink-0 ${isMyActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                {!isCollapsed && <span className="truncate">我的</span>}
              </div>
              {!isCollapsed && (
                isMyMenuOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                )
              )}
            </button>

            {/* Sub-menu Items under 我的 */}
            {!isCollapsed && isMyMenuOpen && (
              <div className="pl-6 space-y-1 border-l-2 border-blue-200 dark:border-blue-900/60 ml-3 py-0.5">
                <button
                  onClick={() => onSelectModule('my_favorites')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'my_favorites'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Bookmark className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">我的收藏</span>
                  </div>
                </button>

                <button
                  onClick={() => onSelectModule('my_borrows')}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs transition-all ${
                    activeModule === 'my_borrows'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/40'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <BookOpenCheck className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">我的借阅</span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </nav>

        {/* System Status Card - Only shown when expanded */}
        {!isCollapsed && (
          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs space-y-1">
            <div className="text-[11px] font-bold text-slate-800 dark:text-slate-200">
              四性标准检测合格
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
              国密SM3验签与自动EEP封装。
            </p>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-1.5 mt-1">
              <span>合格率</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">99.4%</span>
            </div>
          </div>
        )}
      </div>

      {/* System Footer Info */}
      {!isCollapsed && (
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-400 space-y-0.5 font-mono">
          <div>档案智能管理平台</div>
          <div className="text-slate-400 dark:text-slate-500">v2026.11 Executive</div>
        </div>
      )}
    </aside>
  );
};
