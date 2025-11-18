import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

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
  parentId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      return helper.message('Parent id should be a valid mongo id');
    }
    return true;
  }),
});

export const UpdateUserSchema = Joi.object({
  name: Joi.string().trim().min(3).max(20).allow('').messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  description: Joi.string().trim().min(5).max(3000).allow('').messages({
    'string.base': 'Description should be a string',
    'string.min': 'Description should have at least {#limit} characters',
    'string.max': 'Description should have at most {#limit} characters',
  }),
  avatarUrl: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .max(500)
    .allow('')
    .messages({
      'string.uri': 'Avatar URL must be a valid URL',
      'string.max': 'Avatar URL should not exceed {#limit} characters',
    }),
})
  .min(0)
  .unknown(false);
