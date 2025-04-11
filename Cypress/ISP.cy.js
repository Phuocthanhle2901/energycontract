describe('ISP Claim Test Cases', () => {
  beforeEach(() => {
    cy.session('isp-login', () => {
      cy.viewport(1600, 800);
      cy.visit('https://portal.dfn-bs-qc.infodation.com/');

      cy.get('#username').type('PA-ISP@gmail.com');
      cy.get('#txtPassword').type('Phuonganh-2003', { log: false });
      cy.contains('Inloggen').click();
      cy.contains('button', 'Ga verder').click();

      cy.request('http://mailhog.dfn-bs-qc.infodation.com/api/v2/messages').then((response) => {
        const latestMessage = response.body.items[0]; // Get the latest message
        const otpCode = latestMessage.Content.Body.match(/\d{6}/)?.[0]; // Extract the OTP code
        expect(otpCode).to.exist;

        cy.visit('https://portal.dfn-bs-qc.infodation.com/totp-input');
        otpCode.split('').forEach((digit, index) => {
          cy.get(`input.form-control.text-center:eq(${index})`).type(digit);
        });
        cy.contains('button', 'Inloggen').click();
        cy.url().should('include', '/aansluiting');
      });
    });

    cy.viewport(1600, 800);
    cy.visit('https://portal.dfn-bs-qc.infodation.com/aansluiting');
  });
    
    // Testcase 1: ISP can claim in area status 4
    it('ISP can claim in area status 4', () => {
      cy.visit('https://portal.dfn-bs-qc.infodation.com/aansluiting');
      cy.contains('a', 'Aansluitingen').click({ force: true });
      cy.get('input[name="postalCode"]').clear().type('2003PA');
      cy.get('button').contains('Zoeken').click({ force: true });
  
      cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 6)
      .eq(3)
      .click({ force: true });
    
      // Check project status
      cy.get('td:contains("Projectstatus")')
        .next()
        .invoke('text')
        .then((statusText) => {
          const status = statusText.trim();
          if (status !== 'Bouw fase') {
            cy.log('Status not allowed for claiming.');
            return;
          }
    
          // Open menu
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('body').then(($body) => {
            if ($body.find('div.mat-menu-item:contains("Unclaim")').length > 0) {
              cy.log('Already claimed. Unclaiming first');
              cy.contains('div.mat-menu-item', 'Unclaim (V2)').click();
              cy.wait(2000);
    
              // Reopen the menu after unclaim
              cy.get('button.mat-menu-trigger.mat-icon-button').click();
            } else {
              cy.log('Not yet claimed. Proceeding to claim.');
            }

            cy.contains('div.mat-menu-item', 'Claim (V2)').click();
            cy.get('input[formcontrolname="title"]').type('abc4');
            cy.get('input[formcontrolname="firstName"]').type('abc4');
            cy.get('input[formcontrolname="intercalation"]').type('abc4');
            cy.get('input[formcontrolname="lastName"]').type('abc4');
            cy.get('input[formcontrolname="email"]').type('abc4@gmail.com');
            cy.get('input[formcontrolname="companyName"]').type('ABC4');
            cy.get('input[formcontrolname="phoneNumber"]').type('0123456789');
            cy.get('input[formcontrolname="phoneNumber2"]').type('9876543210');
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        });
    });

    // Testcase 2: ISP can claim in area status 5
    it('ISP can claim in area status 5', () => {
      cy.visit('https://portal.dfn-bs-qc.infodation.com/aansluiting');
      cy.contains('a', 'Aansluitingen').click({ force: true });
      cy.get('input[name="postalCode"]').clear().type('2003PA');
      cy.get('button').contains('Zoeken').click({ force: true });
  
      cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 6)
      .eq(2)
      .click({ force: true });
    
      // Check project status
      cy.get('td:contains("Projectstatus")')
        .next()
        .invoke('text')
        .then((statusText) => {
          const status = statusText.trim();
          if (status !== 'On hold') {
            cy.log('Status not allowed for claiming.');
            return;
          }
    
          // Open menu
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('body').then(($body) => {
            if ($body.find('div.mat-menu-item:contains("Unclaim")').length > 0) {
              cy.log('Already claimed. Unclaiming first');
              cy.contains('div.mat-menu-item', 'Unclaim (V2)').click();
              cy.wait(2000);
    
              // Reopen the menu after unclaim
              cy.get('button.mat-menu-trigger.mat-icon-button').click();
            } else {
              cy.log('Not yet claimed. Proceeding to claim.');
            }

            cy.contains('div.mat-menu-item', 'Claim (V2)').click();
            cy.get('input[formcontrolname="title"]').type('abc5');
            cy.get('input[formcontrolname="firstName"]').type('abc5');
            cy.get('input[formcontrolname="intercalation"]').type('abc5');
            cy.get('input[formcontrolname="lastName"]').type('abc5');
            cy.get('input[formcontrolname="email"]').type('abc5@gmail.com');
            cy.get('input[formcontrolname="companyName"]').type('ABC5');
            cy.get('input[formcontrolname="phoneNumber"]').type('0123456789');
            cy.get('input[formcontrolname="phoneNumber2"]').type('9876543210');
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        });
    });

    // Testcase 3: ISP can claim in area status 6
    it('ISP can claim in area status 6', () => {
      cy.visit('https://portal.dfn-bs-qc.infodation.com/aansluiting');
      cy.contains('a', 'Aansluitingen').click({ force: true });
      cy.get('input[name="postalCode"]').clear().type('2003PA');
      cy.get('button').contains('Zoeken').click({ force: true });
  
      cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 6)
      .eq(1)
      .click({ force: true });
    
      // Check project status
      cy.get('td:contains("Projectstatus")')
        .next()
        .invoke('text')
        .then((statusText) => {
          const status = statusText.trim();
          if (status !== 'x-Wave') {
            cy.log('Status not allowed for claiming.');
            return;
          }
    
          // Open menu
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('body').then(($body) => {
            if ($body.find('div.mat-menu-item:contains("Unclaim")').length > 0) {
              cy.log('Already claimed. Unclaiming first');
              cy.contains('div.mat-menu-item', 'Unclaim (V2)').click();
              cy.wait(2000);
    
              // Reopen the menu after unclaim
              cy.get('button.mat-menu-trigger.mat-icon-button').click();
            } else {
              cy.log('Not yet claimed. Proceeding to claim.');
            }

            cy.contains('div.mat-menu-item', 'Claim (V2)').click();
            cy.get('input[formcontrolname="title"]').type('abc6');
            cy.get('input[formcontrolname="firstName"]').type('abc6');
            cy.get('input[formcontrolname="intercalation"]').type('abc6');
            cy.get('input[formcontrolname="lastName"]').type('abc6');
            cy.get('input[formcontrolname="email"]').type('abc6@gmail.com');
            cy.get('input[formcontrolname="companyName"]').type('ABC6');
            cy.get('input[formcontrolname="phoneNumber"]').type('0123456789');
            cy.get('input[formcontrolname="phoneNumber2"]').type('9876543210');
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        });
    });

    // Testcase 4: ISP cannot claim in area status 8
    it('ISP cannot claim in area status 8', () => {
      cy.visit('https://portal.dfn-bs-qc.infodation.com/aansluiting');
      cy.contains('a', 'Aansluitingen').click({ force: true });
      cy.get('input[name="postalCode"]').clear().type('2003PA');
      cy.get('button').contains('Zoeken').click({ force: true });
  
      cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 6)
      .eq(0)
      .click({ force: true });
    });

    // Testcase 6: ISP cannot claim in area status 3
    it('ISP cannot claim in area status 3', () => {
      cy.visit('https://portal.dfn-bs-qc.infodation.com/aansluiting');
      cy.contains('a', 'Aansluitingen').click({ force: true });
      cy.get('input[name="postalCode"]').clear().type('2003PA');
      cy.get('button').contains('Zoeken').click({ force: true });
  
      cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 6)
      .eq(4)
      .click({ force: true });
    
      // Check project status
      cy.get('td:contains("Projectstatus")')
        .next()
        .invoke('text')
        .then((statusText) => {
          const status = statusText.trim();
          if (status !== 'Vraag bundeling niet gehaald') {
            cy.log('Status not allowed for claiming.');
            return;
          }
    
          // Open menu
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('body').then(($body) => {
            cy.contains('div.mat-menu-item', 'Claim (V2)').click();
            cy.get('input[formcontrolname="title"]').type('abc3');
            cy.get('input[formcontrolname="firstName"]').type('abc3');
            cy.get('input[formcontrolname="intercalation"]').type('abc3');
            cy.get('input[formcontrolname="lastName"]').type('abc3');
            cy.get('input[formcontrolname="email"]').type('abc3@gmail.com');
            cy.get('input[formcontrolname="companyName"]').type('ABC3');
            cy.get('input[formcontrolname="phoneNumber"]').type('0123456789');
            cy.get('input[formcontrolname="phoneNumber2"]').type('9876543210');
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        });
    });

    // Testcase 5: ISP cannot claim in area status 1
    it('ISP cannot claim in area status 1', () => {
      cy.visit('https://portal.dfn-bs-qc.infodation.com/aansluiting');
      cy.contains('a', 'Aansluitingen').click({ force: true });
      cy.get('input[name="postalCode"]').clear().type('2003PA');
      cy.get('button').contains('Zoeken').click({ force: true });
  
      cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 6)
      .eq(5)
      .click({ force: true });
    
      // Check project status
      cy.get('td:contains("Projectstatus")')
        .next()
        .invoke('text')
        .then((statusText) => {
          const status = statusText.trim();
          if (status !== 'Voorbereidings fase') {
            cy.log('Status not allowed for claiming.');
            return;
          }
    
          // Open menu
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('body').then(($body) => {
            cy.contains('div.mat-menu-item', 'Claim (V2)').click();
            cy.get('input[formcontrolname="title"]').type('abc1');
            cy.get('input[formcontrolname="firstName"]').type('abc1');
            cy.get('input[formcontrolname="intercalation"]').type('abc1');
            cy.get('input[formcontrolname="lastName"]').type('abc1');
            cy.get('input[formcontrolname="email"]').type('abc1@gmail.com');
            cy.get('input[formcontrolname="companyName"]').type('ABC1');
            cy.get('input[formcontrolname="phoneNumber"]').type('0123456789');
            cy.get('input[formcontrolname="phoneNumber2"]').type('9876543210');
            cy.get('button').contains('Opslaan').click();
            cy.wait(3000);
          });
        });
    });
});
