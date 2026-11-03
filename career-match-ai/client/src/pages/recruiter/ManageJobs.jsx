
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, Users, BriefcaseBusiness } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { recruiterAPI, jobAPI } from '../../services/api';

export default function ManageJobs() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const loadJobs = async () => {
        try {
            const res = await recruiterAPI.getMyJobs();
            const data = res.data.jobs || res.data;
            setJobs(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to load jobs.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJobs();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        setDeletingId(id);

        try {
            await jobAPI.deleteJob(id);
            setJobs((current) => current.filter((job) => job._id !== id && job.id !== id));
            toast.success('Job deleted successfully.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to delete job.');
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <DashboardLayout
            title="Manage Jobs"
            subtitle="View and manage your published job opportunities."
        >
            <div className="mb-6 flex justify-end">
                <button
                    onClick={() => navigate('/recruiter/post-job')}
                    className="rounded-lg bg-violet-600 px-5 py-3 font-semibold text-white hover:bg-violet-700"
                >
                    + Post New Job
                </button>
            </div>

            {loading ? (
                <p className="text-slate-400">Loading jobs...</p>
            ) : jobs.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                    <BriefcaseBusiness className="mx-auto mb-3 text-slate-500" size={36} />
                    <p className="text-lg font-semibold text-white">No jobs posted yet</p>
                    <p className="mt-2 text-sm text-slate-400">
                        Create your first job opportunity.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.map((job) => {
                        const id = job._id || job.id;

                        return (
                            <div
                                key={id}
                                className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold text-white">
                                        {job.title}
                                    </h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {job.company} {job.location ? `• ${job.location}` : ''}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                                        <span>{job.jobType || job.type || 'Job'}</span>
                                        <span>{job.workMode || ''}</span>
                                        <span>{job.status || 'Active'}</span>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={() => navigate(`/recruiter/post-job/${id}`)}
                                        className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10"
                                    >
                                        <Pencil size={15} /> Edit
                                    </button>

                                    <button
                                        onClick={() => navigate(`/recruiter/jobs/${id}/applicants`)}
                                        className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white hover:bg-white/10"
                                    >
                                        <Users size={15} /> Applicants
                                    </button>

                                    <button
                                        onClick={() => handleDelete(id)}
                                        disabled={deletingId === id}
                                        className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                                    >
                                        <Trash2 size={15} />
                                        {deletingId === id ? 'Deleting...' : 'Delete'}
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
