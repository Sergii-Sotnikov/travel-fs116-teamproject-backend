import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export async function setupServer() {
  const app = express();

  // Middleware
  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  // Логування запитів
  app.use((req, _res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  // ✅ Підключаємо всі маршрути з префіксом /api
  app.use('/api', router);

  // 404 для невідомих маршрутів
  app.use(notFoundHandler);

  // Глобальний обробник помилок
  app.use(errorHandler);

  // Запуск сервера
  try {
    app.listen(PORT, (error) => {
      if (error) throw error;
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
  }
}