import users from '../fixtures/users.json';
import products from '../fixtures/products.json';

export interface User {
  username: string;
  password: string;
}

/** Keys of `fixtures/users.json`, e.g. 'standard' | 'lockedOut' | ... */
export type UserKey = keyof typeof users;

export type Product = (typeof products.catalog)[number];

/** Values accepted by the inventory sort dropdown: 'az' | 'za' | 'lohi' | 'hilo'. */
export type SortOption = (typeof products.sortOptions)[keyof typeof products.sortOptions]['value'];

export interface Customer {
  firstName: string;
  lastName: string;
  postalCode: string;
}
