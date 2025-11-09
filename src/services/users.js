import { TravellersCollection } from '../db/models/traveller.js';
import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import createHttpError from 'http-errors';
import mongoose from 'mongoose';


// GET ALL USERS (PUBLIC)
export const getAllUsers = async ({ page = 1, perPage = 12 }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const usersCount = await UsersCollection.countDocuments();

  const users = await UsersCollection.find().skip(skip).limit(limit);

  const paginationData = calculatePaginationData(usersCount, perPage, page);

  return {
    data: users,
    ...paginationData,
  };
};


// GET USER BY ID (PUBLIC)
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


// GET USER (PRIVATE)
export async function getMeProfile(userId) {
  const user = await UsersCollection.findById(userId)
    .select('-password')
    .populate({
      path: 'articles',
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  if (!user) throw createHttpError(404, 'User not found');
  return user;
}


// POST ARTICLE BY ID (PRIVATE)
export const addArticleToSaved = async (userId, storyId) => {

  if (!mongoose.isValidObjectId(userId)) throw createHttpError(400, 'Invalid userId');
  if (!mongoose.isValidObjectId(storyId)) throw createHttpError(400, 'Invalid storyId');


  const traveller = await TravellersCollection.exists({ _id: storyId });
  if (!traveller) throw createHttpError(404, 'Story not found');

  const userObjectId = new mongoose.Types.ObjectId(userId);
  const storyObjectId = new mongoose.Types.ObjectId(storyId);
// ----- 200 -----\\
  const alreadySaved = await UsersCollection.exists({ _id: userObjectId, articles: storyObjectId });
  if (alreadySaved) {
    const user200 = await UsersCollection.findById(userObjectId)
      .select('-password +articles')
      .populate({
        path: 'articles',
        select: '_id title img category date favoriteCount',
        options: { sort: { createdAt: -1 } },
      })
      .lean();

    return { alreadySaved: true, user: user200 };
  }
  // ----- 201 -----\\
  const result = await UsersCollection.updateOne(
    { _id: userObjectId },
    { $addToSet: { articles: storyObjectId } }
  );
  if (result.matchedCount === 0) throw createHttpError(404, 'User not found');

  const user201 = await UsersCollection.findById(userObjectId)
    .select('-password +articles')
    .populate({
      path: 'articles',
      select: '_id title img category date favoriteCount',
      options: { sort: { createdAt: -1 } },
    })
    .lean();

  return { alreadySaved: false, user: user201 };
};


// DELETE ARTICLE BY ID (PRIVATE)
export const deleteSavedStory = async (userId, storyId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
      throw new Error('Invalid storyId format');
    }

    const storyObjectId = new mongoose.Types.ObjectId(String(storyId));

    const updatedUser = await UsersCollection.findByIdAndUpdate(
      userId,
      { $pull: { articles: storyObjectId } },
      { new: true },
    ).populate('articles', '-__v');

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return updatedUser;
  } catch (error) {
    console.error('Error deleting saved story:', error);
    throw error;
  }
};


//PATCH AVATAR (PRIVATE)
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
};


//PATCH ME (PRIVATE)
export async function updateMe(userId, payload, options = {}) {
  return UsersCollection.findOneAndUpdate(
    { _id: userId },
    { $set: payload },
    {
      new: true,
      ...options,
    },
  )
    .select('_id name description avatarUrl articlesAmount createdAt')
    .lean();
}











