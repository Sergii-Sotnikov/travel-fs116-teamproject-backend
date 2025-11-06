import { Router } from 'express';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { createMeSavedStoriesController, deleteMeSavedStoriesController, getMeProfileController, getUsersByIdController, patchMeAvatarController, patchMeController } from '../controllers/users.js';

const router = Router();

//публічні
router.get('/:userId',ctrlWrapper(getUsersByIdController)); // створити публічний ендпоінт на отримання даних про користувача за ID - дані користувача + список статей

//Приватні
// router.use(authenticate);
router.get('/me/profile', ctrlWrapper(getMeProfileController)); // створити приватний ендпоінт на отримання інформації про поточного користувача
router.post('/me/saved/:storyId', ctrlWrapper(createMeSavedStoriesController)); // створити приватний ендпоінт для додавання статті до збережених статей користувача
router.delete('/me/saved/:storyId', ctrlWrapper(deleteMeSavedStoriesController)); // створити приватний ендпоінт для видалення статті зі збережених статей користувача
router.patch('/me/avatar', ctrlWrapper(patchMeAvatarController)); // створити приватний ендпоінт для оновлення аватару корситувача
router.patch('/me', ctrlWrapper(patchMeController)); //створити приватний ендпоінт для оновлення даних користувача

export default router;
