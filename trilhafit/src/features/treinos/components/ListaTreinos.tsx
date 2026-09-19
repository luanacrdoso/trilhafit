import { useCallback } from 'react';
import type { Treino } from '../types';
import { useFavoritosStore } from '../store/favoritos.store';
import { TreinoCard } from './TreinoCard';

interface ListaTreinosProps {
  treinos: Treino[];
  mensagemVazia?: string;
}

export function ListaTreinos({
  treinos,
  mensagemVazia = 'Nenhum treino encontrado com esses filtros.',
}: ListaTreinosProps) {
  const favoritosIds = useFavoritosStore((estado) => estado.favoritosIds);
  const alternarFavorito = useFavoritosStore((estado) => estado.alternarFavorito);

  // useCallback garante que a mesma referência de função seja passada
  // para todos os TreinoCard, permitindo que o React.memo neles funcione.
  const aoAlternarFavorito = useCallback(
    (treinoId: string) => {
      alternarFavorito(treinoId);
    },
    [alternarFavorito]
  );

  if (treinos.length === 0) {
    return (
      <p className="lista-treinos__vazio" role="status">
        {mensagemVazia}
      </p>
    );
  }

  return (
    <div className="lista-treinos" role="list">
      {treinos.map((treino) => (
        <div role="listitem" key={treino.id}>
          <TreinoCard
            treino={treino}
            ehFavorito={favoritosIds.includes(treino.id)}
            aoAlternarFavorito={aoAlternarFavorito}
          />
        </div>
      ))}
    </div>
  );
}
