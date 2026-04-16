/**
 * User Model - Represents the users table structure
 * Used for type safety and documentation
 */
class User {
  constructor(data = {}) {
    this.id = data.id || null;
    this.fullName = data.full_name || data.fullName || '';
    this.email = data.email ? data.email.toLowerCase() : '';
    this.passwordHash = data.password_hash || data.passwordHash || null;
    this.isActive = data.is_active !== undefined ? data.is_active : true;
    this.emailVerifiedAt = data.email_verified_at || data.emailVerifiedAt || null;
    this.lastLoginAt = data.last_login_at || data.lastLoginAt || null;
    this.refreshToken = data.refresh_token || data.refreshToken || null;
    this.createdAt = data.created_at || data.createdAt || new Date();
    this.updatedAt = data.updated_at || data.updatedAt || new Date();
  }

  // Convert to database format
  toDatabase() {
    return {
      full_name: this.fullName,
      email: this.email,
      password_hash: this.passwordHash,
      is_active: this.isActive,
      email_verified_at: this.emailVerifiedAt,
      last_login_at: this.lastLoginAt,
      refresh_token: this.refreshToken
    };
  }

  // Safe user object (remove sensitive data)
  toSafeObject() {
    return {
      id: this.id,
      fullName: this.fullName,
      email: this.email,
      isActive: this.isActive,
      emailVerifiedAt: this.emailVerifiedAt,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = User;