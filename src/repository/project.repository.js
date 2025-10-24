import CrudRepository from './crud.repository.js';
import { Project, ProjectMember } from '../models/index.js';
import AppError from '../utils/errors/appError.js';

class ProjectRepository extends CrudRepository {
  constructor() {
    super(Project);
  }

  async findByPk(data) {
    const response = await this.model.findById(data).populate([
      { path: 'createdBy', select: '-createdAt -updatedAt -__v' },
      { path: 'updatedBy', select: '-createdAt -updatedAt -__v' },
      { path: 'manager', select: '-createdAt -updatedAt -__v' },
      {
        path: 'defaultAssignee',
        select: '-createdAt -updatedAt -__v'
      }
    ]);

    if (!response) {
      throw new AppError(['Project Not found'], StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async getUserProjectList(id, options = {}) {
    const { page = 1, limit = 10 } = options;

    const pipeline = [
      {
        $match: { user: id, status: { $ne: 'removed' } }
      },
      {
        $lookup: {
          from: 'projects',
          let: { pid: '$project' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
            {
              $project: {
                name: 1,
                key: 1,
                status: 1,
                startDate: 1,
                endDate: 1,
                createdAt: 1,
                updatedAt: 1,
                createdBy: 1,
                manager: 1,
                projectIcon: 1
              }
            }
          ],
          as: 'project'
        }
      },
      { $unwind: '$project' },
      {
        $lookup: {
          from: 'users',
          let: { uid: '$project.createdBy' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
            {
              $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
                profileColor: 1,
                avatar: 1
              }
            }
          ],
          as: 'createdBy'
        }
      },
      { $unwind: '$createdBy' },
      {
        $lookup: {
          from: 'users',
          let: { uid: '$project.manager' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$uid'] } } },
            {
              $project: {
                _id: 0,
                firstName: 1,
                lastName: 1,
                profileColor: 1,
                avatar: 1
              }
            }
          ],
          as: 'manager'
        }
      },
      { $unwind: '$manager' },
      {
        $lookup: {
          from: 'roles',
          let: { rid: '$role' },
          pipeline: [
            { $match: { $expr: { $eq: ['$_id', '$$rid'] } } },
            {
              $project: {
                name: 1,
                _id: 0
              }
            }
          ],
          as: 'role'
        }
      },
      { $unwind: '$role' },
      {
        $lookup: {
          from: 'projectmembers',
          let: { pid: '$project._id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$project', '$$pid'] },
                    { $ne: ['$status', 'removed'] }
                  ]
                }
              }
            },
            { $count: 'count' }
          ],
          as: 'memberCount'
        }
      },
      {
        $addFields: {
          teamSize: {
            $ifNull: [{ $arrayElemAt: ['$memberCount.count', 0] }, 0]
          }
        }
      },
      {
        $project: {
          _id: 0,
          projectId: '$project._id',
          name: '$project.name',
          key: '$project.key',
          status: '$project.status',
          startDate: '$project.startDate',
          endDate: '$project.endDate',
          projectIcon: '$project.projectIcon',

          userRole: '$role.name',
          teamSize: 1,

          createdBy: {
            firstName: '$createdBy.firstName',
            lastName: '$createdBy.lastName',
            avatar: '$createdBy.avatar',
            profileColor: '$createdBy.profileColor'
          },
          manager: {
            firstName: '$manager.firstName',
            lastName: '$manager.lastName',
            avatar: '$manager.avatar',
            profileColor: '$manager.profileColor'
          },

          membershipStatus: '$status',
          joinedAt: '$createdAt'
        }
      }
    ];

    const aggregate = Project.aggregate(pipeline);

    const result = await ProjectMember.aggregatePaginate(aggregate, {
      page,
      limit,
      allowDiskUse: true
    });
    const {
      docs,
      totalDocs,
      totalPages,
      page: curPage,
      limit: curLimit
    } = result;

    return {
      data: docs,
      meta: {
        page: curPage,
        limit: curLimit,
        total: totalDocs,
        totalPages,
        hasNext: curPage < totalPages,
        hasPrev: curPage > 1
      }
    };
  }

  async reserveIssueKey(projectId, options = {}) {
    return await Project.reserveIssueKey(projectId);
  }
}

export default new ProjectRepository();
