/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Keywords Research and Strategy
 * Comprehensive keyword lists for Arabic and English
 */

export const keywordsStrategy = {
  primary: {
    ar: [
      'طبيب',
      'دكتور',
      'أفضل دكتور',
      'حجز دكتور',
      'احجز كشف',
      'منصة طبية',
      'ابحث عن طبيب',
      'عيادة طبية',
      'دكتور متخصص'
    ],
    en: [
      'Doctor',
      'Find Doctor',
      'Book Doctor',
      'Medical Platform',
      'Healthcare',
      'Clinic',
      'Medical Services',
      'Doctor Booking',
      'Best Doctor'
    ]
  },

  specialties: {
    ar: {
      'pediatrics': ['دكتور أطفال', 'طبيب أطفال', 'عيادة أطفال'],
      'orthopedics': ['دكتور عظام', 'طبيب عظام', 'جراح عظام'],
      'dermatology': ['دكتور جلدية', 'طبيب جلدية', 'أمراض جلدية'],
      'cardiology': ['دكتور قلب', 'طبيب القلب', 'أمراض القلب'],
      'obstetrics': ['دكتور نساء', 'طبيب نساء', 'توليد'],
      'neurology': ['دكتور أعصاب', 'طبيب أعصاب', 'أمراض عصبية'],
      'oncology': ['دكتور أورام', 'طبيب أورام', 'السرطان'],
      'urology': ['دكتور مسالك بولية', 'طبيب مسالك'],
      'psychiatry': ['دكتور نفسي', 'طبيب نفسي', 'الصحة النفسية']
    },
    en: {
      'pediatrics': ['Pediatrician', 'Child Doctor', 'Kids Doctor'],
      'orthopedics': ['Orthopedic Doctor', 'Bone Doctor', 'Joint Specialist'],
      'dermatology': ['Dermatologist', 'Skin Doctor', 'Skin Specialist'],
      'cardiology': ['Cardiologist', 'Heart Doctor', 'Cardiac Specialist'],
      'obstetrics': ['OB/GYN', 'Women\'s Doctor', 'Gynecologist'],
      'neurology': ['Neurologist', 'Nerve Doctor', 'Brain Specialist'],
      'oncology': ['Oncologist', 'Cancer Doctor', 'Cancer Specialist'],
      'urology': ['Urologist', 'Urinary Specialist'],
      'psychiatry': ['Psychiatrist', 'Mental Health Doctor', 'Psychologist']
    }
  },

  longTail: {
    ar: [
      'أفضل دكتور في السعودية',
      'حجز موعد دكتور أون لاين',
      'دكتور متخصص بالقرب مني',
      'تقييم الأطباء والعيادات',
      'خدمة حجز المواعيد الطبية',
      'منصة البحث عن الأطباء',
      'استشارة طبية أون لاين',
      'دكتور معتمد وموثوق',
      'أسعار الكشف الطبي',
      'تقييمات المرضى على الأطباء'
    ],
    en: [
      'Best Doctors in Saudi Arabia',
      'Online Doctor Appointment Booking',
      'Find Doctor Near Me',
      'Doctor Ratings and Reviews',
      'Medical Appointment Platform',
      'Healthcare Directory',
      'Online Doctor Consultation',
      'Verified and Trusted Doctors',
      'Consultation Fee',
      'Patient Reviews'
    ]
  },

  transactional: {
    ar: [
      'احجز عند الدكتور',
      'سجل كطبيب',
      'انضم لمنصة طبية',
      'زيارة طبية',
      'موعد دكتور',
      'كشف طبي',
      'استشارة دكتور',
      'حساب المريض'
    ],
    en: [
      'Book Doctor Appointment',
      'Register as Doctor',
      'Join Medical Platform',
      'Medical Visit',
      'Doctor Appointment',
      'Medical Check-up',
      'Doctor Consultation',
      'Patient Account'
    ]
  },

  branded: {
    ar: [
      'طمني بلس',
      'منصة طمني',
      'تطبيق طمني',
      'موقع طمني'
    ],
    en: [
      'Tamenni Plus',
      'Tamenni Platform',
      'Tamenni App',
      'Tamenni Website'
    ]
  },

  informational: {
    ar: [
      'كيفية اختيار أفضل دكتور',
      'أعراض الأمراض الشائعة',
      'نصائح صحية',
      'معلومات طبية',
      'دليل الأطباء والعيادات'
    ],
    en: [
      'How to Choose a Good Doctor',
      'Common Disease Symptoms',
      'Health Tips',
      'Medical Information',
      'Doctor and Clinic Guide'
    ]
  }
};

/**
 * Get keywords for a specific context
 */
export function getKeywords(context: 'primary' | 'specialty' | 'longTail' | 'transactional' | 'branded' | 'informational', language: 'ar' | 'en', specialty?: string) {
  if (context === 'specialty' && specialty) {
    const specialtiesData = keywordsStrategy.specialties as any;
    return specialtiesData[language]?.[specialty] || [];
  }

  const contextData = keywordsStrategy[context] as any;
  return contextData[language] || [];
}

/**
 * Generate SEO-optimized meta description
 */
export function generateMetaDescription(context: string, language: 'ar' | 'en'): string {
  const descriptions: { [key: string]: { ar: string; en: string } } = {
    'home': {
      ar: 'طمّني بلس هي منصة طبية عربية تساعد المرضى في البحث عن أفضل الأطباء حسب التخصص والمحافظة والمدينة، كما تساعد الأطباء على إنشاء ملف احترافي والوصول إلى المزيد من المرضى.',
      en: 'Tamny Plus is a premium Arabic medical platform helping patients find and book the best doctors by specialty, location, and ratings. Doctors create professional profiles and reach more patients.'
    },
    'search': {
      ar: 'ابحث عن أفضل الأطباء والعيادات الطبية المعتمدة حسب التخصص والمحافظة والمدينة. اعثر على الدكتور المناسب لك مع التقييمات والأسعار.',
      en: 'Search and find verified registered doctors and clinics by specialty, governorate, city, ratings, and price. Get information about doctors and book appointments.'
    },
    'doctorProfile': {
      ar: 'اعرض ملف الطبيب الكامل مع التقييمات والخبرات والتخصصات والأسعار والحجوزات والتعليقات من المرضى.',
      en: 'View complete doctor profile with ratings, experience, specialties, prices, patient reviews, and booking options.'
    },
    'registration': {
      ar: 'سجل حسابك كطبيب على منصة طمّني بلس والوصول إلى المزيد من المرضى. إنشاء ملف احترافي وإدارة مواعيدك بسهولة.',
      en: 'Register your doctor profile on Tamny Plus and reach more patients. Create a professional profile and manage appointments easily.'
    }
  };

  return descriptions[context]?.[language] || descriptions['home'][language];
}

/**
 * SEO Keyword Integration Guide
 */
export const keywordIntegrationGuide = {
  title: {
    position: 'Front (Primary keyword first)',
    maxLength: 60,
    format: '[Primary Keyword] | [Secondary Keyword] | [Brand]',
    example: 'Best Doctors | Doctor Booking | Tamny Plus'
  },
  metaDescription: {
    position: 'First 160 characters',
    maxLength: 160,
    includeKeyword: true,
    includeCallToAction: true
  },
  heading: {
    h1: 'Primary keyword, unique per page',
    h2: 'Related keywords and subtopics',
    h3: 'Long-tail and question-based keywords'
  },
  bodyContent: {
    keywordDensity: '1-2%',
    naturalPlacement: 'Must read naturally',
    contextual: 'Related topics around keyword',
    variations: 'Use synonyms and variations'
  },
  imageAlt: {
    format: 'Descriptive with relevant keyword',
    example: 'Best Cardiologist in Riyadh - Tamny Plus',
    maxLength: 125
  },
  internalLinks: {
    anchorText: 'Include keywords when relevant',
    relevance: 'Link to topically related pages',
    minimum: '3-5 per page'
  }
};
