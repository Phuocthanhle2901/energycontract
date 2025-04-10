describe('SA Claim Test Cases', () => {
  beforeEach(() => {
    // Set up a session for ISP login
    cy.session('sa-login', () => {
      cy.viewport(1600, 800);
      cy.visit('https://portal.dfn-bs-qc.infodation.com/');
  
      // Log in to the portal
      cy.get('#username').type('PA-SA@gmail.com');
      cy.get('#txtPassword').type('Phuonganh-2003', { log: false });
      cy.contains('Inloggen').click();
      cy.contains('button', 'Ga verder').click();
  
      // Fetch the latest OTP from the email
      cy.request('http://mailhog.dfn-bs-qc.infodation.com/api/v2/messages').then((response) => {
        const latestMessage = response.body.items[0]; // Get the latest message
        const otpCode = latestMessage.Content.Body.match(/\d{6}/)?.[0]; // Extract the OTP code
        expect(otpCode).to.exist;
  
        // Enter the OTP on the portal
        cy.visit('https://portal.dfn-bs-qc.infodation.com/totp-input');
        otpCode.split('').forEach((digit, index) => {
          cy.get(`input.form-control.text-center:eq(${index})`).type(digit);
        });
        cy.contains('button', 'Inloggen').click();
        cy.url().should('include', '/home?tab=Sales');
      });
    });
  
    // Navigate to the correct page after login
    cy.viewport(1600, 800);
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
  });


  // TC1: SA can claim in area status 2
  it('TC1: SA can claim in area status 2', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.get('button').contains('Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(5)
      .click({ force: true });

      // Check project status
      cy.get('td:contains("Projectstatus")')
      .next()
      .invoke('text')
      .then((statusText) => {
        const status = statusText.trim();
        if (status !== 'Vraag bundeling') {
          cy.log('Status not allowed for claiming.');
          return;
        }
  
        // Open menu
        cy.get('button.mat-menu-trigger.mat-icon-button').click();
        cy.wait(500); // wait for menu to load

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
            cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
            cy.contains('span.mat-option-text', 'MTXD').click();
              cy.get('input[formcontrolname="title"]').type('abc2');
              cy.get('input[formcontrolname="firstName"]').type('abc2');
              cy.get('input[formcontrolname="intercalation"]').type('abc2');
              cy.get('input[formcontrolname="lastName"]').type('abc2');
              cy.get('input[formcontrolname="email"]').type('abc2@gmail.com');
              cy.get('input[formcontrolname="companyName"]').type('ABC2');
              cy.get('input[formcontrolname="phoneNumber"]').type('0123456789');
              cy.get('input[formcontrolname="phoneNumber2"]').type('9876543210');
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        })
      })

  // TC2: SA can claim in area status 4
  it('TC2: SA can claim in area status 4', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.get('button').contains('Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(3)
      .click({ force: true });

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
          cy.wait(500); // wait for menu to load

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
            cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
            cy.contains('span.mat-option-text', 'MTXD').click();
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

  // TC3: SA can claim in area status 5
  it('TC3: SA can claim in area status 5', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.get('button').contains('Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(2)
      .click({ force: true });

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
        cy.wait(500); // wait for menu to load

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
            cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
            cy.contains('span.mat-option-text', 'MTXD').click();
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

  // TC4: SA can claim in area status 6
  it('TC4: SA can claim in area status 6', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.get('button').contains('Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(1)
      .click({ force: true });

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
        cy.wait(500); 

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
            cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
            cy.contains('span.mat-option-text', 'MTXD').click();
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

  // TC5: SA can claim in area status 8
  it('TC5: SA can claim in area status 8', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.get('button').contains('Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(0)
      .click({ force: true });

      cy.get('td:contains("Projectstatus")')
      .next()
      .invoke('text')
      .then((statusText) => {
        const status = statusText.trim();
        if (status !== 'Beheer fase') {
          cy.log('Status not allowed for claiming.');
          return;
        }
  
        // Open menu
        cy.get('button.mat-menu-trigger.mat-icon-button').click();
        cy.wait(500); 

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
            cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
            cy.contains('span.mat-option-text', 'MTXD').click();
              cy.get('input[formcontrolname="title"]').type('abc8');
              cy.get('input[formcontrolname="firstName"]').type('abc8');
              cy.get('input[formcontrolname="intercalation"]').type('abc8');
              cy.get('input[formcontrolname="lastName"]').type('abc8');
              cy.get('input[formcontrolname="email"]').type('abc8@gmail.com');
              cy.get('input[formcontrolname="companyName"]').type('ABC8');
              cy.get('input[formcontrolname="phoneNumber"]').type('0123456789');
              cy.get('input[formcontrolname="phoneNumber2"]').type('9876543210');
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        });
    });

  // TC6: SA cannot claim in area status 1
  it('TC6: SA cannot claim in area status 1', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.get('button').contains('Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(6)
      .click({ force: true });

      cy.get('td:contains("Projectstatus")')
      .next()
      .invoke('text')
      .then((statusText) => {
        const status = statusText.trim();
        if (status !== 'Voorbereidings fase') {
          cy.log('Status not allowed for claiming.');
          return;
        }

        cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.wait(3000);

          cy.get('body').then(($body) => {
          cy.contains('div.mat-menu-item', 'Claim (V2)', { timeout: 10000 }).click();
          cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
          cy.contains('span.mat-option-text', 'MTXD').click();
            cy.get('input[formcontrolname="title"]').type('abc1');
            cy.get('input[formcontrolname="firstName"]').type('abc1');
            cy.get('input[formcontrolname="intercalation"]').type('abc1');
            cy.get('input[formcontrolname="lastName"]').type('abc1');
            cy.get('input[formcontrolname="email"]').type('abc1@gmail.com');
            cy.get('input[formcontrolname="companyName"]').type('ABC1');
            cy.get('input[formcontrolname="phoneNumber"]').type('0123456789');
            cy.get('input[formcontrolname="phoneNumber2"]').type('9876543210');
          cy.contains('button', 'Opslaan').click();
          cy.wait(3000);
        
      });
  });
})
  // TC7: SA cannot claim in area status 3
  it('TC7: SA cannot claim in area status 3', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.get('button').contains('Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(4)
      .click({ force: true });

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
          cy.wait(3000);

          cy.get('body').then(($body) => {
          cy.contains('div.mat-menu-item', 'Claim (V2)', { timeout: 10000 }).click();
          cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
          cy.contains('span.mat-option-text', 'MTXD').click();
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
  
  })
  })
})
