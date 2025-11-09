import nodemailer from 'nodemailer';
import { getEnvVar } from './getEnvVar.js';
import { SMTP } from '../constants/index.js';

export const sendEmail = async ({
  from,
  to,
  subject,
  html,
  attachments = [],
}) => {
  // створюємо транспорт
  const transporter = nodemailer.createTransport({
    host: getEnvVar(SMTP.SMTP_HOST),
    port: getEnvVar(SMTP.SMTP_PORT),
    secure: false, 
    auth: {
      user: getEnvVar(SMTP.SMTP_USER),
      pass: getEnvVar(SMTP.SMTP_PASSWORD),
    },
  });

  const mailOptions = {
    from,
    to,
    subject,
    html,
    attachments,
  };

  await transporter.sendMail(mailOptions);
};