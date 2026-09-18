import { useMemo } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Loading } from '../../../components/Loading';
import { MensagemErro } from '../../../components/MensagemErro';
import { ListaTreinos } from '../components/ListaTreinos';
import { useTreinos } from '../hooks/useTreinos';
import { filtrarPorCategoria } from '../treinos.utils';
import { CATEGORIAS, ROTULO_CATEGORIA, type Categoria } from '../types';

export function CategoriaPage() {
  const { categoria } = useParams<{ categoria: string }>();
  const { data: treinos, isLoading, isError, refetch } = useTreinos();

  const categoriaValida = CATEGORIAS.includes(categoria as Categoria);

  const treinosFiltrados = useMemo(() => {
    if (!treinos || !categoriaValida) return [];
    return filtrarPorCategoria(treinos, categoria as Categoria);
  }, [treinos, categoria, categoriaValida]);

  if (!categoriaValida) {
    return <Navigate to="/treinos" replace />;
  }

  return (
    <div className="pagina">
      <header className="pagina__cabecalho">
        <h1>{ROTULO_CATEGORIA[categoria as Categoria]}</h1>
        <p>Treinos da categoria {ROTULO_CATEGORIA[categoria as Categoria].toLowerCase()}.</p>
      </header>

      {isLoading && <Loading rotulo="Carregando treinos..." />}
      {isError && (
        <MensagemErro
          detalhe="Não foi possível carregar os treinos desta categoria."
          aoTentarNovamente={() => refetch()}
        />
      )}
      {treinos && <ListaTreinos treinos={treinosFiltrados} />}
    </div>
  );
}
