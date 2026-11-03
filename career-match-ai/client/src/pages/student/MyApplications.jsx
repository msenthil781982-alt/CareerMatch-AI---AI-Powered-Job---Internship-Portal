import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { applicationAPI } from '../../services/api';
import { StatusBadge, LoadingSpinner, EmptyState } from '../../components/shared/UIComponents';
import { Link } from 'react-router-dom';
import { Briefcase, Calendar, Building2, TrendingUp, CheckCircle } from 'lucide-react';

const STATUS_STEPS = [
  { key: 'applied', label: 'Applied' },
  { key: 'under-review', label: 'Under Review' },
  { key: 'shortlisted', label: 'Shortlisted' },
  { key: 'interview', label: 'Interview' },
  { key: 'selected', label: 'Selected' }
];

function ApplicationTimeline({ application }) {
  const [expanded, setExpanded] = useState(false);
  const job = application.jobId;
  const company = job?.recruiterProfile?.companyName || job?.companyName || 'Company';

  const currentIdx = STATUS_STEPS.findIndex(s => s.key === application.status);
  const isRejected = application.status === 'rejected';

  return (
    <div className="glass-card overflow-hidden">
      <div
        className="p-5 flex items-center gap-4 cursor-pointer hover:bg-white/2 transition-all"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
          <Building2 size={20} className="text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">{job?.title}</p>
          <p className="text-slate-400 text-sm">{company}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <p className="text-slate-400 text-xs">{new Date(application.appliedAt).toLocaleDateString('en-IN')}</p>
            <p className="text-indigo-400 text-xs font-semibold">{application.matchScore}% match</p>
          </div>
          <StatusBadge status={application.status} />
        </div>
      </div>

      {expanded && (
        <div className="px-5 pb-5 border-t border-white/5 pt-5">
          {/* Timeline */}
          {!isRejected ? (
            <div className="flex items-center gap-0 mb-6">
              {STATUS_STEPS.map((step, i) => {
                const isComplete = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={step.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${
                        isComplete ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-600 text-slate-500'
                      } ${isCurrent ? 'ring-4 ring-indigo-500/20' : ''}`}>
                        {isComplete ? <CheckCircle size={14} /> : i + 1}
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{step.label}</span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-1 mb-4 transition-all ${i < currentIdx ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mb-6 flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-400 text-sm font-semibold">Application Rejected</p>
              {application.recruiterNotes && (
                <p className="text-slate-400 text-xs">"{application.recruiterNotes}"</p>
              )}
            </div>
          )}

          {/* Match Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-3xl font-black text-indigo-400">{application.matchScore}%</p>
              <p className="text-slate-500 text-xs mt-1">Match Score</p>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-emerald-400 text-xs font-semibold mb-2">✓ Matched</p>
              <div className="flex flex-wrap gap-1">
                {application.matchedSkills?.slice(0, 4).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s}</span>
                ))}
              </div>
            </div>
            <div className="glass rounded-xl p-4">
              <p className="text-red-400 text-xs font-semibold mb-2">✗ Missing</p>
              <div className="flex flex-wrap gap-1">
                {application.missingSkills?.slice(0, 4).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Link to={`/jobs/${job?._id}`} className="text-indigo-400 hover:text-indigo-300 text-sm">View Job Details →</Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    applicationAPI.getMyApplications()
      .then(res => setApplications(res.data.applications || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const counts = applications.reduce((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout title="My Applications" subtitle="Track all your job applications.">
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[{ k: 'all', l: 'All' }, { k: 'applied', l: 'Applied' }, { k: 'shortlisted', l: 'Shortlisted' }, { k: 'interview', l: 'Interview' }, { k: 'selected', l: 'Selected' }, { k: 'rejected', l: 'Rejected' }].map(({ k, l }) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`text-sm px-4 py-2 rounded-xl font-medium transition-all ${
              filter === k ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
            }`}
          >
            {l} {k !== 'all' && counts[k] ? `(${counts[k]})` : ''}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? (
        <EmptyState icon={Briefcase} title="No Applications Found" message="Start applying to jobs to track them here." action={() => window.location.href = '/jobs'} actionLabel="Browse Jobs" />
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <ApplicationTimeline key={app._id} application={app} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
