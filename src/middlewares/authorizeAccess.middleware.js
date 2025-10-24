import { StatusCodes } from 'http-status-codes';
import {
  ProjectMemberRepository,
  RoleRepository
} from '../repository/index.js';
import { ErrorResponse } from '../utils/common/index.js';
import AppError from '../utils/errors/appError.js';
import mongoose from 'mongoose';

export const authorizeAccess = ({ module, action }) => {
  return async (req, res, next) => {
    const errorResponse = ErrorResponse();

    try {
      const user = req.user;
      const projectId =
        req?.params?.projectId || req?.body?.projectId || req?.query?.projectId;

      if (
        !mongoose.isValidObjectId(user._id) ||
        !mongoose.isValidObjectId(projectId)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Invalid project or user ID',
          data: {}
        });
      }

      if (!projectId) {
        errorResponse.message = 'Access validation failed';
        errorResponse.error = new AppError(
          ['Missing project ID'],
          StatusCodes.BAD_REQUEST
        );
        return res.status(StatusCodes.BAD_REQUEST).json(errorResponse);
      }

      const member = await ProjectMemberRepository.findOne({
        user: user._id,
        project: mongoose.isValidObjectId(projectId)
          ? new mongoose.Types.ObjectId(projectId)
          : projectId,
        status: 'active'
      });

      if (!member) {
        errorResponse.message = 'Access validation failed';
        errorResponse.error = new AppError(
          ['User is not a member of this project'],
          StatusCodes.UNAUTHORIZED
        );
        return res.status(StatusCodes.UNAUTHORIZED).json(errorResponse);
      }

      const role = await RoleRepository.findByPk(member.role);
      if (!role) {
        errorResponse.message = 'Access validation failed';
        errorResponse.error = new AppError(
          ['Assigned role not found'],
          StatusCodes.FORBIDDEN
        );
        return res.status(StatusCodes.FORBIDDEN).json(errorResponse);
      }

      const permissions = role.permissions?.[module] || [];
      const isAuthorized = permissions.includes(action);

      if (!isAuthorized) {
        errorResponse.message = 'Access validation failed';
        errorResponse.error = new AppError(
          [
            `Role '${role.name}' does not have '${action}' permission on '${module}'`
          ],
          StatusCodes.FORBIDDEN
        );
        return res.status(StatusCodes.FORBIDDEN).json(errorResponse);
      }

      req.userRole = {
        role: role.name,
        permissions: role.permissions,
        projectId
      };

      next();
    } catch (error) {
      console.error('Error in authorizeAccess middleware:', error);
      errorResponse.message = 'Authorization check failed';
      errorResponse.error = new AppError(
        ['Internal server error'],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
    }
  };
};
