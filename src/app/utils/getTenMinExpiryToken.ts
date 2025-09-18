import jwt from 'jsonwebtoken';
import config from '../config';

export const getTenMinExpiryToken = (paymentForId: string) => {
  const jwtPayload = {
    paymentForId,
  };

  // jwt token
  const verificationToken = jwt.sign(
    jwtPayload,
    config.jwt_access_secret as string,
    {
      expiresIn: '10m',
    },
  );

  return verificationToken;
};
