import users from '../fixtures/users.json';
import messages from '../fixtures/messages.json';
import { loginPage } from '../pages/LoginPage';
import { inventoryPage } from '../pages/InventoryPage';

const { loginErrors } = messages;

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

    it('should show a locked-out error when a locked user tries to log in', () => {
      loginPage.login(users.lockedOut.username, users.lockedOut.password);

      loginPage.errorMessage().should('be.visible').and('have.text', loginErrors.lockedOut);
      cy.location('pathname').should('eq', loginPage.path);
    });

    it('should show an invalid credentials error when the password is wrong', () => {
      loginPage.login(users.invalidPassword.username, users.invalidPassword.password);

      loginPage
        .errorMessage()
        .should('be.visible')
        .and('have.text', loginErrors.invalidCredentials);
      cy.location('pathname').should('eq', loginPage.path);
    });

    const emptyFieldCases = [
      {
        scenario: 'the username is empty',
        username: '',
        password: users.standard.password,
        expectedError: loginErrors.usernameRequired,
      },
      {
        scenario: 'the password is empty',
        username: users.standard.username,
        password: '',
        expectedError: loginErrors.passwordRequired,
      },
      {
        scenario: 'both fields are empty',
        username: '',
        password: '',
        expectedError: loginErrors.usernameRequired,
      },
    ];

    emptyFieldCases.forEach(({ scenario, username, password, expectedError }) => {
      it(`should show a required field error when ${scenario}`, () => {
        loginPage.login(username, password);

        loginPage.errorMessage().should('be.visible').and('have.text', expectedError);
        cy.location('pathname').should('eq', loginPage.path);
      });
    });
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

  context('Protected pages', () => {
    it('should redirect to the login page with an error when the inventory is opened without a session', () => {
      inventoryPage.visit();

      cy.location('pathname').should('eq', loginPage.path);
      loginPage
        .errorMessage()
        .should('be.visible')
        .and('have.text', loginErrors.inventoryWithoutSession);
    });
  });
});
