import { ProjectService } from '../services/index.js';
import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';

export const createProject = asyncHandler(async (req, res) => {
  const user = req.user;
  const successResponse = SuccessResponse();
  await ProjectService.create(req.body, user);
  return res.status(StatusCodes.CREATED).send(successResponse);
});

export const getProjectDetails = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const successResponse = SuccessResponse();

  const project = await ProjectService.getProjectDetails(projectId);

  successResponse.data = project;
  return res.status(StatusCodes.OK).send(successResponse);
});

export const updateProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const data = req.body;
  const successResponse = SuccessResponse();

  await ProjectService.updateProject(projectId, data);
  return res.status(StatusCodes.OK).send(successResponse);
});

export const deleteProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const successResponse = SuccessResponse();

  await ProjectService.deleteProject(projectId);
  return res.status(StatusCodes.OK).send(successResponse);
});

export const getProjectList = asyncHandler(async (req, res) => {
  const user = req.user;
  const successResponse = SuccessResponse();

  const { data, meta } = await ProjectService.getProjectList(user);
  successResponse.data = data;
  successResponse.meta = meta;
  return res.status(StatusCodes.OK).send(successResponse);
});
