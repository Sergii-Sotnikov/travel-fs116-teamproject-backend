import { v2 as cloudinary } from 'cloudinary';
import { getEnvVar } from './getEnvVar.js';

// Налаштування Cloudinary через .env
cloudinary.config({
  cloud_name: getEnvVar('CLOUDINARY_CLOUD_NAME'),
  api_key: getEnvVar('CLOUDINARY_API_KEY'),
  api_secret: getEnvVar('CLOUDINARY_API_SECRET'),
});

/**
 * Завантаження файлу у Cloudinary
 * @param {Express.Multer.File} file - файл із multer (у buffer)
 * @returns {Promise<string>} secure_url
 */
export const saveFileToCloudinary = async (file) => {
  if (!file || !file.buffer) {
    throw new Error('Файл відсутній або порожній');
  }

  try {
    // Завантаження файлу через стрім
    return await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'stories', resource_type: 'image' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        },
      );
      uploadStream.end(file.buffer);
    });
  } catch (err) {
    console.error('Cloudinary upload error:', err.message);
    throw new Error('Помилка при завантаженні зображення в Cloudinary');
  }
};