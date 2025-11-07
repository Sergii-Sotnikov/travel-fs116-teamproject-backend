// src/constants/auth.js

export const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const accessTokenLifeTime = 1000 * 60 * 15; // 15 хвилин
export const refreshTokenLifeTime = 1000 * 60 * 60 * 24 * 7; // 7 днів