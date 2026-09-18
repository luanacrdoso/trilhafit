import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CampoBusca } from './CampoBusca';

describe('CampoBusca', () => {
  it('exibe o valor recebido e chama aoAlterar a cada digitação', async () => {
    const aoAlterar = vi.fn();
    const usuario = userEvent.setup();

    render(<CampoBusca valor="" aoAlterar={aoAlterar} />);

    const input = screen.getByRole('searchbox');
    await usuario.type(input, 'abc');

    expect(aoAlterar).toHaveBeenCalledTimes(3);
    expect(aoAlterar).toHaveBeenNthCalledWith(1, 'a');
    expect(aoAlterar).toHaveBeenNthCalledWith(2, 'b');
    expect(aoAlterar).toHaveBeenNthCalledWith(3, 'c');
  });

  it('usa o placeholder customizado quando informado', () => {
    render(<CampoBusca valor="" aoAlterar={() => {}} placeholder="Buscar aqui" />);
    expect(screen.getByPlaceholderText('Buscar aqui')).toBeInTheDocument();
  });
});
