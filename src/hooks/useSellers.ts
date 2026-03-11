import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sellersApi } from '../api/sellers.api';
import type { CreateSeller } from '../schemas/seller.schema';

export const SELLERS_KEY = 'sellers';

export function useSellers() {
  return useQuery({
    queryKey: [SELLERS_KEY],
    queryFn: sellersApi.getAll,
    staleTime: 60_000,
  });
}

export function useSellerById(id: string) {
  return useQuery({
    queryKey: [SELLERS_KEY, id],
    queryFn: () => sellersApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sellersApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: [SELLERS_KEY] }),
  });
}

export function useUpdateSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateSeller> }) =>
      sellersApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: [SELLERS_KEY] }),
  });
}

export function useDeleteSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sellersApi.delete,
    onSuccess: () => qc.invalidateQueries({ queryKey: [SELLERS_KEY] }),
  });
}
