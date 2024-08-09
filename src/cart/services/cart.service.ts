import { Injectable } from '@nestjs/common';
import { Cart, CartStatuses, Product } from '../models';
import { Pool } from 'pg';

@Injectable()
export class CartService {
  private pool: Pool;

  constructor() {    
    this.pool = new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      ssl: false
  });
  }

  async findByUserId(userId: string): Promise<Cart> {
    const query = 'SELECT * FROM carts WHERE user_id = $1';
    const cartResult = await this.pool.query(query, [userId]);
    const cart = cartResult.rows[0] as Cart;
    if (cart) {
      const itemsResult = await this.pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [cart.id]);

    const sampleProduct: Product = {
      id: 'product123',
      title: 'Sample Product',
      description: 'This is a sample product description.',
      price: 10.00,
    };

    cart.items = itemsResult.rows.map((item: any) => ({
      product: sampleProduct,
      product_id: sampleProduct.id,
      count: item.count,
    }));

    return cart;
    } else {
      return null;
    }
  }

  async createByUserId(userId: string): Promise<Cart> {
    const currentTime = new Date().toISOString();
    const createdAt = currentTime;
    const updatedAt = currentTime;
    const status = CartStatuses.OPEN;
    const query =
      'INSERT INTO carts (user_id, created_at, updated_at, status) VALUES ($1, $2, $3, $4) RETURNING id';
    const values = [userId, createdAt, updatedAt, status];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const cart = await this.findByUserId(userId);
    if (cart) {
      return cart;
    }
    const createdCart = this.createByUserId(userId);
    return createdCart;
  }

  async updateByUserId(userId: string, { items }: Cart): Promise<Cart> {
    const cart = await this.findOrCreateByUserId(userId);
    const updatedAt = new Date().toISOString();
    if (items && items.length > 0) {
      const deleteQuery = 'DELETE FROM cart_items WHERE cart_id = $1';
      await this.pool.query(deleteQuery, [cart.id]);

      const itemsQuery =
        'INSERT INTO cart_items (product_id, count, cart_id) VALUES ($1, $2, $3)';
      const valuesItems = items.map((item) => [
        item.product_id,
        item.count,
        cart.id,
      ]);
      await Promise.all(
        valuesItems.map((values) => this.pool.query(itemsQuery, values)),
      );
    }

    const updateCartQuery =
      'UPDATE carts SET updated_at = $1 WHERE id = $2 RETURNING *';
    const values = [updatedAt, cart.id];
    const result = await this.pool.query(updateCartQuery, values);
    const updatedCart = result.rows[0] as Cart;

    const sampleProduct: Product = {
      id: 'product123',
      title: 'Sample Product',
      description: 'This is a sample product description.',
      price: 10.00,
    };
    
    const itemsResult = await this.pool.query('SELECT * FROM cart_items WHERE cart_id = $1', [updatedCart.id]);
    updatedCart.items = itemsResult.rows.map((item: any) => ({
      product: sampleProduct,
      product_id: sampleProduct.id,
      count: item.count,
    }));

    return updatedCart;
  }

  async removeByUserId(userId: string): Promise<void> {
    const deleteCartItemsQuery ='DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = $1)';
    await this.pool.query(deleteCartItemsQuery, [userId]);

    const query = 'DELETE FROM carts WHERE user_id = $1';
    await this.pool.query(query, [userId]);
  }

}
