const userService = require('../services/userService');
const QueryUtils = require('../utils/queryUtils');

class UserController {

  
  // HEALTH CHECK
  
  async testEndpoint(req, res) {
    try {
      const result = await userService.testDatabase();

      res.status(200).json({
        success: true,
        message: 'Backend pipeline is working perfectly',
        pipeline: 'Route → Controller → Service → Repository → Database',
        result: result.data
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

 
  // AUTH
  

  async register(req, res) {
    try {
      const result = await userService.registerUser(req.body);

        if (global.socketIO) {
      global.socketIO.emitAdminUpdate('user:created', {
        user: result.user
      });
    }

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });

    } catch (error) {
      const status = error.message.includes('already') ? 400 : 500;

      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const result = await userService.loginUser(req.body);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });

    } catch (error) {
      const status = error.message.includes('Invalid') ? 401 : 500;

      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }

      const result = await userService.refreshAccessToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: result
      });

    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async logout(req, res) {
    try {
      if (req.user?.id) {
        await userService.logoutUser(req.user.id);
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  
  // USER PROFILE
  

  async getProfile(req, res) {
    try {
      const user = await userService.getUserById(req.user.id);

      res.status(200).json({
        success: true,
        data: { user }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateProfile(req, res) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: { user }
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // ADMIN USERS
  

  async getAllUsers(req, res, next) {
    try {
      const { page, limit } = QueryUtils.parsePagination(req.query);

      const result = await userService.getAllUsers({
        page,
        limit,
        search: req.query.search,
        status: req.query.status,
        sortBy: req.query.sortBy,
        sortOrder: req.query.sortOrder
      });

      const metadata = QueryUtils.buildPaginationMetadata(
        result.total,
        page,
        limit
      );

      res.status(200).json({
        success: true,
        data: result.users,
        pagination: metadata,
        filters: {
          search: req.query.search || null,
          status: req.query.status || null,
          sortBy: req.query.sortBy || 'created_at',
          sortOrder: req.query.sortOrder || 'DESC'
        }
      });

    } catch (error) {
      next(error);
    }
  }

  async getUserById(req, res) {
    try {
      const user = await userService.getUserById(parseInt(req.params.id));

      res.status(200).json({
        success: true,
        data: { user }
      });

    } catch (error) {
      const status = error.message === 'User not found' ? 404 : 500;

      res.status(status).json({
        success: false,
        message: error.message
      });
    }

    
  }


  async updateUser(req, res) {
    try {

      const id = parseInt(req.params.id);
      const user = await userService.updateUser(
         id,
        req.body,
        req.user
      );

      if (global.socketIO) {
      global.socketIO.emitAdminUpdate('user:updated', {
        userId: id,
        updates: req.body
      });

      global.socketIO.emitUserUpdate(id, 'profile:updated', {
        message: 'Your profile was updated by admin'
      });
    }

      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });

    } catch (error) {
      const status =
        error.message.includes('not found') ? 404 : 400;

      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }


  async deleteUser(req, res) {
    try {

      const id = parseInt(req.params.id);
      await userService.deleteUser(
        id,
        req.user
      );

       if (global.socketIO) {
      global.socketIO.emitAdminUpdate('user:deleted', {
        userId: id
      });
    }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error) {
      const status =
        error.message.includes('not found') ? 404 : 400;

      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  async getUserStats(req, res) {
    try {
      const stats = await userService.getUserStats();

      res.status(200).json({
        success: true,
        data: stats
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  } 

 
  async getAllRoles(req, res) {
    try {
      const roles = await userService.getAllRoles();

      res.status(200).json({
        success: true,
        data: roles
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController();