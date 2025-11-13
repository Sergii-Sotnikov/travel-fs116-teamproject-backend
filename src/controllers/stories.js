import updateStorySchema from '../validation/traveller.js';
import { getAllStories, updateStoryById, addStory, getStoryById } from '../services/stories.js';

import { checkCategoryExists } from '../services/categories.js';
import createHttpError from 'http-errors';
import fs from 'node:fs/promises';



// GET ALL STORIES (PUBLIC)
export const getAllStoriesController = async (req, res) => {
  const result = await getAllStories(req.query);

  res.json({
    status: 200,
    message: 'Successfully found stories!',
    ...result,
  });
};


// GET STORY BY ID
export const getStoriesByIdControlle = async (req, res) => {
  const {storyId} = req.params;

  const story = await getStoryById(storyId);
  if(!story){
        throw createHttpError(404, 'Story not found');
  }

    res.status(200).json({
    status: 200,
    message: `Successfully found story!`,
    data: story,
  });
}


// POST STORIE (PRIVATE)
export const createStoryController = async (req, res) => {
  const { _id: userId } = req.user;
  const img = req.file || null;


  const story = await addStory(req.body, userId, img);


  res.status(201).json({
    status: 201,
    message: 'Story created successfully',
    data: story,
  });
};


// PATCH UPDATE STORY
export const patchStoryController = async (req, res) => {
  const { storyId } = req.params;
  const ownerId = req.user._id;
  const updateFields = req.body || {};
  const storyImageFile = req.file;

  const hasTextFields = Object.keys(updateFields).length > 0;
  const hasFile = !!storyImageFile;

  if (!hasTextFields && !hasFile) {
    throw createHttpError(
      400,
      'At least one field or file must be provided for update.',
    );
  }

  if (hasTextFields) {
    const { error } = updateStorySchema.validate(updateFields);
    if (error) {
      if (storyImageFile) {
        await fs.unlink(storyImageFile.path);
      }
      throw createHttpError(400, error.details[0].message);
    }
  }

  if (updateFields.category) {
    const categoryExists = await checkCategoryExists(updateFields.category);
    if (!categoryExists) {
      if (storyImageFile) {
        await fs.unlink(storyImageFile.path);
      }
      throw createHttpError(
        400,
        `Category with ID ${updateFields.category} not found.`,
      );
    }
  }

  const updatedStory = await updateStoryById(
    storyId,
    ownerId,
    updateFields,
    storyImageFile,
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
    data: updatedStory,
  });
};
