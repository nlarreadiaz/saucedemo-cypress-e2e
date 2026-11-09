import users from '../fixtures/users.json';
import products from '../fixtures/products.json';
import messages from '../fixtures/messages.json';
import { inventoryPage } from '../pages/InventoryPage';
import { loginPage } from '../pages/LoginPage';
import { productDetailPage } from '../pages/ProductDetailPage';
import { TIMEOUTS } from '../support/constants';

const { catalog, sortOptions } = products;

const byNameAsc = (a: string, b: string) => a.localeCompare(b);
const byNameDesc = (a: string, b: string) => b.localeCompare(a);
const byNumberAsc = (a: number, b: number) => a - b;
const byNumberDesc = (a: number, b: number) => b - a;

// Expected values come from the fixture, an oracle independent from the page under test.
const catalogNames = catalog.map((product) => product.name);
const catalogPrices = catalog.map((product) => product.price);

describe('Inventory', () => {
  context('Standard user', () => {
    beforeEach(() => {
      cy.login('standard');
      inventoryPage.visit();
    });

    it(
      'should display every catalog product with its name, price and image when the inventory loads',
      { tags: '@smoke' },
      () => {
        inventoryPage.items().should('have.length', catalog.length);

        catalog.forEach((product) => {
          inventoryPage.item(product.name).within(() => {
            cy.get('[data-test="inventory-item-name"]').should('have.text', product.name);
            cy.get('[data-test="inventory-item-price"]').should(
              'have.text',
              `$${product.price.toFixed(2)}`,
            );
            cy.get('[data-test$="-img"]')
              .should('be.visible')
              .and('have.attr', 'src')
              .and('include', product.image);
          });
        });
      },
    );

    context('Sorting', () => {
      it('should list products alphabetically when sorted by name A to Z', () => {
        // A-Z is the default order, so sort Z-A first to prove the sort really changes the list.
        inventoryPage.sortBy(sortOptions.nameDesc.value);
        inventoryPage.sortBy(sortOptions.nameAsc.value);

        inventoryPage.activeSortOption().should('have.text', sortOptions.nameAsc.label);
        inventoryPage.getDisplayedNames().then((names) => {
          expect(names).to.deep.equal([...catalogNames].sort(byNameAsc));
        });
      });

      it('should list products in reverse alphabetical order when sorted by name Z to A', () => {
        inventoryPage.sortBy(sortOptions.nameDesc.value);

        inventoryPage.activeSortOption().should('have.text', sortOptions.nameDesc.label);
        inventoryPage.getDisplayedNames().then((names) => {
          expect(names).to.deep.equal([...catalogNames].sort(byNameDesc));
        });
      });

      it('should list products from cheapest to most expensive when sorted by price low to high', () => {
        inventoryPage.sortBy(sortOptions.priceAsc.value);

        inventoryPage.activeSortOption().should('have.text', sortOptions.priceAsc.label);
        inventoryPage.getDisplayedPrices().then((prices) => {
          expect(prices).to.deep.equal([...catalogPrices].sort(byNumberAsc));
        });
      });

      it('should list products from most expensive to cheapest when sorted by price high to low', () => {
        inventoryPage.sortBy(sortOptions.priceDesc.value);

        inventoryPage.activeSortOption().should('have.text', sortOptions.priceDesc.label);
        inventoryPage.getDisplayedPrices().then((prices) => {
          expect(prices).to.deep.equal([...catalogPrices].sort(byNumberDesc));
        });
      });
    });

    context('Product detail', () => {
      const [product] = catalog;

      it('should show the product details when a product is opened and return to the list when going back', () => {
        inventoryPage.openProduct(product.name);

        cy.location('pathname').should('eq', productDetailPage.path);
        productDetailPage.name().should('have.text', product.name);
        productDetailPage.description().should('have.text', product.description);
        productDetailPage.price().should('have.text', `$${product.price.toFixed(2)}`);
        productDetailPage.image().should('have.attr', 'src').and('include', product.image);

        productDetailPage.backToProducts();

        cy.location('pathname').should('eq', inventoryPage.path);
        inventoryPage.items().should('have.length', catalog.length);
      });
    });
  });

  context('Performance glitch user', () => {
    it('should finish logging in and load the inventory when the user is slow to authenticate', () => {
      loginPage.visit();
      loginPage.login(users.performanceGlitch.username, users.performanceGlitch.password);

      // This user is intentionally slow, so only these checks get a longer timeout.
      cy.location('pathname', { timeout: TIMEOUTS.slowLogin }).should('eq', inventoryPage.path);
      inventoryPage.pageTitle().should('have.text', messages.pageTitles.inventory);
      inventoryPage.items().should('have.length', catalog.length);
    });
  });
});
