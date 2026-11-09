import React, { useState } from 'react';
import { Archive, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import bgImage from '../assets/images/archive_login_bg_1794019923002.jpg';

interface LoginViewProps {
  onLoginSuccess: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('adimin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsername = username.trim();
    if (!cleanUsername) {
      setErrorMsg('请输入登录账号');
      return;
    }
    if (!password.trim()) {
      setErrorMsg('请输入登录密码');
      return;
    }

    // 严格限制账号和密码：账号只能为 adimin，密码只能为 admin123
    if (cleanUsername !== 'adimin' || password !== 'admin123') {
      setErrorMsg('账号或密码错误，仅允许账号 adimin 与密码 admin123 登录');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    // Simulated authenticating latency for smooth UX
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 600);
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950 font-sans select-none">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Dark Gradient Mask Overlays */}
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[4px] bg-gradient-to-t from-slate-950 via-slate-950/50 to-slate-950/70" />

      {/* Centered Login Card Container */}
      <div className="relative z-10 w-full max-w-md px-4 py-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl border border-white/20 dark:border-slate-800/80 rounded-3xl shadow-2xl overflow-hidden p-8 sm:p-10 space-y-7">
          
          {/* Top Branding Section */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/30 ring-4 ring-blue-500/10">
              <Archive className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                档案智能管理平台
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
                数字档案馆安全访问与全宗管控中枢
              </p>
            </div>
          </div>

          {/* Error Notice if any */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-center gap-2 animate-in fade-in duration-150">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Pure Login Form (Account & Password Only) */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                账号
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  placeholder="请输入登录账号"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                密码
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入登录密码"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-slate-800/80 text-slate-900 dark:text-white text-xs font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1"
                  title={showPassword ? '隐藏密码' : '显示密码'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer group mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>正在登录...</span>
                </>
              ) : (
                <>
                  <span>登 录</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Security Note */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>三员独立安全审计系统保护中</span>
          </div>

        </div>
      </div>
    </div>
  );
};
