/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ArrowRight, 
  User, 
  Briefcase, 
  MapPin, 
  Clock, 
  Upload, 
  Check, 
  AlertCircle, 
  FileText, 
  Image as ImageIcon, 
  Globe, 
  Loader2,
  DollarSign,
  Phone,
  Compass
} from 'lucide-react';
import { Language, Specialty, DoctorProfile } from '../types';
import { SPECIALTIES, PEDIATRIC_SUBSPECIALTIES } from '../data/reference';
import { dbService } from '../lib/supabase';

interface DoctorRegistrationProps {
  language: Language;
  onClose: () => void;
  onSuccess: () => void;
}

export const DoctorRegistration: React.FC<DoctorRegistrationProps> = ({
  language,
  onClose,
  onSuccess,
}) => {
  const isRtl = language === 'ar';
  
  // Wizard step state: 1 to 5
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filtered Cities list based on selected Governorate
  // Form Fields State
  // 1. Account Details
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [syndicateNumber, setSyndicateNumber] = useState('');

  // 2. Personal & Academics
  const [fullNameAr, setFullNameAr] = useState('');
  const [fullNameEn, setFullNameEn] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [dob, setDob] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [subSpecialtyAr, setSubSpecialtyAr] = useState('');
  const [subSpecialtyEn, setSubSpecialtyEn] = useState('');
  const [selectedPediatricSubs, setSelectedPediatricSubs] = useState<string[]>([]);
  const [degreeAr, setDegreeAr] = useState('');
  const [degreeEn, setDegreeEn] = useState('');
  const [experienceYears, setExperienceYears] = useState<number | ''>('');
  const [languages, setLanguages] = useState<string[]>([]);

  // 3. Clinic Details & Scheduling
  const [clinicNameAr, setClinicNameAr] = useState('');
  const [clinicNameEn, setClinicNameEn] = useState('');
  const [clinicAddressAr, setClinicAddressAr] = useState('');
  const [clinicAddressEn, setClinicAddressEn] = useState('');
  const [governorate, setGovernorate] = useState('');
  const [city, setCity] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [clinicPrice, setClinicPrice] = useState<number | ''>('');
  const [onlinePrice, setOnlinePrice] = useState<number | ''>('');
  const [workingDays, setWorkingDays] = useState<number[]>([]);
  const [workingHoursStart, setWorkingHoursStart] = useState('');
  const [workingHoursEnd, setWorkingHoursEnd] = useState('');
  const [emergencyAvailable, setEmergencyAvailable] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<'certificates' | 'clinicPhotos' | 'profile' | 'cover' | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 4. Social & Biography
  const [bioAr, setBioAr] = useState('');
  const [bioEn, setBioEn] = useState('');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // 5. Uploads & Attachments (Simulated image state)
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({});
  const [certificates, setCertificates] = useState<string[]>([]);
  const [clinicPhotos, setClinicPhotos] = useState<string[]>([]);
  const [profileImage, setProfileImage] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [certificateFiles, setCertificateFiles] = useState<File[]>([]);
  const [clinicPhotoFiles, setClinicPhotoFiles] = useState<File[]>([]);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);


  const handleLanguageToggle = (lang: string) => {
    if (languages.includes(lang)) {
      if (languages.length > 1) {
        setLanguages(languages.filter(l => l !== lang));
      }
    } else {
      setLanguages([...languages, lang]);
    }
  };

  const handleDayToggle = (day: number) => {
    if (workingDays.includes(day)) {
      setWorkingDays(workingDays.filter(d => d !== day));
    } else {
      setWorkingDays([...workingDays, day]);
    }
  };

  useEffect(() => {
    if (specialtyId !== 'pediatrics') {
      setSelectedPediatricSubs([]);
    }
  }, [specialtyId]);

  const weekDays = [
    { value: 0, label_en: 'Sunday', label_ar: 'الأحد' },
    { value: 1, label_en: 'Monday', label_ar: 'الاثنين' },
    { value: 2, label_en: 'Tuesday', label_ar: 'الثلاثاء' },
    { value: 3, label_en: 'Wednesday', label_ar: 'الأربعاء' },
    { value: 4, label_en: 'Thursday', label_ar: 'الخميس' },
    { value: 5, label_en: 'Friday', label_ar: 'الجمعة' },
    { value: 6, label_en: 'Saturday', label_ar: 'السبت' }
  ];

  // Simulated Compression, Conversion and Upload to Supabase Storage
  const handleSimulatedUpload = (category: 'certificates' | 'clinicPhotos' | 'profile' | 'cover') => {
    setUploadCategory(category);
    fileInputRef.current?.click();
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (!files.length || !uploadCategory) {
      event.target.value = '';
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    if (uploadCategory === 'certificates') {
      setCertificateFiles((prev) => [...prev, ...files]);
      setCertificates((prev) => [...prev, ...previews]);
    } else if (uploadCategory === 'clinicPhotos') {
      setClinicPhotoFiles((prev) => [...prev, ...files]);
      setClinicPhotos((prev) => [...prev, ...previews]);
    } else if (uploadCategory === 'profile') {
      setProfileFile(files[0] || null);
      setProfileImage(previews[0]);
    } else if (uploadCategory === 'cover') {
      setCoverFile(files[0] || null);
      setCoverImage(previews[0]);
    }

    event.target.value = '';
    setUploadCategory(null);
  };

  const validateCurrentStep = (): boolean => {
    setError(null);
    if (step === 1) {
      if (!username || !email || !password || !syndicateNumber) {
        setError(isRtl ? 'يرجى ملء جميع البيانات الأساسية ورقم القيد بنقابة الأطباء.' : 'Please fill all fields including syndicate number.');
        return false;
      }
    } else if (step === 2) {
      if (!fullNameAr || !fullNameEn || !gender || !dob || !specialtyId || !degreeAr || !degreeEn || !experienceYears) {
        setError(isRtl ? 'يرجى إكمال البيانات الشخصية والشهادة الأكاديمية.' : 'Please complete all personal and degree details.');
        return false;
      }
    } else if (step === 3) {
      if (!clinicNameAr || !clinicNameEn || !clinicAddressAr || !clinicAddressEn || !governorate || !city || !phoneNumber || !whatsappNumber || !workingHoursStart || !workingHoursEnd) {
        setError(isRtl ? 'يرجى إدخال تفاصيل العيادة وموقعها وأرقام التواصل وساعات العمل.' : 'Please enter clinic details, locations, contact numbers, and working hours.');
        return false;
      }
    } else if (step === 4) {
      if (!bioAr || !bioEn) {
        setError(isRtl ? 'يرجى ملء النبذة التعريفية بالعربية والإنجليزية.' : 'Please complete biographies in both languages.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleFinalSubmit = async () => {
    setError(null);
    if (certificates.length === 0) {
      setError(isRtl ? 'برجاء رفع وثيقة/شهادة علمية واحدة على الأقل لإثبات الاختصاص.' : 'Please upload at least one certificate for verification.');
      return;
    }
    if (!profileImage) {
      setError(isRtl ? 'برجاء تحميل صورتك الشخصية لتظهر للمرضى.' : 'Please upload a profile photo.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('[TamnyPlus][ui] submitting registration', {
        profileImage: !!profileFile,
        coverImage: !!coverFile,
        certificateCount: certificateFiles.length,
        clinicPhotoCount: clinicPhotoFiles.length
      });

      const accountData = {
        username,
        email,
        password_hash: password // Will be simulated hashed in the supabase service layer
      };

      const profileData: Omit<DoctorProfile, 'id' | 'rating_avg' | 'rating_count'> = {
        full_name_ar: fullNameAr,
        full_name_en: fullNameEn,
        gender: gender as 'male' | 'female',
        dob,
        specialty_id: specialtyId,
        sub_specialty_ar: subSpecialtyAr,
        sub_specialty_en: subSpecialtyEn,
        degree_ar: degreeAr,
        degree_en: degreeEn,
        experience_years: Number(experienceYears),
        clinic_name_ar: clinicNameAr,
        clinic_name_en: clinicNameEn,
        clinic_address_ar: clinicAddressAr,
        clinic_address_en: clinicAddressEn,
        governorate_id: governorate,
        city_id: city,
        google_maps_url: googleMapsUrl || undefined,
        phone_number: phoneNumber,
        whatsapp_number: whatsappNumber,
        email,
        clinic_price: clinicPrice === '' ? 0 : Number(clinicPrice),
        online_price: onlinePrice === '' ? 0 : Number(onlinePrice),
        bio_ar: bioAr,
        bio_en: bioEn,
        syndicate_number: syndicateNumber,
        languages,
        working_days: workingDays,
        working_hours_start: workingHoursStart,
        working_hours_end: workingHoursEnd,
        emergency_available: emergencyAvailable,
        website: website || undefined,
        facebook: facebook || undefined,
        instagram: instagram || undefined,
        linkedin: linkedin || undefined,
        certificates,
        clinic_photos: clinicPhotos,
        cover_image: coverImage || undefined,
        profile_image: profileImage
      };

      await dbService.doctorRegister(accountData, profileData, {
        certificates: certificateFiles,
        clinicPhotos: clinicPhotoFiles,
        profileImage: profileFile,
        coverImage: coverFile
      });
      setSuccess(true);
    } catch (error) {
      console.error('Doctor registration failed:', error);
      setError(error instanceof Error ? error.message : 'Unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/40 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-3xl border border-border-brand p-6 sm:p-8 shadow-premium relative my-8"
      >
        <div className="absolute -top-12 -right-12 w-28 h-28 bg-primary/5 rounded-full blur-2xl" />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple={uploadCategory === 'certificates' || uploadCategory === 'clinicPhotos'}
          className="hidden"
          onChange={handleFileSelection}
        />

        {success ? (
          /* SUCCESS PANEL */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 space-y-6 max-w-lg mx-auto"
          >
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto">
              <Check size={36} className="stroke-[3]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-text-dark font-display">
                {isRtl ? 'تم تقديم الملف بنجاح!' : 'Profile Completed Successfully!'}
              </h2>
              <p className="text-sm font-semibold text-text-muted leading-relaxed">
                {isRtl 
                  ? 'طلب انضمامك إلى طمّني بلس قيد المراجعة والتدقيق الآن من قبل لجنة التحقق الطبية. سيتم مراجعة شهاداتك العلمية ورقم القيد بالنقابة وسيتم تفعيل حسابك الطبي وإشعارك بالبريد فور إقراره.'
                  : 'Your practitioner enrollment request is currently pending strict reviews by our medical audit board. Once your certificate validity is verified, your public listing will go live.'}
              </p>
            </div>

            <div className="p-4 bg-light-gray rounded-2xl space-y-3 text-right">
              <div className="flex justify-between text-xs font-bold text-text-dark border-b border-border-brand pb-2">
                <span>{isRtl ? 'اسم الحساب:' : 'Username:'}</span>
                <span className="text-primary">{username}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-text-dark border-b border-border-brand pb-2">
                <span>{isRtl ? 'البريد الإلكتروني:' : 'Email Address:'}</span>
                <span>{email}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-text-dark">
                <span>{isRtl ? 'حالة المراجعة:' : 'Audit Status:'}</span>
                <span className="text-yellow-600 font-black">{isRtl ? 'قيد الانتظار ⚠️' : 'PENDING REVIEW ⚠️'}</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onSuccess();
              }}
              className="px-8 h-12 rounded-xl gradient-bg text-white font-bold text-sm shadow-premium cursor-pointer"
            >
              {isRtl ? 'حسناً، فهمت' : 'Understood, Thank you'}
            </button>
          </motion.div>
        ) : (
          /* MULTI STEP WIZARD FORM */
          <div className="space-y-6">
            
            {/* Steps indicator */}
            <div className="flex justify-between items-center pb-4 border-b border-border-brand">
              <div>
                <span className="text-[10px] uppercase font-black tracking-widest text-primary block">
                  {isRtl ? `الخطوة ${step} من ٥` : `STEP ${step} OF 5`}
                </span>
                <h2 className="text-lg font-black text-text-dark font-display">
                  {step === 1 && (isRtl ? 'بيانات الحساب الأساسية' : 'Account Core Profile')}
                  {step === 2 && (isRtl ? 'المعلومات الشخصية والدرجة الأكاديمية' : 'Personal & Academics')}
                  {step === 3 && (isRtl ? 'تفاصيل العيادة والمواعيد والأسعار' : 'Clinical Coordinates & Fees')}
                  {step === 4 && (isRtl ? 'النبذة المهنية وروابط التواصل' : 'Biography & Social Footprint')}
                  {step === 5 && (isRtl ? 'رفع المستندات الطبية والصور' : 'Certificates & Portfolio Images')}
                </h2>
              </div>
              
              {/* Desktop Steps Dots */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === step ? 'w-6 bg-primary' : i < step ? 'bg-primary/40' : 'bg-light-gray'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Error notifications */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-3 text-red-600 text-xs sm:text-sm font-bold animate-pulse">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Wizard Forms body */}
            <div className="min-h-[40vh] max-h-[60vh] overflow-y-auto px-1">
              {step === 1 && (
                /* STEP 1: Core Account Details */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      {isRtl ? 'اسم المستخدم (بالأحرف الإنجليزية فقط دون فراغات)' : 'Username (English, letters & numbers, no spaces)'}
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ''))}
                      placeholder={isRtl ? 'اسم المستخدم' : 'Username'}
                      className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      {isRtl ? 'البريد الإلكتروني المهني' : 'Professional Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={isRtl ? 'ادخل البريد الإلكتروني' : 'Enter your email address'}
                      className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      {isRtl ? 'كلمة المرور الآمنة' : 'Secure Account Password'}
                    </label>
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isRtl ? 'ادخل كلمة المرور' : 'Enter password'}
                      className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      {isRtl ? 'رقم قيد نقابة الأطباء المصرية (ساري مفعول)' : 'Egyptian Medical Syndicate Registration Number'}
                    </label>
                    <input
                      type="text"
                      required
                      autoComplete="off"
                      value={syndicateNumber}
                      onChange={(e) => setSyndicateNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder={isRtl ? 'ادخل رقم النقابة' : 'Enter your syndicate number'}
                      className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                /* STEP 2: Personal & Academics */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {specialtyId === 'pediatrics' && (
                      <div className="space-y-1 md:col-span-2">
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                          {isRtl ? 'تخصصات نمو الطفل المتقدمة' : 'Pediatric Child-Development Subspecialties'}
                        </label>
                        <select
                          multiple
                          value={selectedPediatricSubs}
                          onChange={(e) => {
                            const opts = Array.from(e.target.selectedOptions).map(o => o.value);
                            setSelectedPediatricSubs(opts);
                            const namesEn = opts.map(id => PEDIATRIC_SUBSPECIALTIES.find(s => s.id === id)?.name_en || '').filter(Boolean);
                            const namesAr = opts.map(id => PEDIATRIC_SUBSPECIALTIES.find(s => s.id === id)?.name_ar || '').filter(Boolean);
                            setSubSpecialtyEn(namesEn.join(', '));
                            setSubSpecialtyAr(namesAr.join(', '));
                          }}
                          className="w-full h-32 px-3 py-2 rounded-xl border border-border-brand bg-white text-sm font-medium text-text-dark outline-none"
                        >
                          {PEDIATRIC_SUBSPECIALTIES.map(s => (
                            <option key={s.id} value={s.id}>
                              {isRtl ? s.name_ar : s.name_en}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-text-muted">{isRtl ? 'اختَر واحداً أو أكثر؛ سيُملأ الحقل النصي تلقائياً.' : 'Select one or more; the sub-specialty text fields will be filled automatically.'}</p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'الاسم الثلاثي بالأرقام العربية (مثال: أ.د. أحمد كامل الشناوي)' : 'Full Name in Arabic'}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullNameAr}
                        onChange={(e) => setFullNameAr(e.target.value)}
                        placeholder={isRtl ? 'ادخل اسمك الكامل بالعربية' : 'Enter your full name in Arabic'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'الاسم باللغة الإنجليزية بالكامل' : 'Full Name in English'}
                      </label>
                      <input
                        type="text"
                        required
                        value={fullNameEn}
                        onChange={(e) => setFullNameEn(e.target.value)}
                        placeholder={isRtl ? 'ادخل اسمك الكامل بالإنجليزية' : 'Enter your full name in English'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'الجنس' : 'Gender'}
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setGender('male')}
                          className={`h-11 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 ${
                            gender === 'male' ? 'border-primary bg-primary/5 text-primary' : 'border-border-brand text-text-dark'
                          }`}
                        >
                          <span>{isRtl ? 'ذكر' : 'Male'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setGender('female')}
                          className={`h-11 rounded-xl font-bold text-xs border flex items-center justify-center gap-2 ${
                            gender === 'female' ? 'border-primary bg-primary/5 text-primary' : 'border-border-brand text-text-dark'
                          }`}
                        >
                          <span>{isRtl ? 'أنثى' : 'Female'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'تاريخ الميلاد' : 'Date of Birth'}
                      </label>
                      <input
                        type="date"
                        required
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'التخصص الطبي الرئيسي' : 'Primary Medical Specialty'}
                      </label>
                      <select
                        required
                        value={specialtyId}
                        onChange={(e) => setSpecialtyId(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      >
                        <option value="">{isRtl ? 'اختر التخصص' : 'Select Specialty'}</option>
                        <optgroup label={isRtl ? 'التخصصات الطبية' : 'Medical Specialists'}>
                          {SPECIALTIES.filter(s => s.group !== 'pediatric_rehab').map(s => (
                            <option key={s.id} value={s.id}>{isRtl ? s.name_ar : s.name_en}</option>
                          ))}
                        </optgroup>
                        <optgroup label={isRtl ? 'أخصائيون أطفال وتأهيل' : 'Child & Rehabilitation Specialists'}>
                          {SPECIALTIES.filter(s => s.group === 'pediatric_rehab').map(s => (
                            <option key={s.id} value={s.id}>{isRtl ? s.name_ar : s.name_en}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'عدد سنوات الخبرة' : 'Years of Clinical Experience'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="60"
                        value={experienceYears}
                        onChange={(e) => setExperienceYears(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'الدرجة العلمية والجامعة بالعربية' : 'Degree & Academic Institution (Arabic)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={degreeAr}
                        onChange={(e) => setDegreeAr(e.target.value)}
                        placeholder={isRtl ? 'ادخل الدرجة العلمية والجامعة بالعربية' : 'Enter degree and institution in Arabic'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'الدرجة العلمية والجامعة بالإنجليزية' : 'Degree & Academic Institution (English)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={degreeEn}
                        onChange={(e) => setDegreeEn(e.target.value)}
                        placeholder={isRtl ? 'ادخل الدرجة العلمية والجامعة بالإنجليزية' : 'Enter degree and institution in English'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'التخصصات الفرعية والدقيقة بالعربية (فصل بالفواصل)' : 'Sub-Specialties (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={subSpecialtyAr}
                        onChange={(e) => setSubSpecialtyAr(e.target.value)}
                        placeholder={isRtl ? 'ادخل التخصصات الفرعية بالعربية' : 'Enter sub-specialties in Arabic'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'التخصصات الدقيقة بالإنجليزية (فصل بالفواصل)' : 'Sub-Specialties (English)'}
                      </label>
                      <input
                        type="text"
                        value={subSpecialtyEn}
                        onChange={(e) => setSubSpecialtyEn(e.target.value)}
                        placeholder={isRtl ? 'ادخل التخصصات الفرعية بالإنجليزية' : 'Enter sub-specialties in English'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                  </div>

                  {/* Languages Selector */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      {isRtl ? 'لغات ممارسة الاستشارات' : 'Languages Practiced'}
                    </label>
                    <div className="flex gap-4">
                      {['Arabic', 'English', 'French', 'German'].map((lang) => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => handleLanguageToggle(lang)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors ${
                            languages.includes(lang) ? 'bg-primary/5 text-primary border-primary' : 'bg-white text-text-muted border-border-brand'
                          }`}
                        >
                          {lang === 'Arabic' && (isRtl ? 'العربية' : 'Arabic')}
                          {lang === 'English' && (isRtl ? 'الإنجليزية' : 'English')}
                          {lang === 'French' && (isRtl ? 'الفرنسية' : 'French')}
                          {lang === 'German' && (isRtl ? 'الألمانية' : 'German')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                /* STEP 3: Clinic coordinates, Schedule, Fees */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'اسم العيادة بالعربية' : 'Clinic Name (Arabic)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={clinicNameAr}
                        onChange={(e) => setClinicNameAr(e.target.value)}
                        placeholder={isRtl ? 'ادخل اسم العيادة بالعربية' : 'Enter clinic name in Arabic'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'اسم العيادة بالإنجليزية' : 'Clinic Name (English)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={clinicNameEn}
                        onChange={(e) => setClinicNameEn(e.target.value)}
                        placeholder={isRtl ? 'ادخل اسم العيادة بالإنجليزية' : 'Enter clinic name in English'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'عنوان العيادة التفصيلي بالعربية' : 'Clinic Address (Arabic)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={clinicAddressAr}
                        onChange={(e) => setClinicAddressAr(e.target.value)}
                        placeholder={isRtl ? 'ادخل عنوان العيادة بالعربية' : 'Enter clinic address in Arabic'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'عنوان العيادة بالإنجليزية' : 'Clinic Address (English)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={clinicAddressEn}
                        onChange={(e) => setClinicAddressEn(e.target.value)}
                        placeholder={isRtl ? 'ادخل عنوان العيادة بالإنجليزية' : 'Enter clinic address in English'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'المحافظة' : 'Governorate'}
                      </label>
                      <input
                        type="text"
                        required
                        value={governorate}
                        onChange={(e) => setGovernorate(e.target.value)}
                        placeholder={isRtl ? 'اكتب اسم المحافظة' : 'Enter governorate'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'المدينة / المنطقة' : 'City / Neighborhood'}
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder={isRtl ? 'اكتب اسم المدينة أو المنطقة' : 'Enter city or neighborhood'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'رابط عيادة جوجل مابس (Google Maps URL)' : 'Google Maps URL (Optional)'}
                      </label>
                      <input
                        type="url"
                        value={googleMapsUrl}
                        onChange={(e) => setGoogleMapsUrl(e.target.value)}
                        placeholder={isRtl ? 'رابط Google Maps اختياري' : 'Optional Google Maps URL'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                          {isRtl ? 'رقم الهاتف الأرضي/العيادة' : 'Clinic Phone'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder={isRtl ? 'ادخل رقم الهاتف' : 'Enter clinic phone number'}
                          className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                          {isRtl ? 'رقم واتساب العيادة المخصص' : 'Clinic WhatsApp'}
                        </label>
                        <input
                          type="tel"
                          required
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder={isRtl ? 'ادخل رقم واتساب' : 'Enter WhatsApp number'}
                          className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-light-gray/40 rounded-2xl border border-border-brand/40">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>{isRtl ? 'سعر كشف العيادة الفعلي (بالجنيه)' : 'Clinic Consultation Price (EGP)'}</span>
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="5000"
                        value={clinicPrice}
                        onChange={(e) => setClinicPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block flex items-center gap-1">
                        <DollarSign size={12} />
                        <span>{isRtl ? 'سعر الكشف الأونلاين/المرئي (بالجنيه)' : 'Online Consultation Price (EGP)'}</span>
                      </label>
                      <input
                        type="number"
                        min="50"
                        max="5000"
                        value={onlinePrice}
                        onChange={(e) => setOnlinePrice(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                  </div>

                  {/* Scheduling Selectors */}
                  <div className="space-y-3">
                    <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                      {isRtl ? 'أيام العمل الرسمية بالعيادة' : 'Clinical Operating Days'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {weekDays.map((day) => (
                        <button
                          key={day.value}
                          type="button"
                          onClick={() => handleDayToggle(day.value)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors ${
                            workingDays.includes(day.value) ? 'bg-primary/5 text-primary border-primary' : 'bg-white text-text-muted border-border-brand'
                          }`}
                        >
                          {isRtl ? day.label_ar : day.label_en}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block flex items-center gap-1">
                        <Clock size={12} />
                        <span>{isRtl ? 'بداية ساعات العمل' : 'Shift Start'}</span>
                      </label>
                      <input
                        type="time"
                        value={workingHoursStart}
                        onChange={(e) => setWorkingHoursStart(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block flex items-center gap-1">
                        <Clock size={12} />
                        <span>{isRtl ? 'نهاية ساعات العمل' : 'Shift End'}</span>
                      </label>
                      <input
                        type="time"
                        value={workingHoursEnd}
                        onChange={(e) => setWorkingHoursEnd(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="pt-5">
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
                </div>
              )}

              {step === 4 && (
                /* STEP 4: Biography & Social Media Footprint */
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'السيرة المهنية والنبذة المختصرة بالعربية' : 'Biography Summary (Arabic)'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={bioAr}
                        onChange={(e) => setBioAr(e.target.value)}
                        placeholder="اكتب تفاصيل خبرتك ومجالات كفاءتك بدقة لتظهر للمرضى بوضوح..."
                        className="w-full p-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-medium text-text-dark leading-relaxed"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'السيرة المهنية والنبذة المختصرة بالإنجليزية' : 'Biography Summary (English)'}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={bioEn}
                        onChange={(e) => setBioEn(e.target.value)}
                        placeholder="Write your clinical experience, specialities, and care delivery philosophy in English..."
                        className="w-full p-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-medium text-text-dark leading-relaxed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'موقعك الإلكتروني الشخصي/المهني' : 'Website Portfolio URL'}
                      </label>
                      <input
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder={isRtl ? 'ادخل رابط موقعك الإلكتروني' : 'Enter website URL'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'رابط حساب فيسبوك (Facebook URL)' : 'Facebook URL'}
                      </label>
                      <input
                        type="url"
                        value={facebook}
                        onChange={(e) => setFacebook(e.target.value)}
                        placeholder={isRtl ? 'ادخل رابط فيسبوك' : 'Enter Facebook URL'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'رابط حساب لينكد إن (LinkedIn URL)' : 'LinkedIn URL'}
                      </label>
                      <input
                        type="url"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        placeholder={isRtl ? 'ادخل رابط لينكد إن' : 'Enter LinkedIn URL'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-text-muted uppercase tracking-wider block">
                        {isRtl ? 'رابط حساب إنستغرام (Instagram URL)' : 'Instagram URL'}
                      </label>
                      <input
                        type="url"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder={isRtl ? 'ادخل رابط إنستغرام' : 'Enter Instagram URL'}
                        className="w-full h-11 px-4 rounded-xl border border-border-brand focus:border-primary outline-none text-sm font-semibold text-text-dark"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 5 && (
                /* STEP 5: Documents, certificates and visuals uploader with simulated WebP compression */
                <div className="space-y-6">
                  
                  {/* Certificates Upload Block */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-text-dark">
                      {isRtl ? '١. رفع الشهادات الطبية وتصاريح النقابة المعتمَدة' : '1. Academic Certifications & Active Licenses'}
                    </h3>
                    <p className="text-xs text-text-muted font-medium">
                      {isRtl 
                        ? 'يرجى تحميل ما لا يقل عن وثيقة طبية واحدة (ماجستير، دكتوراه، تصريح مزاولة، بطاقة نقابة). سيتم تحويلها لـ WebP للتخزين الفعال.' 
                        : 'Upload degree documents, doctor cards or clinical permits. These undergo secure, optimized conversion.'}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSimulatedUpload('certificates')}
                        className="p-6 rounded-2xl border border-dashed border-border-brand hover:border-primary bg-light-gray/20 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer h-32"
                      >
                        <Upload size={22} className="text-primary" />
                        <span className="text-[10px] font-bold text-primary">{isRtl ? 'اضغط لرفع وثيقة' : 'Upload Document'}</span>
                      </button>

                      {/* Display uploaded Certificates */}
                      {certificates.map((url, index) => (
                        <div key={index} className="relative rounded-2xl border border-border-brand overflow-hidden h-32 group">
                          <img src={url} alt="certificate" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[10px] font-bold text-white flex items-center gap-1 bg-primary/80 px-2 py-1 rounded-lg">
                              <Check size={10} />
                              <span>{isRtl ? 'تم التحويل لـ WebP' : 'Converted to WebP'}</span>
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <hr className="border-border-brand/60" />

                  {/* Profile and Cover Images */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Profile image uploader */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-text-dark">{isRtl ? '٢. الصورة الشخصية الرسمية (الملف)' : '2. Official Profile Photo'}</h4>
                      
                      <div className="flex items-center gap-4">
                        {profileImage ? (
                          <div className="w-16 h-16 rounded-full border border-border-brand overflow-hidden shrink-0">
                            <img src={profileImage} alt="profile" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-light-gray border border-border-brand flex items-center justify-center text-text-muted shrink-0">
                            <User size={24} />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSimulatedUpload('profile')}
                          className="px-4 h-10 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload size={14} />
                          <span>{isRtl ? 'تحميل صورة شخصية' : 'Upload Photo'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Cover image uploader */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-text-dark">{isRtl ? '٣. غلاف الملف التعريفي للعيادة' : '3. Custom Cover Banner'}</h4>
                      
                      <div className="flex items-center gap-4">
                        {coverImage ? (
                          <div className="w-24 h-12 rounded-xl border border-border-brand overflow-hidden shrink-0">
                            <img src={coverImage} alt="cover" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-24 h-12 rounded-xl bg-light-gray border border-border-brand flex items-center justify-center text-text-muted shrink-0">
                            <ImageIcon size={18} />
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={() => handleSimulatedUpload('cover')}
                          className="px-4 h-10 rounded-xl bg-primary/5 hover:bg-primary/10 border border-primary/20 text-primary text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Upload size={14} />
                          <span>{isRtl ? 'تحميل غلاف العيادة' : 'Upload Cover'}</span>
                        </button>
                      </div>
                    </div>

                  </div>

                  <hr className="border-border-brand/60" />

                  {/* Clinic interior photos */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-text-dark">{isRtl ? '٤. صور الغرف والعيادة التخصصية' : '4. Specialty Rooms & Clinic Portfolio'}</h4>
                    <p className="text-[11px] text-text-muted font-medium">
                      {isRtl ? 'أضف صور غرف الكشف، الاستقبال والتعقيم لتعزز ثقة المريض.' : 'Upload consultation rooms, clinical lobby, or sanitizing modules.'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => handleSimulatedUpload('clinicPhotos')}
                        className="p-4 rounded-xl border border-dashed border-border-brand hover:border-primary bg-light-gray/20 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer h-24"
                      >
                        <Upload size={18} className="text-primary" />
                        <span className="text-[9px] font-bold text-primary">{isRtl ? 'أضف صورة العيادة' : 'Add Photo'}</span>
                      </button>

                      {clinicPhotos.map((url, idx) => (
                        <div key={idx} className="relative rounded-xl border border-border-brand overflow-hidden h-24">
                          <img src={url} alt="clinic room" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Processing / Upload progress indicator */}
                  {Object.keys(uploadingFiles).length > 0 && (
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-3">
                      <Loader2 size={18} className="animate-spin text-primary shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold text-primary">{isRtl ? 'جارٍ تحسين الصورة ومعالجتها...' : 'Optimizing and Converting Image...'}</p>
                        <p className="text-[10px] text-primary/80 mt-0.5">{isRtl ? 'تلقائياً: ضغط الجودة، التحويل لـ WebP، إنشاء نسخة مصغرة.' : 'Automatic sequence: compressing buffers, converting to WebP, generating thumbnail.'}</p>
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

            {/* Form actions and navigation buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-border-brand/60">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 h-11 rounded-xl border border-border-brand text-text-dark hover:bg-light-gray flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} className={isRtl ? 'rotate-180' : ''} />
                  <span>{isRtl ? 'السابق' : 'Previous'}</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 h-11 rounded-xl border border-border-brand text-text-dark hover:bg-light-gray flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer"
                >
                  <span>{isRtl ? 'إلغاء' : 'Cancel'}</span>
                </button>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 h-11 rounded-xl gradient-bg text-white flex items-center gap-1.5 text-xs font-bold shadow-premium cursor-pointer transition-transform duration-300 hover:scale-102"
                >
                  <span>{isRtl ? 'التالي' : 'Next'}</span>
                  <ArrowRight size={14} className={isRtl ? 'rotate-180' : ''} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={loading}
                  className="px-8 h-11 rounded-xl bg-text-dark hover:bg-black text-white flex items-center gap-1.5 text-xs font-bold shadow-soft cursor-pointer transition-transform duration-300 hover:scale-102"
                >
                  {loading && <Loader2 size={14} className="animate-spin text-white" />}
                  <span>{isRtl ? 'تقديم طلب التسجيل والمراجعة' : 'Submit Clinical Profile'}</span>
                </button>
              )}
            </div>

          </div>
        )}

      </motion.div>
    </div>
  );
};
export default DoctorRegistration;
