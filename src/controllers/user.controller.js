import { UserService } from '../services/index.js';
import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import { randomInt } from 'crypto';

export const createUser = asyncHandler(async (req, res) => {
  const data = req.body;
  await UserService.createUser(data);

  const successResponse = SuccessResponse();

  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const verifyUser = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await UserService.verifyAndRegisterUser({ email, otp });

  const successResponse = SuccessResponse();
  successResponse.data = {};
  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const getUserDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const successResponse = SuccessResponse();

  const user = await UserService.getUserDetails(id);
  successResponse.data = user;
  return res.status(StatusCodes.CREATED).json(successResponse);
});
