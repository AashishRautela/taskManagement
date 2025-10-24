import { asyncHandler } from '../utils/helpers/index.js';
import { SuccessResponse } from '../utils/common/index.js';
import { StatusCodes } from 'http-status-codes';
import { StageService } from '../services/index.js';

export const getStages = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const successResponse = SuccessResponse();
  const data = await StageService.getStages({ projectId });
  successResponse.data = data;
  return res.status(StatusCodes.CREATED).send(successResponse);
});
