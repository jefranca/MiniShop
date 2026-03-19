import type { Category } from '../types/product';
import { buildCatalogHash } from '../utils/navigation';

type CategoriesProps = {
  categories: Category[];
  productsCountByCategory: Record<string, number>;
};

export function Categories({ categories, productsCountByCategory }: CategoriesProps) {
  return (
    <section className="catalog catalog--full">
      <div className="section-heading">
        <div>
          <p className="section-label">Categorias</p>
          <h2>Explore por categoria</h2>
          <p className="catalog__text">
            Escolha uma categoria para abrir um catalogo completo e mais organizado.
          </p>
        </div>
      </div>

      <div className="category-grid">
        {categories.map((category) => (
          <a key={category.id} href={buildCatalogHash(category.name)} className="category-card">
            <span className="section-label">Categoria</span>
            <h3>{category.name}</h3>
            <p>{productsCountByCategory[category.name] ?? 0} produtos disponiveis</p>
            <span className="category-card__link">Abrir catalogo</span>
          </a>
        ))}
      </div>
    </section>
  );
}
