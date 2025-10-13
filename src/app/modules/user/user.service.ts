import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import config from '../../config';
import AppError from '../../errors/AppError';
import { userSearchableFields } from './user.constant';
import { TUser } from './user.interface';
import { User } from './user.model';

// post
const createUserInfoDb = async (user: TUser) => {
  const existingUser = await User.findOne({ email: user.email });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }

  const result = await User.create(user);
  return result;
};

// get
const getUsersFromDb = async (query: Record<string, unknown>) => {
  const userQuery = new QueryBuilder(
    User.find({ isDeleted: false }).select('-password'),
    query,
  )
    .search(userSearchableFields)
    .filter();
  // .pagination();

  const data = await userQuery.modelQuery;

  // for count document except pagination.
  const userQueryWithoutPagination = new QueryBuilder(
    User.find({ isDeleted: false }),
    query,
  )
    .search(userSearchableFields)
    .filter();

  const document = await userQueryWithoutPagination.modelQuery;
  const totalCount = document?.length;
  return { data, totalCount };
};

// get
const getCurrentUserByEmailFromDb = async (email: string) => {
  const result = await User.findOne({ email, isDeleted: false }).select(
    '-password',
  );
  return result;
};

// get logged in user
const getLoggedInUserFromDB = async (accessToken: string) => {
  try {
    const verifiedToken = jwt.verify(
      accessToken,
      config.jwt_access_secret as string,
    );

    const { email } = verifiedToken as JwtPayload;

    const user = await User.findOne({ email }).select('-password');

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
    }

    return user;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token!');
  }
};

// update
const updateUserIntoDb = async (userId: string, body: Partial<TUser>) => {
  const result = await User.findOneAndUpdate({ _id: userId }, body, {
    new: true,
  });
  return result;
};

// delete
const deleteUserIntoDb = async (userId: string) => {
  const result = await User.findByIdAndUpdate(
    userId,
    { isDeleted: true },
    { new: true },
  );

  return result;
};

export const UserServices = {
  createUserInfoDb,
  getUsersFromDb,
  getCurrentUserByEmailFromDb,
  getLoggedInUserFromDB,
  updateUserIntoDb,
  deleteUserIntoDb,
};
