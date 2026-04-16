import { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(
  (
    {
      label,
      error,
      hint,
      type = 'text',
      fullWidth = true,
      className = '',
      leftIcon,
      rightIcon,
      ...props
    },
    ref
  ) => {
    const base =
      'w-full px-3 py-2 rounded-xl border bg-white text-gray-900 placeholder:text-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const stateStyles = error
      ? 'border-red-500 focus:ring-red-500'
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500';

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {/* Label */}
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        {/* Input wrapper */}
        <div className="relative flex items-center">
          {/* Left icon */}
          {leftIcon && (
            <span className="absolute left-3 text-gray-400">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            type={type}
            className={twMerge(
              base,
              stateStyles,
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              className
            )}
            {...props}
          />

          {/* Right icon */}
          {rightIcon && (
            <span className="absolute right-3 text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}

        {/* Hint */}
        {!error && hint && (
          <p className="mt-1 text-sm text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;