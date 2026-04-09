import React from 'react';
import { Link, useRoute } from 'wouter';
import { Droplet, Menu, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage, Language } from '../../context/LanguageContext';

export default function Header() {
  const [isReportActive] = useRoute('/');
  const [isDashboardActive] = useRoute('/dashboard');
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
              <Droplet className="w-6 h-6 text-blue-100" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold tracking-wide leading-tight">JalSathi</h1>
              <p className="text-xs text-blue-200 hidden sm:block font-medium">Rural Water Issue Reporting System</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-1 bg-black/10 p-1 rounded-xl">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                isReportActive ? 'text-primary' : 'text-blue-100 hover:text-white hover:bg-white/5'
              }`}
            >
              {isReportActive && (
                <motion.div 
                  layoutId="active-tab" 
                  className="absolute inset-0 bg-white rounded-lg shadow-sm" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t('reportTitle')}</span>
            </Link>
            
            <Link 
              href="/dashboard" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all relative ${
                isDashboardActive ? 'text-primary' : 'text-blue-100 hover:text-white hover:bg-white/5'
              }`}
            >
              {isDashboardActive && (
                <motion.div 
                  layoutId="active-tab" 
                  className="absolute inset-0 bg-white rounded-lg shadow-sm" 
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{t('dashboardTitle')}</span>
            </Link>
          </nav>

          {/* Language Switcher & Mobile Nav */}
          <div className="flex items-center gap-4">
            <div className="flex bg-black/10 p-1 rounded-xl">
              {(['en', 'hi', 'mw'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    language === lang 
                      ? 'bg-white text-primary shadow-sm' 
                      : 'text-blue-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            
            <div className="md:hidden flex items-center">
              <button className="p-2 text-blue-100 hover:text-white bg-white/5 rounded-lg">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Nav Links - Always visible under header for this simple demo to ensure usability */}
      <div className="md:hidden flex border-t border-white/10 bg-primary/95 backdrop-blur-sm">
        <Link 
          href="/" 
          className={`flex-1 text-center py-3 text-sm font-medium border-b-2 ${
            isReportActive ? 'border-white text-white bg-white/5' : 'border-transparent text-blue-200'
          }`}
        >
          <span className="relative z-10">{t('reportTitle')}</span>
        </Link>
        <Link 
          href="/dashboard" 
          className={`flex-1 text-center py-3 text-sm font-medium border-b-2 ${
            isDashboardActive ? 'border-white text-white bg-white/5' : 'border-transparent text-blue-200'
          }`}
        >
          {t('dashboardTitle')}
        </Link>
      </div>
    </header>
  );
}
