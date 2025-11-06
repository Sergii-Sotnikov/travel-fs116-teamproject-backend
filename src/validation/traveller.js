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
