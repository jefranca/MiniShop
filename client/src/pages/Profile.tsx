import { useEffect, useState } from 'react';
import { listOrdersByUser } from '../services/orderService';
import { getUserProfile, updateUserProfile } from '../services/userService';
import type { Order } from '../types/order';
import type { AuthUser } from '../types/user';
import { currency } from '../utils/formatters';

type ProfileProps = {
  currentUser: AuthUser | null;
  onProfileUpdated: (user: AuthUser) => void;
};

export function Profile({ currentUser, onProfileUpdated }: ProfileProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [name, setName] = useState(currentUser?.name ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [message, setMessage] = useState('');
  const [profileMessage, setProfileMessage] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setOrders([]);
      return;
    }

    const userId = currentUser.id;
    const userToken = currentUser.token;
    setName(currentUser.name);
    setEmail(currentUser.email);

    async function loadOrders() {
      try {
        setLoading(true);
        const profile = await getUserProfile(userId, userToken);
        setName(profile.name);
        setEmail(profile.email);
        onProfileUpdated(profile);
        const userOrders = await listOrdersByUser(userId, userToken);
        setOrders(userOrders);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Erro ao carregar pedidos.');
      } finally {
        setLoading(false);
      }
    }

    void loadOrders();
  }, [currentUser, onProfileUpdated]);

  const latestOrder = orders[0];

  async function handleProfileSave() {
    if (!currentUser) {
      return;
    }

    try {
      setIsSavingProfile(true);
      setProfileMessage('');
      const response = await updateUserProfile(currentUser.id, currentUser.token, {
        name: name.trim(),
        email: email.trim(),
      });
      onProfileUpdated({
        ...response.user,
        token: currentUser.token,
      });
      setProfileMessage('Perfil atualizado com sucesso.');
    } catch (error) {
      setProfileMessage(error instanceof Error ? error.message : 'Erro ao atualizar perfil.');
    } finally {
      setIsSavingProfile(false);
    }
  }

  if (!currentUser) {
    return (
      <main className="auth-layout">
        <section className="auth-card">
          <p className="section-label">Perfil</p>
          <h2>Entre para ver suas compras</h2>
          <p className="catalog__text">
            Faca login na MiniShop para acompanhar pedidos e acessar seu historico dentro do site.
          </p>
          <a href="#/signin" className="checkout-button checkout-button--inline">
            Ir para entrar
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-layout auth-layout--wide">
      <section className="auth-card">
        <div className="section-heading">
          <div>
            <p className="section-label">Perfil</p>
            <h2>{currentUser.name}</h2>
            <p className="catalog__text">{currentUser.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span>Pedidos</span>
            <strong>{orders.length}</strong>
          </div>
          <div className="profile-stat">
            <span>Total comprado</span>
            <strong>{currency.format(orders.reduce((sum, order) => sum + order.total, 0))}</strong>
          </div>
        </div>

        <div className="auth-form">
          <label className="admin-field">
            <span>Nome</span>
            <input value={name} onChange={(event) => setName(event.target.value)} />
          </label>
          <label className="admin-field">
            <span>E-mail</span>
            <input value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          {profileMessage ? <p className="checkout-helper">{profileMessage}</p> : null}
          <button
            type="button"
            className="checkout-button checkout-button--inline"
            onClick={() => void handleProfileSave()}
            disabled={isSavingProfile}
          >
            {isSavingProfile ? 'Salvando...' : 'Salvar perfil'}
          </button>
        </div>
      </section>

      <section className="auth-card">
        <div className="section-heading">
          <div>
            <p className="section-label">Endereco salvo</p>
            <h2>Ultima entrega</h2>
          </div>
        </div>

        {latestOrder ? (
          <div className="profile-address-card">
            <strong>
              {latestOrder.street}, {latestOrder.number}
            </strong>
            <p className="catalog__text">
              {latestOrder.neighborhood} | {latestOrder.city} - {latestOrder.state}
            </p>
            <p className="catalog__text">CEP {latestOrder.cep}</p>
          </div>
        ) : (
          <p className="status-message">
            Seu endereco salvo vai aparecer aqui apos a primeira compra.
          </p>
        )}
      </section>

      <section className="auth-card">
        <div className="section-heading">
          <div>
            <p className="section-label">Minhas compras</p>
            <h2>Historico de pedidos</h2>
          </div>
        </div>

        {loading ? <p className="status-message">Carregando pedidos...</p> : null}
        {!loading && message ? (
          <p className="status-message status-message--error">{message}</p>
        ) : null}
        {!loading && !message && orders.length === 0 ? (
          <p className="status-message">Voce ainda nao concluiu compras com essa conta.</p>
        ) : null}

        {!loading && !message && orders.length > 0 ? (
          <div className="profile-orders">
            {orders.map((order) => (
              <article key={order.id} className="profile-order-card">
                <div className="profile-order-card__top">
                  <div>
                    <p className="section-label">Pedido #{order.id}</p>
                    <h3>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</h3>
                  </div>
                  <div className="profile-order-card__summary">
                    <span className="profile-order-status">{order.status}</span>
                    <strong>{currency.format(order.total)}</strong>
                  </div>
                </div>
                <p className="catalog__text">
                  {order.items.length} item(ns) | {order.paymentMethod} | {order.city} -{' '}
                  {order.state}
                </p>
                <p className="catalog__text">
                  Subtotal {currency.format(order.subtotal)} | Frete{' '}
                  {currency.format(order.shipping)}
                  {' | '}Desconto {currency.format(order.discount)}
                </p>
                <div className="profile-order-items">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="profile-order-item">
                      <span>{item.name}</span>
                      <strong>
                        {item.quantity}x {currency.format(item.price)}
                      </strong>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>
    </main>
  );
}
