import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const products = [
  {
    id: 1,
    name: 'Jaqueta Atlas',
    category: 'Moda',
    price: 249.9,
    image: '[jacket]',
    description: 'Camada premium para dias corridos, com textura leve e corte urbano.',
  },
  {
    id: 2,
    name: 'Fone Pulse Mini',
    category: 'Tecnologia',
    price: 179.9,
    image: '[headphones]',
    description: 'Som limpo, bateria de longa duracao e estojo compacto para o dia a dia.',
  },
];

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '#/';
    vi.restoreAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => products,
      }),
    );
  });

  it('renderiza a vitrine na home', async () => {
    render(<App />);

    expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Escolha os destaques da semana')).toBeInTheDocument();
      expect(screen.getByText('Jaqueta Atlas')).toBeInTheDocument();
      expect(screen.queryByText('Gerenciamento de produtos')).not.toBeInTheDocument();
    });
  });

  it('navega para o admin e mostra a listagem de gerenciamento', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Admin' }));

    await waitFor(() => {
      expect(screen.getByText('Gerenciamento de produtos')).toBeInTheDocument();
      expect(screen.getAllByText('Jaqueta Atlas')).toHaveLength(1);
    });
  });

  it('adiciona produto ao carrinho e atualiza subtotal', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Jaqueta Atlas')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: 'Adicionar' })[0]);

    const cartPanel = screen.getByText('Resumo do pedido').closest('aside');

    expect(cartPanel).not.toBeNull();

    const cartScope = within(cartPanel as HTMLElement);

    expect(cartScope.getByText('Jaqueta Atlas')).toBeInTheDocument();
    expect(cartScope.getByText('Subtotal')).toBeInTheDocument();
    expect(cartScope.getAllByText(/R\$\s*249,90/)).toHaveLength(2);
  });
});
