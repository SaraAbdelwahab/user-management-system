import { useState } from 'react';
import { Moon, Sun, Monitor, Bell, Shield, Globe, ChevronRight, Check } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

/* ── Section card ── */
const Section = ({ icon: Icon, iconBg, title, description, children }) => (
  <div className="bg-white border border-slate-100 rounded-2xl shadow-card overflow-hidden">
    <div className="flex items-center gap-3.5 px-6 py-4 border-b border-slate-100">
      <div className={`w-8 h-8 ${iconBg || 'bg-slate-50'} border border-slate-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-[15px] h-[15px] text-gray-500" strokeWidth={1.8} />
      </div>
      <div>
        <h2 className="section-title">{title}</h2>
        {description && <p className="section-subtitle">{description}</p>}
      </div>
    </div>
    <div className="px-6 py-5">{children}</div>
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

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState({ email: true, push: false, weekly: true });
  const [language, setLanguage] = useState('en');

  return (
    <div className="max-w-[640px] mx-auto space-y-6">

      {/* ── Header ── */}
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your preferences and account configuration</p>
      </div>

      {/* ── Appearance ── */}
      <Section
        icon={Monitor}
        iconBg="bg-slate-50"
        title="Appearance"
        description="Customize how the interface looks"
      >
        <div>
          <p className="label-caps mb-3">Theme</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 'light', label: 'Light', icon: Sun,  desc: 'Default light mode' },
              { value: 'dark',  label: 'Dark',  icon: Moon, desc: 'Easy on the eyes'   },
            ].map(({ value, label, icon: Icon, desc }) => {
              const active = theme === value;
              return (
                <button
                  key={value}
                  onClick={() => theme !== value && toggleTheme()}
                  className={`
                    relative flex flex-col items-start gap-2 p-4 rounded-xl border text-left
                    transition-all duration-150
                    ${active
                      ? 'border-primary-400 bg-primary-50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }
                  `}
                >
                  {active && (
                    <span className="absolute top-3 right-3 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    </span>
                  )}
                  <Icon className={`w-4 h-4 ${active ? 'text-primary-600' : 'text-gray-400'}`} strokeWidth={1.8} />
                  <div>
                    <p className={`text-[13px] font-semibold ${active ? 'text-primary-700' : 'text-gray-800'}`}>{label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ── Notifications ── */}
      <Section
        icon={Bell}
        iconBg="bg-amber-50"
        title="Notifications"
        description="Choose what you want to be notified about"
      >
        <div className="space-y-1">
          {[
            { key: 'email',  label: 'Email Notifications',  desc: 'Updates and alerts via email' },
            { key: 'push',   label: 'Push Notifications',   desc: 'Real-time browser notifications' },
            { key: 'weekly', label: 'Weekly Digest',        desc: 'Summary of activity every week' },
          ].map(({ key, label, desc }, i, arr) => (
            <div
              key={key}
              className={`flex items-center justify-between py-3.5 ${i < arr.length - 1 ? 'border-b border-slate-100' : ''}`}
            >
              <div>
                <p className="text-[13.5px] font-medium text-gray-900">{label}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
              </div>
              <Toggle
                checked={notifications[key]}
                onChange={() => setNotifications((p) => ({ ...p, [key]: !p[key] }))}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ── Language ── */}
      <Section
        icon={Globe}
        iconBg="bg-blue-50"
        title="Language & Region"
        description="Set your preferred display language"
      >
        <div>
          <p className="label-caps mb-2">Display Language</p>
          <div className="relative w-full sm:w-56">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="
                w-full px-3.5 py-2.5 text-[13.5px] border border-slate-200 rounded-xl
                bg-white text-gray-900 appearance-none
                focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-400
                transition-all duration-150
              "
            >
              <option value="en">🇺🇸 English (US)</option>
              <option value="es">🇪🇸 Español</option>
              <option value="fr">🇫🇷 Français</option>
              <option value="de">🇩🇪 Deutsch</option>
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-90 pointer-events-none" strokeWidth={2} />
          </div>
        </div>
      </Section>

      {/* ── Security ── */}
      <Section
        icon={Shield}
        iconBg="bg-violet-50"
        title="Security"
        description="Manage your password and account protection"
      >
        <div className="space-y-2">
          {[
            { label: 'Change Password',                  desc: 'Update your current password' },
            { label: 'Enable Two-Factor Authentication', desc: 'Add an extra layer of security' },
          ].map(({ label, desc }) => (
            <button
              key={label}
              className="
                w-full flex items-center justify-between px-4 py-3.5 rounded-xl
                border border-slate-200 hover:border-slate-300 hover:bg-slate-50
                transition-all duration-150 text-left group shadow-xs
              "
            >
              <div>
                <p className="text-[13.5px] font-medium text-gray-900">{label}</p>
                <p className="text-[12px] text-gray-400 mt-0.5">{desc}</p>
              </div>
              <ChevronRight
                className="w-4 h-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all duration-150"
                strokeWidth={2}
              />
            </button>
          ))}
        </div>
      </Section>

    </div>
  );
};

export default Settings;
