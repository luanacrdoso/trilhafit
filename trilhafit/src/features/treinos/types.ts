// Tipos de domínio do TrilhaFit.
// Mantemos os nomes de domínio em português (treino, exercicio, registro)
// e termos técnicos convencionais em inglês, conforme o padrão do projeto.

export type GrupoMuscular =
  | 'peito'
  | 'costas'
  | 'pernas'
  | 'ombros'
  | 'bracos'
  | 'core'
  | 'cardio';

export type Nivel = 'iniciante' | 'intermediario' | 'avancado';

export type Categoria = 'forca' | 'cardio' | 'mobilidade';

export interface Exercicio {
  id: string;
  nome: string;
  series: number;
  repeticoes: number;
  descansoSegundos: number;
}

export interface Treino {
  id: string;
  slug: string;
  titulo: string;
  categoria: Categoria;
  grupoMuscular: GrupoMuscular[];
  nivel: Nivel;
  duracaoMinutos: number;
  descricao: string;
  exercicios: Exercicio[];
  imagemUrl: string;
}

export interface RegistroTreino {
  id: string;
  treinoId: string;
  data: string; // ISO
  duracaoMinutos: number;
  cargaTotal: number; // kg
  observacoes?: string;
}

export const NIVEIS: Nivel[] = ['iniciante', 'intermediario', 'avancado'];
export const CATEGORIAS: Categoria[] = ['forca', 'cardio', 'mobilidade'];
export const GRUPOS_MUSCULARES: GrupoMuscular[] = [
  'peito',
  'costas',
  'pernas',
  'ombros',
  'bracos',
  'core',
  'cardio',
];

export const ROTULO_CATEGORIA: Record<Categoria, string> = {
  forca: 'Força',
  cardio: 'Cardio',
  mobilidade: 'Mobilidade',
};

export const ROTULO_NIVEL: Record<Nivel, string> = {
  iniciante: 'Iniciante',
  intermediario: 'Intermediário',
  avancado: 'Avançado',
};

export const ROTULO_GRUPO: Record<GrupoMuscular, string> = {
  peito: 'Peito',
  costas: 'Costas',
  pernas: 'Pernas',
  ombros: 'Ombros',
  bracos: 'Braços',
  core: 'Core',
  cardio: 'Cardio',
};
