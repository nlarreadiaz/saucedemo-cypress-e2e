import users from '../fixtures/users.json';

export interface User {
  username: string;
  password: string;
}

/** Keys of `fixtures/users.json`, e.g. 'standard' | 'lockedOut' | ... */
export type UserKey = keyof typeof users;
