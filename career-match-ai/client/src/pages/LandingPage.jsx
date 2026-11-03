import { Link } from 'react-router-dom';
import { Brain, Zap, Users, Briefcase, Star, CheckCircle, ArrowRight, TrendingUp, Shield, Globe } from 'lucide-react';

const features = [
  { icon: Brain, title: 'AI-Powered Matching', desc: 'Our skill-based algorithm analyzes your resume and matches you to jobs with a transparent score.', color: 'indigo' },
  { icon: Zap, title: 'Instant Match Score', desc: 'Get a match percentage, matched skills, and missing skills in seconds.', color: 'cyan' },
  { icon: TrendingUp, title: 'Smart Recommendations', desc: 'Personalized job recommendations sorted by your highest match score.', color: 'green' },
  { icon: Shield, title: 'Track Applications', desc: 'Track every application from Applied → Shortlisted → Interview → Selected.', color: 'amber' },
];

const steps = [
  { step: '01', title: 'Create Your Profile', desc: 'Sign up, add your skills, education, and upload your resume.' },
  { step: '02', title: 'Browse & Search Jobs', desc: 'Explore hundreds of jobs and internships with powerful filters.' },
  { step: '03', title: 'Get AI Match Score', desc: 'Click "Analyze My Match" to see your compatibility with any job.' },
  { step: '04', title: 'Apply & Track', desc: 'Apply in one click and track your application status in real time.' },
];

const testimonials = [
  { name: 'Rahul Gupta', role: 'MERN Developer @ TechCorp', text: 'CareerMatch AI helped me identify exactly what skills I was missing. Within 3 weeks, I landed my first job!', score: '92%' },
  { name: 'Ananya Singh', role: 'Frontend Intern @ Innovate India', text: 'The AI match score was incredibly accurate. I applied only to jobs where I had 80%+ match and got called for every one.', score: '88%' },
  { name: 'Karthik Reddy', role: 'ML Engineer Intern', text: 'As a fresher, I had no idea which jobs to target. CareerMatch AI showed me exactly where to focus my learning.', score: '85%' },
];

const stats = [
  { label: 'Students Placed', value: '2,500+' },
  { label: 'Jobs & Internships', value: '1,200+' },
  { label: 'Partner Companies', value: '300+' },
  { label: 'Avg. Match Score', value: '76%' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0F0F1A] text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
              <Brain size={18} className="text-white" />
            </div>
            <span className="font-bold text-lg">CareerMatch <span className="gradient-text">AI</span></span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/jobs" className="text-slate-400 hover:text-white text-sm transition-colors hidden md:block">Browse Jobs</Link>
            <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log In</Link>
            <Link to="/register" className="btn-primary text-sm py-2 px-4">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-bg pt-32 pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <Brain size={14} />
            AI-Powered Job & Internship Portal
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Find the right opportunity
            <br />
            <span className="gradient-text">with AI.</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover internships and jobs that match your skills, resume, and career goals.
            Get transparent AI match scores — no black boxes, just results.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/jobs?type=full-time" className="btn-primary flex items-center gap-2 text-base py-3 px-8">
              <Briefcase size={18} /> Find Jobs
            </Link>
            <Link to="/jobs?type=internship" className="btn-secondary flex items-center gap-2 text-base py-3 px-8">
              <Globe size={18} /> Find Internships
            </Link>
            <Link to="/register?role=recruiter" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition-colors py-3 px-4">
              <Users size={16} /> Recruiter Login <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="glass-card p-6 text-center">
              <p className="text-3xl font-black gradient-text">{s.value}</p>
              <p className="text-slate-400 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">How It Works</h2>
            <p className="text-slate-400">Simple, transparent, and powered by AI.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="glass-card p-6 relative">
                <p className="text-5xl font-black text-indigo-500/20 mb-3">{s.step}</p>
                <h3 className="text-white font-bold mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{s.desc}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-indigo-500 z-10">
                    <ArrowRight size={20} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Matching Explainer */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Brain size={24} className="text-indigo-400" />
                  <h2 className="text-3xl font-black text-white">AI Matching</h2>
                </div>
                <p className="text-slate-400 mb-6 leading-relaxed">
                  Our transparent, skill-based matching algorithm compares your skills against job requirements and gives you a clear match score — with no hidden AI magic.
                </p>
                <div className="space-y-3">
                  {['Transparent scoring formula', 'Matched and missing skills listed', 'Personalized recommendations', 'Sort jobs by highest match'].map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="glass rounded-xl p-4">
                  <p className="text-slate-400 text-xs mb-3 font-medium uppercase tracking-wider">Example Match</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white font-semibold">MERN Stack Developer</p>
                      <p className="text-slate-400 text-sm">TechCorp Solutions</p>
                    </div>
                    <div className="w-16 h-16 rounded-full border-4 border-emerald-500 bg-emerald-500/10 flex items-center justify-center">
                      <span className="text-emerald-400 font-black text-lg">92%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-emerald-400 text-xs font-semibold mb-1">✓ Matched Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {['React', 'MongoDB', 'Git', 'REST APIs'].map(s => (
                          <span key={s} className="skill-chip skill-chip-matched text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-red-400 text-xs font-semibold mb-1">✗ Missing Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {['Node.js'].map(s => (
                          <span key={s} className="skill-chip skill-chip-missing text-xs">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">Everything You Need</h2>
            <p className="text-slate-400">Built for students and recruiters alike.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="glass-card p-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                  <f.icon size={24} className="text-indigo-400" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-white mb-3">Student Success Stories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={14} className="fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-400 text-xs">{t.role}</p>
                  </div>
                  <span className="text-emerald-400 font-black text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                    {t.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center glass-card p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-cyan-500/10" />
          <div className="relative z-10">
            <Brain size={48} className="text-indigo-400 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-white mb-4">Ready to find your match?</h2>
            <p className="text-slate-400 mb-8">Join thousands of students who found their dream job with CareerMatch AI.</p>
            <Link to="/register" className="btn-primary inline-flex items-center gap-2 text-base py-3 px-10">
              Start Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain size={18} className="text-indigo-400" />
            <span className="text-slate-400 text-sm">CareerMatch AI — AI-Powered Job & Internship Portal</span>
          </div>
          <p className="text-slate-600 text-sm">Demo Project — Not a real job board</p>
        </div>
      </footer>
    </div>
  );
}
