import type { Categoria, GrupoMuscular, Nivel, RegistroTreino, Treino } from './types';

export type OrdenacaoTreinos = 'padrao' | 'titulo' | 'duracao';

/**
 * Filtra treinos por um termo de busca livre (título) e, opcionalmente,
 * por grupo muscular e nível. Função pura — sem dependências externas —
 * para ser fácil de testar isoladamente.
 */
export function filtrarTreinos(
  treinos: Treino[],
  termo: string,
  grupoMuscular?: GrupoMuscular | 'todos',
  nivel?: Nivel | 'todos'
): Treino[] {
  const termoNormalizado = termo.trim().toLowerCase();

  return treinos.filter((treino) => {
    const combinaTermo =
      termoNormalizado.length === 0 ||
      treino.titulo.toLowerCase().includes(termoNormalizado) ||
      treino.grupoMuscular.some((g) => g.includes(termoNormalizado)) ||
      treino.nivel.includes(termoNormalizado);

    const combinaGrupo =
      !grupoMuscular || grupoMuscular === 'todos' || treino.grupoMuscular.includes(grupoMuscular);

    const combinaNivel = !nivel || nivel === 'todos' || treino.nivel === nivel;

    return combinaTermo && combinaGrupo && combinaNivel;
  });
}

/**
 * Ordena uma cópia dos treinos, preservando a lista original.
 */
export function ordenarTreinos(
  treinos: Treino[],
  ordenacao: OrdenacaoTreinos = 'padrao'
): Treino[] {
  const copia = [...treinos];

  if (ordenacao === 'titulo') {
    return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'));
  }

  if (ordenacao === 'duracao') {
    return copia.sort((a, b) => a.duracaoMinutos - b.duracaoMinutos);
  }

  return copia;
}

/**
 * Filtra treinos por categoria (força, cardio, mobilidade).
 */
export function filtrarPorCategoria(treinos: Treino[], categoria: Categoria): Treino[] {
  return treinos.filter((treino) => treino.categoria === categoria);
}

/**
 * Formata segundos totais em uma string mm:ss, usada pelo cronômetro.
 */
export function formatarTempo(segundosTotais: number): string {
  const minutos = Math.floor(segundosTotais / 60);
  const segundos = segundosTotais % 60;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}

/**
 * Retorna os N treinos mais recentes (assumindo que o array já vem em
 * ordem de inserção) — usado para os "destaques" da HomePage.
 */
export function obterTreinosRecentes(treinos: Treino[], quantidade = 4): Treino[] {
  return [...treinos].slice(-quantidade).reverse();
}

/**
 * Agrupa registros de treino concluídos por semana (ISO week),
 * somando a carga total de cada semana — usado no dashboard.
 */
export function agruparCargaPorSemana(
  registros: RegistroTreino[]
): { semana: string; cargaTotal: number }[] {
  const grupos = new Map<string, number>();

  for (const registro of registros) {
    const data = new Date(registro.data);
    const chave = obterChaveSemana(data);
    grupos.set(chave, (grupos.get(chave) ?? 0) + registro.cargaTotal);
  }

  return Array.from(grupos.entries())
    .map(([semana, cargaTotal]) => ({ semana, cargaTotal }))
    .sort((a, b) => (a.semana > b.semana ? 1 : -1));
}

function obterChaveSemana(data: Date): string {
  const copia = new Date(Date.UTC(data.getFullYear(), data.getMonth(), data.getDate()));
  const diaSemana = copia.getUTCDay() || 7;
  copia.setUTCDate(copia.getUTCDate() + 4 - diaSemana);
  const inicioAno = new Date(Date.UTC(copia.getUTCFullYear(), 0, 1));
  const numeroSemana = Math.ceil(((copia.getTime() - inicioAno.getTime()) / 86400000 + 1) / 7);
  return `${copia.getUTCFullYear()}-S${String(numeroSemana).padStart(2, '0')}`;
}

/**
 * Filtra a lista de treinos apenas pelo nível de dificuldade.
 */

export function filtrarPorNivel(
  treinos: Treino[],
  nivel: Nivel | 'todos'
): Treino[] {
  if (nivel === 'todos') {
    return treinos;
  }
  return treinos.filter((treino) => treino.nivel === nivel);
}