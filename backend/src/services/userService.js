const userRepository = require('../repositories/userRepository');
const PasswordUtils = require('../utils/passwordUtils');
const ValidationUtils = require('../utils/validationUtils');
const JWTConfig = require('../config/jwt');
const User = require('../models/User');
const pool = require('../config/db');

class UserService {

  async testDatabase() {
    const result = await userRepository.testQuery();

    return {
      success: true,
      message: 'Database connection verified',
      data: result
    };
  }

  // ========================
  // AUTH
  // ========================

  async registerUser(userData) {
    const validation = ValidationUtils.validateRegistration(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const email = userData.email.toLowerCase().trim();

    const emailExists = await userRepository.emailExists(email);
    if (emailExists) {
      throw new Error('Email already registered');
    }

    const passwordHash = await PasswordUtils.hashPassword(userData.password);

    const newUser = new User({
      fullName: ValidationUtils.sanitizeInput(userData.fullName),
      email,
      passwordHash,
      isActive: true
    });

    const createdUser = await userRepository.create(newUser);
    const tokens = await this.generateAuthTokens(createdUser);

    const hashedRefreshToken = await PasswordUtils.hashPassword(tokens.refreshToken);
    await userRepository.updateRefreshToken(createdUser.id, hashedRefreshToken);

    return {
      user: createdUser.toSafeObject(),
      tokens
    };
  }

  async loginUser(credentials) {
    const validation = ValidationUtils.validateLogin(credentials);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    const user = await userRepository.findByEmail(credentials.email);
    if (!user) throw new Error('Invalid email or password');

    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    const valid = await PasswordUtils.comparePassword(
      credentials.password,
      user.passwordHash
    );

    if (!valid) throw new Error('Invalid email or password');

    await userRepository.updateLastLogin(user.id);

    const tokens = await this.generateAuthTokens(user);

    const hashedRefreshToken = await PasswordUtils.hashPassword(tokens.refreshToken);
    await userRepository.updateRefreshToken(user.id, hashedRefreshToken);

    return {
      user: user.toSafeObject(),
      tokens
    };
  }

  async refreshAccessToken(refreshToken) {
    try {
      const decoded = JWTConfig.verifyRefreshToken(refreshToken);

      const user = await userRepository.findById(decoded.id);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      const isValid = await PasswordUtils.comparePassword(
        refreshToken,
        user.refreshToken
      );

      if (!isValid) throw new Error('Invalid refresh token');

      const accessToken = JWTConfig.generateAccessToken({
        id: user.id,
        email: user.email,
        fullName: user.fullName
      });

      return { accessToken };

    } catch (err) {
      throw new Error(`Token refresh failed: ${err.message}`);
    }
  }

  async logoutUser(userId) {
    await userRepository.updateRefreshToken(userId, null);
  }

  // ========================
  // USERS
  // ========================

  async getAllUsers(options) {
    const { users, total } = await userRepository.findAll(options);

    return {
      users: users.map(u => u.toSafeObject()),
      total
    };
  }

  async getUserById(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');

    return user.toSafeObject();
  }

  async updateUser(id, updateData, currentUser) {
    const existing = await userRepository.findById(id);
    if (!existing) throw new Error('User not found');

    if (updateData.is_active === false && currentUser?.id === id) {
      throw new Error('Cannot deactivate your own account');
    }

    if (updateData.email) {
      const email = updateData.email.toLowerCase().trim();

      const existingEmailUser = await userRepository.findByEmail(email);
      if (existingEmailUser && existingEmailUser.id !== id) {
        throw new Error('Email already in use');
      }

      updateData.email = email;
    }

    if (updateData.password) {
      const check = PasswordUtils.validatePasswordStrength(updateData.password);
      if (!check.isValid) {
        throw new Error(check.errors.join(', '));
      }

      updateData.password_hash = await PasswordUtils.hashPassword(updateData.password);
      delete updateData.password;
    }

    const updated = await userRepository.update(id, {
      full_name: updateData.full_name,
      email: updateData.email,
      is_active: updateData.is_active,
      password_hash: updateData.password_hash
    });

    if (updateData.roleIds) {
      await userRepository.updateUserRoles(id, updateData.roleIds);
    }

    return updated.toSafeObject();
  }

  async deleteUser(id, currentUser) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');

    if (currentUser?.id === id) {
      throw new Error('Cannot delete your own account');
    }

    return await userRepository.delete(id);
  }

  async updateProfile(userId, profileData) {
    const updates = {};

    if (profileData.fullName || profileData.full_name) {
      updates.full_name = ValidationUtils.sanitizeInput(
        profileData.fullName || profileData.full_name
      );
    }

    if (profileData.currentPassword && profileData.newPassword) {
      const user = await userRepository.findById(userId);

      const valid = await PasswordUtils.comparePassword(
        profileData.currentPassword,
        user.passwordHash
      );

      if (!valid) throw new Error('Current password is incorrect');

      const check = PasswordUtils.validatePasswordStrength(profileData.newPassword);
      if (!check.isValid) {
        throw new Error(check.errors.join(', '));
      }

      updates.password_hash = await PasswordUtils.hashPassword(profileData.newPassword);
    }

    const updated = await userRepository.update(userId, updates);
    return updated.toSafeObject();
  }

  async getUserStats() {
    return await userRepository.getStats();
  }

  async getAllRoles() {
    const [rows] = await pool.query(
      'SELECT id, name, description FROM roles ORDER BY name'
    );

    return rows;
  }

  // ========================
  // TOKENS
  // ========================

  async generateAuthTokens(user) {
    const payload = {
      id: user.id,
      email: user.email,
      fullName: user.fullName
    };

    return {
      accessToken: JWTConfig.generateAccessToken(payload),
      refreshToken: JWTConfig.generateRefreshToken({
        id: user.id,
        email: user.email
      })
    };
  }
}

module.exports = new UserService();