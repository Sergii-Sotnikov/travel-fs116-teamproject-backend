import createHttpError from 'http-errors';

export const validateBody = (schema) => async (req, res, next) => {
  try {
    // Видаляємо порожні рядки перед валідацією
    const cleanedBody = { ...req.body };
    Object.keys(cleanedBody).forEach((key) => {
      if (cleanedBody[key] === '' || cleanedBody[key] === null) {
        delete cleanedBody[key];
      }
    });

    await schema.validateAsync(cleanedBody, {
      abortEarly: false,
    });

    // Оновлюємо req.body очищеними даними
    req.body = cleanedBody;
    next();
  } catch (err) {
    const error = createHttpError(400, 'Bad Request', {
      errors: err.details,
    });
    next(error);
  }
};