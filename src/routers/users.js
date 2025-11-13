import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { uploadAvatar } from '../middlewares/uploadAvatar.js';
import {
  getAllUsersController,
  deleteMeSavedStoriesController,
  getMeProfileController,
  getUsersByIdController,
  patchMeAvatarController,
  patchMeController,
  addSavedArticleController,
  getUsersSavedArticlesController,
} from '../controllers/users.js';
import { authenticate } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { UpdateUserSchema } from '../validation/user.js';

const router = Router();

//публічні
router.get('/', ctrlWrapper(getAllUsersController));
router.get('/:userId', ctrlWrapper(getUsersByIdController)); // створити публічний ендпоінт на отримання даних про користувача за ID - дані користувача + список власних статей
router.get('/:userId/saved-articles', ctrlWrapper(getUsersSavedArticlesController)); // створити публічний ендпоінт на отримання даних про користувача за ID - дані користувача + список збережених статей

//Приватні
router.use(authenticate);
router.get('/me/profile', ctrlWrapper(getMeProfileController)); // створити приватний ендпоінт на отримання інформації про поточного користувача
router.post('/me/saved/:storyId', ctrlWrapper(addSavedArticleController)); // створити приватний ендпоінт для додавання статті до збережених статей користувача
router.delete(
  '/me/saved/:storyId',
  ctrlWrapper(deleteMeSavedStoriesController),
); // створити приватний ендпоінт для видалення статті зі збережених статей користувача
router.patch('/me/avatar', uploadAvatar, ctrlWrapper(patchMeAvatarController)); // створити приватний ендпоінт для оновлення аватару корситувача
router.patch(
  '/me',
  uploadAvatar,
  validateBody(UpdateUserSchema),
  ctrlWrapper(patchMeController),
); //створити приватний ендпоінт для оновлення даних користувача

export default router;
