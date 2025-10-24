import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/errors/appError.js';
import {
  ProjectMemberRepository,
  ProjectRepository
} from '../repository/index.js';

export const addMember = async (data, user) => {
  try {
    const membersPayload = data.members.map((member) => {
      return {
        addedBy: user._id,
        updatedBy: user._id,
        user: member.user,
        status: 'active',
        role: member.role,
        project: data.projectId
      };
    });

    const members = await ProjectMemberRepository.insertMany(membersPayload);
    console.log('membersPayload--->', membersPayload);
    console.log('members', members);
    return;
  } catch (error) {
    console.log('error -->1', error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while adding member'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const removeMember = async (data) => {
  try {
    await ProjectMemberRepository.findByIdAndDelete(data);
    return;
  } catch (error) {
    console.log('error -->1', error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while removing member'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getMembers = async (data) => {
  try {
    await ProjectRepository.findByPk(data); //if project is not present error will be from repository

    // fetch members
    const members = await ProjectMemberRepository.getMembersList(data);
    return members;
  } catch (error) {
    console.log('error -->1', error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while geting members list'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
