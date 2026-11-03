
import { useEffect, useState } from 'react';
import { Users, BriefcaseBusiness, FileText, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAPI.getStats()
            .then((res) => {
                setStats(res.data.stats || res.data);
            })
            .catch((error) => {
                toast.error(error.response?.data?.message || 'Unable to load admin statistics.');
            })
            .finally(() => setLoading(false));
    }, []);

    const cards = [
        { title: 'Total Users', value: stats.totalUsers ?? stats.users ?? 0, icon: Users },
        { title: 'Total Jobs', value: stats.totalJobs ?? stats.jobs ?? 0, icon: BriefcaseBusiness },
        { title: 'Applications', value: stats.totalApplications ?? stats.applications ?? 0, icon: FileText },
        { title: 'Active Jobs', value: stats.activeJobs ?? 0, icon: TrendingUp }
    ];

    return (
        <DashboardLayout
            title="Admin Dashboard"
            subtitle="Monitor and manage the CareerMatch AI platform."
        >
            {loading ? (
                <p className="text-slate-400">Loading statistics...</p>
            ) : (
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
                                    <Icon size={22} className="text-violet-400" />
                                </div>
                                <h2 className="text-3xl font-bold text-white">{card.value}</h2>
                            </div>
                        );
                    })}
                </div>
            )}
        </DashboardLayout>
    );
}
