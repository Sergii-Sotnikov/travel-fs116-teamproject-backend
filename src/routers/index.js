// src/routers/index.js
import { Router } from 'express';
import authRouter from './auth.js';
import storyRouter from './stories.js';
import usersRouter from './users.js';

const router = Router();

// підключення основних маршрутів
router.use('/auth', authRouter);
router.use('/stories', storyRouter);
router.use('/users', usersRouter);

// базовий root endpoint
router.get('/', (req, res) => {
  res.json({
    message: '🚀 API is running successfully',
    time: new Date().toLocaleString(),
  });
});

export default router;