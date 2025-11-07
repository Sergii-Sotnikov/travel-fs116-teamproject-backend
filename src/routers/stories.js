import { Router } from 'express';



import { deleteMeSavedStoriesController } from '../controllers/users.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  createStoryController,
  getAllStoriesController,
  patchStoryController,
} from '../controllers/stories.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';
import {authenticate} from '../middlewares/authenticate.js';


const router = Router();

//публічний
router.get('/', ctrlWrapper(getAllStoriesController)); //створити публічний ендпоінт для ОТРИМАННЯ історій + пагінація + фільтрація за категоріями

//приватний
router.post('/', ctrlWrapper(createStoryController)); //створити приватний ендпоінт для СТВОРЕННЯ історії
router.delete('saved-stories/:storyId', /*authenticate middleware*/ ctrlWrapper(deleteMeSavedStoriesController)) //роутер для удаления истории
router.patch(
  '/:storyId',
  authenticate,
  isValidId,
  upload.single('storyImage'),
  ctrlWrapper(patchStoryController),
); //створити приватний ендпоінт для РЕДАГУВАННЯ історії


export default router;
