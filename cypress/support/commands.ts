import users from '../fixtures/users.json';
import { loginPage } from '../pages/LoginPage';
import { inventoryPage } from '../pages/InventoryPage';
import { getProducts } from './products';
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

/**
 * Puts products in the cart without using the UI and opens the inventory.
 * SauceDemo stores the cart in localStorage as an array of product ids, so it
 * is written before the app loads. Use it when the cart is a precondition of
 * the test, not the behaviour under test (that is covered in cart.cy.ts).
 */
Cypress.Commands.add('seedCart', (slugs: readonly string[]) => {
  const ids = getProducts(slugs).map((product) => product.id);

  cy.visit(inventoryPage.path, {
    // Inner routes answer 404 even though the SPA renders them (see BasePage).
    failOnStatusCode: false,
    onBeforeLoad(win) {
      win.localStorage.setItem('cart-contents', JSON.stringify(ids));
    },
  });
});
