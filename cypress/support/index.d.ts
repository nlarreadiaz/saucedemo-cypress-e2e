import type { UserKey } from './types';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a user from `fixtures/users.json`, cached with cy.session().
       * @example cy.login('standard')
       */
      login(userKey: UserKey): Chainable<void>;

      /**
       * Seeds the cart with products from `fixtures/products.json` (by slug)
       * and opens the inventory page. Requires an active session (cy.login).
       * @example cy.seedCart(['sauce-labs-backpack'])
       */
      seedCart(slugs: readonly string[]): Chainable<void>;
    }
  }
}
