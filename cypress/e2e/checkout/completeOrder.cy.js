// cypress/e2e/checkout/completeOrder.cy.js

describe('End-to-End Checkout Flow', () => {
  beforeEach(() => {
    // Clear the downloads folder before each test to ensure a clean state for file validation.
    cy.task('clearDownloads');
    // Load user credentials and personal information.
    cy.fixture('user').as('userData');
    // Load product information, like the product to be added to the cart.
    cy.fixture('products').as('productData');
  });

  it('should allow a logged-in user to add a product to cart, proceed through checkout, and confirm the order including invoice download', function () {
    // Retrieve aliased fixture data.
    const user = this.userData;
    const products = this.productData;

    // --- Step 1: User Login ---
    cy.log('--- Test Step: Initiating User Login ---');
    cy.login(user.loginEmail, user.loginPassword);
    cy.log('--- Test Step: User Login Successful ---');

    // --- Step 2: Add Product to Cart ---
    cy.log(`--- Test Step: Adding product "${products.productToAddToCart}" to cart ---`);
    cy.addProductToCart(products.productToAddToCart);
    cy.get('.modal-content').should('not.be.visible');

    // --- Step 3: View Cart and Proceed to Checkout ---
    cy.log('--- Test Step: Navigating to Shopping Cart page ---');
    cy.visit('/view_cart');
    cy.url().should('include', '/view_cart');
    cy.get('.active', { timeout: 10000 })
      .should('contain.text', 'Shopping Cart')
      .and('be.visible');
    cy.contains('td.cart_description a', products.productToAddToCart)
      .should('be.visible');
    cy.log('--- Test Step: Proceeding to Checkout from Cart ---');
    cy.contains('a.btn', 'Proceed To Checkout').click();

    // --- Step 4: Checkout Page - Review Order and Place Order ---
    cy.log('--- Test Step: On Checkout page ---');
    cy.url().should('include', '/checkout');
    cy.contains('h2', 'Address Details').should('be.visible');
    cy.contains('h2', 'Review Your Order').should('be.visible');
    cy.get('.cart_description > h4 > a', { timeout: 6000 })
      .should('contain.text', products.productToAddToCart)
      .and('be.visible');
    cy.log('--- Test Step: Clicking "Place Order" ---');
    cy.contains('a.btn', 'Place Order').click();

    // --- Step 5: Payment Page - Fill Payment Details ---
    cy.log('--- Test Step: On Payment page ---');
    cy.url().should('include', '/payment');
    cy.get('.active', { timeout: 10000 })
      .should('contain.text', 'Payment')
      .and('be.visible');
    cy.log('--- Test Step: Filling payment card details ---');
    cy.get('input[data-qa="name-on-card"]').type(user.cardName, { delay: 50 });
    cy.get('input[data-qa="card-number"]').type(user.cardNumber, { delay: 50 });
    cy.get('input[data-qa="cvc"]').type(user.cardCVC, { delay: 50 });
    cy.get('input[data-qa="expiry-month"]').type(user.cardExpiryMonth, { delay: 50 });
    cy.get('input[data-qa="expiry-year"]').type(user.cardExpiryYear, { delay: 50 });

    // --- Step 6: Confirm Payment, Validate Success, Download and Verify Invoice ---
    cy.log('--- Test Step: Clicking "Pay and Confirm Order" ---');
    cy.get('button[data-qa="pay-button"]').click();

    cy.log('--- Test Step: Verifying order success messages ---');
    // Expect redirection to a payment confirmation page.
    // Increased timeout to account for potential processing delays.
    cy.url({ timeout: 20000 }).should('include', '/payment_done');
    // Verify the "ORDER PLACED!" success title.
    cy.get('[data-qa="order-placed"] > b', { timeout: 15000 })
      .should('be.visible')
      .and('have.text', 'Order Placed!'); // Exact text match, case-sensitive.
    // Verify the confirmation paragraph text.
    cy.contains('p', 'Congratulations! Your order has been confirmed!', { timeout: 10000 })
      .should('be.visible');

    cy.log('--- Test Step: Downloading and Verifying Invoice ---');
    // Click the "Download Invoice" button to initiate the file download.
    cy.contains('a.btn', 'Download Invoice').should('be.visible').click();

    // The site consistently names the downloaded file 'invoice.txt'.
    const downloadedInvoiceName = 'invoice.txt';
    // Construct the full path to the downloaded file within Cypress's downloads folder.
    const downloadedInvoicePath = `${Cypress.config('downloadsFolder')}/${downloadedInvoiceName}`;

    // Read the downloaded file and verify its content.
    cy.readFile(downloadedInvoicePath, { timeout: 15000 })
      .should('exist') // First, ensure the file has been downloaded.
      .then((invoiceContent) => {
        cy.log('--- Test Step: Invoice Content Verification ---');
        // Perform assertions on the invoice content.
        expect(invoiceContent).to.include('Hi First Name Last Name'); // user's name
        expect(invoiceContent).to.include('Your total purchase amount is 500'); // static amount
        expect(invoiceContent).to.include('Thank you');
      });

    // Click "Continue" to return to the homepage.
    cy.log('--- Test Step: Clicking "Continue" to return to homepage ---');
    cy.get('a[data-qa="continue-button"]').should('be.visible').click();
    // Assert that navigation returns to the application's base URL.
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.log('--- E2E Test: Checkout Flow Completed Successfully ---');
  });
});