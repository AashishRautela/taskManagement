import { StatusCodes } from 'http-status-codes';
import { Issue } from '../models/index.js';
import CrudRepository from './crud.repository.js';
import AppError from '../utils/errors/appError.js';

class IssueRepository extends CrudRepository {
  constructor() {
    super(Issue);
  }

  async findByPk(data) {
    const response = await this.model
      .findById(data)
      .populate([
        {
          path: 'createdBy',
          select: '-createdAt -updatedAt -email -__v'
        },
        {
          path: 'assignee',
          select: '-createdAt -updatedAt -email -__v'
        },
        {
          path: 'reporter',
          select: '-createdAt -updatedAt -email -__v'
        },
        {
          path: 'updatedBy',
          select: '-createdAt -updatedAt -email -__v'
        },
        { path: 'epic', select: '_id title key' },
        { path: 'parent', select: '_id title type' },
        { path: 'stage', select: '_id name color' }
      ])
      .select('-project');

    if (!response) {
      throw new AppError(['Issue Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async find(filters, { page, limit, sort }) {
    const skip = (page - 1) * limit;

    const select =
      '-project -parent -id -epic -createdBy -updatedBy -reporter -description -spentEstimate -overrunMinutes -remainingEstimate -updatedAt -createdAt -attachments -watchers -labels';

    const [response, total] = await Promise.all([
      this.model
        .find(filters)
        .populate([
          {
            path: 'assignee',
            select: '-createdAt -updatedAt -email -__v'
          },
          { path: 'stage', select: '_id name color' }
        ])
        .select(select)
        .skip(skip)
        .sort(sort)
        .limit(limit),
      this.model.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: response,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  }
}

export default new IssueRepository();
