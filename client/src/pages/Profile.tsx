import { useEffect, useState } from 'react';
import { listOrdersByUser } from '../services/orderService';
import type { Order } from '../types/order';
import type { AuthUser } from '../types/user';
import { currency } from '../utils/formatters';

type ProfileProps = {
  currentUser: AuthUser | null;
};

export function Profile({ currentUser }: ProfileProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setOrders([]);
      return;
    }

    const userId = currentUser.id;

    async function loadOrders() {
      try {
        setLoading(true);
        const userOrders = await listOrdersByUser(userId);
        setOrders(userOrders);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Erro ao carregar pedidos.');
      } finally {
        setLoading(false);
      }
    }

    void loadOrders();
  }, [currentUser]);

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
      </section>

      <section className="auth-card">
        <div className="section-heading">
          <div>
            <p className="section-label">Minhas compras</p>
            <h2>Historico de pedidos</h2>
          </div>
        </div>

        {loading ? <p className="status-message">Carregando pedidos...</p> : null}
        {!loading && message ? <p className="status-message status-message--error">{message}</p> : null}
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
                  <strong>{currency.format(order.total)}</strong>
                </div>
                <p className="catalog__text">
                  {order.items.length} item(ns) | {order.paymentMethod} | {order.city} - {order.state}
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
