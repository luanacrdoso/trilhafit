import { useQuery } from '@tanstack/react-query';
import { buscarTreinos } from '../treinos.service';

/**
 * Hook de dados: encapsula o React Query e a camada de serviço.
 * Páginas consomem apenas este hook — nunca chamam o service diretamente.
 */
export function useTreinos() {
  return useQuery({
    queryKey: ['treinos'],
    queryFn: buscarTreinos,
  });
}
