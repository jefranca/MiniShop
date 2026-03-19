export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
};

export type ProductFormState = {
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
};

export type CartItem = Product & {
  quantity: number;
};
