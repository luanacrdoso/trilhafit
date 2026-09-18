import { useQuery } from '@tanstack/react-query';
import { buscarTreinoPorSlug } from '../treinos.service';

/**
 * Hook de dados para a página de detalhe de um treino.
 * `enabled` evita disparar a busca quando o slug ainda não está disponível.
 */
export function useTreinoPorSlug(slug: string | undefined) {
  return useQuery({
    queryKey: ['treino', slug],
    queryFn: () => buscarTreinoPorSlug(slug as string),
    enabled: Boolean(slug),
  });
}
