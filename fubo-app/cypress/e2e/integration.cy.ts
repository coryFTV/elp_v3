describe('End-to-End User Flow', () => {
  it('should complete a full user journey', () => {
    // Start by configuring partner settings
    cy.visit('/partner-settings');
    
    // Configure partner settings
    cy.get('input#impactRadiusId').clear().type('567890');
    cy.get('input[type="radio"]#league').check();
    cy.get('input#subId1').clear().type('e2e-test');
    cy.get('button[type="submit"]').click();
    
    // Verify settings were saved
    cy.get('[role="alert"]').contains('Settings saved successfully').should('be.visible');
    
    // Navigate to sports schedule
    cy.visit('/sports-schedule');
    
    // Add a match to the cart
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Verify cart badge shows 1 item
    cy.get('button[aria-label="Open cart"]').find('span').should('contain', '1');
    
    // Navigate to movies
    cy.get('a').contains('Movies').click();
    
    // Add a movie to the cart
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Verify cart badge shows 2 items
    cy.get('button[aria-label="Open cart"]').find('span').should('contain', '2');
    
    // Navigate to TV series
    cy.get('a').contains('TV Series').click();
    
    // Add a TV series to the cart
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Verify cart badge shows 3 items
    cy.get('button[aria-label="Open cart"]').find('span').should('contain', '3');
    
    // Open the cart
    cy.get('button[aria-label="Open cart"]').click();
    
    // Verify cart items
    cy.get('[data-testid="cart-item"]').should('have.length', 3);
    
    // Export as CSV
    cy.get('button').contains('Download CSV').click();
    cy.get('[role="alert"]').contains('CSV file downloaded successfully').should('be.visible');
    
    // Copy links
    cy.get('button').contains('Copy Links').click();
    cy.get('[role="alert"]').contains('Links copied to clipboard').should('be.visible');
    
    // Remove an item
    cy.get('button[aria-label="Remove from cart"]').first().click();
    
    // Verify cart now has 2 items
    cy.get('[data-testid="cart-item"]').should('have.length', 2);
    
    // Close the cart
    cy.get('button[aria-label="Close"]').click();
    
    // Return to partner settings and reset
    cy.visit('/partner-settings');
    cy.contains('button', 'Reset to Defaults').click();
    
    // Verify settings were reset
    cy.get('[role="alert"]').contains('Settings reset to defaults').should('be.visible');
  });
  
  it('should handle errors gracefully', () => {
    // Check that the app doesn't crash with invalid URLs
    cy.visit('/nonexistent-page', { failOnStatusCode: false });
    
    // We should see a 404 page or redirect to home
    cy.get('body').should('exist');
    
    // Try adding more than 5 items
    cy.visit('/movies');
    
    // Add 5 items
    for (let i = 0; i < 5; i++) {
      cy.get('[data-testid="media-card"]').eq(i).within(() => {
        cy.get('button').contains('Add to Cart').click();
      });
    }
    
    // Try adding a 6th
    cy.get('[data-testid="media-card"]').eq(5).within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Cart should still have 5 items
    cy.get('button[aria-label="Open cart"]').find('span').should('contain', '5');
    
    // Clear cart
    cy.get('button[aria-label="Open cart"]').click();
    cy.get('button').contains('Clear Cart').click();
    cy.get('button[aria-label="Close"]').click();
  });
}); 