import createHttpError from 'http-errors';
import { findSession, findUser } from '../services/auth.js';

// import SessionsCollection from '../db/models/session.js';
// import { UsersCollection } from '../db/models/user.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.get('Authorization');

    // 1️⃣ Перевірка наявності заголовка
    if (!authHeader) {
      return next(createHttpError(401, 'Authorization header is missing'));
    }

    const [scheme, accessToken] = authHeader.split(' ');

    // 2️⃣ Формат повинен бути "Bearer <token>"
    if (scheme !== 'Bearer' || !accessToken) {
      return next(createHttpError(401, 'Invalid Authorization format'));
    }

    // 3️⃣ Пошук сесії в базі
    const session = await findSession({ accessToken });
    if (!session) {
      return next(createHttpError(401, 'Session not found or invalid token'));
    }

    // 4️⃣ Перевірка терміну дії токена
    if (new Date(session.accessTokenValidUntil) < new Date()) {
      return next(createHttpError(401, 'Access token has expired'));
    }

    // 5️⃣ Перевірка існування користувача
    const user = await findUser({ _id: session.userId });
    if (!user) {
      return next(createHttpError(401, 'User not found'));
    }

    // ✅ Все гаразд — додаємо користувача в req
    req.user = user;

    return next();
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    return next(createHttpError(500, 'Authentication failed'));
  }
};

