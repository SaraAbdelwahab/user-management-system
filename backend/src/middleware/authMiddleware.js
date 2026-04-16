const JWTConfig = require('../config/jwt');
const userRepository = require('../repositories/userRepository');
const permissionService = require('../services/permissionService');

/**
 * Authentication Middleware
 * Validates JWT and attaches user to request
 */
class AuthMiddleware {
  
  /**
   * Verify JWT and attach user to request
   */
  async authenticate(req, res, next) {
    try {
      // 1. Get token from header
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. No token provided.'
        });
      }

      const token = authHeader.split(' ')[1];

      // 2. Verify token
      let decoded;
      try {
        decoded = JWTConfig.verifyAccessToken(token);
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token',
          error: error.message
        });
      }

      // 3. Check token type
      if (decoded.type !== 'access') {
        return res.status(401).json({
          success: false,
          message: 'Invalid token type'
        });
      }

      // 4. Get fresh user data from database (optional but recommended)
      const user = await userRepository.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      // 5. Check if user is active
      if (!user.isActive) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated'
        });
      }

      // 6. Get user permissions
      const authData = await permissionService.getUserAuthorizationData(user.id);

      // 7. Attach to request object
      req.user = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: authData.roles,
        permissions: authData.permissions,
        isAdmin: authData.isAdmin
      };

      next();
      
    } catch (error) {
      console.error('Auth Middleware Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  /**
   * Optional authentication (doesn't fail if no token)
   */
  async optionalAuth(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        
        try {
          const decoded = JWTConfig.verifyAccessToken(token);
          const user = await userRepository.findById(decoded.id);
          
          if (user && user.isActive) {
            const authData = await permissionService.getUserAuthorizationData(user.id);
            
            req.user = {
              id: user.id,
              email: user.email,
              fullName: user.fullName,
              roles: authData.roles,
              permissions: authData.permissions,
              isAdmin: authData.isAdmin
            };
          }
        } catch (error) {
          // Token invalid, but we don't care for optional auth
        }
      }
      
      next();
      
    } catch (error) {
      // Continue without user
      next();
    }
  }
}

module.exports = new AuthMiddleware();