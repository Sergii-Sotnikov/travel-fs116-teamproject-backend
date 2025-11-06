import Story from '../db/models/story';
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

  const rawResult = await Story.findOneAndUpdate(
    { _id: storyId, owner: ownerId },
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
