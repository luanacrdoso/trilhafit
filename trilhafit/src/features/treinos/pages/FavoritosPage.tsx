import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import { MensagemErro } from '../../../components/MensagemErro';
import { ListaTreinos } from '../components/ListaTreinos';
import { useTreinos } from '../hooks/useTreinos';
import { useFavoritosStore } from '../store/favoritos.store';
import { useRegistrosStore } from '../store/registros.store';

export function FavoritosPage() {
  const { data: treinos, isLoading, isError, refetch } = useTreinos();
  
  // Consumo das duas stores Zustand independentes
  const favoritosIds = useFavoritosStore((estado) => estado.favoritosIds);
  const registros = useRegistrosStore((estado) => estado.registros);

  // 1. Contagem de registros por treinoId
  const contagemPorTreino = useMemo(() => {
    const mapa: Record<string, number> = {};
    if (!registros) return mapa;

    for (const registro of registros) {
      mapa[registro.treinoId] = (mapa[registro.treinoId] || 0) + 1;
    }
    return mapa;
  }, [registros]);

  // 2. Filtra, adiciona contagem e ordena do mais treinado para o menos treinado
  const treinosFavoritosComContagem = useMemo(() => {
    if (!treinos) return [];

    return treinos
      .filter((treino) => favoritosIds.includes(treino.id))
      .map((treino) => ({
        ...treino,
        totalConclusoes: contagemPorTreino[treino.id] || 0, // Trata 0 registros
      }))
      .sort((a, b) => b.totalConclusoes - a.totalConclusoes);
  }, [treinos, favoritosIds, contagemPorTreino]);

  return (
    <div className="pagina">
      <header className="pagina__cabecalho">
        <h1>Meus favoritos</h1>
        <p>Treinos salvos para acesso rápido — persistem mesmo depois de recarregar a página.</p>
      </header>

      {isLoading && <Loading rotulo="Carregando favoritos..." />}
      {isError && (
        <MensagemErro
          detalhe="Não foi possível carregar seus treinos favoritos."
          aoTentarNovamente={() => refetch()}
        />
      )}
      
      {treinos && treinosFavoritosComContagem.length === 0 && (
        <p className="lista-treinos__vazio" role="status">
          Você ainda não favoritou nenhum treino.{' '}
          <Link to="/treinos">Explore o catálogo</Link> e clique na estrela de um treino para
          salvá-lo aqui.
        </p>
      )}

      {treinos && treinosFavoritosComContagem.length > 0 && (
        <>
          {/* Seção de Histórico de Registros dos Favoritos */}
          <section className="favoritos-historico">
            <h2>Histórico de treinos concluídos</h2>
            <ul className="favoritos-historico__lista">
              {treinosFavoritosComContagem.map((treino) => (
                <li key={treino.id} className="favoritos-historico__item">
                  <span className="favoritos-historico__titulo">{treino.titulo}</span>
                  <span className="favoritos-historico__badge">
                    {treino.totalConclusoes === 0
                      ? 'Nunca registrado'
                      : `${treino.totalConclusoes} ${
                          treino.totalConclusoes === 1 ? 'conclusão' : 'conclusões'
                        }`}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Lista padrão de treinos favoritados ordenada pelo mais treinado */}
          <ListaTreinos treinos={treinosFavoritosComContagem} />
        </>
      )}
    </div>
  );
}