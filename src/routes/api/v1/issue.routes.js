import { IssueController } from '../../../controllers/index.js';
import {
  AuthMiddleware,
  AuthorizeAccess,
  IssueMiddleware
} from '../../../middlewares/index.js';

import express from 'express';
const router = express.Router();

const module = 'task';
router.post(
  '/',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module, action: 'create' }),
  IssueMiddleware.validateCreateIssueRequest,
  IssueController.createIssue
);

router.get(
  '/',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module, action: 'view' }),
  IssueController.getIssues
);

router.get(
  '/:id/:projectId',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module, action: 'view' }),
  IssueController.getIssueDetails
);

router.patch(
  '/:id/:projectId',
  AuthMiddleware.authenticateUser,
  AuthorizeAccess.authorizeAccess({ module, action: 'edit' }),
  IssueController.updateIssue
);

export default router;
