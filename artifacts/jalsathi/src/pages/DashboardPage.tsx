import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIssues } from '../context/IssueContext';
import { format } from 'date-fns';
import {
  Filter,
  ArrowDownUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  ChevronDown,
  Users,
  Siren,
  Activity,
  Lightbulb,
  TrendingUp,
  Map as MapIcon,
  List as ListIcon,
  Medal,
  Award
} from 'lucide-react';
import { UrgencyLevel, Status, Issue } from '../types';
import { useLanguage } from '../context/LanguageContext';

const URGENCY_WEIGHTS: Record<UrgencyLevel, number> = {
  'Critical': 4,
  'High': 3,
  'Medium': 2,
  'Low': 1,
};

const URGENCY_COLORS: Record<UrgencyLevel, { badge: string; bar: string; card: string; dot: string }> = {
  Critical: {
    badge: 'bg-red-100 text-red-800 border-red-300',
    bar: 'bg-red-500',
    card: 'border-l-red-500',
    dot: 'bg-red-500',
  },
  High: {
    badge: 'bg-orange-100 text-orange-800 border-orange-300',
    bar: 'bg-orange-500',
    card: 'border-l-orange-500',
    dot: 'bg-orange-500',
  },
  Medium: {
    badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    bar: 'bg-yellow-400',
    card: 'border-l-yellow-400',
    dot: 'bg-yellow-400',
  },
  Low: {
    badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    bar: 'bg-emerald-500',
    card: 'border-l-emerald-500',
    dot: 'bg-emerald-500',
  },
};

const REGION_ZONE_COLORS: Record<string, string> = {
  'Drought-Prone Zone': 'bg-amber-50 text-amber-700 border-amber-200',
  'High Groundwater Usage': 'bg-blue-50 text-blue-700 border-blue-200',
  'Urban Water Stress': 'bg-purple-50 text-purple-700 border-purple-200',
};

export default function DashboardPage() {
  const { issues, updateIssueStatus } = useIssues();
  const { t, getNumberLocale } = useLanguage();
  const numLocale = getNumberLocale();

  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [sortByPriority, setSortByPriority] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const stats = useMemo(() => {
    const active = issues.filter(i => i.status !== 'Resolved');
    const critical = issues.filter(i => i.urgency === 'Critical' && i.status !== 'Resolved');
    const totalPeople = active.reduce((sum, i) => sum + (i.peopleAffected ?? 0), 0);
    return {
      total: issues.length,
      pending: issues.filter(i => i.status === 'Pending').length,
      assigned: issues.filter(i => i.status === 'Assigned').length,
      resolved: issues.filter(i => i.status === 'Resolved').length,
      activeIssues: active.length,
      criticalVillages: critical.length,
      peopleAffected: totalPeople,
    };
  }, [issues]);

  const displayedIssues = useMemo(() => {
    let result = [...issues];
    if (statusFilter !== 'All') {
      result = result.filter(i => i.status === statusFilter);
    }
    if (sortByPriority) {
      result.sort((a, b) => {
        const weightDiff = URGENCY_WEIGHTS[b.urgency] - URGENCY_WEIGHTS[a.urgency];
        if (weightDiff !== 0) return weightDiff;
        return b.priorityScore - a.priorityScore;
      });
    } else {
      result.sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime());
    }
    return result;
  }, [issues, statusFilter, sortByPriority]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{t('dashboardTitle')}</h2>
        <p className="text-slate-500 mt-1">{t('dashboardDesc')}</p>
      </div>

      {/* Impact Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <ImpactCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          value={`${stats.peopleAffected.toLocaleString(numLocale)}+`}
          label={t('peopleAffected')}
          sublabel={t('acrossActive')}
          color="bg-blue-50 border-blue-200"
          iconBg="bg-blue-100"
        />
        <ImpactCard
          icon={<Siren className="w-6 h-6 text-red-600" />}
          value={stats.criticalVillages.toLocaleString(numLocale)}
          label={t('criticalVillages')}
          sublabel={t('needImmediate')}
          color="bg-red-50 border-red-200"
          iconBg="bg-red-100"
        />
        <ImpactCard
          icon={<Activity className="w-6 h-6 text-orange-600" />}
          value={stats.activeIssues.toLocaleString(numLocale)}
          label={t('activeIssues')}
          sublabel={t('pendingAssigned')}
          color="bg-orange-50 border-orange-200"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Status Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard title={t('totalReports')} value={stats.total} icon={<MapPin className="w-5 h-5 text-blue-500" />} bg="bg-blue-50" border="border-blue-100" />
        <StatCard title={t('Pending')} value={stats.pending} icon={<Clock className="w-5 h-5 text-amber-500" />} bg="bg-amber-50" border="border-amber-100" />
        <StatCard title={t('Assigned')} value={stats.assigned} icon={<AlertCircle className="w-5 h-5 text-indigo-500" />} bg="bg-indigo-50" border="border-indigo-100" />
        <StatCard title={t('Resolved')} value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} bg="bg-emerald-50" border="border-emerald-100" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">{t('filterByStatus')}</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
            className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/20 outline-none flex-1 sm:flex-none cursor-pointer"
          >
            <option value="All">{t('allStatuses')}</option>
            <option value="Pending">{t('PendingSelect')}</option>
            <option value="Assigned">{t('AssignedSelect')}</option>
            <option value="Resolved">{t('ResolvedSelect')}</option>
          </select>
        </div>

        <div className="flex flex-1 justify-end w-full sm:w-auto gap-4">
          <button
            onClick={() => setSortByPriority(!sortByPriority)}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${sortByPriority
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
          >
            <ArrowDownUp className="w-4 h-4" />
            <span className="hidden sm:inline">{sortByPriority ? t('sortPriority') : t('sortDefault')}</span>
            <span className="sm:hidden">Sort</span>
          </button>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm ring-1 ring-slate-200 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ListIcon className="w-4 h-4" /> <span className="hidden sm:inline">{t('listView')}</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${viewMode === 'map' ? 'bg-white shadow-sm ring-1 ring-slate-200 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <MapIcon className="w-4 h-4" /> <span className="hidden sm:inline">{t('mapView')}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* Left Side: Map or List View */}
        <div className="flex-1 space-y-4">
          {viewMode === 'map' ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full bg-slate-950 rounded-[2.5rem] h-[650px] flex items-center justify-center relative overflow-hidden shadow-2xl border border-slate-800"
            >
              {/* High-Fidelity Background Map Image */}
              <div className="absolute inset-0 select-none">
                <div className="absolute inset-0 bg-slate-950/40 z-10" />
                <img 
                  src="/map_bg.png" 
                  alt="Sector Map"
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.1),transparent_70%)] z-10" />
              </div>

              {/* Dynamic Crisis Markers from displayedIssues */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                {displayedIssues.filter(i => i.gpsLocation).map((issue) => {
                  // Coordinate Mapping for the premium background image
                  // Bounds: Lng 71-79, Lat 23-31
                  const x = ((issue.gpsLocation!.lng - 70.8) / 8.2) * 100;
                  const y = (1 - (issue.gpsLocation!.lat - 23.5) / 7.5) * 100;
                  
                  const color = issue.urgency === 'Critical' ? 'red' : issue.urgency === 'High' ? 'orange' : issue.urgency === 'Medium' ? 'yellow' : 'blue';
                  const urgencyStyle = URGENCY_COLORS[issue.urgency];

                  return (
                    <motion.div 
                      key={issue.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute pointer-events-auto"
                      style={{ top: `${y}%`, left: `${x}%` }}
                    >
                      <div className="relative group cursor-pointer">
                        {/* Recursive Pulse for High Urgency */}
                        {(issue.urgency === 'Critical' || issue.urgency === 'High') && (
                          <>
                            <div className={`absolute -inset-6 rounded-full animate-ping duration-[3s] ${color === 'red' ? 'bg-red-500/20' : 'bg-orange-500/20'}`} />
                            <div className={`absolute -inset-10 rounded-full animate-ping duration-[4s] opacity-50 ${color === 'red' ? 'bg-red-500/10' : 'bg-orange-500/10'}`} />
                          </>
                        )}
                        <div className={`relative w-4 h-4 rounded-full border-2 border-white shadow-[0_0_15px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-125 z-10 ${urgencyStyle.dot}`} />
                        
                        {/* Hover Tooltip */}
                        <div className="absolute top-6 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none bg-slate-900/95 backdrop-blur-xl border border-white/10 p-3 rounded-2xl w-48 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-30">
                          <div className={`text-[9px] font-black uppercase tracking-widest mb-1 ${color === 'red' ? 'text-red-400' : color === 'orange' ? 'text-orange-400' : 'text-slate-400'}`}>
                            {t(issue.urgency)} · {issue.id}
                          </div>
                          <div className="text-white font-bold text-xs mb-1">{t(issue.problem)}</div>
                          <div className="text-slate-400 text-[10px] flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5" /> {t(issue.village)}, {t(issue.region)}
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center text-[9px] font-bold text-slate-300">
                             <span>{stats.peopleAffected.toLocaleString(numLocale)} {t('peopleAffected')}</span>
                             <span className={issue.status === 'Pending' ? 'text-amber-400' : 'text-emerald-400'}>{t(issue.status)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Enhanced Map UI Overlay */}
              <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end z-20 pointer-events-none">
                {/* Active Focus Panel */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-6 rounded-[2.5rem] shadow-2xl ring-1 ring-white/5 max-w-sm pointer-events-auto transition-all hover:bg-slate-900/60">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.4)] flex items-center justify-center animate-pulse">
                      <Siren className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-black text-xl leading-none">{t('criticalZone')}</h3>
                      <p className="text-white/40 text-[10px] uppercase font-black tracking-widest mt-1">{t('accurateVerified')}</p>
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-xs leading-relaxed mb-5 font-medium">
                    {t('nangalDesc')}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <div className="text-white font-black text-xl leading-none">{stats.criticalVillages}</div>
                      <div className="text-[9px] uppercase font-black text-white/30 tracking-wider mt-1.5">{t('criticalVillages')}</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                      <div className="text-white font-black text-xl leading-none">96.4%</div>
                      <div className="text-[9px] uppercase font-black text-white/30 tracking-wider mt-1.5">{t('intensity')}</div>
                    </div>
                  </div>
                </div>

                {/* Glassmorphic Legend */}
                <div className="bg-slate-900/40 backdrop-blur-2xl border border-white/10 p-5 rounded-[2rem] flex flex-col gap-3 pointer-events-auto">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{t('filterByStatus')}</div>
                  {[
                    { c: 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]', l: 'Critical' },
                    { c: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]', l: 'High' },
                    { c: 'bg-yellow-400', l: 'Medium' },
                    { c: 'bg-blue-500', l: 'Low' }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-help">
                      <div className={`w-2.5 h-2.5 rounded-full transition-transform group-hover:scale-125 ${item.c}`} />
                      <span className="text-[11px] text-white/80 font-black tracking-tight group-hover:text-white">{t(item.l)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : displayedIssues.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
              <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900">{t('noIssuesFound')}</h3>
              <p className="text-slate-500 mt-1">{t('noFilterMatches')}</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {displayedIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onStatusChange={(status) => updateIssueStatus(issue.id, status)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Right Side: Sidebar */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sticky top-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-amber-100 p-2.5 rounded-xl border border-amber-200 shadow-inner">
                <Medal className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 leading-tight">{t('topContributors')}</h3>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 font-display">{t('honestReporting')}</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-6 font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
              {t('sidebarDesc')}
            </p>
            <div className="space-y-3">
              {[
                { name: 'Ramesh Singh', points: 1240, reports: 12 },
                { name: 'Anita Devi', points: 980, reports: 8 },
                { name: 'Kamlesh V.', points: 750, reports: 6 }
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors cursor-default">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 font-bold text-sm shadow-sm">
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-sm text-slate-900">{user.name}</div>
                    <div className="text-xs text-slate-500 font-medium">{user.points.toLocaleString(numLocale)} {t('pts')}</div>
                  </div>
                  <Award className={`w-6 h-6 ${i === 0 ? 'text-amber-400' : i === 1 ? 'text-slate-400' : 'text-amber-700'}`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ImpactCard({
  icon, value, label, sublabel, color, iconBg
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  sublabel: string;
  color: string;
  iconBg: string;
}) {
  return (
    <div className={`flex items-center gap-4 p-5 rounded-2xl border ${color}`}>
      <div className={`p-3 rounded-xl ${iconBg} shrink-0`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-900 leading-tight">{value}</div>
        <div className="text-sm font-semibold text-slate-800">{label}</div>
        <div className="text-xs text-slate-500 mt-0.5">{sublabel}</div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, bg, border }: { title: string; value: number; icon: React.ReactNode; bg: string; border: string }) {
  return (
    <div className={`p-4 rounded-xl border ${bg} ${border} flex items-center justify-between`}>
      <div>
        <p className="text-xs font-medium text-slate-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
      <div className="p-2 bg-white/60 rounded-lg shadow-sm">
        {icon}
      </div>
    </div>
  );
}

function IssueCard({ issue, onStatusChange }: { issue: Issue; onStatusChange: (s: Status) => void }) {
  const urgencyStyle = URGENCY_COLORS[issue.urgency];
  const { t, getNumberLocale } = useLanguage();

  const getStatusColor = (s: Status) => {
    switch (s) {
      case 'Pending': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const scoreColor = issue.priorityScore >= 90
    ? 'text-red-700 bg-red-50/50 border-red-100 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
    : issue.priorityScore >= 70
      ? 'text-orange-700 bg-orange-50/50 border-orange-100'
      : issue.priorityScore >= 40
        ? 'text-yellow-700 bg-yellow-50/50 border-yellow-100'
        : 'text-emerald-700 bg-emerald-50/50 border-emerald-100';

  const zoneColor = REGION_ZONE_COLORS[issue.regionZone] ?? 'bg-slate-50 text-slate-600 border-slate-200';

  const daysActive = Math.max(1, Math.floor((Date.now() - issue.reportedAt.getTime()) / (1000 * 60 * 60 * 24)));

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${urgencyStyle.card} shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="p-5 sm:p-6">

        {/* Top Row: ID + urgency + time */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-sm font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
            {issue.id}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider ${urgencyStyle.badge}`}>
            ● {t(issue.urgency)}
          </span>
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {format(issue.reportedAt, 'MMM d, h:mm a')}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-stretch gap-10">

          {/* Left: Main Info */}
          <div className="flex-1 min-w-0 flex flex-col">
            <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight tracking-tight">{t(issue.problem)}</h3>

            {/* Location + Region Zone */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="flex items-center text-base text-slate-700 gap-1.5 font-bold">
                <MapPin className="w-5 h-5 text-slate-400" />
                {t(issue.village)}
                <span className="text-slate-300 font-normal">·</span>
                <span className="text-slate-500 font-semibold">{t(issue.region)}</span>
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${zoneColor}`}>
                {t(issue.regionZone)}
              </span>
            </div>

            {/* People Affected */}
            {issue.peopleAffected != null && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">{issue.peopleAffected.toLocaleString(getNumberLocale())} {t('peopleAffectedText')}</span>
              </div>
            )}

            {/* Details */}
            {issue.details && (
              <p className="text-base text-slate-500 line-clamp-3 border-l-4 border-slate-100 pl-4 my-4 italic font-medium">
                "{t(issue.details)}"
              </p>
            )}

            {/* Suggested Action */}
            {issue.suggestedAction && (
              <div className="flex items-start gap-3 bg-amber-50/50 border border-amber-100 rounded-[1.5rem] px-5 py-4 mt-auto">
                <Lightbulb className="w-6 h-6 text-amber-500 mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[11px] font-black text-amber-600 uppercase tracking-[0.15em] block mb-1">{t('recommendedAction')}</span>
                  <p className="text-base font-bold text-amber-900 leading-relaxed">{t(issue.suggestedAction)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Score + Status */}
          <div className="flex lg:flex-col items-center lg:items-end justify-between lg:justify-start gap-6 lg:shrink-0 lg:w-64">

            {/* Priority Score & Metrics */}
            {issue.priorityScore != null && (
              <div className="w-full group">
                <div className={`relative p-5 rounded-[2rem] border backdrop-blur-md transition-all duration-500 ${scoreColor} overflow-hidden group-hover:shadow-xl group-hover:shadow-current/5 group-hover:-translate-y-1`}>

                  {/* Advanced Pulsing Background for High Priority */}
                  {issue.priorityScore >= 70 && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute -inset-[100%] animate-[spin_8s_linear_infinite] opacity-10 bg-[conic-gradient(from_0deg,transparent,currentColor,transparent)]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-5 relative z-10">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">{t('analytics')}</span>
                      </div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tighter leading-none">{issue.priorityScore}</span>
                        <span className="text-xs font-bold opacity-30">/100</span>
                      </div>
                    </div>

                    {/* Stylized Gauge */}
                    <div className="relative w-14 h-14">
                      <svg className="w-full h-full -rotate-90 filter drop-shadow-[0_0_8px_rgba(0,0,0,0.05)]" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current opacity-[0.08]" strokeWidth="4" />
                        <motion.circle
                          initial={{ strokeDashoffset: 100 }}
                          animate={{ strokeDashoffset: 100 - issue.priorityScore }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          cx="18" cy="18" r="16" fill="none" className="stroke-current" strokeWidth="4"
                          strokeDasharray="100, 100"
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 opacity-30" />
                      </div>
                    </div>
                  </div>

                  {/* Glassmorph Metrics Row */}
                  <div className="grid grid-cols-3 gap-2 mt-2 relative z-10">
                    {[
                      { icon: Users, val: issue.peopleAffected, label: t('peopleAffected'), col: 'text-slate-600' },
                      { icon: Activity, val: issue.reportsCount, label: t('reports'), col: 'text-blue-600' },
                      { icon: Clock, val: daysActive, label: t('days'), col: 'text-orange-600' }
                    ].map((m, idx) => (
                      <div key={idx} className="flex flex-col items-center py-2 px-1 rounded-2xl bg-white/40 border border-white/60 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] backdrop-blur-xl hover:bg-white/60 transition-colors">
                        <m.icon className={`w-3.5 h-3.5 ${m.col} mb-1`} />
                        <span className={`text-[11px] font-black tracking-tight ${m.col}`}>{m.val?.toLocaleString() ?? 0}</span>
                        <span className="text-[7px] font-bold uppercase tracking-widest opacity-40 mt-0.5">{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Premium Status Pill */}
            <div className="w-full mt-auto">
              <div className="flex items-center gap-2 mb-2 px-1">
                <Activity className="w-3 h-3 text-slate-400" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{t('systemStatus')}</span>
              </div>
              <div className="relative group/status">
                <div className={`flex items-center justify-between p-3 rounded-2xl border transition-all duration-300 ${getStatusColor(issue.status)} shadow-sm group-hover/status:shadow-md cursor-pointer relative overflow-hidden`}>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold opacity-60 leading-none mb-1">{t('currentState')}</span>
                    <span className="font-black text-sm tracking-tight">{t(issue.status)}</span>
                  </div>

                  <select
                    value={issue.status}
                    onChange={(e) => onStatusChange(e.target.value as Status)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20"
                  >
                    <option value="Pending">{t('PendingSelect')}</option>
                    <option value="Assigned">{t('AssignedSelect')}</option>
                    <option value="Resolved">{t('ResolvedSelect')}</option>
                  </select>

                  <div className="bg-white/50 p-1.5 rounded-lg border border-white/60 group-hover/status:scale-110 transition-transform">
                    <ChevronDown className="w-4 h-4 opacity-70" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
