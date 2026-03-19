import type { AuthUser } from '../types/user';

type HeaderComponentProps = {
  currentPage:
    | 'store'
    | 'catalog'
    | 'categories'
    | 'checkout'
    | 'order-success'
    | 'profile'
    | 'signin'
    | 'signup'
    | 'admin';
  currentUser: AuthUser | null;
  onLogout: () => void;
};

export function HeaderComponent({ currentPage, currentUser, onLogout }: HeaderComponentProps) {
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
      {currentUser ? (
        <>
          <a
            href="#/profile"
            className={currentPage === 'profile' ? 'top-nav__link is-active' : 'top-nav__link'}
          >
            Perfil
          </a>
          <button type="button" className="top-nav__button" onClick={onLogout}>
            Sair
          </button>
        </>
      ) : (
        <>
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
        </>
      )}
    </nav>
  );
}
