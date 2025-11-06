

import { getAllUsers, getUserById } from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';

export const getAllUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const users = await getAllUsers({
    page,
    perPage,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found users!',
    data: users,
  });
};

export const getUsersByIdController = async (req, res) => {
  const { userId } = req.params;
  const data = await getUserById(userId);
  res.status(200).json({
    status: 200,
    message: `Successfully found users with id!`,
    data,
  });
};

export const getMeProfileController = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    status: 200,
    message: `Successfully found the user with id: ${user.userId}`,
    data: user,
  });
};

export const createMeSavedStoriesController = async (req, res) => {
  res.status(201).json({
    status: 201,
    message: 'Successfully created a story!',
  });
};

export const deleteMeSavedStoriesController = async (req, res) => {
  res.status(204).send();
};

export const patchMeAvatarController = async (req, res) => {
  res.json({
    status: 200,
    message: `Successfully patched a avatar!`,
  });
};

export const patchMeController = async (req, res) => {
  res.json({
    status: 200,
    message: `Successfully patched my profile!`,
  });
};
