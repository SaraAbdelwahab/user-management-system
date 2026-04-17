import { Zap } from 'lucide-react';

const AuthLayout = ({ children, title }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 relative overflow-hidden">

      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-64 -right-64 w-[500px] h-[500px] bg-primary-100 rounded-full blur-3xl opacity-40" />
        <div className="absolute -bottom-64 -left-64 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full max-w-[400px]">

        {/* Brand mark */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-11 h-11 bg-primary-500 rounded-[14px] mb-4 shadow-btn-primary">
            <Zap className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-[1.125rem] font-semibold text-gray-900 tracking-[-0.02em]">
            {import.meta.env.VITE_APP_NAME || 'UserFlow'}
          </h1>
          {title && (
            <p className="mt-1.5 text-[13.5px] text-gray-500">{title}</p>
          )}
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200/80 shadow-card-lg rounded-2xl p-8">
          {children}
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          © {new Date().getFullYear()} UserFlow · All rights reserved
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
