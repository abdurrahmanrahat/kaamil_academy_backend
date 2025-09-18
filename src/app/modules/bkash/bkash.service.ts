import axios from 'axios';
import uniqid from 'uniqid';
import config from '../../config';
import AppError from '../../errors/AppError';
import { Payment } from '../payment/payment.model';
import { BkashToken } from './bkash.model';

const BKASH_BASE_URL = config.bkash_checkout_base_url;
const APP_KEY = config.bkash_checkout_app_key;
const APP_SECRET = config.bkash_checkout_app_secret;
const USERNAME = config.bkash_checkout_username;
const PASSWORD = config.bkash_checkout_password;

// get a valid token
const getValidToken = async (): Promise<string> => {
  const tokenData = await BkashToken.findOne();

  if (!tokenData) {
    return await generateNewToken(); // generate new token
  }

  // If grant_token is still valid, return it
  if (new Date(tokenData.grantExpiresAt) > new Date()) {
    return tokenData.grantToken;
  }

  // If refresh_token is valid, use it to get a new grant_token
  if (new Date(tokenData.refreshExpiresAt) > new Date()) {
    return await useRefreshToken(tokenData.refreshToken);
  }

  // If both expired, generate a new grant_token
  return await generateNewToken();
};

// Generate a New Grant Token
const generateNewToken = async (): Promise<string> => {
  try {
    const response = await axios.post(
      `${BKASH_BASE_URL}/tokenized/checkout/token/grant`,
      {
        app_key: APP_KEY,
        app_secret: APP_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          username: USERNAME as string,
          password: PASSWORD as string,
        },
      },
    );

    if (!response.data.id_token) {
      throw new AppError(401, 'Failed to get grant token');
    }

    const { id_token, refresh_token, expires_in } = response.data;

    const grantExpiresAt = new Date(Date.now() + expires_in * 1000);
    const refreshExpiresAt = new Date(Date.now() + 28 * 24 * 60 * 60 * 1000); // 28 days expiry

    await BkashToken.findOneAndUpdate(
      {},
      {
        grantToken: id_token,
        refreshToken: refresh_token,
        grantExpiresAt,
        refreshExpiresAt,
      },
      { upsert: true },
    );

    return id_token;
  } catch (error: any) {
    throw new AppError(
      500,
      error.message || 'Could not generate new bKash token',
    );
  }
};

// Use Refresh Token to Get New Grant Token
const useRefreshToken = async (refreshToken: string): Promise<string> => {
  const response = await axios.post(
    `${BKASH_BASE_URL}/tokenized/checkout/token/refresh`,
    {
      app_key: APP_KEY,
      app_secret: APP_SECRET,
      refresh_token: refreshToken,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        username: USERNAME as string,
        password: PASSWORD as string,
      },
    },
  );

  const { id_token, expires_in } = response.data;

  const grantExpiresAt = new Date(Date.now() + expires_in * 1000);

  await BkashToken.findOneAndUpdate(
    {},
    { grantToken: id_token, grantExpiresAt },
  );

  return id_token;
};

// Create Payment
const createPayment = async (amount: number, callbackUrl: string) => {
  const order_id = uniqid().toUpperCase();

  const token = await getValidToken();

  const payload = {
    mode: '0011',
    payerReference: ' ',
    callbackURL: `${callbackUrl}`,
    // merchantAssociationInfo: 'MI05MID54RF09123456One',
    amount: amount,
    currency: 'BDT',
    intent: 'sale',
    merchantInvoiceNumber: `INV-${order_id}`,
  };

  const response = await axios.post(
    `${BKASH_BASE_URL}/tokenized/checkout/create`,
    payload,
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        'x-app-key': APP_KEY,
      },
    },
  );

  if (response.data.statusCode === '2001') {
    throw new AppError(401, 'Invalid App Key!');
  }

  return response.data.bkashURL;
};

// Execute Payment
const callbackPayment = async (paymentID: string) => {
  const token = await getValidToken();

  const response = await axios.post(
    `${BKASH_BASE_URL}/tokenized/checkout/execute`,
    { paymentID },
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `Bearer ${token}`,
        'x-app-key': APP_KEY,
      },
    },
  );

  // database action here
  const paymentInfo = {
    paymentID: response.data.paymentID,
    trxID: response.data.trxID,
    payerAccount: response.data.payerAccount,
    amount: response.data.amount,
    paymentExecuteTime: response.data.paymentExecuteTime,
    paymentMethod: 'bka',
    isRefund: false,
  };

  await Payment.create(paymentInfo);

  return response.data;
};

// Query Payment Status
const queryPayment = async (paymentID: string) => {
  const token = await getValidToken();

  const response = await axios.post(
    `${BKASH_BASE_URL}/tokenized/checkout/payment/status`,
    { paymentID },
    {
      headers: {
        'Content-Type': 'application/json',
        authorization: `${token}`,
        'x-app-key': APP_KEY,
      },
    },
  );

  return response.data;
};

export const BkashService = {
  createPayment,
  callbackPayment,
  queryPayment,
};
