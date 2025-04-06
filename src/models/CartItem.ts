import { Product } from "~/models/Product";

export type CartItem = {
  product: Product;
  count: number;
};

export type Cart = {
  product_id: string;
  cart_id: string;
  count: number;
};
