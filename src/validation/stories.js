// src/validation/stories.js
import Joi from 'joi';
import { STORY_CATEGORIES } from '../constants/validation.js';

export const createStorySchema = Joi.object({
  img: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .max(200)
    .optional()
    .messages({
      'string.uri': 'Image must be a valid URL (http or https)',
    }),

  title: Joi.string().trim().min(3).max(100).required().messages({
    'string.min': 'Title should have at least {#limit} characters',
    'any.required': 'Title is required',
  }),

  article: Joi.string().trim().min(10).max(500).required().messages({
    'string.min': 'Article should have at least {#limit} characters',
    'any.required': 'Article is required',
  }),

  fullText: Joi.string().trim().min(50).required().messages({
    'string.min': 'Full text should have at least {#limit} characters',
    'any.required': 'Full text is required',
  }),

  category: Joi.string()
    .valid(...STORY_CATEGORIES)
    .required()
    .messages({
      'any.only': 'Category must be one of allowed types',
    }),
});

export const updateStoriesSchema = Joi.object({
  img: Joi.string()
    .uri({ scheme: ['http', 'https'] })
    .max(200)
    .optional()
    .messages({
      'string.uri': 'Image must be a valid URL (http or https)',
    }),

  title: Joi.string().trim().min(3).max(100),
  article: Joi.string().trim().min(10).max(500),
  fullText: Joi.string().trim().min(50),
  category: Joi.string().valid(...STORY_CATEGORIES),
});