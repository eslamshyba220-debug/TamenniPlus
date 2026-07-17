/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * SEO Metadata Page Configuration
 * Detailed metadata for each page of the application
 */

export const pageMetadataConfig = {
  home: {
    ar: {
      title: 'طمني بلس - Tamenni Plus | ابحث عن أفضل الأطباء واحجز بسهولة',
      description: 'طمني بلس هي منصة طبية عربية تساعد المرضى في البحث عن أفضل الأطباء حسب التخصص والمحافظة والمدينة، كما تساعد الأطباء على إنشاء ملف احترافي والوصول إلى المزيد من المرضى.',
      keywords: 'طبيب، دكتور، أفضل دكتور، حجز دكتور، احجز كشف، دكتور أطفال، دكتور عظام، دكتور جلدية، دكتور قلب، دكتور نساء، ابحث عن طبيب، انضم كطبيب، منصة طبية، زيادة المرضى، Doctor Registration, Find Doctor, Medical Directory',
      canonical: 'https://tamnyplus.com',
      ogTitle: 'طمني بلس - Tamenni Plus | ابحث عن أفضل الأطباء واحجز بسهولة',
      ogDescription: 'منصة طبية عربية موثوقة للبحث عن أفضل الأطباء والعيادات الطبية المعتمدة والحجز معهم بسهولة',
      ogImage: 'https://tamnyplus.com/og-image.png',
      ogUrl: 'https://tamnyplus.com',
      ogType: 'website',
      twitterTitle: 'طمني بلس - Tamenni Plus | ابحث عن أفضل الأطباء واحجز بسهولة',
      twitterDescription: 'منصة طبية عربية موثوقة للبحث عن أفضل الأطباء والعيادات الطبية المعتمدة',
      twitterCard: 'summary_large_image',
      twitterImage: 'https://tamnyplus.com/og-image.png',
      author: 'Tamenni Plus Team',
      schema: 'organization'
    },
    en: {
      title: 'Tamenni Plus | Find & Book Best Doctors Online',
      description: 'Tamenni Plus is a premium Arabic medical platform helping patients find and book the best doctors by specialty, governorate, and city. Doctors create professional profiles and reach more patients.',
      keywords: 'Doctor, Find Doctor, Best Doctor, Book Doctor, Medical Appointment, Medical Platform, Doctor Booking, Clinic, Doctor Registration, Medical Directory, Healthcare',
      canonical: 'https://tamnyplus.com',
      ogTitle: 'Tamenni Plus | Find & Book Best Doctors Online',
      ogDescription: 'Find and book verified doctors and clinics online. Premium Arabic medical platform for healthcare.',
      ogImage: 'https://tamnyplus.com/og-image.png',
      ogUrl: 'https://tamnyplus.com',
      ogType: 'website',
      twitterTitle: 'Tamenni Plus | Find & Book Best Doctors Online',
      twitterDescription: 'Find and book verified doctors and clinics. Premium medical platform.',
      twitterCard: 'summary_large_image',
      twitterImage: 'https://tamnyplus.com/og-image.png',
      author: 'Tamenni Plus Team',
      schema: 'organization'
    }
  },

  search: {
    ar: {
      title: 'البحث عن أفضل الأطباء | طمني بلس - Tamenni Plus',
      description: 'ابحث عن أفضل الأطباء والعيادات الطبية المعتمدة حسب التخصص والمحافظة والمدينة. اعثر على الدكتور المناسب لك مع التقييمات والأسعار والحجوزات.',
      keywords: 'ابحث عن طبيب، دكتور بالقرب مني، أطباء موثوقين، تقييم الأطباء، حجز الدكتور، دكتور متخصص، عيادة طبية، كشف طبي',
      canonical: 'https://tamnyplus.com/search',
      ogTitle: 'البحث عن أفضل الأطباء | طمني بلس - Tamenni Plus',
      ogDescription: 'ابحث عن أفضل الأطباء المعتمدين حسب التخصص والموقع الجغرافي والتقييمات',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      author: 'Tamenni Plus',
      schema: 'webPage'
    },
    en: {
      title: 'Search Doctors | Tamenni Plus',
      description: 'Search and find verified registered doctors and clinics by specialty, governorate, and city. Get ratings, reviews, prices, and book appointments.',
      keywords: 'Search doctors, Find doctor near me, Trusted doctors, Doctor ratings, Book appointment, Medical specialists, Clinical services',
      canonical: 'https://tamnyplus.com/search',
      ogTitle: 'Search Doctors | Tamenni Plus',
      ogDescription: 'Find and book verified doctors by specialty, location, and ratings',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      author: 'Tamenni Plus',
      schema: 'webPage'
    }
  },

  doctorProfile: {
    ar: {
      title: 'ملف الطبيب | طمني بلس - Tamenni Plus',
      description: 'اعرض ملف الطبيب الكامل مع التقييمات والخبرات والتخصصات والأسعار والحجوزات والتعليقات من المرضى.',
      keywords: 'ملف الطبيب، معلومات الطبيب، تقييمات، حجز موعد، خبرة الطبيب، سيرة الطبيب، استشارة طبية',
      ogTitle: 'ملف الطبيب | طمني بلس - Tamenni Plus',
      ogDescription: 'عرض كامل لملف الطبيب مع التقييمات والخبرات والأسعار وخيارات الحجز',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      author: 'Tamenni Plus',
      schema: 'physician'
    },
    en: {
      title: 'Doctor Profile | Tamenni Plus',
      description: 'View complete doctor profile with ratings, experience, specialties, prices, patient reviews, and booking options.',
      keywords: 'Doctor profile, Doctor information, Ratings, Book appointment, Doctor experience, Medical consultation, Reviews',
      ogTitle: 'Doctor Profile | Tamenni Plus',
      ogDescription: 'Complete doctor profile with ratings, experience, and booking options',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      author: 'Tamenni Plus',
      schema: 'physician'
    }
  },

  patientAuth: {
    ar: {
      title: 'تسجيل دخول المريض | طمني بلس - Tamenni Plus',
      description: 'سجل الدخول إلى حسابك كمريض على منصة طمني بلس واحجز موعد مع أفضل الأطباء بسهولة وأمان.',
      keywords: 'تسجيل دخول المريض، حساب المريض، تسجيل جديد، دخول آمن، منصة طبية',
      canonical: 'https://tamnyplus.com/patient/login',
      ogTitle: 'تسجيل دخول المريض | طمني بلس - Tamenni Plus',
      ogDescription: 'سجل دخول آمن للمرضى على طمني بلس لحجز المواعيد والاستشارات الطبية',
      ogType: 'website',
      twitterCard: 'summary',
      author: 'Tamenni Plus'
    },
    en: {
      title: 'Patient Login | Tamenni Plus',
      description: 'Login to your patient account on Tamenni Plus and book appointments with the best doctors easily and securely.',
      keywords: 'Patient login, Patient account, Sign up, Secure login, Medical appointment',
      canonical: 'https://tamnyplus.com/patient/login',
      ogTitle: 'Patient Login | Tamenni Plus',
      ogDescription: 'Secure patient login to book doctor appointments and consultations',
      ogType: 'website',
      twitterCard: 'summary',
      author: 'Tamenni Plus'
    }
  },

  doctorAuth: {
    ar: {
      title: 'تسجيل دخول الطبيب | طمني بلس - Tamenni Plus',
      description: 'سجل دخول الطبيب إلى لوحة التحكم والإدارة على منصة طمني بلس وإدارة ملفك الطبي والمواعيد.',
      keywords: 'تسجيل دخول الطبيب، لوحة التحكم، إدارة المواعيد، ملف الطبيب',
      canonical: 'https://tamnyplus.com/doctor/login',
      ogTitle: 'تسجيل دخول الطبيب | طمني بلس - Tamenni Plus',
      ogDescription: 'دخول آمن للأطباء إلى لوحة التحكم وإدارة الممارسة الطبية',
      ogType: 'website',
      twitterCard: 'summary',
      author: 'Tamenni Plus'
    },
    en: {
      title: 'Doctor Login | Tamenni Plus',
      description: 'Doctor login to manage your profile, appointments, and patient interactions on Tamenni Plus.',
      keywords: 'Doctor login, Doctor dashboard, Doctor account, Practice management',
      canonical: 'https://tamnyplus.com/doctor/login',
      ogTitle: 'Doctor Login | Tamenni Plus',
      ogDescription: 'Secure doctor login to manage your medical practice',
      ogType: 'website',
      twitterCard: 'summary',
      author: 'Tamenni Plus'
    }
  },

  doctorRegistration: {
    ar: {
      title: 'انضم كطبيب | طمني بلس - Tamenni Plus',
      description: 'سجل حسابك كطبيب على منصة طمني بلس والوصول إلى المزيد من المرضى. إنشاء ملف احترافي وإدارة مواعيدك بسهولة وأمان.',
      keywords: 'تسجيل الأطباء، انضم كطبيب، منصة طبية، زيادة المرضى، ملف الطبيب، حجز المواعيد، منصة الأطباء',
      canonical: 'https://tamnyplus.com/doctor/register',
      ogTitle: 'انضم كطبيب | طمني بلس - Tamenni Plus',
      ogDescription: 'انضم إلى طمني بلس كطبيب والوصول إلى آلاف المرضى والحصول على المزيد من المواعيد',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      author: 'Tamenni Plus',
      schema: 'organization'
    },
    en: {
      title: 'Register as Doctor | Tamenni Plus - Join Our Medical Platform',
      description: 'Register your doctor profile on Tamenni Plus and reach more patients. Create a professional profile and manage appointments easily and securely.',
      keywords: 'Doctor Registration, Register as Doctor, Medical Platform, Increase Patients, Doctor Profile, Appointment Management, Medical Practice',
      canonical: 'https://tamnyplus.com/doctor/register',
      ogTitle: 'Register as Doctor | Tamenni Plus - Join Our Medical Platform',
      ogDescription: 'Join Tamenni Plus as a doctor and reach thousands of patients',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      author: 'Tamenni Plus',
      schema: 'organization'
    }
  },

  doctorDashboard: {
    ar: {
      title: 'لوحة تحكم الطبيب | طمني بلس - Tamenni Plus',
      description: 'إدارة ملفك الطبي والمواعيد والمرضى والاستشارات على لوحة تحكم طمني بلس المتكاملة.',
      keywords: 'لوحة التحكم، إدارة المواعيد، المرضى، الملف الطبي، الاستشارات',
      canonical: 'https://tamnyplus.com/doctor/dashboard',
      ogTitle: 'لوحة تحكم الطبيب | طمني بلس - Tamenni Plus',
      ogDescription: 'لوحة تحكم شاملة لإدارة ممارسة الطبيب والمواعيد والمرضى',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      author: 'Tamenni Plus'
    },
    en: {
      title: 'Doctor Dashboard | Tamenni Plus',
      description: 'Manage your medical profile, appointments, patients, and consultations on Tamenni Plus comprehensive dashboard.',
      keywords: 'Dashboard, Manage appointments, Patients, Medical profile, Consultations',
      canonical: 'https://tamnyplus.com/doctor/dashboard',
      ogTitle: 'Doctor Dashboard | Tamenni Plus',
      ogDescription: 'Comprehensive doctor dashboard for practice management',
      ogType: 'website',
      twitterCard: 'summary_large_image',
      author: 'Tamenni Plus'
    }
  },

  adminPanel: {
    ar: {
      title: 'لوحة الإدارة | طمني بلس - Tamenni Plus',
      description: 'لوحة إدارة منصة طمني بلس للمسؤولين والمشرفين.',
      keywords: 'الإدارة، لوحة التحكم، المشرفون، إدارة المنصة',
      canonical: 'https://tamnyplus.com/admin',
      ogTitle: 'لوحة الإدارة | طمني بلس - Tamenni Plus',
      ogDescription: 'لوحة إدارة منصة طمني بلس للمسؤولين',
      ogType: 'website',
      twitterCard: 'summary',
      author: 'Tamenni Plus'
    },
    en: {
      title: 'Admin Panel | Tamenni Plus',
      description: 'Tamenni Plus admin panel for platform management and administration.',
      keywords: 'Admin, Dashboard, Administration, Platform management',
      canonical: 'https://tamnyplus.com/admin',
      ogTitle: 'Admin Panel | Tamenni Plus',
      ogDescription: 'Tamenni Plus administration panel',
      ogType: 'website',
      twitterCard: 'summary',
      author: 'Tamenni Plus'
    }
  }
};

/**
 * Get metadata for a specific page
 */
export function getPageMetadataConfig(page: string, language: 'ar' | 'en' = 'ar') {
  const pageConfig = (pageMetadataConfig as any)[page];
  if (!pageConfig) {
    return (pageMetadataConfig as any)['home'][language];
  }
  return pageConfig[language];
}
