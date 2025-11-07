import createHttpError from 'http-errors';
import { STORY_CATEGORIES } from '../constants/validation.js';

/**
 * Перевіряє, чи валідна категорія
 * @param {string | undefined} category - Категорія з query параметрів
 * @returns {string | undefined}
 */
const parseCategory = (category) => {
  if (!category) return undefined; 
  if (typeof category !== 'string') {
    throw createHttpError(400, 'Category must be a string');
  }

  if (!STORY_CATEGORIES.includes(category)) {
    throw createHttpError(404, `Category "${category}" not found`);
  }

  return category;
};

/**
 * Парсить усі фільтри з req.query
 * @param {object} query - Об’єкт параметрів запиту (req.query)
 * @returns {{ category?: string }}
 */
export const parseFilters = (query) => {
  const { category } = query;

  const filters = {};

  const parsedCategory = parseCategory(category);
  if (parsedCategory) filters.category = parsedCategory;

  return filters;
};