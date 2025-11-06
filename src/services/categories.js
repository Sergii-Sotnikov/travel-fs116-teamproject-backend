import { CategoriesSchema } from '../db/models/category.js';

export async function checkCategoryExists(categoryId) {
  const category = await CategoriesSchema.findById(categoryId);
  return !!category;
}
