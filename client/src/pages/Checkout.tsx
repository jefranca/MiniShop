import { FormEvent, useEffect, useMemo, useState } from 'react';
import { currency } from '../utils/formatters';
import type { CartItem } from '../types/product';

type CheckoutProps = {
  cart: CartItem[];
  cartTotal: number;
  onConfirmOrder: () => void;
};

export function Checkout({ cart, cartTotal, onConfirmOrder }: CheckoutProps) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cartao');
  const [shipping, setShipping] = useState<number | null>(null);
  const [shippingMessage, setShippingMessage] = useState('Preencha o endereco completo para calcular o frete.');
  const [cepMessage, setCepMessage] = useState('Digite um CEP valido para preencher o endereco automaticamente.');
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState('');
  const [discount, setDiscount] = useState(0);
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const isAddressComplete =
    cep.trim().length >= 8 &&
    street.trim() &&
    number.trim() &&
    neighborhood.trim() &&
    city.trim() &&
    state.trim();

  useEffect(() => {
    setShipping(null);
    setShippingMessage('Preencha o endereco completo para calcular o frete.');
  }, [cep, street, number, neighborhood, city, state]);

  useEffect(() => {
    if (!isAddressComplete) {
      return;
    }

    const cepDigits = cep.replace(/\D/g, '');
    const cepPrefix = Number(cepDigits.charAt(0) || '0');
    const calculatedShipping = cepPrefix <= 3 ? 18.9 : cepPrefix <= 6 ? 24.9 : 31.9;

    setShipping(calculatedShipping);
    setShippingMessage('Frete calculado automaticamente com base no CEP informado.');
  }, [cep, street, number, neighborhood, city, state, isAddressComplete]);

  useEffect(() => {
    const cepDigits = cep.replace(/\D/g, '');

    if (cepDigits.length !== 8) {
      setCepMessage('Digite um CEP valido para preencher o endereco automaticamente.');
      return;
    }

    let isActive = true;

    async function loadAddressByCep() {
      try {
        setCepMessage('Buscando endereco pelo CEP...');
        const response = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);

        if (!response.ok) {
          throw new Error('Nao foi possivel consultar o CEP.');
        }

        const data = (await response.json()) as {
          erro?: boolean;
          logradouro?: string;
          bairro?: string;
          localidade?: string;
          uf?: string;
        };

        if (!isActive) {
          return;
        }

        if (data.erro) {
          setCepMessage('CEP nao encontrado. Preencha o endereco manualmente.');
          return;
        }

        setStreet(data.logradouro ?? '');
        setNeighborhood(data.bairro ?? '');
        setCity(data.localidade ?? '');
        setState(data.uf ?? '');
        setCepMessage('Endereco preenchido automaticamente pelo CEP.');
      } catch {
        if (!isActive) {
          return;
        }

        setCepMessage('Nao foi possivel preencher o endereco automaticamente.');
      }
    }

    void loadAddressByCep();

    return () => {
      isActive = false;
    };
  }, [cep]);

  const total = useMemo(() => cartTotal + (shipping ?? 0) - discount, [cartTotal, shipping, discount]);

  function handleApplyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = couponCode.trim().toUpperCase();

    if (!normalizedCode) {
      setDiscount(0);
      setCouponMessage('Digite um cupom antes de aplicar.');
      return;
    }

    if (normalizedCode === 'MINI10') {
      const nextDiscount = Number((cartTotal * 0.1).toFixed(2));
      setDiscount(nextDiscount);
      setCouponMessage('Cupom MINI10 aplicado com 10% de desconto.');
      return;
    }

    if (normalizedCode === 'FRETEGRATIS') {
      if (shipping === null) {
        setCouponMessage('Calcule o frete antes de usar o cupom FRETEGRATIS.');
        return;
      }

      setDiscount(shipping);
      setCouponMessage('Cupom FRETEGRATIS aplicado sobre o valor do frete.');
      return;
    }

    setDiscount(0);
    setCouponMessage('Cupom invalido para este checkout.');
  }

  function handleConfirmOrder() {
    if (!customerName.trim() || !email.trim()) {
      setCheckoutMessage('Preencha nome e e-mail antes de confirmar o pedido.');
      return;
    }

    if (!isAddressComplete || shipping === null) {
      setCheckoutMessage('Complete o endereco para confirmar o pedido.');
      return;
    }

    onConfirmOrder();
  }

  return (
    <section className="checkout-panel">
      <div className="section-heading">
        <div>
          <p className="section-label">Checkout</p>
          <h2>Finalizar pedido</h2>
          <p className="catalog__text">
            Revise seus itens, preencha os dados e deixe a MiniShop pronta para a proxima etapa do
            fluxo de compra.
          </p>
        </div>
      </div>

      {cart.length === 0 ? (
        <div className="checkout-empty">
          <h3>Seu carrinho esta vazio.</h3>
          <p>Adicione produtos antes de seguir para a finalizacao do pedido.</p>
          <a href="#/" className="checkout-button checkout-button--inline">
            Voltar para a loja
          </a>
        </div>
      ) : (
        <div className="checkout-grid">
          <form className="checkout-form">
            <div className="section-heading">
              <div>
                <p className="section-label">Dados do cliente</p>
                <h3>Informacoes de entrega</h3>
              </div>
            </div>

            <label className="admin-field">
              <span>Nome completo</span>
              <input placeholder="Seu nome" value={customerName} onChange={(event) => setCustomerName(event.target.value)} />
            </label>

            <label className="admin-field">
              <span>E-mail</span>
              <input
                placeholder="voce@email.com"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>

            <label className="admin-field">
              <span>CEP</span>
              <input
                placeholder="00000-000"
                value={cep}
                onChange={(event) => setCep(event.target.value)}
              />
            </label>

            <p className="checkout-helper">{cepMessage}</p>

            <label className="admin-field">
              <span>Endereco</span>
              <input
                placeholder="Rua e complemento"
                value={street}
                onChange={(event) => setStreet(event.target.value)}
              />
            </label>

            <div className="checkout-inline-fields">
              <label className="admin-field">
                <span>Numero</span>
                <input
                  placeholder="123"
                  value={number}
                  onChange={(event) => setNumber(event.target.value)}
                />
              </label>

              <label className="admin-field">
                <span>Bairro</span>
                <input
                  placeholder="Seu bairro"
                  value={neighborhood}
                  onChange={(event) => setNeighborhood(event.target.value)}
                />
              </label>
            </div>

            <div className="checkout-inline-fields">
              <label className="admin-field">
                <span>Cidade</span>
                <input
                  placeholder="Sua cidade"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                />
              </label>

              <label className="admin-field">
                <span>Estado</span>
                <input
                  placeholder="UF"
                  value={state}
                  onChange={(event) => setState(event.target.value)}
                />
              </label>
            </div>

            <label className="admin-field">
              <span>Pagamento</span>
              <select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                <option value="cartao">Cartao</option>
                <option value="pix">Pix</option>
                <option value="boleto">Boleto</option>
              </select>
            </label>

            {checkoutMessage ? <p className="checkout-helper">{checkoutMessage}</p> : null}

            <button type="button" className="checkout-button" onClick={handleConfirmOrder}>
              Confirmar pedido
            </button>
          </form>

          <div className="checkout-summary-card">
            <div className="section-heading">
              <div>
                <p className="section-label">Resumo</p>
                <h3>Seu pedido</h3>
              </div>
            </div>

            <div className="checkout-items">
              {cart.map((item) => (
                <div key={item.id} className="checkout-item">
                  <div>
                    <strong>{item.name}</strong>
                    <p>
                      {item.quantity}x {currency.format(item.price)}
                    </p>
                  </div>
                  <strong>{currency.format(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>

            <form className="checkout-coupon" onSubmit={handleApplyCoupon}>
              <div>
                <p className="section-label">Cupom</p>
                <h4>Desconto</h4>
              </div>

              <div className="checkout-coupon__controls">
                <input
                  placeholder="Ex.: MINI10"
                  value={couponCode}
                  onChange={(event) => setCouponCode(event.target.value)}
                />
                <button type="submit" className="secondary-button">
                  Aplicar
                </button>
              </div>

              {couponMessage ? <p className="checkout-helper">{couponMessage}</p> : null}
            </form>

            <div className="checkout-totals">
              <div>
                <span>Subtotal</span>
                <strong>{currency.format(cartTotal)}</strong>
              </div>
              <div>
                <span>Frete</span>
                <strong>{shipping === null ? 'Calcule o frete' : currency.format(shipping)}</strong>
              </div>
              <div>
                <span>Desconto</span>
                <strong>{currency.format(discount)}</strong>
              </div>
              <div className="checkout-total-line">
                <span>Total</span>
                <strong>{currency.format(total)}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
