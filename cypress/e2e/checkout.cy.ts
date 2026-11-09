import products from '../fixtures/products.json';
import messages from '../fixtures/messages.json';
import checkoutData from '../fixtures/checkout-data.json';
import { inventoryPage } from '../pages/InventoryPage';
import { cartPage } from '../pages/CartPage';
import { checkoutInfoPage } from '../pages/CheckoutInfoPage';
import { checkoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { checkoutCompletePage } from '../pages/CheckoutCompletePage';
import { getProducts } from '../support/products';
import { roundMoney } from '../support/utils';
import type { Product } from '../support/types';

const { taxRate, orderInfo, validCustomer, customers } = checkoutData;
const { checkoutErrors } = messages;
const cartProducts = getProducts(products.cartSelections.multiple);

/** Navigates from the inventory (with a non-empty cart) to the information step. */
const goToCheckoutInfo = () => {
  inventoryPage.openCart();
  cartPage.checkout();
  cy.location('pathname').should('eq', checkoutInfoPage.path);
};

/**
 * Asserts the overview totals. Expected values are calculated independently:
 * subtotal from the prices shown on the page AND from the fixture catalog,
 * tax as subtotal * taxRate rounded to cents, total as subtotal + tax.
 */
const assertOrderTotals = (expectedProducts: Product[]) => {
  const expectedSubtotal = roundMoney(
    expectedProducts.reduce((sum, product) => sum + product.price, 0),
  );
  const expectedTax = roundMoney(expectedSubtotal * taxRate);
  const expectedTotal = roundMoney(expectedSubtotal + expectedTax);

  checkoutOverviewPage.getDisplayedPrices().then((prices) => {
    const displayedItemsSum = roundMoney(prices.reduce((sum, price) => sum + price, 0));
    expect(displayedItemsSum, 'sum of item prices shown').to.equal(expectedSubtotal);
  });
  checkoutOverviewPage.getSubtotal().should('equal', expectedSubtotal);
  checkoutOverviewPage.getTax().should('equal', expectedTax);
  checkoutOverviewPage.getTotal().should('equal', expectedTotal);
};

describe('Checkout', () => {
  beforeEach(() => {
    cy.login('standard');
  });

  context('Happy path', () => {
    it(
      'should confirm the order when the user completes the whole purchase flow',
      { tags: '@smoke' },
      () => {
        // The full flow goes through the UI from the very first click.
        inventoryPage.visit();
        cartProducts.forEach((product) => inventoryPage.addToCart(product.slug));
        inventoryPage.cartBadge().should('have.text', String(cartProducts.length));

        goToCheckoutInfo();
        checkoutInfoPage.pageTitle().should('have.text', messages.pageTitles.checkoutInfo);
        checkoutInfoPage.fillAndContinue(validCustomer);

        cy.location('pathname').should('eq', checkoutOverviewPage.path);
        checkoutOverviewPage.pageTitle().should('have.text', messages.pageTitles.checkoutOverview);
        checkoutOverviewPage.getDisplayedNames().should(
          'deep.equal',
          cartProducts.map((product) => product.name),
        );
        checkoutOverviewPage.paymentInfo().should('have.text', orderInfo.payment);
        checkoutOverviewPage.shippingInfo().should('have.text', orderInfo.shipping);
        checkoutOverviewPage.finish();

        cy.location('pathname').should('eq', checkoutCompletePage.path);
        checkoutCompletePage.pageTitle().should('have.text', messages.pageTitles.checkoutComplete);
        checkoutCompletePage.completeHeader().should('have.text', messages.checkoutComplete.header);
        checkoutCompletePage.completeText().should('have.text', messages.checkoutComplete.text);
        checkoutCompletePage.cartBadge().should('not.exist');

        checkoutCompletePage.backHome();
        cy.location('pathname').should('eq', inventoryPage.path);
      },
    );

    it('should show the correct subtotal, tax and total when reviewing the order', () => {
      cy.seedCart(products.cartSelections.multiple);
      goToCheckoutInfo();
      checkoutInfoPage.fillAndContinue(validCustomer);

      assertOrderTotals(cartProducts);
    });
  });

  context('Customer information validation', () => {
    const validationCases = [
      {
        field: 'first name',
        customer: { ...validCustomer, firstName: '' },
        expectedError: checkoutErrors.firstNameRequired,
      },
      {
        field: 'last name',
        customer: { ...validCustomer, lastName: '' },
        expectedError: checkoutErrors.lastNameRequired,
      },
      {
        field: 'postal code',
        customer: { ...validCustomer, postalCode: '' },
        expectedError: checkoutErrors.postalCodeRequired,
      },
    ];

    beforeEach(() => {
      cy.seedCart(products.cartSelections.single);
      goToCheckoutInfo();
    });

    validationCases.forEach(({ field, customer, expectedError }) => {
      it(`should show a validation error and stay on the form when the ${field} is empty`, () => {
        checkoutInfoPage.fillAndContinue(customer);

        checkoutInfoPage.errorMessage().should('be.visible').and('have.text', expectedError);
        cy.location('pathname').should('eq', checkoutInfoPage.path);
      });
    });
  });

  context('Cancellation', () => {
    it('should return to the cart with its products when the checkout is cancelled', () => {
      cy.seedCart(products.cartSelections.multiple);
      goToCheckoutInfo();

      checkoutInfoPage.cancel();

      cy.location('pathname').should('eq', cartPage.path);
      cartPage.getDisplayedNames().should(
        'deep.equal',
        cartProducts.map((product) => product.name),
      );
      cartPage.cartBadge().should('have.text', String(cartProducts.length));
    });
  });

  context('Data-driven purchases', () => {
    customers.forEach(({ description, cart, ...customer }) => {
      it(`should complete the purchase with correct totals for ${description}`, () => {
        const orderProducts = getProducts(cart);
        cy.seedCart(cart);
        goToCheckoutInfo();

        checkoutInfoPage.fillAndContinue(customer);

        checkoutOverviewPage.getDisplayedNames().should(
          'deep.equal',
          orderProducts.map((product) => product.name),
        );
        assertOrderTotals(orderProducts);

        checkoutOverviewPage.finish();

        checkoutCompletePage.completeHeader().should('have.text', messages.checkoutComplete.header);
      });
    });
  });
});
