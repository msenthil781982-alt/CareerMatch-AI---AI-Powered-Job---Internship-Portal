import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { jobAPI, studentAPI, aiAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import JobCard from '../../components/shared/JobCard';
import { LoadingSpinner, EmptyState } from '../../components/shared/UIComponents';
import { Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight, Briefcase, X } from 'lucide-react';
import toast from 'react-hot-toast';

const LOCATIONS = ['Remote', 'Bangalore', 'Hyderabad', 'Mumbai', 'Delhi', 'Pune', 'Chennai'];
const SKILLS = ['React', 'Node.js', 'Python', 'Java', 'MongoDB', 'SQL', 'Machine Learning', 'AWS', 'Docker'];

export default function JobSearch() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [savedJobs, setSavedJobs] = useState([]);
  const [matchScores, setMatchScores] = useState({});
  const [studentSkills, setStudentSkills] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    type: searchParams.get('type') || '',
    location: '',
    workMode: '',
    sortBy: 'newest'
  });

  useEffect(() => {
    if (user?.role === 'student') {
      studentAPI.getProfile().then(res => {
        setStudentSkills(res.data.profile?.skills || []);
      }).catch(() => {});
      studentAPI.getSavedJobs().then(res => {
        setSavedJobs(res.data.savedJobs?.map(j => j._id) || []);
      }).catch(() => {});
    }
  }, [user]);

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      Object.keys(params).forEach(k => !params[k] && delete params[k]);
      const res = await jobAPI.getJobs(params);
      const fetchedJobs = res.data.jobs || [];
      setJobs(fetchedJobs);
      setTotal(res.data.total || 0);
      setPages(res.data.pages || 1);
      setCurrentPage(page);

      // Calculate match scores for student
      if (studentSkills.length > 0 && fetchedJobs.length > 0) {
        const scores = {};
        await Promise.all(fetchedJobs.map(async job => {
          try {
            const matchRes = await aiAPI.getMatchScore({
              studentSkills,
              requiredSkills: job.requiredSkills
            });
            scores[job._id] = matchRes.data.matchScore;
          } catch {
            const lower = studentSkills.map(s => s.toLowerCase());
            const matched = job.requiredSkills.filter(s => lower.includes(s.toLowerCase()));
            scores[job._id] = job.requiredSkills.length ? Math.round(matched.length / job.requiredSkills.length * 100) : 0;
          }
        }));
        setMatchScores(scores);
      }
    } catch (err) {
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  }, [filters, studentSkills]);

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  const handleSave = async (jobId) => {
    if (!user) return toast.error('Please login to save jobs');
    try {
      const res = await studentAPI.toggleSavedJob(jobId);
      setSavedJobs(prev => res.data.saved ? [...prev, jobId] : prev.filter(id => id !== jobId));
      toast.success(res.data.message);
    } catch { toast.error('Failed to save job'); }
  };

  const setFilter = (k, v) => setFilters(p => ({ ...p, [k]: v }));

  const activeFilters = [
    filters.type && { key: 'type', label: filters.type === 'full-time' ? 'Full Time' : 'Internship', value: filters.type },
    filters.location && { key: 'location', label: filters.location, value: filters.location },
    filters.workMode && { key: 'workMode', label: filters.workMode, value: filters.workMode },
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0F0F1A]">
      {/* Top Bar */}
      <div className="sticky top-0 z-40 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="input-field pl-10 py-2.5"
                placeholder="Search jobs, skills, companies..."
                value={filters.search}
                onChange={e => setFilter('search', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && fetchJobs(1)}
              />
            </div>
            <button
              onClick={() => fetchJobs(1)}
              className="btn-primary py-2.5 px-6 text-sm"
            >
              Search
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-secondary py-2.5 px-4 text-sm flex items-center gap-2 ${showFilters ? 'border-indigo-500' : ''}`}
            >
              <SlidersHorizontal size={15} />
              <span className="hidden sm:inline">Filters</span>
              {activeFilters.length > 0 && (
                <span className="bg-indigo-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{activeFilters.length}</span>
              )}
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {[
              { label: 'All Jobs', value: '', key: 'type' },
              { label: 'Full Time', value: 'full-time', key: 'type' },
              { label: 'Internships', value: 'internship', key: 'type' }
            ].map(pill => (
              <button
                key={pill.value}
                onClick={() => setFilter('type', pill.value)}
                className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all ${
                  filters.type === pill.value
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {pill.label}
              </button>
            ))}

            {/* Active filter tags */}
            {activeFilters.filter(f => f.key !== 'type').map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key, '')}
                className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1"
              >
                {f.label} <X size={10} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 flex gap-6">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="w-64 flex-shrink-0">
            <div className="glass-card p-5 space-y-6 sticky top-28">
              <h3 className="text-white font-bold flex items-center gap-2">
                <Filter size={16} /> Filters
              </h3>

              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Location</p>
                <div className="space-y-2">
                  {LOCATIONS.map(loc => (
                    <label key={loc} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="location"
                        checked={filters.location === loc}
                        onChange={() => setFilter('location', filters.location === loc ? '' : loc)}
                        className="accent-indigo-500"
                      />
                      <span className="text-slate-300 text-sm group-hover:text-white transition-colors">{loc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Work Mode</p>
                {['remote', 'on-site', 'hybrid'].map(mode => (
                  <label key={mode} className="flex items-center gap-2 cursor-pointer group mb-2">
                    <input type="radio" name="workMode" checked={filters.workMode === mode} onChange={() => setFilter('workMode', filters.workMode === mode ? '' : mode)} className="accent-indigo-500" />
                    <span className="text-slate-300 text-sm capitalize">{mode}</span>
                  </label>
                ))}
              </div>

              <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3">Sort By</p>
                {[{ v: 'newest', l: 'Newest First' }, { v: 'salary', l: 'Highest Salary' }, { v: 'deadline', l: 'Deadline' }].map(s => (
                  <label key={s.v} className="flex items-center gap-2 cursor-pointer group mb-2">
                    <input type="radio" name="sort" checked={filters.sortBy === s.v} onChange={() => setFilter('sortBy', s.v)} className="accent-indigo-500" />
                    <span className="text-slate-300 text-sm">{s.l}</span>
                  </label>
                ))}
              </div>

              <button
                onClick={() => { setFilters({ search: '', type: '', location: '', workMode: '', sortBy: 'newest' }); }}
                className="w-full py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-all"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-5">
            <p className="text-slate-400 text-sm">
              <span className="text-white font-bold">{total}</span> jobs found
            </p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : jobs.length === 0 ? (
            <EmptyState icon={Briefcase} title="No Jobs Found" message="Try adjusting your filters or search terms." />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {jobs.map(job => (
                  <JobCard
                    key={job._id}
                    job={job}
                    matchScore={user?.role === 'student' ? matchScores[job._id] : undefined}
                    isSaved={savedJobs.includes(job._id)}
                    onSave={user?.role === 'student' ? handleSave : undefined}
                  />
                ))}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  <button
                    onClick={() => fetchJobs(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-all"
                  >
                    <ChevronLeft size={18} className="text-white" />
                  </button>
                  {[...Array(Math.min(5, pages))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => fetchJobs(page)}
                        className={`w-9 h-9 rounded-lg text-sm font-semibold transition-all ${
                          currentPage === page ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => fetchJobs(currentPage + 1)}
                    disabled={currentPage === pages}
                    className="p-2 rounded-lg bg-white/5 disabled:opacity-30 hover:bg-white/10 transition-all"
                  >
                    <ChevronRight size={18} className="text-white" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
