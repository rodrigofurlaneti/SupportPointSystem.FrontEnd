import { z } from 'zod';

export const CreateSellerSchema = z.object({
    cpf: z.string().min(11, 'CPF inválido').max(14),
    password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres'),
    name: z.string().min(1, 'Nome obrigatório').max(100),
    phone: z.string().regex(/^\d{10,11}$/, 'Telefone inválido').optional().or(z.literal('')),
    email: z.string().email('Email inválido').optional().or(z.literal('')),
});

// Para edição, a senha é opcional (só preenche se quiser mudar)
export const UpdateSellerSchema = CreateSellerSchema.extend({
    password: z.string().min(8, 'Senha deve ter ao menos 8 caracteres').optional().or(z.literal('')),
}).partial().extend({
    sellerId: z.string().uuid(), // Alinhado com o Back-end
});

export type CreateSeller = z.infer<typeof CreateSellerSchema>;
export type UpdateSeller = z.infer<typeof UpdateSellerSchema>;

export interface Seller {
    sellerId: string; // O Swagger retornou 'sellerId', não 'id'
    userId: string;
    name: string;
    cpf: string;
    phone?: string;
    email?: string;
    isActive: boolean; // O Swagger retornou 'isActive', não 'active'
    createdAt: string;
    updatedAt?: string | null;
}