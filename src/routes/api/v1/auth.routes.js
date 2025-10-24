import { AuthController } from '../../../controllers/index.js';
import { AuthMiddleware } from '../../../middlewares/index.js';

import express from 'express';
const router = express.Router();

router.post('/login', AuthMiddleware.validateLoginRqst, AuthController.login);
router.post('/logout', AuthMiddleware.authenticateUser, AuthController.logout);

export default router;
