export type Category = {
  id: number;
  name: string;
};

export type CategoryInput = Omit<Category, 'id'>;
