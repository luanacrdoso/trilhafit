import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import { MensagemErro } from '../../../components/MensagemErro';
import { ListaTreinos } from '../components/ListaTreinos';
import { useTreinos } from '../hooks/useTreinos';
import { useFavoritosStore } from '../store/favoritos.store';

export function FavoritosPage() {
  const { data: treinos, isLoading, isError, refetch } = useTreinos();
  const favoritosIds = useFavoritosStore((estado) => estado.favoritosIds);

  const treinosFavoritos = useMemo(() => {
    if (!treinos) return [];
    return treinos.filter((treino) => favoritosIds.includes(treino.id));
  }, [treinos, favoritosIds]);

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
      {treinos && treinosFavoritos.length === 0 && (
        <p className="lista-treinos__vazio" role="status">
          Você ainda não favoritou nenhum treino.{' '}
          <Link to="/treinos">Explore o catálogo</Link> e clique na estrela de um treino para
          salvá-lo aqui.
        </p>
      )}
      {treinos && treinosFavoritos.length > 0 && <ListaTreinos treinos={treinosFavoritos} />}
    </div>
  );
}
