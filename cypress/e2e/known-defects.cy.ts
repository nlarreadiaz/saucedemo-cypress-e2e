/**
 * KNOWN DEFECTS (quarantined)
 *
 * Each test asserts the CORRECT, expected behaviour, so it fails while the
 * defect exists and will start passing automatically once it is fixed.
 *
 * - Tagged @known-defect (suite) and @BUG-xxx (test), matching the
 *   "Known defects found" table in the README and fixtures/known-defects.json.
 * - Excluded from the default run (see `expose.grepTags` in cypress.config.ts)
 *   so the main pipeline stays green and new regressions remain visible.
 * - Run them on demand with `npm run test:defects`.
 */
import products from '../fixtures/products.json';
import checkoutData from '../fixtures/checkout-data.json';
import messages from '../fixtures/messages.json';
import knownDefects from '../fixtures/known-defects.json';
import users from '../fixtures/users.json';
import { inventoryPage } from '../pages/InventoryPage';
import { productDetailPage } from '../pages/ProductDetailPage';
import { cartPage } from '../pages/CartPage';
import { checkoutInfoPage } from '../pages/CheckoutInfoPage';
import { checkoutOverviewPage } from '../pages/CheckoutOverviewPage';
import { checkoutCompletePage } from '../pages/CheckoutCompletePage';
import { getProducts } from '../support/products';
import type { UserKey } from '../support/types';

type BugId = keyof typeof knownDefects;

interface KnownDefect {
  title: string;
  users: UserKey[];
  affectedProducts?: string[];
}

const defects = knownDefects as Record<BugId, KnownDefect>;
const { catalog, sortOptions, cartSelections } = products;
const { validCustomer } = checkoutData;

/**
 * Declares one test per affected user, titled and tagged with the bug id:
 * "[BUG-002] should ... (problem_user)".
 */
const defectTest = (bugId: BugId, behaviour: string, body: (bug: KnownDefect) => void) => {
  const bug = defects[bugId];
  bug.users.forEach((userKey) => {
    it(`[${bugId}] ${behaviour} (${users[userKey].username})`, { tags: `@${bugId}` }, () => {
      cy.login(userKey);
      body(bug);
    });
  });
};

describe('Known defects', { tags: '@known-defect', retries: 0 }, () => {
  beforeEach(() => {
    // error_user throws JavaScript errors on some actions. They are ignored
    // here so the test fails on the user-visible symptom (the assertion),
    // which is what the bug report describes.
    cy.on('uncaught:exception', () => false);
  });

  context('Inventory', () => {
    defectTest('BUG-001', 'should show the matching image for every product', () => {
      inventoryPage.visit();

      catalog.forEach((product) => {
        inventoryPage
          .item(product.name)
          .find('[data-test$="-img"]')
          .should('have.attr', 'src')
          .and('include', product.image);
      });
    });

    defectTest('BUG-002', 'should reorder the products when sorted by name Z to A', () => {
      inventoryPage.visit();

      inventoryPage.sortBy(sortOptions.nameDesc.value);

      inventoryPage.getDisplayedNames().should(
        'deep.equal',
        catalog.map((product) => product.name).sort((a, b) => b.localeCompare(a)),
      );
    });

    defectTest('BUG-005', 'should open the details of the product that was clicked', (bug) => {
      const [product] = getProducts(bug.affectedProducts ?? []);
      inventoryPage.visit();

      inventoryPage.openProduct(product.name);

      productDetailPage.name().should('have.text', product.name);
    });
  });

  context('Cart', () => {
    defectTest('BUG-003', 'should add every product to the cart from the inventory', (bug) => {
      const affected = bug.affectedProducts ?? [];
      inventoryPage.visit();

      affected.forEach((slug) => {
        inventoryPage.addToCart(slug);
        inventoryPage.removeButton(slug).should('be.visible');
      });
      inventoryPage.cartBadge().should('have.text', String(affected.length));
    });

    defectTest('BUG-004', 'should remove a product from the cart on the inventory page', (bug) => {
      const affected = bug.affectedProducts ?? [];
      cy.seedCart(affected);

      affected.forEach((slug) => inventoryPage.removeFromCart(slug));

      affected.forEach((slug) => inventoryPage.addToCartButton(slug).should('be.visible'));
      inventoryPage.cartBadge().should('not.exist');
    });
  });

  context('Checkout', () => {
    const openCheckoutForm = () => {
      cy.seedCart(cartSelections.single);
      inventoryPage.openCart();
      cartPage.checkout();
    };

    const typedValuesAreKept = () => {
      openCheckoutForm();

      checkoutInfoPage.fillForm(validCustomer);

      checkoutInfoPage.firstNameInput().should('have.value', validCustomer.firstName);
      checkoutInfoPage.lastNameInput().should('have.value', validCustomer.lastName);
      checkoutInfoPage.postalCodeInput().should('have.value', validCustomer.postalCode);
    };

    defectTest(
      'BUG-006',
      'should keep each typed value in its own customer information field',
      typedValuesAreKept,
    );

    defectTest(
      'BUG-007',
      'should keep each typed value in its own customer information field',
      typedValuesAreKept,
    );

    defectTest('BUG-008', 'should confirm the order when Finish is clicked', () => {
      openCheckoutForm();
      // BUG-007 leaves Last Name empty for error_user, but the form still
      // submits, so the overview page can be reached.
      checkoutInfoPage.fillAndContinue(validCustomer);
      cy.location('pathname').should('eq', checkoutOverviewPage.path);

      checkoutOverviewPage.finish();

      cy.location('pathname').should('eq', checkoutCompletePage.path);
      checkoutCompletePage.completeHeader().should('have.text', messages.checkoutComplete.header);
    });
  });
});
