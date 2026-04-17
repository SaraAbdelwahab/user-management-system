import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import useAuthStore from '../store/authStore';

/* ── Inline field component ── */
const Field = ({ label, name, type = 'text', icon: Icon, placeholder, value, onChange, error, right }) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[13px] font-medium text-gray-700">{label}</label>
      {right}
    </div>
    <div className="relative">
      <Icon
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-gray-400 pointer-events-none"
        strokeWidth={1.8}
      />
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={type === 'password' ? 'current-password' : 'email'}
        className={`
          w-full pl-10 pr-4 py-2.5 text-[13.5px] rounded-xl border bg-white
          placeholder:text-gray-400 text-gray-900
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
          ${error ? 'border-red-300 bg-red-50/40 focus:ring-red-500/20 focus:border-red-400' : 'border-slate-200'}
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

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setFormErrors((p) => ({ ...p, [name]: '' }));
    clearError();
  };

  const validate = () => {
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.password) errors.password = 'Password is required';
    setFormErrors(errors);
    return !Object.keys(errors).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await login(formData);
    if (result.success) navigate('/dashboard');
  };

  return (
    <AuthLayout title="Sign in to your account">

      {/* Global error */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-xl bg-red-50 border border-red-100">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-px" strokeWidth={2} />
          <p className="text-[13px] text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field
          label="Email address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={formErrors.email}
        />

        <Field
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={formErrors.password}
          right={
            <Link
              to="/forgot-password"
              className="text-[12px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              Forgot password?
            </Link>
          }
        />

        <div className="pt-1">
          <button
            type="submit"
            disabled={isLoading}
            className="
              w-full flex items-center justify-center gap-2
              px-4 py-2.5 text-[13.5px] font-semibold text-white
              bg-primary-500 hover:bg-primary-600 active:bg-primary-700
              rounded-xl shadow-btn-primary
              transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              disabled:opacity-55 disabled:cursor-not-allowed
            "
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Signing in…
              </>
            ) : 'Sign In'}
          </button>
        </div>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[11px] text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <p className="text-center text-[13px] text-gray-500">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Create one free
        </Link>
      </p>

    </AuthLayout>
  );
};

export default Login;
