import axios from 'axios';
import config from '../config';

export const sendMessageToUserNumber = async ({
  phone,
  message,
}: {
  phone: string;
  message: string;
}) => {
  const phoneNumber = numberWithCountryCode(phone);

  // Encode message to handle Bangla Unicode characters
  const encodedMessage = encodeURIComponent(message);

  await axios(
    `https://sms.bluebayit.com/api/sendsms?api_key=${config.bulk_sms_api_key}&type=unicode&phone=${phoneNumber}&message=${encodedMessage}`,
  );

  // response.data.is_success will be true
};

function numberWithCountryCode(number: string) {
  // Remove spaces or dashes if any
  number = number.replace(/[\s-]/g, '');

  if (number.startsWith('+88')) {
    // remove + sign
    number = number.substring(1);
  } else if (number.startsWith('01') && number.length === 11) {
    // Add 88 at the beginning if only 01.... format
    number = '88' + number;
  }

  // If it already starts with 8801.., no changes needed
  return number;
}
