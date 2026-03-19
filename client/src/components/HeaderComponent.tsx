type HeaderComponentProps = {
  currentPage: 'store' | 'catalog' | 'categories' | 'checkout' | 'admin';
};

export function HeaderComponent({ currentPage }: HeaderComponentProps) {
  return (
    <nav className="top-nav" aria-label="Principal">
      <a
        href="#/"
        className={
          currentPage === 'store' || currentPage === 'catalog'
            ? 'top-nav__link is-active'
            : 'top-nav__link'
        }
      >
        Loja
      </a>
      <a
        href="#/categories"
        className={currentPage === 'categories' ? 'top-nav__link is-active' : 'top-nav__link'}
      >
        Categorias
      </a>
      <a
        href="#/admin"
        className={currentPage === 'admin' ? 'top-nav__link is-active' : 'top-nav__link'}
      >
        Admin
      </a>
    </nav>
  );
}
