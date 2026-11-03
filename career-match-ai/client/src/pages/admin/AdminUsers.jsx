
import { useEffect, useState } from 'react';
import { Search, Users, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../../components/shared/DashboardLayout';
import { adminAPI } from '../../services/api';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);

    const loadUsers = async () => {
        try {
            const res = await adminAPI.getUsers();
            const data = res.data.users || res.data;
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to load users.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const toggleStatus = async (id) => {
        setUpdatingId(id);

        try {
            await adminAPI.toggleUserStatus(id);
            await loadUsers();
            toast.success('User status updated.');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Unable to update user.');
        } finally {
            setUpdatingId(null);
        }
    };

    const filteredUsers = users.filter((user) =>
        `${user.name || ''} ${user.email || ''} ${user.role || ''}`
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <DashboardLayout
            title="Manage Users"
            subtitle="View and manage registered platform users."
        >
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name, email or role..."
                    className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
                />
            </div>

            {loading ? (
                <p className="text-slate-400">Loading users...</p>
            ) : filteredUsers.length === 0 ? (
                <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                    <Users className="mx-auto mb-3 text-slate-500" size={36} />
                    <p className="text-white">No users found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-xl border border-white/10">
                    <table className="w-full min-w-[650px] text-left">
                        <thead className="bg-white/5 text-sm text-slate-400">
                            <tr>
                                <th className="p-4">User</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const id = user._id || user.id;
                                const active = user.isActive ?? user.active ?? true;

                                return (
                                    <tr key={id} className="border-t border-white/10 text-sm">
                                        <td className="p-4">
                                            <p className="font-semibold text-white">{user.name || 'Unnamed user'}</p>
                                            <p className="mt-1 text-slate-400">{user.email}</p>
                                        </td>
                                        <td className="p-4 capitalize text-slate-300">
                                            {user.role || 'Student'}
                                        </td>
                                        <td className="p-4">
                                            <span className={active ? 'text-green-400' : 'text-red-400'}>
                                                {active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleStatus(id)}
                                                disabled={updatingId === id}
                                                className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-white hover:bg-white/10 disabled:opacity-50"
                                            >
                                                {active ? <UserX size={15} /> : <UserCheck size={15} />}
                                                {updatingId === id ? 'Updating...' : active ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    );
}
