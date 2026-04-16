const pool = require('../config/db');

/**
 * Permission Repository - Query user permissions efficiently
 */
class PermissionRepository {
  
  /**
   * Get all permissions for a user (with caching capability)
   * @param {number} userId - User ID
   * @returns {Promise<Array>} List of permission names
   */
  async getUserPermissions(userId) {
    const [rows] = await pool.query(
      `SELECT DISTINCT p.name 
       FROM users u
       JOIN user_roles ur ON u.id = ur.user_id
       JOIN roles r ON ur.role_id = r.id
       JOIN role_permissions rp ON r.id = rp.role_id
       JOIN permissions p ON rp.permission_id = p.id
       WHERE u.id = ? AND u.is_active = TRUE`,
      [userId]
    );
    
    return rows.map(row => row.name);
  }

  /**
   * Check if user has specific permission
   * @param {number} userId - User ID
   * @param {string} permissionName - Permission to check (e.g., 'users:create')
   * @returns {Promise<boolean>} True if has permission
   */
  async userHasPermission(userId, permissionName) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM user_permissions_view 
       WHERE user_id = ? AND permission_name = ?`,
      [userId, permissionName]
    );
    
    return rows[0].count > 0;
  }

  /**
   * Check if user has any of the required permissions
   * @param {number} userId - User ID
   * @param {Array<string>} permissions - List of permissions
   * @returns {Promise<boolean>} True if has at least one
   */
  async userHasAnyPermission(userId, permissions) {
    if (!permissions || permissions.length === 0) return true;
    
    const placeholders = permissions.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT COUNT(DISTINCT permission_name) as count 
       FROM user_permissions_view 
       WHERE user_id = ? AND permission_name IN (${placeholders})`,
      [userId, ...permissions]
    );
    
    return rows[0].count > 0;
  }

  /**
   * Check if user has all required permissions
   * @param {number} userId - User ID
   * @param {Array<string>} permissions - List of permissions
   * @returns {Promise<boolean>} True if has all
   */
  async userHasAllPermissions(userId, permissions) {
    if (!permissions || permissions.length === 0) return true;
    
    const placeholders = permissions.map(() => '?').join(',');
    const [rows] = await pool.query(
      `SELECT COUNT(DISTINCT permission_name) as count 
       FROM user_permissions_view 
       WHERE user_id = ? AND permission_name IN (${placeholders})`,
      [userId, ...permissions]
    );
    
    return rows[0].count === permissions.length;
  }

  /**
   * Get user roles with permissions
   * @param {number} userId - User ID
   * @returns {Promise<Object>} User roles and permissions
   */
  async getUserRolesAndPermissions(userId) {
    // Get roles
    const [roles] = await pool.query(
      `SELECT r.id, r.name, r.description 
       FROM roles r
       JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = ?`,
      [userId]
    );

    // Get permissions
    const permissions = await this.getUserPermissions(userId);

    return {
      roles,
      permissions
    };
  }
}

module.exports = new PermissionRepository();