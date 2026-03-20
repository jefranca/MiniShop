const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export function buildApiUrl(path: string) {
  if (!path.startsWith('/')) {
    throw new Error('API path must start with "/".');
  }

  return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
}
