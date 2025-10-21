import mongoose, { Schema } from 'mongoose';
import { TQuranLCBasic } from './quran-lc-basic.interface';

const QuranLCBasicSchema = new Schema<TQuranLCBasic>(
  {
    userName: {
      type: String,
      required: [true, 'User name is required'],
    },
    userGender: {
      type: String,
      enum: {
        values: ['male', 'female'],
        message: 'Gender must be either male or female',
      },
      required: [true, 'Gender is required'],
    },
    dateOfBirth: {
      type: String,
      required: [true, 'Date of birth is required'],
    },
    profession: {
      type: String,
      required: [true, 'Profession is required'],
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      minlength: [11, 'Phone number must be at least 11 digits'],
    },
    whatsAppNumber: {
      type: String,
      required: [true, 'WhatsApp number is required'],
      minlength: [11, 'WhatsApp number must be at least 11 digits'],
    },
    batch: {
      type: String,
      required: [true, 'Batch is required'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
    },
    RegFeeNumber: {
      type: String,
      required: [true, 'Registration fee number is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['completed', 'pending'],
        message: 'Status must be either completed, or pending',
      },
      default: 'pending',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

export const QuranLCBasic = mongoose.model<TQuranLCBasic>(
  'QuranLCBasic',
  QuranLCBasicSchema,
);
