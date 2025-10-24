import { StatusCodes } from 'http-status-codes';
import AppError from '../utils/errors/appError.js';
import { UserRepository } from '../repository/index.js';

export const createUser = async (data) => {
  try {
    const { email, userName } = data;

    // check if user exists
    const isUserExist = await UserRepository.findOne({
      $or: [{ email }, { userName }]
    });

    if (isUserExist) {
      throw new AppError(
        ['User exists with same email or username'],
        StatusCodes.BAD_REQUEST
      );
    }

    const user = await UserRepository.create(data);
    if (!user) {
      throw new AppError(
        ['Something went wrong while create user'],
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
    return;
  } catch (error) {
    console.log('error -->', error);
    if (error instanceof AppError) throw error;

    throw new AppError(
      ['Something went wrong while creating user'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getUserDetails = async (data) => {
  try {
    const user = await UserRepository.findByPk(data);
    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while creating user'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

export const getUsers = async (data) => {
  try {
    const users = await UserRepository.findAll();
    const formattedUsers = users.map((user) => ({
      _id: user._id,
      full_name: `${user.firstName || ''} ${user.lastName || ''}`.trim()
    }));

    return formattedUsers;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      ['Something went wrong while getting users'],
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
