describe('Login Flow E2E', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display login page correctly', () => {
    cy.get('h3').contains('Selamat Datang').should('be.visible');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('input[type="password"]').should('be.visible');
    cy.get('button').contains('Masuk').should('be.visible');
  });

  it('should show error when login fails', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 400,
      body: { message: 'Email atau password salah' }
    }).as('loginRequest');

    cy.get('input[type="email"]').type('wrong@email.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button').contains('Masuk').click();

    cy.wait('@loginRequest');
    cy.contains(/Request failed with status code 400|Email atau password salah/i).should('be.visible');
  });

  it('should redirect to home on successful login', () => {
    cy.intercept('POST', '**/login', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { token: 'fake-token' }
      }
    }).as('loginRequest');

    cy.intercept('GET', '**/users/me', {
      statusCode: 200,
      body: {
        status: 'success',
        message: 'ok',
        data: { user: { id: '1', name: 'Test User', email: 'test@email.com', avatar: '' } }
      }
    }).as('meRequest');

    cy.get('input[type="email"]').type('test@email.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button').contains('Masuk').click();

    cy.wait('@loginRequest');

    cy.url().should('eq', `${Cypress.config().baseUrl  }/`);
  });
});
