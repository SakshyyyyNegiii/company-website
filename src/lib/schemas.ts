import { z } from 'zod';

/**
 * Zod validation schema for client sign-up
 * Enforces:
 * - Valid full name (at least 2 characters)
 * - Valid email format
 * - Password complexity:
 *   - Minimum 8 characters
 *   - At least one numeric digit (0-9)
 *   - At least one special character (!@#$%^&* etc.)
 * - Confirm password matching
 */
export const signUpSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required.')
      .min(2, 'Full name must be at least 2 characters.'),
    email: z
      .string()
      .trim()
      .min(1, 'Email address is required.')
      .email('Please enter a valid email address (e.g. name@company.com).'),
    phoneNumber: z.string().trim().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long.')
      .regex(/[0-9]/, 'Password must contain at least one number (0-9).')
      .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character (e.g. !@#$%^&*).'),
    confirmPassword: z.string().min(1, 'Please confirm your password.'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match. Please verify both password fields.',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
