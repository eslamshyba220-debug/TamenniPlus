/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Stethoscope, CalendarDays, FileText, Lock, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface TermsOfServiceProps {
  language: Language;
  onNavigate: (view: string) => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({ language, onNavigate }) => {
  const isRtl = language === 'ar';

  const sections = [
    {
      title: 'مقدمة',
      content: 'تُقدم منصة طمني بلس خدمة ربط موثوقة بين المرضى والأطباء والأخصائيين، مع الاهتمام بتوفير تجربة مهنية آمنة وسلسة في عملية البحث والحجز والمتابعة.',
    },
    {
      title: 'تعريف المنصة',
      content: 'تُعد طمني بلس منصة رقمية متكاملة تُمكّن المستخدمين من الاطّلاع على ملفات طبية موثوقة، ومقارنة التخصصات، وحجز المواعيد الطبية إلكترونيًا في إطار احترافي واضح.',
    },
    {
      title: 'قبول الشروط',
      content: 'يُعد استمرار المستخدم في استخدام المنصة قبولًا صريحًا لهذه الشروط. وفي حال عدم الموافقة، يُنصح بعدم استخدام خدمات المنصة أو التواصل مع الأطباء عبر النظام.',
    },
    {
      title: 'حسابات المستخدمين',
      content: 'يتعين على المستخدمين الحفاظ على سرية بيانات حساباتهم والتأكد من دقة المعلومات المقدمة، كما يُمنع مشاركة بيانات الدخول مع أطراف أخرى أو استخدامها بطرق غير مصرح بها.',
    },
    {
      title: 'مسؤولية المرضى',
      content: 'يتحمل المريض مسؤولية تقديم بيانات دقيقة، والالتزام بمواعيد الحجز، والاعتماد على الاستشارات الطبية الرسمية من خلال الأطباء المختصين على المنصة.',
    },
    {
      title: 'مسؤولية الأطباء والأخصائيين',
      content: 'يتحمل الأطباء والأخصائيون مسؤولية صحة المعلومات المهنية المنشورة في ملفاتهم، والالتزام بالمواعيد، والمعايير المهنية، وتقديم المشورة الطبية ضمن حدود اختصاصهم.',
    },
    {
      title: 'سياسة الحجز',
      content: 'يُعتبر طلب الحجز عبر المنصة بمثابة طلب رسمي، وتقوم طمني بلس بتوجيهه للطبيب أو الأخصائي المختار. وتخضع الموافقة على الحجز لتوفر الطبيب وسياسة الجدولة الخاصة به.',
    },
    {
      title: 'سياسة الإلغاء',
      content: 'يُطلب من المستخدمين والأطباء احترام شروط الإلغاء وإعادة الجدولة المتاحة عبر المنصة. وقد تُطبّق قيود أو شروط إضافية بناءً على الإجراءات المتفق عليها مع مقدم الخدمة.',
    },
    {
      title: 'التقييمات',
      content: 'تُتيح المنصة إمكانية تقييم الأطباء والخدمات الطبية بعد تجربة حقيقية. يجب أن تكون التقييمات موضوعية، ومبنية على تجربة فعلية دون إساءة أو تشويه لصورة المختصين.',
    },
    {
      title: 'المحتوى الطبي',
      content: 'تعتمد المنصة على توفير المعلومات العامة ولا تُقدّم تشخيصًا طبيًا نهائيًا. وفي الحالات الصحية الحرجة، يجب الرجوع إلى الطبيب المختص وإجراء الفحص الطبي المباشر.',
    },
    {
      title: 'حماية البيانات',
      content: 'نلتزم بحماية بيانات المستخدمين باستخدام ممارسات أمنية معتمدة لحفظ الخصوصية، ومنع الوصول غير المصرح به، والحد من أي استخدام ضار للمعلومات الشخصية.',
    },
    {
      title: 'الملكية الفكرية',
      content: 'تُعد جميع المحتويات والبرمجيات والشعارات في المنصة ملكًا لطمني بلس أو للجهات المرخّصة لها، ولا يجوز نسخها أو إعادة نشرها أو استخدامها دون إذن صريح.',
    },
    {
      title: 'حدود المسؤولية',
      content: 'تُقدم طمني بلس خدماتها كوسيط لتسهيل التواصل، ولا تتحمل مسؤولية الأضرار الناتجة عن المحتوى الطبي أو نتائج العلاج التي تعتمد على قرار الطبيب بعد الاستشارة المباشرة.',
    },
    {
      title: 'تعديل الشروط',
      content: 'يحتفظ الموقع بالحق في تعديل هذه الشروط من وقت لآخر. ويُعد استمرار المستخدم في استخدام المنصة بعد التحديث قبولًا ضمنيًا للشروط الجديدة.',
    },
    {
      title: 'التواصل معنا',
      content: 'للاستفسارات أو المنح أو الملاحظات حول شروط الاستخدام، يُمكن التواصل مع فريق دعم طمني بلس عبر وسائل الاتصال المتاحة في صفحة التواصل الرسمية.',
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
                  <span>{isRtl ? 'شروط الخدمة' : 'Terms of Service'}</span>
                </div>
                <h1 className="mt-4 text-3xl sm:text-4xl font-black font-display text-text-dark">
                  {isRtl ? 'شروط الخدمة' : 'Terms of Service'}
                </h1>
                <p className="mt-3 text-sm sm:text-base font-medium text-text-muted leading-8">
                  {isRtl
                    ? 'تُحدد هذه الشروط آلية استخدام منصتنا وتعزز تجربة طبية احترافية بين المرضى والأطباء والأخصائيين.'
                    : 'These terms define how our platform is used and support a professional medical experience between patients, doctors and specialists.'}
                </p>
              </div>

              <div className="rounded-2xl border border-border-brand bg-white/80 px-4 py-3 shadow-soft text-sm font-semibold text-text-dark">
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-primary" />
                  <span>{isRtl ? 'منصة طبية آمنة' : 'Secure medical platform'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 grid gap-4">
            {sections.map((section, index) => (
              <section key={section.title} className="rounded-2xl border border-border-brand bg-off-white p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index === 0 ? <FileText size={16} /> : index === 4 ? <Sparkles size={16} /> : index === 5 ? <CalendarDays size={16} /> : <Lock size={16} />}
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

export default TermsOfService;
