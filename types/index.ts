type Tag = {
  name: string;
  id: number;
};

type Category = {
  id: number;
  name: string;
  is_published: boolean;
  is_general: boolean;
};

type Image = {
  path: string;
  rank: number;
};

type MenuItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  tags: Tag[];
  category: Category;
  images: Image[];
};

type MenuItem2 = {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  tags: Tag[];
  category: Category;
  images: string;
};
export type { MenuItem, MenuItem2, Tag, Category, Image };
