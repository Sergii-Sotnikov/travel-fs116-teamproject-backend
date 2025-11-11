import createHttpError from 'http-errors';
import {
  getAllUsers,
  getUserById,
  updateUserAvatar,
  updateMe,
  addArticleToSaved,
  getMeProfile,
} from '../services/users.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { deleteSavedStory } from '../services/users.js';
import { uploadImageToCloudinary } from '../services/cloudinary.js';
import { UsersCollection } from '../db/models/user.js';


// GET ALL USERS (PUBLIC)
export const getAllUsersController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);

  const {
    data: users,
    page: _page,
    perPage: _perPage,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
  } = await getAllUsers({ page, perPage });

  res.status(200).json({
    status: 200,
    message: 'Successfully found users!',
    data: {
      users,
      page: _page,
      perPage: _perPage,
      totalItems,
      totalPages,
      hasPreviousPage,
      hasNextPage,
    },
  });
};


// GET USER BY ID (PUBLIC)
export const getUsersByIdController = async (req, res) => {

  try {
    const { userId } = req.params;
    const { user, articles, savedArticles } = await getUserById(userId);

    return res.status(200).json({
      status: 200,
      message: 'Successfully found user by id!',
      data: { user, articles, savedArticles },
    });
  } catch (err) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    const payload = err.data ?? null;
    return res.status(status).json({ status, message, data: payload });
  }
};


// GET USER (PRIVATE)
export const getMeProfileController = async (req, res) => {
  const userId = req.user._id;
  const user = await getMeProfile(userId);

  res.status(200).json({
    status: 200,
    message: `Successfully found the user with id: ${userId}`,
    data: user,
  });
};


// POST ARTICLE BY ID (PRIVATE)
export const addSavedArticleController = async (req, res) => {
  try {
    const userId = req.user._id;
    const { storyId } = req.params;

    const { created } = await addArticleToSaved(userId, storyId);
    const status = created ? 201 : 200;

    const user = await UsersCollection.findById(userId)
      .select('+savedStories')
      .lean();

    return res.status(status).json({
      status,
      message: created ? 'Story saved' : 'Story alrady in saved',
      data: { user: { savedStories: (user.savedStories || []).map(String) } },
    });
  } catch (err) {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Something went wrong';
    const payload = err.data ?? null;

    return res.status(status).json({ status, message, data: payload });
  }
};


// DELETE ARTICLE BY ID (PRIVATE)
export const deleteMeSavedStoriesController = async (req, res) => {
  const userId = req.user._id;
  const { storyId } = req.params;

  const { removed } = await deleteSavedStory(userId, storyId);

  const user = await UsersCollection.findById(userId)
    .select('+savedStories')
    .lean();

  res.status(200).json({
    status: 200,
    message: removed ? 'Story removed from saved' : 'Story was not in saved',
    data: { user: { savedStories: (user.savedStories || []).map(String) } },
  });
};


//PATCH AVATAR (PRIVATE)
export const patchMeAvatarController = async (req, res) => {
  const { user } = req;

  if (!user || !user._id) {
    return res.status(401).json({
      status: 401,
      message: 'Unauthorized',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      status: 400,
      message: 'Avatar file is required',
    });
  }

  const avatarUrl = await uploadImageToCloudinary(req.file);

  const updatedUser = await updateUserAvatar(user._id, avatarUrl);

  res.status(200).json({
    status: 200,
    message: 'Successfully updated avatar!',
    data: {
      avatarUrl: updatedUser.avatarUrl,
    },
  });
};


//PATCH ME (PRIVATE)
export const patchMeController = async (req, res, next) => {
  const userId = req.user._id;
  const update = { ...req.body };

  if (req.file) {
    const avatarUrl = await uploadImageToCloudinary(req.file);
    update.avatarUrl = avatarUrl;
  }

  const updatedUser = await updateMe(userId, update);

  if (!updatedUser) {
    return next(createHttpError(404, 'User not found'));
  }

  res.json({
    status: 200,
    message: `Successfully patched my profile!`,
    data: updatedUser,
  });
};










