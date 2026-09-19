import { describe, expect, it } from 'vitest';
import { filtrarTreinos,filtrarPorNivel, formatarTempo, ordenarTreinos } from './treinos.utils';
import type { Treino } from './types';

const treinosFalsos: Treino[] = [
  {
    id: '1',
    slug: 'peito-de-ferro',
    titulo: 'Peito de Ferro',
    categoria: 'forca',
    grupoMuscular: ['peito', 'bracos'],
    nivel: 'intermediario',
    duracaoMinutos: 50,
    descricao: 'Treino de peito',
    exercicios: [],
    imagemUrl: '',
  },
  {
    id: '2',
    slug: 'cardio-leve',
    titulo: 'Cardio Leve',
    categoria: 'cardio',
    grupoMuscular: ['cardio'],
    nivel: 'iniciante',
    duracaoMinutos: 25,
    descricao: 'Treino leve',
    exercicios: [],
    imagemUrl: '',
  },
];

describe('formatarTempo', () => {
  it('formata segundos em mm:ss com padding de zero', () => {
    expect(formatarTempo(0)).toBe('00:00');
    expect(formatarTempo(5)).toBe('00:05');
    expect(formatarTempo(65)).toBe('01:05');
    expect(formatarTempo(600)).toBe('10:00');
  });
});

describe('filtrarTreinos', () => {
  it('retorna todos os treinos quando o termo está vazio', () => {
    expect(filtrarTreinos(treinosFalsos, '')).toHaveLength(2);
  });

  it('filtra por título (case-insensitive)', () => {
    const resultado = filtrarTreinos(treinosFalsos, 'ferro');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].titulo).toBe('Peito de Ferro');
  });

  it('filtra por grupo muscular', () => {
    const resultado = filtrarTreinos(treinosFalsos, '', 'cardio');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('2');
  });

  it('filtra por nível', () => {
    const resultado = filtrarTreinos(treinosFalsos, '', 'todos', 'iniciante');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nivel).toBe('iniciante');
  });

  it('combina termo, grupo e nível', () => {
    const resultado = filtrarTreinos(treinosFalsos, 'peito', 'peito', 'intermediario');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].id).toBe('1');
  });
});

describe('ordenarTreinos', () => {
  it('mantém a ordem original por padrão e retorna uma nova lista', () => {
    const resultado = ordenarTreinos(treinosFalsos);
    expect(resultado).toEqual(treinosFalsos);
    expect(resultado).not.toBe(treinosFalsos);
  });

  it('ordena por título de A a Z, respeitando a acentuação', () => {
    const treinos = [
      ...treinosFalsos,
      { ...treinosFalsos[0], id: '3', titulo: 'Abdômen Forte' },
      { ...treinosFalsos[0], id: '4', titulo: 'Água e Movimento' },
    ];

    const resultado = ordenarTreinos(treinos, 'titulo');
    expect(resultado.map((treino) => treino.id)).toEqual(['3', '4', '2', '1']);
  });

  it('ordena pela menor duração usando comparação numérica', () => {
    const treinos = [
      { ...treinosFalsos[0], duracaoMinutos: 120 },
      treinosFalsos[1],
      { ...treinosFalsos[0], id: '3', duracaoMinutos: 5 },
    ];

    const resultado = ordenarTreinos(treinos, 'duracao');
    expect(resultado.map((treino) => treino.id)).toEqual(['3', '2', '1']);
  });

  it('não modifica a lista recebida ao ordenar', () => {
    const treinos = [...treinosFalsos];
    Object.freeze(treinos);

    ordenarTreinos(treinos, 'titulo');
    ordenarTreinos(treinos, 'duracao');

    expect(treinos).toEqual(treinosFalsos);
  });

  it('ordena apenas os treinos que atendem aos filtros', () => {
    const treinos = [
      ...treinosFalsos,
      { ...treinosFalsos[0], id: '3', duracaoMinutos: 30 },
    ];
    const filtrados = filtrarTreinos(treinos, 'peito', 'peito', 'intermediario');

    const resultado = ordenarTreinos(filtrados, 'duracao');
    expect(resultado.map((treino) => treino.id)).toEqual(['3', '1']);
  });

  it('retorna uma lista vazia quando não há treinos', () => {
    expect(ordenarTreinos([], 'padrao')).toEqual([]);
    expect(ordenarTreinos([], 'titulo')).toEqual([]);
    expect(ordenarTreinos([], 'duracao')).toEqual([]);
  });
});

const treinosMocados: Partial<Treino>[] = [
  { id: '1', titulo: 'Treino A', nivel: 'iniciante' },
  { id: '2', titulo: 'Treino B', nivel: 'intermediario' },
  { id: '3', titulo: 'Treino C', nivel: 'avancado' },
];

describe('filtrarPorNivel', () => {
  it('deve retornar todos os treinos quando a opção selecionada for "todos"', () => {
    const resultado = filtrarPorNivel(treinosMocados as Treino[], 'todos');
    expect(resultado).toHaveLength(3);
  });

  it('deve filtrar corretamente apenas os treinos do nível "iniciante"', () => {
    const resultado = filtrarPorNivel(treinosMocados as Treino[], 'iniciante');
    expect(resultado).toHaveLength(1);
    expect(resultado[0].nivel).toBe('iniciante');
  });

  it('deve retornar uma lista vazia caso não haja treinos com o nível especificado', () => {
    const listaVazia: Treino[] = [];
    const resultado = filtrarPorNivel(listaVazia, 'avancado');
    expect(resultado).toHaveLength(0);
  });
});
