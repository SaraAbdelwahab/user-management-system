const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Content */}
      <div className="relative w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            {import.meta.env.VITE_APP_NAME || 'My App'}
          </h1>

          {title && (
            <p className="mt-2 text-sm text-gray-500">
              {title}
            </p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 rounded-2xl p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;