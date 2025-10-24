import { StatusCodes } from 'http-status-codes';
import { ErrorResponse } from '../utils/common/index.js';
import { RoleRepository } from '../repository/index.js';
import AppError from '../utils/errors/appError.js';

export const validateAddMemberRequest = async (req, res, next) => {
  const errorResponse = ErrorResponse();

  try {
    const { members = [] } = req.body;

    if (!Array.isArray(members) || members.length === 0) {
      errorResponse.message = 'Invalid add member request';
      errorResponse.error = new AppError(
        ['No members provided'],
        StatusCodes.BAD_REQUEST
      );
      return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
    }

    const role = await RoleRepository.findOne({ name: 'developer' });

    if (!role) {
      errorResponse.message = 'Invalid add member request';
      errorResponse.error = new AppError(
        ['Default role "developer" not found'],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }

    for (const member of members) {
      if (!member.user) {
        errorResponse.message = 'Invalid add member request';
        errorResponse.error = new AppError(
          ['User ID is required for each member'],
          StatusCodes.BAD_REQUEST
        );
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
      }

      if (!member.role) {
        member.role = role._id;
      }
    }

    next();
  } catch (error) {
    console.error('Error in validateAddMemberRequest middleware:', error);
    errorResponse.message = 'Unexpected error during member validation';
    errorResponse.error = new AppError(
      ['Internal server error'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
};
