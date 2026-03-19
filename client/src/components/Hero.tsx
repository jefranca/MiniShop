type HeroProps = {
  currentPage: 'store' | 'catalog' | 'categories' | 'admin';
  productCount: number;
  categoryCount: number;
  cartCount: number;
};

export function Hero({ currentPage, productCount, categoryCount, cartCount }: HeroProps) {
  return (
    <div className="hero__content">
      <h1 className="eyebrow">MINISHOP</h1>
      <h2 className="hero__subtitle">
        {currentPage === 'admin'
          ? 'Painel admin'
          : currentPage === 'categories'
            ? 'Categorias'
          : currentPage === 'catalog'
            ? 'Catalogo completo'
            : 'Mini e-commerce'}
      </h2>
      <p className="hero__text">
        {currentPage === 'admin'
          ? 'Gerencie o catalogo da MiniShop.'
          : currentPage === 'categories'
            ? 'Explore as categorias da MiniShop sem apertar o layout da vitrine.'
          : currentPage === 'catalog'
            ? 'Explore todos os produtos da MiniShop sem deixar a pagina pesada.'
            : 'Produtos em destaque com uma experiencia de compra simples e moderna.'}
      </p>
      <div className="hero__stats">
        <span>{productCount} produtos online</span>
        <span>{categoryCount} categorias</span>
        <span>{cartCount} itens no carrinho</span>
      </div>
    </div>
  );
}
