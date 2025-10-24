import { UserController } from '../../../controllers/index.js';
import express from 'express';
import { AuthMiddleware, UserMiddleware } from '../../../middlewares/index.js';
const router = express.Router();

router.post('/', UserMiddleware.validateCreateUser, UserController.createUser);
router.post('/verify', UserMiddleware.validateOtp, UserController.verifyUser);
router.get(
  '/:id',
  AuthMiddleware.authenticateUser,
  UserController.getUserDetails
);
router.get('/', AuthMiddleware.authenticateUser, UserController.getUsers);

export default router;
