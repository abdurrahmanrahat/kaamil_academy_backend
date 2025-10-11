import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { refreshAuthKey } from '../../utils/authKey';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AuthServices } from './auth.service';

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const loggedInUser = req.body;

  const { accessToken, refreshToken } =
    await AuthServices.loginUserIntoDb(loggedInUser);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: { accessToken, refreshToken },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body || {};

  if (!refreshToken) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Please provide refresh token');
  }

  const accessToken = await AuthServices.refreshToken(refreshToken);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Token refreshed successfully',
    data: { accessToken },
  });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const code = req.query.code;

  const { accessToken, refreshToken } = await AuthServices.googleLoginIntoDb(
    code as string,
  );

  // set cookie
  res.cookie(refreshAuthKey, refreshToken, {
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: config.node_env === 'production' ? 'none' : 'lax',
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User login successfully',
    data: { accessToken },
  });
});

export const AuthControllers = {
  loginUser,
  refreshToken,
  googleLogin,
};
