const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

const router = express.Router();

// PUBLIC ROUTES

router.get('/test', userController.testEndpoint);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/refresh', userController.refreshToken);


// PROTECTED ROUTES

router.use(authMiddleware.authenticate);


// USER SELF SERVICE

router.post('/logout', userController.logout);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);


// STATS (ADMIN / STAFF)


router.get(
  '/stats',
  authMiddleware.authenticate,
  userController.getUserStats
);




// USER MANAGEMENT

router.get(
  '/',
  permissionMiddleware.canReadUser(),
  userController.getAllUsers
);

router.get(
  '/:id',
  permissionMiddleware.canReadUser(),
  userController.getUserById
);

router.put(
  '/:id',
  permissionMiddleware.canUpdateUser(),
  userController.updateUser
);

router.delete(
  '/:id',
  permissionMiddleware.canDeleteUser(),
  userController.deleteUser
);


// ROLE MANAGEMENT (ADMIN ONLY)
router.get(
  '/roles/all',
  permissionMiddleware.isAdmin(),
  userController.getAllRoles
);

module.exports = router;