import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, _res, next) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    throw createHttpError(400, 'Bad Request. ID is not a valid');
  }

  next();
};