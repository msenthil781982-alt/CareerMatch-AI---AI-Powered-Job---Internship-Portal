import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, User, Briefcase, BookmarkCheck, Star,
  FileText, ChevronRight, Building2, PlusCircle, Users,
  Settings, LogOut, Brain
} from 'lucide-react';

const StudentNav = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/jobs', icon: Briefcase, label: 'Find Jobs' },
  { to: '/student/recommendations', icon: Brain, label: 'AI Matches' },
  { to: '/student/applications', icon: FileText, label: 'My Applications' },
  { to: '/student/saved', icon: BookmarkCheck, label: 'Saved Jobs' },
  { to: '/student/profile', icon: User, label: 'My Profile' },
];

const RecruiterNav = [
  { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/recruiter/jobs', icon: Briefcase, label: 'My Jobs' },
  { to: '/recruiter/post-job', icon: PlusCircle, label: 'Post a Job' },
  { to: '/recruiter/profile', icon: Building2, label: 'Company Profile' },
];

const AdminNav = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/jobs', icon: Briefcase, label: 'Jobs' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  const navItems = user?.role === 'student' ? StudentNav :
                   user?.role === 'recruiter' ? RecruiterNav : AdminNav;

  return (
    <aside className="sidebar flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
          <Brain size={18} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">CareerMatch</p>
          <p className="text-indigo-400 text-xs">AI Portal</p>
        </div>
      </div>

      {/* User info */}
      <div className="glass rounded-xl p-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs capitalize">{user?.role}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`
            }
          >
            <Icon size={18} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            <ChevronRight size={14} className="opacity-0 group-hover:opacity-60 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-4 border-t border-white/5">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
