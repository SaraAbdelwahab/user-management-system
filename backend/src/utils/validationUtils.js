/**
 * Input Validation Utilities
 * Prevent SQL injection and XSS by validating inputs
 */
class ValidationUtils {
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Sanitize user input (remove HTML tags, trim whitespace)
   * @param {string} input - User input
   * @returns {string} Sanitized input
   */
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove HTML tags, trim whitespace, normalize spaces
    return input
      .replace(/<[^>]*>/g, '')
      .trim()
      .replace(/\s+/g, ' ');
  }

  /**
   * Validate registration input
   * @param {Object} data - Registration data
   * @returns {Object} { isValid, errors }
   */
  static validateRegistration(data) {
    const errors = [];
    const { fullName, email, password, confirmPassword } = data;

    // Full Name validation
    if (!fullName || fullName.length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }
    if (fullName && fullName.length > 100) {
      errors.push('Full name must be less than 100 characters');
    }

    // Email validation
    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Invalid email format');
    }

    // Password validation
    if (!password) {
      errors.push('Password is required');
    } else {
      const passwordCheck = require('./passwordUtils').validatePasswordStrength(password);
      if (!passwordCheck.isValid) {
        errors.push(...passwordCheck.errors);
      }
    }

    // Confirm password
    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate login input
   * @param {Object} data - Login data
   * @returns {Object} { isValid, errors }
   */
  static validateLogin(data) {
    const errors = [];
    const { email, password } = data;

    if (!email) {
      errors.push('Email is required');
    } else if (!this.isValidEmail(email)) {
      errors.push('Invalid email format');
    }

    if (!password) {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = ValidationUtils;