import { TravellersCollection } from '../db/models/traveller.js';
import { UsersCollection } from '../db/models/user.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllUsers = async ({ page = 1, perPage = 12 }) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  try {
    // Підрахунок кількості користувачів
    const usersCount = await UsersCollection.countDocuments();

    // Отримуємо користувачів без пароля
    const users = await UsersCollection.find({}, '-password')
      .skip(skip)
      .limit(limit)
      .lean();

    // Формуємо дані пагінації
    const paginationData = calculatePaginationData(usersCount, perPage, page);

    return {
      data: users,
      ...paginationData,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

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
