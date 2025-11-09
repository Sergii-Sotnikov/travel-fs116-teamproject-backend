import Joi from 'joi';

export const createUserSchema = Joi.object({
  img: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .max(200)
    .messages({
      'string.uri': 'img must be a valid URL',
      'any.required': 'img is required',
    }),
  title: Joi.string().trim().min(5).max(500).required().messages({
    'string.min': 'Title should have at least {#limit} characters',
    'any.required': 'Title is required',
  }),
  article: Joi.string().trim().min(5).max(2000).required().messages({
    'string.min': 'Article should have at least {#limit} characters',
    'any.required': 'Article is required',
  }),
});

const updateStorySchema = Joi.object({
  title: Joi.string()
    .max(80)
    .messages({
      'string.max': 'Title cannot exceed 80 characters',
      'string.empty': 'Title cannot be empty',
    })
    .optional(),

  article: Joi.string()
    .max(2500)
    .messages({
      'string.max': 'Article cannot exceed 2500 characters',
      'string.empty': 'Article cannot be empty',
    })
    .optional(),

  category: Joi.string()
    .hex()
    .length(24)
    .messages({
      'any.invalid': 'Category must be a valid category ID',
    })
    .optional(),
})
  .min(1)
  .messages({
    'object.min': 'At least one field must be provided for update',
  });

export default updateStorySchema;
