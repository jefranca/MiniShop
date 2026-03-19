import { FormEvent, useState } from 'react';
import { signIn } from '../services/authService';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!email.trim() || !password.trim()) {
      setMessage('Preencha e-mail e senha antes de entrar.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await signIn({
        email: email.trim(),
        password,
      });
      setMessage(`Bem-vindo de volta, ${response.user.name}.`);
      window.location.hash = '#/';
    } catch (submitError) {
      setMessage(submitError instanceof Error ? submitError.message : 'Erro inesperado ao entrar.');
    } finally {
      setIsSubmitting(false);
    }
  }

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

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>E-mail</span>
            <input
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>Senha</span>
            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>

          <div className="auth-form__meta">
            <label className="auth-check">
              <input type="checkbox" />
              <span>Continuar conectado</span>
            </label>
            <a href="#/signup">Esqueci minha senha</a>
          </div>

          {message ? <p className="checkout-helper">{message}</p> : null}

          <button type="submit" className="checkout-button" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-switch">
          Ainda nao tem conta? <a href="#/signup">Criar conta</a>
        </p>
      </section>
    </main>
  );
}
