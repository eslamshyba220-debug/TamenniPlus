/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Stethoscope, CalendarDays, FileText, Lock, Sparkles } from 'lucide-react';
import { Language } from '../types';

interface TermsOfServicePageProps {
  language: Language;
  onNavigate: (view: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ language, onNavigate }) => {
  const isRtl = language === 'ar';

  const sections = [
    {
      title: 'مقدمة',
      content: 'تُقدّم منصة طمني بلس خدمة إلكترونية تربط المرضى بالأطباء والأخصائيين المعتمدين، بهدف تسهيل الوصول إلى الرعاية الصحية مع الالتزام بالمعايير المهنية والأخلاقية والخصوصية.',
    },
    {
      title: 'تعريف المنصة',
      content: 'تُعدّ طمني بلس منصة رقمية تُتيح للمرضى البحث عن الأطباء والأخصائيين، ومراجعة ملفاتهم، وحجز المواعيد إلكترونيًا، مع توفير معلومات دقيقة ومحدثة عن التخصصات والخدمات الطبية.',
    },
    {
      title: 'قبول الشروط',
      content: 'باستخدامك للمنصة فإنك توافق على الالتزام بهذه الشروط، بما في ذلك السلوك المتوافق مع القيم الطبية والاحترافية، وعدم استخدام المنصة في أنشطة غير قانونية أو مسيئة أو مضللة.',
    },
    {
      title: 'مسؤولية المستخدم',
      content: 'يُتحمل المستخدم مسؤولية تقديم معلومات صحيحة عند الحجز أو التواصل مع الأطباء، والالتزام بالموعد، وتجنب أي استخدام غير مشروع أو مضلل للمنصة أو معلوماتها.',
    },
    {
      title: 'مسؤولية الأطباء والأخصائيين',
      content: 'يتحمل الأطباء والأخصائيون مسؤولية دقة بياناتهم المهنية، وملفاتهم الطبية، ومعلومات التخصص والخدمات، والالتزام بالمعايير المهنية والأخلاقية في التعامل مع المرضى.',
    },
    {
      title: 'سياسة حجز المواعيد',
      content: 'يُعتبر الحجز عبر المنصة طلبًا رسميًا، ويتم إكماله وفقًا للمتاح من الطبيب أو الأخصائي. قد تُراجع الطلبات أو تُقبل أو تُرفض وفقًا لسياسات التوفر والجدولة.',
    },
    {
      title: 'سياسة الإلغاء',
      content: 'يجب على المستخدم أو الطبيب/الأخصائي الالتزام بآلية الإلغاء أو إعادة الجدولة المتاحة في المنصة، مع مراعاة مبدأ الاحترام والالتزام بالوقت والموعد المتفق عليه.',
    },
    {
      title: 'التقييمات والمراجعات',
      content: 'تُتاح للمستخدمين فرصة تقييم الخدمات الطبية أو مراجعة التجربة، ويجب أن تكون التقييمات صادقة ومبنية على تجربة حقيقية دون الإساءة أو نشر معلومات غير دقيقة.',
    },
    {
      title: 'المحتوى الطبي',
      content: 'لا تُقدم المنصة تشخيصًا طبيًا أو نصائح علاجية بديلة عن الاستشارة الطبية الرسمية، ويجب على المستخدمين مراجعة الطبيب المختص في الحالات الطبية الحرجة أو غير المعلومة.',
    },
    {
      title: 'حماية الحساب',
      content: 'يلتزم المستخدم بحماية بيانات حسابه وعدم مشاركة بيانات الدخول أو المعلومات الخاصة مع أطراف ثالثة، وفي حال الاشتباه في أي اختراق يُطلب التواصل مع الدعم فورًا.',
    },
    {
      title: 'الملكية الفكرية',
      content: 'جميع الحقوق في المنصة، وشكلها، ومحتواها، والشعارات، والبرمجيات، والبيانات المعروضة تُعد ملكية خاصة بالمنصة أو المرخصين لها، ويُمنع نسخها أو إعادة استخدامها دون إذن.',
    },
    {
      title: 'حدود المسؤولية',
      content: 'تُقدّم المنصة خدماتها على أساس “كما هي” بهدف التسهيل والربط بين الأطراف، ولا تتحمل المسؤولية عن أي أضرار غير مباشرة أو نتائج تتعلق بالخدمات الطبية خارج نطاق المنصة.',
    },
    {
      title: 'تعديل الشروط',
      content: 'تحتفظ المنصة بالحق في تحديث هذه الشروط أو تعديلها من وقت لآخر، ويُعتمد نشرها على المنصة مع مراعاة أن الاستمرار في الاستخدام بعد التعديل يُعد قبولًا لها.',
    },
    {
      title: 'التواصل معنا',
      content: 'للاستفسار أو تقديم الملاحظات أو طلب الدعم، يُرجى الاتصال بفريق طمني بلس عبر وسائل التواصل أو البريد المعلن في الصفحة الخاصة بالاتصال.',
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
                    ? 'تُحدد هذه الشروط إطار الاستخدام الذي يضمن تجربة طبية موثوقة وآمنة على منصة طمني بلس.'
                    : 'These terms define the usage framework that ensures a trusted and secure medical experience on Tamny Plus.'}
                </p>
              </div>

              <div className="rounded-2xl border border-border-brand bg-white/80 px-4 py-3 shadow-soft text-sm font-semibold text-text-dark">
                <div className="flex items-center gap-2">
                  <Stethoscope size={16} className="text-primary" />
                  <span>{isRtl ? 'منصة طبية موثوقة' : 'Trusted medical platform'}</span>
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

export default TermsOfServicePage;
