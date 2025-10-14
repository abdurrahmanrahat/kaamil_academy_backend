import { Request, Response } from 'express';
import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { getTenMinExpiryToken } from '../../utils/getTenMinExpiryToken';
import { sendResponse } from '../../utils/sendResponse';
import { BkashService } from '../bkash/bkash.service';
import { QuranLCBasicServices } from './quran-lc-basic.service';

const createQuranLCBasic = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req.body;

  const result = await QuranLCBasicServices.createQuranLCBasicIntoDb(userInfo);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Registration successfully done',
    data: result,
  });
});

const getAllQuranLCBasics = catchAsync(async (req: Request, res: Response) => {
  const result = await QuranLCBasicServices.getQuranLCBasicsFromDb(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All students retrieved successfully',
    data: result,
  });
});

const updateQuranLCBasic = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;

  const result = await QuranLCBasicServices.updateQuranLCBasicsIntoDb(
    studentId,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student status updated successfully',
    data: result,
  });
});

const deleteQuranLCBasic = catchAsync(async (req: Request, res: Response) => {
  const { studentId } = req.params;
  const result = await QuranLCBasicServices.deleteQuranLCBasicIntoDb(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});

// const makePDFQuranLCBasic = catchAsync(async (req: Request, res: Response) => {
//   await QuranLCBasicServices.makePdfQuranLCBasicsFromDb(res);
// });

const createQuranLCBasicPayment = catchAsync(
  async (req: Request, res: Response) => {
    const {
      amount,
      paymentForId,
      paymentSuccessURL,
      paymentFailedURL,
      paymentMethod,
    } = req.body;

    const callbackUrl = `${config.backed_live_url}/quran-lc-basic-students/payment/callback?paymentForId=${paymentForId}&paymentSuccessURL=${paymentSuccessURL}&paymentFailedURL=${paymentFailedURL}&amount=${amount}&paymentMethod=${paymentMethod}`;

    // BKASH || NAGAD
    let result;

    if (paymentMethod === 'bkash') {
      result = await BkashService.createPayment(amount, callbackUrl);
    } else {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: 'Quran lC basic payment has not initiated',
        data: '',
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Quran lC basic payment initiated successfully',
      data: result,
    });
  },
);

const quranLCBasicCallback = catchAsync(async (req: Request, res: Response) => {
  const { paymentMethod } = req.query;

  if (paymentMethod === 'bkash') {
    const {
      paymentID,
      status,
      paymentForId,
      paymentSuccessURL,
      paymentFailedURL,
      // amount,
    } = req.query;

    if (!paymentID) {
      return res.redirect(`${config.frontend_live_url}${paymentFailedURL}`); // Redirect to fail page
    }

    if (status !== 'success') {
      return res.redirect(`${config.frontend_live_url}${paymentFailedURL}`); // Redirect if payment failed
    }

    const result = await BkashService.callbackPayment(paymentID as string);

    const verificationToken = getTenMinExpiryToken(paymentForId as string);

    if (result && result.paymentID) {
      // do database action here for success
      await QuranLCBasicServices.updateQuranLCBasicsIntoDb(
        paymentForId as string,
        { status: 'completed' },
      );

      return res.redirect(
        `${config.frontend_live_url}${paymentSuccessURL}?verificationToken=${verificationToken}`,
      ); // Redirect to success page
    } else {
      return res.redirect(`${config.frontend_live_url}${paymentFailedURL}`); // Redirect if execution fails
    }
  }
});

export const QuranLCBasicControllers = {
  createQuranLCBasic,
  getAllQuranLCBasics,
  updateQuranLCBasic,
  deleteQuranLCBasic,
  createQuranLCBasicPayment,
  quranLCBasicCallback,
};
