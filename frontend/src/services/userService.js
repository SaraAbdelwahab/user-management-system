import api from './api';

class UserService {
  
  /**
   * Get all users with filters
   */
  async getUsers(params = {}) {
    const response = await api.get('/users', { params });
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data.data.user;
  }

  /**
   * Create new user
   */
  async createUser(userData) {
    const response = await api.post('/users/register', userData);
    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(id, userData) {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }

  /**
   * Delete user
   */
  async deleteUser(id) {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  }

  /**
   * Get user statistics
   */
  async getStats() {
    const response = await api.get('/users/stats');
    return response.data.data;
  }

  /**
   * Update profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  }

  /**
   * Get all roles
   */
  async getRoles() {
    const response = await api.get('/users/roles/all');
    return response.data.data;
  }
}

export default new UserService();