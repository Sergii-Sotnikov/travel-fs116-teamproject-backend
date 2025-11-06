import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import dotenv from 'dotenv';
import { getEnvVar } from './utils/getEnvVar.js';
import router from './routers/index.js';
import authRouter from './routers/auth.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = Number(getEnvVar('PORT', '3000'));

export async function setupServer() {
  const app = express();

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

  //Логування запитів
  app.use((req, res, next) => {
    console.log(`Time: ${new Date().toLocaleString()}`);
    next();
  });

  //Додаємо роутер як middleware
  app.use('/api', router);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use('', notFoundHandler);

  app.use(errorHandler);

  //запуск сервера
  try {
    app.listen(PORT, (error) => {
      if (error) throw error;
    });
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error(error);
  }
}
