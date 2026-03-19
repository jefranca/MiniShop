import type { CartItem } from '../types/product';
import type { AuthUser } from '../types/user';

const CART_STORAGE_KEY = 'minishop-cart';
const USER_STORAGE_KEY = 'minishop-user';

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

export function loadUser() {
  const savedUser = window.localStorage.getItem(USER_STORAGE_KEY);

  if (!savedUser) {
    return null as AuthUser | null;
  }

  try {
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    return null as AuthUser | null;
  }
}

export function saveUser(user: AuthUser | null) {
  if (!user) {
    window.localStorage.removeItem(USER_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
}
