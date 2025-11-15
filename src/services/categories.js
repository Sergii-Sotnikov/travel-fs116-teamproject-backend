import { CategoriesSchema } from '../db/models/category.js';

export const checkCategoryExists  = async (categoryId) => {
  const category = await CategoriesSchema.findById(categoryId);
  return !!category;
}



export const getCategories = async() => {
  const categories = await CategoriesSchema.find()

  return categories;
}


