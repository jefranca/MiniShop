import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

const categories = [
  { id: 1, name: 'Moda' },
  { id: 2, name: 'Tecnologia' },
  { id: 3, name: 'Casa' },
];

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
  {
    id: 3,
    name: 'Luminaria Noma',
    category: 'Casa',
    price: 129.9,
    image: '[lamp]',
    description: 'Ponto de luz minimalista para mesas, quartos e cantinhos de leitura.',
  },
  {
    id: 4,
    name: 'Mochila Orbit',
    category: 'Moda',
    price: 219.9,
    image: '[backpack]',
    description: 'Espaco interno inteligente e design pensado para rotina, estudo e viagem.',
  },
  {
    id: 5,
    name: 'Speaker Loop',
    category: 'Tecnologia',
    price: 199.9,
    image: '[speaker]',
    description: 'Caixa de som portatil com graves fortes e acabamento resistente.',
  },
  {
    id: 6,
    name: 'Vaso Halo',
    category: 'Casa',
    price: 89.9,
    image: '[vase]',
    description: 'Detalhe organico para compor ambientes leves, quentes e acolhedores.',
  },
  {
    id: 7,
    name: 'Camisa Horizon',
    category: 'Moda',
    price: 119.9,
    image: 'shirt',
    description: 'Camisa casual com caimento limpo para rotina, encontros e viagens leves.',
  },
  {
    id: 8,
    name: 'Tenis Nova Run',
    category: 'Moda',
    price: 289.9,
    image: 'sneakers',
    description: 'Conforto esportivo com visual urbano para acompanhar dias intensos.',
  },
  {
    id: 9,
    name: 'Relogio Meridian',
    category: 'Moda',
    price: 329.9,
    image: 'watch',
    description: 'Design elegante e acabamento discreto para compor producoes modernas.',
  },
  {
    id: 10,
    name: 'Bone Venture',
    category: 'Moda',
    price: 79.9,
    image: 'cap',
    description: 'Bone leve com ajuste confortavel para sol, passeio e uso diario.',
  },
];

describe('App', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.location.hash = '#/';
    vi.restoreAllMocks();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation((input, init) => {
        const url = String(input);

        if (url.includes('/api/categories') && !init?.method) {
          return Promise.resolve({
            ok: true,
            json: async () => categories,
          });
        }

        if (url.includes('viacep.com.br')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              logradouro: 'Praca da Se',
              bairro: 'Se',
              localidade: 'Sao Paulo',
              uf: 'SP',
            }),
          });
        }

        if (init?.method === 'POST' && url.includes('/api/auth/signup')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              message: 'User created successfully.',
              user: {
                id: 1,
                name: 'Jefferson Franca',
                email: 'jefferson@email.com',
              },
            }),
          });
        }

        if (init?.method === 'POST' && url.includes('/api/auth/signin')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              message: 'Sign in successful.',
              user: {
                id: 1,
                name: 'Jefferson Franca',
                email: 'jefferson@email.com',
              },
            }),
          });
        }

        if (init?.method === 'POST' && url.includes('/api/categories')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 4,
              name: 'Acessorios',
            }),
          });
        }

        if (init?.method === 'POST') {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 11,
              name: 'Cadeira Aurora',
              category: 'Casa',
              price: 129.9,
              image: 'chair',
              description: 'Cadeira compacta para ambientes leves.',
            }),
          });
        }

        if (init?.method === 'PUT' && url.includes('/api/products/2')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              id: 2,
              name: 'Fone Pulse Max',
              category: 'Tecnologia',
              price: 219.9,
              image: 'headphones-max',
              description: 'Versao atualizada com mais bateria.',
            }),
          });
        }

        if (init?.method === 'DELETE' && url.includes('/api/products/2')) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              message: 'Product deleted successfully.',
            }),
          });
        }

        return Promise.resolve({
          ok: true,
          json: async () => products,
        });
      }),
    );
  });

  it('renderiza a vitrine na home', async () => {
    render(<App />);

    expect(screen.getByText('Carregando produtos...')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Escolha os destaques da semana')).toBeInTheDocument();
      expect(screen.getByText('Jaqueta Atlas')).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /ver todos os produtos/i })).toBeInTheDocument();
      expect(screen.getByText(/pagina dedicada/i)).toBeInTheDocument();
      expect(screen.queryByText('Bone Venture')).not.toBeInTheDocument();
      expect(screen.queryByText('Gerenciamento de produtos')).not.toBeInTheDocument();
    });
  });

  it('abre a pagina de categorias pela navegacao', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Categorias' }));

    await waitFor(() => {
      expect(screen.getByText('Explore por categoria')).toBeInTheDocument();
      expect(screen.getByText('Tecnologia')).toBeInTheDocument();
    });
  });

  it('abre a pagina de login pela navegacao', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Entrar na sua conta' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument();
      expect(screen.getByText(/acompanhe pedidos, favoritos/i)).toBeInTheDocument();
    });
  });

  it('abre a pagina de cadastro pela navegacao', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Criar conta' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Criar conta na MiniShop' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Criar conta' })).toBeInTheDocument();
      expect(screen.getByText(/monte seu acesso/i)).toBeInTheDocument();
    });
  });

  it('envia o cadastro para o backend e redireciona para login', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Criar conta' }));
    await user.type(screen.getByPlaceholderText('Seu nome'), 'Jefferson Franca');
    await user.type(screen.getByPlaceholderText('voce@email.com'), 'jefferson@email.com');
    await user.type(screen.getByPlaceholderText('Crie uma senha'), '123456');
    await user.type(screen.getByPlaceholderText('Repita a senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Entrar na sua conta' })).toBeInTheDocument();
    });
  });

  it('envia o login para o backend e volta para a loja', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Entrar' }));
    await user.type(screen.getByPlaceholderText('voce@email.com'), 'jefferson@email.com');
    await user.type(screen.getByPlaceholderText('Sua senha'), '123456');
    await user.click(screen.getByRole('button', { name: 'Entrar' }));

    await waitFor(() => {
      expect(screen.getByText('Escolha os destaques da semana')).toBeInTheDocument();
    });
  });

  it('abre o catalogo completo pela opcao ver tudo', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Jaqueta Atlas')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('link', { name: /ver todos os produtos/i }));

    await waitFor(() => {
      expect(screen.getByText('Todos os produtos')).toBeInTheDocument();
      expect(screen.getByText('Bone Venture')).toBeInTheDocument();
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

  it('cria um produto pelo admin e atualiza a lista', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Admin' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Criar categoria' })).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Ex.: Cadeira Aurora'), 'Cadeira Aurora');
    await user.selectOptions(screen.getAllByRole('combobox')[0], 'Casa');
    await user.type(screen.getByPlaceholderText('149.9'), '129.9');
    await user.type(screen.getByPlaceholderText('[chair]'), 'chair');
    await user.type(
      screen.getByPlaceholderText('Descricao curta para o catalogo.'),
      'Cadeira compacta para ambientes leves.',
    );
    await user.click(screen.getByRole('button', { name: 'Criar produto' }));

    await waitFor(() => {
      expect(screen.getByText('Produto criado com sucesso.')).toBeInTheDocument();
      expect(screen.getByText('Cadeira Aurora')).toBeInTheDocument();
    });
  });

  it('edita um produto pelo admin', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Admin' }));
    await user.click(screen.getAllByRole('button', { name: 'Editar' })[1]);

    const nameInput = screen.getByPlaceholderText('Ex.: Cadeira Aurora');
    const priceInput = screen.getByPlaceholderText('149.9');
    const imageInput = screen.getByPlaceholderText('[chair]');
    const descriptionInput = screen.getByPlaceholderText('Descricao curta para o catalogo.');

    await user.clear(nameInput);
    await user.type(nameInput, 'Fone Pulse Max');
    await user.clear(priceInput);
    await user.type(priceInput, '219.9');
    await user.clear(imageInput);
    await user.type(imageInput, 'headphones-max');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Versao atualizada com mais bateria.');
    await user.click(screen.getByRole('button', { name: 'Salvar alteracoes' }));

    await waitFor(() => {
      expect(screen.getByText('Produto atualizado com sucesso.')).toBeInTheDocument();
      expect(screen.getByText('Fone Pulse Max')).toBeInTheDocument();
    });
  });

  it('remove um produto pelo admin', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Admin' }));
    await user.click(screen.getAllByRole('button', { name: 'Excluir' })[1]);

    await waitFor(() => {
      expect(screen.getByText('Produto removido com sucesso.')).toBeInTheDocument();
      expect(screen.queryByText('Fone Pulse Mini')).not.toBeInTheDocument();
    });
  });

  it('cria uma categoria pelo admin', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('link', { name: 'Admin' }));
    await user.type(screen.getByPlaceholderText('Ex.: Acessorios'), 'Acessorios');
    await user.click(screen.getByRole('button', { name: 'Criar categoria' }));

    await waitFor(() => {
      expect(screen.getByText('Categoria criada com sucesso.')).toBeInTheDocument();
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

  it('abre a pagina de checkout ao finalizar pedido', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Jaqueta Atlas')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: 'Adicionar' })[0]);
    await user.click(screen.getByRole('link', { name: 'Finalizar pedido' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Finalizar pedido' })).toBeInTheDocument();
      expect(screen.getByText('Informacoes de entrega')).toBeInTheDocument();
      expect(screen.getByText('Seu pedido')).toBeInTheDocument();
      expect(screen.getAllByText('Subtotal')).toHaveLength(2);
    });
  });

  it('calcula o frete automaticamente apos endereco completo e aplica cupom', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Jaqueta Atlas')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: 'Adicionar' })[0]);
    await user.click(screen.getByRole('link', { name: 'Finalizar pedido' }));

    await user.type(screen.getByPlaceholderText('00000-000'), '01001000');
    await waitFor(() => {
      expect(screen.getByText('Endereco preenchido automaticamente pelo CEP.')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Praca da Se')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Se')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Sao Paulo')).toBeInTheDocument();
      expect(screen.getByDisplayValue('SP')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('123'), '100');

    await waitFor(() => {
      expect(screen.getByText(/R\$\s*18,90/)).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('Ex.: MINI10'), 'MINI10');
    await user.click(screen.getByRole('button', { name: 'Aplicar' }));

    await waitFor(() => {
      expect(screen.getByText('Cupom MINI10 aplicado com 10% de desconto.')).toBeInTheDocument();
      expect(screen.getByText(/R\$\s*24,99/)).toBeInTheDocument();
    });
  });

  it('confirma o pedido no checkout e limpa o carrinho', async () => {
    const user = userEvent.setup();

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Jaqueta Atlas')).toBeInTheDocument();
    });

    await user.click(screen.getAllByRole('button', { name: 'Adicionar' })[0]);
    await user.click(screen.getByRole('link', { name: 'Finalizar pedido' }));

    await user.type(screen.getByPlaceholderText('Seu nome'), 'Jefferson Franca');
    await user.type(screen.getByPlaceholderText('voce@email.com'), 'jefferson@email.com');
    await user.type(screen.getByPlaceholderText('00000-000'), '01001000');

    await waitFor(() => {
      expect(screen.getByDisplayValue('Praca da Se')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('123'), '100');

    await waitFor(() => {
      expect(screen.getByText(/R\$\s*18,90/)).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Confirmar pedido' }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Compra recebida com sucesso' })).toBeInTheDocument();
      expect(screen.getByText('Seu carrinho ainda esta vazio.')).toBeInTheDocument();
    });
  });
});
