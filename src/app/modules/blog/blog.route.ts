import express from 'express';
import ValidateRequest from '../../middlewares/ValidateRequest';
import { BlogControllers } from './blog.controller';
import { BlogValidations } from './blog.validation';

const router = express.Router();

// Route to create a blog
router.post(
  '/create-blog',
  // auth(USER_ROLE.admin),
  ValidateRequest(BlogValidations.createBlogValidationSchema),
  BlogControllers.createBlog,
);

// Route to get all blogs
router.get('/', BlogControllers.getAllBlogs);

// Route to get single blog
router.get('/:blogId', BlogControllers.getSingleBlog);

// Route to update a specific blog by ID
router.patch(
  '/:blogId',
  // auth(USER_ROLE.admin),
  ValidateRequest(BlogValidations.updateBlogValidationSchema),
  BlogControllers.updateBlog,
);

// Route to delete a specific blog by ID
router.delete('/:blogId', BlogControllers.deleteBlog);

export const BlogRoutes = router;
