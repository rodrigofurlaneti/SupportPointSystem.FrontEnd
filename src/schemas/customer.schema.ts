import { z } from 'zod';

export const UpsertCustomerSchema = z.object({
  companyName: z.string().min(1, 'Razão social obrigatória').max(150),
  cnpj: z.string().min(14, 'CNPJ inválido').max(18),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type UpsertCustomer = z.infer<typeof UpsertCustomerSchema>;

export interface Address {
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface Customer {
  id: string;
  companyName: string;
  cnpj: string;
  address: Address;
  latitude: number;
  longitude: number;
  active: boolean;
}
