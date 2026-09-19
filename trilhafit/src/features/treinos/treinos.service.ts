import type { Treino } from './types';

// Camada de serviço: é o ÚNICO lugar da aplicação que chama fetch()
// para buscar dados de treinos. Componentes e hooks nunca chamam fetch
// diretamente — sempre passam por aqui.
//
// A URL base vem de uma variável de ambiente (import.meta.env), o que
// permite trocar a origem dos dados (ex: um backend real no futuro)
// sem tocar em nenhum outro arquivo do projeto.

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

export class ErroServicoTreinos extends Error {
  constructor(mensagem: string) {
    super(mensagem);
    this.name = 'ErroServicoTreinos';
  }
}

/**
 * Busca a lista completa de treinos do catálogo estático.
 */
export async function buscarTreinos(): Promise<Treino[]> {
  const resposta = await fetch(`${BASE_URL}/api/treinos.json`);

  if (!resposta.ok) {
    throw new ErroServicoTreinos(
      `Não foi possível carregar os treinos (status ${resposta.status})`
    );
  }

  const dados = (await resposta.json()) as Treino[];
  return dados;
}

/**
 * Busca um treino específico pelo slug. Reaproveita buscarTreinos()
 * para manter fetch() centralizado neste único módulo.
 */
export async function buscarTreinoPorSlug(slug: string): Promise<Treino | undefined> {
  const treinos = await buscarTreinos();
  return treinos.find((treino) => treino.slug === slug);
}
