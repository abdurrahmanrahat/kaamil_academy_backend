import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  google_oauth_client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
  google_oauth_client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
  bulk_sms_api_key: process.env.BULK_SMS_API_KEY,
  frontend_live_url: process.env.FRONTEND_LIVE_URL,
  backed_live_url: process.env.BACKED_LIVE_URL,
  bkash_checkout_base_url: process.env.BKASH_CHECKOUT_BASE_URL,
  bkash_checkout_username: process.env.BKASH_CHECKOUT_USERNAME,
  bkash_checkout_password: process.env.BKASH_CHECKOUT_PASSWORD,
  bkash_checkout_app_key: process.env.BKASH_CHECKOUT_APP_KEY,
  bkash_checkout_app_secret: process.env.BKASH_CHECKOUT_APP_SECRET,
};
