import { StatusCodes } from 'http-status-codes';
import { IssueRepository, ProjectRepository } from '../repository/index.js';
import { ENUMS } from '../utils/common/index.js';
import AppError from '../utils/errors/appError.js';
const priority = ENUMS.PRIORITY;
import { getFieldToUpdate } from '../utils/helpers/index.js';

export const createIssue = async (data, user) => {
  try {
    let assignee = data?.assignee || null;
    let reporter = data?.reporter || null;

    const project = await ProjectRepository.findByPk(data.projectId);
    if (!assignee) {
      const defaultAssignee = project.defaultAssignee;
      assignee = defaultAssignee?._id;
    }

    if (!reporter) {
      const defaultReporter = project.manager;
      reporter = defaultReporter?._id;
    }

    const key = await ProjectRepository.reserveIssueKey(data.projectId, {});

    const payload = {
      title: data.title,
      type: data.type,
      project: data.projectId,
      epic: data.epic || null,
      parent: data.parent || null,
      priority: data.priority || priority.MEDIUM,
      createdBy: user._id,
      updatedBy: user._id,
      assignee,
      reporter,
      description: data.description,
      stage: data.stage,
      key,
      dueDate: data.dueDate
    };

    const issue = await IssueRepository.create(payload);

    if (!issue) {
      throw new AppError(
        ['Something went wrong while creating issue'],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return issue;
  } catch (error) {
    console.log('error in issue creating--->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while creating issue'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getIssueDetails = async (data) => {
  try {
    const issue = await IssueRepository.findByPk(data);
    return issue;
  } catch (error) {
    console.log('error in issue details--->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while getting issue details'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getIssues = async (query) => {
  try {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const sort = { updatedAt: -1 };
    const customFilters = {};

    //tile or description

    if (query.search) {
      const searchRegex = new RegExp(query.search, 'i');
      customFilters.$or = [
        { title: searchRegex },
        { description: searchRegex }
      ];
    }

    // issue type filter
    if (query.type) {
      customFilters.type = {
        $in: Array.isArray(query.type) ? query.type : [query.type]
      };
    }

    //priotity filter
    if (query.priority) {
      customFilters.priority = {
        $in: Array.isArray(query.priority) ? query.priority : [query.priority]
      };
    }

    //stage filter
    if (query.stage) {
      customFilters.stage = {
        $in: Array.isArray(query.stage) ? query.stage : [query.stage]
      };
    }

    //assinee filter
    if (query.assignee) {
      customFilters.assignee = {
        $in: Array.isArray(query.assignee) ? query.assignee : [query.assignee]
      };
    }

    if (query.dueDate) {
      const today = new Date();
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      switch (query.dueDate) {
        case 'today':
          customFilters.dueDate = {
            $gte: new Date(today.setHours(0, 0, 0, 0)),
            $lte: new Date(today.setHours(23, 59, 59, 999))
          };
          break;

        case 'thisWeek':
          customFilters.dueDate = {
            $gte: startOfWeek,
            $lte: endOfWeek
          };
          break;

        case 'overdue':
          customFilters.dueDate = { $lt: new Date() };
          break;
      }
    }

    customFilters.project = query.projectId;
    const { data, meta } = await IssueRepository.find(customFilters, {
      page,
      limit,
      sort
    });
    return { data, meta };
  } catch (error) {
    console.log('error in issue details--->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while getting issues'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateIssue = async (id, data) => {
  try {
    const allowedfields = [
      'title',
      'priority',
      'assignee',
      'description',
      'reporter',
      'stage'
    ];
    const fieldsToBeUpdated = getFieldToUpdate(allowedfields, data);
    const project = await IssueRepository.findByIdAndUpdate(
      id,
      fieldsToBeUpdated
    );
    return project;
  } catch (error) {
    console.log('error in issue details--->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while updating issue'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
