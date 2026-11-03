
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { BookmarkCheck, Briefcase, MapPin } from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { studentAPI } from '../../services/api';

export default function SavedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    try {
      const response = await studentAPI.getSavedJobs();
      const data = response.data.jobs || response.data.savedJobs || response.data;
      setJobs(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not load saved jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const removeJob = async (id) => {
    try {
      await studentAPI.toggleSavedJob(id);
      setJobs(current => current.filter(job => (job._id || job.id) !== id));
      toast.success('Job removed from saved list');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not remove job');
    }
  };

  return (
    <DashboardLayout title="Saved Jobs" subtitle="Jobs you have bookmarked">
      {loading ? (
        <p className="text-slate-400">Loading saved jobs...</p>
      ) : jobs.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <BookmarkCheck size={40} className="mx-auto text-indigo-400 mb-4" />
          <h2 className="text-white text-lg font-semibold">No saved jobs yet</h2>
          <p className="text-slate-400 mt-2">Explore jobs and save the ones you like.</p>
          <Link to="/jobs" className="inline-block mt-5 rounded-xl bg-indigo-600 px-5 py-3 text-white">
            Find Jobs
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map(job => {
            const id = job._id || job.id;
            return (
              <div key={id} className="glass rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-white font-semibold text-lg">{job.title || job.job?.title || 'Job'}</h3>
                  <p className="text-indigo-300 mt-1">{job.company || job.companyName || job.job?.company || 'Company'}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-400">
                    <span className="flex items-center gap-1"><Briefcase size={14} /> {job.jobType || job.job?.jobType || 'Not specified'}</span>
                    <span className="flex items-center gap-1"><MapPin size={14} /> {job.location || job.job?.location || 'Not specified'}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link to={`/jobs/${job.job?._id || id}`} className="rounded-lg bg-indigo-600 px-4 py-2 text-white text-sm">
                    View Job
                  </Link>
                  <button onClick={() => removeJob(id)} className="rounded-lg border border-red-500/30 px-4 py-2 text-red-400 text-sm">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
