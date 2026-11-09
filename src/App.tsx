/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavigationModule } from './types/archive';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { ModalDetail } from './components/ModalDetail';
import { DashboardView } from './views/DashboardView';
import { ArchiveInflowView } from './views/ArchiveInflowView';
import { InflowOrganizeView } from './views/InflowOrganizeView';
import { ArchiveManageView } from './views/ArchiveManageView';
import { FourTestingView } from './views/FourTestingView';
import { ArchiveCatalogView } from './views/ArchiveCatalogView';
import { FullTextCatalogView } from './views/FullTextCatalogView';
import { ArchiveBorrowView } from './views/ArchiveBorrowView';
import { ArchiveAppraisalView } from './views/ArchiveAppraisalView';
import { AppraisalApprovalView } from './views/AppraisalApprovalView';
import { ArchiveDestroyView } from './views/ArchiveDestroyView';
import { ArchiveResearchView } from './views/ArchiveResearchView';
import { SystemAuditView } from './views/SystemAuditView';
import { RepositoryManageView } from './views/RepositoryManageView';
import { ArchiveReportsView } from './views/ArchiveReportsView';
import { ArchiveSettingsView } from './views/ArchiveSettingsView';
import { MyAccountView } from './views/MyAccountView';
import { MyFavoritesView } from './views/MyFavoritesView';
import { MyBorrowsView } from './views/MyBorrowsView';
import { LoginView } from './views/LoginView';
import {
  mockArchiveInflows,
  mockFourTestingRecords,
  mockArchiveCatalogs,
  mockArchiveBorrows,
  mockArchiveAppraisals,
  mockSystemAuditLogs,
} from './data/mockData';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeModule, setActiveModule] = useState<NavigationModule>('dashboard');
  const [currentFonds, setCurrentFonds] = useState('全馆所有全宗');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal State
  const [modalData, setModalData] = useState<any>(null);
  const [modalType, setModalType] = useState<'inflow' | 'four_testing' | 'catalog' | 'borrow' | 'disposal' | 'audit'>('inflow');
  const [modalTitle, setModalTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Handle Dark mode toggle
  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Open detail modal
  const openDetailModal = (data: any, type: 'inflow' | 'four_testing' | 'catalog' | 'borrow' | 'disposal' | 'audit', title: string) => {
    setModalData(data);
    setModalType(type);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const handleApplyBorrowFromCatalog = (item: any) => {
    showToast(`已成功为档案 [${item.title}] 提交借阅申请，单号: JY-20261103-099`);
    setActiveModule('archive_borrow');
  };

  // If not logged in, render the centered Login Page with background image
  if (!isLoggedIn) {
    return (
      <LoginView
        onLoginSuccess={() => {
          setIsLoggedIn(true);
          setActiveModule('dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Header */}
      <Header
        currentFonds={currentFonds}
        onFondsChange={setCurrentFonds}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        globalSearchQuery={globalSearchQuery}
        onGlobalSearchChange={setGlobalSearchQuery}
        onLogout={() => setIsLoggedIn(false)}
      />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar with 9 requested top-level menus */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          counts={{
            inflow: mockArchiveInflows.length,
            fourTesting: mockFourTestingRecords.length,
            catalog: mockArchiveCatalogs.length,
            borrow: mockArchiveBorrows.length,
            disposal: mockArchiveAppraisals.length,
            audit: mockSystemAuditLogs.length,
          }}
        />

        {/* Content View Container - Fullscreen optimized */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 w-full min-w-0">
          {activeModule === 'dashboard' && (
            <DashboardView onNavigate={(m) => setActiveModule(m)} />
          )}

          {activeModule === 'archive_catalog' && (
            <ArchiveCatalogView
              onSelectRecord={(rec) => openDetailModal(rec, 'catalog', '全宗目录档案原件预览')}
              onApplyBorrow={handleApplyBorrowFromCatalog}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'fulltext_catalog' && (
            <FullTextCatalogView
              onSelectRecord={(rec) => openDetailModal(rec, 'catalog', '全文检索档案原件与段落预览')}
              onApplyBorrow={handleApplyBorrowFromCatalog}
              onShowMessage={showToast}
            />
          )}

          {(activeModule === 'archive_inflow' || activeModule === 'inflow_collect') && (
            <ArchiveInflowView
              onSelectRecord={(rec) => openDetailModal(rec, 'inflow', '文件收集单明细查阅')}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'inflow_organize' && (
            <InflowOrganizeView
              onSelectRecord={(rec) => openDetailModal(rec, 'inflow', '收集整编批次案卷明细')}
              onShowMessage={showToast}
            />
          )}

          {(activeModule === 'four_testing' || activeModule === 'inflow_testing') && (
            <FourTestingView
              onSelectRecord={(rec) => openDetailModal(rec, 'four_testing', '电子档案四性检测合规报告')}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'manage_archive' && (
            <ArchiveManageView
              onSelectRecord={(rec) => openDetailModal(rec, 'inflow', '在档管理明细查阅')}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'archive_eval' && (
            <ArchiveAppraisalView
              defaultSubmodule="archive_eval"
              onSelectRecord={(rec) => openDetailModal(rec, 'disposal', '到期档案鉴定明细')}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'eval_approve' && (
            <AppraisalApprovalView
              onSelectRecord={(rec) => openDetailModal(rec, 'disposal', '档案鉴定审批与签发单')}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'archive_destroy' && (
            <ArchiveDestroyView
              onSelectRecord={(rec) => openDetailModal(rec, 'disposal', '档案合规销毁凭证')}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'archive_research' && (
            <ArchiveResearchView onShowMessage={showToast} />
          )}

          {(activeModule === 'archive_borrow' ||
            activeModule === 'borrow_records' ||
            activeModule === 'borrow_approve' ||
            activeModule === 'borrow_return' ||
            activeModule === 'borrow_stats') && (
            <ArchiveBorrowView
              submodule={
                activeModule === 'borrow_approve'
                  ? 'borrow_approve'
                  : activeModule === 'borrow_return'
                  ? 'borrow_return'
                  : activeModule === 'borrow_stats'
                  ? 'borrow_stats'
                  : 'borrow_records'
              }
              onNavigate={(mod) => setActiveModule(mod)}
              onSelectRecord={(rec) => openDetailModal(rec, 'borrow', '档案利用申请与审批明细')}
              onShowMessage={showToast}
            />
          )}

          {(activeModule === 'repository_manage' ||
            activeModule === 'repo_manage' ||
            activeModule === 'repo_browse' ||
            activeModule === 'repo_daily' ||
            activeModule === 'repo_stats') && (
            <RepositoryManageView
              submodule={
                activeModule === 'repo_browse'
                  ? 'repo_browse'
                  : activeModule === 'repo_daily'
                  ? 'repo_daily'
                  : activeModule === 'repo_stats'
                  ? 'repo_stats'
                  : 'repo_manage'
              }
              onNavigate={(mod) => setActiveModule(mod)}
              onShowMessage={showToast}
            />
          )}

          {(activeModule === 'archive_reports' ||
            activeModule === 'report_stats' ||
            activeModule === 'report_annual') && (
            <ArchiveReportsView
              submodule={
                activeModule === 'report_annual'
                  ? 'report_annual'
                  : 'report_stats'
              }
              onNavigate={(mod) => setActiveModule(mod)}
              onShowMessage={showToast}
            />
          )}

          {(activeModule === 'archive_settings' ||
            activeModule === 'setting_fonds' ||
            activeModule === 'setting_archive_types' ||
            activeModule === 'setting_classification' ||
            activeModule === 'setting_catalog_tree' ||
            activeModule === 'setting_retention_period' ||
            activeModule === 'setting_security_level' ||
            activeModule === 'setting_special_topics' ||
            activeModule === 'setting_metadata_rules' ||
            activeModule === 'setting_default_permissions' ||
            activeModule === 'setting_report_maintenance') && (
            <ArchiveSettingsView
              submodule={activeModule === 'archive_settings' ? 'setting_fonds' : activeModule}
              onNavigate={(mod) => setActiveModule(mod)}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'system_audit' && (
            <SystemAuditView
              onSelectRecord={(rec) => openDetailModal(rec, 'audit', '三员独立审计与档案设置日志快照')}
              onShowMessage={showToast}
            />
          )}

          {activeModule === 'my_account' && (
            <MyAccountView onShowMessage={showToast} />
          )}

          {activeModule === 'my_favorites' && (
            <MyFavoritesView onShowMessage={showToast} />
          )}

          {activeModule === 'my_borrows' && (
            <MyBorrowsView onShowMessage={showToast} />
          )}
        </main>
      </div>

      {/* Detail Modal */}
      <ModalDetail
        isOpen={isModalOpen}
        title={modalTitle}
        type={modalType}
        data={modalData}
        onClose={() => setIsModalOpen(false)}
        onActionSuccess={showToast}
      />

      {/* Floating Toast Notice */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl border border-slate-700 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
