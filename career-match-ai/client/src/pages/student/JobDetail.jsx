import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { jobAPI, applicationAPI, aiAPI, studentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { JobTypeBadge, SkillTags, LoadingSpinner, MatchAnalysis } from '../../components/shared/UIComponents';
import toast from 'react-hot-toast';
import {
  MapPin, Clock, Briefcase, DollarSign, Calendar, Building2,
  ArrowLeft, Send, Bookmark, BookmarkCheck, Brain, CheckCircle, Globe, Users
} from 'lucide-react';

export default function JobDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState(null);
  const [applied, setApplied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [studentProfile, setStudentProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await jobAPI.getJob(id);
        setJob(jobRes.data.job);

        if (user?.role === 'student') {
          const profileRes = await studentAPI.getProfile();
          setStudentProfile(profileRes.data.profile);

          const savedRes = await studentAPI.getSavedJobs();
          setIsSaved(savedRes.data.savedJobs?.some(j => j._id === id || j === id));

          const appsRes = await applicationAPI.getMyApplications();
          setApplied(appsRes.data.applications?.some(a => a.jobId?._id === id));
        }
      } catch (err) {
        toast.error('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const res = await aiAPI.getMatchScore({ jobId: id });
      setMatchResult(res.data);
    } catch (err) {
      toast.error('Analysis failed. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await applicationAPI.apply({ jobId: id, coverLetter });
      setApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted successfully! 🎉');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    if (!user) return toast.error('Please login to save jobs');
    try {
      const res = await studentAPI.toggleSavedJob(id);
      setIsSaved(res.data.saved);
      toast.success(res.data.message);
    } catch { toast.error('Failed to save'); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );

  if (!job) return (
    <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center">
      <p className="text-slate-400">Job not found.</p>
    </div>
  );

  const salary = job.salaryMin && job.salaryMax
    ? job.salaryType === 'stipend'
      ? `₹${(job.salaryMin/1000).toFixed(0)}K – ₹${(job.salaryMax/1000).toFixed(0)}K/month`
      : `₹${(job.salaryMin/100000).toFixed(1)} – ₹${(job.salaryMax/100000).toFixed(1)} LPA`
    : 'Not disclosed';

  const company = job.recruiterProfile;

  return (
    <div className="min-h-screen bg-[#0F0F1A] py-8 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Jobs
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="glass-card p-8">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
                  <Building2 size={28} className="text-indigo-400" />
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-black text-white mb-1">{job.title}</h1>
                  <p className="text-indigo-400 font-semibold text-lg">{company?.companyName || job.companyName}</p>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm"><MapPin size={14} />{job.location}</span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm capitalize"><Clock size={14} />{job.workMode}</span>
                    <span className="flex items-center gap-1.5 text-slate-400 text-sm"><Briefcase size={14} />{job.experience}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <JobTypeBadge type={job.type} />
                <span className="badge badge-active">Active</span>
                <span className="flex items-center gap-1 text-slate-400 text-xs"><Users size={12} />{job.applicationCount} applied</span>
              </div>
            </div>

            {/* Description */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">Job Description</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-4">Key Responsibilities</h2>
                <ul className="space-y-2">
                  {job.responsibilities.map((r, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-300 text-sm">
                      <CheckCircle size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Skills */}
            <div className="glass-card p-6">
              <h2 className="text-lg font-bold text-white mb-4">Required Skills</h2>
              <SkillTags skills={job.requiredSkills} max={20} />
              {job.preferredSkills?.length > 0 && (
                <div className="mt-4">
                  <p className="text-slate-400 text-sm font-medium mb-2">Preferred (Nice to have)</p>
                  <SkillTags skills={job.preferredSkills} max={20} />
                </div>
              )}
            </div>

            {/* AI Match Analysis */}
            {matchResult && (
              <MatchAnalysis {...matchResult} />
            )}

            {/* Apply Form */}
            {showApplyForm && (
              <div className="glass-card p-6">
                <h2 className="text-lg font-bold text-white mb-4">Write a Cover Letter (Optional)</h2>
                <textarea
                  className="input-field resize-none"
                  rows={5}
                  placeholder="Tell the recruiter why you're a great fit for this role..."
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                />
                <div className="flex gap-3 mt-4">
                  <button onClick={handleApply} disabled={applying} className="btn-primary flex items-center gap-2">
                    {applying ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={16} />}
                    Submit Application
                  </button>
                  <button onClick={() => setShowApplyForm(false)} className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Actions */}
            <div className="glass-card p-6 space-y-3">
              {user?.role === 'student' ? (
                <>
                  {applied ? (
                    <div className="flex items-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold">
                      <CheckCircle size={16} /> Application Submitted
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!studentProfile?.resume?.filename) {
                          return toast.error('Please upload your resume first');
                        }
                        setShowApplyForm(!showApplyForm);
                      }}
                      className="btn-primary w-full flex items-center justify-center gap-2 py-3"
                    >
                      <Send size={16} /> Apply Now
                    </button>
                  )}

                  {studentProfile?.skills?.length > 0 && !matchResult && (
                    <button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      className="btn-secondary w-full flex items-center justify-center gap-2 py-3"
                    >
                      {analyzing ? (
                        <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                      ) : <Brain size={16} />}
                      Analyze My Match
                    </button>
                  )}

                  <button onClick={handleSave} className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-sm text-slate-300 transition-all">
                    {isSaved ? <><BookmarkCheck size={16} className="text-indigo-400" /> Saved</> : <><Bookmark size={16} /> Save Job</>}
                  </button>
                </>
              ) : !user ? (
                <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  Login to Apply
                </Link>
              ) : null}
            </div>

            {/* Job Info */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="text-white font-bold text-sm">Job Details</h3>
              {[
                { icon: DollarSign, label: 'Salary', value: salary },
                { icon: Briefcase, label: 'Experience', value: job.experience || 'Fresher' },
                { icon: Clock, label: 'Work Mode', value: job.workMode, cap: true },
                { icon: Calendar, label: 'Deadline', value: job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Open' },
                { icon: MapPin, label: 'Location', value: job.location },
              ].map(({ icon: Icon, label, value, cap }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="text-slate-400" />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{label}</p>
                    <p className={`text-slate-300 text-sm font-medium ${cap ? 'capitalize' : ''}`}>{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Company Info */}
            {company && (
              <div className="glass-card p-6">
                <h3 className="text-white font-bold text-sm mb-3">About {company.companyName}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{company.companyDescription}</p>
                {company.industry && <p className="text-slate-500 text-xs mt-2"><span className="text-slate-400">Industry:</span> {company.industry}</p>}
                {company.companySize && <p className="text-slate-500 text-xs mt-1"><span className="text-slate-400">Size:</span> {company.companySize} employees</p>}
                {company.website && (
                  <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-indigo-400 text-xs mt-3 hover:text-indigo-300">
                    <Globe size={12} /> Visit Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
