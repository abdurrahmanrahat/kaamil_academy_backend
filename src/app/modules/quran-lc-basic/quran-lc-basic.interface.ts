export type TQuranLCBasic = {
  userName: string;
  userGender: 'male' | 'female';
  dateOfBirth: string;
  profession: string;
  address: string;
  phoneNumber: string;
  whatsAppNumber: string;
  batch: string;
  paymentMethod: string;
  RegFeeNumber: string;
  status: 'pending' | 'completed';
  isDeleted?: boolean;
};
