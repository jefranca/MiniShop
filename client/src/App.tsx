import { useEffect, useMemo, useState } from 'react';

type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

type CartItem = Product & {
  quantity: number;
};

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const categories = ['Todos', 'Moda', 'Tecnologia', 'Casa'];

function getCurrentPage() {
  return window.location.hash === '#/admin' ? 'admin' : 'store';
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState<'store' | 'admin'>(getCurrentPage);

  useEffect(() => {
    const syncPage = () => {
      setCurrentPage(getCurrentPage());
    };

    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    const savedCart = window.localStorage.getItem('minishop-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('minishop-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Falha ao buscar produtos.');
        }

        const data = (await response.json()) as Product[];
        setProducts(data);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : 'Erro inesperado ao carregar a vitrine.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: number, nextQuantity: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, nextQuantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <nav className="top-nav" aria-label="Principal">
          <a
            href="#/"
            className={currentPage === 'store' ? 'top-nav__link is-active' : 'top-nav__link'}
          >
            Loja
          </a>
          <a
            href="#/admin"
            className={currentPage === 'admin' ? 'top-nav__link is-active' : 'top-nav__link'}
          >
            Admin
          </a>
        </nav>

        <div className="hero__content">
          <h1 className="eyebrow">MINISHOP</h1>
          <h2 className="hero__subtitle">
            {currentPage === 'admin' ? 'Painel admin' : 'Mini e-commerce'}
          </h2>
          <p className="hero__text">
            {currentPage === 'admin'
              ? 'Gerencie o catalogo da MiniShop em uma area separada da experiencia de compra.'
              : 'Produtos em destaque com uma experiencia de compra simples e moderna.'}
          </p>
          <div className="hero__stats">
            <span>{products.length} produtos online</span>
            <span>{categories.length - 1} categorias</span>
            <span>{cartCount} itens no carrinho</span>
          </div>
        </div>
      </header>

      {currentPage === 'admin' ? (
        <section className="admin-panel admin-panel--page">
          <div className="section-heading">
            <div>
              <p className="section-label">Admin</p>
              <h2>Gerenciamento de produtos</h2>
            </div>
            <span className="admin-badge">{products.length} itens</span>
          </div>

          <p className="admin-text">
            Esta area sera a base do painel da MiniShop para criar, editar e remover produtos.
          </p>

          {loading ? <p className="status-message">Carregando painel...</p> : null}
          {error ? <p className="status-message status-message--error">{error}</p> : null}

          <div className="admin-list">
            {products.map((product) => (
              <article key={product.id} className="admin-card">
                <div className="admin-card__media" aria-hidden="true">
                  {product.image}
                </div>

                <div className="admin-card__content">
                  <div>
                    <p className="section-label">{product.category}</p>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                  </div>

                  <div className="admin-card__meta">
                    <strong>{currency.format(product.price)}</strong>
                    <span>ID #{product.id}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <main className="content-grid">
          <section className="catalog">
            <div className="section-heading">
              <div>
                <p className="section-label">Catalogo</p>
                <h2>Escolha os destaques da semana</h2>
              </div>

              <div className="filters" role="tablist" aria-label="Filtrar produtos por categoria">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    className={category === selectedCategory ? 'is-active' : ''}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {loading ? <p className="status-message">Carregando produtos...</p> : null}
            {error ? <p className="status-message status-message--error">{error}</p> : null}

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article key={product.id} className="product-card">
                  <div className="product-card__image" aria-hidden="true">
                    {product.image}
                  </div>
                  <div className="product-card__body">
                    <span className="product-card__category">{product.category}</span>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="product-card__footer">
                      <strong>{currency.format(product.price)}</strong>
                      <button type="button" onClick={() => addToCart(product)}>
                        Adicionar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="cart-panel">
            <div className="section-heading">
              <div>
                <p className="section-label">Carrinho</p>
                <h2>Resumo do pedido</h2>
              </div>
              <span className="cart-badge">{cartCount}</span>
            </div>

            <div className="cart-list">
              {cart.length === 0 ? (
                <p className="status-message">Seu carrinho ainda esta vazio.</p>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <strong>{item.name}</strong>
                      <p>{currency.format(item.price)}</p>
                    </div>

                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="cart-summary">
              <div>
                <span>Subtotal</span>
                <strong>{currency.format(cartTotal)}</strong>
              </div>
              <button type="button" className="checkout-button">
                Finalizar pedido
              </button>
            </div>
          </aside>
        </main>
      )}
    </div>
  );
}
