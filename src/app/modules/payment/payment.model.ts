import { model, Schema } from 'mongoose';
import { TPayment } from './payment.interface';

const PaymentSchema = new Schema<TPayment>(
  {
    paymentID: { type: String, required: true },
    trxID: { type: String, required: true },
    payerAccount: { type: String, required: true },
    amount: { type: String, required: true },
    paymentExecuteTime: { type: String, required: true },
    paymentMethod: {
      type: String,
      enum: ['bka', 'nag'],
      required: true,
    },
    isRefund: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Payment = model<TPayment>('Payment', PaymentSchema);
