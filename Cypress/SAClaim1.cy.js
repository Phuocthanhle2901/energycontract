describe('SA Claim Test Cases', () => {
    before(() => {
      cy.session('sa-login', () => {
        cy.viewport(1900, 1020);
        cy.visit('https://portal.dfn-bs-qc.infodation.com/');

        cy.get('#username').type('PA-SA@gmail.com');
        cy.get('#txtPassword').type('Phuonganh-2003', { log: false });
        cy.contains('Inloggen').click();
        cy.contains('button', 'Ga verder').click();
  
        cy.request('http://mailhog.dfn-bs-qc.infodation.com/api/v2/messages').then((response) => {
          const messages = response.body.items;
          const latest = messages[0];
          const body = latest.Content.Body;
          const otp = (body.match(/\d{6}/) || [])[0];
          expect(otp).to.exist;
  
          cy.visit('https://portal.dfn-bs-qc.infodation.com/totp-input');
          cy.get('input.form-control.text-center').each(($el, index) => {
            if (otp[index]) {
              cy.wrap($el).type(otp[index]);
            }
          });
          cy.contains('button', 'Inloggen').click();
  
       
          cy.url().should('include', '/home?tab=Sales');
        });
      });
    });
  
    beforeEach(() => {
        cy.viewport(1900, 1020);
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
      });
  
    it('Testcase 1: SA can claim in area status 2', () => {
      cy.contains('a', 'Aansluitingen').click({ force: true });
      cy.get('input[name="postalCode"]').clear().type('2003PA');
      cy.contains('button', 'Zoeken').click({ force: true });
  
      cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
        .should('have.length', 7)
        .eq(5)
        .click({ force: true });
  
      cy.get('td:contains("Projectstatus")', { timeout: 10000 })
        .next()
        .invoke('text')
        .then((status) => {
          const allowedStatuses = ['Vraag bundeling'];
          const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();
  
          if (allowedStatuses.map(s => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
            cy.get('button.mat-menu-trigger.mat-icon-button').click();
            cy.get('div.mat-menu-item').then(($items) => {
              const unclaimButton = [...$items].find((el) => el.innerText.includes('Unclaim'));
              if (unclaimButton && unclaimButton.getAttribute('aria-disabled') !== 'true') {
                cy.wrap(unclaimButton).click();
                cy.wait(3000);
                cy.get('button.mat-menu-trigger.mat-icon-button').click();
              } else if (!unclaimButton) {
                cy.log('No unclaim button, proceeding to claim.');
              } else {
                cy.log('Area is claimed by another user. Skipping claim.');
                return;
              }
            }).then(() => {
              cy.contains('div.mat-menu-item', 'Claim (V2)').click();
              cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
              cy.contains('span.mat-option-text', 'MTXD').click();
              cy.contains('button', 'Opslaan').click();
              cy.wait(3000);
            });
          }
        });
    });
  
    it('Testcase 2: SA can claim in area status 4', () => {
      cy.contains('a', 'Aansluitingen').click({ force: true });
      cy.get('input[name="postalCode"]').clear().type('2003PA');
      cy.contains('button', 'Zoeken').click({ force: true });
  
      cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
        .should('have.length', 7)
        .eq(3)
        .click({ force: true });
  
      cy.get('td:contains("Projectstatus")', { timeout: 10000 })
        .next()
        .invoke('text')
        .then((status) => {
          const allowedStatuses = ['Bouw fase'];
          const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();
  
          if (allowedStatuses.map(s => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
            cy.get('button.mat-menu-trigger.mat-icon-button').click();
            cy.get('div.mat-menu-item').then(($items) => {
              const unclaimButton = [...$items].find((el) => el.innerText.includes('Unclaim'));
              if (unclaimButton && unclaimButton.getAttribute('aria-disabled') !== 'true') {
                cy.wrap(unclaimButton).click();
                cy.wait(3000);
                cy.get('button.mat-menu-trigger.mat-icon-button').click();
              } else if (!unclaimButton) {
                cy.log('No unclaim button, proceeding to claim.');
              } else {
                cy.log('Area is claimed by another user. Skipping claim.');
                return;
              }
            }).then(() => {
              cy.contains('div.mat-menu-item', 'Claim (V2)').click();
              cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
              cy.contains('span.mat-option-text', 'MTXD').click();
              cy.contains('button', 'Opslaan').click();
              cy.wait(3000);
            });
          }
        });
    });
  });
  