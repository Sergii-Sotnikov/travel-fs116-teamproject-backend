import { Router } from 'express';
import {
  addStoryController,
  deleteStoryByIdController,
  getAuthorByIdController,
  getCategoriesController,
  getStoriesAuthorsController,
  getStoriesByAuthorIdController,
  getStoriesController,
  getStoryByIdController,
  storyEditController,
} from '../controllers/stories.js';
import {
  createStorySchema,
  updateStoriesSchema,
} from '../validation/stories.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import { isValidId } from '../middlewares/isValidId.js';

const router = Router();

/**
 * PUBLIC ROUTES
 */
router.get('/', getStoriesController); // GET all stories
router.get('/categories', getCategoriesController); // GET list of categories
router.get('/:id', isValidId, getStoryByIdController); // GET single story by ID

/**
 * AUTHORS
 */
router.get('/authors', getStoriesAuthorsController); // GET all authors
router.get('/authors/:id', isValidId, getAuthorByIdController); // GET one author
router.get('/authors/:id/stories', isValidId, getStoriesByAuthorIdController); // GET stories of specific author

/**
 * PRIVATE ROUTES (requires authentication)
 */
router.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateBody(createStorySchema),
  addStoryController,
);

router.patch(
  '/:id',
  authenticate,
  isValidId,
  upload.single('photo'),
  validateBody(updateStoriesSchema),
  storyEditController,
);

router.delete('/:id', authenticate, isValidId, deleteStoryByIdController);

export default router;