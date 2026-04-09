import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIssues } from '../context/IssueContext';
import { useSimpleToast } from '../components/ui/Toast';
import { 
  Droplet, MapPin, AlertTriangle, FileText, Send, Sparkles,
  Mic, Square, Camera, Image as ImageIcon, Type, AudioLines, Plus,
  X, Phone, ShieldCheck
} from 'lucide-react';
import { ProblemType, UrgencyLevel } from '../types';
import { useLanguage } from '../context/LanguageContext';

export default function ReportPage() {
  const { addIssue } = useIssues();
  const { showToast } = useSimpleToast();
  const { t } = useLanguage();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportMode, setReportMode] = useState<'standard' | 'voice'>('standard');
  const [isRecording, setIsRecording] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpStep, setOtpStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');

  const [formData, setFormData] = useState({
    village: '',
    gpsLocation: '',
    problem: '' as ProblemType | '',
    problemDescription: '',
    urgency: '' as UrgencyLevel | '',
    details: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      showToast('Voice recording saved locally (Simulation)', 'success');
    } else {
      setIsRecording(true);
    }
  };

  const handleFillDemo = () => {
    setFormData({
      village: 'Bhusawar',
      gpsLocation: '27.0345° N, 77.1234° E',
      problem: 'Handpump Broken',
      problemDescription: 'Handle completely detached.',
      urgency: 'High',
      details: 'The handpump near the primary school has been dispensing muddy water for 2 days, and today the handle broke completely off. Urgent fix needed.'
    });
    setReportMode('standard');
    showToast('Demo data loaded automatically', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.village || !formData.urgency) return;
    if (reportMode === 'standard' && !formData.problem) return;
    
    if (formData.urgency === 'High' || formData.urgency === 'Critical') {
      setShowOtpModal(true);
      setOtpStep('phone');
      return;
    }
    
    performSubmit();
  };

  const handleSendOtp = () => {
    if (phoneNumber.length < 10) return;
    setOtpStep('otp');
    showToast('OTP sent to your phone number!', 'success');
  };

  const handleVerifyOtp = () => {
    if (otpCode.length < 4) return;
    showToast('Phone verified successfully.', 'success');
    performSubmit();
  };

  const performSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate network delay for polish
    setTimeout(() => {
      const id = addIssue({
        village: formData.village,
        gpsLocation: formData.gpsLocation,
        problem: formData.problem === 'Other' 
            ? (`Other: ${formData.problemDescription}` as ProblemType) 
            : (formData.problem || 'Other') as ProblemType,
        urgency: formData.urgency as UrgencyLevel,
        details: reportMode === 'voice' ? 'Voice report attached.' : formData.details
      });
      
      showToast(`Issue reported successfully! ID: ${id}`, 'success');
      setFormData({ village: '', gpsLocation: '', problem: '', problemDescription: '', urgency: '', details: '' });
      setPhotoPreview(null);
      setPhoneNumber('');
      setOtpCode('');
      setShowOtpModal(false);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto py-8 px-4 sm:px-6"
    >
      <div className="bg-card rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
        {/* Decorative Top Banner */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-400 via-primary to-blue-600"></div>
        
        <div className="p-6 sm:p-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">{t('reportTitle')}</h2>
              <p className="text-muted-foreground mt-1 text-sm">{t('reportDesc')}</p>
            </div>
            
            <button 
              type="button"
              onClick={handleFillDemo}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('fillDemo')}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Top Shared Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="village" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-primary" />
                  {t('villageName')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="village"
                  name="village"
                  value={formData.village}
                  onChange={handleChange}
                  required
                  placeholder={t('villagePlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="gpsLocation" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-emerald-500" />
                  {t('gpsLocation')}
                </label>
                <div className="flex gap-2">
                  <input
                    id="gpsLocation"
                    name="gpsLocation"
                    value={formData.gpsLocation}
                    onChange={handleChange}
                    placeholder={t('gpsPlaceholder')}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!navigator.geolocation) {
                        showToast('Geolocation is not supported by your browser', 'error');
                        return;
                      }
                      showToast('Fetching location...', 'success');
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const { latitude, longitude } = position.coords;
                          setFormData(prev => ({ ...prev, gpsLocation: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E` }));
                          showToast('Location captured!', 'success');
                        },
                        (error) => {
                          showToast(`Error: ${error.message}`, 'error');
                        }
                      );
                    }}
                    className="px-4 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition-colors"
                  >
                    <MapPin className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="urgency" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                {t('howSevere')} <span className="text-red-500">*</span>
              </label>
              <select
                id="urgency"
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
              >
                <option value="" disabled>{t('howSevere')}</option>
                <option value="Low">{t('low')}</option>
                <option value="Medium">{t('medium')}</option>
                <option value="High">{t('high')}</option>
                <option value="Critical">{t('critical')}</option>
              </select>
            </div>

            {/* Reporting Mode Toggle */}
            <div className="bg-slate-50 p-1.5 rounded-xl flex border border-slate-200/80">
              <button
                type="button"
                onClick={() => setReportMode('standard')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  reportMode === 'standard' 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <Type className="w-4 h-4" />
                {t('textPhotoReport')}
              </button>
              <button
                type="button"
                onClick={() => setReportMode('voice')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  reportMode === 'voice' 
                    ? 'bg-white text-primary shadow-sm ring-1 ring-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100/50'
                }`}
              >
                <AudioLines className="w-4 h-4" />
                {t('voiceRecording')}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {reportMode === 'standard' ? (
                <motion.div
                  key="standard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Problem Specifics grouped */}
                  <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-5">
                    <div className="grid grid-cols-1 gap-5">
                      <div className="space-y-2">
                        <label htmlFor="problem" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                          <Droplet className="w-4 h-4 text-blue-500" />
                          {t('tellUsHappening')} <span className="text-red-500">*</span>
                        </label>
                        <select
                          id="problem"
                          name="problem"
                          value={formData.problem}
                          onChange={handleChange}
                          required={reportMode === 'standard'}
                          className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none"
                          style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                        >
                          <option value="" disabled>{t('selectCategory')}</option>
                          <option value="Handpump Broken">{t('Handpump Broken')}</option>
                          <option value="Borewell Failure">{t('Borewell Failure')}</option>
                          <option value="No Water Supply">{t('No Water Supply')}</option>
                          <option value="Tanker Required">{t('Tanker Required')}</option>
                          <option value="Other">{t('otherWriteIt')}</option>
                        </select>
                      </div>

                      {formData.problem === 'Other' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }} 
                          animate={{ opacity: 1, height: 'auto' }} 
                          className="space-y-2"
                        >
                          <label htmlFor="problemDescription" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                            <AlertTriangle className="w-4 h-4 text-blue-500 opacity-60" />
                            {t('Other')} <span className="text-red-500">*</span>
                          </label>
                          <input
                            id="problemDescription"
                            name="problemDescription"
                            value={formData.problemDescription}
                            onChange={handleChange}
                            required={formData.problem === 'Other'}
                            placeholder={t('detailsPlaceholder')}
                            className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
                          />
                        </motion.div>
                      )}
                    </div>

                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center min-h-[300px]"
                >
                  <AnimatePresence mode="wait">
                    {!isRecording ? (
                      <motion.div 
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center text-center"
                      >
                        <button
                          type="button"
                          onClick={toggleRecording}
                          className="w-20 h-20 bg-blue-100 hover:bg-blue-200 text-primary rounded-full flex items-center justify-center transition-colors mb-4 ring-4 ring-blue-50"
                        >
                          <Mic className="w-8 h-8" />
                        </button>
                        <h3 className="font-semibold text-lg text-slate-800">{t('recordVoice')}</h3>
                        <p className="text-slate-500 text-sm mt-1 max-w-[240px]">
                          {t('tapToSpeak')}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="recording"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="relative w-24 h-24 flex items-center justify-center mb-4">
                          <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-75"></div>
                          <button
                            type="button"
                            onClick={toggleRecording}
                            className="relative z-10 w-20 h-20 bg-red-50 hover:bg-red-100 text-red-500 rounded-full flex items-center justify-center transition-colors ring-4 ring-white shadow-sm"
                          >
                            <Square className="w-8 h-8 fill-current" />
                          </button>
                        </div>
                        <h3 className="font-semibold text-lg text-red-600 animate-pulse">{t('recording')}</h3>
                        <p className="text-slate-500 text-sm mt-1">{t('speakClearly')}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Photo Upload & Details Area - Now Shared */}
            <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ImageIcon className="w-4 h-4 text-primary" />
                  {t('attachPhoto')}
                </label>
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  className="hidden" 
                />
                {photoPreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={photoPreview} alt="Problem preview" className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={removePhoto}
                        className="bg-white/90 text-red-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white transition-colors"
                      >
                        {t('removePhoto')}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={triggerFileUpload}
                    className="w-full h-32 border-2 border-dashed border-slate-300 hover:border-primary/50 bg-white rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-primary transition-colors hover:bg-primary/5"
                  >
                    <Camera className="w-6 h-6 mb-2 opacity-70" />
                    <span className="text-sm font-medium">{t('clickToUpload')}</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="details" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText className="w-4 h-4 text-primary" />
                  {t('additionalDetails')} <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <textarea
                  id="details"
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  rows={3}
                  placeholder={t('detailsPlaceholder')}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col sm:flex-row gap-4 items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex-1 flex justify-center items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{t('submitting')}</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{t('submitReport')}</span>
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={handleFillDemo}
                className="sm:hidden w-full flex justify-center items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                {t('fillDemo')}
              </button>
            </div>
            
          </form>
        </div>
      </div>
      
      {/* Information Banner below form */}
      <div className="mt-8 flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800">
        <div className="mt-0.5"><AlertTriangle className="w-5 h-5 text-blue-600" /></div>
        <div>
          <h4 className="font-semibold text-sm">{t('emergencyTitle')}</h4>
          <p className="text-xs mt-1 text-blue-700/80 leading-relaxed">
            {t('emergencyDesc')}
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {showOtpModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              onClick={() => setShowOtpModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-white rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-100 p-3 rounded-2xl">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <button 
                    onClick={() => setShowOtpModal(false)}
                    className="p-2 -mr-2 text-slate-400 hover:text-slate-600 transition-colors rounded-full hover:bg-slate-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {t('verifyIdentity')}
                </h3>
                <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                  {t('otpDesc')}
                </p>

                {otpStep === 'phone' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{t('phoneNumber')}</label>
                      <div className="relative mt-1.5">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Phone className="w-4 h-4 text-slate-400" />
                        </div>
                        <input
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          placeholder={t('phonePlaceholder')}
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium text-slate-900"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleSendOtp}
                      disabled={phoneNumber.length < 10}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50 disabled:shadow-none"
                    >
                      {t('sendOtp')}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">{t('enterOtp')}</label>
                      <div className="mt-1.5 flex gap-2">
                        <input
                          type="text"
                          value={otpCode}
                          onChange={(e) => setOtpCode(e.target.value)}
                          placeholder="----"
                          maxLength={4}
                          className="w-full text-center tracking-[0.5em] text-xl font-mono py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900"
                        />
                      </div>
                    </div>
                    <button
                      onClick={handleVerifyOtp}
                      disabled={otpCode.length < 4 || isSubmitting}
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 disabled:shadow-none flex justify-center items-center gap-2"
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ) : (
                        t('verifySubmit')
                      )}
                    </button>
                    <button
                       onClick={() => setOtpStep('phone')}
                       className="w-full py-2 text-sm font-semibold text-slate-500 hover:text-slate-700"
                    >
                      {t('changePhone')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
