import { afterEach, describe, expect, it } from 'vitest';
import { useFavoritosStore } from './favoritos.store';

function resetarStore() {
  useFavoritosStore.setState({ favoritosIds: [] });
}

describe('useFavoritosStore', () => {
  afterEach(() => {
    resetarStore();
  });

  it('começa sem nenhum favorito', () => {
    expect(useFavoritosStore.getState().favoritosIds).toEqual([]);
  });

  it('adiciona um treino aos favoritos ao alternar', () => {
    useFavoritosStore.getState().alternarFavorito('treino-1');
    expect(useFavoritosStore.getState().favoritosIds).toEqual(['treino-1']);
    expect(useFavoritosStore.getState().ehFavorito('treino-1')).toBe(true);
  });

  it('remove um treino dos favoritos ao alternar de novo', () => {
    useFavoritosStore.getState().alternarFavorito('treino-1');
    useFavoritosStore.getState().alternarFavorito('treino-1');
    expect(useFavoritosStore.getState().favoritosIds).toEqual([]);
    expect(useFavoritosStore.getState().ehFavorito('treino-1')).toBe(false);
  });

  it('mantém múltiplos favoritos independentes', () => {
    useFavoritosStore.getState().alternarFavorito('treino-1');
    useFavoritosStore.getState().alternarFavorito('treino-2');
    expect(useFavoritosStore.getState().favoritosIds).toEqual(['treino-1', 'treino-2']);
  });

  it('limparFavoritos esvazia a lista', () => {
    useFavoritosStore.getState().alternarFavorito('treino-1');
    useFavoritosStore.getState().limparFavoritos();
    expect(useFavoritosStore.getState().favoritosIds).toEqual([]);
  });
});
