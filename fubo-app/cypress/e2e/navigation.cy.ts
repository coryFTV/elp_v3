describe('Navigation Tests', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/');
  });

  it('should navigate to the Sports Schedule page', () => {
    // Click on the Sports Schedule link in the sidebar
    cy.get('a').contains('Sports Schedule').click();
    
    // Verify the URL has changed to the Sports Schedule page
    cy.url().should('include', '/sports-schedule');
    
    // Verify some content on the Sports Schedule page
    cy.get('h1').should('contain', 'Sports Schedule');
  });

  it('should navigate to the Movies page', () => {
    // Click on the Movies link in the sidebar
    cy.get('a').contains('Movies').click();
    
    // Verify the URL has changed to the Movies page
    cy.url().should('include', '/movies');
    
    // Verify some content on the Movies page
    cy.get('h1').should('contain', 'Movies');
  });

  it('should navigate to the TV Series page', () => {
    // Click on the TV Series link in the sidebar
    cy.get('a').contains('TV Series').click();
    
    // Verify the URL has changed to the TV Series page
    cy.url().should('include', '/tv-series');
    
    // Verify some content on the TV Series page
    cy.get('h1').should('contain', 'TV Series');
  });

  it('should navigate to the Partner Settings page', () => {
    // Click on the Partner Settings link in the sidebar
    cy.get('a').contains('Partner Settings').click();
    
    // Verify the URL has changed to the Partner Settings page
    cy.url().should('include', '/partner-settings');
    
    // Verify some content on the Partner Settings page
    cy.get('h1').should('contain', 'Partner Settings');
  });

  it('should highlight the active link in the navigation', () => {
    // Click on the Movies link
    cy.get('a').contains('Movies').click();
    
    // Check that the Movies link has an active class or styling
    cy.get('a').contains('Movies').should('have.class', 'text-white');
    
    // Click on the TV Series link
    cy.get('a').contains('TV Series').click();
    
    // Check that the TV Series link has an active class or styling
    cy.get('a').contains('TV Series').should('have.class', 'text-white');
    
    // The Movies link should no longer be active
    cy.get('a').contains('Movies').should('not.have.class', 'text-white');
  });
}); 