import { useState, useEffect } from 'react';
import { X, User, Mail, Lock, UserCheck, AlertCircle } from 'lucide-react';

/* ── Form field ── */
const Field = ({ label, type = 'text', value, onChange, error, placeholder, icon: Icon }) => (
  <div>
    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      {Icon && (
        <Icon
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-gray-400 pointer-events-none"
          strokeWidth={1.8}
        />
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5 py-2.5 text-[13.5px] rounded-xl border bg-white
          placeholder:text-gray-400 text-gray-900
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
          ${error ? 'border-red-300 bg-red-50/40' : 'border-slate-200'}
        `}
      />
    </div>
    {error && (
      <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {error}
      </p>
    )}
  </div>
);

/* ── Toggle ── */
const Toggle = ({ checked, onChange }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    className={`
      relative inline-flex w-[38px] h-[22px] rounded-full
      transition-colors duration-200
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
      ${checked ? 'bg-primary-500' : 'bg-slate-200'}
    `}
  >
    <span className={`
      absolute top-[3px] left-[3px] w-4 h-4 bg-white rounded-full shadow-xs
      transition-transform duration-200
      ${checked ? 'translate-x-4' : 'translate-x-0'}
    `} />
  </button>
);

/* ── Spinner ── */
const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const UserModal = ({ isOpen, onClose, onSubmit, user, title }) => {
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', confirmPassword: '', isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ fullName: user.fullName || '', email: user.email || '', password: '', confirmPassword: '', isActive: user.isActive ?? true });
    } else {
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '', isActive: true });
    }
    setErrors({});
  }, [user, isOpen]);

  const set = (field) => (e) => setFormData((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!formData.fullName) e.fullName = 'Full name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email address';
    if (!user) {
      if (!formData.password) e.password = 'Password is required';
      else if (formData.password.length < 8) e.password = 'Minimum 8 characters';
      if (formData.password !== formData.confirmPassword) e.confirmPassword = 'Passwords do not match';
    }
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await onSubmit(formData);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/50 backdrop-blur-[2px] animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-modal border border-slate-100 overflow-hidden animate-fade-in-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h3 className="text-[15px] font-semibold text-gray-900">{title}</h3>
            <p className="text-[12px] text-gray-400 mt-0.5">
              {user ? 'Update user information' : 'Fill in the details to create a new user'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400
              hover:text-gray-700 hover:bg-slate-100 transition-all duration-150"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-5 space-y-4">

            <Field label="Full Name"      value={formData.fullName}  onChange={set('fullName')}  error={errors.fullName}  placeholder="John Doe"          icon={User} />
            <Field label="Email Address"  type="email" value={formData.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" icon={Mail} />

            {/* Password — new users only */}
            {!user && (
              <div className="space-y-4 pt-1 border-t border-slate-100">
                <p className="label-caps pt-1">Set Password</p>
                <Field label="Password"         type="password" value={formData.password}        onChange={set('password')}        error={errors.password}        placeholder="••••••••" icon={Lock} />
                <Field label="Confirm Password" type="password" value={formData.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} placeholder="••••••••" icon={Lock} />
              </div>
            )}

            {/* Active toggle — existing users only */}
            {user && (
              <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-[14px] h-[14px] text-gray-400" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[13.5px] font-medium text-gray-900">Active Account</p>
                    <p className="text-[11.5px] text-gray-400">User can log in and access the system</p>
                  </div>
                </div>
                <Toggle
                  checked={formData.isActive}
                  onChange={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
                />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50/80 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-[13px] font-semibold text-gray-700
                border border-slate-200 rounded-xl hover:bg-white shadow-xs
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
              {loading ? <><Spinner /> Saving…</> : `${user ? 'Update' : 'Create'} User`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
