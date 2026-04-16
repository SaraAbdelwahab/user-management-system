const jwt = require('jsonwebtoken');

/**
 * JWT Configuration & Helper Functions
 * Centralized token management for consistency
 */
class JWTConfig {
  
  /**
   * Generate Access Token (Short-lived)
   * @param {Object} payload - User data (id, email, roles)
   * @returns {string} JWT access token
   */
  static generateAccessToken(payload) {
    return jwt.sign(
      { ...payload, type: 'access' },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m' }
    );
  }

  /**
   * Generate Refresh Token (Long-lived)
   * @param {Object} payload - User data (id, email)
   * @returns {string} JWT refresh token
   */
  static generateRefreshToken(payload) {
    return jwt.sign(
      { ...payload, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d' }
    );
  }

  /**
   * Verify Access Token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    } catch (error) {
      throw new Error(`Invalid access token: ${error.message}`);
    }
  }

  /**
   * Verify Refresh Token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      throw new Error(`Invalid refresh token: ${error.message}`);
    }
  }

  /**
   * Decode token without verification (for debugging only)
   * @param {string} token - JWT token
   * @returns {Object} Decoded payload
   */
  static decodeToken(token) {
    return jwt.decode(token);
  }
}

module.exports = JWTConfig;