USE user_management;

-- =====================================================
-- 1. INSERT DEFAULT ROLES
-- =====================================================
INSERT INTO roles (name, description, is_system_role) VALUES
('Super Admin', 'Full system access. Cannot be modified or deleted.', TRUE),
('Admin', 'Administrative access to manage users and roles.', TRUE),
('Manager', 'Can view and edit users but cannot manage roles.', TRUE),
('Viewer', 'Read-only access to user data.', TRUE);

-- =====================================================
-- 2. INSERT PERMISSIONS (CRUD for each resource)
-- =====================================================
INSERT INTO permissions (name, resource, action, description) VALUES
-- User Management
('users:create', 'users', 'create', 'Create new users'),
('users:read', 'users', 'read', 'View user details'),
('users:update', 'users', 'update', 'Edit user information'),
('users:delete', 'users', 'delete', 'Delete users'),
('users:activate', 'users', 'activate', 'Activate/deactivate users'),

-- Role Management
('roles:create', 'roles', 'create', 'Create new roles'),
('roles:read', 'roles', 'read', 'View roles'),
('roles:update', 'roles', 'update', 'Edit roles'),
('roles:delete', 'roles', 'delete', 'Delete roles'),

-- Permission Management
('permissions:read', 'permissions', 'read', 'View permissions'),
('permissions:assign', 'permissions', 'assign', 'Assign permissions to roles'),

-- System Settings
('settings:read', 'settings', 'read', 'View system settings'),
('settings:update', 'settings', 'update', 'Modify system settings');

-- =====================================================
-- 3. ASSIGN PERMISSIONS TO ROLES
-- =====================================================

-- Super Admin: ALL permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Admin: Most permissions except role deletion and Super Admin stuff
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions 
WHERE name NOT IN ('roles:delete', 'permissions:assign');

-- Manager: User management only
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions 
WHERE resource = 'users' AND action IN ('create', 'read', 'update');

-- Viewer: Read-only
INSERT INTO role_permissions (role_id, permission_id)
SELECT 4, id FROM permissions 
WHERE action = 'read';

-- =====================================================
-- 4. CREATE DEFAULT SUPER ADMIN USER
-- Password: "Admin@123" (bcrypt hash - we'll generate this properly in Phase 4)
-- =====================================================
INSERT INTO users (full_name, email, password_hash, email_verified_at, is_active) VALUES
('System Administrator', 'admin@system.com', '$2b$10$PLACEHOLDER_HASH_WILL_BE_REPLACED', NOW(), TRUE);

-- Assign Super Admin role to the default admin
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT 1, 1, 1;