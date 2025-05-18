import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { BlogRoutes } from '../modules/blog/blog.route';
import { QuranLCBasicRoutes } from '../modules/quran-lc-basic/quran-lc-basic.route';
import { UserRoutes } from '../modules/user/user.route';

const router = express.Router();

// router.use('/users', UserRoutes);

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/blogs',
    route: BlogRoutes,
  },
  {
    path: '/quran-lc-basic-students',
    route: QuranLCBasicRoutes,
  },
];

moduleRoutes.forEach((item) => router.use(item.path, item.route));

export default router;
