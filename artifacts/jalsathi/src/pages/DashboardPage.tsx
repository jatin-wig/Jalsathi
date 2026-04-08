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
} from 'lucide-react';
import { UrgencyLevel, Status, Issue } from '../types';

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

  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [sortByPriority, setSortByPriority] = useState(true);

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
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Authority Dashboard</h2>
        <p className="text-slate-500 mt-1">Monitor and manage rural water complaints across Rajasthan, Haryana, and Delhi NCR.</p>
      </div>

      {/* Impact Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <ImpactCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          value={`${stats.peopleAffected.toLocaleString()}+`}
          label="People Affected"
          sublabel="Across active issues"
          color="bg-blue-50 border-blue-200"
          iconBg="bg-blue-100"
        />
        <ImpactCard
          icon={<Siren className="w-6 h-6 text-red-600" />}
          value={stats.criticalVillages.toString()}
          label="Critical Villages"
          sublabel="Need immediate action"
          color="bg-red-50 border-red-200"
          iconBg="bg-red-100"
        />
        <ImpactCard
          icon={<Activity className="w-6 h-6 text-orange-600" />}
          value={stats.activeIssues.toString()}
          label="Total Active Issues"
          sublabel="Pending + Assigned"
          color="bg-orange-50 border-orange-200"
          iconBg="bg-orange-100"
        />
      </div>

      {/* Status Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard title="Total Reports" value={stats.total} icon={<MapPin className="w-5 h-5 text-blue-500" />} bg="bg-blue-50" border="border-blue-100" />
        <StatCard title="Pending" value={stats.pending} icon={<Clock className="w-5 h-5 text-amber-500" />} bg="bg-amber-50" border="border-amber-100" />
        <StatCard title="Assigned" value={stats.assigned} icon={<AlertCircle className="w-5 h-5 text-indigo-500" />} bg="bg-indigo-50" border="border-indigo-100" />
        <StatCard title="Resolved" value={stats.resolved} icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} bg="bg-emerald-50" border="border-emerald-100" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filter by Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | 'All')}
            className="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500/20 outline-none flex-1 sm:flex-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Assigned">Assigned</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>

        <button
          onClick={() => setSortByPriority(!sortByPriority)}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all w-full sm:w-auto ${
            sortByPriority
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <ArrowDownUp className="w-4 h-4" />
          {sortByPriority ? 'Priority: Critical First ✓' : 'Sort by Priority'}
        </button>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {displayedIssues.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No issues found</h3>
            <p className="text-slate-500 mt-1">No reports match your current filters.</p>
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

  const getStatusColor = (s: Status) => {
    switch (s) {
      case 'Pending': return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Resolved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const scoreColor = issue.priorityScore >= 90
    ? 'text-red-700 bg-red-50 border-red-200'
    : issue.priorityScore >= 70
    ? 'text-orange-700 bg-orange-50 border-orange-200'
    : issue.priorityScore >= 40
    ? 'text-yellow-700 bg-yellow-50 border-yellow-200'
    : 'text-emerald-700 bg-emerald-50 border-emerald-200';

  const zoneColor = REGION_ZONE_COLORS[issue.regionZone] ?? 'bg-slate-50 text-slate-600 border-slate-200';

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
            ● {issue.urgency}
          </span>
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            {format(issue.reportedAt, 'MMM d, h:mm a')}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-5">

          {/* Left: Main Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 mb-1">{issue.problem}</h3>

            {/* Location + Region Zone */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="flex items-center text-sm text-slate-700 gap-1 font-semibold">
                <MapPin className="w-4 h-4 text-slate-400" />
                {issue.village}
                <span className="text-slate-400 font-normal">·</span>
                <span className="text-slate-600 font-medium">{issue.region}</span>
              </span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${zoneColor}`}>
                {issue.regionZone}
              </span>
            </div>

            {/* People Affected */}
            {issue.peopleAffected != null && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                <Users className="w-3.5 h-3.5" />
                <span className="font-medium">{issue.peopleAffected.toLocaleString()} people affected</span>
              </div>
            )}

            {/* Details */}
            {issue.details && (
              <p className="text-sm text-slate-500 line-clamp-2 border-l-2 border-slate-200 pl-3 mb-3">
                "{issue.details}"
              </p>
            )}

            {/* Suggested Action */}
            {issue.suggestedAction && (
              <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                <Lightbulb className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-amber-800 uppercase tracking-wide">Suggested Action</span>
                  <p className="text-sm font-semibold text-amber-900 mt-0.5">{issue.suggestedAction}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Score + Status */}
          <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-3 lg:shrink-0 lg:w-44">

            {/* Priority Score */}
            {issue.priorityScore != null && (
              <div className={`flex flex-col items-center rounded-xl border px-4 py-3 w-full lg:w-auto ${scoreColor}`}>
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold uppercase tracking-wide">Priority Score</span>
                </div>
                <div className="text-2xl font-extrabold leading-tight">{issue.priorityScore}<span className="text-sm font-medium opacity-60">/100</span></div>
                <div className="w-full h-1.5 bg-black/10 rounded-full mt-2">
                  <div
                    className={`h-full rounded-full ${urgencyStyle.bar}`}
                    style={{ width: `${issue.priorityScore}%` }}
                  />
                </div>
              </div>
            )}

            {/* Status Selector */}
            <div className="w-full lg:w-auto">
              <div className="text-xs font-semibold text-slate-400 mb-1.5 hidden lg:block">Update Status</div>
              <div className="relative w-full">
                <select
                  value={issue.status}
                  onChange={(e) => onStatusChange(e.target.value as Status)}
                  className={`w-full appearance-none font-semibold text-sm rounded-xl px-4 py-2.5 border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors shadow-sm ${getStatusColor(issue.status)}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
