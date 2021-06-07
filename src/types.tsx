export interface Product {
  name: string;
  category: Category;
  price: number;
  amount: number;
}

export interface Category {
  id: string;
  name: string;
}
