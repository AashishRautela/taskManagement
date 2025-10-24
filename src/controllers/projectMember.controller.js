import { StatusCodes } from 'http-status-codes';
import { ProjectMemberService } from '../services/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { asyncHandler } from '../utils/helpers/index.js';

export const addMember = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const user = req.user;

  await ProjectMemberService.addMember(req.body, user);

  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const removeMember = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const { memberId } = req.params;
  const { projectId } = req.userRole;

  await ProjectMemberService.removeMember({ projectId, memberId });

  return res.status(StatusCodes.CREATED).json(successResponse);
});

export const getMembersList = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const { projectId } = req.userRole;

  const members = await ProjectMemberService.getMembers(projectId);

  successResponse.data = members;
  return res.status(StatusCodes.CREATED).json(successResponse);
});
