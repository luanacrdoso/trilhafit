import { Link, useParams } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import { MensagemErro } from '../../../components/MensagemErro';
import { useTreinoPorSlug } from '../hooks/useTreinoPorSlug';
import { useFavoritosStore } from '../store/favoritos.store';
import { Cronometro } from '../components/Cronometro';
import { ROTULO_CATEGORIA, ROTULO_NIVEL } from '../types';

export function TreinoDetalhePage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: treino, isLoading, isError, refetch } = useTreinoPorSlug(slug);
  const ehFavorito = useFavoritosStore((estado) =>
    treino ? estado.favoritosIds.includes(treino.id) : false
  );
  const alternarFavorito = useFavoritosStore((estado) => estado.alternarFavorito);

  if (isLoading) {
    return (
      <div className="pagina">
        <Loading rotulo="Carregando treino..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="pagina">
        <MensagemErro
          detalhe="Não foi possível carregar este treino."
          aoTentarNovamente={() => refetch()}
        />
      </div>
    );
  }

  if (!treino) {
    return (
      <div className="pagina">
        <MensagemErro titulo="Treino não encontrado" detalhe="Verifique o link e tente novamente." />
        <Link to="/treinos" className="botao botao--secundario">
          Voltar ao catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="pagina pagina--detalhe">
      <div className="detalhe-treino__cabecalho">
        <div>
          <span className={`selo selo--${treino.categoria}`}>
            {ROTULO_CATEGORIA[treino.categoria]}
          </span>
          <h1>{treino.titulo}</h1>
          <p className="detalhe-treino__meta">
            {ROTULO_NIVEL[treino.nivel]} · {treino.duracaoMinutos} minutos ·{' '}
            {treino.grupoMuscular.join(', ')}
          </p>
        </div>
        <button
          type="button"
          className="botao botao--secundario"
          aria-pressed={ehFavorito}
          onClick={() => alternarFavorito(treino.id)}
        >
          {ehFavorito ? '★ Favoritado' : '☆ Favoritar'}
        </button>
      </div>

      <p className="detalhe-treino__descricao">{treino.descricao}</p>

      <div className="detalhe-treino__grid">
        <section aria-labelledby="titulo-exercicios">
          <h2 id="titulo-exercicios">Exercícios</h2>
          <ol className="lista-exercicios">
            {treino.exercicios.map((exercicio) => (
              <li key={exercicio.id} className="lista-exercicios__item">
                <span className="lista-exercicios__nome">{exercicio.nome}</span>
                <span className="lista-exercicios__detalhe">
                  {exercicio.series}x{exercicio.repeticoes} · {exercicio.descansoSegundos}s
                  descanso
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="titulo-cronometro">
          <h2 id="titulo-cronometro">Cronômetro</h2>
          <Cronometro />
        </section>
      </div>
    </div>
  );
}
