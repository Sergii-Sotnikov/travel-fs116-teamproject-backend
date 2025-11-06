import Joi from 'joi';

export const updateStorySchema = Joi.object({
  title: Joi.string()
    .max(80)
    .messages({
      'string.max': 'Title cannot exceed 80 characters',
      'string.empty': 'Title cannot be empty',
    })
    .optional(),

  description: Joi.string()
    .max(2500)
    .messages({
      'string.max': 'Description cannot exceed 2500 characters',
      'string.empty': 'Description cannot be empty',
    })
    .optional(),

  category: Joi.string()
    .hex()
    .length(24)
    .messages({
      'any.invalid': 'Category must be a valid category ID',
    })
    .optional(),

  storyImage: Joi.string().optional(),
}).or('title', 'description', 'category', 'storyImage');
