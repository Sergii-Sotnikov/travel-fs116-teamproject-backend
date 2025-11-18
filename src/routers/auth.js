import { Router } from 'express';
import {
  loginUserController,
  registerUserController,
  logoutUserController,
  refreshUserSessionController,
  sendResetEmailController,
  resetPasswordController,
  getGoogleOAuthUrlController,
  loginWithGoogleOAuthController,
} from '../controllers/auth.js';
import {
  registerUserSchema,
  loginUserSchema,
  requestResetEmailSchema,
  resetPasswordSchema,
  loginWithGoogleOAuthSchema,
} from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';

const authRouter = Router();

// Публічні
authRouter.post('/register', validateBody(registerUserSchema), registerUserController);
authRouter.post('/login', validateBody(loginUserSchema), loginUserController);
authRouter.post('/refresh', refreshUserSessionController);
authRouter.post('/send-reset-email', validateBody(requestResetEmailSchema), sendResetEmailController);
authRouter.post('/reset-password', validateBody(resetPasswordSchema), resetPasswordController);
authRouter.get('/google/get-oauth-url', getGoogleOAuthUrlController);
authRouter.post(
  '/google/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  loginWithGoogleOAuthController,
);

// новый публичный маршрут для обработки редиректа от Google OAuth
authRouter.get('/google', async (req, res, next) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Missing authorization code' });
    }
    // передаём code в контроллер авторизации; код можно положить в тело запроса,
    // чтобы reuse-нуть существующую схему валидации, если нужно
    req.body.code = code;
    await loginWithGoogleOAuthController(req, res, next);
  } catch (err) {
    next(err);
  }
});

// Приватні
authRouter.post('/logout', authenticate, logoutUserController);

export default authRouter;