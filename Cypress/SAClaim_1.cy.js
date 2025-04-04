describe('Claim Test Cases', () => {
    beforeEach(() => {
        cy.viewport(1900, 1020);
        cy.visit('https://portal.dfn-bs-qc.infodation.com/');

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
                    cy.wrap($body).invoke('text').then((iframeText) => {
                        cy.log('IFRAME TEXT:', iframeText); // Kiểm tra nội dung iframe
                        const otp = (iframeText.match(/\d{6}/) || [])[0];
                        if (otp) {
                            cy.log('Extracted OTP:', otp);
                            // Lưu OTP vào Cypress.env để sử dụng ngoài cy.origin
                            Cypress.env('otpCode', otp);
                        } else {
                            throw new Error('Không tìm thấy mã OTP');
                        }
                    });
                });
        });
        
        // Sử dụng OTP từ Cypress.env
        cy.then(() => {
            const otp = Cypress.env('otpCode');
            if (!otp) {
                throw new Error('OTP không được lưu trữ từ bước trước');
            }
            cy.visit('https://portal.dfn-bs-qc.infodation.com/totp-input');
            cy.log('Using OTP:', otp);
            
            // Nhập từng chữ số của OTP vào các ô input
            cy.get('input.form-control.text-center').each(($el, index) => {
                if (otp[index]) {
                    cy.wrap($el).type(otp[index], { delay: 100 });
                }
            });
            
            cy.contains('button', 'Inloggen').click();
        });  
    });

    // Testcase1: SA can claim in area status 2 (Claiming successful)
    it('Testcase1: SA can claim in area status 2', () => {
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
        cy.contains('a', 'Aansluitingen').click({ force: true });
        cy.get('input[name="postalCode"]').clear().type('2003PA');
        cy.contains('button', 'Zoeken').click({ force: true });
    
        // Click on the 6th button in the list
        cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
            .should('have.length', 7) 
            .eq(5) 
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
                    cy.contains('span.mat-option-text', 'MTXD').click();
                    cy.contains('button', 'Opslaan').click();
                    cy.wait(5000); 
                }
            });
    });

    // Testcase2: SA can claim in area status 4
    it('Testcase2: SA can claim in area status 4', () => {
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
        cy.contains('a', 'Aansluitingen').click({ force: true });
        cy.get('input[name="postalCode"]').clear().type('2003PA');
        cy.contains('button', 'Zoeken').click({ force: true });
    
        // Click on the 6th button in the list
        cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
            .should('have.length', 7) 
            .eq(3) 
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
                    cy.contains('span.mat-option-text', 'MTXD').click();
                    cy.contains('button', 'Opslaan').click();
                    cy.wait(5000); 
                }
            });
    });

    // Testcase3: SA can claim in area status 5
    it('Testcase3: SA can claim in area status 5', () => {
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
        cy.contains('a', 'Aansluitingen').click({ force: true });
        cy.get('input[name="postalCode"]').clear().type('2003PA');
        cy.contains('button', 'Zoeken').click({ force: true });
    
        // Click on the 6th button in the list
        cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
            .should('have.length', 7) 
            .eq(2) 
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
                    cy.contains('span.mat-option-text', 'MTXD').click();
                    cy.contains('button', 'Opslaan').click();
                    cy.wait(5000); 
                }
            });
    });

    // Testcase4: SA can claim in area status 6
    it('Testcase4: SA can claim in area status 6', () => {
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
        cy.contains('a', 'Aansluitingen').click({ force: true });
        cy.get('input[name="postalCode"]').clear().type('2003PA');
        cy.contains('button', 'Zoeken').click({ force: true });
    
        // Click on the 6th button in the list
        cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
            .should('have.length', 7) 
            .eq(1) 
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
                    cy.contains('span.mat-option-text', 'MTXD').click();
                    cy.contains('button', 'Opslaan').click();
                    cy.wait(5000); 
                }
            });
    });

    // Testcase5: SA can claim in area status 8 (Claiming successful)
    it('Testcase5: SA can claim in area status 8', () => {
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
        cy.contains('a', 'Aansluitingen').click({ force: true });
        cy.get('input[name="postalCode"]').clear().type('2003PA');
        cy.contains('button', 'Zoeken').click({ force: true });
    
        // Click on the 6th button in the list
        cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
            .should('have.length', 7) 
            .eq(0) 
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
                    cy.wait(5000); 
                }
            });
    });

    // Testcase6: SA cannot claim in area status 1 (Claiming failed)
    it('Testcase6: SA cannot claim in area status 1', () => {
        cy.visit('https://portal.dfn-bs-qc.infodation.com/home?tab=Sales');
        cy.contains('a', 'Aansluitingen').click({ force: true });
        cy.get('input[name="postalCode"]').clear().type('2003PA');
        cy.contains('button', 'Zoeken').click({ force: true });
    
        // Click on the 6th button in the list
        cy.get('td.mat-column-detailButton button.btn', { timeout: 10000 })
            .should('have.length', 7) 
            .eq(6) 
            .click({ force: true });
    
        cy.get('td:contains("Projectstatus")', { timeout: 10000 })
            .next()
            .invoke('text')
            .then((status) => {
                cy.wait(1000);  // Thêm thời gian chờ giữa các bước nếu cần
    
                const allowedStatuses = ['Vraag bundeling', 'Bouw fase', 'On hold', 'x-Wave', 'Beheer fase'];
                const cleanedStatus = status.trim().replace(/\s+/g, '').toLowerCase();
    
                // Kiểm tra nếu status thuộc loại cho phép claim
                if (allowedStatuses.map(s => s.replace(/\s+/g, '').toLowerCase()).includes(cleanedStatus)) {
                    cy.log('Status is allowed, attempting to claim');
    
                    cy.get('button.mat-menu-trigger.mat-icon-button', { timeout: 10000 })
                        .should('be.visible')  
                        .and('not.be.disabled')  
                        .click({ force: true });
    
                    cy.get('div.mat-menu-item').contains('Claim (V2)', { timeout: 10000 }).click();

                    cy.get('span.mat-select-placeholder', { timeout: 10000 }).click();
                    cy.contains('span.mat-option-text', 'MTXD').click();
    
                    cy.contains('button', 'Opslaan').click();
                    cy.wait(5000); 
                } else {
                    cy.log('Status is not allowed for claiming');
                }
            });
    });
});

