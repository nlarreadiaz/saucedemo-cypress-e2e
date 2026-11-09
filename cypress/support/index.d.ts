import type { UserKey } from './types';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in with a user from `fixtures/users.json`, cached with cy.session().
       * @example cy.login('standard')
       */
      login(userKey: UserKey): Chainable<void>;
    }
  }
}
