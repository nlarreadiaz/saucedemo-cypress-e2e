import { BasePage } from './BasePage';
import type { Customer } from '../support/types';

/** Checkout step one: customer information form. */
class CheckoutInfoPage extends BasePage {
  readonly path = '/checkout-step-one.html';

  firstNameInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="firstName"]');
  }

  lastNameInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="lastName"]');
  }

  postalCodeInput(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="postalCode"]');
  }

  errorMessage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="error"]');
  }

  continueButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="continue"]');
  }

  cancelButton(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-test="cancel"]');
  }

  /** Fills the form. Empty values are skipped to allow validation tests. */
  fillForm({ firstName, lastName, postalCode }: Customer): void {
    if (firstName) this.firstNameInput().type(firstName);
    if (lastName) this.lastNameInput().type(lastName);
    if (postalCode) this.postalCodeInput().type(postalCode);
  }

  submit(): void {
    this.continueButton().click();
  }

  fillAndContinue(customer: Customer): void {
    this.fillForm(customer);
    this.submit();
  }

  cancel(): void {
    this.cancelButton().click();
  }
}

export const checkoutInfoPage = new CheckoutInfoPage();
