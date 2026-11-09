import { BasePage } from './BasePage';
import { parsePrice, textsOf } from '../support/utils';
import type { SortOption } from '../support/types';

class InventoryPage extends BasePage {
  readonly path = '/inventory.html';

  // ---------- Elements ----------

  inventoryList(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-list"]');
  }

  items(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-item"]');
  }

  itemNames(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-item-name"]');
  }

  itemPrices(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-item-price"]');
  }

  /** Product images, identified by their data-test suffix: inventory-item-<slug>-img. */
  itemImages(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-item"] [data-test$="-img"]');
  }

  /** Name, price, description and image of a single product card. */
  item(productName: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .contains('[data-test="inventory-item-name"]', productName)
      .parents('[data-test="inventory-item"]');
  }

  sortDropdown(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="product-sort-container"]');
  }

  /** Label of the currently selected sort option. */
  activeSortOption(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="active-option"]');
  }

  addToCartButton(slug: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-test="add-to-cart-${slug}"]`);
  }

  removeButton(slug: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get(`[data-test="remove-${slug}"]`);
  }

  // ---------- Data readers (no assertions) ----------

  /** Product names in the order they are currently displayed. */
  getDisplayedNames(): Cypress.Chainable<string[]> {
    return this.itemNames().then(textsOf);
  }

  /** Product prices (as numbers) in the order they are currently displayed. */
  getDisplayedPrices(): Cypress.Chainable<number[]> {
    return this.itemPrices().then(($prices) => textsOf($prices).map(parsePrice));
  }

  // ---------- Actions ----------

  sortBy(option: SortOption): void {
    this.sortDropdown().select(option);
  }

  openProduct(productName: string): void {
    cy.contains('[data-test="inventory-item-name"]', productName).click();
  }

  addToCart(slug: string): void {
    this.addToCartButton(slug).click();
  }

  removeFromCart(slug: string): void {
    this.removeButton(slug).click();
  }
}

export const inventoryPage = new InventoryPage();
