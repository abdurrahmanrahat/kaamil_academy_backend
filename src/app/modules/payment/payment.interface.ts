export type TPayment = {
  paymentID: string;
  trxID: string;
  payerAccount: string;
  amount: string;
  paymentExecuteTime: string;
  paymentMethod: 'bka' | 'nag';
  isRefund?: boolean;
};
