/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SEO Metadata Manager for Tamny Plus
 * Handles dynamic meta tag generation for all pages
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  author?: string;
  publishedDate?: string;
  modifiedDate?: string;
}

// Translation for common metadata
export const metadataTranslations = {
  ar: {
    home: {
      title: 'طمني بلس - Tamenni Plus | ابحث عن أفضل الأطباء واحجز بسهولة',
      description: 'طمني بلس هي منصة طبية عربية تساعد المرضى في البحث عن أفضل الأطباء حسب التخصص والمحافظة والمدينة، كما تساعد الأطباء على إنشاء ملف احترافي والوصول إلى المزيد من المرضى.',
      keywords: 'طبيب، دكتور، أفضل دكتور، حجز دكتور، احجز كشف، دكتور أطفال، دكتور عظام، دكتور جلدية، دكتور قلب، دكتور نساء، ابحث عن طبيب، منصة طبية'
    },
    search: {
      title: 'البحث عن أفضل الأطباء | طمني بلس - Tamenni Plus',
      description: 'ابحث عن أفضل الأطباء والعيادات الطبية المعتمدة حسب التخصص والمحافظة والمدينة. اعثر على الدكتور المناسب لك على طمني بلس.',
      keywords: 'ابحث عن طبيب، دكتور بالقرب مني، أطباء موثوقين، تقييم الأطباء، حجز الدكتور'
    },
    doctorProfile: {
      title: 'ملف الطبيب | طمني بلس - Tamenni Plus',
      description: 'اعرض ملف الطبيب الكامل مع التقييمات والخبرات والتخصصات والأسعار والحجوزات.',
      keywords: 'ملف الطبيب، معلومات الطبيب، تقييمات، حجز موعد'
    },
    terms: {
      title: 'شروط الخدمة | طمني بلس',
      description: 'اطلع على شروط الخدمة التي تنظم استخدام منصة طمني بلس لحجز المواعيد الطبية والتواصل مع الأطباء والأخصائيين.',
      keywords: 'شروط الخدمة، سياسة الاستخدام، منصة طبية'
    },
    privacy: {
      title: 'سياسة الخصوصية | طمني بلس',
      description: 'تعرف على كيفية حماية بياناتك الشخصية واستخدامها ضمن منصة طمني بلس الطبية. رؤيتنا للخصوصية والحماية.',
      keywords: 'سياسة الخصوصية، حماية البيانات، معلومات المستخدم'
    },
    patientAuth: {
      title: 'تسجيل الدخول للمريض | طمني بلس - Tamenni Plus',
      description: 'سجل الدخول إلى حسابك كمريض على منصة طمني بلس واحجز موعد مع أفضل الأطباء.',
      keywords: 'تسجيل دخول المريض، حساب المريض، تسجيل جديد'
    },
    doctorAuth: {
      title: 'تسجيل دخول الطبيب | طمني بلس - Tamenni Plus',
      description: 'سجل دخول الطبيب إلى لوحة التحكم والإدارة على منصة طمني بلس.',
      keywords: 'تسجيل دخول الطبيب، لوحة التحكم'
    },
    doctorRegistration: {
      title: 'انضم كطبيب | طمني بلس - Tamenni Plus',
      description: 'سجل حسابك كطبيب على منصة طمني بلس والوصول إلى المزيد من المرضى. إنشاء ملف احترافي وإدارة مواعيدك بسهولة.',
      keywords: 'تسجيل الأطباء، انضم كطبيب، منصة طبية، زيادة المرضى، ملف الطبيب'
    },
    doctorDashboard: {
      title: 'لوحة تحكم الطبيب | طمني بلس - Tamenni Plus',
      description: 'إدارة ملفك الطبي والمواعيد والمرضى على لوحة تحكم طمني بلس.',
      keywords: 'لوحة التحكم، إدارة المواعيد، المرضى'
    },
    adminPanel: {
      title: 'لوحة الإدارة | طمني بلس - Tamenni Plus',
      description: 'لوحة إدارة منصة طمني بلس للمسؤولين.',
      keywords: 'الإدارة، لوحة التحكم، المشرفون'
    }
  },
  en: {
    home: {
      title: 'Tamenni Plus | Find & Book Best Doctors Online',
      description: 'Tamenni Plus is a premium Arabic medical platform helping patients find and book the best doctors by specialty, governorate, and city. Doctors create professional profiles and reach more patients.',
      keywords: 'Doctor, Doctors, Best Doctor, Book Doctor, Medical Appointment, Medical Platform, Doctor Booking, Clinic, Find Doctor, Medical Directory, Healthcare'
    },
    search: {
      title: 'Search Doctors | Tamenni Plus',
      description: 'Search and find verified registered doctors and clinics by specialty, governorate, and city. Get ratings, reviews, and prices.',
      keywords: 'Search doctors, Find doctor near me, Trusted doctors, Doctor ratings, Book appointment'
    },
    doctorProfile: {
      title: 'Doctor Profile | Tamenni Plus',
      description: 'View complete doctor profile with ratings, experience, specialties, prices, and booking options.',
      keywords: 'Doctor profile, Doctor information, Ratings, Book appointment'
    },
    terms: {
      title: 'Terms of Service | Tamenni Plus',
      description: 'Review the terms of service that govern how patients and doctors use the Tamny Plus medical booking platform.',
      keywords: 'Terms of Service, Use Policy, Medical Platform'
    },
    privacy: {
      title: 'Privacy Policy | Tamenni Plus',
      description: 'Learn how Tamny Plus protects user data and handles personal information in the medical platform experience.',
      keywords: 'Privacy Policy, Data Protection, User Information'
    },
    patientAuth: {
      title: 'Patient Login | Tamenni Plus',
      description: 'Login to your patient account on Tamenni Plus and book appointments with the best doctors.',
      keywords: 'Patient login, Patient account, Sign up'
    },
    doctorAuth: {
      title: 'Doctor Login | Tamenni Plus',
      description: 'Doctor login to manage profile, appointments, and patient interactions on Tamenni Plus.',
      keywords: 'Doctor login, Doctor dashboard'
    },
    doctorRegistration: {
      title: 'Register as Doctor | Tamenni Plus - Join Our Medical Platform',
      description: 'Register your doctor profile on Tamenni Plus and reach more patients. Create a professional profile and manage appointments easily.',
      keywords: 'Doctor Registration, Register as Doctor, Medical Platform, Increase Patients, Doctor Profile'
    },
    doctorDashboard: {
      title: 'Doctor Dashboard | Tamenni Plus',
      description: 'Manage your medical profile, appointments, and patient interactions on Tamenni Plus dashboard.',
      keywords: 'Dashboard, Manage appointments, Patients'
    },
    adminPanel: {
      title: 'Admin Panel | Tamenni Plus',
      description: 'Tamenni Plus admin panel for platform management and administration.',
      keywords: 'Admin, Dashboard, Administration'
    }
  }
};

/**
 * Update page metadata dynamically
 */
export function updatePageMetadata(metadata: PageMetadata) {
  // Update title
  document.title = metadata.title;
  updateMetaTag('title', metadata.title);
  updateMetaTag('og:title', metadata.title);
  updateMetaTag('twitter:title', metadata.title);

  // Update description
  updateMetaTag('description', metadata.description);
  updateMetaTag('og:description', metadata.description);
  updateMetaTag('twitter:description', metadata.description);

  // Update keywords
  if (metadata.keywords) {
    updateMetaTag('keywords', metadata.keywords);
  }

  // Update image
  if (metadata.image) {
    updateMetaTag('og:image', metadata.image);
    updateMetaTag('twitter:image', metadata.image);
  } else {
    updateMetaTag('og:image', 'https://tamnyplus.com/og-image.png');
    updateMetaTag('twitter:image', 'https://tamnyplus.com/og-image.png');
  }

  // Update URL
  if (metadata.url) {
    updateMetaTag('og:url', metadata.url);
    updateLinkTag('canonical', metadata.url);
  }

  // Update type
  if (metadata.type) {
    updateMetaTag('og:type', metadata.type);
  }

  // Update published date
  if (metadata.publishedDate) {
    updateMetaTag('article:published_time', metadata.publishedDate);
  }

  // Update modified date
  if (metadata.modifiedDate) {
    updateMetaTag('article:modified_time', metadata.modifiedDate);
  }
}

/**
 * Update a meta tag by name or property
 */
function updateMetaTag(nameOrProperty: string, content: string) {
  let element = document.querySelector(`meta[name="${nameOrProperty}"]`) ||
                document.querySelector(`meta[property="${nameOrProperty}"]`);

  if (!element) {
    element = document.createElement('meta');
    if (nameOrProperty.startsWith('og:') || nameOrProperty.startsWith('article:')) {
      element.setAttribute('property', nameOrProperty);
    } else {
      element.setAttribute('name', nameOrProperty);
    }
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

/**
 * Update a link tag by rel
 */
function updateLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }

  element.setAttribute('href', href);
}

/**
 * Generate JSON-LD schema for a page
 */
export function generateJsonLD(schema: any) {
  let script = document.querySelector('script[type="application/ld+json"][data-dynamic="true"]');

  if (!script) {
    script = document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('data-dynamic', 'true');
    document.head.appendChild(script);
  }

  script.textContent = JSON.stringify(schema);
}

/**
 * Generate structured data for a doctor
 */
export function generateDoctorSchema(doctor: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    '@id': `https://tamnyplus.com/doctor/${doctor.id}`,
    'name': doctor.name,
    'description': doctor.description,
    'url': `https://tamnyplus.com/doctor/${doctor.id}`,
    'image': doctor.profileImage || 'https://tamnyplus.com/logo.png',
    'medicalSpecialty': doctor.specialty,
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': doctor.city,
      'addressRegion': doctor.governorate,
      'addressCountry': 'SA'
    },
    'telephone': doctor.phone,
    'email': doctor.email,
    'aggregateRating': doctor.rating ? {
      '@type': 'AggregateRating',
      'ratingValue': doctor.rating.average,
      'ratingCount': doctor.rating.count
    } : undefined,
    'makesOffer': {
      '@type': 'MedicalBusiness',
      'name': `${doctor.name} - Consultation`,
      'priceCurrency': 'SAR',
      'price': doctor.consultationFee
    }
  };
}

/**
 * Get metadata for a specific page
 */
export function getPageMetadata(page: string, language: 'ar' | 'en' = 'ar'): PageMetadata {
  const translations = metadataTranslations[language];
  const pageData = (translations as any)[page] || translations.home;

  return {
    title: pageData.title,
    description: pageData.description,
    keywords: pageData.keywords,
    image: 'https://tamnyplus.com/og-image.png',
    url: `https://tamnyplus.com/${page === 'home' ? '' : page}`
  };
}
