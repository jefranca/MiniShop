export function getCurrentPage() {
  return window.location.hash === '#/admin' ? 'admin' : 'store';
}
