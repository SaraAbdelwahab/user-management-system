import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  ...props
}) => {
  
   const base =
  "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300";

  const variants = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-500 shadow-sm',
    secondary:
      'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 focus:ring-gray-400',
    danger:
      'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
    outline:
      'border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 focus:ring-gray-400',
    ghost:
      'text-gray-700 hover:bg-gray-100 active:bg-gray-200 focus:ring-gray-300',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const width = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={twMerge(base, variants[variant], sizes[size], width, className)}
      {...props}
    >
      {/* Loading spinner */}
      {isLoading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
  <circle
    className="opacity-25"
    cx="12"
    cy="12"
    r="10"
    stroke="currentColor"
    strokeWidth="4"
    fill="none"
  />
  <path
    className="opacity-75"
    fill="currentColor"
    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
  />
</svg>
      )}

      {/* Left icon */}
      {!isLoading && leftIcon && <span className="flex">{leftIcon}</span>}

      {/* Content */}
      <span className={isLoading ? 'opacity-70' : ''}>{children}</span>

      {/* Right icon */}
      {!isLoading && rightIcon && <span className="flex">{rightIcon}</span>}
    </button>
  );
};

export default Button;