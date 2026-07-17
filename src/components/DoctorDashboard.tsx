/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  LogOut, 
  Clock, 
  Phone, 
  Calendar, 
  TrendingUp, 
  MessageSquare, 
  Settings, 
  Check, 
  X, 
  DollarSign, 
  Award, 
  AlertCircle, 
  MapPin, 
  Activity, 
  FileText, 
  CheckCircle2,
  Lock,
  Star
} from 'lucide-react';
import { Language, DoctorProfile, Booking, Review, DoctorAnalytics, DoctorAccount } from '../types';
import { dbService } from '../lib/supabase';
import { SPECIALTIES, GOVERNORATES, CITIES } from '../data/reference';

interface DoctorDashboardProps {
  language: Language;
  doctorProfile: DoctorProfile;
  onLogout: () => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({
  language,
  doctorProfile,
  onLogout,
}) => {
  const isRtl = language === 'ar';
  
  // Real-time state synced from the database
  const [profile, setProfile] = useState<DoctorProfile>(doctorProfile);
  const [account, setAccount] = useState<DoctorAccount | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [analytics, setAnalytics] = useState<DoctorAnalytics | null>(null);
  
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'reviews' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Profile Editor Form State
  const [fullNameAr, setFullNameAr] = useState(profile.full_name_ar);
  const [fullNameEn, setFullNameEn] = useState(profile.full_name_en);
  const [clinicNameAr, setClinicNameAr] = useState(profile.clinic_name_ar);
  const [clinicNameEn, setClinicNameEn] = useState(profile.clinic_name_en);
  const [clinicAddressAr, setClinicAddressAr] = useState(profile.clinic_address_ar);
  const [clinicAddressEn, setClinicAddressEn] = useState(profile.clinic_address_en);
  const [phoneNumber, setPhoneNumber] = useState(profile.phone_number);
  const [whatsappNumber, setWhatsappNumber] = useState(profile.whatsapp_number);
  const [clinicPrice, setClinicPrice] = useState(profile.clinic_price);
  const [onlinePrice, setOnlinePrice] = useState(profile.online_price);
  const [workingHoursStart, setWorkingHoursStart] = useState(profile.working_hours_start);
  const [workingHoursEnd, setWorkingHoursEnd] = useState(profile.working_hours_end);
  const [emergencyAvailable, setEmergencyAvailable] = useState(profile.emergency_available);
  const [bioAr, setBioAr] = useState(profile.bio_ar);
  const [bioEn, setBioEn] = useState(profile.bio_en);
  const [specialtyId, setSpecialtyId] = useState(profile.specialty_id);
  const [workingDays, setWorkingDays] = useState<number[]>(profile.working_days || []);
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Fetch real-time synced state
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Get approved list to check current status, or query doctor accounts
      const accounts = JSON.parse(localStorage.getItem('tamny_doctor_accounts') || '[]');
      const currentAcc = accounts.find((a: any) => a.id === profile.id);
      if (currentAcc) {
        setAccount(currentAcc);
      }

      // Load bookings
      const bData = await dbService.getDoctorBookings(profile.id);
      setBookings(bData);

      // Load reviews
      const rData = await dbService.getDoctorReviews(profile.id);
      setReviews(rData);

      // Load analytics
      const aData = await dbService.getDoctorAnalytics(profile.id);
      setAnalytics(aData);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(isRtl ? 'حدث خطأ أثناء تحميل بيانات لوحة التحكم.' : 'Error loading dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('[TamnyPlus][ui] doctor dashboard profile', {
      doctorId: profile.id,
      profileImage: profile.profile_image,
      coverImage: profile.cover_image,
      clinicPhotos: profile.clinic_photos?.length || 0
    });
    fetchDashboardData();
  }, [profile.id]);

  // Handle Booking Confirmation/Cancellation
  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled') => {
    try {
      await dbService.updateBookingStatus(bookingId, status);
      // Refresh list
      const updated = await dbService.getDoctorBookings(profile.id);
      setBookings(updated);
    } catch (err) {
      console.error('Failed to update booking:', err);
    }
  };

  // Toggle Working Days
  const handleDayToggle = (day: number) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  // Submit Profile Edits
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    setSaveSuccess(false);
    setSaveLoading(true);

    try {
      const updatedProfile = await dbService.updateDoctorProfile(profile.id, {
        full_name_ar: fullNameAr,
        full_name_en: fullNameEn,
        specialty_id: specialtyId,
        clinic_name_ar: clinicNameAr,
        clinic_name_en: clinicNameEn,
        clinic_address_ar: clinicAddressAr,
        clinic_address_en: clinicAddressEn,
        phone_number: phoneNumber,
        whatsapp_number: whatsappNumber,
        clinic_price: Number(clinicPrice),
        online_price: Number(onlinePrice),
        working_hours_start: workingHoursStart,
        working_hours_end: workingHoursEnd,
        emergency_available: emergencyAvailable,
        bio_ar: bioAr,
        bio_en: bioEn,
        working_days: workingDays
      });

      // Update local state
      setProfile(updatedProfile);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setSaveError(err.message || (isRtl ? 'حدث خطأ أثناء حفظ التحديثات.' : 'Failed to update clinical profile.'));
    } finally {
      setSaveLoading(false);
    }
  };

  const [saveError, setSaveError] = useState<string | null>(null);

  const status = account ? account.status : 'approved'; // Default fallback

  const weekDays = [
    { value: 0, label_ar: 'الأحد', label_en: 'Sunday' },
    { value: 1, label_ar: 'الاثنين', label_en: 'Monday' },
    { value: 2, label_ar: 'الثلاثاء', label_en: 'Tuesday' },
    { value: 3, label_ar: 'الأربعاء', label_en: 'Wednesday' },
    { value: 4, label_ar: 'الخميس', label_en: 'Thursday' },
    { value: 5, label_ar: 'الجمعة', label_en: 'Friday' },
    { value: 6, label_ar: 'السبت', label_en: 'Saturday' }
  ];

  const getSpecialtyName = () => {
    const s = SPECIALTIES.find(spec => spec.id === profile.specialty_id);
    return s ? (isRtl ? s.name_ar : s.name_en) : profile.specialty_id;
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      
      {/* 1. Header Hero Banner */}
      <div className="bg-white border-b border-border-brand shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 overflow-hidden border border-primary/20 shrink-0 flex items-center justify-center text-text-dark font-black uppercase">
              {profile.profile_image ? (
                <img 
                  src={profile.profile_image}
                  alt="doctor profile portrait"
                  className="w-full h-full object-cover"
                />
              ) : profile.cover_image ? (
                <img 
                  src={profile.cover_image}
                  alt="doctor cover preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span>{(isRtl ? profile.full_name_ar : profile.full_name_en).split(' ').slice(0,2).map(w => w[0]).join('')}</span>
              )}
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                <span className="text-xs font-black text-primary bg-purple-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {isRtl ? 'حساب ممارس طبي' : 'Clinical Practitioner'}
                </span>
                <h1 className="text-lg font-black text-text-dark font-display">
                  {isRtl ? profile.full_name_ar : profile.full_name_en}
                </h1>
              </div>
              <p className="text-xs font-bold text-text-muted mt-1">
                {getSpecialtyName()} — {isRtl ? profile.degree_ar : profile.degree_en}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Account Status Badge */}
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase flex items-center gap-1.5 border ${
              status === 'approved' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : status === 'pending'
                ? 'bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                status === 'approved' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
              <span>
                {status === 'approved' && (isRtl ? 'حساب معتمد نشط' : 'Approved Active')}
                {status === 'pending' && (isRtl ? 'قيد المراجعة الطبية' : 'Pending Verification')}
                {(status === 'rejected' || status === 'blocked') && (isRtl ? 'حساب موقوف / مرفوض' : 'Blocked / Rejected')}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-xs hover:bg-red-100 transition-all cursor-pointer shadow-soft"
            >
              <LogOut size={14} />
              <span>{isRtl ? 'تسجيل الخروج' : 'Logout'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. Main Content Routing Body */}
      <div className="grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {status !== 'approved' ? (
          
          /* PENDING / RESTRICTED LISTINGS WRAPPER */
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-border-brand shadow-premium text-center space-y-6"
          >
            <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center ${
              status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
            }`}>
              {status === 'pending' ? <Clock size={36} className="animate-pulse" /> : <Lock size={36} />}
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-text-dark font-display">
                {status === 'pending' 
                  ? (isRtl ? 'طلب انضمامك قيد المراجعة والتدقيق' : 'Verification Review In Progress')
                  : (isRtl ? 'تم رفض الطلب أو حظر الحساب' : 'Account Suspended or Rejected')}
              </h2>
              <p className="text-xs font-bold text-text-muted leading-relaxed">
                {status === 'pending'
                  ? (isRtl 
                    ? 'يقوم فريق طمّني بلس الطبي بمراجعة مستنداتك المهنية والتحقق من رقم القيد بنقابة الأطباء المصرية للتأكد من الموثوقية الطبية. سيتم إخطارك بمجرد التفعيل.'
                    : 'Our clinical verification board is currently auditing your academic degrees and Egyptian Medical Syndicate registration credentials. Your profile is kept hidden from search listings until approved.')
                  : (isRtl
                    ? 'لم يتم الموافقة على تفعيل حسابك الطبي أو تم تعطيله لمخالفة سياسات النشر والتوثيق. يرجى التواصل مع إدارة المنصة للمساعدة.'
                    : 'Your practitioner status has been rejected or suspended due to verification failures. Please reach out to Tamny Plus Medical Relations.')}
              </p>
            </div>

            <div className="p-4 bg-light-gray/40 rounded-2xl text-right text-xs font-bold text-text-dark divide-y divide-border-brand/40 space-y-2">
              <div className="flex justify-between pb-2">
                <span>{isRtl ? 'رقم قيد النقابة المقدم:' : 'Syndicate Reg Number:'}</span>
                <span className="text-primary">{profile.syndicate_number}</span>
              </div>
              <div className="flex justify-between pt-2 pb-2">
                <span>{isRtl ? 'البريد الإلكتروني المهني:' : 'Clinical Email:'}</span>
                <span>{profile.email}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span>{isRtl ? 'التخصص الطبي الرئيسي:' : 'Registered Specialty:'}</span>
                <span className="text-primary">{getSpecialtyName()}</span>
              </div>
            </div>

            {status === 'pending' && (
              <p className="text-[10px] font-black tracking-wider text-primary bg-purple-50 py-2 px-4 rounded-xl inline-block uppercase">
                {isRtl ? '💡 عادةً ما تستغرق مراجعة الأوراق الثبوتية ١٢-٢٤ ساعة عمل.' : '💡 Profile audits usually complete within 12-24 business hours.'}
              </p>
            )}

          </motion.div>

        ) : (
          
          /* APPROVED / FULL LISTING ACTIVE DASHBOARD */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar Navigation Rails */}
            <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-border-brand shadow-soft space-y-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full h-11 px-4 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'overview' ? 'gradient-bg text-white shadow-premium' : 'text-text-muted hover:text-text-dark hover:bg-light-gray'
                }`}
              >
                <TrendingUp size={16} />
                <span>{isRtl ? 'مؤشرات الأداء والتحليلات' : 'Analytics Overview'}</span>
              </button>

              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full h-11 px-4 rounded-xl text-xs font-black flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'appointments' ? 'gradient-bg text-white shadow-premium' : 'text-text-muted hover:text-text-dark hover:bg-light-gray'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={16} />
                  <span>{isRtl ? 'طلبات حجوزات المرضى' : 'Clinical Appointments'}</span>
                </div>
                {bookings.filter(b => b.status === 'pending').length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    activeTab === 'appointments' ? 'bg-white text-primary' : 'bg-primary text-white'
                  }`}>
                    {bookings.filter(b => b.status === 'pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full h-11 px-4 rounded-xl text-xs font-black flex items-center justify-between transition-all cursor-pointer ${
                  activeTab === 'reviews' ? 'gradient-bg text-white shadow-premium' : 'text-text-muted hover:text-text-dark hover:bg-light-gray'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={16} />
                  <span>{isRtl ? 'آراء وتقييمات المرضى' : 'Patient Feedback'}</span>
                </div>
                {reviews.length > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    activeTab === 'reviews' ? 'bg-white text-primary' : 'bg-primary/10 text-primary'
                  }`}>
                    {reviews.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full h-11 px-4 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
                  activeTab === 'settings' ? 'gradient-bg text-white shadow-premium' : 'text-text-muted hover:text-text-dark hover:bg-light-gray'
                }`}
              >
                <Settings size={16} />
                <span>{isRtl ? 'إعدادات وبيانات العيادة' : 'Clinic Configuration'}</span>
              </button>
            </div>

            {/* Dashboard Content Container */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                
                {activeTab === 'overview' && (
                  /* TAB 1: OVERVIEW & ANALYTICS Metrics */
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="space-y-6"
                  >
                    {/* Welcome banner */}
                    <div className="p-6 bg-gradient-to-r from-purple-500/5 to-primary/5 rounded-3xl border border-border-brand/60">
                      <h2 className="text-base font-black text-text-dark font-display">
                        {isRtl ? `مرحباً د. ${profile.full_name_ar}` : `Welcome Dr. ${profile.full_name_en}`}
                      </h2>
                      <p className="text-xs font-bold text-text-muted mt-1 leading-relaxed">
                        {isRtl 
                          ? 'هنا تجد إحصائيات تفاعلية ونسب النقرات المسجلة على عيادتك الطبية طوال فترة النشر، بالإضافة لحجم الحجوزات النشطة.'
                          : 'Monitor real-time directory impressions, click-through rates, patient messages, and clinical scheduling trends.'}
                      </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      
                      <div className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">{isRtl ? 'زيارات الملف' : 'Impressions'}</span>
                          <span className="p-1.5 rounded-lg bg-purple-50 text-primary"><Activity size={12} /></span>
                        </div>
                        <p className="text-2xl font-black text-text-dark font-display">{analytics?.profile_views || 0}</p>
                      </div>

                      <div className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">{isRtl ? 'نقرات الحجز' : 'Booking Clicks'}</span>
                          <span className="p-1.5 rounded-lg bg-purple-50 text-primary"><Calendar size={12} /></span>
                        </div>
                        <p className="text-2xl font-black text-text-dark font-display">{analytics?.booking_clicks || 0}</p>
                      </div>

                      <div className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">{isRtl ? 'نقرات واتساب' : 'WhatsApp Leads'}</span>
                          <span className="p-1.5 rounded-lg bg-green-50 text-green-600"><MessageSquare size={12} /></span>
                        </div>
                        <p className="text-2xl font-black text-text-dark font-display">{analytics?.whatsapp_clicks || 0}</p>
                      </div>

                      <div className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black text-text-muted uppercase tracking-wider">{isRtl ? 'متوسط التقييم' : 'Clinical Score'}</span>
                          <span className="p-1.5 rounded-lg bg-yellow-50 text-yellow-600"><Star size={12} fill="currentColor" /></span>
                        </div>
                        <p className="text-2xl font-black text-text-dark font-display">{profile.rating_avg} ⭐</p>
                      </div>

                    </div>

                    {/* Booking Activity Feed */}
                    <div className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-4">
                      <h3 className="text-xs font-black text-text-dark uppercase tracking-wider pb-2 border-b border-border-brand/60">
                        {isRtl ? 'مستجدات المواعيد وجدول اليوم' : 'Active Clinical Agenda'}
                      </h3>
                      {bookings.length === 0 ? (
                        <div className="text-center py-10 text-xs font-bold text-text-muted">
                          {isRtl ? 'لا توجد حجوزات نشطة مسجلة حالياً.' : 'Your clinical roster is currently clear.'}
                        </div>
                      ) : (
                        <div className="divide-y divide-border-brand/40">
                          {bookings.slice(0, 4).map(b => (
                            <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs font-bold text-text-muted">
                              <div className="space-y-1">
                                <p className="text-text-dark font-black">{b.patient_name}</p>
                                <p className="text-[11px] font-semibold text-text-muted">
                                  📅 {b.booking_date} — ⏰ {b.booking_time}
                                </p>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-black self-start sm:self-center uppercase ${
                                b.status === 'confirmed' 
                                  ? 'bg-green-50 text-green-700' 
                                  : b.status === 'cancelled'
                                  ? 'bg-red-50 text-red-700'
                                  : 'bg-yellow-50 text-yellow-700'
                              }`}>
                                {b.status === 'confirmed' && (isRtl ? 'مؤكد' : 'Confirmed')}
                                {b.status === 'cancelled' && (isRtl ? 'ملغي' : 'Cancelled')}
                                {b.status === 'pending' && (isRtl ? 'قيد الانتظار' : 'Pending')}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'appointments' && (
                  /* TAB 2: ACTIVE APPOINTMENTS ROSTER */
                  <motion.div
                    key="appointments"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-4"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-border-brand/60">
                      <h2 className="text-sm font-black text-text-dark uppercase tracking-wider">
                        {isRtl ? 'إدارة حجوزات ومواعيد المرضى' : 'Patient Appointments Roster'}
                      </h2>
                      <span className="text-xs font-bold text-text-muted">
                        {bookings.length} {isRtl ? 'حجز مسجل' : 'bookings cataloged'}
                      </span>
                    </div>

                    {bookings.length === 0 ? (
                      <div className="text-center py-16 text-xs font-bold text-text-muted space-y-2">
                        <p>{isRtl ? 'لم يستقبل حسابك أي طلبات حجز بعد.' : 'No patients have booked appointments yet.'}</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-border-brand/40 max-h-[60vh] overflow-y-auto pr-1">
                        {bookings.map((b) => (
                          <div key={b.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-bold text-text-muted">
                            
                            <div className="space-y-1.5 grow">
                              <div className="flex items-center gap-2">
                                <span className="p-1 rounded-md bg-purple-50 text-primary shrink-0">
                                  <User size={12} />
                                </span>
                                <h3 className="text-sm font-black text-text-dark">{b.patient_name}</h3>
                              </div>
                              <p className="flex items-center gap-1">
                                <Phone size={12} className="text-primary shrink-0" />
                                <a href={`tel:${b.patient_phone}`} className="hover:underline">{b.patient_phone}</a>
                              </p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-text-muted font-bold">
                                <span>📅 {b.booking_date}</span>
                                <span>⏰ {b.booking_time}</span>
                              </div>
                            </div>

                            <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                              
                              {b.status === 'pending' ? (
                                <div className="flex gap-2 w-full sm:w-auto">
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'confirmed')}
                                    className="px-3 h-8 rounded-lg bg-green-50 text-green-700 border border-green-100 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <Check size={11} className="stroke-[3]" />
                                    <span>{isRtl ? 'تأكيد الحجز' : 'Confirm'}</span>
                                  </button>
                                  <button
                                    onClick={() => handleUpdateBookingStatus(b.id, 'cancelled')}
                                    className="px-3 h-8 rounded-lg bg-red-50 text-red-700 border border-red-100 text-[10px] font-black flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <X size={11} className="stroke-[3]" />
                                    <span>{isRtl ? 'إلغاء' : 'Cancel'}</span>
                                  </button>
                                </div>
                              ) : (
                                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                                  b.status === 'confirmed' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                                }`}>
                                  {b.status === 'confirmed' ? (isRtl ? 'موعد مؤكد ✓' : 'CONFIRMED ✓') : (isRtl ? 'موعد ملغي ✕' : 'CANCELLED ✕')}
                                </span>
                              )}
                              
                            </div>

                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  /* TAB 3: PATIENT REVIEWS & SCORES FEED */
                  <motion.div
                    key="reviews"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-4"
                  >
                    <div className="pb-2 border-b border-border-brand/60">
                      <h2 className="text-sm font-black text-text-dark uppercase tracking-wider">
                        {isRtl ? 'آراء المرضى والتقييمات المسجلة' : 'Patient Reviews & Testimonials'}
                      </h2>
                    </div>

                    {reviews.length === 0 ? (
                      <div className="text-center py-16 text-xs font-bold text-text-muted">
                        {isRtl ? 'لا توجد آراء مسجلة حتى الآن.' : 'No patient reviews have been cataloged yet.'}
                      </div>
                    ) : (
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                        {reviews.map(r => (
                          <div key={r.id} className="p-4 bg-light-gray/30 rounded-2xl border border-border-brand/40 space-y-2 text-xs font-bold text-text-muted">
                            <div className="flex justify-between items-center text-text-dark">
                              <span>{r.patient_name}</span>
                              <div className="flex items-center gap-0.5 text-yellow-500">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={10} 
                                    fill={i < r.rating ? 'currentColor' : 'none'} 
                                    className="stroke-1"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="font-semibold text-text-dark/95 leading-relaxed">
                              {r.comment}
                            </p>
                            <p className="text-[10px] text-text-muted text-left">
                              {new Date(r.created_at).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  /* TAB 4: CLINIC PROFILE DATA EDITOR */
                  <motion.div
                    key="settings"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-6"
                  >
                    <div>
                      <h2 className="text-sm font-black text-text-dark uppercase tracking-wider">
                        {isRtl ? 'تحديث الملف الطبي وإعدادات العيادة' : 'Clinical Profile Settings'}
                      </h2>
                      <p className="text-[11px] font-bold text-text-muted mt-1">
                        {isRtl ? 'قم بتعديل بيانات عيادتك وأسعار كشفك وأيام العمل لتظهر محدثة فوراً للمرضى.' : 'Configure consultation fees, business hours, and biography.'}
                      </p>
                    </div>

                    <form onSubmit={handleProfileUpdate} className="space-y-6 text-xs font-bold text-text-muted">
                      
                      {saveSuccess && (
                        <div className="p-4 bg-green-50 text-green-700 border border-green-100 rounded-2xl flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          <span>{isRtl ? 'تم حفظ وتحديث ملفك الطبي بنجاح! 🎉' : 'Your clinical profile was saved successfully! 🎉'}</span>
                        </div>
                      )}

                      {saveError && (
                        <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl">
                          {saveError}
                        </div>
                      )}

                      {/* Name fields */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'الاسم الثلاثي بالعربية' : 'Full Name (Arabic)'}</label>
                          <input
                            type="text"
                            required
                            value={fullNameAr}
                            onChange={(e) => setFullNameAr(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'الاسم بالإنجليزية' : 'Full Name (English)'}</label>
                          <input
                            type="text"
                            required
                            value={fullNameEn}
                            onChange={(e) => setFullNameEn(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      {/* Clinic Coordinates */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'اسم العيادة بالعربية' : 'Clinic Name (Arabic)'}</label>
                          <input
                            type="text"
                            required
                            value={clinicNameAr}
                            onChange={(e) => setClinicNameAr(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'اسم العيادة بالإنجليزية' : 'Clinic Name (English)'}</label>
                          <input
                            type="text"
                            required
                            value={clinicNameEn}
                            onChange={(e) => setClinicNameEn(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'التخصص الطبي الرئيسي' : 'Primary Medical Specialty'}</label>
                          <select
                            required
                            value={specialtyId}
                            onChange={(e) => setSpecialtyId(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          >
                            <option value="">{isRtl ? 'اختر التخصص' : 'Select Specialty'}</option>
                            <optgroup label={isRtl ? 'التخصصات الطبية' : 'Medical Specialists'}>
                              {SPECIALTIES.filter((s) => s.group !== 'pediatric_rehab').map((spec) => (
                                <option key={spec.id} value={spec.id}>
                                  {isRtl ? spec.name_ar : spec.name_en}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label={isRtl ? 'أخصائيون أطفال وتأهيل' : 'Child & Rehabilitation Specialists'}>
                              {SPECIALTIES.filter((s) => s.group === 'pediatric_rehab').map((spec) => (
                                <option key={spec.id} value={spec.id}>
                                  {isRtl ? spec.name_ar : spec.name_en}
                                </option>
                              ))}
                            </optgroup>
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'عنوان العيادة بالعربية' : 'Clinic Address (Arabic)'}</label>
                          <input
                            type="text"
                            required
                            value={clinicAddressAr}
                            onChange={(e) => setClinicAddressAr(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'عنوان العيادة بالإنجليزية' : 'Clinic Address (English)'}</label>
                          <input
                            type="text"
                            required
                            value={clinicAddressEn}
                            onChange={(e) => setClinicAddressEn(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      {/* Phone / Whatsapp */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'هاتف العيادة' : 'Clinic Phone'}</label>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'واتساب العيادة المعتمد' : 'Clinic WhatsApp'}</label>
                          <input
                            type="tel"
                            required
                            value={whatsappNumber}
                            onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-light-gray/40 rounded-2xl border border-border-brand/40">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-primary font-black flex items-center gap-1">
                            <DollarSign size={12} />
                            <span>{isRtl ? 'سعر كشف العيادة الفعلي (بالجنيه)' : 'Clinic Consultation Price (EGP)'}</span>
                          </label>
                          <input
                            type="number"
                            required
                            min="50"
                            max="5000"
                            value={clinicPrice}
                            onChange={(e) => setClinicPrice(Number(e.target.value))}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-primary font-black flex items-center gap-1">
                            <DollarSign size={12} />
                            <span>{isRtl ? 'سعر الكشف الأونلاين/المرئي (بالجنيه)' : 'Online Consultation Price (EGP)'}</span>
                          </label>
                          <input
                            type="number"
                            required
                            min="50"
                            max="5000"
                            value={onlinePrice}
                            onChange={(e) => setOnlinePrice(Number(e.target.value))}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                      </div>

                      {/* Business Schedule */}
                      <div className="space-y-3">
                        <label className="text-[10px] uppercase text-text-muted block">{isRtl ? 'أيام العمل الرسمية بالعيادة' : 'Clinical Operating Days'}</label>
                        <div className="flex flex-wrap gap-2">
                          {weekDays.map((day) => (
                            <button
                              key={day.value}
                              type="button"
                              onClick={() => handleDayToggle(day.value)}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                workingDays.includes(day.value) ? 'bg-primary/5 text-primary border-primary' : 'bg-white text-text-muted border-border-brand'
                              }`}
                            >
                              {isRtl ? day.label_ar : day.label_en}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted flex items-center gap-1">
                            <Clock size={12} />
                            <span>{isRtl ? 'ساعة بداية الشيفت' : 'Shift Start'}</span>
                          </label>
                          <input
                            type="time"
                            required
                            value={workingHoursStart}
                            onChange={(e) => setWorkingHoursStart(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted flex items-center gap-1">
                            <Clock size={12} />
                            <span>{isRtl ? 'ساعة نهاية الشيفت' : 'Shift End'}</span>
                          </label>
                          <input
                            type="time"
                            required
                            value={workingHoursEnd}
                            onChange={(e) => setWorkingHoursEnd(e.target.value)}
                            className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                          />
                        </div>
                        <div className="pt-4">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={emergencyAvailable}
                              onChange={(e) => setEmergencyAvailable(e.target.checked)}
                              className="w-4.5 h-4.5 rounded border-border-brand text-primary focus:ring-primary accent-primary"
                            />
                            <span className="text-xs font-bold text-text-dark">
                              {isRtl ? 'متوفر للطوارئ والحالات الحرجة ٢٤/٧' : 'Available for Emergency 24/7'}
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Biographies */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'النبذة المهنية بالعربية' : 'Biography Summary (Arabic)'}</label>
                          <textarea
                            required
                            rows={3}
                            value={bioAr}
                            onChange={(e) => setBioAr(e.target.value)}
                            className="w-full p-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none text-xs leading-relaxed font-semibold"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase text-text-muted">{isRtl ? 'النبذة المهنية بالإنجليزية' : 'Biography Summary (English)'}</label>
                          <textarea
                            required
                            rows={3}
                            value={bioEn}
                            onChange={(e) => setBioEn(e.target.value)}
                            className="w-full p-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none text-xs leading-relaxed font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={saveLoading}
                        className="px-8 h-12 bg-primary text-white rounded-xl font-black text-xs shadow-premium flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                      >
                        {saveLoading ? (
                          <span className="animate-spin inline-block border-2 border-white/40 border-t-white rounded-full w-4 h-4" />
                        ) : (
                          <span>{isRtl ? 'حفظ وحفظ التغييرات الطبية' : 'Save Clinical Profile'}</span>
                        )}
                      </button>

                    </form>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>

        )}

      </div>

    </div>
  );
};
