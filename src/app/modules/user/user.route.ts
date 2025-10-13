import express from 'express';
import { auth } from '../../middlewares/auth';
import ValidateRequest from '../../middlewares/ValidateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidations } from './user.validation';

const router = express.Router();

router.post(
  '/register',
  ValidateRequest(UserValidations.createUserValidationSchema),
  UserControllers.createUser,
);

router.get('/', UserControllers.getAllUsers);

router.get('/current-user/:email', UserControllers.getCurrentUserByEmail);

router.get(
  '/get-me',
  auth(USER_ROLE.user, USER_ROLE.admin),
  UserControllers.getMe,
);

router.patch(
  '/:userId',
  ValidateRequest(UserValidations.updateUserValidationSchema),
  UserControllers.updateUser,
);

router.delete('/:userId', UserControllers.deleteUser);

export const UserRoutes = router;
