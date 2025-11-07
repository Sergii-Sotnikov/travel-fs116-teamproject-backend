import { isValidObjectId } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, res, next) => {
  const { storyId } = req.params;
  if (!isValidObjectId(storyId)) {
    throw createHttpError(400, 'Bad Request. ID is not a valid');
  }

  next();
};
