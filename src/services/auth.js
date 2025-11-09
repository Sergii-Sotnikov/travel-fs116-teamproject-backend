import createHttpError from 'http-errors';
import handlebars from 'handlebars';
import bcrypt from 'bcrypt';
import path from 'node:path';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import {
  getFullNameFromGoogleTokenPayload,
  validateCode,
} from '../utils/googleAuth.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/index.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { SessionsCollection } from '../db/models/session.js';
import { UsersCollection } from '../db/models/user.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { sendEmail } from '../utils/sendEmail.js';

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + accessTokenLifeTime),
  refreshTokenValidUntil: new Date(Date.now() + refreshTokenLifeTime),
});

export const findSession = (query) => SessionsCollection.findOne(query);
export const findUser = (query) => UsersCollection.findOne(query);

const jwtSecret = getEnvVar('JWT_SECRET');
const appDomain = getEnvVar('APP_DOMAIN');


// POST REGISTER USER
export const registerUser = async (data) => {
  const { email } = data;

  const existingUser = await UsersCollection.findOne({ email });
  if (existingUser) throw createHttpError(409, 'Email already in use');

  const newUser = await UsersCollection.create(data);
  return {
    id: newUser._id,
    name: newUser.name,
    email: newUser.email,
  };
};


// POST LOGIN USER
export const loginUser = async ({ email, password }) => {
  const user = await UsersCollection.findOne({ email }).select('+password');
  if (!user) throw createHttpError(401, 'User not found');

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) throw createHttpError(401, 'Invalid password');

  await SessionsCollection.deleteMany({ userId: user._id });

  const session = createSession();
  const newSession = await SessionsCollection.create({
    userId: user._id,
    ...session,
  });

  return {
    user: { id: user._id, name: user.name, email: user.email },
    session: newSession,
  };
};


// POST REFRESH USER (PUBLIC)
export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const oldSession = await findSession({ _id: sessionId, refreshToken });
  if (!oldSession) throw createHttpError(401, 'Session not found');
  if (oldSession.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Session token expired');
  }

  await SessionsCollection.deleteOne({ _id: oldSession._id });

  const session = createSession();
  const newSession = await SessionsCollection.create({
    userId: oldSession.userId,
    ...session,
  });
  return newSession;
};


// POST LOGOUT (PRIVATE)
export const logoutUser = async (sessionId) => {
  await SessionsCollection.deleteOne({ _id: sessionId });
};


// POST SEND RESET EMAIL (PUBLICK)
export const sendResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found');

  const resetToken = jwt.sign({ sub: user._id, email }, jwtSecret, {
    expiresIn: '15m',
  });

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );
  const resetTemplateSource = await readFile(
    resetPasswordTemplatePath,
    'utf-8',
  );
  const template = handlebars.compile(resetTemplateSource);

  const logoCid = 'plantains-app-logo';
  const supportEmail = getEnvVar(SMTP.SMTP_FROM);
  const year = new Date().getFullYear();
  const logoPath = path.join(TEMPLATES_DIR, 'assets', 'plant_logo.png');

  const html = template({
    name: user.name,
    resetLink: `${appDomain}/reset/reset-password?token=${resetToken}`,
    logoCid,
    supportEmail,
    year,
    appName: 'Подорожники',
  });

  await sendEmail({
    from: supportEmail,
    to: email,
    subject: 'Reset your password',
    html,
    attachments: [{ filename: 'logo.png', path: logoPath, cid: logoCid }],
  });
};


// POST RESET PASSWORD (PUBLIC)
export const resetPassword = async ({ token, password }) => {
  let payload;
  try {
    payload = jwt.verify(token, jwtSecret);
  } catch {
    throw createHttpError(401, 'Invalid or expired reset token');
  }

  const user = await UsersCollection.findOne({
    _id: payload.sub,
    email: payload.email,
  });
  if (!user) throw createHttpError(404, 'User not found');

  const newPasswordHash = await bcrypt.hash(password, 10);
  await UsersCollection.updateOne(
    { _id: user._id },
    { password: newPasswordHash },
  );
};


// POST GOOGLE CONFIRME
export const loginWithGoogleOAuth = async (code) => {
  const loginTicket = await validateCode(code);
  const payload = loginTicket.getPayload();
  if (!payload) throw createHttpError(401, 'Google payload missing');

  let user = await findUser({ email: payload.email });
  if (!user) {
    const name = getFullNameFromGoogleTokenPayload(payload);
    const plainPassword = randomBytes(10).toString('base64');

    user = await UsersCollection.create({
      name,
      email: payload.email,
      password: plainPassword,
    });
  }

  await SessionsCollection.deleteMany({ userId: user._id });

  const session = createSession();
  const newSession = await SessionsCollection.create({
    userId: user._id,
    ...session,
  });

  return {
    user: { id: user._id, name: user.name, email: user.email },
    session: newSession,
  };
};
