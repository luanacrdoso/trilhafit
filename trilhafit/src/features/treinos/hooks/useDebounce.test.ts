import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('retorna o valor inicial imediatamente', () => {
    const { result } = renderHook(() => useDebounce('a', 300));
    expect(result.current).toBe('a');
  });

  it('não atualiza o valor antes do atraso terminar', () => {
    const { result, rerender } = renderHook(({ valor }) => useDebounce(valor, 300), {
      initialProps: { valor: 'a' },
    });

    rerender({ valor: 'ab' });

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe('a');
  });

  it('atualiza o valor depois do atraso completo', () => {
    const { result, rerender } = renderHook(({ valor }) => useDebounce(valor, 300), {
      initialProps: { valor: 'a' },
    });

    rerender({ valor: 'ab' });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe('ab');
  });

  it('reinicia o temporizador a cada nova digitação (cleanup funcionando)', () => {
    const { result, rerender } = renderHook(({ valor }) => useDebounce(valor, 300), {
      initialProps: { valor: 'a' },
    });

    rerender({ valor: 'ab' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    rerender({ valor: 'abc' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Ainda não passaram 300ms desde a última alteração ("abc")
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('abc');
  });
});
