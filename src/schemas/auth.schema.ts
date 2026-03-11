import { z } from 'zod';

export const LoginRequestSchema = z.object({
  cpf: z.string().min(11).max(14),
  password: z.string().min(8),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  userRole: z.enum(['ADMIN', 'SELLER']),
  userId: z.string().uuid(),
  sellerId: z.string().uuid().nullable(),
  expiresAt: z.string().datetime(),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
