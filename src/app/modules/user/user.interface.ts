/* eslint-disable no-unused-vars */
import { Model } from 'mongoose';
import { USER_ROLE } from './user.constants';

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: keyof typeof USER_ROLE;
  details?: Partial<TUserDetails> | object;
  isDeleted?: boolean;
};

export type TUserDetails = {
  name: string;
  education: string;
  photoURL: string;
  mobileNumber: string;
  whatsAppNumber: string;
  profession: string;
  gender: string;
  // dateOfBirth: string;
  address: string;
};

// creating custom statics method
export interface UserStaticModel extends Model<TUser> {
  //instance methods for checking if the user exist
  isUserExistsByEmail(id: string): Promise<TUser | null>;

  //instance methods for checking if passwords are matched
  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
