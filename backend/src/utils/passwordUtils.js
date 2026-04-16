const bcrypt = require('bcrypt');

/**
 * Password Utilities - Bcrypt hashing and validation
 * Industry standard for password security
 */
class PasswordUtils {
  
  /**
   * Hash a plain text password
   * @param {string} password - Plain text password
   * @returns {Promise<string>} Hashed password
   */
  static async hashPassword(password) {
    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
    return await bcrypt.hash(password, saltRounds);
  }

  /**
   * Compare plain text password with hash
   * @param {string} password - Plain text password
   * @param {string} hash - Hashed password from database
   * @returns {Promise<boolean>} True if match
   */
  static async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {Object} { isValid: boolean, errors: string[] }
   */
  static validatePasswordStrength(password) {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = PasswordUtils;