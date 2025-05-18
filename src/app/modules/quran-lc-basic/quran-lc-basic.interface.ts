export type TQuranLCBasic = {
  userName: string;
  userEmail: string;
  userGender: 'male' | 'female';
  dateOfBirth: string;
  profession: string;
  address: string;
  phoneNumber: string;
  whatsAppNumber: string;
  batch: 'batch-01';
  paymentMethod: string; //
  RegFeeNumber: string; //
  status: 'default' | 'completed' | 'waiting';
};
