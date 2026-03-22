import { FormEvent, useState } from 'react';
import { signIn } from '../services/authService';
import type { AuthUser } from '../types/user';

type SignInProps = {
  onSignedIn: (user: AuthUser) => void;
};

export function SignIn({ onSignedIn }: SignInProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecoveryOpen, setIsRecoveryOpen] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryMessage, setRecoveryMessage] = useState('');

  function openRecoveryModal() {
    setRecoveryEmail(email.trim());
    setRecoveryMessage('');
    setIsRecoveryOpen(true);
  }

  function closeRecoveryModal() {
    setIsRecoveryOpen(false);
    setRecoveryMessage('');
  }

  function handleRecoverySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!recoveryEmail.trim()) {
      setRecoveryMessage('Digite seu e-mail para continuar.');
      return;
    }

    setRecoveryMessage(
      'Quando o fluxo estiver ativo, enviaremos as instrucoes para este e-mail.',
    );
  }

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
      onSignedIn(response.user);
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
            <button type="button" className="auth-link-button" onClick={openRecoveryModal}>
              Esqueci minha senha
            </button>
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

      {isRecoveryOpen ? (
        <div className="auth-modal-backdrop" role="presentation" onClick={closeRecoveryModal}>
          <section
            className="auth-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-recovery-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="section-heading">
              <div>
                <p className="section-label">Recuperacao</p>
                <h2 id="password-recovery-title">Esqueci minha senha</h2>
                <p className="catalog__text">
                  Informe seu e-mail para receber as instrucoes de recuperacao quando esse fluxo
                  estiver ativo.
                </p>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleRecoverySubmit}>
              <label className="admin-field">
                <span>E-mail</span>
                <input
                  type="email"
                  placeholder="voce@email.com"
                  value={recoveryEmail}
                  onChange={(event) => setRecoveryEmail(event.target.value)}
                />
              </label>

              {recoveryMessage ? <p className="checkout-helper">{recoveryMessage}</p> : null}

              <div className="auth-modal__actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={closeRecoveryModal}
                >
                  Fechar
                </button>
                <button type="submit" className="checkout-button checkout-button--inline">
                  Enviar
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </main>
  );
}
