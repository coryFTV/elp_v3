describe('Navigation', () => {
  it('should navigate to the home page', () => {
    // Start from the index page
    cy.visit('/');

    // Find a heading with "Welcome to"
    cy.get('h1').contains('Welcome to');
  });
}); 