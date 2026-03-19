export type AppPage = 'store' | 'catalog' | 'admin';

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

  return { page: 'store', category };
}

export function buildCatalogHash(category: string) {
  if (category === 'Todos') {
    return '#/catalog';
  }

  return `#/catalog?category=${encodeURIComponent(category)}`;
}
