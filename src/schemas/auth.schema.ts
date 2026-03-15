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
    sellerName: z.string().nullable().optional(), 
    expiresAt: z.string().datetime(),
});

export const RegisterCompanySchema = z.object({
    name: z.string().min(3, "Nome muito curto").max(100),
    cpf: z.string()
        .min(11, "CPF inválido")
        .max(14)
        .transform(val => val.replace(/\D/g, '')),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    tradeName: z.string().min(1, "Nome fantasia obrigatório"),
    legalName: z.string().min(1, "Razão social obrigatória"),
    cnpj: z.string()
        .min(14, "CNPJ inválido")
        .max(18)
        .transform(val => val.replace(/\D/g, '')),
});

export const RegisterCompanyResponseSchema = z.object({
    userId: z.string().uuid(),
    companyId: z.string().uuid(),
    message: z.string().optional() 
});

export type RegisterCompanyResponse = z.infer<typeof RegisterCompanyResponseSchema>;
export type RegisterCompanyRequest = z.infer<typeof RegisterCompanySchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
