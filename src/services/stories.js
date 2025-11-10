import { TravellersCollection } from '../db/models/traveller.js';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import mongoose from 'mongoose';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { UsersCollection } from '../db/models/user.js';


// GET ALL STORIES (PUBLIC)
export const getAllStories = async (query) => {
  const { page, perPage } = parsePaginationParams(query);
  const filter = parseFilterParams(query);
  const skip = (page - 1) * perPage;

  const [stories, total] = await Promise.all([
    TravellersCollection.find(filter)
      .populate('category', 'name')
      .populate('ownerId')
      .sort({favoriteCount:  - 1, date: - 1})
      .skip(skip)
      .limit(perPage),
    TravellersCollection.countDocuments(filter),
  ]);

  return {
    page,
    perPage,
    total,
    totalPages: Math.ceil(total / perPage),
    data: stories,
  };
};


// POST STORIE (PRIVATE)
export const addStory = async (payload, userId, photo) => {
  let photoUrl = payload?.img || null;
  if (photo) photoUrl = await saveFileToCloudinary(photo);


  const story = await TravellersCollection.create({
    ...payload,
    img: photoUrl,
    ownerId: userId,
    date: new Date(),
  });

  await UsersCollection.updateOne(
    { _id: userId },
    { $inc: { articlesAmount: 1 } }
  );

  return story;
};

// PATCH UPDATE STORY
export async function updateStoryById(
  storyId,
  ownerId,
  payload,
  storyImageFile,
  options = {},
) {
  const updateData = { ...payload };

  if (storyImageFile) {
    const photoUrl = await saveFileToCloudinary(storyImageFile);
    updateData.img = photoUrl;
  }

  const storyObjectId = new mongoose.Types.ObjectId(storyId);
  const ownerObjectId = new mongoose.Types.ObjectId(ownerId);

  const rawResult = await TravellersCollection.findOneAndUpdate(
    { _id: storyObjectId, ownerId: ownerObjectId },
    updateData,
    {
      new: true,
      includeResultMetadata: true,
      ...options,
    },
  );

  if (!rawResult || !rawResult.value) return null;

  return rawResult.value;
}
