import { z } from 'zod'

// Auth validation schemas
export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    fullName: z.string().min(2, 'Name must be at least 2 characters').optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const passwordResetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

// Organization validation schemas
export const createOrganizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and dashes'),
})

export const inviteMemberSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum(['admin', 'member', 'viewer']),
})

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
export type PasswordResetFormData = z.infer<typeof passwordResetSchema>
export type CreateOrganizationFormData = z.infer<typeof createOrganizationSchema>
export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>
