/**
 * Elements and actions shared by every page behind the login:
 * header, burger menu and shopping cart link.
 */
export abstract class BasePage {
  abstract readonly path: string;

  /**
   * SauceDemo is a single-page app: its server answers 404 for inner routes
   * such as /inventory.html, but the app still renders them correctly.
   * The status code check is disabled here (and only here) for that reason.
   */
  visit(): void {
    cy.visit(this.path, { failOnStatusCode: false });
  }

  pageTitle(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="title"]');
  }

  cartLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="shopping-cart-link"]');
  }

  cartBadge(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="shopping-cart-badge"]');
  }

  /**
   * Exception to the data-test selector rule: SauceDemo puts
   * data-test="open-menu" on a decorative <img> that is covered by the real
   * <button>, which has no data-test. The button's stable id is used instead
   * of forcing a click on an element a real user cannot interact with.
   */
  openMenuButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('#react-burger-menu-btn');
  }

  logoutLink(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="logout-sidebar-link"]');
  }

  openCart(): void {
    this.cartLink().click();
  }

  logout(): void {
    this.openMenuButton().click();
    // The sidebar slides in; `click` waits until the link is actionable.
    this.logoutLink().click();
  }
}
