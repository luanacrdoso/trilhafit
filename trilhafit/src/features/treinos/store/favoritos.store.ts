import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface EstadoFavoritos {
  favoritosIds: string[];
  alternarFavorito: (treinoId: string) => void;
  ehFavorito: (treinoId: string) => boolean;
  limparFavoritos: () => void;
}

/**
 * Estado global de favoritos, persistido em localStorage via middleware
 * `persist`. Consumido diretamente pelo Header, TreinoCard e FavoritosPage
 * sem qualquer prop drilling.
 */
export const useFavoritosStore = create<EstadoFavoritos>()(
  persist(
    (set, get) => ({
      favoritosIds: [],

      alternarFavorito: (treinoId: string) => {
        set((estado) => {
          const jaEhFavorito = estado.favoritosIds.includes(treinoId);
          return {
            favoritosIds: jaEhFavorito
              ? estado.favoritosIds.filter((id) => id !== treinoId)
              : [...estado.favoritosIds, treinoId],
          };
        });
      },

      ehFavorito: (treinoId: string) => get().favoritosIds.includes(treinoId),

      limparFavoritos: () => set({ favoritosIds: [] }),
    }),
    {
      name: 'trilhafit-favoritos',
    }
  )
);
