class LoginPage {
  readonly path = '/';

  visit(): void {
    cy.visit(this.path);
  }

  usernameInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="username"]');
  }

  passwordInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="password"]');
  }

  loginButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="login-button"]');
  }

  errorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="error"]');
  }

  /**
   * Fills the form and submits it. Empty values are skipped so that
   * validation of empty fields can be tested with the same action.
   */
  login(username: string, password: string): void {
    if (username) {
      this.usernameInput().type(username);
    }
    if (password) {
      // `log: false` keeps the password out of the command log and the report.
      this.passwordInput().type(password, { log: false });
    }
    this.loginButton().click();
  }
}

export const loginPage = new LoginPage();
