type HeaderComponentProps = {
  currentPage:
    | 'store'
    | 'catalog'
    | 'categories'
    | 'checkout'
    | 'order-success'
    | 'signin'
    | 'signup'
    | 'admin';
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
      <a
        href="#/signin"
        className={currentPage === 'signin' ? 'top-nav__link is-active' : 'top-nav__link'}
      >
        Entrar
      </a>
      <a
        href="#/signup"
        className={currentPage === 'signup' ? 'top-nav__link is-active' : 'top-nav__link'}
      >
        Criar conta
      </a>
    </nav>
  );
}
