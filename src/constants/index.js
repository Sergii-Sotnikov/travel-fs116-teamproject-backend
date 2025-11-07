import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Отримуємо абсолютний шлях до поточного файлу
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📨 SMTP-константи для відправки пошти
export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

// 📂 Шлях до шаблонів email (наприклад: src/templates)
export const TEMPLATES_DIR = path.join(__dirname, '../templates');

// 📁 Тимчасова директорія для завантажених файлів (наприклад, перед Cloudinary)
export const TEMP_UPLOAD_DIR = path.join(__dirname, '../temp');