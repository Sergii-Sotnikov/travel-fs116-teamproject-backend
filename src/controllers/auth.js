import {
  registerUser,
  loginUser,
  logoutUser,
  refreshUsersSession,
  sendResetToken,
  resetPassword,
  loginWithGoogleOAuth,
} from '../services/auth.js';
import { generateOAuthUrl } from '../utils/googleAuth.js';


// POST REGISTER USER (PUBLIC)
export const registerUserController = async (req, res) => {
  const newUser = await registerUser(req.body);

  res.status(201).json({
    status: 201,
    message: 'User successfully registered',
    data: { user: newUser },
  });
};


// POST LOGIN USER (PUBLIC)
export const loginUserController = async (req, res) => {
  const { user, session } = await loginUser(req.body);

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 15 * 60 * 1000,
  });

  // JSON відповідь для фронта
  res.json({
    status: 200,
    message: 'User successfully logged in',
    data: {
      user,
      accessToken: session.accessToken, 
      accessTokenValidUntil: session.accessTokenValidUntil,
      sessionId: session._id,
    },
  });
};


// POST REFRESH USER (PUBLIC)
export const refreshUserSessionController = async (req, res) => {
  const { sessionId, refreshToken } = req.cookies || {};

  const newSession = await refreshUsersSession({ sessionId, refreshToken });

  setSessionCookies(res, newSession);

  res.json({
    status: 200,
    message: 'Session successfully refreshed',
    data: {
      accessToken: newSession.accessToken,
      accessTokenValidUntil: newSession.accessTokenValidUntil,
      sessionId: newSession._id,
    },
  });
};


// POST LOGOUT (PRIVATE)
export const logoutUserController = async (req, res) => {
  const { sessionId } = req.cookies || {};

  if (sessionId) {
    await logoutUser(sessionId);
  }

  clearSessionCookies(res);
  res.status(204).send();
};


// POST SEND RESET EMAIL (PUBLIC)
export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;
  await sendResetToken(email);

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};


// POST RESET PASSWORD (PUBLIC)
export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};


// GET GOOGLE AUTH (PUBLIC)
export const getGoogleOAuthUrlController = async (_req, res) => {
  const url = generateOAuthUrl();

  res.json({
    status: 200,
    message: 'Successfully generated Google OAuth URL',
    data: { url },
  });
};


// POST GOOGLE CONFIRM
export const loginWithGoogleOAuthController = async (req, res) => {
  const result = await loginWithGoogleOAuth(req.body.code);

  if (!result || !result.session) {
    return res.status(401).json({
      status: 401,
      message: 'Google authentication failed',
      data: {},
    });
  }

  // 🧩 Встановлюємо ті ж кукі, що і при звичайному логіні
  const session = result.session;

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 днів
  });

  res.cookie('sessionId', session._id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 15 * 60 * 1000, // 15 хвилин
  });

  // 🔙 Відповідь JSON (для фронта)
  res.json({
    status: 200,
    message: 'Successfully logged in with Google',
    data: {
      user: result.user,
      accessToken: session.accessToken,
      accessTokenValidUntil: session.accessTokenValidUntil,
      sessionId: session._id,
    },
  });
};


// SESSION
const setSessionCookies = (res, session) => {
  const isProd = process.env.NODE_ENV === 'production';

  const common = {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
    path: '/',
  };

  const prodOnly = isProd
    ? { secure: true, sameSite: 'none' }
    : { secure: false, sameSite: 'lax' };

  res.cookie('refreshToken', session.refreshToken, { ...common, ...prodOnly });
  res.cookie('sessionId', session._id?.toString?.() ?? session._id, {
    ...common,
    ...prodOnly,
  });
};

const clearSessionCookies = (res) => {
  const isProd = process.env.NODE_ENV === 'production';
  const opts = isProd
    ? { httpOnly: true, secure: true, sameSite: 'none', path: '/' }
    : { httpOnly: true, secure: false, sameSite: 'lax', path: '/' };

  res.clearCookie('sessionId', opts);
  res.clearCookie('refreshToken', opts);
};
