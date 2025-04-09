describe('SA Claim Test Cases', () => {
  beforeEach(() => {
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

    cy.viewport(1900, 1020);
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
  });


  // Testcase 1: SA can claim in area status 2
  it('Testcase 1: SA can claim in area status 2', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
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

        if (allowedStatuses.map((s) => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('div.mat-menu-item').then(($items) => {
            cy.get('div.mat-menu-item').then(($items) => {
              const unclaimButton = [...$items].find((el) => el.innerText.includes('Unclaim'));
              if (unclaimButton) {
                const isDisabled = unclaimButton.getAttribute('aria-disabled') === 'true';
                if (!isDisabled) {
                  cy.wrap(unclaimButton).click();
                  cy.wait(3000);
                  cy.get('button.mat-menu-trigger.mat-icon-button').click();
                } else {
                  cy.log('Area is claimed by another user. Skipping claim.');
                  return;
                }
              } else {
                cy.log('No unclaim button, this area is unclaimed. Proceed to claim.');
              }
            }).then(() => {
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
        }
      });
  });

  // Testcase 2: SA can claim in area status 4
  it('Testcase 2: SA can claim in area status 4', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
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

        if (allowedStatuses.map((s) => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('div.mat-menu-item').then(($items) => {
            const unclaimButton = [...$items].find((el) => el.innerText.includes('Unclaim'));
            if (unclaimButton && unclaimButton.getAttribute('aria-disabled') !== 'true') {
              cy.wrap(unclaimButton).click();
              cy.wait(3000);
              cy.get('button.mat-menu-trigger.mat-icon-button').click();
            } else if (unclaimButton) {
              cy.log('Area is claimed by another user. Skipping claim.');
              return;
            } else {
              cy.log('No unclaim button, proceeding to claim.');
            }
          }).then(() => {
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
        }
      });
  });

  // Testcase 3: SA can claim in area status 5
  it('Testcase 3: SA can claim in area status 5', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.contains('button', 'Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(2)
      .click({ force: true });

    cy.get('td:contains("Projectstatus")', { timeout: 10000 })
      .next()
      .invoke('text')
      .then((status) => {
        const allowedStatuses = ['On hold'];
        const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();

        if (allowedStatuses.map((s) => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('div.mat-menu-item').then(($items) => {
            const unclaimButton = [...$items].find((el) => el.innerText.includes('Unclaim'));
            if (unclaimButton && unclaimButton.getAttribute('aria-disabled') !== 'true') {
              cy.wrap(unclaimButton).click();
              cy.wait(3000);
              cy.get('button.mat-menu-trigger.mat-icon-button').click();
            } else if (unclaimButton) {
              cy.log('Area is claimed by another user. Skipping claim.');
              return;
            } else {
              cy.log('No unclaim button, proceeding to claim.');
            }
          }).then(() => {
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
        }
      });
  });

  // Testcase 4: SA can claim in area status 6
  it('Testcase 4: SA can claim in area status 6', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.contains('button', 'Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(1)
      .click({ force: true });

    cy.get('td:contains("Projectstatus")', { timeout: 10000 })
      .next()
      .invoke('text')
      .then((status) => {
        const allowedStatuses = ['x-Wave'];
        const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();

        if (allowedStatuses.map((s) => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
          cy.get('button.mat-menu-trigger.mat-icon-button').click();
          cy.get('div.mat-menu-item').then(($items) => {
            const unclaimButton = [...$items].find((el) => el.innerText.includes('Unclaim'));
            if (unclaimButton && unclaimButton.getAttribute('aria-disabled') !== 'true') {
              cy.wrap(unclaimButton).click();
              cy.wait(3000);
              cy.get('button.mat-menu-trigger.mat-icon-button').click();
            } else if (unclaimButton) {
              cy.log('Area is claimed by another user. Skipping claim.');
              return;
            } else {
              cy.log('No unclaim button, proceeding to claim.');
            }
          }).then(() => {
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
        }
      });
  });

  // Testcase 5: SA can claim in area status 8
  it('Testcase 5: SA can claim in area status 8', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.contains('button', 'Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(0)
      .click({ force: true });

    cy.get('td:contains("Projectstatus")', { timeout: 10000 })
      .next()
      .invoke('text')
      .then((status) => {
        cy.wait(1000);
        const allowedStatuses = ['Beheer fase'];
        const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();

        if (allowedStatuses.map((s) => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
          cy.log('Status is allowed, attempting to claim');
          cy.get('button.mat-menu-trigger.mat-icon-button', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true });
          cy.contains('div.mat-menu-item', 'Claim (V2)', { timeout: 10000 }).click();
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
        } else {
          cy.log('Status is not allowed for claiming');
        }
      });
  });

  // Testcase 6: SA cannot claim in area status 1
  it('Testcase 6: SA cannot claim in area status 1', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.contains('button', 'Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(6)
      .click({ force: true });

    cy.get('td:contains("Projectstatus")', { timeout: 10000 })
      .next()
      .invoke('text')
      .then((status) => {
        cy.wait(1000);
        const allowedStatuses = ['Voorbereidings fase'];
        const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();

        if (allowedStatuses.map((s) => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
          cy.log('Status is allowed, attempting to claim');
          cy.get('button.mat-menu-trigger.mat-icon-button', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true });
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
        } else {
          cy.log('Status is not allowed for claiming');
        }
      });
  });

  // Testcase 7: SA cannot claim in area status 3
  it('Testcase 7: SA cannot claim in area status 3', () => {
    cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
    cy.contains('a', 'Aansluitingen').click({ force: true });
    cy.get('input[name="postalCode"]').clear().type('2003PA');
    cy.contains('button', 'Zoeken').click({ force: true });

    cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
      .should('have.length', 7)
      .eq(4)
      .click({ force: true });

    cy.get('td:contains("Projectstatus")', { timeout: 10000 })
      .next()
      .invoke('text')
      .then((status) => {
        cy.wait(1000);
        const allowedStatuses = ['Vraag bundeling niet gehaald'];
        const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();

        if (allowedStatuses.map((s) => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
          cy.log('Status is allowed, attempting to claim');
          cy.get('button.mat-menu-trigger.mat-icon-button', { timeout: 10000 })
            .should('be.visible')
            .and('not.be.disabled')
            .click({ force: true });
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
        } else {
          cy.log('Status is not allowed for claiming');
        }
      });
  });
 });