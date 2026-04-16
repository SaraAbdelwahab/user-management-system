class Role {
  constructor(data = {}) {
    this.id = data.id || null;
    this.name = data.name || '';
    this.description = data.description || '';
    this.isSystemRole = data.is_system_role || data.isSystemRole || false;
    this.createdAt = data.created_at || data.createdAt || new Date();
    this.updatedAt = data.updated_at || data.updatedAt || new Date();
    this.permissions = data.permissions || []; // Array of Permission objects
  }

  toDatabase() {
    return {
      name: this.name,
      description: this.description,
      is_system_role: this.isSystemRole
    };
  }
}

module.exports = Role;