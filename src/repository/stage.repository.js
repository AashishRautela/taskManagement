import { Stage } from '../models/index.js';
import CrudRepository from './crud.repository.js';
import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/errors/appError.js';

class StageRepository extends CrudRepository {
  constructor() {
    super(Stage);
  }

  async findAll(data) {
    const response = await this.model.find(data).select('_id name color');

    if (!response || response.length === 0) {
      throw new AppError(['Resource Not found'], StatusCodes.NOT_FOUND);
    }

    return response;
  }
}

export default new StageRepository();
