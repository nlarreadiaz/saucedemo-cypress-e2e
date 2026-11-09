import users from '../fixtures/users.json';
import { loginPage } from '../pages/LoginPage';
import type { UserKey } from './types';

/**
 * Logs in through the UI once per user and caches the session (cookies,
 * localStorage) with cy.session(). Subsequent calls restore the cached
 * session instead of repeating the UI login.
 *
 * Note: cy.session() leaves the browser on a blank page, so tests must
 * visit the page they need afterwards.
 */
Cypress.Commands.add('login', (userKey: UserKey) => {
  const { username, password } = users[userKey];

  cy.session(
    username,
    () => {
      loginPage.visit();
      loginPage.login(username, password);
      cy.location('pathname').should('eq', '/inventory.html');
    },
    {
      // SauceDemo keeps the logged-in user in this cookie.
      validate() {
        cy.getCookie('session-username').should('have.property', 'value', username);
      },
      cacheAcrossSpecs: true,
    },
  );
});
