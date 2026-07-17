/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, User, Lock, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { Language } from '../types';
import { dbService } from '../lib/supabase';

interface DoctorAuthProps {
  language: Language;
  onClose: () => void;
  onSuccess: (sessionData: any) => void;
  onNavigateToRegister: () => void;
}

export const DoctorAuth: React.FC<DoctorAuthProps> = ({
  language,
  onClose,
  onSuccess,
  onNavigateToRegister,
}) => {
  const isRtl = language === 'ar';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    title: isRtl ? 'بوابة تسجيل أطباء طمني بلس' : 'Doctor Portal Login',
    subtitle: isRtl 
      ? 'سجل دخولك لمتابعة لوحة تحليلاتك، المرضى، العيادات والتحكم بملفك الطبي.'
      : 'Access your analytics dashboard, patient bookings, and update clinical profiles.',
    labelUser: isRtl ? 'اسم المستخدم أو البريد الإلكتروني' : 'Username or Email',
    labelPass: isRtl ? 'كلمة المرور' : 'Password',
    placeholderUser: isRtl ? 'اسم المستخدم أو البريد الإلكتروني' : 'Username or Email',
    placeholderPass: isRtl ? '••••••••' : '••••••••',
    btnSubmit: isRtl ? 'دخول آمن للملف' : 'Secure Sign In',
    btnNoAcc: isRtl ? 'ليس لديك حساب؟ انضم الآن كطبيب' : 'No account? Join as Doctor now',
    cancel: isRtl ? 'رجوع للرئيسية' : 'Back to Home',
    errInvalid: isRtl ? 'اسم المستخدم أو كلمة المرور غير صحيحة.' : 'Invalid credentials. Please try again.',
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setLoading(true);
    setError(null);

    // Short timeout to give a high-quality responsive feel
    setTimeout(async () => {
      try {
        try {
          const adminData = await dbService.adminLogin(username, password);
          setLoading(false);
          onSuccess({ role: 'admin', data: adminData });
          return;
        } catch (adminError) {
          if ((adminError as Error).message === 'ACCESS_DENIED') {
            setLoading(false);
            setError(isRtl ? 'تم رفض الوصول.' : 'Access denied.');
            return;
          }
        }

        try {
          const result = await dbService.doctorLogin(username, password);
          setLoading(false);
          onSuccess({ role: 'doctor', data: result.account, profile: result.profile });
        } catch (doctorError: any) {
          setLoading(false);
          setError(doctorError?.message || t.errInvalid);
        }
      } catch (err: any) {
        setLoading(false);
        setError(t.errInvalid);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/40 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl border border-border-brand p-8 shadow-premium relative overflow-hidden"
      >
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/5 rounded-full blur-2xl" />

        <div className="flex flex-col space-y-6">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-primary/5 text-primary flex items-center justify-center mx-auto mb-2">
              <ShieldCheck size={24} />
            </div>
            <h2 className="text-lg font-black text-text-dark font-display">{t.title}</h2>
            <p className="text-xs font-semibold text-text-muted leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <hr className="border-border-brand/60" />

          {/* Form */}
          <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex gap-2 text-red-600 text-xs font-bold">
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                {t.labelUser}
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-text-muted" size={16} />
                <input
                  type="text"
                  name="username"
                  autoComplete="off"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.placeholderUser}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border-brand focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold text-text-dark"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                {t.labelPass}
              </label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 text-text-muted" size={16} />
                <input
                  type="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.placeholderPass}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-border-brand focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold text-text-dark"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl gradient-bg gradient-bg-hover text-white flex items-center justify-center gap-2 font-bold text-sm shadow-premium transition-transform duration-300 hover:scale-102 cursor-pointer mt-2 disabled:opacity-50"
            >
              {loading && <Loader2 size={16} className="animate-spin text-white" />}
              <span>{t.btnSubmit}</span>
            </button>
          </form>

          {/* Navigations */}
          <div className="text-center space-y-4">
            <button
              onClick={() => {
                onClose();
                onNavigateToRegister();
              }}
              className="text-xs font-bold text-primary hover:text-secondary hover:underline transition-all"
            >
              {t.btnNoAcc}
            </button>

            {/* Back to Home */}
            <div>
              <button
                onClick={onClose}
                className="text-xs font-bold text-text-muted hover:text-text-dark inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft size={14} className={isRtl ? 'rotate-180' : ''} />
                <span>{t.cancel}</span>
              </button>
            </div>
          </div>


        </div>
      </motion.div>
    </div>
  );
};
export default DoctorAuth;
