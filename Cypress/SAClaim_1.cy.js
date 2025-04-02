describe('Claim Test Cases', () => {
    before(() => {
        cy.viewport(1900, 1020);
        cy.session('loginSession', () => {
            // Perform login steps once and save the session
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
        });
    });

    beforeEach(() => {
        // Restore the session before each test
        cy.session('loginSession', () => {
            // Ensure the session is restored
            cy.visit('https://portal.dfn-bs-qc.infodation.com/home');
        });
    });

    it('Testcase1: SA claim area 8', () => {
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
        cy.contains('a', 'Aansluitingen', { timeout: 10000 }).click({ force: true });
        cy.get('input[name="postalCode"]', { timeout: 5000 }).clear().type('2003PA');
        cy.contains('button', 'Zoeken', { timeout: 5000 }).click();
        
        cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
            .should('have.length', 7)
            .should('be.visible')
            .first()
            .click({ force: true });
        
        cy.get('td:contains("Projectstatus")', { timeout: 10000 })
            .next()
            .invoke('text')
            .then((status) => {
                const allowedStatuses = ['Vraag bundeling', 'Bouw fase', 'On hold', 'x-Wave', 'Beheer fase'];
                const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();

                if (allowedStatuses.map(s => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
                    cy.get('button.mat-menu-trigger.mat-icon-button').click();
                    cy.contains('div.mat-menu-item', 'Claim (V2)').click();
                    cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
                    cy.contains('span.mat-option-text', 'Caiway').click();
                    cy.contains('button', 'Opslaan').click();
                }
            });
    });

    it('Testcase2: SA cannot claim in area 1', () => {
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales'); 
        cy.contains('a', 'Aansluitingen', { timeout: 10000 }).click();
        cy.get('input[name="postalCode"]', { timeout: 5000 }).clear().type('2003PA');
        cy.contains('button', 'Zoeken', { timeout: 5000 }).click();
        
        cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
            .should('have.length', 7)
            .should('be.visible')
            .eq(6)
            .click({ force: true });
        
        cy.get('td:contains("Projectstatus")', { timeout: 10000 })
            .next()
            .invoke('text')
            .then((status) => {
                const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();
                if (cleanedStatus === 'vraagbundeling') {
                    cy.get('button.mat-menu-trigger.mat-icon-button').should('not.exist');
                }
            });
        
        cy.get('a.btn-back', { timeout: 10000 }).click();
    });
});