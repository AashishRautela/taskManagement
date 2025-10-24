import mongoose from 'mongoose';
import AppError from '../utils/errors/appError.js';
import { StatusCodes } from 'http-status-codes';
import { StageRepository } from '../repository/index.js';

export const getStages = async (data) => {
  try {
    const { projectId } = data;

    const stages = await StageRepository.findAll({
      project: new mongoose.Types.ObjectId(projectId)
    });

    return stages;
  } catch (error) {
    console.error('error--->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while getting stages'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
