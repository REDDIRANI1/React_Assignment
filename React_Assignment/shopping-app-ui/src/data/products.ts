import { ProductId } from "../features/basket/basketSlice";

export interface Product {
  id: ProductId;
  name: string;
  pricePence: number;
}

export const PRODUCTS: Product[] = [
  { id: "bread", name: "Bread", pricePence: 110 },
  { id: "milk", name: "Milk", pricePence: 50 },
  { id: "cheese", name: "Cheese", pricePence: 90 },
  { id: "soup", name: "Soup", pricePence: 60 },
  { id: "butter", name: "Butter", pricePence: 120 },
];

export const productById: Record<ProductId, Product> = PRODUCTS.reduce(
  (acc, product) => {
    acc[product.id] = product;
    return acc;
  },
  {} as Record<ProductId, Product>
);

