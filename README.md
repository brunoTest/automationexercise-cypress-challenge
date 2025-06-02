# AutomationExercise.com - Cypress E2E Test Project

This project contains an End-to-End (E2E) automated test scenario for the website [https://www.automationexercise.com](https://www.automationexercise.com), developed as part of a technical challenge. The primary scenario covers user login, adding a product to the cart, and completing the checkout process including payment confirmation and an attempt to download the invoice.

## 🤖 Technology Stack

*   **Cypress:** JavaScript End-to-End Testing Framework
*   **JavaScript:** Programming language for test scripts
*   **Node.js:** JavaScript runtime environment
*   **npm:** Node package manager

## 📋 Prerequisites

Before running the tests, ensure you have the following installed:

*   [Node.js](https://nodejs.org/) (LTS version recommended, e.g., v16.x, v18.x or later)
*   npm (comes bundled with Node.js) or Yarn

## ⚙️ Setup and Installation

1.  **Clone the repository (if applicable) or download and extract the project files.**
    ```bash
    # If cloning from Git:
    # git clone <repository-url>
    # cd <repository-name>
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd path/to/your/cypress-automationexercise
    ```

3.  **Install project dependencies:**
    ```bash
    npm install
    ```
    *(This will install Cypress and any other dependencies listed in `package.json`)*

4.  **Configure User Credentials:**
    *   Open the file `cypress/fixtures/user.json`.
    *   Update the `loginEmail` and `loginPassword` fields with valid credentials for a **pre-registered user** on [https://www.automationexercise.com](https://www.automationexercise.com). The other fields in `user.json` are used for a simulated payment process.

## ▶️ Running the Tests

You can run the Cypress tests in two main ways:

1.  **Interactively with the Cypress Test Runner:**
    *   This opens the Cypress application, allowing you to see the tests run step-by-step in a browser, debug, and select specific tests.
    ```bash
    npx cypress open
    ```
    *   Once the Test Runner window opens:
        *   Choose "E2E Testing".
        *   Select your preferred browser (e.g., Chrome, Electron).
        *   Click on the `completeOrder.cy.js` spec file (located under `checkout/`) to run the test.

2.  **In Headless Mode (via command line):**
    *   This runs all tests found by the `specPattern` in `cypress.config.js` without opening a browser UI. Results will be displayed in the terminal. This is typically used for CI/CD pipelines.
    ```bash
    npx cypress run
    ```
    *(You can also run specific specs: `npx cypress run --spec "cypress/e2e/checkout/completeOrder.cy.js"`)*

## 📂 Project Structure

*   `cypress/`
    *   `e2e/checkout/completeOrder.cy.js`: The main E2E test script.
    *   `fixtures/`: Contains test data files.
        *   `user.json`: User credentials and payment information.
        *   `products.json`: Product data used in tests.
    *   `support/`: Contains reusable custom commands and global configurations.
        *   `commands.js`: Custom Cypress commands (e.g., `cy.login()`, `cy.addProductToCart()`).
        *   `e2e.js`: Global support file, imports commands and can handle global Cypress events.
    *   `downloads/`: Default folder where downloaded files (like `invoice.txt`) are saved by Cypress. *(This folder is in .gitignore)*
    *   `screenshots/`: Automatically created by Cypress on test failure (if configured). *(This folder is in .gitignore)*
    *   `videos/`: Automatically created by Cypress when running tests headlessly (if configured). *(This folder is in .gitignore)*
*   `cypress.config.js`: Main Cypress configuration file.
*   `.gitignore`: Specifies intentionally untracked files that Git should ignore.
*   `package.json`: Project metadata and dependencies.

## 📝 Test Scenario Covered

The primary E2E test (`completeOrder.cy.js`) covers the following flow:
1.  User logs into the application.
2.  User navigates to the products page and adds a specified product to the cart.
3.  User proceeds to the shopping cart, verifies the product, and continues to checkout.
4.  User confirms address and order details on the checkout page and proceeds to payment.
5.  User fills in (simulated) payment card details.
6.  User confirms the payment.
7.  The test verifies the "Order Placed!" success message.
8.  The test attempts to download the invoice and verifies its (placeholder) content.
9.  User clicks "Continue" to return to the homepage.

## 🐛 Notes on `automationexercise.com`

*   The website `automationexercise.com` frequently displays third-party advertisements that can sometimes interfere with test execution (e.g., by overlaying elements). The tests include strategies to mitigate this (e.g., `force: true` on clicks, ignoring uncaught exceptions from ad scripts), but flakiness due to ads can still occur.
*   The downloaded `invoice.txt` from the site contains placeholder data rather than the actual user or order details. The test assertions for the invoice content reflect this behavior.

---