import { useMemo, useState } from 'react';
import { CampoBusca } from '../../../components/CampoBusca';
import { Loading } from '../../../components/Loading';
import { MensagemErro } from '../../../components/MensagemErro';
import { ListaTreinos } from '../components/ListaTreinos';
import { useTreinos } from '../hooks/useTreinos';
import { useDebounce } from '../hooks/useDebounce';
import {
  filtrarTreinos,
  filtrarPorNivel,
  ordenarTreinos,
  type OrdenacaoTreinos,
} from '../treinos.utils';
import { GRUPOS_MUSCULARES, NIVEIS, ROTULO_GRUPO, ROTULO_NIVEL } from '../types';
import type { GrupoMuscular, Nivel } from '../types';

export function CatalogoPage() {
  const { data: treinos, isLoading, isError, refetch } = useTreinos();
  const [termoBusca, setTermoBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoMuscular | 'todos'>('todos');
  const [nivelSelecionado, setNivelSelecionado] = useState<Nivel | 'todos'>('todos');
  const [ordenacao, setOrdenacao] = useState<OrdenacaoTreinos>('padrao');

  const termoDebounced = useDebounce(termoBusca, 300);

  // useMemo evita refazer o filtro em toda renderização — só recalcula
  // quando a lista de treinos ou algum dos critérios de fato muda.
  const treinosFiltrados = useMemo(() => {
    if (!treinos) return [];

    // 1. Filtro por termo e grupo
    const porTermoEGrupo = filtrarTreinos(treinos, termoDebounced, grupoSelecionado);

    // 2. Filtro exclusivo por nível (composição em sequência)
    const porNivel = filtrarPorNivel(porTermoEGrupo, nivelSelecionado);

    // 3. Ordenação final
    return ordenarTreinos(porNivel, ordenacao);
  }, [treinos, termoDebounced, grupoSelecionado, nivelSelecionado, ordenacao]);

  function aoAlterarBusca(valor: string) {
    setTermoBusca(valor);
    if (valor.trim() === '') {
      setOrdenacao('padrao');
    }
  }

  return (
    <div className="pagina">
      <header className="pagina__cabecalho">
        <h1>Catálogo de treinos</h1>
        <p>Busque por título, grupo muscular ou nível de dificuldade.</p>
      </header>

      <div className="filtros">
        <CampoBusca valor={termoBusca} aoAlterar={aoAlterarBusca} />

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

        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as OrdenacaoTreinos)}
          aria-label="Ordenar treinos"
        >
          <option value="padrao">Ordem padrão</option>
          <option value="titulo">Título (A–Z)</option>
          <option value="duracao">Menor duração</option>
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