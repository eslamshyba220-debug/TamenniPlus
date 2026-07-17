/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Specialty, Governorate, City, DoctorProfile, DoctorAccount, Review, DoctorAnalytics } from '../types';

export const SPECIALTIES: Specialty[] = [
  { id: 'cardiology', name_ar: 'أمراض القلب والأوعية الدموية', name_en: 'Cardiology', icon: 'Heart', group: 'medical' },
  { id: 'pediatrics', name_ar: 'طب الأطفال وحديثي الولادة', name_en: 'Pediatrics', icon: 'Baby', group: 'medical' },
  { id: 'dermatology', name_ar: 'الجلدية والتجميل والليزر', name_en: 'Dermatology', icon: 'Sparkles', group: 'medical' },
  { id: 'orthopedics', name_ar: 'جراحة العظام والمفاصل', name_en: 'Orthopedics', icon: 'Activity', group: 'medical' },
  { id: 'ophthalmology', name_ar: 'طب وجراحة العيون', name_en: 'Ophthalmology', icon: 'Eye', group: 'medical' },
  { id: 'neurology', name_ar: 'المخ والأعصاب', name_en: 'Neurology', icon: 'Brain', group: 'medical' },
  { id: 'gynecology', name_ar: 'النساء والتوليد', name_en: 'Gynecology & Obstetrics', icon: 'User', group: 'medical' },
  { id: 'dentistry', name_ar: 'طب وجراحة الفم والأسنان', name_en: 'Dentistry', icon: 'Smile', group: 'medical' },
  { id: 'psychiatry', name_ar: 'الطب النفسي وعلاج الإدمان', name_en: 'Psychiatry', icon: 'Activity', group: 'medical' },
  { id: 'internal', name_ar: 'الأمراض الباطنة والجهاز الهضمي', name_en: 'Internal Medicine', icon: 'Clipboard', group: 'medical' },
  { id: 'sensory_integration', name_ar: 'أخصائي تكامل حسي', name_en: 'Sensory Integration Specialist', icon: 'BrainCircuit', group: 'pediatric_rehab' },
  { id: 'special_education', name_ar: 'أخصائي تربية خاصة', name_en: 'Special Education Specialist', icon: 'BookOpen', group: 'pediatric_rehab' },
  { id: 'speech_therapy', name_ar: 'أخصائي تخاطب', name_en: 'Speech Therapist', icon: 'Mic2', group: 'pediatric_rehab' },
  { id: 'psychomotricity', name_ar: 'أخصائي سيكوموتري', name_en: 'Psychomotor Therapist', icon: 'Footprints', group: 'pediatric_rehab' },
  { id: 'skill_development', name_ar: 'أخصائي تنمية مهارات', name_en: 'Skill Development Specialist', icon: 'Sprout', group: 'pediatric_rehab' },
  { id: 'academic_specialist', name_ar: 'أخصائي أكاديمي', name_en: 'Academic Specialist', icon: 'NotebookPen', group: 'pediatric_rehab' },
  { id: 'behavioral_modification', name_ar: 'أخصائي تعديل سلوك', name_en: 'Behavioral Modification Specialist', icon: 'SmilePlus', group: 'pediatric_rehab' },
  { id: 'occupational_therapy', name_ar: 'أخصائي علاج وظيفي للأطفال', name_en: 'Pediatric Occupational Therapist', icon: 'Hand', group: 'pediatric_rehab' },
  { id: 'early_intervention', name_ar: 'أخصائي تدخل مبكر', name_en: 'Early Intervention Specialist', icon: 'Baby', group: 'pediatric_rehab' },
  { id: 'learning_difficulties', name_ar: 'أخصائي صعوبات تعلم', name_en: 'Learning Difficulties Specialist', icon: 'BookText', group: 'pediatric_rehab' },
  { id: 'autism_spectrum', name_ar: 'أخصائي اضطراب طيف التوحد', name_en: 'Autism Spectrum Specialist', icon: 'Sparkles', group: 'pediatric_rehab' },
  { id: 'adhd_specialist', name_ar: 'أخصائي ADHD', name_en: 'ADHD Specialist', icon: 'Zap', group: 'pediatric_rehab' },
  { id: 'neurofeedback_specialist', name_ar: 'أخصائي Neurofeedback', name_en: 'Neurofeedback Specialist', icon: 'Brain', group: 'pediatric_rehab' },
  { id: 'child_rehabilitation', name_ar: 'أخصائي تأهيل الأطفال', name_en: 'Child Rehabilitation Specialist', icon: 'HeartPulse', group: 'pediatric_rehab' },
  { id: 'child_psychologist', name_ar: 'أخصائي نفسي أطفال', name_en: 'Child Psychologist', icon: 'Heart', group: 'pediatric_rehab' },
  { id: 'family_counseling', name_ar: 'أخصائي إرشاد أسري', name_en: 'Family Counseling Specialist', icon: 'Users', group: 'pediatric_rehab' }
];

// Pediatric sub-specialties (child development / therapy-focused)
export const PEDIATRIC_SUBSPECIALTIES: { id: string; name_ar: string; name_en: string }[] = [
  { id: 'sensory_integration', name_ar: 'أخصائي تكامل حسي', name_en: 'Sensory Integration Specialist' },
  { id: 'special_education', name_ar: 'أخصائي تربية خاصة', name_en: 'Special Education Specialist' },
  { id: 'speech_therapy', name_ar: 'أخصائي تخاطب', name_en: 'Speech Therapist' },
  { id: 'psychomotricity', name_ar: 'أخصائي سيكوموتري', name_en: 'Psychomotor Therapist' },
  { id: 'skill_development', name_ar: 'أخصائي تنمية مهارات', name_en: 'Skill Development Specialist' },
  { id: 'academic_specialist', name_ar: 'أخصائي أكاديمي', name_en: 'Academic Specialist' },
  { id: 'behavioral_modification', name_ar: 'أخصائي تعديل سلوك', name_en: 'Behavioral Modification Specialist' },
  { id: 'occupational_therapy', name_ar: 'أخصائي علاج وظيفي للأطفال', name_en: 'Pediatric Occupational Therapist' },
  { id: 'early_intervention', name_ar: 'أخصائي تدخل مبكر', name_en: 'Early Intervention Specialist' },
  { id: 'learning_difficulties', name_ar: 'أخصائي صعوبات تعلم', name_en: 'Learning Difficulties Specialist' },
  { id: 'autism_spectrum', name_ar: 'أخصائي اضطراب طيف التوحد', name_en: 'Autism Spectrum Specialist' },
  { id: 'adhd_specialist', name_ar: 'أخصائي ADHD', name_en: 'ADHD Specialist' },
  { id: 'neurofeedback_specialist', name_ar: 'أخصائي Neurofeedback', name_en: 'Neurofeedback Specialist' },
  { id: 'child_rehabilitation', name_ar: 'أخصائي تأهيل الأطفال', name_en: 'Child Rehabilitation Specialist' },
  { id: 'child_psychologist', name_ar: 'أخصائي نفسي أطفال', name_en: 'Child Psychologist' },
  { id: 'family_counseling', name_ar: 'أخصائي إرشاد أسري', name_en: 'Family Counseling Specialist' },
  { id: 'pediatric_physiotherapy', name_ar: 'أخصائي علاج طبيعي للأطفال', name_en: 'Pediatric Physiotherapist' },
  { id: 'growth_behavior_consultant', name_ar: 'استشاري نمو وسلوك الأطفال', name_en: 'Child Growth & Behavior Consultant' }
];

export const GOVERNORATES: Governorate[] = [
  { id: 'cairo', name_ar: 'القاهرة', name_en: 'Cairo' },
  { id: 'giza', name_ar: 'الجيزة', name_en: 'Giza' },
  { id: 'alex', name_ar: 'الإسكندرية', name_en: 'Alexandria' },
  { id: 'qalyubia', name_ar: 'القليوبية', name_en: 'Qalyubia' },
  { id: 'dakahlia', name_ar: 'الدقهلية', name_en: 'Dakahlia' },
  { id: 'gharbia', name_ar: 'الغربية', name_en: 'Gharbia' }
];

export const CITIES: City[] = [
  // Cairo
  { id: 'nasr_city', governorate_id: 'cairo', name_ar: 'مدينة نصر', name_en: 'Nasr City' },
  { id: 'maadi', governorate_id: 'cairo', name_ar: 'المعادي', name_en: 'Maadi' },
  { id: 'heliopolis', governorate_id: 'cairo', name_ar: 'مصر الجديدة', name_en: 'Heliopolis' },
  { id: 'tagamoa', governorate_id: 'cairo', name_ar: 'التجمع الخامس', name_en: 'Fifth Settlement' },
  
  // Giza
  { id: 'dokki', governorate_id: 'giza', name_ar: 'الدقي', name_en: 'Dokki' },
  { id: 'mohandessin', governorate_id: 'giza', name_ar: 'المهندسين', name_en: 'Mohandessin' },
  { id: 'october', governorate_id: 'giza', name_ar: '6 أكتوبر', name_en: '6th of October' },
  { id: 'haram', governorate_id: 'giza', name_ar: 'الهرم', name_en: 'Haram' },

  // Alexandria
  { id: 'smouha', governorate_id: 'alex', name_ar: 'سموحة', name_en: 'Smouha' },
  { id: 'gleem', governorate_id: 'alex', name_ar: 'جليم', name_en: 'Gleem' },
  { id: 'sidi_bisher', governorate_id: 'alex', name_ar: 'سيدي بشر', name_en: 'Sidi Bishr' },

  // Qalyubia
  { id: 'banha', governorate_id: 'qalyubia', name_ar: 'بنها', name_en: 'Banha' },
  { id: 'shobra_elkheima', governorate_id: 'qalyubia', name_ar: 'شبرا الخيمة', name_en: 'Shobra El-Kheima' },

  // Dakahlia
  { id: 'mansoura', governorate_id: 'dakahlia', name_ar: 'المنصورة', name_en: 'Mansoura' },
  { id: 'talkha', governorate_id: 'dakahlia', name_ar: 'طلخا', name_en: 'Talkha' },

  // Gharbia
  { id: 'tanta', governorate_id: 'gharbia', name_ar: 'طنطا', name_en: 'Tanta' },
  { id: 'mahalla', governorate_id: 'gharbia', name_ar: 'المحلة الكبرى', name_en: 'Mahalla' }
];

// Seed Premium Doctors list
export const SEED_DOCTOR_ACCOUNTS: DoctorAccount[] = [];

export const SEED_DOCTOR_PROFILES: DoctorProfile[] = [];

export const SEED_REVIEWS: Review[] = [];

export const SEED_ANALYTICS: Record<string, DoctorAnalytics> = {};
