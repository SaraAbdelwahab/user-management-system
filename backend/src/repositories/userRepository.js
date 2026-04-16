const pool = require('../config/db');
const User = require('../models/User');

/**
 * Repository Layer - ONLY database queries
 * No business logic here, just raw SQL operations
 */
class UserRepository {

  /**
   * Test database connectivity
   */
  async testQuery() {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    return rows[0];
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    return rows.length ? new User(rows[0]) : null;
  }

  /**
   * Find user by ID
   */
  async findById(id) {
    const [rows] = await pool.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );

    return rows.length ? new User(rows[0]) : null;
  }

  /**
   * Create new user
   */
  async create(userData) {
    const user = userData instanceof User
      ? userData
      : new User(userData);

    const dbData = user.toDatabase();

    const [result] = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, is_active)
       VALUES (?, ?, ?, ?)`,
      [
        dbData.full_name,
        dbData.email,
        dbData.password_hash,
        dbData.is_active
      ]
    );

    user.id = result.insertId;
    return user;
  }

  /**
   * Update refresh token
   */
  async updateRefreshToken(userId, refreshToken) {
    await pool.query(
      'UPDATE users SET refresh_token = ? WHERE id = ?',
      [refreshToken, userId]
    );
  }

  /**
   * Update last login time
   */
  async updateLastLogin(userId) {
    await pool.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = ?',
      [userId]
    );
  }

  /**
   * Check if email exists
   */
  async emailExists(email) {
    const [rows] = await pool.query(
      'SELECT COUNT(*) AS count FROM users WHERE email = ?',
      [email.toLowerCase()]
    );

    return rows[0].count > 0;
  }

  /**
   * Get all users with pagination, search, filters, sorting
   */
  async findAll(options = {}) {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      sortBy = 'created_at',
      sortOrder = 'DESC'
    } = options;

    const offset = (page - 1) * limit;

    let whereConditions = [];
    let queryParams = [];

    // Search
    if (search) {
      whereConditions.push('(full_name LIKE ? OR email LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // Status filter
    if (status === 'active') {
      whereConditions.push('is_active = TRUE');
    } else if (status === 'inactive') {
      whereConditions.push('is_active = FALSE');
    }

    const whereClause = whereConditions.length
      ? `WHERE ${whereConditions.join(' AND ')}`
      : '';

    // Safe sorting
    const allowedSortColumns = [
      'id',
      'full_name',
      'email',
      'created_at',
      'last_login_at'
    ];

    const validSortBy = allowedSortColumns.includes(sortBy)
      ? sortBy
      : 'created_at';

    const validSortOrder = sortOrder.toUpperCase() === 'ASC'
      ? 'ASC'
      : 'DESC';

    // Count query
    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM users ${whereClause}`,
      queryParams
    );

    const total = countResult[0].total;

    // Data query
    const [rows] = await pool.query(
      `
      SELECT 
        id, full_name, email, is_active,
        email_verified_at, last_login_at,
        created_at, updated_at
      FROM users
      ${whereClause}
      ORDER BY ${validSortBy} ${validSortOrder}
      LIMIT ? OFFSET ?
      `,
      [...queryParams, limit, offset]
    );

    return {
      users: rows.map(row => new User(row)),
      total
    };
  }

  /**
   * Update user
   */
  async update(id, updateData) {
    const allowedFields = [
      'full_name',
      'email',
      'is_active',
      'password_hash'
    ];

    const updates = [];
    const values = [];

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        updates.push(`${key} = ?`);

        values.push(
          key === 'email'
            ? updateData[key].toLowerCase()
            : updateData[key]
        );
      }
    });

    if (updates.length === 0) return null;

    values.push(id);

    const [result] = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values
    );

    if (result.affectedRows === 0) return null;

    return this.findById(id);
  }

  /**
   * Delete user (hard delete)
   */
  async delete(id) {
    const [result] = await pool.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Soft delete user
   */
  async softDelete(id) {
    const [result] = await pool.query(
      'UPDATE users SET is_active = FALSE WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  /**
   * Restore user
   */
  async restore(id) {
    const [result] = await pool.query(
      'UPDATE users SET is_active = TRUE WHERE id = ?',
      [id]
    );

    return result.affectedRows > 0;
  }

  /**
   * User statistics
   */
  async getStats() {
    const [result] = await pool.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = FALSE THEN 1 ELSE 0 END) as inactive,
        SUM(CASE WHEN email_verified_at IS NOT NULL THEN 1 ELSE 0 END) as verified,
        SUM(CASE WHEN DATE(created_at) = CURDATE() THEN 1 ELSE 0 END) as today
      FROM users
    `);

    return result[0];
  }

  /**
   * Bulk update user roles (transaction-safe)
   */
  async updateUserRoles(userId, roleIds) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await connection.query(
        'DELETE FROM user_roles WHERE user_id = ?',
        [userId]
      );

      if (roleIds && roleIds.length > 0) {
        const values = roleIds.map(roleId => [userId, roleId]);

        await connection.query(
          'INSERT INTO user_roles (user_id, role_id) VALUES ?',
          [values]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = new UserRepository();