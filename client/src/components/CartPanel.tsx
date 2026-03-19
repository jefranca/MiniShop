import { buildCheckoutHash } from '../utils/navigation';
import { currency } from '../utils/formatters';
import type { CartItem } from '../types/product';

type CartPanelProps = {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  updateQuantity: (productId: number, nextQuantity: number) => void;
};

export function CartPanel({ cart, cartCount, cartTotal, updateQuantity }: CartPanelProps) {
  const checkoutHref = cart.length === 0 ? '#/' : buildCheckoutHash();

  return (
    <aside className="cart-panel">
      <div className="section-heading">
        <div>
          <p className="section-label">Carrinho</p>
          <h2>Resumo do pedido</h2>
        </div>
        <span className="cart-badge">{cartCount}</span>
      </div>

      <div className="cart-list">
        {cart.length === 0 ? (
          <p className="status-message">Seu carrinho ainda esta vazio.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              <div>
                <strong>{item.name}</strong>
                <p>{currency.format(item.price)}</p>
              </div>

              <div className="quantity-control">
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                  -
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="cart-summary">
        <div>
          <span>Subtotal</span>
          <strong>{currency.format(cartTotal)}</strong>
        </div>
        <a
          href={checkoutHref}
          className={`checkout-button${cart.length === 0 ? ' is-disabled' : ''}`}
          aria-disabled={cart.length === 0}
          onClick={(event) => {
            if (cart.length === 0) {
              event.preventDefault();
            }
          }}
        >
          Finalizar pedido
        </a>
      </div>
    </aside>
  );
}
