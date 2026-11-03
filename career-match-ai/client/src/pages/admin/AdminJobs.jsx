
import { useEffect, useState } from 'react';
import { Search, BriefcaseBusiness, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { adminAPI, jobAPI } from '../../services/api';

export default function AdminJobs() {
    const [jobs, setJobs] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);

    const loadJobs = async () => {
        try {
            const res = await adminAPI.getJobs();
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

    const deleteJob = async (id) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        setDeletingId(id);

        try {
            await jobAPI.deleteJob(id);
            setJobs((current) =>
                current.filter((job) => (job._id || job.id) !== id)
            );
            toast.success('Job deleted successfully.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to delete job.');
        } finally {
            setDeletingId(null);
        }
    };

    const filteredJobs = jobs.filter((job) =>
        `${job.title || ''} ${job.company || ''} ${job.location || ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <DashboardLayout
            title="Manage Jobs"
            subtitle="Monitor and manage all job postings."
        >
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by job title, company or location..."
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                />
            </div>

            {loading ? (
                <p className="text-slate-400">Loading jobs...</p>
            ) : filteredJobs.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                    <BriefcaseBusiness className="mx-auto mb-3 text-slate-500" size={36} />
                    <p className="text-white">No jobs found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredJobs.map((job) => {
                        const id = job._id || job.id;

                        return (
                            <div
                                key={id}
                                className="flex flex-col justify-between gap-4 rounded-xl border border-white/10 bg-white/5 p-5 md:flex-row md:items-center"
                            >
                                <div>
                                    <h2 className="font-semibold text-white">{job.title}</h2>
                                    <p className="mt-1 text-sm text-slate-400">
                                        {job.company || 'Company not specified'}
                                        {job.location ? ` • ${job.location}` : ''}
                                    </p>
                                    <p className="mt-2 text-xs text-slate-500">
                                        Status: {job.status || 'Active'}
                                    </p>
                                </div>

                                <button
                                    onClick={() => deleteJob(id)}
                                    disabled={deletingId === id}
                                    className="flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                                >
                                    <Trash2 size={15} />
                                    {deletingId === id ? 'Deleting...' : 'Delete Job'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}
