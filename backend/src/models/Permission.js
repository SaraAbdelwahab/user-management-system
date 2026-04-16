class Permission {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.resource = data.resource || '';
    this.action = data.action || '';
    this.createdAt = data.created_at || data.createdAt || new Date();
  }

  // Helper to generate permission name
  static generateName(resource, action) {
    return `${resource}:${action}`;
  }
}

module.exports = Permission;