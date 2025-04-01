describe('Update Test Cases', () => {
  function loginAndNavigateToDetail(postcode) {
    cy.viewport(1900, 1020);
    cy.visit('https://portal.dfn-bs-qc.infodation.com/');

    cy.get('#username').type('PA-SA@gmail.com');
    cy.get('#txtPassword').type('Phuonganh-2003', { log: false });
    cy.contains('Inloggen').click();
    cy.contains('button', 'Ga verder').click();
    cy.url().should('include', '/totp-input');

    cy.visit('https://mailhog.dfn-bs-qc.infodation.com/');
    cy.get('div.col-md-3.col-sm-4', { timeout: 15000 }).contains('DFN-Bouwstraat').click();

    cy.get('body', { timeout: 10000 }).invoke('text').then((text) => {
      const otpMatch = text.match(/\d{6}/);
      if (otpMatch) {
        cy.wrap(otpMatch[0]).as('otpCode');
      } else {
        throw new Error('Không tìm thấy mã OTP');
      }
    });

    cy.get('@otpCode').then((otp) => {
      cy.visit('https://portal.dfn-bs-qc.infodation.com/totp-input');
      cy.get('input.form-control.text-center', { timeout: 10000 })
        .should('have.length', 6)
        .each(($el, index) => {
          cy.wrap($el).type(otp[index], { delay: 100 });
        });
      cy.contains('button', 'Inloggen', { timeout: 5000 }).click();
    });

    cy.contains('a', 'Aansluitingen', { timeout: 10000 }).click();
    cy.get('input[name="postalCode"]', { timeout: 5000 }).type(postcode);
    cy.contains('button', 'Zoeken', { timeout: 5000 }).click();

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7) // Đảm bảo danh sách có đúng 7 phần tử
      .should('be.visible')
      .as('detailButtons');
  }

  it('should allow claiming when Projectstatus is allowed', () => {
    loginAndNavigateToDetail('2003PA');

    cy.get('@detailButtons').first().as('selectedButton');
    
    cy.get('@selectedButton').scrollIntoView().click({ force: true });
    const allowedStatuses = ['Vraag bundeling', 'Bouw fase', 'On hold', 'x-Wave', 'Beheer fase'];

    cy.get('td:contains("Projectstatus")', { timeout: 10000 })
      .should('exist')
      .next()
      .invoke('text')
      .then((status) => {
        const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();
        cy.log('Actual Projectstatus:', cleanedStatus);

        if (allowedStatuses.map(s => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
          cy.log('Status allows claiming:', cleanedStatus);
          cy.get('button.mat-menu-trigger.mat-icon-button', { timeout: 10000 }).click();
          cy.contains('div.mat-menu-item', 'Claim (V2)').click();
          cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
          cy.contains('span.mat-option-text', 'Caiway').click();
          cy.contains('button', 'Opslaan').click();
          cy.log('Claimed successfully.');
        } else {
          cy.log(`Test case expects a status that allows claiming, but got "${status.trim()}"`);
        }
      });
  });

  it('should block claiming when Projectstatus is Vraag bundeling', () => {
    loginAndNavigateToDetail('2003PA');

    cy.get('@detailButtons').eq(6).scrollIntoView().should('be.visible').click({ force: true });

    cy.get('td:contains("Projectstatus")', { timeout: 10000 })
      .should('exist')
      .next()
      .invoke('text')
      .then((status) => {
        const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();
        cy.log('Actual Projectstatus:', cleanedStatus);

        if (cleanedStatus === 'vraagbundeling') {
          cy.get('button.mat-menu-trigger.mat-icon-button').should('not.exist');
          cy.log('Claim button is not available as expected. Test passed.');
        } else {
          cy.log(`Test case expects status Vraag bundeling, but got "${status.trim()}"`);
        }
      });
  });
});