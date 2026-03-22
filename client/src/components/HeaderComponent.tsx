import { useState } from 'react';
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
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  function closeDrawer() {
    setIsDrawerOpen(false);
  }

  function handleLogoutClick() {
    closeDrawer();
    onLogout();
  }

  return (
    <>
      <nav className="top-nav-wrap" aria-label="Principal">
        <div className="top-nav-mobile">
          <a href="#/" className="top-nav-mobile__brand">
            MiniShop
          </a>
          <button
            type="button"
            className="top-nav-mobile__toggle"
            aria-expanded={isDrawerOpen}
            aria-controls="mobile-drawer-navigation"
            onClick={() => setIsDrawerOpen(true)}
          >
            Menu
          </button>
        </div>

        <div className="top-nav">
          <a
            href="#/"
            className={
              currentPage === 'store' || currentPage === 'catalog'
                ? 'top-nav__link is-active'
                : 'top-nav__link'
            }
            onClick={closeDrawer}
          >
            Loja
          </a>
          <a
            href="#/categories"
            className={currentPage === 'categories' ? 'top-nav__link is-active' : 'top-nav__link'}
            onClick={closeDrawer}
          >
            Categorias
          </a>
          <a
            href="#/admin"
            className={currentPage === 'admin' ? 'top-nav__link is-active' : 'top-nav__link'}
            onClick={closeDrawer}
          >
            Admin
          </a>
          {currentUser ? (
            <>
              <a
                href="#/profile"
                className={currentPage === 'profile' ? 'top-nav__link is-active' : 'top-nav__link'}
                onClick={closeDrawer}
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
                onClick={closeDrawer}
              >
                Entrar
              </a>
              <a
                href="#/signup"
                className={currentPage === 'signup' ? 'top-nav__link is-active' : 'top-nav__link'}
                onClick={closeDrawer}
              >
                Criar conta
              </a>
            </>
          )}
        </div>
      </nav>

      {isDrawerOpen ? (
        <div
          className="mobile-drawer-backdrop"
          role="presentation"
          onClick={() => setIsDrawerOpen(false)}
        >
          <nav
            id="mobile-drawer-navigation"
            className="mobile-drawer"
            aria-label="Navegacao mobile"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mobile-drawer__header">
              <div>
                <p className="section-label">MiniShop</p>
                <strong>Navegacao</strong>
              </div>
              <button
                type="button"
                className="mobile-drawer__close"
                onClick={() => setIsDrawerOpen(false)}
              >
                Fechar
              </button>
            </div>

            <a
              href="#/"
              className={
                currentPage === 'store' || currentPage === 'catalog'
                  ? 'mobile-drawer__link is-active'
                  : 'mobile-drawer__link'
              }
              onClick={closeDrawer}
            >
              Loja
            </a>
            <a
              href="#/categories"
              className={
                currentPage === 'categories'
                  ? 'mobile-drawer__link is-active'
                  : 'mobile-drawer__link'
              }
              onClick={closeDrawer}
            >
              Categorias
            </a>
            <a
              href="#/admin"
              className={
                currentPage === 'admin' ? 'mobile-drawer__link is-active' : 'mobile-drawer__link'
              }
              onClick={closeDrawer}
            >
              Admin
            </a>
            {currentUser ? (
              <>
                <a
                  href="#/profile"
                  className={
                    currentPage === 'profile'
                      ? 'mobile-drawer__link is-active'
                      : 'mobile-drawer__link'
                  }
                  onClick={closeDrawer}
                >
                  Perfil
                </a>
                <button type="button" className="mobile-drawer__button" onClick={handleLogoutClick}>
                  Sair
                </button>
              </>
            ) : (
              <div className="mobile-drawer__auth-actions">
                <a
                  href="#/signin"
                  className={
                    currentPage === 'signin'
                      ? 'mobile-drawer__compact-link is-active'
                      : 'mobile-drawer__compact-link'
                  }
                  onClick={closeDrawer}
                >
                  Entrar
                </a>
                <a
                  href="#/signup"
                  className={
                    currentPage === 'signup'
                      ? 'mobile-drawer__compact-link is-active'
                      : 'mobile-drawer__compact-link'
                  }
                  onClick={closeDrawer}
                >
                  Criar conta
                </a>
              </div>
            )}
          </nav>
        </div>
      ) : null}
    </>
  );
}
