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

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  registerUserController,
);

authRouter.post('/login', validateBody(loginUserSchema), loginUserController);

authRouter.post('/logout', logoutUserController);

authRouter.post('/refresh', refreshUserSessionController);

authRouter.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  sendResetEmailController,
);

authRouter.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  resetPasswordController,
);

authRouter.get('/google/get-oauth-url', getGoogleOAuthUrlController);

authRouter.post(
  '/google/confirm-oauth',
  validateBody(loginWithGoogleOAuthSchema),
  loginWithGoogleOAuthController,
);

export default authRouter;