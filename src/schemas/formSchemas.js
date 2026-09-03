import { z } from 'zod';

// Phase 2 RegEx Rules: Minimum 8 chars, 1 uppercase letter, 1 special character
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const PHONE_REGEX = /^\+?[1-9]\d{1,14}$/;

/**
 * Step 1 Zod Schema: Account Details
 */
export const accountStepSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: 'Full name must be at least 2 characters' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters' })
    .max(20, { message: 'Username cannot exceed 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  email: z
    .string()
    .min(1, { message: 'Email address is required' })
    .email({ message: 'Please enter a valid email address (e.g. name@domain.com)' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(PHONE_REGEX, { message: 'Enter a valid international phone number (e.g. +1234567890)' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters long' })
    .regex(PASSWORD_REGEX, {
      message: 'Password must contain at least 1 uppercase letter and 1 special character (!@#$%^&*)'
    }),
  confirmPassword: z.string().min(1, { message: 'Please confirm your password' })
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword']
});

/**
 * Step 2 Zod Schema: Professional History
 */
export const professionalStepSchema = z.object({
  jobTitle: z
    .string()
    .min(2, { message: 'Job title / role is required' }),
  industry: z
    .string()
    .min(1, { message: 'Please select an industry category' }),
  companyName: z
    .string()
    .min(2, { message: 'Company or organization name is required' }),
  yearsExperience: z
    .string()
    .min(1, { message: 'Please select years of experience' }),
  skills: z
    .array(z.string())
    .min(1, { message: 'Please select at least 1 primary skill' }),
  portfolioUrl: z
    .string()
    .url({ message: 'Please enter a valid URL (e.g. https://github.com/username)' })
    .or(z.literal(''))
});

/**
 * Step 3 Zod Schema: Payment & Plan Setup
 */
export const paymentStepSchema = z.object({
  planTier: z
    .enum(['starter', 'professional', 'enterprise'], {
      required_error: 'Please select a subscription plan tier'
    }),
  paymentMethod: z
    .enum(['card', 'upi', 'paypal'], {
      required_error: 'Please select a payment method'
    }),
  cardHolder: z
    .string()
    .min(2, { message: 'Cardholder / account name is required' }),
  cardNumber: z
    .string()
    .min(15, { message: 'Enter a valid 15 or 16-digit card / account number' })
    .regex(/^[0-9\s-]+$/, { message: 'Card number must contain digits only' }),
  expiryDate: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, { message: 'Format must be MM/YY (e.g. 12/28)' }),
  cvv: z
    .string()
    .regex(/^[0-9]{3,4}$/, { message: 'CVV must be 3 or 4 digits' }),
  billingAddress: z
    .string()
    .min(5, { message: 'Billing street address is required' })
});

/**
 * Combined Complete Registration Boundary Schema
 */
export const fullRegistrationSchema = z.object({
  account: accountStepSchema,
  professional: professionalStepSchema,
  payment: paymentStepSchema,
  agreeTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the Terms of Service & Privacy Policy to proceed' })
  })
});
