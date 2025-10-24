import { ErrorResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';

export const validateCreateProjectRqst = async (req, res, next) => {
  const errorResponse = ErrorResponse();

  try {
    const { name = '', key = '', description = '' } = req.body;

    // name validations
    const trimmedName = name.trim();
    if (!trimmedName || trimmedName.length < 3 || trimmedName.length > 30) {
      errorResponse.message = 'Project name must be between 3–30 characters';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (!validator.isAlpha(trimmedName.replace(/\s/g, ''))) {
      errorResponse.message =
        'Project name must contain only alphabets and spaces';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (key) {
      const trimmedKey = key.trim();
      if (trimmedKey.length < 2 || trimmedKey.length > 10) {
        errorResponse.message = 'Project key must be between 2–10 characters';
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
      }

      if (!validator.isAlphanumeric(trimmedKey)) {
        errorResponse.message =
          'Project key must be alphanumeric with no spaces';
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
      }
    }

    if (description.trim().length > 500) {
      errorResponse.message = 'Description cannot exceed 500 characters';
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    next();
  } catch (error) {
    console.error('Error in validateCreateProjectRqst middleware:', error);
    errorResponse.message =
      'Something went wrong while validating project creation data';
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};
