/**
 * Query Utilities - Pagination, Sorting, Filtering
 * Standardizes API query parameters across all endpoints
 */
class QueryUtils {
  
  /**
   * Parse pagination parameters
   * @param {Object} query - Express request.query
   * @returns {Object} { page, limit, offset }
   */
  static parsePagination(query) {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
    const offset = (page - 1) * limit;
    
    return { page, limit, offset };
  }

  /**
   * Parse sorting parameters
   * @param {Object} query - Express request.query
   * @param {string} defaultSort - Default sort column
   * @param {Array} allowedColumns - Allowed sort columns (prevents SQL injection)
   * @returns {string} ORDER BY clause
   */
  static parseSorting(query, defaultSort = 'created_at', allowedColumns = []) {
    const sortBy = query.sortBy || defaultSort;
    const sortOrder = (query.sortOrder || 'DESC').toUpperCase();
    
    // Validate sort column (prevent SQL injection)
    if (allowedColumns.length > 0 && !allowedColumns.includes(sortBy)) {
      return `${defaultSort} DESC`;
    }
    
    // Validate sort order
    if (!['ASC', 'DESC'].includes(sortOrder)) {
      return `${sortBy} DESC`;
    }
    
    return `${sortBy} ${sortOrder}`;
  }

  /**
   * Parse search filter
   * @param {Object} query - Express request.query
   * @param {Array} searchableFields - Fields to search in
   * @returns {Object} { searchTerm, searchCondition }
   */
  static parseSearch(query, searchableFields = ['full_name', 'email']) {
    const search = query.search || '';
    
    if (!search || searchableFields.length === 0) {
      return { searchTerm: '', searchCondition: '' };
    }
    
    const searchTerm = `%${search}%`;
    const conditions = searchableFields.map(field => `${field} LIKE ?`).join(' OR ');
    
    return {
      searchTerm,
      searchCondition: `AND (${conditions})`,
      searchParams: Array(searchableFields.length).fill(searchTerm)
    };
  }

  /**
   * Parse status filter
   * @param {Object} query - Express request.query
   * @returns {Object} { statusFilter, statusParams }
   */
  static parseStatusFilter(query) {
    const status = query.status;
    
    if (status === 'active') {
      return { statusFilter: 'AND is_active = TRUE', statusParams: [] };
    } else if (status === 'inactive') {
      return { statusFilter: 'AND is_active = FALSE', statusParams: [] };
    }
    
    return { statusFilter: '', statusParams: [] };
  }

  /**
   * Build pagination metadata
   * @param {number} total - Total records
   * @param {number} page - Current page
   * @param {number} limit - Records per page
   * @returns {Object} Pagination metadata
   */
  static buildPaginationMetadata(total, page, limit) {
    const totalPages = Math.ceil(total / limit);
    
    return {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    };
  }

  /**
   * Format paginated response
   * @param {Array} data - Records
   * @param {Object} metadata - Pagination metadata
   * @returns {Object} Standardized response
   */
  static paginatedResponse(data, metadata) {
    return {
      data,
      pagination: {
        total: metadata.total,
        page: metadata.page,
        limit: metadata.limit,
        totalPages: metadata.totalPages,
        hasNext: metadata.hasNext,
        hasPrev: metadata.hasPrev
      }
    };
  }
}

module.exports = QueryUtils;