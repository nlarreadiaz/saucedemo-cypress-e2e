import users from '../fixtures/users.json';
import messages from '../fixtures/messages.json';
import { loginPage } from '../pages/LoginPage';
import { inventoryPage } from '../pages/InventoryPage';

describe('Authentication', () => {
  context('Login form', () => {
    beforeEach(() => {
      loginPage.visit();
    });

    it(
      'should redirect to the inventory when a standard user logs in with valid credentials',
      { tags: '@smoke' },
      () => {
        loginPage.login(users.standard.username, users.standard.password);

        cy.location('pathname').should('eq', inventoryPage.path);
        inventoryPage.pageTitle().should('have.text', messages.pageTitles.inventory);
        inventoryPage.inventoryList().should('be.visible');
      },
    );
  });

  context('Logged-in session', () => {
    beforeEach(() => {
      cy.login('standard');
      inventoryPage.visit();
    });

    it('should return to the login page when the user logs out from the side menu', () => {
      inventoryPage.logout();

      cy.location('pathname').should('eq', loginPage.path);
      loginPage.loginButton().should('be.visible');
      cy.getCookie('session-username').should('be.null');
    });
  });
});
