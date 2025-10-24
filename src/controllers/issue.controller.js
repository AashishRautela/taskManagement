import { IssueService } from '../services/index.js';
import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';

export const createIssue = asyncHandler(async (req, res) => {
  const user = req.user;
  const successResponse = SuccessResponse();

  await IssueService.createIssue(req.body, user);
  return res.status(StatusCodes.CREATED).send(successResponse);
});

export const getIssueDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const successResponse = SuccessResponse();

  const issue = await IssueService.getIssueDetails(id);

  successResponse.data = issue;
  return res.status(StatusCodes.CREATED).send(successResponse);
});

export const getIssues = asyncHandler(async (req, res) => {
  const successResponse = SuccessResponse();
  const { data, meta } = await IssueService.getIssues(req.query);

  successResponse.data = data;
  successResponse.meta = meta;
  return res.status(StatusCodes.CREATED).send(successResponse);
});

export const updateIssue = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  const successResponse = SuccessResponse();

  await IssueService.updateIssue(id, data);
  return res.status(StatusCodes.OK).send(successResponse);
});
