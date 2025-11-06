import Joi from 'joi';

// Реєстрація
export const registerUserSchema = Joi.object({
  name: Joi.string().min(1).max(32).required(),
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(8).max(128).required(),
});

// Логін
export const loginUserSchema = Joi.object({
  email: Joi.string().email().max(64).required(),
  password: Joi.string().min(8).max(128).required(),
});

// Скидання пароля: email
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().max(64).required(),
});

// Скидання пароля: новий пароль + токен
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(8).max(128).required(),
  token: Joi.string().required(),
});
