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


// GET ALL USERS (PUBLIC)
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


// GET USER BY ID (PUBLIC)
export const getUsersByIdController = async (req, res) => {
  const { userId } = req.params;
  const data = await getUserById(userId);

  res.status(200).json({
    status: 200,
    message: `Successfully found users with id!`,
    data,
  });
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
export const addSavedArticleController = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { storyId } = req.params;

    const { alreadySaved, user } = await addArticleToSaved(userId, storyId);

    res.status(alreadySaved ? 200 : 201).json({
      status: alreadySaved ? 200 : 201,
      message: alreadySaved
        ? 'Article already in saved list'
        : 'Article added to saved list',
      data: { user },
    });
  } catch (e) {
    next(e);
  }
};


// DELETE ARTICLE BY ID (PRIVATE)
export const deleteMeSavedStoriesController = async (req, res) => {
  const userId = req.user._id;
  const { storyId } = req.params;

  const updatedUser = await deleteSavedStory(userId, storyId);

  if (!updatedUser) {
    return res.status(404).json({
      status: 404,
      message: 'User or saved story not found!',
    });
  }

  return res.status(200).json({
    status: 200,
    message: 'Successfully deleted saved story!',
    data: updatedUser,
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










