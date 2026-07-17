/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Star, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Calendar, 
  Filter, 
  Heart, 
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Award
} from 'lucide-react';

import { Language, DoctorProfile, Specialty, Patient } from './types';
import { dbService } from './lib/supabase';
import { SPECIALTIES, PEDIATRIC_SUBSPECIALTIES } from './data/reference';
import { updatePageMetadata, generateJsonLD, generateDoctorSchema, getPageMetadata } from './lib/metadata';

// Components
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { LandingPage } from './components/LandingPage';
import { PatientAuth } from './components/PatientAuth';
import { DoctorAuth } from './components/DoctorAuth';
import { DoctorRegistration } from './components/DoctorRegistration';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminPanel } from './components/AdminPanel';
import { DoctorProfileView } from './components/DoctorProfileView';
import { TermsOfService } from './components/TermsOfService';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { Footer } from './components/Footer';
import { WhatsAppContact } from './components/WhatsAppContact';

export default function App() {
  // Core Platform Configuration
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('tamny_language');
      return saved === 'en' ? 'en' : 'ar';
    }
    return 'ar';
  });
  const [session, setSession] = useState<{ role: 'patient' | 'doctor' | 'admin'; data: any; profile?: DoctorProfile } | null>(null);

  // Initialize session from storage and Supabase auth state
  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      try {
        const adminSession = dbService.getLoggedInAdmin();
        if (adminSession && mounted) {
          setSession(adminSession);
          return;
        }

        const storedSession = dbService.getLoggedInUser();
        if (storedSession && mounted) {
          setSession(storedSession);
        }

        const authSession = await dbService.getCurrentAuthSession();
        if (mounted && authSession) {
          setSession(authSession);
        }
      } catch (err) {
        console.error('Failed to initialize session from storage', err);
      }
    };

    initializeSession();

    const unsubscribe = dbService.subscribeToAuthChanges((nextSession) => {
      if (!mounted) return;
      setSession(nextSession);
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  // Initialize pathname-based routing for direct URL access
  useEffect(() => {
    const resolveRoute = () => {
      if (typeof window === 'undefined') return;
      const path = window.location.pathname.replace(/\/+$/g, '').replace(/^\//, '');
      if (path === 'terms' || path === 'terms-of-service') {
        setView('terms');
        return;
      }
      if (path === 'privacy' || path === 'privacy-policy') {
        setView('privacy');
        return;
      }
      if (path === 'admin') {
        const adminSession = dbService.getLoggedInAdmin();
        if (!adminSession) {
          setShowDoctorAuth(true);
        }
        setView('landing');
        return;
      }
      setView('landing');
    };

    resolveRoute();
    window.addEventListener('popstate', resolveRoute);
    return () => window.removeEventListener('popstate', resolveRoute);
  }, []);

  // Router View state: 'landing' | 'search' | 'doctor-profile' | 'terms' | 'privacy'
  const [view, setView] = useState<'landing' | 'search' | 'doctor-profile' | 'terms' | 'privacy'>('landing');
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);

  // Global Lists
  const [doctorsList, setDoctorsList] = useState<DoctorProfile[]>([]);
  
  // Searching & Filtering Parameters
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [searchGov, setSearchGov] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [searchPediatricSubSpecialty, setSearchPediatricSubSpecialty] = useState('');

  // Search Results Filters
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [filterPriceRange, setFilterPriceRange] = useState<number>(1000);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');

  // Popup Modals controllers
  const [showPatientAuth, setShowPatientAuth] = useState(false);
  const [showDoctorAuth, setShowDoctorAuth] = useState(false);
  const [showDoctorRegister, setShowDoctorRegister] = useState(false);

  // Apply Language RTL/LTR Directions
  useEffect(() => {
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    window.localStorage.setItem('tamny_language', language);
  }, [language]);

  // Update metadata based on current view
  useEffect(() => {
    let metadata: any;
    let url = 'https://tamnyplus.com';
    
    switch (view) {
      case 'search':
        metadata = getPageMetadata('search', language);
        url = `https://tamnyplus.com/search`;
        break;
      case 'doctor-profile':
        metadata = getPageMetadata('doctorProfile', language);
        if (selectedDoctor) {
          url = `https://tamnyplus.com/doctor/${selectedDoctor.id}`;
          const selectedDoctorName = language === 'ar' ? selectedDoctor.full_name_ar : selectedDoctor.full_name_en;
          metadata = {
            ...metadata,
            title: `${selectedDoctorName} | ${language === 'ar' ? 'طمّني بلس' : 'Tamny Plus'}`,
            description: (language === 'ar' ? selectedDoctor.bio_ar : selectedDoctor.bio_en) || metadata.description,
            image: selectedDoctor.profile_image || 'https://tamnyplus.com/og-image.png',
            url
          };
          // Generate doctor schema
          generateJsonLD(generateDoctorSchema(selectedDoctor));
        }
        break;
      case 'terms':
        metadata = getPageMetadata('terms', language);
        url = 'https://tamnyplus.com/terms';
        break;
      case 'privacy':
        metadata = getPageMetadata('privacy', language);
        url = 'https://tamnyplus.com/privacy';
        break;
      default:
        metadata = getPageMetadata('home', language);
    }
    
    metadata.url = url;
    updatePageMetadata(metadata);
  }, [view, selectedDoctor, language]);

  // Load Verified Live Doctors
  const refreshDoctorsList = async () => {
    const list = await dbService.getApprovedDoctors();
    console.log('[TamnyPlus][ui] refreshDoctorsList', {
      totalApproved: list.length,
      doctorIds: list.map((doc) => doc.id)
    });
    setDoctorsList(list);
  };

  useEffect(() => {
    refreshDoctorsList();
  }, []);

  const homeSpecialties = useMemo(() => {
    const counts = doctorsList.reduce<Record<string, number>>((acc, doc) => {
      if (doc.specialty_id) {
        acc[doc.specialty_id] = (acc[doc.specialty_id] || 0) + 1;
      }
      return acc;
    }, {});

    return SPECIALTIES.map((spec) => ({
      ...spec,
      doctor_count: counts[spec.id] || 0
    }));
  }, [doctorsList]);

  const availableSpecialties = useMemo(() => {
    return homeSpecialties
      .filter((spec) => (spec.doctor_count || 0) > 0)
      .map(({ doctor_count, ...spec }) => spec);
  }, [homeSpecialties]);

  const availableGovernorates = useMemo(() => {
    return Array.from(new Set(doctorsList.map(doc => doc.governorate_id).filter(Boolean))).sort();
  }, [doctorsList]);

  const citiesByGovernorate = useMemo(() => {
    const map: Record<string, string[]> = {};
    doctorsList.forEach((doc) => {
      if (!doc.governorate_id || !doc.city_id) return;
      if (!map[doc.governorate_id]) {
        map[doc.governorate_id] = [];
      }
      if (!map[doc.governorate_id].includes(doc.city_id)) {
        map[doc.governorate_id].push(doc.city_id);
      }
    });
    Object.keys(map).forEach((gov) => map[gov].sort());
    return map;
  }, [doctorsList]);

  const availableCities = useMemo(() => {
    if (searchGov) {
      return citiesByGovernorate[searchGov] || [];
    }
    return Array.from(new Set(doctorsList.map(doc => doc.city_id).filter(Boolean))).sort();
  }, [doctorsList, searchGov, citiesByGovernorate]);

  const handleSearchTrigger = (filters: {
    query: string;
    specialtyId: string;
    governorateId: string;
    cityId: string;
    pediatricSubSpecialtyId?: string;
  }) => {
    setSearchSpecialty(filters.specialtyId);
    setSearchGov(filters.governorateId);
    setSearchCity(filters.cityId);
    setSearchPediatricSubSpecialty(filters.pediatricSubSpecialtyId || '');
    setView('search');
  };

  const handleNavigation = (viewOrTarget: string, targetId?: string) => {
    const pushUrl = (path: string) => {
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', path);
      }
    };

    if (targetId) {
      setView('landing');
      pushUrl('/');
      setTimeout(() => {
        document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return;
    }

    if (viewOrTarget === 'landing') {
      setView('landing');
      pushUrl('/');
      return;
    }

    if (viewOrTarget === 'search') {
      setView('search');
      pushUrl('/search');
      return;
    }

    if (viewOrTarget === 'doctor-profile') {
      setView('doctor-profile');
      pushUrl('/search');
      return;
    }

    if (viewOrTarget === 'terms') {
      setView('terms');
      pushUrl('/terms');
      return;
    }

    if (viewOrTarget === 'privacy') {
      setView('privacy');
      pushUrl('/privacy');
      return;
    }

    if (viewOrTarget === 'admin') {
      if (session?.role === 'admin') {
        setView('landing');
        pushUrl('/admin');
        return;
      }
      setShowDoctorAuth(true);
      pushUrl('/admin');
      return;
    }

    // If the first argument is actually a section target id
    setView('landing');
    pushUrl('/');
    setTimeout(() => {
      document.getElementById(viewOrTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleAuthSuccess = (sessionData: any) => {
    const normalizedSession = sessionData?.role
      ? sessionData
      : { role: 'patient', data: sessionData };

    setSession(normalizedSession);
    setShowPatientAuth(false);
    setShowDoctorAuth(false);
    setShowDoctorRegister(false);

    if (normalizedSession.role === 'admin') {
      setView('landing');
      window.history.replaceState({}, '', '/admin');
      return;
    }

    if (normalizedSession.role === 'doctor') {
      setView('landing');
      return;
    }
  };

  const handleLogout = () => {
    if (session?.role === 'admin') {
      dbService.logoutAdmin();
    } else {
      dbService.logout();
    }
    setSession(null);
    setView('landing');
    window.history.replaceState({}, '', '/');
  };

  const handleRefreshUser = async () => {
    if (session && session.role === 'patient') {
      const updated = await dbService.getPatient(session.data.id);
      if (updated) {
        setSession({ ...session, data: updated });
      }
    }
  };

  const handleViewDoctorProfile = (doctor: DoctorProfile) => {
    setSelectedDoctor(doctor);
    setView('doctor-profile');
  };

  const isRtl = language === 'ar';

  // Translate utility strings
  const t = {
    resultsTitle: isRtl ? 'الأطباء والعيادات الطبية المعتمدة' : 'Verified Registered Doctors',
    filterTitle: isRtl ? 'تصنيف وتصفية النتائج' : 'Filter Search Results',
    genderLabel: isRtl ? 'الجنس:' : 'Gender:',
    genderAll: isRtl ? 'الكل' : 'All',
    genderMale: isRtl ? 'أطباء ذكور' : 'Male',
    genderFemale: isRtl ? 'طبيبات إناث' : 'Female',
    priceLabel: isRtl ? 'الحد الأقصى لسعر الكشف:' : 'Max Clinical Fee:',
    sortLabel: isRtl ? 'ترتيب النتائج:' : 'Sort Results:',
    sortRating: isRtl ? 'الأعلى تقييماً ⭐' : 'Highest Rated ⭐',
    sortPriceAsc: isRtl ? 'السعر: من الأقل للأعلى' : 'Price: Low to High',
    sortPriceDesc: isRtl ? 'السعر: من الأعلى للأقل' : 'Price: High to Low',
    specialtyAll: isRtl ? 'كل التخصصات الطبية' : 'All Medical Specialties',
    govAll: isRtl ? 'كل المحافظات' : 'All Governorates',
    cityAll: isRtl ? 'كل المدن والمناطق' : 'All Cities',

    docExp: isRtl ? 'سنوات الخبرة:' : 'Practice Experience:',
    docPrice: isRtl ? 'سعر كشف العيادة:' : 'Clinical Consultation:',
    egp: isRtl ? 'جنيه' : 'EGP',
    docViewBtn: isRtl ? 'عرض ملف الكشف الطبي' : 'View Profile Details',
    noResults: isRtl ? 'عذراً، لم نجد أطباء يطابقون خيارات البحث الحالية.' : 'No practitioners found matching search parameters.',
    resultsCount: isRtl ? 'طبيب متاح الآن' : 'practitioners available'
  };

  // Perform client-side searching and filtering of live listed doctors
  const getFilteredDoctors = () => {
    return doctorsList
      .filter((doc) => {
        // Specialty Filter
        if (searchSpecialty && doc.specialty_id !== searchSpecialty) return false;
        // Pediatric sub-specialty filter: when searching within Pediatrics
        if (searchSpecialty === 'pediatrics' && searchPediatricSubSpecialty) {
          const sub = PEDIATRIC_SUBSPECIALTIES.find(s => s.id === searchPediatricSubSpecialty);
          const matchEn = sub?.name_en || '';
          // Match against doctor's stored sub_specialty_en text
          if (!doc.sub_specialty_en || !doc.sub_specialty_en.toLowerCase().includes(matchEn.toLowerCase())) return false;
        }
        // Governorate Filter
        if (searchGov && doc.governorate_id !== searchGov) return false;
        // City Filter
        if (searchCity && doc.city_id !== searchCity) return false;
        // Gender Filter
        if (filterGender !== 'all' && doc.gender !== filterGender) return false;
        // Price Filter
        if (doc.clinic_price > filterPriceRange) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating_avg - a.rating_avg;
        } else if (sortBy === 'price-asc') {
          return a.clinic_price - b.clinic_price;
        } else if (sortBy === 'price-desc') {
          return b.clinic_price - a.clinic_price;
        }
        return 0;
      });
  };

  const finalFilteredDocs = getFilteredDoctors();

  return (
    <div className="min-h-screen bg-off-white font-sans text-text-dark flex flex-col">
      
      {/* 1. Navbar */}
      <Navbar
        language={language}
        onLanguageToggle={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        loggedInUser={session}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onOpenAuth={(role) => {
          if (role === 'patient') {
            setShowPatientAuth(true);
          } else {
            setShowDoctorAuth(true);
          }
        }}
      />

      {/* 2. Main Router Layout */}
      <main className="grow">
        
        {/* Full-Page Layout for Doctors / Admins */}
        {session && session.role === 'doctor' ? (
          <DoctorDashboard
            language={language}
            doctorProfile={session.profile!}
            onLogout={handleLogout}
          />
        ) : session && session.role === 'admin' ? (
          <AdminPanel
            language={language}
            onLogout={handleLogout}
            onDoctorStatusChanged={refreshDoctorsList}
          />
        ) : (
          /* Normal Patient / Public Flow */
          <AnimatePresence mode="wait">
            
            {view === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Hero
                  language={language}
                  specialties={homeSpecialties}
                  governorates={availableGovernorates}
                  citiesByGovernorate={citiesByGovernorate}
                  approvedDoctorsCount={doctorsList.length}
                  activeSpecialtyCount={availableSpecialties.length}
                  onSearch={handleSearchTrigger}
                />
                <LandingPage
                  language={language}
                  specialties={homeSpecialties}
                  onSpecialtySelect={(specialtyId) => {
                    setSearchSpecialty(specialtyId);
                    setView('search');
                  }}
                  onOpenAuth={() => setShowDoctorRegister(true)}
                />
              </motion.div>
            )}

            {view === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10"
              >
                {/* Search Header Bar */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-border-brand">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-text-dark font-display">
                      {t.resultsTitle}
                    </h2>
                    <p className="text-xs font-semibold text-text-muted mt-1">
                      {finalFilteredDocs.length} {t.resultsCount}
                    </p>
                  </div>

                  {/* Top quick selectors */}
                  <div className="flex flex-wrap gap-2 w-full md:w-auto">
                    <select
                      value={searchSpecialty}
                      onChange={(e) => setSearchSpecialty(e.target.value)}
                      className="px-3 h-10 rounded-xl border border-border-brand bg-white text-xs font-bold text-text-dark outline-none"
                    >
                      <option value="">{t.specialtyAll}</option>
                      <optgroup label={isRtl ? 'التخصصات الطبية' : 'Medical Specialists'}>
                        {availableSpecialties.filter((s) => s.group !== 'pediatric_rehab').map((s) => (
                          <option key={s.id} value={s.id}>{isRtl ? s.name_ar : s.name_en}</option>
                        ))}
                      </optgroup>
                      <optgroup label={isRtl ? 'أخصائيون أطفال وتأهيل' : 'Child & Rehabilitation Specialists'}>
                        {availableSpecialties.filter((s) => s.group === 'pediatric_rehab').map((s) => (
                          <option key={s.id} value={s.id}>{isRtl ? s.name_ar : s.name_en}</option>
                        ))}
                      </optgroup>
                    </select>

                    <select
                      value={searchGov}
                      onChange={(e) => setSearchGov(e.target.value)}
                      className="px-3 h-10 rounded-xl border border-border-brand bg-white text-xs font-bold text-text-dark outline-none"
                    >
                      <option value="">{t.govAll}</option>
                      {availableGovernorates.map((gov) => (
                        <option key={gov} value={gov}>{gov}</option>
                      ))}
                    </select>

                    <select
                      value={searchCity}
                      disabled={!searchGov}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="px-3 h-10 rounded-xl border border-border-brand bg-white text-xs font-bold text-text-dark outline-none disabled:opacity-50"
                    >
                      <option value="">{t.cityAll}</option>
                      {availableCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Left Side Filters / Right Side Results */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Sidebar Filters */}
                  <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-border-brand shadow-soft h-fit space-y-6">
                    <div className="flex items-center gap-2 pb-3 border-b border-border-brand">
                      <SlidersHorizontal size={14} className="text-primary" />
                      <h3 className="text-xs font-black uppercase tracking-wider text-text-dark">{t.filterTitle}</h3>
                    </div>

                    {/* Gender filter */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-text-muted block">{t.genderLabel}</label>
                      <div className="grid grid-cols-3 gap-1 bg-light-gray p-1 rounded-xl">
                        <button
                          onClick={() => setFilterGender('all')}
                          className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            filterGender === 'all' ? 'bg-white text-primary shadow-soft' : 'text-text-muted hover:text-text-dark'
                          }`}
                        >
                          {t.genderAll}
                        </button>
                        <button
                          onClick={() => setFilterGender('male')}
                          className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            filterGender === 'male' ? 'bg-white text-primary shadow-soft' : 'text-text-muted hover:text-text-dark'
                          }`}
                        >
                          {t.genderMale}
                        </button>
                        <button
                          onClick={() => setFilterGender('female')}
                          className={`py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                            filterGender === 'female' ? 'bg-white text-primary shadow-soft' : 'text-text-muted hover:text-text-dark'
                          }`}
                        >
                          {t.genderFemale}
                        </button>
                      </div>
                    </div>

                    {/* Max price filter */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-bold">
                        <span className="text-text-muted">{t.priceLabel}</span>
                        <span className="text-primary">{filterPriceRange} {t.egp}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="1200"
                        step="50"
                        value={filterPriceRange}
                        onChange={(e) => setFilterPriceRange(Number(e.target.value))}
                        className="w-full accent-primary"
                      />
                    </div>

                    {/* Sorting results */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-text-muted block">{t.sortLabel}</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="w-full h-10 px-3 rounded-xl border border-border-brand bg-white text-xs font-bold text-text-dark outline-none focus:border-primary"
                      >
                        <option value="rating">{t.sortRating}</option>
                        <option value="price-asc">{t.sortPriceAsc}</option>
                        <option value="price-desc">{t.sortPriceDesc}</option>
                      </select>
                    </div>

                  </div>

                  {/* Results Doctor Cards list */}
                  <div className="lg:col-span-9 space-y-4">
                    
                    {finalFilteredDocs.map((doc) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft hover:shadow-premium transition-all hover:scale-[1.005] flex flex-col sm:flex-row gap-5 relative overflow-hidden"
                      >
                        {/* Avatar photo */}
                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-light-gray mx-auto sm:mx-0 border border-border-brand/40 flex items-center justify-center text-text-dark font-black text-sm uppercase">
                          {doc.profile_image ? (
                            <img src={doc.profile_image} alt="doctor face" className="w-full h-full object-cover" />
                          ) : (
                            <span>{(isRtl ? doc.full_name_ar : doc.full_name_en).split(' ').slice(0,2).map(w => w[0]).join('')}</span>
                          )}
                        </div>

                        {/* Card body coordinates */}
                        <div className="space-y-2 grow text-center sm:text-right">
                          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                                <h3 className="text-base font-black text-text-dark font-display">
                                  {isRtl ? doc.full_name_ar : doc.full_name_en}
                                </h3>
                                <span className="w-4 h-4 rounded-full bg-purple-50 text-primary flex items-center justify-center shadow-soft" title="Verified">
                                  <CheckCircle2 size={11} className="stroke-[3]" />
                                </span>
                              </div>
                              <p className="text-[11px] font-bold text-primary mt-0.5">
                                {doc.sub_specialty_ar ? (isRtl ? doc.sub_specialty_ar : doc.sub_specialty_en) : doc.specialty_id}
                              </p>
                            </div>

                            {/* Stars rating */}
                            <div className="flex items-center gap-1 text-[10px] font-black bg-purple-50 text-primary px-2.5 py-0.5 rounded-full">
                              <Star size={10} fill="currentColor" />
                              <span>{doc.rating_avg} ({doc.rating_count})</span>
                            </div>
                          </div>

                          {/* Bio Excerpt */}
                          <p className="text-xs font-semibold text-text-muted line-clamp-2 leading-relaxed">
                            {isRtl ? doc.bio_ar : doc.bio_en}
                          </p>

                          {/* Technical credentials footer row */}
                          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 pt-2 text-[10px] font-bold text-text-muted border-t border-border-brand/40">
                            <span className="flex items-center gap-1">
                              <Award size={12} className="text-primary" />
                              <span>{t.docExp} {doc.experience_years} {isRtl ? 'سنة' : 'yrs'}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin size={12} className="text-primary" />
                              <span>{doc.governorate_id} - {doc.city_id}</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <span>💰</span>
                              <span>{t.docPrice} <strong className="text-text-dark">{doc.clinic_price} {t.egp}</strong></span>
                            </span>
                          </div>
                        </div>

                        {/* View clinical profile CTA */}
                        <div className="sm:self-center shrink-0">
                          <button
                            onClick={() => handleViewDoctorProfile(doc)}
                            className="w-full sm:w-auto px-5 h-11 rounded-xl gradient-bg text-white text-xs font-black shadow-premium cursor-pointer transition-transform duration-300 hover:scale-102"
                          >
                            {t.docViewBtn}
                          </button>
                        </div>

                      </motion.div>
                    ))}

                    {finalFilteredDocs.length === 0 && (
                      <div className="text-center py-16 bg-white rounded-3xl border border-border-brand shadow-soft space-y-4">
                        <AlertCircle size={32} className="text-text-muted mx-auto animate-bounce" />
                        <p className="text-sm font-bold text-text-muted leading-relaxed">
                          {t.noResults}
                        </p>
                      </div>
                    )}

                  </div>

                </div>
              </motion.div>
            )}

            {view === 'doctor-profile' && selectedDoctor && (
              <motion.div
                key="doctor-profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <DoctorProfileView
                  language={language}
                  doctorProfile={selectedDoctor}
                  loggedInUser={session}
                  onBack={() => setView('search')}
                  onRefreshUser={handleRefreshUser}
                  onOpenAuth={(role) => {
                    if (role === 'patient') {
                      setShowPatientAuth(true);
                    } else {
                      setShowDoctorAuth(true);
                    }
                  }}
                />
              </motion.div>
            )}

            {view === 'terms' && (
              <motion.div
                key="terms"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <TermsOfService language={language} onNavigate={handleNavigation} />
              </motion.div>
            )}

            {view === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <PrivacyPolicyPage language={language} onNavigate={handleNavigation} />
              </motion.div>
            )}

          </AnimatePresence>
        )}

      </main>

      <WhatsAppContact language={language} />

      {/* 3. Global Footer (Visible in Patient Flow only) */}
      {(!session || session.role === 'patient') && (
        <Footer
          language={language}
          onNavigate={handleNavigation}
          onDoctorRegister={() => setShowDoctorRegister(true)}
        />
      )}

      {/* 4. Auth Popup Portals Modals */}
      <AnimatePresence>
        {showPatientAuth && (
          <PatientAuth
            language={language}
            onClose={() => setShowPatientAuth(false)}
            onSuccess={handleAuthSuccess}
          />
        )}

        {showDoctorAuth && (
          <DoctorAuth
            language={language}
            onClose={() => setShowDoctorAuth(false)}
            onSuccess={handleAuthSuccess}
            onNavigateToRegister={() => {
              setShowDoctorAuth(false);
              setShowDoctorRegister(true);
            }}
          />
        )}

        {showDoctorRegister && (
          <DoctorRegistration
            language={language}
            onClose={() => setShowDoctorRegister(false)}
            onSuccess={refreshDoctorsList}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
