import products from '../fixtures/products.json';
import { inventoryPage } from '../pages/InventoryPage';
import { productDetailPage } from '../pages/ProductDetailPage';
import { cartPage } from '../pages/CartPage';
import { getProducts } from '../support/products';

const { cartSelections } = products;
const [singleProduct] = getProducts(cartSelections.single);
const multipleProducts = getProducts(cartSelections.multiple);
const multipleNames = multipleProducts.map((product) => product.name);

const addAllToCart = (slugs: readonly string[]) => {
  slugs.forEach((slug) => inventoryPage.addToCart(slug));
};

describe('Cart', () => {
  beforeEach(() => {
    cy.login('standard');
    inventoryPage.visit();
  });

  context('Adding products', () => {
    it('should show 1 in the cart badge when a single product is added', { tags: '@smoke' }, () => {
      inventoryPage.cartBadge().should('not.exist');

      inventoryPage.addToCart(singleProduct.slug);

      inventoryPage.cartBadge().should('have.text', '1');
      inventoryPage.removeButton(singleProduct.slug).should('be.visible');
    });

    it('should list the same products as the badge count when several products are added', () => {
      addAllToCart(cartSelections.multiple);

      inventoryPage.cartBadge().should('have.text', String(multipleProducts.length));

      inventoryPage.openCart();

      cy.location('pathname').should('eq', cartPage.path);
      cartPage.items().should('have.length', multipleProducts.length);
      cartPage.getDisplayedNames().should('deep.equal', multipleNames);
      cartPage.getDisplayedPrices().should(
        'deep.equal',
        multipleProducts.map((product) => product.price),
      );
      cartPage.itemQuantities().each(($quantity) => {
        expect($quantity.text()).to.equal('1');
      });
    });
  });

  context('Removing products', () => {
    it('should update the badge and restore the add button when a product is removed from the inventory', () => {
      addAllToCart(cartSelections.multiple);
      const [removed] = multipleProducts;

      inventoryPage.removeFromCart(removed.slug);

      inventoryPage.cartBadge().should('have.text', String(multipleProducts.length - 1));
      inventoryPage.addToCartButton(removed.slug).should('be.visible');
      inventoryPage.openCart();
      cartPage.getDisplayedNames().should('not.include', removed.name);
    });

    it('should remove the product from the list and update the badge when it is removed from the cart', () => {
      addAllToCart(cartSelections.multiple);
      const [removed, ...remaining] = multipleProducts;
      inventoryPage.openCart();

      cartPage.removeFromCart(removed.slug);

      cartPage.items().should('have.length', remaining.length);
      cartPage.getDisplayedNames().should(
        'deep.equal',
        remaining.map((product) => product.name),
      );
      cartPage.cartBadge().should('have.text', String(remaining.length));
    });

    it('should hide the badge when the last product is removed from the cart', () => {
      inventoryPage.addToCart(singleProduct.slug);
      inventoryPage.openCart();

      cartPage.removeFromCart(singleProduct.slug);

      cartPage.items().should('not.exist');
      cartPage.cartBadge().should('not.exist');
    });
  });

  context('Persistence', () => {
    it('should keep the products in the cart when navigating between pages', () => {
      addAllToCart(cartSelections.multiple);
      const expectedCount = String(multipleProducts.length);

      // Inventory -> product detail
      inventoryPage.openProduct(singleProduct.name);
      productDetailPage.cartBadge().should('have.text', expectedCount);
      productDetailPage.removeButton().should('be.visible');

      // Product detail -> inventory
      productDetailPage.backToProducts();
      inventoryPage.cartBadge().should('have.text', expectedCount);

      // Inventory -> cart -> inventory -> cart
      inventoryPage.openCart();
      cartPage.getDisplayedNames().should('deep.equal', multipleNames);
      cartPage.continueShopping();
      cy.location('pathname').should('eq', inventoryPage.path);
      inventoryPage.cartBadge().should('have.text', expectedCount);

      // A full page reload must not empty the cart either
      cy.reload();
      inventoryPage.cartBadge().should('have.text', expectedCount);
      inventoryPage.openCart();
      cartPage.getDisplayedNames().should('deep.equal', multipleNames);
    });
  });
});
