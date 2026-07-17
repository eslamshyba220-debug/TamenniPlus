/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, MapPin, Stethoscope, Star, Award, ShieldCheck, HeartPulse } from 'lucide-react';
import { Language, Specialty } from '../types';
import { PEDIATRIC_SUBSPECIALTIES } from '../data/reference';
import { updatePageMetadata } from '../lib/metadata';

interface HeroProps {
  language: Language;
  specialties: Array<Specialty & { doctor_count?: number }>;
  governorates: string[];
  citiesByGovernorate: Record<string, string[]>;
  approvedDoctorsCount: number;
  activeSpecialtyCount: number;
  onSearch: (filters: {
    query: string;
    specialtyId: string;
    governorateId: string;
    cityId: string;
    pediatricSubSpecialtyId?: string;
  }) => void;
}

export const Hero: React.FC<HeroProps> = ({ language, specialties, governorates, citiesByGovernorate, approvedDoctorsCount, activeSpecialtyCount, onSearch }) => {
  const isRtl = language === 'ar';

  const [query, setQuery] = useState('');
  const [specialtyId, setSpecialtyId] = useState('');
  const [governorateId, setGovernorateId] = useState('');
  const [cityId, setCityId] = useState('');
  const [pediatricSubSpecialtyId, setPediatricSubSpecialtyId] = useState('');
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  // Update metadata on hero load
  useEffect(() => {
    const metadata = language === 'ar' 
      ? {
          title: 'طمني بلس - Tamenni Plus | ابحث عن أفضل الأطباء واحجز بسهولة',
          description: 'طمني بلس هي منصة طبية عربية تساعد المرضى في البحث عن أفضل الأطباء حسب التخصص والمحافظة والمدينة',
          keywords: 'طبيب، دكتور، أفضل دكتور، حجز دكتور، احجز كشف'
        }
      : {
          title: 'Tamenni Plus | Find & Book Best Doctors Online',
          description: 'Find and book verified doctors and clinics. Premium Arabic medical platform for healthcare.',
          keywords: 'Doctor, Find Doctor, Book Appointment, Medical Platform'
        };
    
    updatePageMetadata(metadata);
  }, [language]);

  // Sync cities when governorate changes
  useEffect(() => {
    if (governorateId) {
      setFilteredCities(citiesByGovernorate[governorateId] || []);
    } else {
      setFilteredCities([]);
    }
    setCityId('');
  }, [governorateId, citiesByGovernorate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      query,
      specialtyId,
      governorateId,
      cityId,
      pediatricSubSpecialtyId
    });
  };

  const t = {
    badge: isRtl ? 'ثقة وأمان وموثوقية بنسبة %100' : '100% Secure, Verified & Trusted',
    titleMain: isRtl ? 'صحتك بين أيدٍ' : 'Your Health in',
    titleGradient: isRtl ? 'أمينة وموثوقة' : 'Safe & Trusted Hands',
    subtitle: isRtl 
      ? 'ابحث واحجز موعدك بسهولة مع نخبة من أفضل الأطباء المعتمدين والموثقين في نقابة الأطباء في كافة المحافظات.'
      : 'Find and book your clinical sessions seamlessly with certified, syndicate-approved premium doctors across all cities.',
    placeholderName: isRtl ? 'اسم الدكتور، اسم العيادة...' : 'Search doctor name, clinic...',
    selectSpecialty: isRtl ? 'اختر التخصص' : 'Specialty',
    selectGovernorate: isRtl ? 'المحافظة' : 'Governorate',
    selectCity: isRtl ? 'المدينة' : 'City',
    btnSearch: isRtl ? 'ابحث الآن' : 'Search Now',
    statPatients: isRtl ? '١٥ ألف+ مريض سعيد' : '15k+ Happy Patients',
    statDoctors: isRtl ? '٥٠٠+ طبيب موثق' : '500+ Verified Doctors',
    statExperience: isRtl ? '١٠٠% رعاية متميزة' : '100% Premium Care'
  };

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-12 md:py-20 bg-white">
      
      {/* Premium Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft elegant purple glow orbs */}
        <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/10 w-[450px] h-[450px] bg-secondary/5 rounded-full blur-[150px] animate-pulse" />
        
        {/* Abstract Floating UI Shapes */}
        <motion.div 
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/12 hidden xl:block p-3.5 bg-white rounded-2xl shadow-premium border border-border-brand/40 glass-panel"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
              <Star size={16} fill="currentColor" />
            </div>
            <div>
              <p className="text-[10px] text-text-muted font-semibold">{isRtl ? 'الأعلى تقييماً' : 'Top Rated'}</p>
              <p className="text-xs font-bold text-text-dark">★★★★★ 5.0</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/12 hidden xl:block p-3.5 bg-white rounded-2xl shadow-premium border border-border-brand/40 glass-panel"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-[10px] text-text-muted font-semibold">{isRtl ? 'الأطباء المسجلين' : 'Verification'}</p>
              <p className="text-xs font-bold text-text-dark">{isRtl ? 'موثق ومعتمد بنسبة %100' : '100% Syndicate Verified'}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-semibold border border-primary/10"
          >
            <HeartPulse size={14} className="animate-pulse" />
            <span>{t.badge}</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-text-dark tracking-tight leading-tight font-display"
          >
            {t.titleMain}{' '}
            <span className="gradient-text">{t.titleGradient}</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-text-muted text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-2xl mx-auto"
          >
            {t.subtitle}
          </motion.p>

          {/* Core Search Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="pt-6 w-full max-w-5xl mx-auto"
          >
            <form 
              onSubmit={handleSearchSubmit}
              className="bg-white/80 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-border-brand shadow-premium grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center"
            >
              
              {/* Keywords Select/Input */}
              <div className="lg:col-span-4 relative flex items-center">
                <Search className="absolute left-3.5 text-text-muted" size={18} />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t.placeholderName}
                  className="w-full h-12 pl-10 pr-4 rounded-xl border border-border-brand bg-white/50 hover:bg-white focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-medium text-text-dark"
                />
              </div>

              {/* Specialties dropdown select */}
              <div className="lg:col-span-3 relative flex items-center">
                <Stethoscope className="absolute left-3.5 text-text-muted" size={18} />
                <select
                  value={specialtyId}
                  onChange={(e) => setSpecialtyId(e.target.value)}
                  className="w-full h-12 pl-10 pr-8 rounded-xl border border-border-brand bg-white/50 hover:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold text-text-dark appearance-none"
                >
                  <option value="">{t.selectSpecialty}</option>
                  <optgroup label={isRtl ? 'التخصصات الطبية' : 'Medical Specialists'}>
                    {specialties.filter(spec => spec.group !== 'pediatric_rehab').map(spec => (
                      <option key={spec.id} value={spec.id}>
                        {isRtl ? spec.name_ar : spec.name_en}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label={isRtl ? 'أخصائيون أطفال وتأهيل' : 'Child & Rehabilitation Specialists'}>
                    {specialties.filter(spec => spec.group === 'pediatric_rehab').map(spec => (
                      <option key={spec.id} value={spec.id}>
                        {isRtl ? spec.name_ar : spec.name_en}
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>

              {/* Governorates select */}
              <div className="lg:col-span-2 relative flex items-center">
                <MapPin className="absolute left-3.5 text-text-muted" size={18} />
                <select
                  value={governorateId}
                  onChange={(e) => setGovernorateId(e.target.value)}
                  className="w-full h-12 pl-10 pr-8 rounded-xl border border-border-brand bg-white/50 hover:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold text-text-dark appearance-none"
                >
                  <option value="">{t.selectGovernorate}</option>
                  {governorates.map((gov) => (
                    <option key={gov} value={gov}>
                      {gov}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pediatric Sub-specialties (shown when Pediatrics is chosen) */}
              {specialtyId === 'pediatrics' && (
                <div className="lg:col-span-2 relative flex items-center">
                  <Stethoscope className="absolute left-3.5 text-text-muted" size={18} />
                  <select
                    value={pediatricSubSpecialtyId}
                    onChange={(e) => setPediatricSubSpecialtyId(e.target.value)}
                    className="w-full h-12 pl-10 pr-8 rounded-xl border border-border-brand bg-white/50 hover:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold text-text-dark appearance-none"
                  >
                    <option value="">{isRtl ? 'تخصصات نمو الطفل' : 'Child-Development Subspecialty'}</option>
                    {PEDIATRIC_SUBSPECIALTIES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {isRtl ? s.name_ar : s.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Cities select */}
              <div className="lg:col-span-2 relative flex items-center">
                <MapPin className="absolute left-3.5 text-text-muted" size={18} />
                <select
                  value={cityId}
                  onChange={(e) => setCityId(e.target.value)}
                  disabled={!governorateId}
                  className="w-full h-12 pl-10 pr-8 rounded-xl border border-border-brand bg-white/50 hover:bg-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm font-semibold text-text-dark appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{t.selectCity}</option>
                  {filteredCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search button trigger */}
              <div className="lg:col-span-1 w-full">
                <button
                  type="submit"
                  className="w-full h-12 rounded-xl gradient-bg gradient-bg-hover text-white flex items-center justify-center gap-2 text-sm font-bold shadow-premium cursor-pointer transition-transform duration-300 hover:scale-102"
                >
                  <span className="lg:hidden">{t.btnSearch}</span>
                  <Search size={18} className="hidden lg:block" />
                </button>
              </div>

            </form>
          </motion.div>

          {/* Live directory stats from approved data */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="pt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            {approvedDoctorsCount > 0 && (
              <div className="p-4 bg-light-gray/50 rounded-2xl border border-border-brand/40 hover:bg-light-gray/80 transition-colors">
                <p className="text-xl font-bold text-primary font-display">{approvedDoctorsCount}</p>
                <p className="text-xs text-text-muted mt-1">{isRtl ? 'أطباء معتمدين الآن' : 'Approved practitioners live now'}</p>
              </div>
            )}
            {activeSpecialtyCount > 0 && (
              <div className="p-4 bg-light-gray/50 rounded-2xl border border-border-brand/40 hover:bg-light-gray/80 transition-colors">
                <p className="text-xl font-bold text-primary font-display">{activeSpecialtyCount}</p>
                <p className="text-xs text-text-muted mt-1">{isRtl ? 'تخصصات متاحة حالياً' : 'Specialties currently available'}</p>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
};
export default Hero;
