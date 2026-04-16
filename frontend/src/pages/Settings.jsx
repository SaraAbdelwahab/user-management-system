import { useState } from 'react';
import { Moon, Sun, Monitor, Bell, Shield, Globe } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { useTheme } from '../hooks/useTheme';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('en');

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="space-y-6">
        {/* Appearance */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Monitor className="w-5 h-5 mr-2" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => theme === 'dark' && toggleTheme()}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    theme === 'light' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </button>
                <button
                  onClick={() => theme === 'light' && toggleTheme()}
                  className={`flex items-center px-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
          </h2>
          
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
            </label>
          </div>
        </Card>

        {/* Language */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Language & Region
          </h2>
          
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full md:w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="en">English (US)</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
          </select>
        </Card>

        {/* Security */}
        <Card>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Security
          </h2>
          
          <div className="space-y-4">
            <Button variant="outline">
              Change Password
            </Button>
            <Button variant="outline">
              Enable Two-Factor Authentication
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;