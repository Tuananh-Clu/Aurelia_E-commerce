/** Cart feature types - copy from shared where used */

export type Cart = {
  itemid: string;
  name: string;
  price: number;
  thumnail: string;
  color: string;
  size: string;
  quantity: number;
  dateBuy: string;
};

export type CartItemRowProps = {
  item: Cart;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
};

export type CartSummaryProps = {
  subtotal: number;
  tax: number;
};
