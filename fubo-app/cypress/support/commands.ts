/// <reference types="cypress" />

// Add a custom command to select elements by data-testid attribute
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Command to clear the cart for tests that require an empty cart
Cypress.Commands.add('clearCart', () => {
  cy.get('button[aria-label="Open cart"]').click();
  cy.get('body').then(($body) => {
    if ($body.find('[data-testid="empty-cart-message"]').length === 0) {
      // Cart has items, clear it
      cy.contains('button', 'Clear Cart').click();
    }
  });
  cy.get('button[aria-label="Close"]').click();
});

// Command to reset partner settings to defaults
Cypress.Commands.add('resetPartnerSettings', () => {
  cy.visit('/partner-settings');
  cy.contains('button', 'Reset to Defaults').click();
  // Wait for success message
  cy.get('[role="alert"]').contains('Settings reset to defaults').should('be.visible');
});

// Command to add an item to the cart
Cypress.Commands.add('addToCart', (itemIndex = 0) => {
  cy.get('[data-testid="media-card"]').eq(itemIndex).within(() => {
    cy.get('button').contains('Add to Cart').click();
  });
});

// Command to verify console logs don't have errors
Cypress.Commands.add('noConsoleErrors', () => {
  cy.window().then((win) => {
    // Create a spy for console.error
    cy.spy(win.console, 'error').as('consoleError');
  });
  
  // After the page interactions, check if console.error was called
  cy.get('@consoleError').then((spy) => {
    expect(spy).to.have.callCount(0);
  });
});

// Add these commands to the Cypress namespace
declare global {
  namespace Cypress {
    interface Chainable {
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
      clearCart(): void;
      resetPartnerSettings(): void;
      addToCart(itemIndex?: number): void;
      noConsoleErrors(): void;
    }
  }
} 