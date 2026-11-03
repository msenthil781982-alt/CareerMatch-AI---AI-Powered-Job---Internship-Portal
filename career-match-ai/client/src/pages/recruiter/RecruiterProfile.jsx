
import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { recruiterAPI } from '../../services/api';

export default function RecruiterProfile() {
    const [profile, setProfile] = useState({
        companyName: '',
        email: '',
        phone: '',
        website: '',
        location: '',
        description: ''
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        recruiterAPI.getProfile()
            .then((res) => {
                const data = res.data.profile || res.data.recruiter || res.data;
                setProfile((prev) => ({ ...prev, ...data }));
            })
            .catch((err) => {
                setMessage(err.response?.data?.message || 'Unable to load profile.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await recruiterAPI.updateProfile(profile);
            setMessage('Profile updated successfully!');
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { name: 'companyName', label: 'Company Name' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone' },
        { name: 'website', label: 'Website' },
        { name: 'location', label: 'Location' }
    ];

    return (
        <DashboardLayout
            title="Company Profile"
            subtitle="Manage your company information."
        >
            {loading ? (
                <p className="text-slate-400">Loading profile...</p>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="max-w-3xl space-y-5 rounded-xl border border-white/10 bg-white/5 p-6"
                >
                    {message && (
                        <p className="rounded-lg bg-violet-500/10 p-3 text-sm text-violet-300">
                            {message}
                        </p>
                    )}

                    {fields.map((field) => (
                        <div key={field.name}>
                            <label className="mb-2 block text-sm text-slate-300">
                                {field.label}
                            </label>
                            <input
                                name={field.name}
                                type={field.type || 'text'}
                                value={profile[field.name] || ''}
                                onChange={handleChange}
                                className="w-full rounded-lg border border-white/10 bg-[#171725] px-4 py-3 text-white outline-none focus:border-violet-500"
                            />
                        </div>
                    ))}

                    <div>
                        <label className="mb-2 block text-sm text-slate-300">
                            Company Description
                        </label>
                        <textarea
                            name="description"
                            rows="5"
                            value={profile.description || ''}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-white/10 bg-[#171725] px-4 py-3 text-white outline-none focus:border-violet-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Profile'}
                    </button>
                </form>
            )}
        </DashboardLayout>
    );
}
