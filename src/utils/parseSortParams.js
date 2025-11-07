import createHttpError from 'http-errors';
import { SORT_ORDER_LIST } from '../constants/validation.js';

/**
 * Парсить параметри сортування з query-рядка.
 *
 * @param {object} query - Об’єкт із параметрами (req.query)
 * @param {string[]} allowedFields - Масив дозволених полів для сортування
 * @param {string} defaultSortField - Поле сортування за замовчуванням
 * @returns {{ sortBy: string, sortOrder: 'asc' | 'desc' }}
 */
export const parseSortParams = (query, allowedFields, defaultSortField) => {
  const { sortBy, sortOrder } = query;

  // ✅ Валідація sortBy
  const parsedSortBy = allowedFields.includes(sortBy)
    ? sortBy
    : defaultSortField;

  // ✅ Валідація sortOrder
  const parsedSortOrder = SORT_ORDER_LIST.includes(sortOrder)
    ? sortOrder
    : 'asc';

  // 🧱 Якщо користувач ввів абсолютно невідоме поле — кинемо 400
  if (sortBy && !allowedFields.includes(sortBy)) {
    throw createHttpError(
      400,
      `Invalid sortBy parameter: "${sortBy}". Allowed fields: ${allowedFields.join(', ')}`,
    );
  }

  if (sortOrder && !SORT_ORDER_LIST.includes(sortOrder)) {
    throw createHttpError(
      400,
      `Invalid sortOrder parameter: "${sortOrder}". Allowed values: ${SORT_ORDER_LIST.join(', ')}`,
    );
  }

  return { sortBy: parsedSortBy, sortOrder: parsedSortOrder };
};