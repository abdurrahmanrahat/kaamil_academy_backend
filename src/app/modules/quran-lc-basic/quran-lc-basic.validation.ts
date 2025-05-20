import { z } from 'zod';

const createQuranLCBasicValidationSchema = z.object({
  body: z.object({
    userName: z.string().min(2, 'Name must be at least 2 characters long'),
    userGender: z.enum(['male', 'female']),
    dateOfBirth: z.string(),
    profession: z.string(),
    address: z.string(),
    phoneNumber: z.string().min(11, 'Phone number must be at least 11 digits'),
    whatsAppNumber: z
      .string()
      .min(11, 'WhatsApp number must be at least 11 digits'),
    batch: z.string().min(1, 'Batch is required'),
    paymentMethod: z.string(),
    RegFeeNumber: z.string(),
  }),
});

const updateQuranLCBasicValidationSchema = z.object({
  body: z.object({
    userName: z
      .string()
      .min(2, 'Name must be at least 2 characters long')
      .optional(),
    userGender: z.enum(['male', 'female']).optional(),
    dateOfBirth: z.string().optional(),
    profession: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z
      .string()
      .min(11, 'Phone number must be at least 11 digits')
      .optional(),
    whatsAppNumber: z
      .string()
      .min(11, 'WhatsApp number must be at least 11 digits')
      .optional(),
    batch: z.string().optional(),
    paymentMethod: z.string().optional(),
    RegFeeNumber: z.string().optional(),
    status: z.enum(['default', 'completed', 'waiting']).optional(),
  }),
});

export const QuranLCBasicValidations = {
  createQuranLCBasicValidationSchema,
  updateQuranLCBasicValidationSchema,
};
