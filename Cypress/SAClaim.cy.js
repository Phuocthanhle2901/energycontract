describe('SA Claim Test Cases', () => {
  beforeEach(() => {
    cy.viewport(1900, 1020);
    cy.visit('https://portal.dfn-bs-qc.infodation.com/');

    // login
    cy.get('#username').type('PA-SA@gmail.com');
    cy.get('#txtPassword').type('Phuonganh-2003', { log: false });
    cy.contains('Inloggen').click();
    cy.contains('button', 'Ga verder').click();

    // OTP 
    cy.origin('https://mailhog.dfn-bs-qc.infodation.com', () => {
      cy.visit('https://mailhog.dfn-bs-qc.infodation.com/');
      cy.get('.msglist-message').first().click();

      cy.wait(5000);
      cy.get('iframe#preview-html', { timeout: 10000 })
        .should('be.visible')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .then(($body) => {
          cy.wrap($body)
            .invoke('text')
            .then((iframeText) => {
              cy.log('IFRAME TEXT:', iframeText);
              const otp = (iframeText.match(/\d{6}/) || [])[0];
              if (otp) {
                cy.log('Extracted OTP:', otp);
                Cypress.env('otpCode', otp);
              } else {
                throw new Error('Không tìm thấy mã OTP');
              }
            });
        });
    });

    // Use OTP to login
    cy.then(() => {
      const otp = Cypress.env('otpCode');
      if (!otp) {
        throw new Error('OTP không được lưu trữ từ bước trước');
      }
      cy.visit('https://portal.dfn-bs-qc.infodation.com/totp-input');
      cy.log('Using OTP:', otp);

      cy.get('input.form-control.text-center').each(($el, index) => {
        if (otp[index]) {
          cy.wrap($el).type(otp[index], { delay: 100 });
        }
      });
      cy.contains('button', 'Inloggen').click();
    });
  });

  // Testcase 1: SA có thể claim ở trạng thái 2
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
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        })
        }
      });
  });

  // Testcase 2: SA có thể claim ở trạng thái 4
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
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        }
      });
  });

  // Testcase 3: SA có thể claim ở trạng thái 5
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
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        }
      });
  });

  // Testcase 4: SA có thể claim ở trạng thái 6
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
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        }
      });
  });

  // Testcase 5: SA có thể claim ở trạng thái 8
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
        const allowedStatuses = ['Beheer fase'];
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
            cy.contains('span.mat-option-text', 'Caiway').click();
            cy.contains('button', 'Opslaan').click();
            cy.wait(3000);
          });
        }
      });
  });

  // Testcase 6: SA không thể claim ở trạng thái 1
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
          cy.contains('button', 'Opslaan').click();
          cy.wait(3000);
        } else {
          cy.log('Status is not allowed for claiming');
        }
      });
  });

  // Testcase 7: SA không thể claim ở trạng thái 3
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
          cy.contains('button', 'Opslaan').click();
          cy.wait(3000);
        } else {
          cy.log('Status is not allowed for claiming');
        }
      });
  });
 });