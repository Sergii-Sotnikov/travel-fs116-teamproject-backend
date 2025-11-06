import Joi from 'joi';

export const createUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).required().messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
    'any.required': 'Username is required',
  }),
  avatarUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .max(200)
    .messages({
      'string.uri': 'avatarUrl must be a valid URL',
      'any.required': 'avatarUrl is required',
    }),

  articlesAmount: Joi.number().integer().min(0).default(0).messages({
    'number.base': 'articlesAmount must be a number',
    'number.min': 'articlesAmount cannot be negative',
    'number.integer': 'articlesAmount must be an integer',
  }),
  description: Joi.string().trim().min(5).max(3000).required().messages({
    'string.min': 'Description should have at least {#limit} characters',
    'any.required': 'Description is required',
  }),
  email: Joi.string().email().trim().lowercase().required().messages({
    'string.email': 'Email must be a valid email',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password should have at least {#limit} characterss',
    'any.required': 'Password is required',
  }),
});
