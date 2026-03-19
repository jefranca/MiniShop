import type { Category, Product } from '../types/product';
import { ProductImage } from '../components/ProductImage';
import { currency } from '../utils/formatters';

type CatalogProps = {
  categories: Category[];
  filteredProducts: Product[];
  loading: boolean;
  error: string;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  addToCart: (product: Product) => void;
};

export function Catalog({
  categories,
  filteredProducts,
  loading,
  error,
  selectedCategory,
  setSelectedCategory,
  addToCart,
}: CatalogProps) {
  const title =
    selectedCategory === 'Todos'
      ? 'Todos os produtos'
      : `Todos os produtos de ${selectedCategory}`;

  const description =
    selectedCategory === 'Todos'
      ? 'Explore o catalogo completo da MiniShop sem limite de destaque.'
      : `Veja todos os itens da categoria ${selectedCategory} em uma lista completa.`;

  return (
    <section className="catalog catalog--full">
      <div className="section-heading">
        <div>
          <p className="section-label">Catalogo completo</p>
          <h2>{title}</h2>
          <p className="catalog__text">{description}</p>
        </div>

        <label className="catalog-select">
          <span className="section-label">Filtro</span>
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Filtrar catalogo completo por categoria"
          >
            <option value="Todos">Todos</option>
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? <p className="status-message">Carregando produtos...</p> : null}
      {error ? <p className="status-message status-message--error">{error}</p> : null}

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <article key={product.id} className="product-card">
            <div className="product-card__image">
              <ProductImage
                image={product.image}
                productName={product.name}
                className="product-card__image-file"
              />
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
