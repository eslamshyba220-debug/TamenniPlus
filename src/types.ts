/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'ar' | 'en';

export type UserRole = 'patient' | 'doctor' | 'admin';

export type DoctorStatus = 'pending' | 'approved' | 'rejected' | 'blocked';

export interface Patient {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  favorites: string[]; // Doctor profile IDs
}

export interface DoctorAccount {
  id: string;
  username: string;
  email: string;
  status: DoctorStatus;
  created_at: string;
}

export interface DoctorProfile {
  id: string; // References DoctorAccount.id
  full_name_ar: string;
  full_name_en: string;
  gender: 'male' | 'female';
  dob: string;
  specialty_id: string;
  sub_specialty_ar: string;
  sub_specialty_en: string;
  degree_ar: string;
  degree_en: string;
  experience_years: number;
  clinic_name_ar: string;
  clinic_name_en: string;
  clinic_address_ar: string;
  clinic_address_en: string;
  governorate_id: string;
  city_id: string;
  google_maps_url?: string;
  phone_number: string;
  whatsapp_number: string;
  email: string;
  clinic_price: number;
  online_price: number;
  bio_ar: string;
  bio_en: string;
  syndicate_number: string;
  languages: string[]; // e.g. ["Arabic", "English"]
  working_days: number[]; // 0 for Sunday, 1 for Monday, etc.
  working_hours_start: string; // "09:00"
  working_hours_end: string; // "17:00"
  emergency_available: boolean;
  website?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  certificates: string[]; // URLs of uploaded certificates
  clinic_photos: string[]; // URLs of uploaded clinic photos
  cover_image?: string; // URL
  profile_image?: string; // URL
  rating_avg: number;
  rating_count: number;
}

export interface Specialty {
  id: string;
  name_ar: string;
  name_en: string;
  icon: string; // Lucide icon name
  doctor_count?: number;
  group?: 'medical' | 'pediatric_rehab';
}

export interface Governorate {
  id: string;
  name_ar: string;
  name_en: string;
}

export interface City {
  id: string;
  governorate_id: string;
  name_ar: string;
  name_en: string;
}

export interface Booking {
  id: string;
  doctor_id: string;
  doctor_name_ar: string;
  doctor_name_en: string;
  patient_name: string;
  patient_phone: string;
  booking_date: string;
  booking_time?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}

export interface Review {
  id: string;
  doctor_id: string;
  patient_name: string;
  rating: number; // 1 to 5
  comment: string;
  review_text?: string;
  is_approved?: boolean;
  review_date?: string;
  created_at: string;
}

export interface DoctorAnalytics {
  doctor_id: string;
  profile_views: number;
  whatsapp_clicks: number;
  booking_clicks: number;
  visitors: number;
  views_history: { date: string; count: number }[];
  clicks_history: { date: string; count: number }[];
}

export interface Notification {
  id: string;
  user_id: string; // Can be doctor_id, patient_id or 'admin'
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  is_read: boolean;
  created_at: string;
}

export interface AppSettings {
  allow_new_registrations: boolean;
  require_certificates_verification: boolean;
  emergency_hotline: string;
}
