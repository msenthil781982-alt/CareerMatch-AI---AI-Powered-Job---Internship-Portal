import { CheckCircle, XCircle, Brain, ChevronRight } from 'lucide-react';

export function MatchScoreBadge({ score, size = 'md' }) {
  const color = score >= 70 ? '#34D399' : score >= 40 ? '#FCD34D' : '#F87171';
  const bgColor = score >= 70 ? 'rgba(16, 185, 129, 0.1)' : score >= 40 ? 'rgba(252, 211, 77, 0.1)' : 'rgba(248, 113, 113, 0.1)';

  if (size === 'lg') {
    return (
      <div className="flex flex-col items-center gap-2">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-xl font-black border-4"
          style={{ color, borderColor: color, background: bgColor }}
        >
          {score}%
        </div>
        <p className="text-xs text-slate-400 font-medium">Match Score</p>
      </div>
    );
  }

  return (
    <span
      className="text-xs font-bold px-2.5 py-1 rounded-full"
      style={{ color, background: bgColor, border: `1px solid ${color}40` }}
    >
      {score}% match
    </span>
  );
}

export function SkillTags({ skills, type = 'neutral', max = 5 }) {
  const styles = {
    neutral: 'skill-chip',
    matched: 'skill-chip skill-chip-matched',
    missing: 'skill-chip skill-chip-missing'
  };

  const displayed = skills?.slice(0, max) || [];
  const remaining = (skills?.length || 0) - max;

  return (
    <div className="flex flex-wrap gap-1.5">
      {displayed.map((skill, i) => (
        <span key={i} className={styles[type]}>
          {type === 'matched' && <CheckCircle size={10} />}
          {type === 'missing' && <XCircle size={10} />}
          {skill}
        </span>
      ))}
      {remaining > 0 && (
        <span className="skill-chip text-slate-500">+{remaining} more</span>
      )}
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    applied: { class: 'badge-applied', label: 'Applied' },
    'under-review': { class: 'badge-review', label: 'Under Review' },
    shortlisted: { class: 'badge-shortlisted', label: 'Shortlisted' },
    interview: { class: 'badge-interview', label: 'Interview' },
    selected: { class: 'badge-selected', label: 'Selected 🎉' },
    rejected: { class: 'badge-rejected', label: 'Rejected' },
    active: { class: 'badge-active', label: 'Active' },
    inactive: { class: 'badge-rejected', label: 'Inactive' },
    closed: { class: 'badge-rejected', label: 'Closed' }
  };

  const s = map[status] || { class: 'badge', label: status };
  return <span className={`badge ${s.class}`}>{s.label}</span>;
}

export function JobTypeBadge({ type }) {
  const map = {
    'full-time': { class: 'badge-fulltime', label: 'Full Time' },
    'internship': { class: 'badge-internship', label: 'Internship' },
    'part-time': { class: 'badge-review', label: 'Part Time' },
    'contract': { class: 'badge-shortlisted', label: 'Contract' },
    'freelance': { class: 'badge-interview', label: 'Freelance' }
  };
  const b = map[type] || { class: 'badge', label: type };
  return <span className={`badge ${b.class}`}>{b.label}</span>;
}

export function StatCard({ title, value, subtitle, icon: Icon, color = 'indigo', trend }) {
  const colorMap = {
    indigo: { bg: 'rgba(99,102,241,0.1)', border: 'rgba(99,102,241,0.2)', text: '#818CF8', icon: 'rgba(99,102,241,0.2)' },
    cyan: { bg: 'rgba(6,182,212,0.1)', border: 'rgba(6,182,212,0.2)', text: '#22D3EE', icon: 'rgba(6,182,212,0.2)' },
    green: { bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.2)', text: '#34D399', icon: 'rgba(16,185,129,0.2)' },
    amber: { bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)', text: '#FCD34D', icon: 'rgba(245,158,11,0.2)' },
    purple: { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.2)', text: '#C084FC', icon: 'rgba(168,85,247,0.2)' },
    red: { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)', text: '#F87171', icon: 'rgba(239,68,68,0.2)' }
  };
  const c = colorMap[color];

  return (
    <div className="glass-card p-6" style={{ background: c.bg, borderColor: c.border }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-1">{title}</p>
          <p className="text-3xl font-black text-white">{value}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: c.icon }}>
            <Icon size={22} style={{ color: c.text }} />
          </div>
        )}
      </div>
    </div>
  );
}

export function LoadingSpinner({ size = 'md' }) {
  const s = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-5 h-5' : 'w-8 h-8';
  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${s} border-4 border-indigo-500 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
}

export function EmptyState({ icon: Icon = Brain, title, message, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-4">
        <Icon size={28} className="text-indigo-400" />
      </div>
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-xs mb-6">{message}</p>
      {action && (
        <button onClick={action} className="btn-primary text-sm">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export function MatchAnalysis({ matchScore, matchedSkills, missingSkills, recommendations, explanation }) {
  return (
    <div className="glass-card p-6 space-y-5">
      <div className="flex items-center gap-3 mb-2">
        <Brain size={20} className="text-indigo-400" />
        <h3 className="text-lg font-bold text-white">AI Match Analysis</h3>
      </div>

      <div className="flex items-center gap-6">
        <MatchScoreBadge score={matchScore} size="lg" />
        <div className="flex-1">
          <div className="h-3 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${matchScore}%`,
                background: matchScore >= 70 ? '#34D399' : matchScore >= 40 ? '#FCD34D' : '#F87171'
              }}
            />
          </div>
          {explanation && <p className="text-slate-400 text-xs mt-2">{explanation}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {matchedSkills?.length > 0 && (
          <div>
            <p className="text-emerald-400 text-sm font-semibold mb-2 flex items-center gap-1.5">
              <CheckCircle size={14} /> Matched Skills ({matchedSkills.length})
            </p>
            <SkillTags skills={matchedSkills} type="matched" max={10} />
          </div>
        )}
        {missingSkills?.length > 0 && (
          <div>
            <p className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-1.5">
              <XCircle size={14} /> Missing Skills ({missingSkills.length})
            </p>
            <SkillTags skills={missingSkills} type="missing" max={10} />
          </div>
        )}
      </div>

      {recommendations?.length > 0 && (
        <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
          <p className="text-indigo-300 text-sm font-semibold mb-2">💡 Recommendations</p>
          <ul className="space-y-1">
            {recommendations.map((r, i) => (
              <li key={i} className="text-slate-400 text-sm flex items-center gap-2">
                <ChevronRight size={12} className="text-indigo-400 flex-shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
