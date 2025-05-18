import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../errors/AppError';
import { userSearchableFields } from './user.constants';
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
  updateUserIntoDb,
  deleteUserIntoDb,
};
