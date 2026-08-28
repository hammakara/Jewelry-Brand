import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, UserPlus, Trash2, KeyRound, CheckCircle2, Lock, User, AlertCircle, ShieldAlert } from 'lucide-react';
import { AuthUser } from '../../types';

export const AdminTeamSecurity: React.FC = () => {
  const { authToken, currentUser, showToast } = useStore();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState(false);
  
  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'ADMIN' | 'STAFF'>('STAFF');
  const [phone, setPhone] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Change Password State
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passError, setPassError] = useState<string | null>(null);
  const [passSuccess, setPassSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    if (!authToken) return;
    setLoading(true);
    try {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [authToken]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          phone,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Failed to create team member.');
        return;
      }

      showToast(`Team member "${data.name}" added successfully!`, 'success');
      setName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setIsAddingUser(false);
      fetchUsers();
    } catch (err: any) {
      setFormError(err.message || 'Error creating user');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to revoke access for ${userName}?`)) return;

    try {
      const res = await fetch(`/api/auth/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (!res.ok) {
        const data = await res.json();
        showToast(data.error || 'Cannot delete user', 'info');
        return;
      }

      showToast(`Access revoked for ${userName}.`, 'info');
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err: any) {
      showToast(err.message, 'info');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError(null);
    setPassSuccess(null);

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPassError(data.error || 'Failed to change password.');
        return;
      }

      setPassSuccess('Your password has been securely updated.');
      setCurrentPassword('');
      setNewPassword('');
      setTimeout(() => {
        setIsChangingPass(false);
        setPassSuccess(null);
      }, 2000);
    } catch (err: any) {
      setPassError(err.message || 'Error changing password.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-[#523B08] border border-white/20 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-amber-300" />
            <h2 className="font-display-luxury text-xl font-bold text-white tracking-wide">
              Team Access & Role-Based Security
            </h2>
          </div>
          <p className="text-xs text-white/80 max-w-xl">
            Manage authenticated administrators and staff members with access to boutique products, inventory, order processing, and store configuration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsChangingPass(!isChangingPass)}
            className="px-4 py-2.5 bg-[#3D2B05] hover:bg-white text-white hover:text-[#523D0C] border border-white/30 text-xs font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Change My Password</span>
          </button>

          {currentUser?.role === 'ADMIN' && (
            <button
              onClick={() => setIsAddingUser(!isAddingUser)}
              className="px-4 py-2.5 bg-white hover:bg-neutral-100 text-[#523D0C] text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-[#523D0C]" />
              <span>Add Staff Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Change Password Card */}
      {isChangingPass && (
        <div className="bg-[#523B08] border border-amber-400/40 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200 mb-4 flex items-center gap-2">
            <Lock className="w-4 h-4" />
            Update Account Password ({currentUser?.email})
          </h3>

          {passError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{passError}</span>
            </div>
          )}

          {passSuccess && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{passSuccess}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/80 font-semibold mb-1">
                Current Password
              </label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-[#3D2B05] border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-white"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 font-semibold mb-1">
                New Password (minimum 6 characters)
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-[#3D2B05] border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-white"
                placeholder="••••••••"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsChangingPass(false)}
                className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-white text-[#523D0C] font-bold text-xs uppercase tracking-wider rounded-lg shadow"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add User Modal / Form */}
      {isAddingUser && (
        <div className="bg-[#523B08] border border-amber-400/40 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-top-3 duration-200">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-200 mb-4 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Provision New Staff Credentials
          </h3>

          {formError && (
            <div className="mb-4 p-3 rounded-lg bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleCreateUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/80 font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sreysros Keo"
                className="w-full bg-[#3D2B05] border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@pranith.luxury"
                className="w-full bg-[#3D2B05] border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 font-semibold mb-1">Initial Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#3D2B05] border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-white"
              />
            </div>

            <div>
              <label className="block text-xs text-white/80 font-semibold mb-1">Role Assignment</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full bg-[#3D2B05] border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-white"
              >
                <option value="STAFF">STAFF (Products & Order Management)</option>
                <option value="ADMIN">ADMIN (Full Superuser Privileges)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs text-white/80 font-semibold mb-1">Phone / Telegram (Optional)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+855 12 999 888"
                className="w-full bg-[#3D2B05] border border-white/30 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-white"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingUser(false)}
                className="px-4 py-2 text-xs font-semibold text-white/70 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-white text-[#523D0C] font-bold text-xs uppercase tracking-wider rounded-lg shadow"
              >
                Provision Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-[#523B08] border border-white/20 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-white/20 flex items-center justify-between">
          <h3 className="font-display-luxury text-base font-bold text-white">
            Authorized Personnel & Team ({users.length})
          </h3>
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="text-xs text-amber-300 hover:text-white underline font-semibold"
          >
            {loading ? 'Refreshing...' : 'Refresh List'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#3D2B05] text-white/70 uppercase tracking-wider border-b border-white/10">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                return (
                  <tr key={u.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${u.email}`}
                          alt={u.name}
                          className="w-8 h-8 rounded-full bg-stone-900 border border-white/20"
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded-full">
                                YOU
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-white/60">ID: {u.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-white/90 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'ADMIN'
                          ? 'bg-amber-400 text-stone-950 shadow-sm'
                          : u.role === 'STAFF'
                          ? 'bg-sky-400/20 text-sky-200 border border-sky-400/40'
                          : 'bg-emerald-400/20 text-emerald-200 border border-emerald-400/40'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-white/70">{u.phone || '—'}</td>
                    <td className="py-3.5 px-4 text-right">
                      {!isCurrent && currentUser?.role === 'ADMIN' ? (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 text-rose-300 hover:text-white hover:bg-rose-900/60 rounded-lg transition"
                          title="Revoke access"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-white/40 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
