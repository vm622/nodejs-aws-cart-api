import { Cart, CartItem } from '../models';

/**
 * @param {Cart} cart
 * @returns {number}
 */
export function calculateCartTotal(cart: Cart): number {
  if (cart && cart.items && cart.items.length > 0) {
    return cart.items.reduce((acc: number, { product: { price }, count }: CartItem) => {
      return acc += price * count;
    }, 0);
  } else {
    return 0;
  }
}
