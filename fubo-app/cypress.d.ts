/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Custom command to select DOM element by data-testid attribute.
     * @example cy.getByTestId('greeting')
     */
    getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
  }
} 