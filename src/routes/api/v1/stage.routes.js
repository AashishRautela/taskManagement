import { StageController } from '../../../controllers/index.js';
import express from 'express';
import { AuthMiddleware } from '../../../middlewares/index.js';
const router = express.Router();

router.get(
  '/:projectId',
  AuthMiddleware.authenticateUser,
  StageController.getStages
);

export default router;
