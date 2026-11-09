import { BasePage } from './BasePage';

/** Order confirmation page. */
class CheckoutCompletePage extends BasePage {
  readonly path = '/checkout-complete.html';

  completeHeader(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="complete-header"]');
  }

  completeText(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="complete-text"]');
  }

  backHomeButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="back-to-products"]');
  }

  backHome(): void {
    this.backHomeButton().click();
  }
}

export const checkoutCompletePage = new CheckoutCompletePage();
