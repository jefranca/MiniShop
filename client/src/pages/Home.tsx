import type { Product } from '../types/product';
import { currency } from '../utils/formatters';
import { categories } from '../utils/constants';

type HomeProps = {
  filteredProducts: Product[];
  loading: boolean;
  error: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  addToCart: (product: Product) => void;
};

export function Home({
  filteredProducts,
  loading,
  error,
  selectedCategory,
  setSelectedCategory,
  addToCart,
}: HomeProps) {
  return (
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
  );
}
