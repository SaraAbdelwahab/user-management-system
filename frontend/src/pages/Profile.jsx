import { useState } from 'react';
import { User, Mail, Calendar, Shield, Edit3, Key, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuthStore from '../store/authStore';
import userService from '../services/userService';
import { format } from 'date-fns';

/* ── Info row (view mode) ── */
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100">
    <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
      <Icon className="w-[15px] h-[15px] text-gray-400" strokeWidth={1.8} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="label-caps">{label}</p>
      <p className="text-[13.5px] font-medium text-gray-900 mt-0.5 truncate">{value || '—'}</p>
    </div>
  </div>
);

/* ── Form field (edit mode) ── */
const FormField = ({ label, type = 'text', value, onChange, error, placeholder, hint }) => (
  <div>
    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full px-3.5 py-2.5 text-[13.5px] rounded-xl border bg-white
        placeholder:text-gray-400 text-gray-900
        transition-all duration-150
        focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
        ${error ? 'border-red-300 bg-red-50/40' : 'border-slate-200'}
      `}
    />
    {error && (
      <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {error}
      </p>
    )}
    {!error && hint && <p className="mt-1.5 text-[12px] text-gray-400">{hint}</p>}
  </div>
);

/* ── Spinner ── */
const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Profile = () => {
  const { user, fetchProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!formData.fullName) e.fullName = 'Full name is required';
    if (formData.newPassword) {
      if (!formData.currentPassword) e.currentPassword = 'Current password is required';
      if (formData.newPassword.length < 8) e.newPassword = 'Minimum 8 characters';
      if (formData.newPassword !== formData.confirmNewPassword) e.confirmNewPassword = 'Passwords do not match';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const data = { fullName: formData.fullName };
      if (formData.newPassword) {
        data.currentPassword = formData.currentPassword;
        data.newPassword = formData.newPassword;
      }
      await userService.updateProfile(data);
      await fetchProfile();
      toast.success('Profile updated');
      setIsEditing(false);
      setFormData((p) => ({ ...p, currentPassword: '', newPassword: '', confirmNewPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setErrors({});
    setFormData({ fullName: user?.fullName || '', currentPassword: '', newPassword: '', confirmNewPassword: '' });
  };

  const initials = user?.fullName?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="max-w-4xl mx-auto space-y-7">

      {/* ── Header ── */}
      <div>
        <h1 className="page-title">Profile</h1>
        <p className="page-subtitle">Manage your personal information and security settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-5">

        {/* ── Left column ── */}
        <div className="space-y-4">

          {/* Identity card */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-1">
              <div className="w-[72px] h-[72px] bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-card-md">
                <span className="text-white text-2xl font-bold tracking-tight">{initials}</span>
              </div>
              {user?.isActive && (
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
              )}
            </div>

            <h2 className="mt-3.5 text-[15px] font-semibold text-gray-900 leading-tight">{user?.fullName}</h2>
            <p className="text-[12.5px] text-gray-400 mt-0.5 truncate max-w-full">{user?.email}</p>

            <span className={`
              mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
              ${user?.isAdmin
                ? 'bg-violet-50 text-violet-700 border border-violet-100'
                : 'bg-primary-50 text-primary-700 border border-primary-100'
              }
            `}>
              <Shield className="w-3 h-3" strokeWidth={2} />
              {user?.isAdmin ? 'Administrator' : 'Member'}
            </span>
          </div>

          {/* Meta */}
          <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-4 space-y-1">
            {[
              {
                icon: Calendar,
                label: 'Member since',
                value: user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : '—',
              },
              {
                icon: CheckCircle,
                label: 'Account status',
                value: user?.isActive ? 'Active' : 'Inactive',
                valueClass: user?.isActive ? 'text-emerald-600' : 'text-gray-500',
              },
            ].map(({ icon: Icon, label, value, valueClass }) => (
              <div key={label} className="flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <Icon className="w-[15px] h-[15px] text-gray-400 flex-shrink-0" strokeWidth={1.8} />
                <div>
                  <p className="label-caps">{label}</p>
                  <p className={`text-[13px] font-medium mt-0.5 ${valueClass || 'text-gray-900'}`}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right column ── */}
        <div className="space-y-4">
          {!isEditing ? (
            <>
              {/* Personal info */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-card">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                  <div>
                    <h3 className="section-title">Personal Information</h3>
                    <p className="section-subtitle">Your account details</p>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-semibold text-gray-700
                      border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300
                      transition-all duration-150 shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5" strokeWidth={2} />
                    Edit
                  </button>
                </div>
                <div className="p-5 space-y-3">
                  <InfoRow icon={User} label="Full Name"      value={user?.fullName} />
                  <InfoRow icon={Mail} label="Email Address"  value={user?.email} />
                </div>
              </div>

              {/* Security */}
              <div className="bg-white border border-slate-100 rounded-2xl shadow-card">
                <div className="px-6 py-4 border-b border-slate-100">
                  <h3 className="section-title">Security</h3>
                  <p className="section-subtitle">Password and account protection</p>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-4 px-4 py-3.5 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center flex-shrink-0 shadow-xs">
                      <Key className="w-[15px] h-[15px] text-gray-400" strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="label-caps">Password</p>
                      <p className="text-[13.5px] font-medium text-gray-900 mt-0.5 tracking-widest">••••••••••</p>
                    </div>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Edit form */
            <div className="bg-white border border-slate-100 rounded-2xl shadow-card">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="section-title">Edit Profile</h3>
                <p className="section-subtitle">Update your information below</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">

                {/* Basic info */}
                <div className="space-y-4">
                  <p className="label-caps">Basic Information</p>
                  <FormField
                    label="Full Name"
                    value={formData.fullName}
                    onChange={set('fullName')}
                    error={errors.fullName}
                    placeholder="Your full name"
                  />
                </div>

                {/* Password */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <div>
                    <p className="label-caps">Change Password</p>
                    <p className="text-[12px] text-gray-400 mt-1">Leave blank to keep your current password</p>
                  </div>
                  <FormField
                    label="Current Password"
                    type="password"
                    value={formData.currentPassword}
                    onChange={set('currentPassword')}
                    error={errors.currentPassword}
                    placeholder="••••••••"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormField
                      label="New Password"
                      type="password"
                      value={formData.newPassword}
                      onChange={set('newPassword')}
                      error={errors.newPassword}
                      placeholder="••••••••"
                      hint="Minimum 8 characters"
                    />
                    <FormField
                      label="Confirm New Password"
                      type="password"
                      value={formData.confirmNewPassword}
                      onChange={set('confirmNewPassword')}
                      error={errors.confirmNewPassword}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2.5 text-[13px] font-semibold text-gray-700
                      border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs
                      transition-all duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white
                      bg-primary-500 hover:bg-primary-600 rounded-xl shadow-btn-primary
                      transition-all duration-150 disabled:opacity-55 disabled:cursor-not-allowed"
                  >
                    {loading ? <><Spinner /> Saving…</> : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
