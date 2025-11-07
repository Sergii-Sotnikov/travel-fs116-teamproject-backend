// src/utils/generateTokens.js
import jwt from 'jsonwebtoken';
import { getEnvVar } from './getEnvVar.js';

/**
 * Генерує access і refresh токени для користувача
 * @param {string} userId - ID користувача
 * @returns {object} { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil }
 */
export const generateTokens = (userId) => {
  const accessSecret = getEnvVar('JWT_ACCESS_SECRET');
  const refreshSecret = getEnvVar('JWT_REFRESH_SECRET');

  const accessExpiresIn = 15 * 60 * 1000; // 15 хв
  const refreshExpiresIn = 30 * 24 * 60 * 60 * 1000; // 30 днів

  const accessToken = jwt.sign({ id: userId }, accessSecret, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: userId }, refreshSecret, {
    expiresIn: '30d',
  });

  const accessTokenValidUntil = new Date(Date.now() + accessExpiresIn);
  const refreshTokenValidUntil = new Date(Date.now() + refreshExpiresIn);

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};