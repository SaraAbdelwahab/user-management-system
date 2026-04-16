const permissionService = require('../services/permissionService');

/**
 * Permission Middleware Factory
 * Creates middleware that checks specific permissions
 */
class PermissionMiddleware {
  
  /**
   * Check if user has specific permission(s)
   * @param {string|Array<string>} requiredPermissions - Permission(s) required
   * @param {Object} options - { mode: 'any' | 'all', allowAdmin: boolean }
   */
  checkPermission(requiredPermissions, options = {}) {
    const { mode = 'any', allowAdmin = true } = options;
    
    return async (req, res, next) => {
      try {
        // 1. Ensure user is authenticated
        if (!req.user) {
          return res.status(401).json({
            success: false,
            message: 'Authentication required'
          });
        }

        // 2. Admin override (Super Admin / Admin can do anything)
        if (allowAdmin && req.user.isAdmin) {
          return next();
        }

        // 3. Check permissions
        const hasPermission = await permissionService.canUser(
          req.user.id,
          requiredPermissions,
          mode
        );

        if (!hasPermission) {
          const permissionList = Array.isArray(requiredPermissions) 
            ? requiredPermissions.join(' or ') 
            : requiredPermissions;
            
          return res.status(403).json({
            success: false,
            message: `Insufficient permissions. Required: ${permissionList}`,
            required: requiredPermissions,
            userPermissions: req.user.permissions
          });
        }

        next();
        
      } catch (error) {
        console.error('Permission Middleware Error:', error);
        return res.status(500).json({
          success: false,
          message: 'Authorization check failed'
        });
      }
    };
  }

  /**
   * Predefined permission checks for common operations
   */
  canCreateUser() {
    return this.checkPermission('users:create');
  }

  canReadUser() {
    return this.checkPermission('users:read');
  }

  canUpdateUser() {
    return this.checkPermission('users:update');
  }

  canDeleteUser() {
    return this.checkPermission('users:delete');
  }

  canManageRoles() {
    return this.checkPermission(['roles:create', 'roles:update', 'roles:delete'], { mode: 'any' });
  }

  isAdmin() {
    return this.checkPermission([], {
      allowAdmin: true,
      customCheck: (req) => req.user?.isAdmin === true
    });
  }
}

module.exports = new PermissionMiddleware();