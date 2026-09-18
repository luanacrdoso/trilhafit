import { useMemo, useState } from 'react';
import { CampoBusca } from '../../../components/CampoBusca';
import { Loading } from '../../../components/Loading';
import { MensagemErro } from '../../../components/MensagemErro';
import { ListaTreinos } from '../components/ListaTreinos';
import { useTreinos } from '../hooks/useTreinos';
import { useDebounce } from '../hooks/useDebounce';
import { filtrarTreinos } from '../treinos.utils';
import { GRUPOS_MUSCULARES, NIVEIS, ROTULO_GRUPO, ROTULO_NIVEL } from '../types';
import type { GrupoMuscular, Nivel } from '../types';

export function CatalogoPage() {
  const { data: treinos, isLoading, isError, refetch } = useTreinos();
  const [termoBusca, setTermoBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoMuscular | 'todos'>('todos');
  const [nivelSelecionado, setNivelSelecionado] = useState<Nivel | 'todos'>('todos');

  const termoDebounced = useDebounce(termoBusca, 300);

  // useMemo evita refazer o filtro em toda renderização — só recalcula
  // quando a lista de treinos ou algum dos critérios de fato muda.
  const treinosFiltrados = useMemo(() => {
    if (!treinos) return [];
    return filtrarTreinos(treinos, termoDebounced, grupoSelecionado, nivelSelecionado);
  }, [treinos, termoDebounced, grupoSelecionado, nivelSelecionado]);

  return (
    <div className="pagina">
      <header className="pagina__cabecalho">
        <h1>Catálogo de treinos</h1>
        <p>Busque por título, grupo muscular ou nível de dificuldade.</p>
      </header>

      <div className="filtros">
        <CampoBusca valor={termoBusca} aoAlterar={setTermoBusca} />

        <select
          value={grupoSelecionado}
          onChange={(e) => setGrupoSelecionado(e.target.value as GrupoMuscular | 'todos')}
          aria-label="Filtrar por grupo muscular"
        >
          <option value="todos">Todos os grupos</option>
          {GRUPOS_MUSCULARES.map((grupo) => (
            <option key={grupo} value={grupo}>
              {ROTULO_GRUPO[grupo]}
            </option>
          ))}
        </select>

        <select
          value={nivelSelecionado}
          onChange={(e) => setNivelSelecionado(e.target.value as Nivel | 'todos')}
          aria-label="Filtrar por nível"
        >
          <option value="todos">Todos os níveis</option>
          {NIVEIS.map((nivel) => (
            <option key={nivel} value={nivel}>
              {ROTULO_NIVEL[nivel]}
            </option>
          ))}
        </select>
      </div>

      {isLoading && <Loading rotulo="Carregando catálogo..." />}
      {isError && (
        <MensagemErro
          detalhe="Não foi possível carregar o catálogo de treinos."
          aoTentarNovamente={() => refetch()}
        />
      )}
      {treinos && (
        <>
          <p className="filtros__resultado" aria-live="polite">
            {treinosFiltrados.length}{' '}
            {treinosFiltrados.length === 1 ? 'treino encontrado' : 'treinos encontrados'}
          </p>
          <ListaTreinos treinos={treinosFiltrados} />
        </>
      )}
    </div>
  );
}
