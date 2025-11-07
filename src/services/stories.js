import createHttpError from 'http-errors';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { StoriesCollection } from '../db/models/story.js';
import { UserCollection } from '../db/models/user.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

/**
 * Отримати всі історії з пагінацією, сортуванням і фільтрацією
 */
export const getStories = async ({
  page = 1,
  perPage = 10,
  sortBy = 'date',
  sortOrder = 'desc',
  category,
}) => {
  const skip = (page - 1) * perPage;

  const query = {};
  if (category) query.category = category;

  const [storiesCount, stories] = await Promise.all([
    StoriesCollection.countDocuments(query),
    StoriesCollection.find(query)
      .populate({ path: 'ownerId', select: 'name avatar bio' })
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const data = stories.map((story) => ({
    ...story.toObject(),
    owner: story.ownerId,
  }));

  const pagination = calculatePaginationData(storiesCount, perPage, page);
  return { data, ...pagination };
};

/**
 * Додати нову історію
 */
export const addStory = async (payload, userId, photo) => {
  let photoUrl = null;

  if (photo) {
    try {
      photoUrl = await saveFileToCloudinary(photo);
    } catch {
      throw createHttpError(500, 'Не вдалося завантажити фото в хмару');
    }
  }

  const story = await StoriesCollection.create({
    ...payload,
    img: photoUrl,
    ownerId: userId,
  });

  return story;
};

/**
 * Видалити історію за ID
 */
export const deleteStoryById = async (storyId, userId) => {
  const story = await StoriesCollection.findById(storyId);
  if (!story) {
    throw createHttpError(404, 'Історію не знайдено');
  }

  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'Ви не можете видалити цю історію');
  }

  await StoriesCollection.findByIdAndDelete(storyId);
};

/**
 * Отримати одну історію
 */
export const getStory = async (id) => {
  const story = await StoriesCollection.findById(id)
    .populate({ path: 'ownerId', select: 'name avatar bio' })
    .lean();

  if (!story) {
    throw createHttpError(404, 'Історію не знайдено');
  }

  story.owner = story.ownerId;
  delete story.ownerId;

  return story;
};

/**
 * Отримати всіх авторів
 */
export const getAuthors = async ({
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
}) => {
  const skip = (page - 1) * perPage;

  const [authorsCount, authors] = await Promise.all([
    UserCollection.countDocuments(),
    UserCollection.find({}, 'name avatar bio')
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const pagination = calculatePaginationData(authorsCount, perPage, page);
  return { data: authors, ...pagination };
};

/**
 * Отримати одного автора
 */
export const getAuthor = async (id) => {
  const author = await UserCollection.findById(id, 'name avatar bio');
  if (!author) {
    throw createHttpError(404, 'Користувача не знайдено');
  }
  return author;
};

/**
 * Отримати всі історії певного автора
 */
export const getStoriesByAuthorId = async ({
  ownerId,
  page = 1,
  perPage = 10,
  sortBy = 'date',
  sortOrder = 'desc',
}) => {
  const skip = (page - 1) * perPage;

  const [storiesCount, stories] = await Promise.all([
    StoriesCollection.countDocuments({ ownerId }),
    StoriesCollection.find({ ownerId })
      .populate({ path: 'ownerId', select: 'name avatar bio' })
      .skip(skip)
      .limit(perPage)
      .sort({ [sortBy]: sortOrder }),
  ]);

  const data = stories.map((story) => ({
    ...story.toObject(),
    owner: story.ownerId,
  }));

  const pagination = calculatePaginationData(storiesCount, perPage, page);
  return { data, ...pagination };
};

/**
 * Оновити історію (редагування)
 */
export const updateStory = async (storyId, userId, payload, photo) => {
  const story = await StoriesCollection.findById(storyId);
  if (!story) {
    throw createHttpError(404, 'Історію не знайдено');
  }

  if (story.ownerId.toString() !== userId.toString()) {
    throw createHttpError(403, 'Ви не можете редагувати цю історію');
  }

  let photoUrl = story.img;
  if (photo) {
    try {
      photoUrl = await saveFileToCloudinary(photo);
    } catch {
      throw createHttpError(500, 'Не вдалося оновити фото');
    }
  }

  const updatedStory = await StoriesCollection.findByIdAndUpdate(
    storyId,
    { ...payload, img: photoUrl },
    { new: true, runValidators: true },
  );

  return updatedStory;
};