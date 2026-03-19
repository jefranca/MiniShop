export function SignIn() {
  return (
    <main className="auth-layout">
      <section className="auth-card">
        <div className="section-heading">
          <div>
            <p className="section-label">Acesso</p>
            <h2>Entrar na sua conta</h2>
            <p className="catalog__text">
              Continue de onde parou e acompanhe pedidos, favoritos e novidades da MiniShop.
            </p>
          </div>
        </div>

        <form className="auth-form">
          <label className="admin-field">
            <span>E-mail</span>
            <input type="email" placeholder="voce@email.com" />
          </label>

          <label className="admin-field">
            <span>Senha</span>
            <input type="password" placeholder="Sua senha" />
          </label>

          <div className="auth-form__meta">
            <label className="auth-check">
              <input type="checkbox" />
              <span>Continuar conectado</span>
            </label>
            <a href="#/signup">Esqueci minha senha</a>
          </div>

          <button type="button" className="checkout-button">
            Entrar
          </button>
        </form>

        <p className="auth-switch">
          Ainda nao tem conta? <a href="#/signup">Criar conta</a>
        </p>
      </section>
    </main>
  );
}
