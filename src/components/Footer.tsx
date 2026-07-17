/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Phone, Mail, Globe, CheckCircle } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  language: Language;
  onNavigate: (target: string) => void;
  onDoctorRegister: () => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate, onDoctorRegister }) => {
  const isRtl = language === 'ar';

  const links = [
    { label: isRtl ? 'الرئيسية' : 'Home', target: 'home' },
    { label: isRtl ? 'التخصصات' : 'Specialties', target: 'specialties' },
    { label: isRtl ? 'عن المنصة' : 'About', target: 'about' },
    { label: isRtl ? 'الأسئلة الشائعة' : 'FAQ', target: 'faq' },
  ];

  return (
    <footer id="contact" className="bg-white border-t border-border-brand text-text-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white shadow-premium">
                <img src="/logo.png" alt="Tamenni Plus logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <p className="text-lg font-bold font-display">{isRtl ? 'طمّني بلس' : 'Tamenni Plus'}</p>
                <p className="text-xs text-text-muted font-medium leading-relaxed max-w-[18rem]">
                  {isRtl
                    ? 'منصة طبية عربية لحجز أفضل الأطباء المعتمدين بسهولة وأمان.'
                    : 'The Arabic medical directory for verified doctors and trusted clinical bookings.'}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-text-muted font-semibold">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                <span>{isRtl ? 'الأسكندرية' : 'Alexandria, Egypt'}</span>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  <a
                    href="tel:+201555523686"
                    className="ltr-text text-text-dark hover:text-primary transition-colors"
                  >
                    +20 155 552 3686
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-primary" />
                  <a
                    href="tel:+201551754897"
                    className="ltr-text text-text-dark hover:text-primary transition-colors"
                  >
                    +20 155 175 4897
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-primary" />
                <a
                  href="mailto:tamenniplus2026@gmail.com"
                  className="ltr-text text-text-dark hover:text-primary transition-colors"
                >
                  tamenniplus2026@gmail.com
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-dark mb-4">
              {isRtl ? 'روابط سريعة' : 'Quick Links'}
            </h3>
            <ul className="space-y-2 text-sm font-semibold text-text-muted">
              {links.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate(link.target)}
                    className="hover:text-primary transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onDoctorRegister}
                  className="hover:text-primary transition-colors"
                >
                  {isRtl ? 'انضم كطبيب' : 'Join as Doctor'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-dark mb-4">
              {isRtl ? 'خدماتنا' : 'Our Services'}
            </h3>
            <ul className="space-y-2 text-sm font-semibold text-text-muted">
              <li>{isRtl ? 'بحث الطبيبات والأطباء' : 'Doctor Search'}</li>
              <li>{isRtl ? 'حجز المواعيد الطبية' : 'Appointment Booking'}</li>
              <li>{isRtl ? 'تواصل واتساب فوري' : 'Instant WhatsApp Support'}</li>
              <li>{isRtl ? 'دليل متخصصين موثوق' : 'Verified Specialist Directory'}</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-dark mb-4">
              {isRtl ? 'الأمان والموثوقية' : 'Trust & Safety'}
            </h3>
            <ul className="space-y-3 text-sm text-text-muted font-semibold">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                <span>{isRtl ? 'توثيق نقابة الأطباء' : 'Syndicate Verified'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                <span>{isRtl ? 'حماية بيانات المستخدم' : 'User Data Protection'}</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                <span>{isRtl ? 'دعم فني على مدار الساعة' : '24/7 Support'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border-brand/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-text-muted font-semibold">
          <p>
            © {new Date().getFullYear()} {isRtl ? 'طمّني بلس' : 'Tamenni Plus'}. {isRtl ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('terms')}
              className="hover:text-primary transition-colors"
            >
              {isRtl ? 'شروط الخدمة' : 'Terms of Service'}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('privacy')}
              className="hover:text-primary transition-colors"
            >
              {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
