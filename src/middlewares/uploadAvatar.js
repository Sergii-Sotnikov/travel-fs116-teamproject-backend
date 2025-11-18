import multer from 'multer';
import createHttpError from 'http-errors';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      createHttpError(400, 'File must be an image'),
      false,
    );
  }
};

const multerUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
}).single('avatar');

export const uploadAvatar = (req, res, next) => {
  multerUpload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(createHttpError(400, 'File size exceeds 5MB limit'));
        }
        return next(createHttpError(400, err.message));
      }
      return next(err);
    }
    next();
  });
};

