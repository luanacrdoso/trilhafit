import { QueryClient } from '@tanstack/react-query';

// Instância única do QueryClient, compartilhada por toda a aplicação
// via <QueryClientProvider> em main.tsx.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos — dados estáticos, não precisam refetch agressivo
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
