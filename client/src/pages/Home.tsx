import type { Product } from '../types/product';
import { ProductImage } from '../components/ProductImage';
import { currency } from '../utils/formatters';
import { buildCatalogHash } from '../utils/navigation';

type HomeProps = {
  filteredProducts: Product[];
  loading: boolean;
  error: string;
  addToCart: (product: Product) => void;
};

const HOME_PRODUCT_LIMIT = 8;

export function Home({
  filteredProducts,
  loading,
  error,
  addToCart,
}: HomeProps) {
  const visibleProducts = filteredProducts.slice(0, HOME_PRODUCT_LIMIT);
  const hasMoreProducts = filteredProducts.length > HOME_PRODUCT_LIMIT;

  return (
    <section className="catalog">
      <div className="section-heading">
        <div>
          <p className="section-label">Catalogo</p>
          <h2>Escolha os destaques da semana</h2>
          <p className="catalog__text">
            A home mostra um recorte mais leve da vitrine. Para navegar por categorias, use a
            pagina dedicada.
          </p>
        </div>
      </div>

      {loading ? <p className="status-message">Carregando produtos...</p> : null}
      {error ? <p className="status-message status-message--error">{error}</p> : null}

      <div className="product-grid">
        {visibleProducts.map((product) => (
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

        {hasMoreProducts ? (
          <a href={buildCatalogHash('Todos')} className="product-card product-card--cta">
            <div className="product-card__image product-card__image--cta">
              <span className="product-card__cta-icon">+</span>
            </div>
            <div className="product-card__body product-card__body--cta">
              <span className="product-card__category">Continue explorando</span>
              <h3>Ver todos os produtos</h3>
              <p>Abra o catalogo completo da MiniShop com todos os itens disponiveis.</p>
              <div className="product-card__footer">
                <strong>{filteredProducts.length} itens</strong>
                <span className="product-card__cta-link">Ver tudo</span>
              </div>
            </div>
          </a>
        ) : null}
      </div>
    </section>
  );
}
