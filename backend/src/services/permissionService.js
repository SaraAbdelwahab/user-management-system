const permissionRepository = require('../repositories/permissionRepository');

/**
 * Permission Service - Business logic for authorization
 */
class PermissionService {
  
  /**
   * Get user's complete permission set
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User permissions and roles
   */
  async getUserAuthorizationData(userId) {
    const authData = await permissionRepository.getUserRolesAndPermissions(userId);
    
    return {
      roles: authData.roles.map(r => r.name),
      permissions: authData.permissions,
      isAdmin: authData.roles.some(r => r.name === 'Super Admin' || r.name === 'Admin')
    };
  }

  /**
   * Check if user can perform action
   * @param {number} userId - User ID
   * @param {string|Array<string>} required - Required permission(s)
   * @param {string} mode - 'any' or 'all' (default: 'any')
   * @returns {Promise<boolean>} True if authorized
   */
  async canUser(userId, required, mode = 'any') {
    const permissions = Array.isArray(required) ? required : [required];
    
    if (mode === 'all') {
      return await permissionRepository.userHasAllPermissions(userId, permissions);
    } else {
      return await permissionRepository.userHasAnyPermission(userId, permissions);
    }
  }

  /**
   * Assert user has permission (throws error if not)
   * @param {number} userId - User ID
   * @param {string|Array<string>} required - Required permission(s)
   * @param {string} mode - 'any' or 'all'
   */
  async assertUserCan(userId, required, mode = 'any') {
    const hasPermission = await this.canUser(userId, required, mode);
    
    if (!hasPermission) {
      const permissionList = Array.isArray(required) ? required.join(', ') : required;
      throw new Error(`Insufficient permissions. Required: ${permissionList}`);
    }
  }
}

module.exports = new PermissionService();