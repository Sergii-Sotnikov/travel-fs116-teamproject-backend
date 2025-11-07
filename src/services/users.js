import { TravellersCollection } from '../db/models/traveller.js';
import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import createHttpError from 'http-errors';

export const getAllUsers = async ({ page = 1, perPage = 12 }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const usersCount = await UsersCollection.countDocuments();

  const users = await UsersCollection.find({}, '-password')
    .skip(skip)
    .limit(limit)
    .lean();

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return {
    data: users,
    ...paginationData,
  };
};


export const deleteSavedStory = async (userId, storyId) => {
  try {
    const updatedUser = await UsersCollection.findByIdAndUpdate(
      userId,
      { $pull: { savedStories: storyId } },
      { new: true }
    ).populate('savedStories', '-__v');

    return updatedUser;
  } catch (error) {
    console.error('Error deleting saved story:', error);
    throw error;
  }
};


export const updateUserAvatar = async (userId, avatarUrl) => {
  try {
    const updatedUser = await UsersCollection.findByIdAndUpdate(
      userId,
      { avatarUrl },
      { new: true, select: '-password' },
    );

    if (!updatedUser) {
      throw createHttpError(404, 'User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error updating user avatar:', error);
    throw error;
  }
}



export const getUserById = async (userId) => {
  const user = await UsersCollection.findById(userId)
    .select('_id name avatarUrl articlesAmount description createdAt')
    .lean();

  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }

  const articles = await TravellersCollection.find({ ownerId: userId })
    .select('_id title img date favoriteCount')
    .sort({ date: -1 })
    .lean();

  return {
    user,
    articles,
    totalArticles: articles.length,
  };

};

export const addArticleToSaved = async (userId, articleId) => {
  const user = await UsersCollection.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // перевіряємо, чи вже є стаття в списку
  if (user.savedArticles.includes(articleId)) {
    throw new Error('Article already saved');
  }

  user.savedArticles.push(articleId);
  await user.save();

  return user.savedArticles;
};
