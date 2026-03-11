export const apiErrorMessages: Record<string, string> = {
  CONFLICT_CHECKIN: 'Você já possui um check-in ativo. Faça o check-out primeiro.',
  OUTSIDE_RADIUS: 'Você está fora do raio de 100m do cliente.',
  NO_ACTIVE_VISIT: 'Nenhuma visita ativa encontrada para fazer check-out.',
  SELLER_NOT_FOUND: 'Vendedor não encontrado. Contate o administrador.',
  CUSTOMER_NOT_FOUND: 'Cliente não encontrado.',
  CPF_ALREADY_EXISTS: 'Já existe um vendedor com este CPF.',
  INVALID_CPF: 'CPF informado é inválido.',
  INVALID_CNPJ: 'CNPJ informado é inválido.',
  UNAUTHORIZED: 'Credenciais inválidas.',
  SELLER_INACTIVE: 'Sua conta está inativa. Contate o administrador.',
};

export function getApiErrorMessage(err: any): string {
  const code = err?.response?.data?.code;
  const message = err?.response?.data?.message;
  return apiErrorMessages[code] ?? message ?? 'Erro inesperado. Tente novamente.';
}
