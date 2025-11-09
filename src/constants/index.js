import path from 'node:path';
export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const accessTokenLifeTime = 1000 * 60 * 15; // 15 хвилин
export const refreshTokenLifeTime = 1000 * 60 * 60 * 24 * 7; // 7 днів

export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  API_KEY: 'CLOUDINARY_API_KEY',
  API_SECRET: 'CLOUDINARY_API_SECRET',
};

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');



