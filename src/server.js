import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { UPLOAD_DIR } from './constants/index.js';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export async function setupServer() {
  const app = express();

  // Парсинг JSON
  app.use(express.json());

  // ✅ CORS з підтримкою cookies
  app.use(
    cors({
      origin: [
        'http://localhost:3000', // твій фронт під час розробки
        'https://travelstories.vercel.app', // прод-домен
      ],
      credentials: true, // дозволяє передавати cookies
    })
  );

  // ✅ Cookie parser
  app.use(cookieParser());

  // Логи pino
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    })
  );

  // Логування часу запиту
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });




  // Основні роутери
  app.use('/api', router);

  // Статичні файли
  app.use('/uploads', express.static(UPLOAD_DIR));

   // Swagger docs
  app.use('/api-docs', swaggerDocs());

  // Обробка 404
  app.use(notFoundHandler);

  // Глобальний error handler
  app.use(errorHandler);

  // Запуск сервера
  try {
    app.listen(PORT, (error) => {
      if (error) throw error;
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
  }
}
