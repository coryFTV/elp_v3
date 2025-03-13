describe('Cart Functionality', () => {
  beforeEach(() => {
    // Visit the movies page where we can add items to cart
    cy.visit('/movies');
    
    // Clear cart if any items exist
    cy.get('button[aria-label="Open cart"]').click();
    cy.get('body').then(($body) => {
      if ($body.find('button[aria-label="Remove from cart"]').length > 0) {
        cy.get('button[aria-label="Clear cart"]').click();
      }
    });
    cy.get('button[aria-label="Close"]').click();
  });

  it('should add an item to the cart', () => {
    // Find the first movie card and click the "Add to Cart" button
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Verify that the cart badge shows 1 item
    cy.get('button[aria-label="Open cart"]').find('span').should('contain', '1');
  });

  it('should open the cart modal and display added items', () => {
    // Add a movie to the cart
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Open the cart
    cy.get('button[aria-label="Open cart"]').click();
    
    // Verify that the cart modal is open and contains the item
    cy.get('[data-testid="cart-modal"]').should('be.visible');
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });

  it('should remove an item from the cart', () => {
    // Add a movie to the cart
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Open the cart
    cy.get('button[aria-label="Open cart"]').click();
    
    // Remove the item
    cy.get('button[aria-label="Remove from cart"]').click();
    
    // Verify that the cart is empty
    cy.get('[data-testid="empty-cart-message"]').should('be.visible');
  });

  it('should enforce a maximum of 5 items in the cart', () => {
    // Add 5 items to the cart
    for (let i = 0; i < 5; i++) {
      cy.get('[data-testid="media-card"]').eq(i).within(() => {
        cy.get('button').contains('Add to Cart').click();
      });
    }
    
    // Verify that the cart has 5 items
    cy.get('button[aria-label="Open cart"]').find('span').should('contain', '5');
    
    // Try to add a 6th item
    cy.get('[data-testid="media-card"]').eq(5).within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Verify that the cart still has only 5 items
    cy.get('button[aria-label="Open cart"]').find('span').should('contain', '5');
  });

  it('should export cart items as CSV', () => {
    // Add an item to the cart
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Open the cart
    cy.get('button[aria-label="Open cart"]').click();
    
    // Click the export button
    cy.get('button').contains('Download CSV').click();
    
    // Since we can't directly test file downloads in Cypress without plugins,
    // we'll verify that a success message appears
    cy.get('[role="alert"]').contains('CSV file downloaded successfully').should('be.visible');
  });

  it('should copy links to clipboard', () => {
    // Add an item to the cart
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Open the cart
    cy.get('button[aria-label="Open cart"]').click();
    
    // Click the copy button
    cy.get('button').contains('Copy Links').click();
    
    // Verify that a success message appears
    cy.get('[role="alert"]').contains('Links copied to clipboard').should('be.visible');
  });
}); 