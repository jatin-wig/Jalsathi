import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIssues } from '../context/IssueContext';
import { useSimpleToast } from '../components/ui/toast';
import { Droplet, MapPin, AlertTriangle, FileText, Send, Sparkles } from 'lucide-react';
import { ProblemType, UrgencyLevel } from '../types';

export default function ReportPage() {
  const { addIssue } = useIssues();
  const { showToast } = useSimpleToast();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    village: '',
    problem: '' as ProblemType | '',
    urgency: '' as UrgencyLevel | '',
    details: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFillDemo = () => {
    setFormData({
      village: 'Bhusawar',
      problem: 'Handpump Broken',
      urgency: 'High',
      details: 'The handpump near the primary school has been dispensing muddy water for 2 days, and today the handle broke completely off. Urgent fix needed.'
    });
    showToast('Demo data loaded automatically', 'success');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.village || !formData.problem || !formData.urgency) return;
    
    setIsSubmitting(true);
    
    // Simulate network delay for polish
    setTimeout(() => {
      const id = addIssue({
        village: formData.village,
        problem: formData.problem as ProblemType,
        urgency: formData.urgency as UrgencyLevel,
        details: formData.details
      });
      
      showToast(`Issue reported successfully! ID: ${id}`, 'success');
      setFormData({ village: '', problem: '', urgency: '', details: '' });
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
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-2xl font-display font-bold text-foreground">File a New Report</h2>
              <p className="text-muted-foreground mt-1 text-sm">Please provide details about the water issue in your village.</p>
            </div>
            
            <button 
              type="button"
              onClick={handleFillDemo}
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Fill Demo Data
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Village Input */}
            <div className="space-y-2">
              <label htmlFor="village" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <MapPin className="w-4 h-4 text-blue-500" />
                Village Name <span className="text-red-500">*</span>
              </label>
              <input
                id="village"
                name="village"
                value={formData.village}
                onChange={handleChange}
                required
                placeholder="Enter your village or panchayat name"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Problem Type Select */}
              <div className="space-y-2">
                <label htmlFor="problem" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Droplet className="w-4 h-4 text-blue-500" />
                  Problem Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 appearance-none"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                >
                  <option value="" disabled>Select the issue...</option>
                  <option value="Handpump Broken">Handpump Broken</option>
                  <option value="Borewell Failure">Borewell Failure</option>
                  <option value="No Water Supply">No Water Supply</option>
                  <option value="Tanker Required">Tanker Required</option>
                </select>
              </div>

              {/* Urgency Level Select */}
              <div className="space-y-2">
                <label htmlFor="urgency" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Urgency Level <span className="text-red-500">*</span>
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
                  <option value="" disabled>How severe is it?</option>
                  <option value="Low">Low (Can wait a few days)</option>
                  <option value="Medium">Medium (Affects some households)</option>
                  <option value="High">High (Affects whole village)</option>
                  <option value="Critical">Critical (Zero drinking water)</option>
                </select>
              </div>
            </div>

            {/* Details Textarea */}
            <div className="space-y-2">
              <label htmlFor="details" className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                <FileText className="w-4 h-4 text-blue-500" />
                Additional Details <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the location or context to help authorities find it faster..."
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto flex-1 flex justify-center items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-blue-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </div>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Report Issue</span>
                  </>
                )}
              </button>
              
              <button 
                type="button"
                onClick={handleFillDemo}
                className="sm:hidden w-full flex justify-center items-center gap-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 px-4 py-3 rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Fill Demo Data
              </button>
            </div>
            
          </form>
        </div>
      </div>
      
      {/* Information Banner below form */}
      <div className="mt-8 flex items-start gap-3 bg-blue-50 border border-blue-100 p-4 rounded-xl text-blue-800">
        <div className="mt-0.5"><AlertTriangle className="w-5 h-5 text-blue-600" /></div>
        <div>
          <h4 className="font-semibold text-sm">Emergency Reporting</h4>
          <p className="text-xs mt-1 text-blue-700/80 leading-relaxed">
            Issues marked as <strong>Critical</strong> are immediately escalated to the district nodel officer. Please only use this designation for severe situations affecting the entire community's survival supply.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
