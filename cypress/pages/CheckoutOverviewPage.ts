import { BasePage } from './BasePage';
import { parsePrice, textsOf } from '../support/utils';

/** Checkout step two: order summary with totals. */
class CheckoutOverviewPage extends BasePage {
  readonly path = '/checkout-step-two.html';

  items(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="cart-list"] [data-test="inventory-item"]');
  }

  itemNames(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="cart-list"] [data-test="inventory-item-name"]');
  }

  itemPrices(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="cart-list"] [data-test="inventory-item-price"]');
  }

  paymentInfo(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="payment-info-value"]');
  }

  shippingInfo(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="shipping-info-value"]');
  }

  subtotalLabel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="subtotal-label"]');
  }

  taxLabel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="tax-label"]');
  }

  totalLabel(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="total-label"]');
  }

  finishButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="finish"]');
  }

  // ---------- Data readers (no assertions) ----------

  getDisplayedNames(): Cypress.Chainable<string[]> {
    return this.itemNames().then(textsOf);
  }

  getDisplayedPrices(): Cypress.Chainable<number[]> {
    return this.itemPrices().then(($prices) => textsOf($prices).map(parsePrice));
  }

  getSubtotal(): Cypress.Chainable<number> {
    return this.subtotalLabel().then(($el) => parsePrice($el.text()));
  }

  getTax(): Cypress.Chainable<number> {
    return this.taxLabel().then(($el) => parsePrice($el.text()));
  }

  getTotal(): Cypress.Chainable<number> {
    return this.totalLabel().then(($el) => parsePrice($el.text()));
  }

  // ---------- Actions ----------

  finish(): void {
    this.finishButton().click();
  }
}

export const checkoutOverviewPage = new CheckoutOverviewPage();
