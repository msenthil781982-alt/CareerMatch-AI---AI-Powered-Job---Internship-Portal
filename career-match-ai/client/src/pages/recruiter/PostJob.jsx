
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { jobAPI } from '../../services/api';

const initialForm = {
    title: '',
    company: '',
    location: '',
    jobType: 'Full-time',
    workMode: 'Remote',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    skills: ''
};

export default function PostJob() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [saving, setSaving] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const payload = {
                ...form,
                requirements: form.requirements
                    .split('\n')
                    .map((item) => item.trim())
                    .filter(Boolean),
                skills: form.skills
                    .split(',')
                    .map((item) => item.trim())
                    .filter(Boolean)
            };

            await jobAPI.createJob(payload);
            toast.success('Job posted successfully!');
            navigate('/recruiter/jobs');
        } catch (error) {
            toast.error(
                error.response?.data?.message || 'Unable to post job.'
            );
        } finally {
            setSaving(false);
        }
    };

    const fields = [
        { name: 'title', label: 'Job Title', placeholder: 'Frontend Developer' },
        { name: 'company', label: 'Company Name', placeholder: 'Company name' },
        { name: 'location', label: 'Location', placeholder: 'Chennai' },
        { name: 'experience', label: 'Experience', placeholder: '0-2 years' },
        { name: 'salary', label: 'Salary', placeholder: '₹3-5 LPA' }
    ];

    return (
        <DashboardLayout
            title="Post a Job"
            subtitle="Create a new job opportunity for candidates."
        >
            <form
                onSubmit={handleSubmit}
                className="max-w-3xl space-y-5 rounded-xl border border-white/10 bg-white/5 p-6"
            >
                {fields.map((field) => (
                    <div key={field.name}>
                        <label className="mb-2 block text-sm text-slate-300">
                            {field.label}
                        </label>
                        <input
                            required
                            name={field.name}
                            value={form[field.name]}
                            onChange={handleChange}
                            placeholder={field.placeholder}
                            className="w-full rounded-lg border border-white/10 bg-[#171725] px-4 py-3 text-white outline-none focus:border-violet-500"
                        />
                    </div>
                ))}

                <div>
                    <label className="mb-2 block text-sm text-slate-300">Job Type</label>
                    <select
                        name="jobType"
                        value={form.jobType}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-[#171725] px-4 py-3 text-white"
                    >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Internship</option>
                        <option>Contract</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">Work Mode</label>
                    <select
                        name="workMode"
                        value={form.workMode}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-[#171725] px-4 py-3 text-white"
                    >
                        <option>Remote</option>
                        <option>On-site</option>
                        <option>Hybrid</option>
                    </select>
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Job Description
                    </label>
                    <textarea
                        required
                        name="description"
                        rows="5"
                        value={form.description}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-[#171725] px-4 py-3 text-white"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Requirements (one per line)
                    </label>
                    <textarea
                        name="requirements"
                        rows="4"
                        value={form.requirements}
                        onChange={handleChange}
                        className="w-full rounded-lg border border-white/10 bg-[#171725] px-4 py-3 text-white"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm text-slate-300">
                        Skills (comma separated)
                    </label>
                    <input
                        name="skills"
                        value={form.skills}
                        onChange={handleChange}
                        placeholder="React, JavaScript, CSS"
                        className="w-full rounded-lg border border-white/10 bg-[#171725] px-4 py-3 text-white"
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className="rounded-lg bg-violet-600 px-6 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                    {saving ? 'Publishing...' : 'Publish Job'}
                </button>
            </form>
        </DashboardLayout>
    );
}
