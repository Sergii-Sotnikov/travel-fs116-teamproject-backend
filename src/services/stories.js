import mongoose from 'mongoose';
import { TravellersCollection } from '../db/models/traveller.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

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
    updateData.storyImage = photoUrl;
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
