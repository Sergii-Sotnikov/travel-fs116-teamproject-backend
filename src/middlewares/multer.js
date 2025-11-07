import multer from 'multer';
import path from 'node:path';
import createHttpError from 'http-errors';
import fs from 'node:fs';
import { TEMP_UPLOAD_DIR } from '../constants/index.js';


if (!fs.existsSync(TEMP_UPLOAD_DIR)) {
  fs.mkdirSync(TEMP_UPLOAD_DIR, { recursive: true });
}

const disallowedExtensions = new Set(['exe', 'bat', 'cmd', 'sh']);

const allowedImageMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).slice(1).toLowerCase();

  if (disallowedExtensions.has(ext)) {
    return cb(createHttpError(400, `.${ext} files are not allowed`), false);
  }

  cb(null, true);
};

const imageFileFilter = (_req, file, cb) => {
  if (!allowedImageMimeTypes.has(file.mimetype)) {
    return cb(
      createHttpError(
        400,
        'Unsupported file type. Only JPEG, PNG, WEBP, and GIF are allowed.',
      ),
      false,
    );
  }
  cb(null, true);
};


const limits = {
  fileSize: 15 * 1024 * 1024,
};

const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, TEMP_UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '_');
    cb(null, `${uniqueSuffix}-${baseName}${ext}`);
  },
});

// 🧠 Використовується для Cloudinary — файл зберігається в пам’яті, а не на диску
const memoryStorage = multer.memoryStorage();

// 📦 Експорти
export const upload = multer({
  storage: memoryStorage, // <-- важливо
  limits,
  fileFilter: imageFileFilter,
});

export const localUpload = multer({
  storage: diskStorage,
  limits,
  fileFilter,
});

export const avatarUpload = multer({
  storage: memoryStorage, // <-- аватар теж можна кидати у Cloudinary
  limits,
  fileFilter: imageFileFilter,
});