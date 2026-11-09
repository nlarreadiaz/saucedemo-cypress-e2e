import { BasePage } from './BasePage';

/** Product detail page: /inventory-item.html?id=<id> */
class ProductDetailPage extends BasePage {
  readonly path = '/inventory-item.html';

  name(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-item-name"]');
  }

  description(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-item-desc"]');
  }

  price(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-item-price"]');
  }

  image(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-item"] [data-test$="-img"]');
  }

  addToCartButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="add-to-cart"]');
  }

  removeButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="remove"]');
  }

  backButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="back-to-products"]');
  }

  backToProducts(): void {
    this.backButton().click();
  }
}

export const productDetailPage = new ProductDetailPage();
