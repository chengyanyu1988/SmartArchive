export type NavigationModule = 
  | 'dashboard'          // 工作台
  | 'archive_catalog'    // 条目检索
  | 'fulltext_catalog'   // 全文检索
  | 'archive_inflow'     // 档案收集
  | 'inflow_collect'     // 文件收集
  | 'inflow_organize'    // 收集整编
  | 'inflow_testing'     // 四性检测
  | 'four_testing'       // 档案管理 (主)
  | 'manage_archive'     // 档案管理 (子菜单 1)
  | 'archive_eval'       // 档案鉴定 (子菜单 2)
  | 'eval_approve'       // 鉴定审批 (子菜单 3)
  | 'archive_destroy'    // 档案销毁 (子菜单 4)
  | 'archive_research'   // 档案编研 (子菜单 5)
  | 'archive_borrow'     // 档案利用 (主)
  | 'borrow_records'     // 借阅档案 (子菜单 1)
  | 'borrow_approve'     // 借阅审批 (子菜单 2)
  | 'borrow_return'      // 归还管理 (子菜单 3)
  | 'borrow_stats'       // 借阅统计 (子菜单 4)
  | 'repository_manage'  // 库房管理 (主)
  | 'repo_manage'        // 库房管理 (子菜单 1)
  | 'repo_browse'        // 库房浏览 (子菜单 2)
  | 'repo_daily'         // 日常管理 (子菜单 3)
  | 'repo_stats'         // 库房统计 (子菜单 4)
  | 'archive_reports'    // 档案报表 (主)
  | 'report_stats'       // 档案统计 (子菜单 1)
  | 'report_annual'      // 档案年报 (子菜单 2)
  | 'archive_settings'   // 档案设置 (主)
  | 'setting_fonds'               // 全宗管理 (子菜单 1)
  | 'setting_archive_types'       // 档案类型管理 (子菜单 2)
  | 'setting_classification'      // 分类设置 (子菜单 3)
  | 'setting_catalog_tree'        // 目录树维护 (子菜单 4)
  | 'setting_retention_period'    // 保管期限 (子菜单 5)
  | 'setting_security_level'      // 密级 (子菜单 6)
  | 'setting_special_topics'      // 专题类型设置 (子菜单 7)
  | 'setting_metadata_rules'      // 著录项规则设置 (子菜单 8)
  | 'setting_default_permissions' // 默认数据权限 (子菜单 9)
  | 'setting_report_maintenance'  // 报表维护 (子菜单 10)
  | 'system_audit'       // 系统审计
  | 'my_account'         // 我的 (主)
  | 'my_favorites'       // 我的收藏 (子菜单 1)
  | 'my_borrows';        // 我的借阅 (子菜单 2)

// 1. 归档接收 (Archive Inflow)
export interface ArchiveInflowRecord {
  id: string;
  archiveNo: string;       // 归档编号
  title: string;           // 文件标题
  sourceSystem: string;    // 来源系统
  category: string;        // 档案门类
  dept: string;            // 移交部门
  transferor: string;      // 移交人
  time: string;            // 归档时间 (YYYY-MM-DD HH:mm:ss)
  metadataStatus: string;  // 元数据状态
  fourTestingResult: string; // 四性检测
  fileFormat: string;
  fileSize: string;
  summary: string;
}

// 2. 四性检测 (Four Testing Integrity)
export interface FourTestingRecord {
  id: string;
  checkNo: string;         // 检测单号
  archiveName: string;     // 档案名称
  fondsName: string;       // 全宗名称
  authenticity: '通过' | '复核' | '未验证'; // 真实性检测
  integrity: '完整' | '缺失附件' | '校验中'; // 完整性检测
  usability: '规范(OFD)' | '规范(PDF)' | '格式风险'; // 可用性检测
  security: '加密无毒' | '安全警告' | '扫描中'; // 安全性检测
  checkTime: string;       // 检测时间
  inspector: string;       // 检测人/系统
  conclusion: '合格' | '整改中' | '不合格'; // 检测结论
  detailMetrics: {
    authenticityScore: number;
    integrityScore: number;
    usabilityScore: number;
    securityScore: number;
    hashSignature: string;
  };
}

// 3. 档案检索与目录 (Archive Catalog)
export interface ArchiveCatalogRecord {
  id: string;
  archiveRefCode: string;  // 档号
  title: string;           // 题名
  fondsNo: string;         // 全宗号
  classNo: string;         // 分类号
  author: string;          // 责任者
  creationTime: string;    // 形成时间
  retentionPeriod: '永久' | '30年' | '10年'; // 保管期限
  securityLevel: '公开' | '内部' | '秘密' | '机密'; // 密级
  carrierType: '电子文件' | '纸质副本' | '音视频'; // 载体类型
  pageCount: number;
  keywords: string[];
  summary: string;
}

// 4. 档案借阅 (Archive Borrowing)
export interface ArchiveBorrowRecord {
  id: string;
  borrowNo: string;        // 借阅单号
  archiveRefCode: string;  // 借阅档号
  archiveTitle: string;    // 档案题名
  borrower: string;        // 借阅人
  dept: string;            // 所属部门
  purpose: string;         // 借阅目的
  borrowType: '电子查阅' | '纸质借阅' | '打印复制'; // 借阅方式
  applyTime: string;       // 申请时间
  expectedReturnTime: string; // 预计归还时间
  status: '待审批' | '已批准' | '已借出' | '已归还' | '已驳回' | '已逾期'; // 审批状态
  approveRemark?: string;
}

// 5. 鉴定与销毁 (Archive Disposal & Appraisal)
export interface ArchiveAppraisalRecord {
  id: string;
  batchNo: string;         // 鉴定批次号
  expiredCount: number;    // 到期档案数量
  fondsName: string;       // 所属全宗
  appraisalType: '到期销毁鉴定' | '划密鉴定' | '开放鉴定'; // 鉴定类型
  conclusion: '延期保管' | '解密公开' | '准予销毁' | '评审中'; // 鉴定结论
  initiator: string;       // 发起人
  appraisalTime: string;   // 鉴定时间
  appraisalTeam: string;   // 鉴定小组
  status: '待鉴定' | '审核中' | '已完成' | '已归档'; // 状态
  notes: string;
}

// 6. 系统管理与审计 (System Audit Log)
export interface SystemAuditRecord {
  id: string;
  logNo: string;           // 日志编号
  operator: string;        // 操作人员
  roleType: '系统管理员' | '安全保密员' | '安全审计员'; // 角色类别
  operationType: '登录认证' | '借阅审批' | '四性检测' | '权限变更' | '档案导出' | '数据销毁'; // 操作类型
  module: string;          // 操作模块
  ipAddress: string;       // IP地址
  operationTime: string;   // 操作时间
  result: '成功' | '警告' | '失败'; // 操作结果
  securityLevel: '普通' | '警告' | '高风险'; // 安全级别
  detail: string;
}
