/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  Settings, 
  AlertCircle, 
  Calendar, 
  TrendingUp, 
  LogOut, 
  Award, 
  FileText, 
  Eye, 
  MapPin, 
  Phone, 
  Shield, 
  Activity, 
  ShieldAlert,
  Search,
  CheckCircle
} from 'lucide-react';
import { Language, DoctorProfile, DoctorAccount, AppSettings } from '../types';
import { dbService } from '../lib/supabase';
import { SPECIALTIES } from '../data/reference';

interface AdminPanelProps {
  language: Language;
  onLogout: () => void;
  onDoctorStatusChanged?: () => Promise<void> | void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  language,
  onLogout,
  onDoctorStatusChanged,
}) => {
  const isRtl = language === 'ar';

  // State
  const [doctors, setDoctors] = useState<{ account: DoctorAccount; profile: DoctorProfile }[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [activeTab, setActiveTab] = useState<'pending' | 'roster' | 'settings'>('pending');
  
  // Search / filter states for roster
  const [rosterSearch, setRosterSearch] = useState('');
  const [rosterStatusFilter, setRosterStatusFilter] = useState<string>('all');
  
  // Certificate viewer lightbox modal
  const [viewingCert, setViewingCert] = useState<string | null>(null);

  // Settings form states
  const [allowReg, setAllowReg] = useState(true);
  const [requireCert, setRequireCert] = useState(true);
  const [hotline, setHotline] = useState('123');
  const [settingsSaveSuccess, setSettingsSaveSuccess] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);

  // Load all admin data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load doctors list
      const docs = await dbService.getAllDoctorsAdmin();
      setDoctors(docs);

      // Load settings
      const systemSettings = await dbService.getSettings();
      setSettings(systemSettings);
      setAllowReg(systemSettings.allow_new_registrations);
      setRequireCert(systemSettings.require_certificates_verification);
      setHotline(systemSettings.emergency_hotline);
    } catch (err: any) {
      console.error('Error loading admin data:', err);
      setError(isRtl ? 'حدث خطأ أثناء تحميل بيانات الإدارة.' : 'Failed to load administrative datasets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Update Doctor Status (Approved / Rejected / Blocked)
  const handleUpdateStatus = async (doctorId: string, status: 'approved' | 'rejected' | 'blocked') => {
    try {
      await dbService.updateDoctorStatus(doctorId, status);
      const updatedDocs = await dbService.getAllDoctorsAdmin();
      setDoctors(updatedDocs);
      await onDoctorStatusChanged?.();
    } catch (err) {
      console.error('Failed to update doctor status:', err);
    }
  };

  // Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsLoading(true);
    setSettingsSaveSuccess(false);

    try {
      const newSettings: AppSettings = {
        allow_new_registrations: allowReg,
        require_certificates_verification: requireCert,
        emergency_hotline: hotline
      };
      await dbService.updateSettings(newSettings);
      setSettings(newSettings);
      setSettingsSaveSuccess(true);
      setTimeout(() => setSettingsSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSettingsLoading(false);
    }
  };

  // Filter listings
  const pendingDoctors = doctors.filter(d => d.account.status === 'pending');
  const filteredRosterDocs = doctors.filter(d => {
    // Search filter
    const nameMatch = d.profile.full_name_ar.toLowerCase().includes(rosterSearch.toLowerCase()) ||
                      d.profile.full_name_en.toLowerCase().includes(rosterSearch.toLowerCase()) ||
                      d.account.username.toLowerCase().includes(rosterSearch.toLowerCase());
    
    // Status filter
    const statusMatch = rosterStatusFilter === 'all' || d.account.status === rosterStatusFilter;

    return nameMatch && statusMatch;
  });

  const getSpecialtyLabel = (specialtyId: string) => {
    const s = SPECIALTIES.find(spec => spec.id === specialtyId);
    return s ? (isRtl ? s.name_ar : s.name_en) : specialtyId;
  };

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      
      {/* 1. Header Banner */}
      <div className="bg-white border-b border-border-brand shadow-soft">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-3 text-center sm:text-right">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-primary flex items-center justify-center border border-border-brand shadow-soft shrink-0">
              <Shield size={24} />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5">
                <span className="text-[10px] font-black bg-red-50 text-red-600 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-red-100">
                  <ShieldAlert size={10} />
                  <span>{isRtl ? 'صلاحية مسؤول النظام' : 'System Administrator'}</span>
                </span>
              </div>
              <h1 className="text-base font-black text-text-dark font-display mt-0.5">
                {isRtl ? 'منصة إدارة طمني بلس' : 'Tamenni Plus Control Portal'}
              </h1>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 h-10 rounded-xl bg-red-50 text-red-600 border border-red-100 font-bold text-xs hover:bg-red-100 transition-all cursor-pointer shadow-soft"
          >
            <LogOut size={14} />
            <span>{isRtl ? 'خروج المسؤول' : 'Logout Admin'}</span>
          </button>

        </div>
      </div>

      {/* 2. Main Dashboard Layout */}
      <div className="grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Statistics Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          
          <div className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft space-y-1.5">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">
              {isRtl ? 'إجمالي الأطباء بالمنصة' : 'Total Clinicians'}
            </span>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-black text-text-dark font-display leading-none">{doctors.length}</p>
              <span className="text-[10px] font-bold text-green-600">
                {doctors.filter(d => d.account.status === 'approved').length} {isRtl ? 'نشط' : 'active'}
              </span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft space-y-1.5">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">
              {isRtl ? 'طلبات التوثيق المعلقة' : 'Pending Verification'}
            </span>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-black text-yellow-600 font-display leading-none">{pendingDoctors.length}</p>
              {pendingDoctors.length > 0 && (
                <span className="text-[9px] font-black bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full animate-pulse border border-yellow-100">
                  {isRtl ? 'مستعجل ⚠️' : 'ACTION ⚠️'}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft space-y-1.5">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">
              {isRtl ? 'خط الطوارئ الساخن' : 'Emergency Helpline'}
            </span>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-black text-red-600 font-display leading-none">{hotline}</p>
              <span className="text-[10px] font-bold text-text-muted">{isRtl ? 'نشط ٢٤/٧' : 'Active 24/7'}</span>
            </div>
          </div>

          <div className="p-5 bg-white rounded-3xl border border-border-brand shadow-soft space-y-1.5">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">
              {isRtl ? 'التسجيلات المفتوحة' : 'Enrollments Open'}
            </span>
            <div className="flex justify-between items-end">
              <p className={`text-sm font-black uppercase font-display leading-none ${allowReg ? 'text-green-600' : 'text-red-600'}`}>
                {allowReg ? (isRtl ? 'مسموح الآن' : 'ALLOWED') : (isRtl ? 'مغلق حالياً' : 'SUSPENDED')}
              </p>
              <span className="text-[10px] font-bold text-text-muted">{isRtl ? 'إعدادات النظام' : 'Global flag'}</span>
            </div>
          </div>

        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl flex gap-2 font-bold text-xs">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selection Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Navigation rail */}
          <div className="lg:col-span-3 bg-white p-4 rounded-3xl border border-border-brand shadow-soft space-y-2">
            
            <button
              onClick={() => setActiveTab('pending')}
              className={`w-full h-11 px-4 rounded-xl text-xs font-black flex items-center justify-between transition-all cursor-pointer ${
                activeTab === 'pending' ? 'gradient-bg text-white shadow-premium' : 'text-text-muted hover:text-text-dark hover:bg-light-gray'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText size={16} />
                <span>{isRtl ? 'تدقيق وثائق الأطباء' : 'Academic Credentials'}</span>
              </div>
              {pendingDoctors.length > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                  activeTab === 'pending' ? 'bg-white text-primary' : 'bg-yellow-500 text-white'
                }`}>
                  {pendingDoctors.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('roster')}
              className={`w-full h-11 px-4 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'roster' ? 'gradient-bg text-white shadow-premium' : 'text-text-muted hover:text-text-dark hover:bg-light-gray'
              }`}
            >
              <User size={16} />
              <span>{isRtl ? 'دليل الأطباء بالكامل' : 'Clinician Directory'}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full h-11 px-4 rounded-xl text-xs font-black flex items-center gap-2.5 transition-all cursor-pointer ${
                activeTab === 'settings' ? 'gradient-bg text-white shadow-premium' : 'text-text-muted hover:text-text-dark hover:bg-light-gray'
              }`}
            >
              <Settings size={16} />
              <span>{isRtl ? 'إعدادات النظام والمنصة' : 'Portal Parameters'}</span>
            </button>

          </div>

          {/* Content panel */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              
              {activeTab === 'pending' && (
                /* TAB 1: PENDING DOCTORS AUDIT */
                <motion.div
                  key="pending"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-6"
                >
                  <div className="pb-2 border-b border-border-brand/60">
                    <h2 className="text-sm font-black text-text-dark uppercase tracking-wider">
                      {isRtl ? 'طلبات التسجيل الطبية المعلقة للدراسة' : 'Medical Credentials Audit Queue'}
                    </h2>
                    <p className="text-[11px] font-bold text-text-muted mt-1">
                      {isRtl 
                        ? 'يرجى تدقيق الشهادات العلمية والجامعة ومقارنة رقم قيد النقابة بالبوابة الرسمية قبل اتخاذ قرار القبول.'
                        : 'Review certificates and medical syndicate numbers before authorizing live listing access.'}
                    </p>
                  </div>

                  {pendingDoctors.length === 0 ? (
                    <div className="text-center py-16 text-xs font-bold text-text-muted space-y-2">
                      <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-full mx-auto">
                        <CheckCircle size={24} />
                      </div>
                      <p>{isRtl ? 'جميع الطلبات تمت مراجعتها بالكامل وتحديثها!' : 'All practitioner registration requests are reviewed!'}</p>
                    </div>
                  ) : (
                    <div className="space-y-6 divide-y divide-border-brand/40">
                      {pendingDoctors.map((doc, idx) => (
                        <div key={doc.account.id} className={`pt-6 ${idx === 0 ? 'pt-0' : ''} flex flex-col md:flex-row gap-6 justify-between items-start text-xs font-bold text-text-muted`}>
                          
                          {/* Doctor Information Details */}
                          <div className="space-y-3 grow">
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-xl bg-purple-50 text-primary flex items-center justify-center border border-purple-100 font-black">
                                {doc.profile.gender === 'male' ? '👨‍⚕️' : '👩‍⚕️'}
                              </div>
                              <div>
                                <h3 className="text-sm font-black text-text-dark">
                                  {isRtl ? doc.profile.full_name_ar : doc.profile.full_name_en}
                                </h3>
                                <p className="text-[11px] font-bold text-primary">
                                  {getSpecialtyLabel(doc.profile.specialty_id)} — {isRtl ? doc.profile.sub_specialty_ar : doc.profile.sub_specialty_en}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 p-4 bg-light-gray/30 rounded-2xl border border-border-brand/40 text-text-dark font-black">
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">{isRtl ? 'رقم قيد نقابة الأطباء' : 'Syndicate Reg Number'}</span>
                                <span className="text-primary text-sm font-black">{doc.profile.syndicate_number}</span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">{isRtl ? 'الدرجة العلمية والجامعة' : 'Academic Degree'}</span>
                                <span className="font-semibold text-xs">{isRtl ? doc.profile.degree_ar : doc.profile.degree_en}</span>
                              </div>
                              <div className="space-y-1 pt-2 border-t border-border-brand/20 sm:col-span-2 flex justify-between items-center text-xs text-text-muted">
                                <span>📧 {doc.account.email}</span>
                                <span>📞 {doc.profile.phone_number}</span>
                              </div>
                            </div>
                          </div>

                          {/* Action panel & certificates preview */}
                          <div className="w-full md:w-48 shrink-0 space-y-3">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-wider block">
                              {isRtl ? 'المستندات الطبية المرفقة:' : 'Uploaded Certificate:'}
                            </span>
                            
                            {doc.profile.certificates && doc.profile.certificates.length > 0 ? (
                              <div 
                                onClick={() => setViewingCert(doc.profile.certificates[0])}
                                className="h-28 rounded-2xl border border-border-brand bg-light-gray relative overflow-hidden group cursor-pointer shadow-soft"
                              >
                                <img 
                                  src={doc.profile.certificates[0]} 
                                  alt="credentials certificate" 
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Eye size={18} className="text-white" />
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100">
                                {isRtl ? '⚠️ لم يتم رفع أي مستندات!' : '⚠️ No certificate uploaded!'}
                              </div>
                            )}

                            {/* Verification CTA Buttons */}
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleUpdateStatus(doc.account.id, 'approved')}
                                className="h-9 rounded-xl bg-green-50 text-green-700 border border-green-200 text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer hover:bg-green-100 transition-all"
                              >
                                <Check size={12} className="stroke-[3]" />
                                <span>{isRtl ? 'قبول الطبيب' : 'Approve'}</span>
                              </button>
                              
                              <button
                                onClick={() => handleUpdateStatus(doc.account.id, 'rejected')}
                                className="h-9 rounded-xl bg-red-50 text-red-700 border border-red-200 text-[10px] font-black flex items-center justify-center gap-1 cursor-pointer hover:bg-red-100 transition-all"
                              >
                                <X size={12} className="stroke-[3]" />
                                <span>{isRtl ? 'رفض الطلب' : 'Reject'}</span>
                              </button>
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'roster' && (
                /* TAB 2: ALL REGISTERED DOCTORS ROSTER */
                <motion.div
                  key="roster"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border-brand/60">
                    <div>
                      <h2 className="text-sm font-black text-text-dark uppercase tracking-wider">
                        {isRtl ? 'دليل الأطباء المسجلين بقاعدة البيانات' : 'Platform Directory Roster'}
                      </h2>
                    </div>
                    <span className="text-xs font-bold text-text-muted">
                      {doctors.length} {isRtl ? 'طبيب مسجل' : 'practitioners'}
                    </span>
                  </div>

                  {/* Search and Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2 relative">
                      <Search size={14} className="text-text-muted absolute right-3 top-3.5" />
                      <input
                        type="text"
                        value={rosterSearch}
                        onChange={(e) => setRosterSearch(e.target.value)}
                        placeholder={isRtl ? 'ابحث باسم الطبيب أو اسم المستخدم...' : 'Search by clinician name or username...'}
                        className="w-full h-10 pr-9 pl-3 rounded-xl border border-border-brand bg-white text-xs font-bold outline-none focus:border-primary"
                      />
                    </div>

                    <select
                      value={rosterStatusFilter}
                      onChange={(e) => setRosterStatusFilter(e.target.value)}
                      className="h-10 px-3 rounded-xl border border-border-brand bg-white text-xs font-bold outline-none focus:border-primary"
                    >
                      <option value="all">{isRtl ? 'كل الحالات الطبية' : 'All Statuses'}</option>
                      <option value="approved">{isRtl ? 'حساب معتمد نشط' : 'Approved'}</option>
                      <option value="pending">{isRtl ? 'قيد المراجعة' : 'Pending'}</option>
                      <option value="rejected">{isRtl ? 'مرفوض' : 'Rejected'}</option>
                      <option value="blocked">{isRtl ? 'محظور / موقوف' : 'Blocked'}</option>
                    </select>
                  </div>

                  {/* Doctors List */}
                  <div className="divide-y divide-border-brand/40 max-h-[50vh] overflow-y-auto pr-1">
                    {filteredRosterDocs.length === 0 ? (
                      <div className="text-center py-12 text-xs font-bold text-text-muted">
                        {isRtl ? 'لا يوجد أطباء يطابقون خيارات التصفية.' : 'No clinicians match current filters.'}
                      </div>
                    ) : (
                      filteredRosterDocs.map((doc) => (
                        <div key={doc.account.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-bold text-text-muted">
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <h3 className="text-sm font-black text-text-dark">
                                {isRtl ? doc.profile.full_name_ar : doc.profile.full_name_en}
                              </h3>
                              <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                                doc.account.status === 'approved'
                                  ? 'bg-green-50 text-green-700'
                                  : doc.account.status === 'pending'
                                  ? 'bg-yellow-50 text-yellow-700'
                                  : 'bg-red-50 text-red-700'
                              }`}>
                                {doc.account.status}
                              </span>
                            </div>
                            <p className="text-[11px] text-primary">{getSpecialtyLabel(doc.profile.specialty_id)}</p>
                            <p className="text-[10px] text-text-muted">
                              ✉️ {doc.account.email} | 🎓 Reg: {doc.profile.syndicate_number}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {doc.account.status !== 'approved' && (
                              <button
                                onClick={() => handleUpdateStatus(doc.account.id, 'approved')}
                                className="px-3 h-8 bg-green-50 text-green-700 border border-green-100 rounded-lg text-[10px] font-black cursor-pointer transition-colors hover:bg-green-100"
                              >
                                {isRtl ? 'اعتماد ونشر' : 'Approve'}
                              </button>
                            )}

                            {doc.account.status === 'approved' && (
                              <button
                                onClick={() => handleUpdateStatus(doc.account.id, 'blocked')}
                                className="px-3 h-8 bg-red-50 text-red-700 border border-red-100 rounded-lg text-[10px] font-black cursor-pointer transition-colors hover:bg-red-100"
                              >
                                {isRtl ? 'حظر الطبيب' : 'Block'}
                              </button>
                            )}

                            {doc.account.status === 'blocked' && (
                              <button
                                onClick={() => handleUpdateStatus(doc.account.id, 'approved')}
                                className="px-3 h-8 bg-purple-50 text-primary border border-purple-100 rounded-lg text-[10px] font-black cursor-pointer transition-colors hover:bg-purple-100"
                              >
                                {isRtl ? 'فك الحظر' : 'Unblock'}
                              </button>
                            )}
                          </div>

                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'settings' && (
                /* TAB 3: SYSTEM SETTINGS PARAMETERS */
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-white p-6 rounded-3xl border border-border-brand shadow-soft space-y-6"
                >
                  <div className="pb-2 border-b border-border-brand/60">
                    <h2 className="text-sm font-black text-text-dark uppercase tracking-wider">
                      {isRtl ? 'إعدادات المنصة وبوابة التراخيص الطبية' : 'Global Platform Rules'}
                    </h2>
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-6 text-xs font-bold text-text-muted">
                    
                    {settingsSaveSuccess && (
                      <div className="p-3 bg-green-50 text-green-700 border border-green-100 rounded-xl flex items-center gap-2">
                        <Check size={14} className="stroke-[3]" />
                        <span>{isRtl ? 'تم حفظ وتعميم الإعدادات بنجاح!' : 'Administrative rules saved successfully!'}</span>
                      </div>
                    )}

                    {/* Registrations Open */}
                    <div className="flex items-center justify-between p-4 bg-light-gray/40 rounded-2xl border border-border-brand/40">
                      <div>
                        <span className="text-text-dark font-black text-xs block">{isRtl ? 'السماح بتسجيل ممارسين جدد' : 'Allow new clinician enrollments'}</span>
                        <span className="text-[10px] font-semibold text-text-muted block mt-0.5">
                          {isRtl ? 'تمكين استمارات الأطباء وإمكانية فتح حسابات جديدة.' : 'Enable or suspend online sign-up forms for doctors.'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAllowReg(!allowReg)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${allowReg ? 'bg-primary' : 'bg-text-muted'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${allowReg ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Force Certificate Verification */}
                    <div className="flex items-center justify-between p-4 bg-light-gray/40 rounded-2xl border border-border-brand/40">
                      <div>
                        <span className="text-text-dark font-black text-xs block">{isRtl ? 'فرض التدقيق والمراجعة الإجبارية' : 'Enforce strict certification review'}</span>
                        <span className="text-[10px] font-semibold text-text-muted block mt-0.5">
                          {isRtl ? 'عند التمكين، تظل الحسابات مخفية ولا تنشر تلقائياً بالدليل إلا بعد إقرار مسؤول النظام.' : 'Keep listings hidden until manual admin auditing resolves successfully.'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setRequireCert(!requireCert)}
                        className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${requireCert ? 'bg-primary' : 'bg-text-muted'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white transition-transform ${requireCert ? 'translate-x-6' : 'translate-x-0'}`} />
                      </button>
                    </div>

                    {/* Hotline Helpline */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase text-text-muted block">{isRtl ? 'خط الاستشارات الساخن والرقم السريع للخدمة' : 'Emergency hotline hotline number'}</label>
                      <input
                        type="text"
                        required
                        value={hotline}
                        onChange={(e) => setHotline(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 123"
                        className="w-full h-11 px-4 rounded-xl border border-border-brand bg-white focus:border-primary outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={settingsLoading}
                      className="px-8 h-12 bg-primary text-white rounded-xl font-black text-xs shadow-premium flex items-center justify-center gap-2 cursor-pointer transition-transform duration-300 hover:scale-[1.01]"
                    >
                      {settingsLoading ? (
                        <span className="animate-spin inline-block border-2 border-white/40 border-t-white rounded-full w-4 h-4" />
                      ) : (
                        <span>{isRtl ? 'حفظ إعدادات المنصة' : 'Save Platform Rules'}</span>
                      )}
                    </button>

                  </form>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>

      {/* LIGHTBOX CERTIFICATE VIEWER MODAL */}
      <AnimatePresence>
        {viewingCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-text-dark/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-3xl w-full bg-white rounded-3xl overflow-hidden border border-border-brand shadow-premium"
            >
              <button
                onClick={() => setViewingCert(null)}
                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-text-dark hover:bg-white cursor-pointer shadow-soft"
              >
                <X size={16} />
              </button>
              <div className="p-4 bg-light-gray border-b border-border-brand/40">
                <p className="text-xs font-black text-text-dark">{isRtl ? 'معاينة الشهادة الطبية الرسمية المرفقة' : 'Practitioner Certificate Preview'}</p>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <img 
                  src={viewingCert} 
                  alt="credentials certificate full scale" 
                  className="w-full h-auto object-contain"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
