import type { CartItem } from '../types/product';

const CART_STORAGE_KEY = 'minishop-cart';

export function loadCart() {
  const savedCart = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!savedCart) {
    return [] as CartItem[];
  }

  try {
    return JSON.parse(savedCart) as CartItem[];
  } catch {
    return [] as CartItem[];
  }
}

export function saveCart(cart: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}
