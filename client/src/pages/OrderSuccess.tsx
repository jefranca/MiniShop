export function OrderSuccess() {
  return (
    <section className="checkout-panel">
      <div className="checkout-empty">
        <p className="section-label">Pedido confirmado</p>
        <h2>Compra recebida com sucesso</h2>
        <p>
          Recebemos seu pedido e a MiniShop ja pode seguir para separacao, pagamento e envio.
        </p>
        <a href="#/" className="checkout-button checkout-button--inline">
          Voltar para a loja
        </a>
      </div>
    </section>
  );
}
