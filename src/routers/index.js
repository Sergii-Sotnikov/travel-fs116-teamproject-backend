import { Router } from 'express';
import authRouter from './auth.js';
import stories from './stories.js';
import users from './users.js';
import categories from './categories.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/stories', stories);
router.use('/users', users);
router.use('/categories', categories);
export default router;
