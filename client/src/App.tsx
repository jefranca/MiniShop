import { FormEvent, useEffect, useMemo, useState } from 'react';
import { CartPanel } from './components/CartPanel';
import { HeaderComponent } from './components/HeaderComponent';
import { Hero } from './components/Hero';
import { Admin } from './pages/Admin';
import { Catalog } from './pages/Catalog';
import { Categories } from './pages/Categories';
import { Checkout } from './pages/Checkout';
import { Home } from './pages/Home';
import { OrderSuccess } from './pages/OrderSuccess';
import { Profile } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';
import { createCategory, listCategories } from './services/categoryService';
import { createOrder } from './services/orderService';
import { createProduct, deleteProduct, listProducts, updateProduct } from './services/productService';
import type { OrderPayload } from './types/order';
import type { CartItem, Category, Product, ProductFormState } from './types/product';
import type { AuthUser } from './types/user';
import { initialProductForm } from './utils/constants';
import { buildCatalogHash, buildOrderSuccessHash, getCurrentRoute } from './utils/navigation';
import { mapProductToForm } from './utils/productForm';
import { loadCart, loadUser, saveCart, saveUser } from './utils/localStorage';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState<
    | 'store'
    | 'catalog'
    | 'categories'
    | 'checkout'
    | 'order-success'
    | 'signin'
    | 'signup'
    | 'admin'
    | 'profile'
  >(
    getCurrentRoute().page,
  );
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [productForm, setProductForm] = useState<ProductFormState>(initialProductForm);
  const [adminMessage, setAdminMessage] = useState('');
  const [categoryForm, setCategoryForm] = useState('');
  const [categoryMessage, setCategoryMessage] = useState('');
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isSubmittingCategory, setIsSubmittingCategory] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);

  useEffect(() => {
    const syncPage = () => {
      const route = getCurrentRoute();
      setCurrentPage(route.page);

      if (
        route.page !== 'admin' &&
        route.page !== 'checkout' &&
        route.page !== 'profile' &&
        route.page !== 'signin' &&
        route.page !== 'signup'
      ) {
        setSelectedCategory(route.category);
      }
    };

    syncPage();
    window.addEventListener('hashchange', syncPage);
    return () => window.removeEventListener('hashchange', syncPage);
  }, []);

  useEffect(() => {
    setCart(loadCart());
    setCurrentUser(loadUser());
  }, []);

  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  useEffect(() => {
    saveUser(currentUser);
  }, [currentUser]);

  useEffect(() => {
    async function loadStoreData() {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([listProducts(), listCategories()]);
        setProducts(productsData);
        setCategories(categoriesData);
        setProductForm((current) => ({
          ...current,
          category: current.category || categoriesData[0]?.name || '',
        }));
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

    void loadStoreData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'Todos') {
      return products;
    }

    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const productsCountByCategory = useMemo(
    () =>
      products.reduce<Record<string, number>>((accumulator, product) => {
        accumulator[product.category] = (accumulator[product.category] ?? 0) + 1;
        return accumulator;
      }, {}),
    [products],
  );

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

  function handleCategoryChange(category: string) {
    setSelectedCategory(category);

    if (currentPage === 'catalog') {
      window.location.hash = buildCatalogHash(category);
    }
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

  async function handleConfirmOrder(orderPayload: OrderPayload) {
    if (!currentUser) {
      throw new Error('Entre na sua conta para confirmar o pedido.');
    }

    await createOrder(orderPayload, currentUser.token);
    setCart([]);
    window.location.hash = buildOrderSuccessHash();
  }

  function handleSignedIn(user: AuthUser) {
    setCurrentUser(user);
  }

  function handleLogout() {
    setCurrentUser(null);
    window.location.hash = '#/';
  }

  function resetAdminForm() {
    setProductForm({
      ...initialProductForm,
      category: categories[0]?.name || '',
    });
    setEditingProductId(null);
  }

  function startEditingProduct(product: Product) {
    setEditingProductId(product.id);
    setProductForm(mapProductToForm(product));
    setAdminMessage('');
  }

  async function handleCreateCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCategoryMessage('');

    if (!categoryForm.trim()) {
      setCategoryMessage('Preencha o nome da categoria antes de salvar.');
      return;
    }

    try {
      setIsSubmittingCategory(true);
      const savedCategory = await createCategory(categoryForm.trim());
      setCategories((currentCategories) =>
        [...currentCategories, savedCategory].sort((a, b) => a.name.localeCompare(b.name)),
      );
      setProductForm((current) => ({
        ...current,
        category: current.category || savedCategory.name,
      }));
      setCategoryForm('');
      setCategoryMessage('Categoria criada com sucesso.');
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : 'Erro inesperado ao salvar categoria.';
      setCategoryMessage(message);
    } finally {
      setIsSubmittingCategory(false);
    }
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
        <HeaderComponent currentPage={currentPage} currentUser={currentUser} onLogout={handleLogout} />
        <Hero
          currentPage={currentPage}
          productCount={products.length}
          categoryCount={categories.length}
          cartCount={cartCount}
        />
      </header>

      {currentPage === 'admin' ? (
        <Admin
          categories={categories}
          products={products}
          loading={loading}
          error={error}
          productForm={productForm}
          setProductForm={(updater) => setProductForm((current) => updater(current))}
          editingProductId={editingProductId}
          adminMessage={adminMessage}
          categoryForm={categoryForm}
          setCategoryForm={setCategoryForm}
          categoryMessage={categoryMessage}
          isSubmittingCategory={isSubmittingCategory}
          isSubmittingProduct={isSubmittingProduct}
          handleCreateCategory={handleCreateCategory}
          handleCreateOrUpdateProduct={handleCreateOrUpdateProduct}
          handleDeleteProduct={handleDeleteProduct}
          startEditingProduct={startEditingProduct}
          resetAdminForm={resetAdminForm}
        />
      ) : currentPage === 'order-success' ? (
        <main className="content-grid">
          <OrderSuccess />
          <CartPanel
            cart={cart}
            cartCount={cartCount}
            cartTotal={cartTotal}
            updateQuantity={updateQuantity}
          />
        </main>
      ) : currentPage === 'profile' ? (
        <Profile currentUser={currentUser} onProfileUpdated={handleSignedIn} />
      ) : currentPage === 'signin' ? (
        <SignIn onSignedIn={handleSignedIn} />
      ) : currentPage === 'signup' ? (
        <SignUp onSignedUp={handleSignedIn} />
      ) : (
        <main className="content-grid">
          {currentPage === 'checkout' ? (
            <Checkout
              cart={cart}
              cartTotal={cartTotal}
              currentUser={currentUser}
              onConfirmOrder={handleConfirmOrder}
            />
          ) : currentPage === 'categories' ? (
            <Categories categories={categories} productsCountByCategory={productsCountByCategory} />
          ) : currentPage === 'catalog' ? (
            <Catalog
              categories={categories}
              filteredProducts={filteredProducts}
              loading={loading}
              error={error}
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategoryChange}
              addToCart={addToCart}
            />
          ) : (
            <Home
              filteredProducts={products}
              loading={loading}
              error={error}
              addToCart={addToCart}
            />
          )}
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
