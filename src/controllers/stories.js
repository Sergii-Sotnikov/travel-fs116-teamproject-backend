import updateStorySchema from '../validation/story.js';
import { getAllStories, updateStoryById } from '../services/stories.js';
import { checkCategoryExists } from '../services/categories.js';
import createHttpError from 'http-errors';
import fs from 'node:fs/promises';

export const getAllStoriesController = async (req, res) => {
  const result = await getAllStories(req.query);

  res.json({
    status: 200,
    message: 'Successfully found stories!',
    ...result,
  });
};



export const createStoryController = async (req, res) => {
  res.status(201).json({
    status: 201,
    message: 'Successfully created a story!',
  });
};

export const patchStoryController = async (req, res) => {
  const { storyId } = req.params;
  const ownerId = req.user._id;
  const updateFields = req.body;
  const storyImageFile = req.file;

  const { error } = updateStorySchema.validate(updateFields);
  if (error) {
    if (storyImageFile) {
      await fs.unlink(storyImageFile.path);
    }
    throw createHttpError(400, 'Validation error');
  }

  if (updateFields.category) {
    const categoryExists = await checkCategoryExists(updateFields.category);
    if (!categoryExists) {
      throw createHttpError(
        400,
        `Category with ID ${updateFields.category} not found.`,
      );
    }
  }

  const hasUpdates = Object.keys(updateFields).length > 0 || storyImageFile;
  if (!hasUpdates) {
    throw createHttpError(400, 'There are no fields to update.');
  }

  const updatedStory = await updateStoryById(
    storyId,
    ownerId,
    updateFields, // req.body (title, description, category)
    storyImageFile, // req.file
  );

  if (!updatedStory) {
    throw createHttpError(
      404,
      'The story cannot be found, or you are not its author.',
    );
  }

  res.json({
    status: 200,
    message: `Successfully patched a story!`,
  });
};
