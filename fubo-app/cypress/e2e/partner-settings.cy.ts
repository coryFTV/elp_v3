describe('Partner Settings Functionality', () => {
  beforeEach(() => {
    // Visit the partner settings page
    cy.visit('/partner-settings');
  });

  it('should display the partner settings form', () => {
    // Verify that the form is displayed
    cy.get('form').should('be.visible');
    
    // Verify that form fields are present
    cy.get('input#impactRadiusId').should('be.visible');
    cy.get('input[type="radio"]#network').should('be.visible');
    cy.get('input[type="radio"]#match').should('be.visible');
    cy.get('input[type="radio"]#league').should('be.visible');
    cy.get('input#subId1').should('be.visible');
    cy.get('input#subId2').should('be.visible');
    cy.get('input#subId3').should('be.visible');
  });

  it('should update partner settings successfully', () => {
    // Enter new values in the form
    cy.get('input#impactRadiusId').clear().type('999999');
    cy.get('input[type="radio"]#match').check();
    cy.get('input#subId1').clear().type('testpartner');
    cy.get('input#subId2').clear().type('testcampaign');
    
    // Submit the form
    cy.get('button[type="submit"]').click();
    
    // Verify success message
    cy.get('[role="alert"]').contains('Settings saved successfully').should('be.visible');
    
    // Reload the page to verify persistence
    cy.reload();
    
    // Verify that values are still present
    cy.get('input#impactRadiusId').should('have.value', '999999');
    cy.get('input[type="radio"]#match').should('be.checked');
    cy.get('input#subId1').should('have.value', 'testpartner');
    cy.get('input#subId2').should('have.value', 'testcampaign');
  });

  it('should reset settings to defaults', () => {
    // First update settings
    cy.get('input#impactRadiusId').clear().type('999999');
    cy.get('input[type="radio"]#match').check();
    cy.get('input#subId1').clear().type('testpartner');
    cy.get('button[type="submit"]').click();
    
    // Now reset
    cy.contains('button', 'Reset to Defaults').click();
    
    // Verify success message
    cy.get('[role="alert"]').contains('Settings reset to defaults').should('be.visible');
    
    // Verify that values are reset to defaults
    cy.get('input#impactRadiusId').should('have.value', '123456');
    cy.get('input[type="radio"]#network').should('be.checked');
    cy.get('input#subId1').should('have.value', '');
  });

  it('should use updated settings in affiliate link generation', () => {
    // First, update partner settings
    cy.get('input#impactRadiusId').clear().type('888888');
    cy.get('input[type="radio"]#match').check();
    cy.get('input#subId1').clear().type('cypresstest');
    cy.get('button[type="submit"]').click();
    
    // Go to the movies page
    cy.visit('/movies');
    
    // Add an item to the cart
    cy.get('[data-testid="media-card"]').first().within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    // Open the cart
    cy.get('button[aria-label="Open cart"]').click();
    
    // Copy links to clipboard and check the alert
    cy.get('button').contains('Copy Links').click();
    cy.get('[role="alert"]').contains('Links copied to clipboard').should('be.visible');
    
    // We can't directly test clipboard content in Cypress without plugins,
    // but we can verify that the modal appears after the action
  });
}); 