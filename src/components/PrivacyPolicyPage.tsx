/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Lock, EyeOff, Cookie, Trash2, Mail } from 'lucide-react';
import { Language } from '../types';

interface PrivacyPolicyPageProps {
  language: Language;
  onNavigate: (view: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ language, onNavigate }) => {
  const isRtl = language === 'ar';

  const sections = [
    {
      title: 'مقدمة',
      content: 'نحن في طمني بلس نلتزم بحماية خصوصية بيانات المستخدمين، ونحافظ على المعلومات الشخصية التي نحتاجها لتقديم خدمات موثوقة وسلسة للأطباء والمرضى على حد سواء.',
    },
    {
      title: 'البيانات التي نجمعها',
      content: 'قد نجمع معلومات شخصية أساسية مثل الاسم، والبريد الإلكتروني، ورقم الهاتف، ومعلومات الحساب، إلى جانب البيانات اللازمة لحجز المواعيد أو التواصل مع الأطباء أو الأخصائيين.',
    },
    {
      title: 'كيفية استخدام البيانات',
      content: 'نستخدم البيانات لإدارة الحسابات، وتسهيل الحجز، وتحسين تجربة المستخدم، وتقديم الدعم الفني، وضمان العمل السلس للمنصة وفقًا للسياسات المعتمدة.',
    },
    {
      title: 'ملفات تعريف الارتباط (Cookies)',
      content: 'تستخدم المنصة ملفات تعريف الارتباط لتحسين الأداء، وتذكر تفضيلات المستخدم، وتوفير تجربة أكثر سلاسة أثناء التصفح داخل الموقع.',
    },
    {
      title: 'مشاركة البيانات',
      content: 'لا نشارك بيانات المستخدمين مع أطراف ثالثة إلا في الحالات التي تكون ضرورية لتشغيل الخدمة أو الامتثال للالتزامات القانونية أو التنظيمية.',
    },
    {
      title: 'حماية البيانات',
      content: 'نطبق إجراءات أمنية مناسبة لحماية البيانات من الوصول غير المصرح به أو الفقدان أو الاستخدام غير المشروع، مع اعتماد المعايير التقنية المناسبة.',
    },
    {
      title: 'الاحتفاظ بالبيانات',
      content: 'نحتفظ بالبيانات طالما كان ذلك ضروريًا لتقديم الخدمة، أو الامتثال لالتزاماتنا القانونية، أو إدارة الحسابات والطلبات المرتبطة بالمنصة.',
    },
    {
      title: 'حقوق المستخدم',
      content: 'يحق للمستخدم الاطلاع على بياناته أو تصحيحها أو تحديثها، مع إمكانية طلب معلومات إضافية حول الاستخدام الذي نُجريه للبيانات.',
    },
    {
      title: 'حذف الحساب',
      content: 'يمكن للمستخدم طلب حذف الحساب أو إيقاف معالجة البيانات المرتبطة به من خلال التواصل مع الدعم، وفقًا لسياسات المنصة واللوائح المعمول بها.',
    },
    {
      title: 'التواصل معنا',
      content: 'لأي استفسار أو طلب يتعلق بالخصوصية، يُرجى التواصل مع فريق طمني بلس عبر البريد أو وسائل التواصل المعلنة على المنصة.',
    },
  ];

  return (
    <div className="min-h-screen bg-off-white text-text-dark">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[2rem] border border-border-brand bg-white shadow-soft overflow-hidden"
        >
          <div className="bg-gradient-to-r from-primary/10 via-white to-secondary/10 p-8 sm:p-12">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="inline-flex items-center gap-2 text-sm font-semibold text-text-dark hover:text-primary transition-colors"
            >
              <ArrowLeft size={16} className={isRtl ? 'rotate-180' : ''} />
              <span>{isRtl ? 'العودة إلى الرئيسية' : 'Back to Home'}</span>
            </button>

            <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-primary shadow-soft border border-border-brand">
                  <ShieldCheck size={14} />
                  <span>{isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}</span>
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-black font-display text-text-dark">
                  {isRtl ? 'سياسة الخصوصية' : 'Privacy Policy'}
                </h1>
                <p className="mt-3 text-sm sm:text-base font-medium text-text-muted leading-8">
                  {isRtl
                    ? 'نحن نحرص على حماية بياناتك الشخصية ومعالجة المعلومات بوضوح وأمان في كل خطوة على منصة طمني بلس.'
                    : 'We are committed to protecting your personal data and handling information with clarity and care across the Tamny Plus experience.'}
                </p>
              </div>

              <div className="rounded-2xl border border-border-brand bg-white/80 px-4 py-3 shadow-soft text-sm font-semibold text-text-dark">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-primary" />
                  <span>{isRtl ? 'حماية بيانات المستخدم' : 'User data protection'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 grid gap-4">
            {sections.map((section, index) => (
              <section key={section.title} className="rounded-2xl border border-border-brand bg-off-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index === 0 ? <EyeOff size={16} /> : index === 3 ? <Cookie size={16} /> : index === 8 ? <Trash2 size={16} /> : index === 9 ? <Mail size={16} /> : <ShieldCheck size={16} />}
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-text-dark">{section.title}</h2>
                    <p className="mt-2 text-sm sm:text-base leading-8 text-text-muted font-medium">
                      {section.content}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
