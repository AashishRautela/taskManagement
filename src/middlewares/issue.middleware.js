import { ErrorResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import { ENUMS } from '../utils/common/index.js';

const issue = ENUMS.ISSUE;

export const validateCreateIssueRequest = async (req, res, next) => {
  const errorResponse = ErrorResponse();
  try {
    const { projectId, title, type, epic } = req.body;

    if (!projectId || !title.trim() || !type) {
      errorResponse.message = 'Request data missing';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (type && type == issue.STORY && !epic) {
      errorResponse.message = 'Request data missing';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (title.trim().length < 10 || title.trim().length > 50) {
      errorResponse.message = 'Issue name must be between 10-50 characters';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    next();
  } catch (error) {
    console.error('Error in validateEpicProjectRqst middleware:', error);
    errorResponse.message =
      'Something went wrong while validating issue creation data';
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};
