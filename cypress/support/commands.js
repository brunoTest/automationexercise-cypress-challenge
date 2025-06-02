// cypress/support/commands.js
// ***********************************************
// This file contains custom Cypress commands.
// Custom commands are a great way to abstract common sequences of actions
// into reusable functions, making tests cleaner and more maintainable.
//
// For more comprehensive examples of custom commands, please read:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * @memberof cy
 * @method login
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @description Custom command to log in a user.
 *              Navigates to the login page, fills in credentials,
 *              submits the form, and verifies successful login.
 */
Cypress.Commands.add('login', (email, password) => {
  cy.log(`Attempting login for user: ${email}`);
  cy.visit('/login');

  // Type credentials with a short delay to simulate human interaction
  // and improve stability on some applications.
  cy.get('input[data-qa="login-email"]').type(email, { delay: 50 });
  cy.get('input[data-qa="login-password"]').type(password, { delay: 50 });

  cy.get('button[data-qa="login-button"]').click();

  // Basic verification for successful login:
  // Check for "Logged in as" text, which indicates successful authentication.
  // Increased timeout to handle potential page load delays.
  cy.contains('Logged in as', { timeout: 10000 }).should('be.visible');
  cy.log(`User ${email} logged in successfully.`);
});

/**
 * @memberof cy
 * @method addProductToCart
 * @param {string} productName - The name of the product to add to the cart.
 * @description Custom command to navigate to the products page,
 *              find a specific product by name, add it to the cart,
 *              and handle the "Added!" confirmation modal.
 */
Cypress.Commands.add('addProductToCart', (productName) => {
  cy.log(`--- Adding product: "${productName}" to cart ---`);

  // Navigate to the main products listing page.
  cy.visit('/products');
  // Ensure the "All Products" page title is visible, confirming page load.
  cy.contains('h2', 'All Products').should('be.visible');

  // Locate the product card containing the specified product name.
  // This site has ads; selectors aim for resilience. Scroll may be needed.
  // Increased timeout for product visibility due to potential lazy loading or slow rendering.
  cy.contains('.single-products .productinfo p', productName, { timeout: 10000 })
    .should('be.visible') // Assert the product name itself is visible.
    .parents('.single-products') // Traverse up to the main product container.
    .find('a.add-to-cart') // Find the "Add to cart" button within this product's container.
    .first() // In case of multiple matching "Add to cart" links (e.g., one for hover), take the first.
    .click({ force: true }); // Use {force: true} as a precaution if ads partially obscure the button.

  // Wait for and handle the "Added!" confirmation modal.
  cy.log('--- Waiting for "Added!" confirmation modal ---');
  // Verify the modal title.
  cy.get('.modal-content .modal-header h4', { timeout: 10000 })
    .should('be.visible')
    .and('contain.text', 'Added!');

  // Verify the modal body content.
  cy.contains('.modal-body', 'Your product has been added to cart.').should('be.visible');

  // Click "Continue Shopping" to dismiss the modal.
  cy.get('.modal-footer button.btn').contains('Continue Shopping').click();
  cy.log(`--- Product "${productName}" added to cart and modal closed ---`);
});