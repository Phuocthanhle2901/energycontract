import { browser, ExpectedConditions as ec /* , protractor, promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  StatusLogComponentsPage,
  /* StatusLogDeleteDialog, */
  StatusLogUpdatePage,
} from './status-log.page-object';

const expect = chai.expect;

describe('StatusLog e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let statusLogComponentsPage: StatusLogComponentsPage;
  let statusLogUpdatePage: StatusLogUpdatePage;
  /* let statusLogDeleteDialog: StatusLogDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load StatusLogs', async () => {
    await navBarPage.goToEntity('status-log');
    statusLogComponentsPage = new StatusLogComponentsPage();
    await browser.wait(ec.visibilityOf(statusLogComponentsPage.title), 5000);
    expect(await statusLogComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.statusLog.home.title');
    await browser.wait(ec.or(ec.visibilityOf(statusLogComponentsPage.entities), ec.visibilityOf(statusLogComponentsPage.noResult)), 1000);
  });

  it('should load create StatusLog page', async () => {
    await statusLogComponentsPage.clickOnCreateButton();
    statusLogUpdatePage = new StatusLogUpdatePage();
    expect(await statusLogUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.statusLog.home.createOrEditLabel');
    await statusLogUpdatePage.cancel();
  });

  /* it('should create and save StatusLogs', async () => {
        const nbButtonsBeforeCreate = await statusLogComponentsPage.countDeleteButtons();

        await statusLogComponentsPage.clickOnCreateButton();

        await promise.all([
            statusLogUpdatePage.setStatusDateTimeInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            statusLogUpdatePage.setNoteInput('note'),
            statusLogUpdatePage.statusTypeSelectLastOption(),
            statusLogUpdatePage.equipmentSelectLastOption(),
        ]);

        expect(await statusLogUpdatePage.getStatusDateTimeInput()).to.contain('2001-01-01T02:30', 'Expected statusDateTime value to be equals to 2000-12-31');
        expect(await statusLogUpdatePage.getNoteInput()).to.eq('note', 'Expected Note value to be equals to note');

        await statusLogUpdatePage.save();
        expect(await statusLogUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await statusLogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last StatusLog', async () => {
        const nbButtonsBeforeDelete = await statusLogComponentsPage.countDeleteButtons();
        await statusLogComponentsPage.clickOnLastDeleteButton();

        statusLogDeleteDialog = new StatusLogDeleteDialog();
        expect(await statusLogDeleteDialog.getDialogTitle())
            .to.eq('managedAccessoriesSystemApp.statusLog.delete.question');
        await statusLogDeleteDialog.clickOnConfirmButton();

        expect(await statusLogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
