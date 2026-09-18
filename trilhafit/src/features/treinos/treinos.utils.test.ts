import { describe, expect, it } from 'vitest';
import { filtrarTreinos, formatarTempo } from './treinos.utils';
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
