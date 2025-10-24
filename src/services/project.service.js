import { StatusCodes } from 'http-status-codes';
import {
  ProjectRepository,
  ProjectMemberRepository,
  RoleRepository,
  StageRepository
} from '../repository/index.js';
import AppError from '../utils/errors/appError.js';
import mongoose from 'mongoose';
import {
  generateRandomColorLight,
  getFieldToUpdate
} from '../utils/helpers/index.js';
import { FULL_STAGE_TEMPLATE } from '../utils/constants/index.js';
import moment from 'moment';

export const create = async (data, user) => {
  let session;
  try {
    const { name, description = '', key = '', startDate, endDate } = data;

    const existing = await ProjectRepository.findOne({ name: name.trim() });
    if (existing) {
      throw new AppError(
        ['Project exists with the same name'],
        StatusCodes.BAD_REQUEST
      );
    }

    const start = startDate ? moment(startDate, 'DD-MM-YYYY').toDate() : null;
    const end = endDate ? moment(endDate, 'DD-MM-YYYY').toDate() : null;

    // Validation
    if (end && start && end <= start) {
      throw new AppError(
        ['End date must be after start date'],
        StatusCodes.BAD_REQUEST
      );
    }

    // Final payload
    const projectPayload = {
      name: name.trim(),
      description: description?.trim() || null,
      key: key.trim() || null,
      startDate: start,
      endDate: end,
      manager: data.manager || user._id,
      defaultAssignee: data.defaultAssignee || user._id,
      createdBy: user._id,
      updatedBy: user._id
    };

    session = await mongoose.startSession();
    let createdProject;

    await session.withTransaction(async () => {
      const project = await ProjectRepository.create(projectPayload, {
        session
      });
      createdProject = project;

      const role = await RoleRepository.findOne({ name: 'admin' });
      if (!role) {
        throw new AppError(
          ['Admin role not found'],
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }

      const memberPayload = {
        project: project._id,
        user: user._id,
        role: role._id,
        status: 'active',
        addedBy: user._id,
        updatedBy: user._id
      };

      await ProjectMemberRepository.create(memberPayload, { session });

      const stagePayload = FULL_STAGE_TEMPLATE.map((stage) => {
        return {
          project: createdProject._id,
          name: stage.name,
          category: stage.category,
          order: stage.order,
          isDefault: stage.isDefault,
          color: generateRandomColorLight(),
          createdBy: user._id,
          updatedBy: user._id
        };
      });

      await StageRepository.insertMany(stagePayload, session);
    });

    return;
  } catch (error) {
    console.error('error -->', error);
    if (session) await session.endSession();

    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while creating project'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  } finally {
    if (session) session.endSession();
  }
};

export const getProjectDetails = async (data) => {
  try {
    const project = await ProjectRepository.findByPk(data);

    if (!project) {
      throw new AppError(['Project Not found'], StatusCodes.NOT_FOUND);
    }

    return project;
  } catch (error) {
    console.error('error -->', error);

    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while getting project details'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateProject = async (id, data) => {
  try {
    const allowedfields = ['name', 'description', 'defaultAssignee', 'manager'];
    const fieldsToBeUpdated = getFieldToUpdate(allowedfields, data);
    const project = await ProjectRepository.findByIdAndUpdate(
      id,
      fieldsToBeUpdated
    );
    return project;
  } catch (error) {
    console.error('error -->', error);

    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while updating project'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const deleteProject = async (data) => {
  try {
    const { user, projectId } = data;
    const payload = {
      isDeleted: true,
      deletedBy: user._id,
      deletedAt: Date.now()
    };
    await ProjectRepository.findByIdAndUpdate(projectId, payload);
  } catch (error) {
    console.error('error -->', error);

    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while deleting project'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getProjectList = async (data) => {
  try {
    const id = data._id;
    const projects = await ProjectRepository.getUserProjectList(id);
    return projects;
  } catch (error) {
    console.error('error -->', error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while getting projects list'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
