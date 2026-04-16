import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Card from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import useAuthStore from '../store/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
    clearError();
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.fullName)
      errors.fullName = 'Full name is required';
    else if (formData.fullName.length < 2)
      errors.fullName = 'Name must be at least 2 characters';

    if (!formData.email)
      errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = 'Invalid email';

    if (!formData.password)
      errors.password = 'Password is required';
    else if (formData.password.length < 8)
      errors.password = 'Password must be at least 8 characters';

    if (formData.password !== formData.confirmPassword)
      errors.confirmPassword = 'Passwords do not match';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await register(formData);

    if (result.success) {
      navigate('/login');
    }
  };

  return (
    <AuthLayout title="Create your account">
      <Card className="space-y-5">

        {/* Global error */}
        {error && (
          <div className="p-3 rounded-xl border border-red-200 bg-red-50">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={formErrors.fullName}
            placeholder="John Doe"
            hint="Enter your real name"
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={formErrors.email}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            error={formErrors.password}
            hint="Minimum 8 characters"
            placeholder="••••••••"
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={formErrors.confirmPassword}
            placeholder="••••••••"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={isLoading}
          >
            Create Account
          </Button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 pt-2">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:text-blue-800"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </AuthLayout>
  );
};

export default Register;