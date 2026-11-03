
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FileText, User, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { recruiterAPI, applicationAPI } from '../../services/api';

export default function ViewApplicants() {
    const { jobId } = useParams();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const loadApplicants = async () => {
            try {
                const res = await recruiterAPI.getJobApplicants(jobId);
                const data = res.data.applications || res.data.applicants || res.data;
                setApplicants(Array.isArray(data) ? data : []);
            } catch (error) {
                toast.error(
                    error.response?.data?.message || 'Unable to load applicants.'
                );
            } finally {
                setLoading(false);
            }
        };

        loadApplicants();
    }, [jobId]);

    const handleStatusChange = async (applicationId, status) => {
        setUpdatingId(applicationId);

        try {
            await applicationAPI.updateStatus(applicationId, { status });

            setApplicants((current) =>
                current.map((item) =>
                    (item._id || item.id) === applicationId
                        ? { ...item, status }
                        : item
                )
            );

            toast.success('Application status updated.');
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Unable to update status.'
            );
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <DashboardLayout
            title="Job Applicants"
            subtitle="Review applications and update candidate status."
        >
            {loading ? (
                <p className="text-slate-400">Loading applicants...</p>
            ) : applicants.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                    <User className="mx-auto mb-3 text-slate-500" size={36} />
                    <p className="text-lg font-semibold text-white">
                        No applicants found
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                        Applications for this job will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {applicants.map((application) => {
                        const id = application._id || application.id;
                        const student = application.student || application.applicant || {};

                        return (
                            <div
                                key={id}
                                className="rounded-xl border border-white/10 bg-white/5 p-5"
                            >
                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                                    <div>
                                        <h2 className="flex items-center gap-2 text-lg font-semibold text-white">
                                            <User size={18} className="text-violet-400" />
                                            {student.name || application.name || 'Candidate'}
                                        </h2>

                                        <p className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                                            <Mail size={15} />
                                            {student.email || application.email || 'Email unavailable'}
                                        </p>

                                        <p className="mt-2 text-sm text-slate-400">
                                            Job: {application.job?.title || application.jobTitle || 'Job application'}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-500">
                                            Current status: {application.status || 'Pending'}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        {application.resume && (
                                            <a
                                                href={application.resume}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white hover:bg-white/10"
                                            >
                                                <FileText size={15} />
                                                Resume
                                            </a>
                                        )}

                                        <select
                                            value={application.status || 'Pending'}
                                            disabled={updatingId === id}
                                            onChange={(e) => handleStatusChange(id, e.target.value)}
                                            className="rounded-lg border border-white/10 bg-[#171725] px-3 py-2 text-sm text-white"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Reviewed">Reviewed</option>
                                            <option value="Shortlisted">Shortlisted</option>
                                            <option value="Rejected">Rejected</option>
                                            <option value="Accepted">Accepted</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}
