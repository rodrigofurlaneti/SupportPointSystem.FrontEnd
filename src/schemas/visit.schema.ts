import { z } from 'zod';

export const CheckinRequestSchema = z.object({
    customerId: z.string().uuid(),
    latitude: z.number().min(-90).max(90).transform(val => parseFloat(val.toFixed(8))),
    longitude: z.number().min(-180).max(180).transform(val => parseFloat(val.toFixed(8))),
});

export const CheckoutRequestSchema = z.object({
    customerId: z.string().uuid(),
    latitude: z.number(),
    longitude: z.number(),
    summary: z.string().min(1, 'Resumo obrigatório').nullable().optional(),
});

export const VisitSummaryDtoSchema = z.object({
    visitId: z.string().uuid(),
    customerId: z.string().uuid(),
    customerName: z.string(),
    sellerName: z.string(),
    checkinLatitude: z.number(),
    checkinLongitude: z.number(),
    checkinDistanceMeters: z.number(),
    checkinTimestamp: z.string(), 
    isOpen: z.boolean(),
    checkoutTimestamp: z.string().nullable(),
    durationMinutes: z.number().nullable(),
    checkoutSummary: z.string().nullable(),
});

export type CheckinRequest = z.infer<typeof CheckinRequestSchema>;
export type CheckoutRequest = z.infer<typeof CheckoutRequestSchema>;
export type VisitSummaryDto = z.infer<typeof VisitSummaryDtoSchema>;

export type VisitHistoryResponse = VisitSummaryDto[];