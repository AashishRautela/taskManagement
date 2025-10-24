import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '../utils/common/index.js';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/index.js';
import AppError from '../utils/errors/appError.js';

/**
 * Middleware to validate login request payload
 */
export const validateLoginRqst = async (req, res, next) => {
  const { email = '', password = '' } = req.body;
  const errorResponse = ErrorResponse();

  if (!email.trim() || !password.trim()) {
    errorResponse.message = 'Login validation failed';
    errorResponse.error = new AppError(
      ['Email and password are required'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  if (!validator.isEmail(email)) {
    errorResponse.message = 'Login validation failed';
    errorResponse.error = new AppError(
      ['Invalid email format'],
      StatusCodes.BAD_REQUEST
    );
    return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
  }

  next();
};

/**
 * Middleware to authenticate user using JWT
 */
export const authenticateUser = async (req, res, next) => {
  const { accessToken } = req.cookies;
  const errorResponse = ErrorResponse();

  if (!accessToken) {
    errorResponse.message = 'Authentication failed.Please Login first';
    errorResponse.error = new AppError(
      ['Unauthorized Request'],
      StatusCodes.UNAUTHORIZED
    );
    return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
  }

  try {
    const { _id } = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    const user = await UserRepository.findByPk(_id);

    if (!user) {
      errorResponse.message = 'Authentication failed';
      errorResponse.error = new AppError(
        ['User not found for the given token'],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verify error:', err.message);
    errorResponse.message = 'Authentication failed';
    errorResponse.error = new AppError(
      ['Token is invalid or expired'],
      StatusCodes.UNAUTHORIZED
    );
    return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
  }
};
