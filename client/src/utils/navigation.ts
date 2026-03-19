export type AppPage =
  | 'store'
  | 'catalog'
  | 'categories'
  | 'checkout'
  | 'order-success'
  | 'profile'
  | 'signin'
  | 'signup'
  | 'admin';

export type AppRoute = {
  page: AppPage;
  category: string;
};

export function getCurrentPage() {
  return getCurrentRoute().page;
}

export function getCurrentRoute(): AppRoute {
  const hash = window.location.hash || '#/';
  const [path, queryString = ''] = hash.split('?');
  const searchParams = new URLSearchParams(queryString);
  const category = searchParams.get('category') ?? 'Todos';

  if (path === '#/admin') {
    return { page: 'admin', category };
  }

  if (path === '#/catalog') {
    return { page: 'catalog', category };
  }

  if (path === '#/categories') {
    return { page: 'categories', category };
  }

  if (path === '#/checkout') {
    return { page: 'checkout', category };
  }

  if (path === '#/order-success') {
    return { page: 'order-success', category };
  }

  if (path === '#/profile') {
    return { page: 'profile', category };
  }

  if (path === '#/signin') {
    return { page: 'signin', category };
  }

  if (path === '#/signup') {
    return { page: 'signup', category };
  }

  return { page: 'store', category };
}

export function buildCatalogHash(category: string) {
  if (category === 'Todos') {
    return '#/catalog';
  }

  return `#/catalog?category=${encodeURIComponent(category)}`;
}

export function buildCategoryPageHash(category: string) {
  if (category === 'Todos') {
    return '#/categories';
  }

  return `#/categories?category=${encodeURIComponent(category)}`;
}

export function buildCheckoutHash() {
  return '#/checkout';
}

export function buildOrderSuccessHash() {
  return '#/order-success';
}

export function buildProfileHash() {
  return '#/profile';
}

export function buildSignInHash() {
  return '#/signin';
}

export function buildSignUpHash() {
  return '#/signup';
}
