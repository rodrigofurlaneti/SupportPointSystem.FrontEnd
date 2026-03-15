import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { visitsApi } from '../api/visits.api';
import { useAuthStore } from '../stores/auth.store';
export const VISITS_KEY = 'visits-history';
export function useVisitHistory(page = 1) {
    const { sellerId, userRole } = useAuthStore();
    return useQuery({
        queryKey: [VISITS_KEY, sellerId, page],
        queryFn: () => visitsApi.getHistory({ page, pageSize: 20 }),
        enabled: !!sellerId || userRole === 'ADMIN' || userRole === 'COMPANYOWNER' || userRole === 'COMPANY_OWNER',
        staleTime: 30_000,
    });
}
export function useCheckin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitsApi.checkin,
    onSuccess: () => qc.invalidateQueries({ queryKey: [VISITS_KEY] }),
  });
}

export function useCheckout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: visitsApi.checkout,
    onSuccess: () => qc.invalidateQueries({ queryKey: [VISITS_KEY] }),
  });
}
