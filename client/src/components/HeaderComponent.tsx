type HeaderComponentProps = {
  currentPage: 'store' | 'admin';
};

export function HeaderComponent({ currentPage }: HeaderComponentProps) {
  return (
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
  );
}
