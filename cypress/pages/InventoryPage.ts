import { BasePage } from './BasePage';

class InventoryPage extends BasePage {
  readonly path = '/inventory.html';

  inventoryList(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="inventory-list"]');
  }
}

export const inventoryPage = new InventoryPage();
