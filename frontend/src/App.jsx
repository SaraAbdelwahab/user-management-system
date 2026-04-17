import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect } from 'react';
import useAuthStore from './store/authStore';
import queryClient from './lib/queryClient';
import socketClient from './lib/socket';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Users from './pages/Users';

// Lazy load pages for code splitting
import { lazy, Suspense } from 'react';
const Settings = lazy(() => import('./pages/Settings'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const { user, isAuthenticated, fetchProfile } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !isAuthenticated) {
      fetchProfile();
    }
  }, []);

  // Initialize Socket connection when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const token = localStorage.getItem('accessToken');
      socketClient.connect(token, user.isAdmin);
    }
    
    return () => {
      if (!isAuthenticated) {
        socketClient.disconnect();
      }
    };
  }, [isAuthenticated, user]);

  // Listen for data changes
  useEffect(() => {
    const handleUsersChanged = () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['user-stats'] });
    };
    
    window.addEventListener('users:changed', handleUsersChanged);
    
    return () => {
      window.removeEventListener('users:changed', handleUsersChanged);
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              <Route
                element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/users" element={<Users />} />
                <Route 
                  path="/settings" 
                  element={
                    <Suspense fallback={<PageLoader />}>
                      <Settings />
                    </Suspense>
                  } 
                />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Route>

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
          
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;







