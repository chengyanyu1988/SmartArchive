import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Download,
  Printer,
  ExternalLink,
  Award,
  Calendar,
  Building2,
  Lock,
  User,
  Eye,
  FileCode,
  Layers,
  History,
  CheckSquare,
  FileSpreadsheet,
  File,
} from 'lucide-react';

interface ModalDetailProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  data: any;
  type: 'inflow' | 'four_testing' | 'catalog' | 'borrow' | 'disposal' | 'audit';
  onActionSuccess?: (msg: string) => void;
}

export const ModalDetail: React.FC<ModalDetailProps> = ({
  isOpen,
  title,
  onClose,
  data,
  type,
  onActionSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'metadata' | 'preview' | 'audit'>('metadata');

  if (!isOpen || !data) return null;

  // Extract universal reference code and title
  const refCode =
    data.refCode ||
    data.archiveRefCode ||
    data.archiveNo ||
    data.checkNo ||
    data.borrowNo ||
    data.batchNo ||
    '0110-WS·2026-Y-BGS-0001';

  const docTitle =
    data.title ||
    data.archiveName ||
    '成都市住房和城乡建设局归档电子文件';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-3 min-w-0 pr-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                  {docTitle}
                </h3>
              </div>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 font-mono mt-0.5">
                档号 / 编号: {refCode}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-6">
          <button
            onClick={() => setActiveTab('metadata')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'metadata'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>条目元数据卡片</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>OFD/PDF 正文预览</span>
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`py-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'audit'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>流转与国密验签日志</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-700 dark:text-slate-300 font-mono">
          {activeTab === 'metadata' && (
            <div className="space-y-5">
              {/* Document Overview Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white font-sans flex items-center justify-between">
                  <span>文件基本属性与法律效力声明</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                    DA/T 46-2009 元数据合规
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-sans leading-relaxed text-[11px]">
                  本档案电子记录已通过全流程四性检测与国密SM3杂交哈希算法固化，满足《中华人民共和国档案法》及国家档案局电子档案单套制归档规范。
                </p>
              </div>

              {/* Grid Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">文件题名 / 案卷名称</span>
                  <p className="font-sans font-bold text-slate-900 dark:text-white text-xs">{docTitle}</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">全宗名称 / 全宗号</span>
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    {data.fondsName || data.orgUnit || '成都市住房和城乡建设局全宗'} ({data.fondsNo || '0110'})
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">标准档号</span>
                  <p className="font-bold text-blue-600 dark:text-blue-400">{refCode}</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">发文字号 / 文号</span>
                  <p className="font-medium text-slate-800 dark:text-slate-200">{data.docNo || data.checkNo || '成住建发〔2026〕18号'}</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">责任者 / 移交单位</span>
                  <p className="font-sans font-semibold text-slate-800 dark:text-slate-200">
                    {data.author || data.transferor || data.inspector || '成都市住房和城乡建设局'}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">成文日期 / 形成时间</span>
                  <p className="text-slate-800 dark:text-slate-200">{data.writtenDate || data.writtenTime || data.time || '2026-11-05'}</p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">归档单位 / 归档日期</span>
                  <p className="text-slate-800 dark:text-slate-200">
                    {data.unit || data.dept || '局档案馆'} · {data.archivedDate || '2026-11-02'}
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">密级等级 / 保管期限</span>
                  <p className="text-slate-800 dark:text-slate-200">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold mr-2">
                      {data.securityLevel || '秘密'}
                    </span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      {data.retention || data.retentionPeriod || '30年'}
                    </span>
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                  <span className="text-[11px] text-slate-400 font-sans block mb-1">档案来源 / 包含件数</span>
                  <p className="text-slate-800 dark:text-slate-200">
                    {data.source || data.sourceSystem || 'OA归档系统'} {data.fileCount ? `(${data.fileCount}件)` : ''}
                  </p>
                </div>
              </div>

              {/* Security & Four-Testing Integrity */}
              <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 space-y-2">
                <div className="flex items-center justify-between font-sans font-bold text-blue-900 dark:text-blue-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>四性检测最终判定</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-mono">100 / 100 分 (满分合格)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1 border-t border-blue-200/60 dark:border-blue-900">
                  <div>真实性: <strong className="text-emerald-600 dark:text-emerald-400">国密验签通过</strong></div>
                  <div>完整性: <strong className="text-emerald-600 dark:text-emerald-400">附件与元数据完整</strong></div>
                  <div>可用性: <strong className="text-emerald-600 dark:text-emerald-400">OFD版式合规</strong></div>
                  <div>安全性: <strong className="text-emerald-600 dark:text-emerald-400">无病毒与木马风险</strong></div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-850 text-white border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="font-bold text-xs">{docTitle}.ofd</div>
                    <div className="text-[10px] text-slate-400">国密版式电子文件 · 包含红头文件电子印章与时间戳</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onActionSuccess?.(`已启动 ${docTitle} 原件全屏高清渲染模式`)}
                    className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>全屏浏览</span>
                  </button>
                </div>
              </div>

              {/* Reader Mockup */}
              <div className="min-h-[320px] rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 p-6 flex flex-col items-center justify-center space-y-4 shadow-inner">
                <div className="w-full max-w-lg p-8 bg-white dark:bg-slate-900 rounded-lg shadow-md border border-slate-200 dark:border-slate-800 space-y-4 text-slate-800 dark:text-slate-200">
                  <div className="text-center border-b border-red-500 pb-3 space-y-1">
                    <div className="text-red-600 font-extrabold text-base font-serif tracking-widest">
                      成都市住房和城乡建设局文件
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">{data.docNo || '成住建发〔2026〕18号'}</div>
                  </div>

                  <div className="text-center font-bold text-sm py-2">{docTitle}</div>

                  <p className="text-xs font-sans leading-relaxed text-slate-600 dark:text-slate-400 indent-6">
                    各区（市）县住建行政主管部门、局属各单位：为进一步推进政务服务标准化与档案数字化规范建设，特制定本实施细则，请各部门认真贯彻执行……
                  </p>

                  <div className="pt-6 flex justify-end">
                    <div className="text-center space-y-1">
                      <div className="w-20 h-20 rounded-full border-2 border-red-500 text-red-500 flex items-center justify-center text-[10px] font-bold font-serif rotate-[-12deg] opacity-80 shadow-xs">
                        成都市住建局
                        <br />
                        电子归档专用章
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">2026年11月28日</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="space-y-4">
              <div className="text-xs font-bold text-slate-900 dark:text-white font-sans">
                全生命周期电子档案流转时间轴
              </div>

              <div className="space-y-3 relative pl-4 border-l-2 border-blue-500 dark:border-blue-600 ml-2">
                {[
                  {
                    title: '业务系统电子文件归集发送',
                    time: '2026-11-03 10:15:20',
                    user: 'OA系统自动化节点',
                    desc: '系统通过通用接口推送 OFD 格式红头文件及元数据 xml 封装包。',
                  },
                  {
                    title: '四性合规自动检测与国密验签',
                    time: '2026-11-03 10:15:22',
                    user: '四性检测引擎 (SM3/SM2)',
                    desc: '真实性与完整性检测打分 100 分，数字证书有效且无修改痕迹。',
                  },
                  {
                    title: '档案收集列表归入',
                    time: '2026-11-03 10:16:00',
                    user: '张审查 (归档管理员)',
                    desc: '完成基础目录核查与全宗分类绑定，生成临时接收流水号。',
                  },
                  {
                    title: '完成智能组卷与正式归档入库',
                    time: '2026-11-04 09:30:00',
                    user: '李归档 (三员独立审计管理员)',
                    desc: '通过EEP封包算法固化写入只读存储盘，成功编制全宗标准档号。',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="relative space-y-1 bg-slate-50 dark:bg-slate-850 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="w-3 h-3 rounded-full bg-blue-600 absolute -left-[23px] top-3 border-2 border-white dark:border-slate-900"></div>
                    <div className="flex items-center justify-between font-sans">
                      <span className="font-bold text-slate-900 dark:text-white">{item.title}</span>
                      <span className="text-slate-400 text-[10px]">{item.time}</span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 font-sans text-[11px]">{item.desc}</p>
                    <div className="text-[10px] text-blue-600 dark:text-blue-400 font-mono">操作员: {item.user}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            数字签名状态: <strong className="text-emerald-600 dark:text-emerald-400">SM3-HMAC-VALID</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onActionSuccess?.(`已成功导出档案 [${docTitle}] 的完整 PDF 原件与元数据清册`);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>下载归档原文包</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 text-xs font-medium transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
