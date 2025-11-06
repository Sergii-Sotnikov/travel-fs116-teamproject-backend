import { Router } from 'express';
import authRouter from './auth.js';
// import stories from "./stories.js"
import users from './users.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', users);
export default router;
