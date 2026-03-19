import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CartPanel } from './components/CartPanel';
import { HeaderComponent } from './components/HeaderComponent';
import { Hero } from './components/Hero';
import { Admin } from './pages/Admin';
import { Home } from './pages/Home';
import { createProduct, deleteProduct, listProducts, updateProduct } from './services/productService';
import type { CartItem, Product, ProductFormState } from './types/product';
import { categories, initialProductForm } from './utils/constants';
import { getCurrentPage } from './utils/navigation';
import { mapProductToForm } from './utils/productForm';
import { loadCart, saveCart } from './utils/localStorage';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState<'store' | 'admin'>(getCurrentPage);
  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [adminMessage, setAdminMessage] = useState('');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  useEffect(() => {
    const syncPage = () => {
      setCurrentPage(getCurrentPage());
    };

    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    setCart(loadCart());
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await listProducts();
        setProducts(data);
      } catch (fetchError) {
        const message =
          fetchError instanceof Error
            ? fetchError.message
            : 'Erro inesperado ao carregar a vitrine.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    void loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  function addToCart(product: Product) {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.id === product.id);

      if (existingItem) {
        return currentCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: number, nextQuantity: number) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: Math.max(0, nextQuantity) } : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function resetAdminForm() {
    setProductForm(initialProductForm);
    setEditingProductId(null);
  }

  function startEditingProduct(product: Product) {
    setEditingProductId(product.id);
    setProductForm(mapProductToForm(product));
    setAdminMessage('');
  }

  async function handleCreateOrUpdateProduct(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAdminMessage('');

    const price = Number(productForm.price);

    if (
      !productForm.name ||
      !productForm.category ||
      !productForm.image ||
      !productForm.description ||
      Number.isNaN(price)
    ) {
      setAdminMessage('Preencha todos os campos do produto antes de salvar.');
      return;
    }

    try {
      setIsSubmittingProduct(true);
      const isEditing = editingProductId !== null;
      const productPayload = {
        name: productForm.name,
        category: productForm.category,
        price,
        image: productForm.image,
        description: productForm.description,
      };
      const savedProduct = isEditing
        ? await updateProduct(editingProductId, productPayload)
        : await createProduct(productPayload);

      if (isEditing) {
        setProducts((currentProducts) =>
          currentProducts.map((product) => (product.id === savedProduct.id ? savedProduct : product)),
        );
        setAdminMessage('Produto atualizado com sucesso.');
      } else {
        setProducts((currentProducts) => [...currentProducts, savedProduct]);
        setAdminMessage('Produto criado com sucesso.');
      }

      resetAdminForm();
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'Erro inesperado ao salvar produto.';
      setAdminMessage(message);
    } finally {
      setIsSubmittingProduct(false);
    }
  }

  async function handleDeleteProduct(productId: number) {
    setAdminMessage('');

    try {
      await deleteProduct(productId);

      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== productId));

      if (editingProductId === productId) {
        resetAdminForm();
      }

      setAdminMessage('Produto removido com sucesso.');
    } catch (deleteError) {
      const message =
        deleteError instanceof Error
          ? deleteError.message
          : 'Erro inesperado ao remover produto.';
      setAdminMessage(message);
    }
  }

  return (
    <div className="page-shell">
      <header className="hero">
        <HeaderComponent currentPage={currentPage} />
        <Hero
          currentPage={currentPage}
          productCount={products.length}
          categoryCount={categories.length - 1}
          cartCount={cartCount}
        />
      </header>

      {currentPage === 'admin' ? (
        <Admin
          products={products}
          loading={loading}
          error={error}
          productForm={productForm}
          setProductForm={(updater) => setProductForm((current) => updater(current))}
          editingProductId={editingProductId}
          adminMessage={adminMessage}
          isSubmittingProduct={isSubmittingProduct}
          handleCreateOrUpdateProduct={handleCreateOrUpdateProduct}
          handleDeleteProduct={handleDeleteProduct}
          startEditingProduct={startEditingProduct}
          resetAdminForm={resetAdminForm}
        />
      ) : (
        <main className="content-grid">
          <Home
            filteredProducts={filteredProducts}
            loading={loading}
            error={error}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            addToCart={addToCart}
          />
          <CartPanel
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            updateQuantity={updateQuantity}
          />
        </main>
      )}
    </div>
  );
}
