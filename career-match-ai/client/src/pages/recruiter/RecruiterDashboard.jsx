
import { useEffect, useState } from 'react';
import { BriefcaseBusiness, Users, FileText, TrendingUp } from 'lucide-react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { recruiterAPI } from '../../services/api';

export default function RecruiterDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        recruiterAPI.getDashboard()
            .then((res) => {
                setStats(res.data.stats || res.data.dashboard || res.data);
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Unable to load dashboard data.');
            })
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        {
            title: 'Total Jobs',
            value: stats.totalJobs ?? stats.jobsCount ?? 0,
            icon: BriefcaseBusiness
        },
        {
            title: 'Total Applicants',
            value: stats.totalApplicants ?? stats.applicantsCount ?? 0,
            icon: Users
        },
        {
            title: 'Active Jobs',
            value: stats.activeJobs ?? 0,
            icon: TrendingUp
        },
        {
            title: 'Total Applications',
            value: stats.totalApplications ?? stats.applicationsCount ?? 0,
            icon: FileText
        }
    ];

    return (
        <DashboardLayout
            title="Recruiter Dashboard"
            subtitle="Manage your jobs and track applicants."
        >
            {loading ? (
                <p className="text-slate-400">Loading dashboard...</p>
            ) : (
                <>
                    {error && (
                        <p className="mb-5 rounded-lg bg-red-500/10 p-4 text-red-400">
                            {error}
                        </p>
                    )}

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map((card) => {
                            const Icon = card.icon;

                            return (
                                <div
                                    key={card.title}
                                    className="rounded-xl border border-white/10 bg-white/5 p-5"
                                >
                                    <div className="mb-4 flex items-center justify-between">
                                        <p className="text-sm text-slate-400">{card.title}</p>
                                        <Icon className="text-violet-400" size={22} />
                                    </div>

                                    <h2 className="text-3xl font-bold text-white">
                                        {card.value}
                                    </h2>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}
