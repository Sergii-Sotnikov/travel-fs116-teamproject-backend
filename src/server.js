import express from 'express';
import pinoHttp from 'pino-http';
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
const isProd = process.env.NODE_ENV === 'production';

export async function setupServer() {
  const app = express();

  app.use(express.json());

  app.use(
    cors({
      origin: [
        'http://localhost:3000',
        'https://travel-fs116-teamproject-frontend-rouge.vercel.app',
      ],
      credentials: true,
    }),
  );

  app.use(cookieParser());

  // Логи pino: в проде без pino-pretty, локально — з pretty
  const logger = isProd
    ? pinoHttp()
    : pinoHttp({
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            singleLine: true,
          },
        },
      });

  app.use(logger);


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
