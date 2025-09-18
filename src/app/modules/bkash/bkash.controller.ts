import httpStatus from 'http-status';
import config from '../../config';
import catchAsync from '../../utils/catchAsync';
import { getTenMinExpiryToken } from '../../utils/getTenMinExpiryToken';
import { sendResponse } from '../../utils/sendResponse';
import { BkashService } from './bkash.service';

const createPayment = catchAsync(async (req, res) => {
  const { amount, paymentForId, paymentSuccessURL, paymentFailedURL } =
    req.body;

  const callbackUrl = `${config.backed_live_url}/bkash/callback?paymentForId=${paymentForId}&paymentSuccessURL=${paymentSuccessURL}&paymentFailedURL=${paymentFailedURL}&amount=${amount}`;

  const result = await BkashService.createPayment(amount, callbackUrl);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bkash payment initiated successfully',
    data: result,
  });
});

const callbackPayment = catchAsync(async (req, res) => {
  const {
    paymentID,
    status,
    paymentForId,
    paymentSuccessURL,
    paymentFailedURL,
    // amount,
  } = req.query;

  if (!paymentID) {
    return res.redirect(`${config.frontend_live_url}${paymentFailedURL}`); // ✅ Redirect to fail page
  }

  if (status !== 'success') {
    return res.redirect(`${config.frontend_live_url}${paymentFailedURL}`); // ✅ Redirect if payment failed
  }

  const result = await BkashService.callbackPayment(paymentID as string);

  /**
  {
  paymentID: 'TR0011Q0rCJb11743659089595',
  trxID: 'CD35562C23',
  transactionStatus: 'Completed',
  amount: '1',
  currency: 'BDT',
  intent: 'sale',
  paymentExecuteTime: '2025-04-03T11:45:32:082 GMT+0600',
  merchantInvoiceNumber: 'INV-1234567',
  payerType: 'Customer',
  payerReference: '***',
  customerMsisdn: '01704345701',
  payerAccount: '01704345701',
  statusCode: '0000',
  statusMessage: 'Successful'
  }*/

  const verificationToken = getTenMinExpiryToken(paymentForId as string);

  if (result && result.paymentID) {
    return res.redirect(
      `${config.frontend_live_url}${paymentSuccessURL}?verificationToken=${verificationToken}`,
    ); // ✅ Redirect to success page
  } else {
    return res.redirect(`${config.frontend_live_url}${paymentFailedURL}`); // ✅ Redirect if execution fails
  }
});

const queryPayment = catchAsync(async (req, res) => {
  const { paymentID } = req.params;

  const result = await BkashService.queryPayment(paymentID);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Bkash payment status retrieved successfully',
    data: result,
  });
});

export const BkashController = {
  createPayment,
  callbackPayment,
  queryPayment,
};
