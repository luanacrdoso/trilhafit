import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ROTULO_CATEGORIA, ROTULO_NIVEL, type Treino } from '../types';

interface TreinoCardProps {
  treino: Treino;
  ehFavorito: boolean;
  aoAlternarFavorito: (treinoId: string) => void;
}

/**
 * Envolvido em React.memo: como a lista de treinos pode ter dezenas de
 * cards, evitamos re-renderizar todos eles quando apenas um favorito
 * muda. Para isso funcionar de verdade, a função `aoAlternarFavorito`
 * passada pelo componente pai precisa ser estável (useCallback).
 */
export const TreinoCard = memo(function TreinoCard({
  treino,
  ehFavorito,
  aoAlternarFavorito,
}: TreinoCardProps) {
  return (
    <article className="treino-card">
      <Link to={`/treinos/${treino.slug}`} className="treino-card__link">
        <div className="treino-card__imagem-wrapper">
          <img
            src={treino.imagemUrl}
            alt={`Ilustração do treino ${treino.titulo}`}
            className="treino-card__imagem"
            loading="lazy"
            onError={(evento) => {
              evento.currentTarget.style.display = 'none';
            }}
          />
          <span className={`selo selo--${treino.categoria}`}>
            {ROTULO_CATEGORIA[treino.categoria]}
          </span>
        </div>
        <div className="treino-card__corpo">
          <h3 className="treino-card__titulo">{treino.titulo}</h3>
          <p className="treino-card__meta">
            {ROTULO_NIVEL[treino.nivel]} · {treino.duracaoMinutos} min ·{' '}
            {treino.exercicios.length} exercícios
          </p>
          <div className="treino-card__grupos">
            {treino.grupoMuscular.slice(0, 3).map((grupo) => (
              <span key={grupo} className="etiqueta">
                {grupo}
              </span>
            ))}
          </div>
        </div>
      </Link>
      <button
        type="button"
        className="treino-card__botao-favorito"
        aria-pressed={ehFavorito}
        aria-label={ehFavorito ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        onClick={() => aoAlternarFavorito(treino.id)}
      >
        {ehFavorito ? '★' : '☆'}
      </button>
    </article>
  );
});
