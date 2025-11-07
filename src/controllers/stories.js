import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilters } from '../utils/parseFilters.js';
import {
  getStories,
  getStory,
  getAuthors,
  getAuthor,
  getStoriesByAuthorId,
  addStory,
  deleteStoryById,
  updateStory,
} from '../services/stories.js';
import {
  AUTHORS_SORT_FIELDS,
  STORIES_SORT_FIELDS,
  STORY_CATEGORIES,
} from '../constants/validation.js';

// ✅ Отримати всі історії
export const getStoriesController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(
    req.query,
    STORIES_SORT_FIELDS,
    STORIES_SORT_FIELDS[0],
  );
  const filters = parseFilters(req.query);

  const data = await getStories({ page, perPage, sortBy, sortOrder, ...filters });

  res.json({
    status: 200,
    message: 'Stories retrieved successfully',
    data,
  });
};

// ✅ Створити нову історію
export const addStoryController = async (req, res) => {
  const { _id: userId } = req.user;
  const photo = req.file || null;

  const story = await addStory(req.body, userId, photo);

  res.status(201).json({
    status: 201,
    message: 'Story created successfully',
    data: story,
  });
};

// ✅ Видалити історію
export const deleteStoryByIdController = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;

  await deleteStoryById(id, userId);

  res.status(204).send();
};

// ✅ Отримати історію за ID
export const getStoryByIdController = async (req, res) => {
  const { id } = req.params;

  const story = await getStory(id);

  res.json({
    status: 200,
    message: 'Story retrieved successfully',
    data: story,
  });
};

// ✅ Отримати всіх авторів
export const getStoriesAuthorsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(
    req.query,
    AUTHORS_SORT_FIELDS,
    AUTHORS_SORT_FIELDS[0],
  );

  const data = await getAuthors({ page, perPage, sortBy, sortOrder });

  res.json({
    status: 200,
    message: 'Authors retrieved successfully',
    data,
  });
};

// ✅ Отримати автора за ID
export const getAuthorByIdController = async (req, res) => {
  const { id } = req.params;

  const author = await getAuthor(id);
  if (!author) throw createHttpError(404, 'Author not found');

  res.json({
    status: 200,
    message: 'Author retrieved successfully',
    data: author,
  });
};

// ✅ Отримати історії автора
export const getStoriesByAuthorIdController = async (req, res) => {
  const { id: ownerId } = req.params;
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(
    req.query,
    STORIES_SORT_FIELDS,
    STORIES_SORT_FIELDS[0],
  );

  const data = await getStoriesByAuthorId({
    ownerId,
    page,
    perPage,
    sortBy,
    sortOrder,
  });

  res.json({
    status: 200,
    message: 'Author stories retrieved successfully',
    data,
  });
};

// ✅ Отримати категорії
export const getCategoriesController = async (req, res) => {
  res.json({
    status: 200,
    message: 'Categories retrieved successfully',
    data: STORY_CATEGORIES,
  });
};

// ✅ Редагувати історію
export const storyEditController = async (req, res) => {
  const { id: storyId } = req.params;
  const userId = req.user._id;
  const photo = req.file || null;

  const updatedStory = await updateStory(storyId, userId, req.body, photo);

  res.json({
    status: 200,
    message: 'Story updated successfully',
    data: updatedStory,
  });
};