import type { FormEvent } from 'react';
import { ProductImage } from '../components/ProductImage';
import type { Product, ProductFormState } from '../types/product';
import { currency } from '../utils/formatters';
import { categories } from '../utils/constants';

type AdminProps = {
  products: Product[];
  loading: boolean;
  error: string;
  productForm: ProductFormState;
  setProductForm: (updater: (current: ProductFormState) => ProductFormState) => void;
  editingProductId: number | null;
  adminMessage: string;
  isSubmittingProduct: boolean;
  handleCreateOrUpdateProduct: (event: FormEvent<HTMLFormElement>) => Promise<void>;
  handleDeleteProduct: (productId: number) => Promise<void>;
  startEditingProduct: (product: Product) => void;
  resetAdminForm: () => void;
};

export function Admin({
  products,
  loading,
  error,
  productForm,
  setProductForm,
  editingProductId,
  adminMessage,
  isSubmittingProduct,
  handleCreateOrUpdateProduct,
  handleDeleteProduct,
  startEditingProduct,
  resetAdminForm,
}: AdminProps) {
  return (
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

      <div className="admin-grid">
        <form className="admin-form" onSubmit={handleCreateOrUpdateProduct}>
          <div className="section-heading">
            <div>
              <p className="section-label">
                {editingProductId !== null ? 'Editar produto' : 'Novo produto'}
              </p>
              <h2>{editingProductId !== null ? 'Atualizar item' : 'Cadastrar item'}</h2>
            </div>
          </div>

          <label className="admin-field">
            <span>Nome</span>
            <input
              value={productForm.name}
              onChange={(event) =>
                setProductForm((current) => ({ ...current, name: event.target.value }))
              }
              placeholder="Ex.: Cadeira Aurora"
            />
          </label>

          <label className="admin-field">
            <span>Categoria</span>
            <select
              value={productForm.category}
              onChange={(event) =>
                setProductForm((current) => ({ ...current, category: event.target.value }))
              }
            >
              {categories
                .filter((category) => category !== 'Todos')
                .map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
            </select>
          </label>

          <label className="admin-field">
            <span>Preco</span>
            <input
              value={productForm.price}
              onChange={(event) =>
                setProductForm((current) => ({ ...current, price: event.target.value }))
              }
              placeholder="149.9"
            />
          </label>

          <label className="admin-field">
            <span>Imagem</span>
            <input
              value={productForm.image}
              onChange={(event) =>
                setProductForm((current) => ({ ...current, image: event.target.value }))
              }
              placeholder="[chair]"
            />
          </label>

          <label className="admin-field">
            <span>Descricao</span>
            <textarea
              value={productForm.description}
              onChange={(event) =>
                setProductForm((current) => ({ ...current, description: event.target.value }))
              }
              placeholder="Descricao curta para o catalogo."
              rows={4}
            />
          </label>

          {adminMessage ? <p className="status-message">{adminMessage}</p> : null}

          <div className="admin-actions">
            <button type="submit" className="checkout-button" disabled={isSubmittingProduct}>
              {isSubmittingProduct
                ? 'Salvando...'
                : editingProductId !== null
                  ? 'Salvar alteracoes'
                  : 'Criar produto'}
            </button>

            {editingProductId !== null ? (
              <button type="button" className="secondary-button" onClick={resetAdminForm}>
                Cancelar edicao
              </button>
            ) : null}
          </div>
        </form>

        <div>
          {loading ? <p className="status-message">Carregando painel...</p> : null}
          {error ? <p className="status-message status-message--error">{error}</p> : null}

          <div className="admin-list">
            {products.map((product) => (
              <article key={product.id} className="admin-card">
                <div className="admin-card__media">
                  <ProductImage
                    image={product.image}
                    productName={product.name}
                    className="admin-card__image-file"
                  />
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

                  <div className="admin-card__actions">
                    <button
                      type="button"
                      className="secondary-button"
                      onClick={() => startEditingProduct(product)}
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => void handleDeleteProduct(product.id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
