/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import bcrypt from 'bcryptjs';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  Patient,
  DoctorAccount,
  DoctorProfile,
  Booking,
  Review,
  DoctorAnalytics,
  Notification,
  AppSettings,
  DoctorStatus
} from '../types';
import {
  SEED_DOCTOR_ACCOUNTS,
  SEED_DOCTOR_PROFILES,
  SEED_REVIEWS,
  SEED_ANALYTICS
} from '../data/reference';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

export let supabase: SupabaseClient | null = null;
let isMockMode = !supabaseUrl || !supabaseAnonKey;

if (supabaseUrl && supabaseAnonKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    isMockMode = false;
    console.log('Tamny Plus: Connected to production Supabase successfully!');
  } catch (error) {
    console.error('Tamny Plus: Failed to initialize Supabase.', error);
    if (isProd) {
      throw new Error('Tamny Plus Error: Supabase initialization failed in production mode.');
    }
  }
} else {
  if (isProd) {
    console.error('Tamny Plus Error: Missing Supabase environment credentials (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) in production!');
  } else {
    console.log('Tamny Plus: Running in premium LocalStorage/Simulated mode (missing Supabase keys).');
  }
}

// ====================================================================
// SIMULATED/LOCAL STORAGE BACKEND FOR OFFLINE & PREVIEW INTERACTION
// ====================================================================

const STORAGE_KEYS = {
  PATIENTS: 'tamny_patients',
  ACCOUNTS: 'tamny_doctor_accounts',
  PROFILES: 'tamny_doctor_profiles',
  BOOKINGS: 'tamny_bookings',
  REVIEWS: 'tamny_reviews',
  ANALYTICS: 'tamny_analytics',
  NOTIFICATIONS: 'tamny_notifications',
  SETTINGS: 'tamny_settings',
  LOGGED_IN_USER: 'tamny_logged_in_user',
  ADMIN_SESSION: 'tamny_admin_session'
};

// Lazy initialization of LocalStorage databases
const getStorageData = <T>(key: string, defaultData: T): T => {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

const setStorageData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

const uploadDoctorAsset = async (
  doctorId: string,
  file: File,
  category: 'profile' | 'cover' | 'clinic' | 'certificate' | 'avatar'
): Promise<string> => {
  const bucket = category === 'profile' || category === 'avatar'
    ? 'avatars'
    : category === 'cover'
      ? 'covers'
      : category === 'clinic'
        ? 'clinic-images'
        : category === 'certificate'
          ? 'certificates'
          : 'doctor-uploads';

  const safeFileName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9._-]/g, '');
  const path = `${doctorId}/${category}/${Date.now()}-${safeFileName}`;
  console.log(`[TamnyPlus][upload] bucket=${bucket} path=${path}`);

  if (!isMockMode && supabase) {
    const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
      upsert: true,
      cacheControl: '3600'
    });

    if (error) {
      console.error('[TamnyPlus][upload] failed', error);
      throw error;
    }

    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
    console.log(`[TamnyPlus][upload] publicUrl=${publicUrlData.publicUrl}`);
    return publicUrlData.publicUrl;
  }

  const fallbackUrl = URL.createObjectURL(file);
  console.log(`[TamnyPlus][upload] fallbackObjectUrl=${fallbackUrl}`);
  return fallbackUrl;
};

const getDoctorImageCollections = async (doctorIds: string[]) => {
  const clinicPhotosMap: Record<string, string[]> = {};
  const certificatesMap: Record<string, string[]> = {};

  if (isMockMode || !supabase || doctorIds.length === 0) {
    return { clinicPhotosMap, certificatesMap };
  }

  const uniqueDoctorIds = Array.from(new Set(doctorIds.filter(Boolean)));
  if (uniqueDoctorIds.length === 0) {
    return { clinicPhotosMap, certificatesMap };
  }

  const [{ data: clinicImagesData }, { data: certificateData }] = await Promise.all([
    supabase.from('clinic_images').select('doctor_id, image_url').in('doctor_id', uniqueDoctorIds),
    supabase.from('doctor_certificates').select('doctor_id, certificate_url').in('doctor_id', uniqueDoctorIds)
  ]);

  (clinicImagesData || []).forEach((row: any) => {
    const doctorId = row.doctor_id;
    if (!clinicPhotosMap[doctorId]) clinicPhotosMap[doctorId] = [];
    clinicPhotosMap[doctorId].push(row.image_url);
  });

  (certificateData || []).forEach((row: any) => {
    const doctorId = row.doctor_id;
    if (!certificatesMap[doctorId]) certificatesMap[doctorId] = [];
    certificatesMap[doctorId].push(row.certificate_url);
  });

  return { clinicPhotosMap, certificatesMap };
};

// Initialize simulated database
export const initMockDatabase = () => {
  getStorageData<Patient[]>(STORAGE_KEYS.PATIENTS, []);
  getStorageData<DoctorAccount[]>(STORAGE_KEYS.ACCOUNTS, SEED_DOCTOR_ACCOUNTS);
  getStorageData<DoctorProfile[]>(STORAGE_KEYS.PROFILES, SEED_DOCTOR_PROFILES);
  getStorageData<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
  getStorageData<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
  getStorageData<Record<string, DoctorAnalytics>>(STORAGE_KEYS.ANALYTICS, SEED_ANALYTICS);
  getStorageData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, [
    {
      id: 'notif-1',
      user_id: 'admin',
      title_ar: 'طبيب جديد قيد المراجعة',
      title_en: 'New Doctor Pending Review',
      body_ar: 'قام د. ياسمين نور بإنشاء حساب وفي انتظار مراجعة الأوراق الثبوتية والترخيص.',
      body_en: 'Dr. Yasmine Nour created an account and is awaiting verification reviews.',
      is_read: false,
      created_at: new Date().toISOString()
    }
  ]);
  getStorageData<AppSettings>(STORAGE_KEYS.SETTINGS, {
    allow_new_registrations: true,
    require_certificates_verification: true,
    emergency_hotline: '123'
  });
};

// Call once at startup
initMockDatabase();

// ====================================================================
// PLATFORM SERVICES (SMART WRAPPER ROUTING REAL VS MOCK CLIENT)
// ====================================================================

export const dbService = {
  isOffline(): boolean {
    return isMockMode;
  },

  // --- SETTINGS SERVICE ---
  async getSettings(): Promise<AppSettings> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase.from('settings').select('*').single();
      if (!error && data) return data as AppSettings;
    }
    return getStorageData<AppSettings>(STORAGE_KEYS.SETTINGS, {
      allow_new_registrations: true,
      require_certificates_verification: true,
      emergency_hotline: '123'
    });
  },

  async updateSettings(settings: AppSettings): Promise<void> {
    if (!isMockMode && supabase) {
      await supabase.from('settings').update(settings).eq('id', 1);
      return;
    }
    setStorageData(STORAGE_KEYS.SETTINGS, settings);
  },

  async getPatient(id: string): Promise<Patient | null> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase.from('patients').select('*').eq('id', id).single();
      if (!error && data) {
        const { data: favs } = await supabase.from('favorites').select('doctor_id').eq('patient_id', id);
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url || undefined,
          created_at: data.created_at,
          favorites: favs ? favs.map((f: any) => f.doctor_id) : []
        };
      }
    }
    const patients = getStorageData<Patient[]>(STORAGE_KEYS.PATIENTS, []);
    return patients.find(p => p.id === id) || null;
  },

  // --- AUTH SERVICES ---
  async patientGoogleLogin(googleUser: { name: string; email: string; avatar_url: string }): Promise<Patient> {
    if (!isMockMode && supabase) {
      const normalizedEmail = googleUser.email.toLowerCase();
      const tempPassword = `tamnyplus-${normalizedEmail.replace(/[^a-z0-9]/g, '')}-${Date.now().toString().slice(-6)}`;

      try {
        await supabase.auth.signInWithPassword({ email: normalizedEmail, password: tempPassword });
      } catch (signInError) {
        try {
          await supabase.auth.signUp({
            email: normalizedEmail,
            password: tempPassword,
            options: {
              data: {
                name: googleUser.name,
                avatar_url: googleUser.avatar_url
              }
            }
          });
        } catch (signUpError) {
          console.warn('[TamnyPlus][auth] Supabase auth fallback failed', signUpError);
        }
      }

      let { data, error } = await supabase.from('patients').select('*').eq('email', normalizedEmail).maybeSingle();
      if (error || !data) {
        const { data: inserted, error: insertError } = await supabase.from('patients').insert({
          name: googleUser.name,
          email: normalizedEmail,
          avatar_url: googleUser.avatar_url
        }).select().single();
        if (insertError) throw insertError;
        data = inserted;
      }
      const patient: Patient = {
        id: data.id,
        name: data.name,
        email: data.email,
        avatar_url: data.avatar_url || undefined,
        created_at: data.created_at,
        favorites: []
      };
      const { data: favs } = await supabase.from('favorites').select('doctor_id').eq('patient_id', data.id);
      if (favs) {
        patient.favorites = favs.map((f: any) => f.doctor_id);
      }
      setStorageData(STORAGE_KEYS.LOGGED_IN_USER, { role: 'patient', data: patient });
      return patient;
    }

    const patients = getStorageData<Patient[]>(STORAGE_KEYS.PATIENTS, []);
    let patient = patients.find(p => p.email.toLowerCase() === googleUser.email.toLowerCase());

    if (!patient) {
      patient = {
        id: 'patient-' + Math.random().toString(36).substr(2, 9),
        name: googleUser.name,
        email: googleUser.email.toLowerCase(),
        avatar_url: googleUser.avatar_url,
        created_at: new Date().toISOString(),
        favorites: []
      };
      patients.push(patient);
      setStorageData(STORAGE_KEYS.PATIENTS, patients);
    }
    
    // Save current session
    setStorageData(STORAGE_KEYS.LOGGED_IN_USER, { role: 'patient', data: patient });
    return patient;
  },

  async doctorRegister(
    accountData: { username: string; email: string; password_hash: string },
    profileData: Omit<DoctorProfile, 'id' | 'rating_avg' | 'rating_count'>,
    uploadFiles?: { certificates?: File[]; clinicPhotos?: File[]; profileImage?: File | null; coverImage?: File | null }
  ): Promise<{ account: DoctorAccount; profile: DoctorProfile }> {
    if (!isMockMode && supabase) {
      const normalizedUsername = accountData.username.trim().toLowerCase();
      const normalizedEmail = accountData.email.trim().toLowerCase();
      const hashedPassword = bcrypt.hashSync(accountData.password_hash, 10);

      const { data: acc, error: accError } = await supabase.from('doctor_accounts').insert({
        username: normalizedUsername,
        email: normalizedEmail,
        password_hash: hashedPassword,
        status: 'pending'
      }).select().single();
      if (accError) throw new Error(accError.message || 'Failed to register doctor account');

      let uploadedProfileImage = profileData.profile_image;
      let uploadedCoverImage = profileData.cover_image;
      let uploadedClinicPhotos = profileData.clinic_photos || [];
      let uploadedCertificates = profileData.certificates || [];

      try {
        if (uploadFiles?.profileImage) {
          uploadedProfileImage = await uploadDoctorAsset(acc.id, uploadFiles.profileImage, 'profile');
        }
        if (uploadFiles?.coverImage) {
          uploadedCoverImage = await uploadDoctorAsset(acc.id, uploadFiles.coverImage, 'cover');
        }
        if (uploadFiles?.clinicPhotos && uploadFiles.clinicPhotos.length > 0) {
          uploadedClinicPhotos = await Promise.all(uploadFiles.clinicPhotos.map((file) => uploadDoctorAsset(acc.id, file, 'clinic')));
        }
        if (uploadFiles?.certificates && uploadFiles.certificates.length > 0) {
          uploadedCertificates = await Promise.all(uploadFiles.certificates.map((file) => uploadDoctorAsset(acc.id, file, 'certificate')));
        }
      } catch (uploadError) {
        console.error('[TamnyPlus][db] image upload failed', uploadError);
        throw uploadError;
      }

      const persistedProfileData = {
        ...profileData,
        certificates: uploadedCertificates,
        clinic_photos: uploadedClinicPhotos,
        cover_image: uploadedCoverImage || undefined,
        profile_image: uploadedProfileImage || undefined,
        google_maps_url: profileData.google_maps_url || undefined,
        website: profileData.website || undefined,
        facebook: profileData.facebook || undefined,
        instagram: profileData.instagram || undefined,
        linkedin: profileData.linkedin || undefined
      };

      const { data: prof, error: profError } = await supabase.from('doctor_profiles').insert({
        id: acc.id,
        full_name_ar: persistedProfileData.full_name_ar,
        full_name_en: persistedProfileData.full_name_en,
        gender: persistedProfileData.gender,
        dob: persistedProfileData.dob,
        specialty_id: persistedProfileData.specialty_id,
        sub_specialty_ar: persistedProfileData.sub_specialty_ar,
        sub_specialty_en: persistedProfileData.sub_specialty_en,
        degree_ar: persistedProfileData.degree_ar,
        degree_en: persistedProfileData.degree_en,
        experience_years: persistedProfileData.experience_years,
        clinic_name_ar: persistedProfileData.clinic_name_ar,
        clinic_name_en: persistedProfileData.clinic_name_en,
        clinic_address_ar: persistedProfileData.clinic_address_ar,
        clinic_address_en: persistedProfileData.clinic_address_en,
        governorate_id: persistedProfileData.governorate_id,
        city_id: persistedProfileData.city_id,
        google_maps_url: persistedProfileData.google_maps_url,
        phone_number: persistedProfileData.phone_number,
        whatsapp_number: persistedProfileData.whatsapp_number,
        email: normalizedEmail,
        clinic_price: persistedProfileData.clinic_price,
        online_price: persistedProfileData.online_price,
        bio_ar: persistedProfileData.bio_ar,
        bio_en: persistedProfileData.bio_en,
        syndicate_number: persistedProfileData.syndicate_number,
        languages: persistedProfileData.languages,
        working_days: persistedProfileData.working_days,
        working_hours_start: persistedProfileData.working_hours_start,
        working_hours_end: persistedProfileData.working_hours_end,
        emergency_available: persistedProfileData.emergency_available,
        website: persistedProfileData.website,
        facebook: persistedProfileData.facebook,
        instagram: persistedProfileData.instagram,
        linkedin: persistedProfileData.linkedin,
        certificates: persistedProfileData.certificates,
        clinic_photos: persistedProfileData.clinic_photos,
        cover_image: persistedProfileData.cover_image,
        profile_image: persistedProfileData.profile_image
      }).select().single();
      if (profError) {
        await supabase.from('doctor_accounts').delete().eq('id', acc.id);
        throw new Error(profError.message || 'Failed to register doctor profile');
      }

      console.log('[TamnyPlus][db] doctor_profiles updated', {
        doctorId: acc.id,
        profile_image: persistedProfileData.profile_image,
        cover_image: persistedProfileData.cover_image,
        clinic_photos: persistedProfileData.clinic_photos.length,
        certificates: persistedProfileData.certificates.length
      });

      await supabase.from('doctor_analytics').insert({
        doctor_id: acc.id,
        profile_views: 0,
        whatsapp_clicks: 0,
        booking_clicks: 0,
        visitors: 0
      });

      await supabase.from('notifications').insert({
        user_id: 'admin',
        title_ar: 'تسجيل طبيب جديد',
        title_en: 'New Doctor Registered',
        body_ar: `طلب تسجيل جديد من الطبيب ${prof.full_name_ar} قيد المراجعة الآن.`,
        body_en: `New registration request from Dr. ${prof.full_name_en} is now pending review.`
      });

      const account: DoctorAccount = {
        id: acc.id,
        username: acc.username,
        email: acc.email,
        status: acc.status as DoctorStatus,
        created_at: acc.created_at
      };

      const profile: DoctorProfile = {
        ...persistedProfileData,
        id: acc.id,
        rating_avg: prof.rating_avg || 5.0,
        rating_count: prof.rating_count || 0
      };

      return { account, profile };
    }

    const accounts = getStorageData<DoctorAccount[]>(STORAGE_KEYS.ACCOUNTS, SEED_DOCTOR_ACCOUNTS);
    const profiles = getStorageData<DoctorProfile[]>(STORAGE_KEYS.PROFILES, SEED_DOCTOR_PROFILES);

    if (accounts.some(a => a.username === accountData.username || a.email === accountData.email)) {
      throw new Error('Username or email already exists');
    }

    const docId = 'doc-' + Math.random().toString(36).substr(2, 9);
    
    const newAccount: DoctorAccount = {
      id: docId,
      username: accountData.username,
      email: accountData.email,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    const newProfile: DoctorProfile = {
      ...profileData,
      id: docId,
      rating_avg: 5.0,
      rating_count: 0
    };

    accounts.push(newAccount);
    profiles.push(newProfile);

    setStorageData(STORAGE_KEYS.ACCOUNTS, accounts);
    setStorageData(STORAGE_KEYS.PROFILES, profiles);

    // Seed default analytics for this doctor
    const analytics = getStorageData<Record<string, DoctorAnalytics>>(STORAGE_KEYS.ANALYTICS, SEED_ANALYTICS);
    analytics[docId] = {
      doctor_id: docId,
      profile_views: 0,
      whatsapp_clicks: 0,
      booking_clicks: 0,
      visitors: 0,
      views_history: [],
      clicks_history: []
    };
    setStorageData(STORAGE_KEYS.ANALYTICS, analytics);

    // Create an admin notification
    const notifications = getStorageData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifications.push({
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      user_id: 'admin',
      title_ar: 'تسجيل طبيب جديد',
      title_en: 'New Doctor Registered',
      body_ar: `طلب تسجيل جديد من الطبيب ${newProfile.full_name_ar} قيد المراجعة الآن.`,
      body_en: `New registration request from Dr. ${newProfile.full_name_en} is now pending review.`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    setStorageData(STORAGE_KEYS.NOTIFICATIONS, notifications);

    return { account: newAccount, profile: newProfile };
  },

  async doctorLogin(username: string, password_plain: string): Promise<{ account: DoctorAccount; profile?: DoctorProfile }> {
    if (!isMockMode && supabase) {
      const canonicalInput = username.trim().toLowerCase();
      const { data: acc, error: accError } = await supabase
        .from('doctor_accounts')
        .select('*')
        .or(`username.eq.${canonicalInput},email.eq.${canonicalInput}`)
        .maybeSingle();
      if (accError || !acc) {
        throw new Error('Invalid username or password');
      }

      if (acc.status === 'pending') {
        throw new Error('Your account is waiting for admin approval.');
      }
      if (acc.status === 'rejected') {
        throw new Error('Your registration has been rejected.');
      }
      if (acc.status === 'blocked') {
        throw new Error('Your account has been suspended.');
      }

      const isValid = bcrypt.compareSync(password_plain, acc.password_hash || '');
      if (!isValid) {
        throw new Error('Invalid username or password');
      }

      const { data: prof } = await supabase.from('doctor_profiles').select('*').eq('id', acc.id).maybeSingle();
      const account: DoctorAccount = {
        id: acc.id,
        username: acc.username,
        email: acc.email,
        status: acc.status as DoctorStatus,
        created_at: acc.created_at
      };
      const profile: DoctorProfile | undefined = prof ? {
        id: prof.id,
        full_name_ar: prof.full_name_ar,
        full_name_en: prof.full_name_en,
        gender: prof.gender,
        dob: prof.dob,
        specialty_id: prof.specialty_id,
        sub_specialty_ar: prof.sub_specialty_ar,
        sub_specialty_en: prof.sub_specialty_en,
        degree_ar: prof.degree_ar,
        degree_en: prof.degree_en,
        experience_years: prof.experience_years,
        clinic_name_ar: prof.clinic_name_ar,
        clinic_name_en: prof.clinic_name_en,
        clinic_address_ar: prof.clinic_address_ar,
        clinic_address_en: prof.clinic_address_en,
        governorate_id: prof.governorate_id,
        city_id: prof.city_id,
        google_maps_url: prof.google_maps_url || undefined,
        phone_number: prof.phone_number,
        whatsapp_number: prof.whatsapp_number,
        email: prof.email,
        clinic_price: Number(prof.clinic_price),
        online_price: Number(prof.online_price),
        bio_ar: prof.bio_ar,
        bio_en: prof.bio_en,
        syndicate_number: prof.syndicate_number,
        languages: prof.languages || [],
        working_days: prof.working_days || [],
        working_hours_start: prof.working_hours_start,
        working_hours_end: prof.working_hours_end,
        emergency_available: prof.emergency_available,
        website: prof.website || undefined,
        facebook: prof.facebook || undefined,
        instagram: prof.instagram || undefined,
        linkedin: prof.linkedin || undefined,
        certificates: prof.certificates || [],
        clinic_photos: prof.clinic_photos || [],
        cover_image: prof.cover_image || undefined,
        profile_image: prof.profile_image || undefined,
        rating_avg: Number(prof.rating_avg || 5.0),
        rating_count: Number(prof.rating_count || 0)
      } : undefined;

      console.log('[TamnyPlus][fetch] doctor profile', {
        doctorId: prof?.id,
        profile_image: prof?.profile_image,
        cover_image: prof?.cover_image,
        clinic_photos: prof?.clinic_photos?.length || 0,
        certificates: prof?.certificates?.length || 0
      });

      setStorageData(STORAGE_KEYS.LOGGED_IN_USER, { role: 'doctor', data: account, profile });
      return { account, profile };
    }

    const accounts = getStorageData<DoctorAccount[]>(STORAGE_KEYS.ACCOUNTS, SEED_DOCTOR_ACCOUNTS);
    const profiles = getStorageData<DoctorProfile[]>(STORAGE_KEYS.PROFILES, SEED_DOCTOR_PROFILES);

    const account = accounts.find(a => a.username === username || a.email === username);
    if (!account) {
      throw new Error('Doctor account not found');
    }

    const profile = profiles.find(p => p.id === account.id);

    setStorageData(STORAGE_KEYS.LOGGED_IN_USER, { role: 'doctor', data: account, profile });
    return { account, profile };
  },

  async adminLogin(email: string, password_plain: string): Promise<{ id: string; auth_user_id: string; email: string; full_name: string; role: string; created_at: string; updated_at: string }> {
    if (!isMockMode && supabase) {
      const normalizedEmail = email.trim().toLowerCase();

      const authResult: any = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password: password_plain
      });

      if (authResult.error || !authResult.data?.user) {
        throw new Error('ADMIN_AUTH_FAILED');
      }

      const authUser = authResult.data.user;
      const userEmail = authUser.email?.trim().toLowerCase();
      if (userEmail !== 'eslamshyba220@gmail.com') {
        await supabase.auth.signOut();
        throw new Error('ACCESS_DENIED');
      }

      const adminData = {
        id: authUser.id,
        auth_user_id: authUser.id,
        email: userEmail,
        full_name: authUser.user_metadata?.full_name || authUser.email || 'Admin',
        role: 'admin',
        created_at: authUser.created_at || new Date().toISOString(),
        updated_at: authUser.updated_at || new Date().toISOString()
      };

      setStorageData(STORAGE_KEYS.ADMIN_SESSION, { role: 'admin' as const, data: adminData });
      await supabase.auth.signOut().catch(() => undefined);
      return adminData;
    }

    throw new Error('Admin authentication is unavailable in mock mode.');
  },

  logoutAdmin(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.LOGGED_IN_USER);
    if (!isMockMode && supabase) {
      supabase.auth.signOut().catch(() => undefined);
    }
  },

  getLoggedInAdmin(): { role: 'admin'; data: any } | null {
    const session = localStorage.getItem(STORAGE_KEYS.ADMIN_SESSION);
    return session ? JSON.parse(session) : null;
  },

  async getCurrentAuthSession(): Promise<{ role: 'patient' | 'doctor' | 'admin'; data: any; profile?: DoctorProfile } | null> {
    const adminSession = this.getLoggedInAdmin();
    if (adminSession) {
      return adminSession;
    }

    const storedSession = this.getLoggedInUser();
    if (!isMockMode && supabase) {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (!error && session?.user?.email) {
        const normalizedEmail = session.user.email.trim().toLowerCase();
        if (normalizedEmail === 'eslamshyba220@gmail.com') {
          const adminSessionFromStorage = this.getLoggedInAdmin();
          if (adminSessionFromStorage) {
            return adminSessionFromStorage;
          }
          const adminData = {
            id: session.user.id,
            auth_user_id: session.user.id,
            email: normalizedEmail,
            full_name: session.user.user_metadata?.full_name || session.user.email || 'Admin',
            role: 'admin' as const,
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: session.user.updated_at || new Date().toISOString()
          };
          setStorageData(STORAGE_KEYS.ADMIN_SESSION, { role: 'admin' as const, data: adminData });
          return { role: 'admin' as const, data: adminData };
        }

        const patient = await this.getPatientByEmail(session.user.email);
        if (patient) {
          const nextSession = { role: 'patient' as const, data: patient };
          setStorageData(STORAGE_KEYS.LOGGED_IN_USER, nextSession);
          return nextSession;
        }
      }
    }
    return storedSession;
  },

  async getPatientByEmail(email: string): Promise<Patient | null> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase.from('patients').select('*').eq('email', email.toLowerCase()).maybeSingle();
      if (!error && data) {
        const { data: favs } = await supabase.from('favorites').select('doctor_id').eq('patient_id', data.id);
        return {
          id: data.id,
          name: data.name,
          email: data.email,
          avatar_url: data.avatar_url || undefined,
          created_at: data.created_at,
          favorites: favs ? favs.map((f: any) => f.doctor_id) : []
        };
      }
    }

    const patients = getStorageData<Patient[]>(STORAGE_KEYS.PATIENTS, []);
    return patients.find(p => p.email.toLowerCase() === email.toLowerCase()) || null;
  },

  async getDoctorAccountsWithProfiles(): Promise<{ account: DoctorAccount; profile: DoctorProfile | null }[]> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase
        .from('doctor_accounts')
        .select('*, doctor_profiles(*)');

      console.log('[TamnyPlus][db] getDoctorAccountsWithProfiles', {
        error: error?.message,
        records: Array.isArray(data) ? data.length : 0
      });

      if (error) {
        throw error;
      }

      return (data as any[]).map((acc) => {
        const profileData = Array.isArray(acc.doctor_profiles) ? acc.doctor_profiles[0] : acc.doctor_profiles || null;
        const profile: DoctorProfile | null = profileData ? {
          id: profileData.id,
          full_name_ar: profileData.full_name_ar,
          full_name_en: profileData.full_name_en,
          gender: profileData.gender,
          dob: profileData.dob,
          specialty_id: profileData.specialty_id,
          sub_specialty_ar: profileData.sub_specialty_ar,
          sub_specialty_en: profileData.sub_specialty_en,
          degree_ar: profileData.degree_ar,
          degree_en: profileData.degree_en,
          experience_years: profileData.experience_years,
          clinic_name_ar: profileData.clinic_name_ar,
          clinic_name_en: profileData.clinic_name_en,
          clinic_address_ar: profileData.clinic_address_ar,
          clinic_address_en: profileData.clinic_address_en,
          governorate_id: profileData.governorate_id,
          city_id: profileData.city_id,
          google_maps_url: profileData.google_maps_url || undefined,
          phone_number: profileData.phone_number,
          whatsapp_number: profileData.whatsapp_number,
          email: profileData.email,
          clinic_price: Number(profileData.clinic_price),
          online_price: Number(profileData.online_price),
          bio_ar: profileData.bio_ar,
          bio_en: profileData.bio_en,
          syndicate_number: profileData.syndicate_number,
          languages: profileData.languages || [],
          working_days: profileData.working_days || [],
          working_hours_start: profileData.working_hours_start,
          working_hours_end: profileData.working_hours_end,
          emergency_available: profileData.emergency_available,
          website: profileData.website || undefined,
          facebook: profileData.facebook || undefined,
          instagram: profileData.instagram || undefined,
          linkedin: profileData.linkedin || undefined,
          certificates: profileData.certificates || [],
          clinic_photos: profileData.clinic_photos || [],
          cover_image: profileData.cover_image || undefined,
          profile_image: profileData.profile_image || undefined,
          rating_avg: Number(profileData.rating_avg || 5.0),
          rating_count: Number(profileData.rating_count || 0)
        } : null;

        const account: DoctorAccount = {
          id: acc.id,
          username: acc.username,
          email: acc.email,
          status: acc.status as DoctorStatus,
          created_at: acc.created_at
        };

        return { account, profile };
      });
    }

    const accounts = getStorageData<DoctorAccount[]>(STORAGE_KEYS.ACCOUNTS, SEED_DOCTOR_ACCOUNTS);
    const profiles = getStorageData<DoctorProfile[]>(STORAGE_KEYS.PROFILES, SEED_DOCTOR_PROFILES);

    return accounts.map((acc) => ({
      account: acc,
      profile: profiles.find((p) => p.id === acc.id) || null
    }));
  },

  async getDoctorProfile(doctorId: string): Promise<DoctorProfile | null> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase.from('doctor_profiles').select('*').eq('id', doctorId).maybeSingle();
      console.log('[TamnyPlus][db] getDoctorProfile', { doctorId, found: !!data, error: error?.message });
      if (!error && data) {
        return {
          id: data.id,
          full_name_ar: data.full_name_ar,
          full_name_en: data.full_name_en,
          gender: data.gender,
          dob: data.dob,
          specialty_id: data.specialty_id,
          sub_specialty_ar: data.sub_specialty_ar,
          sub_specialty_en: data.sub_specialty_en,
          degree_ar: data.degree_ar,
          degree_en: data.degree_en,
          experience_years: data.experience_years,
          clinic_name_ar: data.clinic_name_ar,
          clinic_name_en: data.clinic_name_en,
          clinic_address_ar: data.clinic_address_ar,
          clinic_address_en: data.clinic_address_en,
          governorate_id: data.governorate_id,
          city_id: data.city_id,
          google_maps_url: data.google_maps_url || undefined,
          phone_number: data.phone_number,
          whatsapp_number: data.whatsapp_number,
          email: data.email,
          clinic_price: Number(data.clinic_price),
          online_price: Number(data.online_price),
          bio_ar: data.bio_ar,
          bio_en: data.bio_en,
          syndicate_number: data.syndicate_number,
          languages: data.languages || [],
          working_days: data.working_days || [],
          working_hours_start: data.working_hours_start,
          working_hours_end: data.working_hours_end,
          emergency_available: data.emergency_available,
          website: data.website || undefined,
          facebook: data.facebook || undefined,
          instagram: data.instagram || undefined,
          linkedin: data.linkedin || undefined,
          certificates: data.certificates || [],
          clinic_photos: data.clinic_photos || [],
          cover_image: data.cover_image || undefined,
          profile_image: data.profile_image || undefined,
          rating_avg: Number(data.rating_avg || 5.0),
          rating_count: Number(data.rating_count || 0)
        };
      }
    }
    const profiles = getStorageData<DoctorProfile[]>(STORAGE_KEYS.PROFILES, SEED_DOCTOR_PROFILES);
    return profiles.find((p) => p.id === doctorId) || null;
  },

  subscribeToAuthChanges(handler: (session: { role: 'patient' | 'doctor' | 'admin'; data: any; profile?: DoctorProfile } | null) => void): () => void {
    if (!isMockMode && supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, supabaseSession) => {
        if (!supabaseSession?.user?.email) {
          handler(null);
          return;
        }

        const normalizedEmail = supabaseSession.user.email.trim().toLowerCase();
        if (normalizedEmail === 'eslamshyba220@gmail.com') {
          const adminSessionFromStorage = this.getLoggedInAdmin();
          if (adminSessionFromStorage) {
            handler(adminSessionFromStorage);
            return;
          }
          handler(null);
          return;
        }

        const patient = await this.getPatientByEmail(supabaseSession.user.email);
        if (patient) {
          const nextSession = { role: 'patient' as const, data: patient };
          setStorageData(STORAGE_KEYS.LOGGED_IN_USER, nextSession);
          handler(nextSession);
        } else {
          handler(null);
        }
      });
      return () => subscription.unsubscribe();
    }

    return () => undefined;
  },

  getLoggedInUser(): { role: 'patient' | 'doctor' | 'admin'; data: any; profile?: DoctorProfile } | null {
    const session = localStorage.getItem(STORAGE_KEYS.LOGGED_IN_USER);
    return session ? JSON.parse(session) : null;
  },

  // --- DOCTORS PUBLIC SERVICE ---
  async getApprovedDoctors(): Promise<DoctorProfile[]> {
    const allDoctors = await this.getDoctorAccountsWithProfiles();

    const approved = allDoctors.filter((item) => item.account.status === 'approved' && item.profile);
    console.log('[TamnyPlus][db] getApprovedDoctors', {
      totalDoctors: allDoctors.length,
      approvedCount: approved.length,
      filteredOut: allDoctors.length - approved.length
    });

    return approved.map((item) => item.profile!) ;
  },

  async getAllDoctorsAdmin(): Promise<{ account: DoctorAccount; profile: DoctorProfile }[]> {
    const allDoctors = await this.getDoctorAccountsWithProfiles();
    console.log('[TamnyPlus][db] getAllDoctorsAdmin', {
      total: allDoctors.length
    });

    return allDoctors.map((item) => ({
      account: item.account,
      profile: item.profile || {
        id: item.account.id,
        full_name_ar: item.account.username,
        full_name_en: item.account.username,
        gender: 'male',
        dob: '1990-01-01',
        specialty_id: 'general',
        sub_specialty_ar: '',
        sub_specialty_en: '',
        degree_ar: '',
        degree_en: '',
        experience_years: 1,
        clinic_name_ar: '',
        clinic_name_en: '',
        clinic_address_ar: '',
        clinic_address_en: '',
        governorate_id: 'cairo',
        city_id: 'nasr_city',
        phone_number: '',
        whatsapp_number: '',
        email: item.account.email,
        clinic_price: 100,
        online_price: 100,
        bio_ar: '',
        bio_en: '',
        syndicate_number: '',
        languages: [],
        working_days: [],
        working_hours_start: '09:00',
        working_hours_end: '17:00',
        emergency_available: false,
        certificates: [],
        clinic_photos: [],
        rating_avg: 5,
        rating_count: 0
      }
    }));
  },

  async updateDoctorStatus(doctorId: string, status: 'approved' | 'rejected' | 'blocked'): Promise<void> {
    if (!isMockMode && supabase) {
      await supabase.from('doctor_accounts').update({ status }).eq('id', doctorId);
      await supabase.from('notifications').insert({
        user_id: doctorId,
        title_ar: `تحديث حالة الحساب: ${status === 'approved' ? 'تم القبول' : 'مرفوض/محظور'}`,
        title_en: `Account Status Update: ${status.toUpperCase()}`,
        body_ar: status === 'approved' 
          ? 'تهانينا! تم تفعيل حسابك الطبيب بنجاح وأصبح متاحاً للجمهور الآن.' 
          : 'نعتذر، لم يتم تفعيل حسابك أو تم حظره. يرجى التواصل مع الدعم الفني.',
        body_en: status === 'approved'
          ? 'Congratulations! Your doctor profile has been successfully approved and is now visible to patients.'
          : 'Your account has been rejected or blocked. Please contact support.'
      });
      return;
    }

    const accounts = getStorageData<DoctorAccount[]>(STORAGE_KEYS.ACCOUNTS, SEED_DOCTOR_ACCOUNTS);
    const updatedAccounts = accounts.map(acc => {
      if (acc.id === doctorId) {
        return { ...acc, status };
      }
      return acc;
    });
    setStorageData(STORAGE_KEYS.ACCOUNTS, updatedAccounts);

    // Send notification to the doctor
    const notifications = getStorageData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifications.push({
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      user_id: doctorId,
      title_ar: `تحديث حالة الحساب: ${status === 'approved' ? 'تم القبول' : 'مرفوض/محظور'}`,
      title_en: `Account Status Update: ${status.toUpperCase()}`,
      body_ar: status === 'approved' 
        ? 'تهانينا! تم تفعيل حسابك الطبيب بنجاح وأصبح متاحاً للجمهور الآن.' 
        : 'نعتذر، لم يتم تفعيل حسابك أو تم حظره. يرجى التواصل مع الدعم الفني.',
      body_en: status === 'approved'
        ? 'Congratulations! Your doctor profile has been successfully approved and is now visible to patients.'
        : 'Your account has been rejected or blocked. Please contact support.',
      is_read: false,
      created_at: new Date().toISOString()
    });
    setStorageData(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  async updateDoctorProfile(doctorId: string, updatedFields: Partial<DoctorProfile>): Promise<DoctorProfile> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase
        .from('doctor_profiles')
        .update(updatedFields)
        .eq('id', doctorId)
        .select()
        .single();
      if (error) throw error;
      return {
        id: data.id,
        full_name_ar: data.full_name_ar,
        full_name_en: data.full_name_en,
        gender: data.gender,
        dob: data.dob,
        specialty_id: data.specialty_id,
        sub_specialty_ar: data.sub_specialty_ar,
        sub_specialty_en: data.sub_specialty_en,
        degree_ar: data.degree_ar,
        degree_en: data.degree_en,
        experience_years: data.experience_years,
        clinic_name_ar: data.clinic_name_ar,
        clinic_name_en: data.clinic_name_en,
        clinic_address_ar: data.clinic_address_ar,
        clinic_address_en: data.clinic_address_en,
        governorate_id: data.governorate_id,
        city_id: data.city_id,
        google_maps_url: data.google_maps_url || undefined,
        phone_number: data.phone_number,
        whatsapp_number: data.whatsapp_number,
        email: data.email,
        clinic_price: Number(data.clinic_price),
        online_price: Number(data.online_price),
        bio_ar: data.bio_ar,
        bio_en: data.bio_en,
        syndicate_number: data.syndicate_number,
        languages: data.languages || [],
        working_days: data.working_days || [],
        working_hours_start: data.working_hours_start,
        working_hours_end: data.working_hours_end,
        emergency_available: data.emergency_available,
        website: data.website || undefined,
        facebook: data.facebook || undefined,
        instagram: data.instagram || undefined,
        linkedin: data.linkedin || undefined,
        certificates: data.certificates || [],
        clinic_photos: data.clinic_photos || [],
        cover_image: data.cover_image || undefined,
        profile_image: data.profile_image || undefined,
        rating_avg: Number(data.rating_avg || 5.0),
        rating_count: Number(data.rating_count || 0)
      };
    }

    const profiles = getStorageData<DoctorProfile[]>(STORAGE_KEYS.PROFILES, SEED_DOCTOR_PROFILES);
    let updatedProfile: DoctorProfile | null = null;

    const newProfiles = profiles.map(p => {
      if (p.id === doctorId) {
        updatedProfile = { ...p, ...updatedFields } as DoctorProfile;
        return updatedProfile;
      }
      return p;
    });

    if (!updatedProfile) throw new Error('Profile not found');
    setStorageData(STORAGE_KEYS.PROFILES, newProfiles);
    return updatedProfile;
  },

  // --- BOOKING SERVICE ---
  async createBooking(booking: Omit<Booking, 'id' | 'status' | 'created_at'>): Promise<Booking> {
    if (!isMockMode && supabase) {
      // Prevent duplicate booking for same doctor/date/time only when a time is provided
      if (booking.booking_time && booking.booking_time.toString().trim() !== '') {
        const { data: existing, error: existErr } = await supabase
          .from('bookings')
          .select('id')
          .eq('doctor_id', booking.doctor_id)
          .eq('booking_date', booking.booking_date)
          .eq('booking_time', booking.booking_time)
          .neq('status', 'cancelled')
          .limit(1)
          .maybeSingle();
        if (existErr) throw existErr;
        if (existing) throw new Error('Selected time slot is already booked.');
      }

      const { data, error } = await supabase
        .from('bookings')
        .insert({
          doctor_id: booking.doctor_id,
          patient_name: booking.patient_name,
          patient_phone: booking.patient_phone,
          booking_date: booking.booking_date,
          booking_time: booking.booking_time,
          status: 'pending'
        })
        .select()
        .single();
      if (error) throw error;

      await supabase.from('notifications').insert({
        user_id: booking.doctor_id,
        title_ar: 'حجز موعد عيادة جديد',
        title_en: 'New Clinic Booking',
        body_ar: `قام المريض ${booking.patient_name} بحجز موعد بتاريخ ${booking.booking_date} الساعة ${booking.booking_time}.`,
        body_en: `Patient ${booking.patient_name} booked a session on ${booking.booking_date} at ${booking.booking_time}.`
      });

      await this.incrementAnalytics(booking.doctor_id, 'booking_clicks');

      return {
        id: data.id,
        doctor_id: data.doctor_id,
        doctor_name_ar: booking.doctor_name_ar,
        doctor_name_en: booking.doctor_name_en,
        patient_name: data.patient_name,
        patient_phone: data.patient_phone,
        booking_date: data.booking_date,
        booking_time: data.booking_time,
        status: data.status,
        created_at: data.created_at
      };
    }

    const bookings = getStorageData<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
    // Check duplicate in mock storage
    // Only check conflict when booking_time provided
    if (booking.booking_time && booking.booking_time.toString().trim() !== '') {
      const conflict = bookings.find(b => b.doctor_id === booking.doctor_id && b.booking_date === booking.booking_date && b.booking_time === booking.booking_time && b.status !== 'cancelled');
      if (conflict) {
        throw new Error('Selected time slot is already booked.');
      }
    }

    const newBooking: Booking = {
      ...booking,
      id: 'book-' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      created_at: new Date().toISOString()
    };
    bookings.push(newBooking);
    setStorageData(STORAGE_KEYS.BOOKINGS, bookings);

    // Notify the doctor
    const notifications = getStorageData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    notifications.push({
      id: 'notif-' + Math.random().toString(36).substr(2, 9),
      user_id: booking.doctor_id,
      title_ar: 'حجز موعد عيادة جديد',
      title_en: 'New Clinic Booking',
      body_ar: `قام المريض ${booking.patient_name} بحجز موعد بتاريخ ${booking.booking_date} الساعة ${booking.booking_time}.`,
      body_en: `Patient ${booking.patient_name} booked a session on ${booking.booking_date} at ${booking.booking_time}.`,
      is_read: false,
      created_at: new Date().toISOString()
    });
    setStorageData(STORAGE_KEYS.NOTIFICATIONS, notifications);

    // Auto-increment booking analytics click count
    await this.incrementAnalytics(booking.doctor_id, 'booking_clicks');

    return newBooking;
  },

  async getDoctorBookings(doctorId: string): Promise<Booking[]> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, doctor_profiles(full_name_ar, full_name_en)')
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return (data as any[]).map(b => ({
          id: b.id,
          doctor_id: b.doctor_id,
          doctor_name_ar: b.doctor_profiles?.full_name_ar || '',
          doctor_name_en: b.doctor_profiles?.full_name_en || '',
          patient_name: b.patient_name,
          patient_phone: b.patient_phone,
          booking_date: b.booking_date,
          booking_time: b.booking_time,
          status: b.status,
          created_at: b.created_at
        }));
      }
    }

    const bookings = getStorageData<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
    return bookings.filter(b => b.doctor_id === doctorId).sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  async updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled'): Promise<void> {
    if (!isMockMode && supabase) {
      await supabase.from('bookings').update({ status }).eq('id', bookingId);
      return;
    }

    const bookings = getStorageData<Booking[]>(STORAGE_KEYS.BOOKINGS, []);
    const updated = bookings.map(b => (b.id === bookingId ? { ...b, status } : b));
    setStorageData(STORAGE_KEYS.BOOKINGS, updated);
  },

  // --- REVIEWS & RATINGS SERVICE ---
  async getDoctorReviews(doctorId: string): Promise<Review[]> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('doctor_id', doctorId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Review[];
      }
    }

    const reviews = getStorageData<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    return reviews.filter(r => r.doctor_id === doctorId).sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  async getAllReviewsPublic(): Promise<Review[]> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Review[];
      }
    }

    const reviews = getStorageData<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    return reviews.filter((review) => review.is_approved !== false).sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  async createReview(doctorId: string, review: Omit<Review, 'id' | 'created_at'>): Promise<Review> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          doctor_id: doctorId,
          patient_name: review.patient_name,
          rating: review.rating,
          comment: review.comment
        })
        .select()
        .single();
      if (error) throw error;

      const { data: allReviews } = await supabase.from('reviews').select('rating').eq('doctor_id', doctorId);
      if (allReviews && allReviews.length > 0) {
        const ratingAvg = Number((allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(2));
        await supabase.from('doctor_profiles').update({
          rating_avg: ratingAvg,
          rating_count: allReviews.length
        }).eq('id', doctorId);
      }

      return data as Review;
    }

    const reviews = getStorageData<Review[]>(STORAGE_KEYS.REVIEWS, SEED_REVIEWS);
    const newReview: Review = {
      ...review,
      id: 'rev-' + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    reviews.push(newReview);
    setStorageData(STORAGE_KEYS.REVIEWS, reviews);

    // Recalculate average rating
    const profiles = getStorageData<DoctorProfile[]>(STORAGE_KEYS.PROFILES, SEED_DOCTOR_PROFILES);
    const docReviews = reviews.filter(r => r.doctor_id === doctorId);
    const ratingAvg = Number((docReviews.reduce((sum, r) => sum + r.rating, 0) / docReviews.length).toFixed(2));
    
    const updatedProfiles = profiles.map(p => {
      if (p.id === doctorId) {
        return { ...p, rating_avg: ratingAvg, rating_count: docReviews.length };
      }
      return p;
    });
    setStorageData(STORAGE_KEYS.PROFILES, updatedProfiles);

    return newReview;
  },

  // --- FAVORITES SERVICE ---
  async toggleFavorite(patientId: string, doctorId: string): Promise<string[]> {
    if (!isMockMode && supabase) {
      const { data: existing } = await supabase
        .from('favorites')
        .select('*')
        .eq('patient_id', patientId)
        .eq('doctor_id', doctorId)
        .single();
      
      if (existing) {
        await supabase.from('favorites').delete().eq('patient_id', patientId).eq('doctor_id', doctorId);
      } else {
        await supabase.from('favorites').insert({ patient_id: patientId, doctor_id: doctorId });
      }

      const { data: allFavs } = await supabase.from('favorites').select('doctor_id').eq('patient_id', patientId);
      const favsList = allFavs ? allFavs.map(f => f.doctor_id) : [];

      const session = this.getLoggedInUser();
      if (session && session.role === 'patient' && session.data.id === patientId) {
        session.data.favorites = favsList;
        setStorageData(STORAGE_KEYS.LOGGED_IN_USER, session);
      }

      return favsList;
    }

    const patients = getStorageData<Patient[]>(STORAGE_KEYS.PATIENTS, []);
    let favs: string[] = [];

    const updatedPatients = patients.map(p => {
      if (p.id === patientId) {
        const index = p.favorites.indexOf(doctorId);
        if (index > -1) {
          p.favorites.splice(index, 1);
        } else {
          p.favorites.push(doctorId);
        }
        favs = [...p.favorites];
        
        // Update live session data as well
        const session = this.getLoggedInUser();
        if (session && session.role === 'patient' && session.data.id === patientId) {
          session.data.favorites = favs;
          setStorageData(STORAGE_KEYS.LOGGED_IN_USER, session);
        }
      }
      return p;
    });

    setStorageData(STORAGE_KEYS.PATIENTS, updatedPatients);
    return favs;
  },

  // --- NOTIFICATIONS SERVICE ---
  async getNotifications(userId: string): Promise<Notification[]> {
    if (!isMockMode && supabase) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${userId},user_id.eq.all`)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Notification[];
      }
    }

    const notifs = getStorageData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    return notifs.filter(n => n.user_id === userId || n.user_id === 'all').sort((a, b) => b.created_at.localeCompare(a.created_at));
  },

  async markNotificationAsRead(id: string): Promise<void> {
    if (!isMockMode && supabase) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      return;
    }

    const notifs = getStorageData<Notification[]>(STORAGE_KEYS.NOTIFICATIONS, []);
    const updated = notifs.map(n => (n.id === id ? { ...n, is_read: true } : n));
    setStorageData(STORAGE_KEYS.NOTIFICATIONS, updated);
  },

  // --- ANALYTICS AND VISIT METRICS ---
  async incrementAnalytics(doctorId: string, field: 'profile_views' | 'whatsapp_clicks' | 'booking_clicks' | 'visitors'): Promise<void> {
    if (!isMockMode && supabase) {
      const { data } = await supabase.from('doctor_analytics').select('*').eq('doctor_id', doctorId).single();
      const currentVal = data ? Number(data[field] || 0) : 0;
      await supabase.from('doctor_analytics').update({ [field]: currentVal + 1 }).eq('doctor_id', doctorId);
      
      if (field === 'profile_views' || field === 'visitors') {
        await supabase.from('doctor_visits').insert({ doctor_id: doctorId });
      }
    }

    const analytics = getStorageData<Record<string, DoctorAnalytics>>(STORAGE_KEYS.ANALYTICS, SEED_ANALYTICS);
    
    if (!analytics[doctorId]) {
      analytics[doctorId] = {
        doctor_id: doctorId,
        profile_views: 0,
        whatsapp_clicks: 0,
        booking_clicks: 0,
        visitors: 0,
        views_history: [],
        clicks_history: []
      };
    }

    analytics[doctorId][field] += 1;

    // Record timeline tick (today)
    const todayStr = new Date().toISOString().slice(5, 10); // "MM-DD"
    const historyField = field === 'profile_views' || field === 'visitors' ? 'views_history' : 'clicks_history';
    
    const history = analytics[doctorId][historyField] || [];
    const existingDay = history.find(h => h.date === todayStr);
    if (existingDay) {
      existingDay.count += 1;
    } else {
      history.push({ date: todayStr, count: 1 });
    }
    // Keep last 7 days
    if (history.length > 7) history.shift();
    analytics[doctorId][historyField] = history;

    setStorageData(STORAGE_KEYS.ANALYTICS, analytics);

    // Call real analytics proxy if server is active (full-stack integration!)
    try {
      await fetch(`/api/analytics/${doctorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field })
      });
    } catch (e) {
      // Quietly fall back, expected when backend is booting
    }
  },

  async getDoctorAnalytics(doctorId: string): Promise<DoctorAnalytics> {
    if (!isMockMode && supabase) {
      const { data: analyticsRow } = await supabase.from('doctor_analytics').select('*').eq('doctor_id', doctorId).single();
      const { data: visits } = await supabase
        .from('doctor_visits')
        .select('visited_at')
        .eq('doctor_id', doctorId)
        .order('visited_at', { ascending: false });
      
      const views_history: { date: string; count: number }[] = [];
      if (visits) {
        const counts: Record<string, number> = {};
        visits.forEach((v: any) => {
          const dateStr = new Date(v.visited_at).toISOString().slice(5, 10);
          counts[dateStr] = (counts[dateStr] || 0) + 1;
        });
        Object.entries(counts).slice(0, 7).forEach(([date, count]) => {
          views_history.push({ date, count });
        });
      }

      return {
        doctor_id: doctorId,
        profile_views: analyticsRow ? analyticsRow.profile_views : 0,
        whatsapp_clicks: analyticsRow ? analyticsRow.whatsapp_clicks : 0,
        booking_clicks: analyticsRow ? analyticsRow.booking_clicks : 0,
        visitors: analyticsRow ? analyticsRow.visitors : 0,
        views_history,
        clicks_history: []
      };
    }

    const analytics = getStorageData<Record<string, DoctorAnalytics>>(STORAGE_KEYS.ANALYTICS, SEED_ANALYTICS);
    return analytics[doctorId] || {
      doctor_id: doctorId,
      profile_views: 0,
      whatsapp_clicks: 0,
      booking_clicks: 0,
      visitors: 0,
      views_history: [],
      clicks_history: []
    };
  }
};
