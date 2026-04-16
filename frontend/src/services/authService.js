import api from './api';

class AuthService {
  
  /**
   * Register new user
   */
  async register(userData) {
    const response = await api.post('/users/register', userData);
    return response.data;
  }

  /**
   * Login user
   */
  

async login(credentials) {
  const response = await api.post('/users/login', credentials);
  
  if (response.data.success) {
    const { tokens, user } = response.data.data;

    const accessToken = tokens.accessToken;
    const refreshToken = tokens.refreshToken;

    // store tokens
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);

    return {
      user,
      accessToken,
      refreshToken,
    };
  }
  
  throw new Error(response.data.message);
}

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post('/users/logout');
    } finally {
      // Always clear local storage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    }
  }

  /**
   * Get current user profile
   */
  async getProfile() {
    const response = await api.get('/users/profile');
    return response.data.data.user;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('accessToken');
  }
}

export default new AuthService();