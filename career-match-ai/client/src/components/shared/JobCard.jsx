import { Link } from 'react-router-dom';
import { MapPin, Clock, Briefcase, DollarSign, Calendar, Bookmark, BookmarkCheck, Building2 } from 'lucide-react';
import { JobTypeBadge, MatchScoreBadge, SkillTags } from './UIComponents';

export default function JobCard({ job, matchScore, isSaved, onSave, showMatch = true }) {
  const salary = job.salaryMin && job.salaryMax
    ? job.salaryType === 'stipend'
      ? `₹${(job.salaryMin / 1000).toFixed(0)}K–${(job.salaryMax / 1000).toFixed(0)}K/month`
      : `₹${(job.salaryMin / 100000).toFixed(1)}–${(job.salaryMax / 100000).toFixed(1)} LPA`
    : null;

  const deadline = job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : null;
  const isUrgent = job.deadline && new Date(job.deadline) - new Date() < 7 * 24 * 60 * 60 * 1000;
  const companyName = job.recruiterProfile?.companyName || job.companyName || 'Company';

  return (
    <div className="glass-card p-5 flex flex-col gap-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Building2 size={20} className="text-indigo-400" />
          </div>
          <div>
            <Link to={`/jobs/${job._id}`} className="text-white font-semibold hover:text-indigo-300 transition-colors line-clamp-1">
              {job.title}
            </Link>
            <p className="text-slate-400 text-sm">{companyName}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {showMatch && matchScore !== undefined && matchScore !== null && (
            <MatchScoreBadge score={matchScore} />
          )}
          {onSave && (
            <button
              onClick={() => onSave(job._id)}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck size={16} className="text-indigo-400" />
              ) : (
                <Bookmark size={16} className="text-slate-400 hover:text-indigo-400" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1"><MapPin size={12} className="text-slate-500" />{job.location}</span>
        <span className="flex items-center gap-1"><Briefcase size={12} className="text-slate-500" />{job.experience || 'Fresher'}</span>
        {salary && <span className="flex items-center gap-1"><DollarSign size={12} className="text-slate-500" />{salary}</span>}
        <span className="flex items-center gap-1">
          <Clock size={12} className="text-slate-500" />
          {job.workMode}
        </span>
      </div>

      {/* Skills */}
      <SkillTags skills={job.requiredSkills} max={4} />

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-2">
          <JobTypeBadge type={job.type} />
          {isUrgent && deadline && (
            <span className="badge badge-rejected text-xs">
              <Calendar size={10} />
              Urgent: {deadline}
            </span>
          )}
        </div>
        <Link
          to={`/jobs/${job._id}`}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          View Details →
        </Link>
      </div>
    </div>
  );
}
