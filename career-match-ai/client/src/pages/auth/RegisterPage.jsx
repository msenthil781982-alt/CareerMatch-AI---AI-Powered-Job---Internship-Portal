import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Brain, Mail, Lock, User, Phone, Building2, GraduationCap, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: params.get('role') || 'student',
    phone: '', location: '', companyName: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }
    setLoading(true);
    try {
      const user = await register(formData);
      toast.success('Account created! Welcome to CareerMatch AI 🎉');
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => setFormData(p => ({ ...p, [k]: v }));

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md animate-fadeInUp">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Brain size={24} className="text-white" />
            </div>
            <span className="text-xl font-black text-white">CareerMatch <span className="gradient-text">AI</span></span>
          </Link>
          <h1 className="text-3xl font-black text-white mb-2">Create Account</h1>
          <p className="text-slate-400">Start your career journey today</p>
        </div>

        <div className="glass-card p-8">
          {/* Role Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
            <button
              type="button"
              onClick={() => set('role', 'student')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                formData.role === 'student' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap size={16} /> Student
            </button>
            <button
              type="button"
              onClick={() => set('role', 'recruiter')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                formData.role === 'recruiter' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 size={16} /> Recruiter
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-slate-300 text-sm font-medium block mb-1.5">Full Name *</label>
                <div className="relative">
                  <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="reg-name" type="text" className="input-field pl-10" placeholder="John Doe" value={formData.name} onChange={e => set('name', e.target.value)} required />
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-slate-300 text-sm font-medium block mb-1.5">Email *</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="reg-email" type="email" className="input-field pl-10" placeholder="you@example.com" value={formData.email} onChange={e => set('email', e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium block mb-1.5">Phone</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="tel" className="input-field pl-10" placeholder="+91-9876543210" value={formData.phone} onChange={e => set('phone', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm font-medium block mb-1.5">Location</label>
                <input type="text" className="input-field" placeholder="Bangalore" value={formData.location} onChange={e => set('location', e.target.value)} />
              </div>

              {formData.role === 'recruiter' && (
                <div className="col-span-2">
                  <label className="text-slate-300 text-sm font-medium block mb-1.5">Company Name *</label>
                  <div className="relative">
                    <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="text" className="input-field pl-10" placeholder="Your Company" value={formData.companyName} onChange={e => set('companyName', e.target.value)} required />
                  </div>
                </div>
              )}

              <div className="col-span-2">
                <label className="text-slate-300 text-sm font-medium block mb-1.5">Password * (min 6 chars)</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input id="reg-password" type="password" className="input-field pl-10" placeholder="Min 6 characters" value={formData.password} onChange={e => set('password', e.target.value)} required minLength={6} />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={18} /></>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-400 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
