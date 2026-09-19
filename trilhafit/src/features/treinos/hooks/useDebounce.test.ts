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
    const { result } = renderHook(() => useDebounce('abc', 300));

    expect(result.current).toBe('abc');
  });

  it('só atualiza o valor depois do atraso', () => {
    const { result, rerender } = renderHook(
      ({ valor }) => useDebounce(valor, 300),
      { initialProps: { valor: 'a' } },
    );

    rerender({ valor: 'ab' });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe('ab');
  });

  it('reinicia o timer a cada mudança e usa só o último valor', () => {
    const { result, rerender } = renderHook(
      ({ valor }) => useDebounce(valor, 300),
      { initialProps: { valor: 'a' } },
    );

    rerender({ valor: 'ab' });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    rerender({ valor: 'abc' });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(result.current).toBe('a');

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current).toBe('abc');
  });

  it('cancela o timer pendente ao desmontar (cleanup)', () => {
    const { rerender, unmount } = renderHook(
      ({ valor }) => useDebounce(valor, 300),
      { initialProps: { valor: 'a' } },
    );

    rerender({ valor: 'ab' });
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});