export function SignUp() {
  return (
    <main className="auth-layout">
      <section className="auth-card">
        <div className="section-heading">
          <div>
            <p className="section-label">Cadastro</p>
            <h2>Criar conta na MiniShop</h2>
            <p className="catalog__text">
              Monte seu acesso para salvar pedidos, enderecos e uma experiencia de compra mais fluida.
            </p>
          </div>
        </div>

        <form className="auth-form">
          <label className="admin-field">
            <span>Nome completo</span>
            <input type="text" placeholder="Seu nome" />
          </label>

          <label className="admin-field">
            <span>E-mail</span>
            <input type="email" placeholder="voce@email.com" />
          </label>

          <div className="checkout-inline-fields">
            <label className="admin-field">
              <span>Senha</span>
              <input type="password" placeholder="Crie uma senha" />
            </label>

            <label className="admin-field">
              <span>Confirmar senha</span>
              <input type="password" placeholder="Repita a senha" />
            </label>
          </div>

          <label className="auth-check">
            <input type="checkbox" />
            <span>Aceito receber novidades e ofertas da MiniShop.</span>
          </label>

          <button type="button" className="checkout-button">
            Criar conta
          </button>
        </form>

        <p className="auth-switch">
          Ja tem conta? <a href="#/signin">Entrar</a>
        </p>
      </section>

      <aside className="auth-highlight auth-highlight--warm">
        <p className="section-label">Nova conta</p>
        <h3>Uma base pronta para crescer com login, pedidos e perfil</h3>
        <ul className="auth-benefits">
          <li>Salve seus dados para checkouts mais rapidos.</li>
          <li>Tenha um historico de pedidos em uma area segura.</li>
          <li>Prepare a MiniShop para recursos mais completos de conta.</li>
        </ul>
      </aside>
    </main>
  );
}
