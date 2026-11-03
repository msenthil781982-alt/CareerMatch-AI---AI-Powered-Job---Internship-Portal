import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { studentAPI, applicationAPI } from '../../services/api';
import { StatCard, LoadingSpinner, StatusBadge, EmptyState } from '../../components/shared/UIComponents';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Briefcase, FileText, BookmarkCheck, Brain, User, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, appsRes] = await Promise.all([
          studentAPI.getProfile(),
          applicationAPI.getMyApplications()
        ]);
        setProfile(profileRes.data.profile);
        setApplications(appsRes.data.applications || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <DashboardLayout><LoadingSpinner size="lg" /></DashboardLayout>;

  const profileComplete = profile?.profileComplete;
  const hasResume = !!profile?.resume?.filename;
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <DashboardLayout title={`Good day, ${user?.name?.split(' ')[0]}! 👋`} subtitle="Here's an overview of your career journey.">
      {/* Profile Alerts */}
      <div className="space-y-3 mb-8">
        {!profileComplete && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
            <AlertCircle size={18} className="text-amber-400 flex-shrink-0" />
            <p className="text-amber-300 text-sm flex-1">Complete your profile to get better job matches.</p>
            <Link to="/student/profile" className="text-xs font-semibold text-amber-300 hover:text-amber-200 whitespace-nowrap">
              Complete Now →
            </Link>
          </div>
        )}
        {!hasResume && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
            <FileText size={18} className="text-indigo-400 flex-shrink-0" />
            <p className="text-indigo-300 text-sm flex-1">Upload your resume to start applying to jobs.</p>
            <Link to="/student/profile" className="text-xs font-semibold text-indigo-300 hover:text-indigo-200 whitespace-nowrap">
              Upload Resume →
            </Link>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Applications" value={applications.length} icon={FileText} color="indigo" />
        <StatCard title="Shortlisted" value={statusCounts['shortlisted'] || 0} icon={CheckCircle} color="cyan" />
        <StatCard title="Interviews" value={statusCounts['interview'] || 0} icon={TrendingUp} color="amber" />
        <StatCard title="Saved Jobs" value={profile?.savedJobs?.length || 0} icon={BookmarkCheck} color="green" />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { to: '/jobs', icon: Briefcase, label: 'Find Jobs', color: 'from-indigo-500 to-indigo-600' },
            { to: '/student/recommendations', icon: Brain, label: 'AI Matches', color: 'from-cyan-500 to-cyan-600' },
            { to: '/student/profile', icon: User, label: 'Edit Profile', color: 'from-purple-500 to-purple-600' },
            { to: '/student/applications', icon: FileText, label: 'Applications', color: 'from-emerald-500 to-emerald-600' },
          ].map(({ to, icon: Icon, label, color }) => (
            <Link
              key={to}
              to={to}
              className="glass-card p-5 flex flex-col items-center gap-3 hover:scale-105 transition-transform"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
                <Icon size={22} className="text-white" />
              </div>
              <span className="text-slate-300 text-sm font-medium">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Recent Applications</h2>
          <Link to="/student/applications" className="text-indigo-400 hover:text-indigo-300 text-sm">View All →</Link>
        </div>
        {applications.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="No Applications Yet"
            message="Start applying to jobs and track your progress here."
            action={() => window.location.href = '/jobs'}
            actionLabel="Browse Jobs"
          />
        ) : (
          <div className="space-y-3">
            {applications.slice(0, 5).map(app => (
              <div key={app._id} className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase size={18} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{app.jobId?.title}</p>
                  <p className="text-slate-400 text-xs">{app.jobId?.recruiterProfile?.companyName || app.jobId?.companyName}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-slate-500 text-xs hidden sm:block">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
