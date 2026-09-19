import { useEffect, useMemo, useState } from 'react';
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

const ITENS_POR_PAGINA = 8;

interface PaginacaoProps {
  totalPaginas: number;
  paginaAtual: number;
  onMudarPagina: (pagina: number) => void;
}

function Paginacao({ totalPaginas, paginaAtual, onMudarPagina }: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

  return (
    <nav className="paginacao" aria-label="Paginação">
      <button
        type="button"
        className="botao botao--fantasma"
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={paginaAtual === 1}
      >
        Anterior
      </button>

      {paginas.map((num) => (
        <button
          key={num}
          type="button"
          className={paginaAtual === num ? 'botao botao--primario' : 'botao botao--secundario'}
          aria-current={paginaAtual === num ? 'page' : undefined}
          onClick={() => onMudarPagina(num)}
        >
          {num}
        </button>
      ))}

      <button
        type="button"
        className="botao botao--fantasma"
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={paginaAtual === totalPaginas}
      >
        Próximo
      </button>
    </nav>
  );
}

export function CatalogoPage() {
  const { data: treinos, isLoading, isError, refetch } = useTreinos();
  const [termoBusca, setTermoBusca] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState<GrupoMuscular | 'todos'>('todos');
  const [nivelSelecionado, setNivelSelecionado] = useState<Nivel | 'todos'>('todos');
  const [ordenacao, setOrdenacao] = useState<OrdenacaoTreinos>('padrao');
  const [paginaAtual, setPaginaAtual] = useState(1);

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

  // Volta para a página 1 quando busca, filtros ou ordenação mudam
  useEffect(() => {
    setPaginaAtual(1);
  }, [termoDebounced, grupoSelecionado, nivelSelecionado, ordenacao]);

  const totalPaginas = useMemo(() => {
    return Math.ceil(treinosFiltrados.length / ITENS_POR_PAGINA) || 1;
  }, [treinosFiltrados.length]);

  const treinosPaginados = useMemo(() => {
    const inicio = (paginaAtual - 1) * ITENS_POR_PAGINA;
    return treinosFiltrados.slice(inicio, inicio + ITENS_POR_PAGINA);
  }, [treinosFiltrados, paginaAtual]);

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

          <ListaTreinos treinos={treinosPaginados} />

          <Paginacao
            totalPaginas={totalPaginas}
            paginaAtual={paginaAtual}
            onMudarPagina={setPaginaAtual}
          />
        </>
      )}
    </div>
  );
}
