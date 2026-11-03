import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { studentAPI } from '../../services/api';
import { LoadingSpinner, EmptyState, MatchScoreBadge } from '../../components/shared/UIComponents';
import { Link } from 'react-router-dom';
import { Brain, Briefcase, CheckCircle, XCircle, ArrowRight, TrendingUp } from 'lucide-react';
import { JobTypeBadge } from '../../components/shared/UIComponents';

export default function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentAPI.getRecommendations()
      .then(res => setRecs(res.data.recommendations || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="AI Recommendations" subtitle="Jobs matched to your skills, sorted by highest match score.">
      {loading ? <LoadingSpinner /> : recs.length === 0 ? (
        <EmptyState
          icon={Brain}
          title="No Recommendations Yet"
          message="Add skills to your profile to get personalized job matches."
          action={() => window.location.href = '/student/profile'}
          actionLabel="Add Skills"
        />
      ) : (
        <>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
            <Brain size={18} className="text-indigo-400" />
            <p className="text-indigo-300 text-sm">
              Showing <strong>{recs.length}</strong> jobs ranked by your AI match score. Scores are based on skill overlap.
            </p>
          </div>

          <div className="space-y-4">
            {recs.map(({ job, matchScore, matchedSkills, missingSkills }, i) => (
              <div key={job._id} className="glass-card p-5 flex items-start gap-5">
                {/* Rank */}
                <div className="text-center flex-shrink-0">
                  <div className="text-slate-500 text-xs font-bold mb-1">#{i + 1}</div>
                  <div
                    className="w-16 h-16 rounded-full border-3 flex items-center justify-center text-lg font-black"
                    style={{
                      border: `3px solid ${matchScore >= 70 ? '#34D399' : matchScore >= 40 ? '#FCD34D' : '#F87171'}`,
                      color: matchScore >= 70 ? '#34D399' : matchScore >= 40 ? '#FCD34D' : '#F87171',
                      background: matchScore >= 70 ? 'rgba(16,185,129,0.1)' : matchScore >= 40 ? 'rgba(252,211,77,0.1)' : 'rgba(248,113,113,0.1)'
                    }}
                  >
                    {matchScore}%
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-white font-bold text-lg">{job.title}</h3>
                      <p className="text-indigo-400 font-medium">{job.recruiterProfile?.companyName || job.companyName}</p>
                    </div>
                    <JobTypeBadge type={job.type} />
                  </div>

                  {/* Skills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {matchedSkills?.length > 0 && (
                      <div>
                        <p className="text-emerald-400 text-xs font-semibold mb-1.5 flex items-center gap-1"><CheckCircle size={11} /> Matched ({matchedSkills.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {matchedSkills.slice(0, 5).map(s => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {missingSkills?.length > 0 && (
                      <div>
                        <p className="text-red-400 text-xs font-semibold mb-1.5 flex items-center gap-1"><XCircle size={11} /> Missing ({missingSkills.length})</p>
                        <div className="flex flex-wrap gap-1">
                          {missingSkills.slice(0, 5).map(s => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-white/5">
                    <Link
                      to={`/jobs/${job._id}`}
                      className="btn-primary text-sm py-2 px-5 flex items-center gap-1.5"
                    >
                      Apply Now <ArrowRight size={14} />
                    </Link>
                    <Link to={`/jobs/${job._id}`} className="text-slate-400 hover:text-white text-sm transition-colors">
                      View Details
                    </Link>
                    <span className="text-slate-500 text-xs ml-auto">{job.location} · {job.workMode}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
