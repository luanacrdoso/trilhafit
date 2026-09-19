import { render, screen, fireEvent, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Cronometro } from './Cronometro';

describe('Cronometro', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('deve avançar a contagem para 00:03 após clicar em Iniciar e avançar 3 segundos', () => {
    render(<Cronometro />);

    const botaoIniciar = screen.getByRole('button', { name: /iniciar/i });
    fireEvent.click(botaoIniciar);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText('00:03')).toBeInTheDocument();
  });

  it('deve interromper a contagem ao clicar em Pausar', () => {
    render(<Cronometro />);

    const botaoIniciar = screen.getByRole('button', { name: /iniciar/i });
    fireEvent.click(botaoIniciar);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const botaoPausar = screen.getByRole('button', { name: /pausar/i });
    fireEvent.click(botaoPausar);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.getByText('00:03')).toBeInTheDocument();
  });

  it('deve voltar o display para 00:00 ao clicar em Zerar', () => {
    render(<Cronometro />);

    const botaoIniciar = screen.getByRole('button', { name: /iniciar/i });
    fireEvent.click(botaoIniciar);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    const botaoZerar = screen.getByRole('button', { name: /zerar/i });
    fireEvent.click(botaoZerar);

    expect(screen.getByText('00:00')).toBeInTheDocument();
  });
});