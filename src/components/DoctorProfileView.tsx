/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  MapPin, 
  Phone, 
  Calendar as CalendarIcon, 
  Award, 
  CheckCircle2, 
  Clock, 
  Heart, 
  Star, 
  MessageCircle, 
  ExternalLink, 
  X,
  Languages,
  Check
} from 'lucide-react';
import { Language, DoctorProfile, Review, Patient, Booking } from '../types';
import { dbService } from '../lib/supabase';
import { SPECIALTIES } from '../data/reference';
import { HeadTagsManager } from '../lib/head-tags-manager';

interface DoctorProfileViewProps {
  language: Language;
  doctorProfile: DoctorProfile;
  loggedInUser: { role: 'patient' | 'doctor' | 'admin'; data: any } | null;
  onBack: () => void;
  onRefreshUser: () => Promise<void>;
  onOpenAuth: (role: 'patient' | 'doctor') => void;
}

export const DoctorProfileView: React.FC<DoctorProfileViewProps> = ({
  language,
  doctorProfile,
  loggedInUser,
  onBack,
  onRefreshUser,
  onOpenAuth,
}) => {
  const isRtl = language === 'ar';
  
  // States
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  
  // Booking Form State (time removed for quick booking)
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [doctorBookings, setDoctorBookings] = useState<Booking[]>([]);

  // Review Input State
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Load reviews on mount & track profile view
  useEffect(() => {
    // Update SEO metadata for doctor profile
    HeadTagsManager.updatePageSEO({
      title: `${isRtl ? doctorProfile.full_name_ar : doctorProfile.full_name_en} | طمني بلس - Tamenni Plus`,
      description:
        (isRtl ? doctorProfile.bio_ar : doctorProfile.bio_en) ||
        `ملف الدكتور ${isRtl ? doctorProfile.full_name_ar : doctorProfile.full_name_en} - ${getSpecialtyName()} - طمني بلس`,
      canonical: `https://tamnyplus.com/doctor/${doctorProfile.id}`,
      keywords: `${isRtl ? doctorProfile.full_name_ar : doctorProfile.full_name_en}, ${getSpecialtyName()}, حجز موعد, دكتور, طبيب`,
      image: doctorProfile.profile_image || 'https://tamnyplus.com/logo.png',
      url: `https://tamnyplus.com/doctor/${doctorProfile.id}`,
      type: 'website',
      schema: {
        '@context': 'https://schema.org',
        '@type': 'Physician',
        '@id': `https://tamnyplus.com/doctor/${doctorProfile.id}`,
        'name': isRtl ? doctorProfile.full_name_ar : doctorProfile.full_name_en,
        'description': (isRtl ? doctorProfile.bio_ar : doctorProfile.bio_en) || '',
        'url': `https://tamnyplus.com/doctor/${doctorProfile.id}`,
        'image': doctorProfile.profile_image || 'https://tamnyplus.com/logo.png',
        'medicalSpecialty': getSpecialtyName(),
        'telephone': doctorProfile.phone_number,
        'aggregateRating': {
          '@type': 'AggregateRating',
          'ratingValue': doctorProfile.rating_avg || 5,
          'ratingCount': doctorProfile.rating_count || 0
        }
      }
    });

    console.log('[TamnyPlus][ui] doctor profile view mounted', {
      doctorId: doctorProfile.id,
      profileImage: doctorProfile.profile_image,
      coverImage: doctorProfile.cover_image,
      clinicPhotos: doctorProfile.clinic_photos?.length || 0
    });

    let active = true;
    
    const loadData = async () => {
      try {
        setLoadingReviews(true);
        const data = await dbService.getDoctorReviews(doctorProfile.id);
        if (active) {
          setReviews(data);
          setLoadingReviews(false);
        }
      } catch (err) {
        console.error('Failed to load reviews:', err);
      }
    };

    loadData();
    dbService.incrementAnalytics(doctorProfile.id, 'profile_views');

    // Load bookings for this doctor (to mark booked slots)
    const loadBookings = async () => {
      try {
        const b = await dbService.getDoctorBookings(doctorProfile.id);
        if (active) setDoctorBookings(b);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      }
    };
    loadBookings();

    // Pre-populate patient name if logged in
    if (loggedInUser && loggedInUser.role === 'patient') {
      setPatientName(loggedInUser.data.name || '');
    }

    return () => {
      active = false;
    };
  }, [doctorProfile.id, loggedInUser]);

  // Refresh bookings when booking is submitted successfully
  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const b = await dbService.getDoctorBookings(doctorProfile.id);
        if (active) setDoctorBookings(b);
      } catch (err) {
        console.error('Failed to refresh bookings:', err);
      }
    };
    refresh();
    return () => { active = false; };
  }, [doctorProfile.id, bookingSuccess]);

  // Is doctor favorited
  const isFavorited = loggedInUser?.role === 'patient' && 
    (loggedInUser.data.favorites || []).includes(doctorProfile.id);

  const handleFavoriteToggle = async () => {
    if (!loggedInUser || loggedInUser.role !== 'patient') {
      onOpenAuth('patient');
      return;
    }
    try {
      await dbService.toggleFavorite(loggedInUser.data.id, doctorProfile.id);
      await onRefreshUser();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const handleWhatsAppClick = () => {
    dbService.incrementAnalytics(doctorProfile.id, 'whatsapp_clicks');
    window.open(`https://wa.me/${doctorProfile.whatsapp_number}`, '_blank');
  };

  const handlePhoneClick = () => {
    // Increment whatsapp/clicks stats or track it as clinic view
    dbService.incrementAnalytics(doctorProfile.id, 'whatsapp_clicks');
  };

  // Generate date options from today onwards matching the doctor's working days
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    
    // Generate dates for next 14 days
    for (let i = 0; i < 14; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      const dayOfWeek = futureDate.getDay(); // 0 is Sunday, 1 is Monday, etc.
      
      // If doctor works on this day (or if no working days specified)
      if (doctorProfile.working_days.length === 0 || doctorProfile.working_days.includes(dayOfWeek)) {
        dates.push(futureDate);
      }
    }
    return dates;
  };

  const dateOptions = getDateOptions();

  // Time slots removed: Quick Booking uses date only

  // Handle appointment booking
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingError(null);
    setBookingSuccess(false);

    if (!selectedDate || !patientName || !patientPhone) {
      setBookingError(isRtl ? 'يرجى ملء جميع حقول الحجز.' : 'Please fill all booking fields.');
      return;
    }

    setBookingLoading(true);
    try {
      await dbService.createBooking({
        doctor_id: doctorProfile.id,
        doctor_name_ar: doctorProfile.full_name_ar,
        doctor_name_en: doctorProfile.full_name_en,
        patient_name: patientName,
        patient_phone: patientPhone,
        booking_date: selectedDate
      });
      setBookingSuccess(true);
      setSelectedDate('');
      // time is not used in quick booking
      // Keep patientName / phone to avoid clearing
    } catch (err: any) {
      setBookingError(err.message || (isRtl ? 'حدث خطأ أثناء حجز الموعد.' : 'Error booking appointment.'));
    } finally {
      setBookingLoading(false);
    }
  };

  // Handle review submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError(null);

    if (!loggedInUser || loggedInUser.role !== 'patient') {
      setReviewError(isRtl ? 'يجب تسجيل الدخول كـ مريض لكتابة تقييم.' : 'You must log in as a patient to review.');
      return;
    }

    if (!reviewComment.trim()) {
      setReviewError(isRtl ? 'يرجى كتابة تعليق تقييم.' : 'Please write a review comment.');
      return;
    }

    setReviewLoading(true);
    try {
      await dbService.createReview(doctorProfile.id, {
        doctor_id: doctorProfile.id,
        patient_name: loggedInUser.data.name || 'Anonymous Patient',
        rating: reviewRating,
        comment: reviewComment,
      });
      
      // Reload reviews
      const updated = await dbService.getDoctorReviews(doctorProfile.id);
      setReviews(updated);
      setReviewComment('');
      setReviewRating(5);
    } catch (err: any) {
      setReviewError(err.message || (isRtl ? 'حدث خطأ أثناء حفظ التقييم.' : 'Error saving review.'));
    } finally {
      setReviewLoading(false);
    }
  };

  // Get specialty name
  const getSpecialtyName = () => {
    const spec = SPECIALTIES.find(s => s.id === doctorProfile.specialty_id);
    return spec ? (isRtl ? spec.name_ar : spec.name_en) : doctorProfile.specialty_id;
  };

  const getDayName = (dayIndex: number) => {
    const days = [
      { ar: 'الأحد', en: 'Sunday' },
      { ar: 'الاثنين', en: 'Monday' },
      { ar: 'الثلاثاء', en: 'Tuesday' },
      { ar: 'الأربعاء', en: 'Wednesday' },
      { ar: 'الخميس', en: 'Thursday' },
      { ar: 'الجمعة', en: 'Friday' },
      { ar: 'السبت', en: 'Saturday' }
    ];
    return isRtl ? days[dayIndex].ar : days[dayIndex].en;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      
      {/* 1. Header Navigation Bar */}
      <div className="flex items-center justify-between pb-4 border-b border-border-brand/60">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-white border border-border-brand text-text-dark hover:border-primary hover:text-primary transition-all font-bold text-xs cursor-pointer shadow-soft"
        >
          {isRtl ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
          <span>{isRtl ? 'العودة للبحث' : 'Back to Search'}</span>
        </button>

        <button
          onClick={handleFavoriteToggle}
          className={`flex items-center gap-1.5 px-4 h-10 rounded-xl border font-bold text-xs shadow-soft transition-all cursor-pointer ${
            isFavorited 
              ? 'bg-red-50 text-red-600 border-red-200' 
              : 'bg-white text-text-muted border-border-brand hover:border-red-500 hover:text-red-500'
          }`}
        >
          <Heart size={14} fill={isFavorited ? 'currentColor' : 'none'} className={isFavorited ? 'scale-110' : ''} />
          <span>
            {isFavorited 
              ? (isRtl ? 'مضاف للمفضلة' : 'Favorited') 
              : (isRtl ? 'حفظ في المفضلة' : 'Save to Favorites')}
          </span>
        </button>
      </div>

      {/* 2. Doctor Cover and Profile Card */}
      <div className="bg-white rounded-3xl border border-border-brand shadow-premium overflow-hidden">
        
        {/* Cover Photo */}
        <div className="h-44 sm:h-56 relative overflow-hidden rounded-t-3xl bg-gradient-to-r from-purple-500/10 to-primary/10">
          {doctorProfile.cover_image ? (
            <img 
              src={doctorProfile.cover_image}
              alt="medical cover banner"
              className="w-full h-full object-cover opacity-80"
            />
          ) : doctorProfile.profile_image ? (
            <img 
              src={doctorProfile.profile_image}
              alt="medical cover banner"
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-primary/5" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        {/* Doctor Details Row */}
        <div className="px-6 pb-6 pt-0 relative sm:flex sm:items-end sm:gap-6 sm:px-8">
          
          {/* Portrait Image */}
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl border-4 border-white bg-light-gray overflow-hidden shadow-soft shrink-0 mx-auto sm:mx-0 -mt-12 sm:-mt-16 z-10 relative flex items-center justify-center text-xl font-black text-text-dark uppercase">
            {doctorProfile.profile_image ? (
              <img 
                src={doctorProfile.profile_image}
                alt={doctorProfile.full_name_en}
                className="w-full h-full object-cover"
              />
            ) : doctorProfile.cover_image ? (
              <img 
                src={doctorProfile.cover_image}
                alt={doctorProfile.full_name_en}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{(isRtl ? doctorProfile.full_name_ar : doctorProfile.full_name_en).split(' ').slice(0,2).map(w => w[0]).join('')}</span>
            )}
          </div>

          <div className="grow text-center sm:text-right space-y-2 mt-4 sm:mt-0 pt-2">
            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-text-dark font-display">
                    {isRtl ? doctorProfile.full_name_ar : doctorProfile.full_name_en}
                  </h1>
                  <span className="w-5 h-5 rounded-full bg-purple-50 text-primary flex items-center justify-center shadow-soft" title="Verified Professional">
                    <CheckCircle2 size={13} className="stroke-[3]" />
                  </span>
                </div>
                <p className="text-sm font-black text-primary mt-1">
                  {getSpecialtyName()} — {doctorProfile.sub_specialty_ar ? (isRtl ? doctorProfile.sub_specialty_ar : doctorProfile.sub_specialty_en) : ''}
                </p>
              </div>

              {/* Doctor Stars Average rating */}
              <div className="flex items-center gap-1.5 text-xs font-black bg-purple-50 text-primary px-3.5 py-1.5 rounded-full">
                <Star size={12} fill="currentColor" />
                <span>{doctorProfile.rating_avg} ({doctorProfile.rating_count} {isRtl ? 'تقييم مريض' : 'patient reviews'})</span>
              </div>
            </div>
            
            {/* Degree and experience summary */}
            <p className="text-xs font-bold text-text-muted">
              🎓 {isRtl ? doctorProfile.degree_ar : doctorProfile.degree_en}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Main Split Layout: Info & Contacts vs. Booking Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left/Right Grid Col Span 7: Doctor Information details */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Biography */}
          <div className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-4">
            <h2 className="text-sm font-black text-text-dark uppercase tracking-wider pb-2 border-b border-border-brand/60">
              {isRtl ? 'نبذة عن الطبيب وعيادته' : 'Clinical Biography'}
            </h2>
            <p className="text-xs font-semibold text-text-muted leading-relaxed whitespace-pre-wrap">
              {isRtl ? doctorProfile.bio_ar : doctorProfile.bio_en}
            </p>
          </div>

          {/* Practice Coordinates & Fees */}
          <div className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-4">
            <h2 className="text-sm font-black text-text-dark uppercase tracking-wider pb-2 border-b border-border-brand/60">
              {isRtl ? 'موقع ومواصفات الكشف الطبي' : 'Clinic Details & Consultation Fees'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-text-muted">
              <div className="p-4 bg-light-gray/40 rounded-2xl border border-border-brand/40 space-y-2">
                <p className="text-[10px] uppercase text-primary font-black tracking-wider">
                  {isRtl ? 'العيادة الفعلية' : 'Clinic Consultation'}
                </p>
                <p className="text-text-dark font-black">{isRtl ? doctorProfile.clinic_name_ar : doctorProfile.clinic_name_en}</p>
                <p className="flex items-center gap-1">
                  <MapPin size={12} className="text-primary shrink-0" />
                  <span>{isRtl ? doctorProfile.clinic_address_ar : doctorProfile.clinic_address_en}</span>
                </p>
                <div className="flex justify-between items-center text-text-dark pt-1 border-t border-border-brand/20">
                  <span>{isRtl ? 'سعر الكشف بالعيادة:' : 'Clinical Fee:'}</span>
                  <span className="font-black text-primary">{doctorProfile.clinic_price} {isRtl ? 'جنيه' : 'EGP'}</span>
                </div>
              </div>

              <div className="p-4 bg-light-gray/40 rounded-2xl border border-border-brand/40 space-y-2 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase text-primary font-black tracking-wider">
                    {isRtl ? 'الاستشارة المرئية (أونلاين)' : 'Online Tele-Medicine'}
                  </p>
                  <p className="text-text-dark font-semibold">
                    {isRtl ? 'استشارة مرئية ومتابعة من المنزل بالاتصال الصوتي والمرئي' : 'Direct video consulting and diagnostic chats from home'}
                  </p>
                </div>
                <div className="flex justify-between items-center text-text-dark pt-1 border-t border-border-brand/20">
                  <span>{isRtl ? 'سعر الكشف الأونلاين:' : 'Tele-medicine Fee:'}</span>
                  <span className="font-black text-primary">{doctorProfile.online_price} {isRtl ? 'جنيه' : 'EGP'}</span>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleWhatsAppClick}
                className="flex-1 h-11 rounded-xl bg-green-50 text-green-700 border border-green-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-green-100 transition-all cursor-pointer shadow-soft"
              >
                <MessageCircle size={14} fill="currentColor" />
                <span>{isRtl ? 'محادثة واتساب العيادة' : 'WhatsApp Chat Clinic'}</span>
              </button>

              <a
                href={`tel:${doctorProfile.phone_number}`}
                onClick={handlePhoneClick}
                className="flex-1 h-11 rounded-xl bg-purple-50 text-primary border border-purple-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-purple-100/60 transition-all cursor-pointer shadow-soft"
              >
                <Phone size={14} />
                <span>{isRtl ? `اتصال هاتفي: ${doctorProfile.phone_number}` : `Call Phone: ${doctorProfile.phone_number}`}</span>
              </a>
            </div>
          </div>

          {/* Working hours & Languages */}
          <div className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-4">
            <h2 className="text-sm font-black text-text-dark uppercase tracking-wider pb-2 border-b border-border-brand/60">
              {isRtl ? 'ساعات العمل واللغات المتحدث بها' : 'Clinical Hours & Languages'}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-bold text-text-muted">
              
              {/* Hours */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase text-primary font-black tracking-wider flex items-center gap-1">
                  <Clock size={12} />
                  <span>{isRtl ? 'أيام وساعات العمل:' : 'Operating Shift Hours:'}</span>
                </p>
                <div className="space-y-1 bg-light-gray/20 p-3 rounded-2xl border border-border-brand/30">
                  <p className="text-text-dark font-black">
                    {doctorProfile.working_days.map(d => getDayName(d)).join(' ، ')}
                  </p>
                  <p className="text-[11px] font-semibold text-text-muted mt-1">
                    {isRtl ? 'من الساعة' : 'From'} {doctorProfile.working_hours_start} {isRtl ? 'إلى الساعة' : 'to'} {doctorProfile.working_hours_end}
                  </p>
                  {doctorProfile.emergency_available && (
                    <div className="mt-2 text-[10px] font-bold bg-red-50 text-red-600 px-2 py-0.5 rounded-md inline-block">
                      {isRtl ? '🚨 متوفر للطوارئ ٢٤/٧' : '🚨 24/7 Emergencies Available'}
                    </div>
                  )}
                </div>
              </div>

              {/* Languages */}
              <div className="space-y-3">
                <p className="text-[10px] uppercase text-primary font-black tracking-wider flex items-center gap-1">
                  <Languages size={12} />
                  <span>{isRtl ? 'اللغات المتحدث بها بالاستشارات:' : 'Languages Practiced:'}</span>
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(doctorProfile.languages || ['Arabic']).map(l => (
                    <span key={l} className="px-3 py-1.5 bg-purple-50 text-primary border border-purple-100 rounded-xl text-xs font-bold">
                      {l}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Right Grid Col Span 5: Appointment calendar booking */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Booking widget Card */}
          <div className="bg-white p-6 rounded-3xl border border-border-brand shadow-premium space-y-4">
            <h2 className="text-sm font-black text-text-dark uppercase tracking-wider pb-2 border-b border-border-brand/60 flex items-center gap-1.5">
              <CalendarIcon size={14} className="text-primary" />
              <span>{isRtl ? 'احجز كشف طبي سريع' : 'Book Diagnostic Session'}</span>
            </h2>

            {bookingSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-4"
              >
                <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto">
                  <Check size={24} className="stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-black text-text-dark">
                    {isRtl ? 'تم تقديم طلب الحجز بنجاح!' : 'Booking Submitted Successfully!'}
                  </h3>
                  <p className="text-xs font-bold text-text-muted leading-relaxed">
                    {isRtl 
                      ? 'تم تسجيل طلب حجزك بنجاح. سيتم مراجعته وتأكيده من قبل موظفي عيادة الطبيب وإرسال رسالة تأكيد إليك.'
                      : 'Your appointment is requested. The doctor\'s clinical assistants will contact you to finalize/confirm.'}
                  </p>
                </div>
                <button
                  onClick={() => setBookingSuccess(false)}
                  className="px-5 h-9 bg-light-gray rounded-xl text-text-dark text-[11px] font-bold hover:bg-border-brand cursor-pointer"
                >
                  {isRtl ? 'حجز موعد آخر' : 'Book Another Slot'}
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleBookingSubmit} className="space-y-4 text-xs font-bold text-text-muted">
                
                {bookingError && (
                  <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl">
                    {bookingError}
                  </div>
                )}

                {/* 1. Date Selection */}
                <div className="space-y-2">
                  <label className="text-[10px] uppercase font-black tracking-wider text-text-muted block">
                    {isRtl ? '١. اختر تاريخ الكشف:' : '1. Choose Date:'}
                  </label>
                  {dateOptions.length === 0 ? (
                    <div className="p-3 bg-yellow-50 text-yellow-700 border border-yellow-100 rounded-xl">
                      {isRtl ? 'عذراً، لا تتوفر مواعيد مجدولة حالياً.' : 'No scheduled sessions available.'}
                    </div>
                  ) : (
                    <select
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full h-11 px-3 rounded-xl border border-border-brand bg-white text-xs font-black text-text-dark outline-none focus:border-primary"
                    >
                      <option value="">{isRtl ? 'اختر اليوم المتاح' : 'Choose Available Day'}</option>
                      {dateOptions.map((date) => {
                        const dateStr = date.toISOString().slice(0, 10);
                        const label = date.toLocaleDateString(isRtl ? 'ar-EG' : 'en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        });
                        return (
                          <option key={dateStr} value={dateStr}>
                            {label}
                          </option>
                        );
                      })}
                    </select>
                  )}
                </div>

                {/* 2. (Removed) Time Slot Selection - Quick Booking uses date only */}

                {/* 3. Patient Name */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-text-muted block">
                    {isRtl ? '٣. اسم المريض بالكامل:' : '3. Patient Full Name:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder={isRtl ? 'الاسم الثلاثي للمريض' : 'e.g. John Doe'}
                    className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white text-xs font-semibold text-text-dark outline-none focus:border-primary"
                  />
                </div>

                {/* 4. Patient Phone */}
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black tracking-wider text-text-muted block">
                    {isRtl ? '٤. رقم الهاتف للتأكيد والتواصل:' : '4. Phone Number:'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="01xxxxxxxxx"
                    className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white text-xs font-semibold text-text-dark outline-none focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading || dateOptions.length === 0}
                  className="w-full h-12 rounded-xl gradient-bg text-white font-black text-xs shadow-premium flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {bookingLoading ? (
                    <span className="animate-spin inline-block border-2 border-white/40 border-t-white rounded-full w-4 h-4" />
                  ) : (
                    <span>{isRtl ? 'تأكيد وحجز موعد الكشف' : 'Confirm & Request Session'}</span>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Reviews & Ratings Widget */}
          <div className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-4">
            <h2 className="text-sm font-black text-text-dark uppercase tracking-wider pb-2 border-b border-border-brand/60 flex items-center gap-1.5">
              <Star size={14} className="text-primary fill-current" />
              <span>{isRtl ? 'تقييمات وآراء المرضى' : 'Patient Feedback'}</span>
            </h2>

            {/* List Reviews */}
            <div className="max-h-60 overflow-y-auto space-y-3 px-1">
              {loadingReviews ? (
                <div className="text-center py-4 text-xs font-bold text-text-muted">
                  {isRtl ? 'جاري تحميل التقييمات...' : 'Loading patient feedback...'}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-4 text-xs font-bold text-text-muted bg-light-gray/20 rounded-2xl border border-dashed border-border-brand/40">
                  {isRtl ? 'لا توجد تقييمات سابقة لهذا الطبيب حالياً.' : 'No reviews posted yet.'}
                </div>
              ) : (
                reviews.map(r => (
                  <div key={r.id} className="p-3.5 bg-light-gray/30 rounded-2xl border border-border-brand/40 space-y-1.5 text-xs font-bold text-text-muted">
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
                    <p className="text-[10px] font-bold text-text-muted text-left">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Write a review */}
            <div className="pt-4 border-t border-border-brand/60">
              {loggedInUser && loggedInUser.role === 'patient' ? (
                <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs font-bold text-text-muted">
                  
                  {reviewError && (
                    <div className="p-2 bg-red-50 text-red-600 border border-red-100 rounded-lg">
                      {reviewError}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span>{isRtl ? 'تقييمك الطبيب بالنجوم:' : 'Your star rating:'}</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setReviewRating(stars)}
                          className="text-yellow-500 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star size={16} fill={stars <= reviewRating ? 'currentColor' : 'none'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <textarea
                      required
                      rows={2}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder={isRtl ? 'اكتب تقييمك وتجربتك الواقعية مع هذا الطبيب...' : 'Share your clinical experience...'}
                      className="w-full p-3 rounded-xl border border-border-brand bg-white text-xs font-medium text-text-dark outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="w-full h-9 rounded-xl border border-primary text-primary hover:bg-primary/5 font-bold text-[11px] flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {reviewLoading ? (
                      <span className="animate-spin inline-block border-2 border-primary/40 border-t-primary rounded-full w-3 h-3" />
                    ) : (
                      <span>{isRtl ? 'تقديم تقييمي المهني' : 'Submit My Review'}</span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center p-4 bg-light-gray/40 rounded-2xl border border-border-brand/40 space-y-2">
                  <p className="text-[11px] font-bold text-text-muted">
                    {isRtl ? 'يرجى تسجيل الدخول كـ مريض لتتمكن من كتابة تقييم وإبداء الرأي.' : 'Please log in as a patient to leave your feedback.'}
                  </p>
                  <button
                    onClick={() => onOpenAuth('patient')}
                    className="px-4 h-8 border border-primary text-primary hover:bg-primary/5 rounded-lg text-[10px] font-black cursor-pointer transition-colors"
                  >
                    {isRtl ? 'تسجيل دخول مريض' : 'Patient Sign In'}
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
