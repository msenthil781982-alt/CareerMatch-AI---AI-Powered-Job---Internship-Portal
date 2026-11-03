
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { studentAPI } from '../../services/api';
import { User, Save } from 'lucide-react';

export default function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    headline: '',
    skills: '',
    education: '',
    location: '',
    bio: ''
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await studentAPI.getProfile();
        const data = response.data.profile || {};
        const user = response.data.user || {};

        setProfile({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || '',
          headline: data.headline || '',
          skills: Array.isArray(data.skills)
            ? data.skills.join(', ')
            : '',
          education: Array.isArray(data.education)
            ? data.education.map(item =>
                [item.degree, item.field, item.institution, item.year]
                  .filter(Boolean)
                  .join(' - ')
              ).join(', ')
            : '',
          location: user.location || '',
          bio: data.bio || ''
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Could not load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const educationItems = profile.education
        .split(',')
        .map(item => item.trim())
        .filter(Boolean)
        .map(item => ({
          degree: item,
          field: '',
          institution: '',
          year: '',
          percentage: ''
        }));

      await studentAPI.updateProfile({
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        headline: profile.headline,
        bio: profile.bio,
        skills: profile.skills
          .split(',')
          .map(s => s.trim())
          .filter(Boolean),
        education: educationItems
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Profile update failed'
      );
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    ['name', 'Full Name'],
    ['email', 'Email'],
    ['phone', 'Phone'],
    ['headline', 'Professional Headline'],
    ['location', 'Location'],
    ['education', 'Education (comma separated)']
  ];

  return (
    <DashboardLayout
      title="My Profile"
      subtitle="Manage your professional information"
    >
      {loading ? (
        <p className="text-slate-400">Loading profile...</p>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <User className="text-indigo-400" />
              <h2 className="text-white font-semibold">
                Personal Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {fields.map(([name, label]) => (
                <label key={name} className="block">
                  <span className="text-slate-400 text-sm">
                    {label}
                  </span>
                  <input
                    name={name}
                    value={profile[name] || ''}
                    onChange={handleChange}
                    className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-indigo-500"
                  />
                </label>
              ))}
            </div>

            <label className="block mt-5">
              <span className="text-slate-400 text-sm">
                Skills (comma separated)
              </span>
              <input
                name="skills"
                value={profile.skills}
                onChange={handleChange}
                placeholder="React, Java, Python"
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-indigo-500"
              />
            </label>

            <label className="block mt-5">
              <span className="text-slate-400 text-sm">
                About Me
              </span>
              <textarea
                name="bio"
                value={profile.bio}
                onChange={handleChange}
                rows={4}
                className="mt-2 w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white outline-none focus:border-indigo-500"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-white hover:bg-indigo-500 disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}
    </DashboardLayout>
  );
}
