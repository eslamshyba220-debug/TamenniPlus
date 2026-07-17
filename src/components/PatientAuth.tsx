/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Globe, Loader2, ArrowLeft } from 'lucide-react';
import { Language } from '../types';
import { dbService } from '../lib/supabase';

interface PatientAuthProps {
  language: Language;
  onClose: () => void;
  onSuccess: (patientData: any) => void;
}

export const PatientAuth: React.FC<PatientAuthProps> = ({
  language,
  onClose,
  onSuccess,
}) => {
  const isRtl = language === 'ar';
  const [loading, setLoading] = useState(false);

  const t = {
    title: isRtl ? 'تسجيل دخول المرضى' : 'Patient Portal Access',
    subtitle: isRtl 
      ? 'طمّني بلس يؤمن خصوصيتك بالكامل. تسجيل الدخول متاح حصرياً عبر حساب جوجل لضمان الهوية دون كلمات مرور.'
      : 'Tamny Plus values your privacy. Log in exclusively via secure Google OAuth with zero password entries.',
    googleBtn: isRtl ? 'الدخول باستخدام حساب جوجل' : 'Sign in with Google',
    warning: isRtl 
      ? 'ملاحظة: هذا الاتصال مؤمن بالكامل من خلال بروتوكولات حماية الهوية والبيانات الصحية للمرضى.'
      : 'Note: This portal complies with global encryption standards for clinical patients.',
    cancel: isRtl ? 'رجوع للرئيسية' : 'Back to Home'
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const currentSession = dbService.getLoggedInUser();
      if (currentSession?.role === 'patient' && currentSession.data) {
        setLoading(false);
        onSuccess(currentSession.data);
        return;
      }

      const dummyUser = {
        name: isRtl ? 'إسلام شيبة' : 'Eslam Shyba',
        email: 'eslamshyba220@gmail.com',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
      };

      const patient = await dbService.patientGoogleLogin(dummyUser);
      setLoading(false);
      onSuccess({ role: 'patient', data: patient });
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/40 backdrop-blur-md animate-fade-in">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-md bg-white rounded-3xl border border-border-brand p-8 shadow-premium relative overflow-hidden"
      >
        {/* Top Decorative Circle */}
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/5 rounded-full blur-2xl" />

        <div className="flex flex-col items-center text-center space-y-6">
          {/* Custom Google Styled Launcher Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
            <svg className="w-7 h-7" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#EA4335"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#4285F4"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-black text-text-dark font-display">{t.title}</h2>
            <p className="text-xs font-semibold text-text-muted leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <hr className="w-full border-border-brand/60" />

          {/* Social login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full h-12 rounded-xl border border-border-brand hover:bg-light-gray flex items-center justify-center gap-3 font-bold text-sm text-text-dark shadow-soft transition-all duration-300 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin text-primary" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
              </svg>
            )}
            <span>{t.googleBtn}</span>
          </button>

          {/* Secure details info */}
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3 text-right">
            <ShieldAlert size={18} className="text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] font-semibold text-primary leading-relaxed text-right">
              {t.warning}
            </p>
          </div>

          {/* Cancel button */}
          <button
            onClick={onClose}
            className="text-xs font-bold text-text-muted hover:text-text-dark flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} className={isRtl ? 'rotate-180' : ''} />
            <span>{t.cancel}</span>
          </button>

        </div>
      </motion.div>
    </div>
  );
};
export default PatientAuth;
