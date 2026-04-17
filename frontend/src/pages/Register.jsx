import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, AlertCircle } from 'lucide-react';
import AuthLayout from '../layouts/AuthLayout';
import useAuthStore from '../store/authStore';

const Field = ({ label, name, type = 'text', icon: Icon, placeholder, hint, formData, formErrors, onChange }) => (
  <div>
    <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
    <div className="relative">
      <Icon
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[15px] h-[15px] text-gray-400 pointer-events-none"
        strokeWidth={1.8}
      />
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={onChange}
        placeholder={placeholder}
        className={`
          w-full pl-10 pr-4 py-2.5 text-[13.5px] rounded-xl border bg-white
          placeholder:text-gray-400 text-gray-900
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
          ${formErrors[name] ? 'border-red-300 bg-red-50/40 focus:ring-red-500/20 focus:border-red-400' : 'border-slate-200'}
        `}
      />
    </div>
    {formErrors[name] ? (
      <p className="mt-1.5 text-[12px] text-red-500 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 flex-shrink-0" />
        {formErrors[name]}
      </p>
    ) : hint ? (
      <p className="mt-1.5 text-[12px] text-gray-400">{hint}</p>
    ) : null}
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setFormErrors((p) => ({ ...p, [name]: '' }));
    clearError();
  };

  const validate = () => {
    const errors = {};
    if (!formData.fullName) errors.fullName = 'Full name is required';
    else if (formData.fullName.length < 2) errors.fullName = 'At least 2 characters';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email address';
    if (!formData.password) errors.password = 'Password is required';
    else if (formData.password.length < 8) errors.password = 'Minimum 8 characters';
    if (formData.password !== formData.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setFormErrors(errors);
    return !Object.keys(errors).length;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await register(formData);
    if (result.success) navigate('/login');
  };

  const fieldProps = { formData, formErrors, onChange: handleChange };

  return (
    <AuthLayout title="Create your free account">

      {error && (
        <div className="flex items-start gap-2.5 p-3.5 mb-6 rounded-xl bg-red-50 border border-red-100">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-px" strokeWidth={2} />
          <p className="text-[13px] text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Full Name"       name="fullName"        icon={User} placeholder="John Doe"          hint="Your real name" {...fieldProps} />
        <Field label="Email address"   name="email"           type="email"    icon={Mail} placeholder="you@example.com" {...fieldProps} />
        <Field label="Password"        name="password"        type="password" icon={Lock} placeholder="••••••••" hint="Minimum 8 characters" {...fieldProps} />
        <Field label="Confirm password" name="confirmPassword" type="password" icon={Lock} placeholder="••••••••" {...fieldProps} />

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
                Creating account…
              </>
            ) : 'Create Account'}
          </button>
        </div>
      </form>

      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-slate-100" />
        <span className="text-[11px] text-gray-400 font-medium">OR</span>
        <div className="flex-1 h-px bg-slate-100" />
      </div>

      <p className="text-center text-[13px] text-gray-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 transition-colors">
          Sign in
        </Link>
      </p>

    </AuthLayout>
  );
};

export default Register;
