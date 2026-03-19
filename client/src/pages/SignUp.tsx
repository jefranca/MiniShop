import { FormEvent, useState } from 'react';
import { signUp } from '../services/authService';

export function SignUp() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setMessage('Preencha todos os campos antes de criar a conta.');
      return;
    }

    if (password !== confirmPassword) {
      setMessage('As senhas precisam ser iguais.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await signUp({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      setMessage(`${response.user.name}, sua conta foi criada com sucesso.`);
      window.location.hash = '#/signin';
    } catch (submitError) {
      setMessage(
        submitError instanceof Error ? submitError.message : 'Erro inesperado ao criar conta.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="admin-field">
            <span>Nome completo</span>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <label className="admin-field">
            <span>E-mail</span>
            <input
              type="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <div className="checkout-inline-fields">
            <label className="admin-field">
              <span>Senha</span>
              <input
                type="password"
                placeholder="Crie uma senha"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>Confirmar senha</span>
              <input
                type="password"
                placeholder="Repita a senha"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
              />
            </label>
          </div>

          <label className="auth-check">
            <input type="checkbox" />
            <span>Aceito receber novidades e ofertas da MiniShop.</span>
          </label>

          {message ? <p className="checkout-helper">{message}</p> : null}

          <button type="submit" className="checkout-button" disabled={isSubmitting}>
            {isSubmitting ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className="auth-switch">
          Ja tem conta? <a href="#/signin">Entrar</a>
        </p>
      </section>
    </main>
  );
}
