
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

  if (!mongoose.isValidObjectId(userId)) {
    throw createHttpError(400, 'Invalid "userId"', {
      data: { details: ['"userId" must match /^[a-f0-9]{24}$/'] },
    });
  }

  const userDoc = await UsersCollection.findById(userId)
    .select('_id name avatarUrl description createdAt articlesAmount')
    .lean();

  if (!userDoc) {
    throw createHttpError(404, 'User not found', {
      data: { details: ["User with given id doesn't exist"] },
    });
  }


  const articles = await TravellersCollection.find({ ownerId: userId })
    .select('_id title img article date favoriteCount createdAt')
    .sort({ favoriteCount: -1 })
    .lean();

  const { ...user } = userDoc;
  return { user, articles };
};


// GET USER BY ID AND SAVED ARTICLES
export const getUserSavedArticles = async (userId) =>{
  const user = await UsersCollection.findById(userId)
    .select('_id name avatarUrl description createdAt')
    .select('+savedStories')
    .populate({
      path: 'savedStories',
      select: '_id img title article date favoriteCount createdAt category',
      options: { sort: { favoriteCount: -1 } },
      populate: {
        path: 'category',
        select: 'name',
      },
    });

  return {user}
}


// GET USER (PRIVATE)
export async function getMeProfile(userId) {

  const user = await UsersCollection.findById(userId)
    .select('_id name avatarUrl articlesAmount createdAt updatedAt')
    .lean();
  if (!user) throw createHttpError(404, 'User not found');

  const articles = await TravellersCollection.find({ ownerId: userId })
    .select('_id title img date favoriteCount createdAt')
    .sort({ createdAt: -1 })
    .lean();

  return { ...user, articles };
}


// POST ARTICLE BY ID (PRIVATE)
export const addArticleToSaved = async (userId, storyId) => {
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    throw createHttpError(400, 'Invalid storyId', {
      data: { details: ['"storyId" must match /^[a-f0-9]{24}$/'] },
    });
  }

  const storyExists = await TravellersCollection.exists({ _id: storyId });
  if (!storyExists) {
    throw createHttpError(404, 'Story not found', {
      data: { details: ["Story with given id doesn't exist"] },
    });
  }

  const res = await UsersCollection.updateOne(
    { _id: userId, savedStories: { $ne: storyId } },
    { $addToSet: { savedStories: storyId }, $inc: { savedAmount: 1 } }
  );
  const created = res.modifiedCount > 0;

  if (created) {
    await TravellersCollection.updateOne(
      { _id: storyId },
      { $inc: { favoriteCount: 1 } }
    );
  }

  return { created };
};





// DELETE ARTICLE BY ID (PRIVATE)
export const deleteSavedStory = async (userId, storyId) => {
  if (!mongoose.Types.ObjectId.isValid(storyId)) {
    throw createHttpError(400, 'Invalid storyId');
  }

  const res = await UsersCollection.updateOne(
    { _id: userId, savedStories: storyId, savedAmount: { $gt: 0 } },
    { $pull: { savedStories: storyId }, $inc: { savedAmount: -1 } }
  );

  const removed = res.modifiedCount > 0;
  if (removed) {
    await TravellersCollection.updateOne(
      { _id: storyId, favoriteCount: { $gt: 0 } },
      { $inc: { favoriteCount: -1 } }
    );
  }

  return { removed };
}

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











