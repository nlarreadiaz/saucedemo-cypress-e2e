import { BasePage } from './BasePage';
import { parsePrice, textsOf } from '../support/utils';

class CartPage extends BasePage {
  readonly path = '/cart.html';

  // ---------- Elements ----------

  items(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="cart-list"] [data-test="inventory-item"]');
  }

  itemNames(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="cart-list"] [data-test="inventory-item-name"]');
  }

  itemPrices(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="cart-list"] [data-test="inventory-item-price"]');
  }

  itemQuantities(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="cart-list"] [data-test="item-quantity"]');
  }

  removeButton(slug: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-test="remove-${slug}"]`);
  }

  continueShoppingButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="continue-shopping"]');
  }

  checkoutButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="checkout"]');
  }

  // ---------- Data readers (no assertions) ----------

  getDisplayedNames(): Cypress.Chainable<string[]> {
    return this.itemNames().then(textsOf);
  }

  getDisplayedPrices(): Cypress.Chainable<number[]> {
    return this.itemPrices().then(($prices) => textsOf($prices).map(parsePrice));
  }

  // ---------- Actions ----------

  removeFromCart(slug: string): void {
    this.removeButton(slug).click();
  }

  continueShopping(): void {
    this.continueShoppingButton().click();
  }

  checkout(): void {
    this.checkoutButton().click();
  }
}

export const cartPage = new CartPage();
