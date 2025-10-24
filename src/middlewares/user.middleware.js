import { ErrorResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import validator from 'validator';
import AppError from '../utils/errors/appError.js';

export const validateCreateUser = (req, res, next) => {
  try {
    const { firstName, email, password, userName } = req.body;
    const errorResponse = ErrorResponse();

    if (!firstName || !email || !password || !userName) {
      errorResponse.message = 'Validation failed while creating user';
      errorResponse.error = new AppError(
        ['Missing required fields: firstName, userName, email, or password'],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (!validator.isEmail(email)) {
      errorResponse.message = 'Validation failed while creating user';
      errorResponse.error = new AppError(
        ['Invalid email format'],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    if (password.length < 6) {
      errorResponse.message = 'Validation failed while creating user';
      errorResponse.error = new AppError(
        ['Password must be at least 6 characters'],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    next(); // Everything is fine, continue to the controller
  } catch (error) {
    // Catch any unexpected errors, like typos or undefined variables
    const errorResponse = ErrorResponse();
    errorResponse.message = 'Unexpected error while validating user';
    errorResponse.error = new AppError(
      [error.message || 'Unknown error'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};

export const validateOtp = (req, res, next) => {
  const { email, otp } = req.body;
  const errorResponse = ErrorResponse();

  if (!email || !otp) {
    errorResponse.message = 'Validation failed for OTP request';
    errorResponse.error = new AppError(
      ['Missing required fields: email or otp'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (!validator.isEmail(email)) {
    errorResponse.message = 'Validation failed for OTP request';
    errorResponse.error = new AppError(
      ['Invalid email format'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (otp.length !== 6) {
    errorResponse.message = 'Validation failed for OTP request';
    errorResponse.error = new AppError(
      ['OTP must be exactly 6 characters'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  next();
};
