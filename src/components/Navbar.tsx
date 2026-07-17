/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Globe, LogOut, User, Activity, LayoutDashboard, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { dbService } from '../lib/supabase';

interface NavbarProps {
  language: Language;
  onLanguageToggle: () => void;
  loggedInUser: any;
  onLogout: () => void;
  onNavigate: (view: string, targetId?: string) => void;
  onOpenAuth: (role: 'patient' | 'doctor') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onLanguageToggle,
  loggedInUser,
  onLogout,
  onNavigate,
  onOpenAuth,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRtl = language === 'ar';
  const userProfile = loggedInUser?.data ?? {};
  const userDisplayName =
    userProfile.name || userProfile.username || userProfile.email || 'User';

  const t = {
    brandName: isRtl ? 'طمني بلس' : 'Tamenni Plus',
    about: isRtl ? 'عن المنصة' : 'About',
    specialties: isRtl ? 'التخصصات' : 'Specialties',
    faq: isRtl ? 'الأسئلة الشائعة' : 'FAQ',
    joinAsDoctor: isRtl ? 'انضم كطبيب' : 'Join as Doctor',
    login: isRtl ? 'تسجيل الدخول' : 'Login',
    logout: isRtl ? 'خروج' : 'Logout',
    dashboard: isRtl ? 'لوحة التحكم' : 'Dashboard',
    adminPanel: isRtl ? 'لوحة المسؤول' : 'Admin Area',
    welcome: isRtl ? 'مرحباً،' : 'Welcome,',
  };

  const handleLogout = () => {
    onLogout();
    onNavigate('landing');
  };

  const toggleLanguage = () => {
    onLanguageToggle();
  };

  return (
    <header className="sticky top-0 z-50 w-full glass-panel shadow-soft transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            onClick={() => onNavigate('landing', 'home')} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-premium transition-transform duration-300 group-hover:scale-105 overflow-hidden">
              <img src="/logo.png" alt={isRtl ? 'شعار طمّني بلس' : 'Tamenni Plus logo'} className="w-full h-full object-contain" />
            </div>
            <span className="text-xl font-bold tracking-tight text-text-dark font-display">
              <span className="text-primary">{isRtl ? 'طمّني' : 'Tamny'}</span>
              <span className="text-secondary">{isRtl ? ' بلس' : ' Plus'}</span>
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => onNavigate('landing', 'home')} 
              className="text-text-dark hover:text-primary transition-colors text-sm font-medium"
            >
              {isRtl ? 'الرئيسية' : 'Home'}
            </button>
            <button 
              onClick={() => onNavigate('landing', 'specialties')}
              className="text-text-dark hover:text-primary transition-colors text-sm font-medium"
            >
              {t.specialties}
            </button>
            <button 
              onClick={() => onNavigate('landing', 'about')}
              className="text-text-dark hover:text-primary transition-colors text-sm font-medium"
            >
              {t.about}
            </button>
            <button 
              onClick={() => onNavigate('landing', 'faq')}
              className="text-text-dark hover:text-primary transition-colors text-sm font-medium"
            >
              {t.faq}
            </button>
          </nav>

          {/* Action buttons */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 h-10 rounded-xl border border-border-brand hover:bg-light-gray text-text-dark transition-colors text-xs font-semibold"
            >
              <Globe size={15} />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Authenticated user states */}
            {loggedInUser ? (
              <div className="flex items-center gap-3">
                {loggedInUser.role === 'admin' ? (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="flex items-center gap-1.5 px-4 h-11 rounded-xl bg-text-dark hover:bg-black text-white transition-all shadow-soft text-sm font-semibold"
                  >
                    <ShieldAlert size={16} />
                    <span>{t.adminPanel}</span>
                  </button>
                ) : loggedInUser.role === 'doctor' ? (
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-1.5 px-4 h-11 rounded-xl gradient-bg gradient-bg-hover text-white transition-all shadow-premium text-sm font-semibold"
                  >
                    <LayoutDashboard size={16} />
                    <span>{t.dashboard}</span>
                  </button>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-light-gray rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {userProfile?.avatar_url ? (
                        <img 
                          referrerPolicy="no-referrer"
                          src={userProfile.avatar_url} 
                          alt="avatar" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <User size={16} />
                      )}
                    </div>
                    <span className="text-xs font-semibold text-text-dark max-w-[120px] truncate">
                      {userDisplayName}
                    </span>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="p-3 rounded-xl border border-border-brand text-text-muted hover:text-red-600 hover:bg-red-50 transition-colors"
                  title={t.logout}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('doctor')}
                  className="px-4 h-11 rounded-xl border border-border-brand text-text-dark hover:bg-light-gray transition-colors text-sm font-semibold"
                >
                  {t.joinAsDoctor}
                </button>
                <button
                  onClick={() => onOpenAuth('patient')}
                  className="px-5 h-11 rounded-xl gradient-bg gradient-bg-hover text-white shadow-premium text-sm font-semibold transition-all duration-300"
                >
                  {t.login}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="flex items-center md:hidden gap-3">
            <button
              onClick={toggleLanguage}
              className="p-2.5 rounded-xl border border-border-brand hover:bg-light-gray text-text-dark"
            >
              <Globe size={16} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-light-gray text-text-dark hover:bg-border-brand transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border-brand bg-white/95 backdrop-blur-md overflow-hidden"
          >
            <div className="px-4 py-6 space-y-4">
              <button
                onClick={() => {
                  onNavigate('landing', 'home');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-right px-4 py-2.5 rounded-xl hover:bg-light-gray text-text-dark font-medium"
              >
                {isRtl ? 'الرئيسية' : 'Home'}
              </button>
              <button
                onClick={() => {
                  onNavigate('landing', 'specialties');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-right px-4 py-2.5 rounded-xl hover:bg-light-gray text-text-dark font-medium"
              >
                {t.specialties}
              </button>
              <button
                onClick={() => {
                  onNavigate('landing', 'about');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-right px-4 py-2.5 rounded-xl hover:bg-light-gray text-text-dark font-medium"
              >
                {t.about}
              </button>
              <button
                onClick={() => {
                  onNavigate('landing', 'faq');
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-right px-4 py-2.5 rounded-xl hover:bg-light-gray text-text-dark font-medium"
              >
                {t.faq}
              </button>

              <hr className="border-border-brand my-2" />

              {loggedInUser ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {userProfile?.avatar_url ? (
                        <img 
                          referrerPolicy="no-referrer"
                          src={userProfile.avatar_url} 
                          alt="avatar" 
                          className="w-full h-full rounded-full object-cover" 
                        />
                      ) : (
                        <User size={18} />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-text-dark">
                        {userDisplayName}
                      </div>
                      <div className="text-xs text-text-muted">
                        {loggedInUser.role === 'doctor' ? t.dashboard : loggedInUser.role === 'admin' ? t.adminPanel : userProfile.email || userProfile.username}
                      </div>
                    </div>
                  </div>

                  {loggedInUser.role === 'admin' ? (
                    <button
                      onClick={() => {
                        onNavigate('admin');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl bg-text-dark text-white font-semibold"
                    >
                      <ShieldAlert size={16} />
                      <span>{t.adminPanel}</span>
                    </button>
                  ) : loggedInUser.role === 'doctor' ? (
                    <button
                      onClick={() => {
                        onNavigate('dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full h-12 rounded-xl gradient-bg text-white font-semibold"
                    >
                      <LayoutDashboard size={16} />
                      <span>{t.dashboard}</span>
                    </button>
                  ) : null}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <LogOut size={16} />
                    <span>{t.logout}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => {
                      onOpenAuth('doctor');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center h-12 rounded-xl border border-border-brand text-text-dark font-semibold text-sm"
                  >
                    {t.joinAsDoctor}
                  </button>
                  <button
                    onClick={() => {
                      onOpenAuth('patient');
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center h-12 rounded-xl gradient-bg text-white font-semibold text-sm shadow-premium"
                  >
                    {t.login}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
export default Navbar;
