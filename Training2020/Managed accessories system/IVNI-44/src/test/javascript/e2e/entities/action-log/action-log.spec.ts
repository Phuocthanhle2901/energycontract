import { browser, ExpectedConditions as ec /* , protractor, promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  ActionLogComponentsPage,
  /* ActionLogDeleteDialog, */
  ActionLogUpdatePage,
} from './action-log.page-object';

const expect = chai.expect;

describe('ActionLog e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let actionLogComponentsPage: ActionLogComponentsPage;
  let actionLogUpdatePage: ActionLogUpdatePage;
  /* let actionLogDeleteDialog: ActionLogDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ActionLogs', async () => {
    await navBarPage.goToEntity('action-log');
    actionLogComponentsPage = new ActionLogComponentsPage();
    await browser.wait(ec.visibilityOf(actionLogComponentsPage.title), 5000);
    expect(await actionLogComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.actionLog.home.title');
    await browser.wait(ec.or(ec.visibilityOf(actionLogComponentsPage.entities), ec.visibilityOf(actionLogComponentsPage.noResult)), 1000);
  });

  it('should load create ActionLog page', async () => {
    await actionLogComponentsPage.clickOnCreateButton();
    actionLogUpdatePage = new ActionLogUpdatePage();
    expect(await actionLogUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.actionLog.home.createOrEditLabel');
    await actionLogUpdatePage.cancel();
  });

  /* it('should create and save ActionLogs', async () => {
        const nbButtonsBeforeCreate = await actionLogComponentsPage.countDeleteButtons();

        await actionLogComponentsPage.clickOnCreateButton();

        await promise.all([
            actionLogUpdatePage.setStartDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            actionLogUpdatePage.setExpectedEndDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            actionLogUpdatePage.setActualEndDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            actionLogUpdatePage.setPriceInput('5'),
            actionLogUpdatePage.setNoteInput('note'),
            actionLogUpdatePage.userSelectLastOption(),
            actionLogUpdatePage.actionTypeSelectLastOption(),
            actionLogUpdatePage.placeToPerformSelectLastOption(),
            actionLogUpdatePage.equipmentSelectLastOption(),
        ]);

        expect(await actionLogUpdatePage.getStartDateInput()).to.contain('2001-01-01T02:30', 'Expected startDate value to be equals to 2000-12-31');
        expect(await actionLogUpdatePage.getExpectedEndDateInput()).to.contain('2001-01-01T02:30', 'Expected expectedEndDate value to be equals to 2000-12-31');
        expect(await actionLogUpdatePage.getActualEndDateInput()).to.contain('2001-01-01T02:30', 'Expected actualEndDate value to be equals to 2000-12-31');
        expect(await actionLogUpdatePage.getPriceInput()).to.eq('5', 'Expected price value to be equals to 5');
        expect(await actionLogUpdatePage.getNoteInput()).to.eq('note', 'Expected Note value to be equals to note');

        await actionLogUpdatePage.save();
        expect(await actionLogUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await actionLogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last ActionLog', async () => {
        const nbButtonsBeforeDelete = await actionLogComponentsPage.countDeleteButtons();
        await actionLogComponentsPage.clickOnLastDeleteButton();

        actionLogDeleteDialog = new ActionLogDeleteDialog();
        expect(await actionLogDeleteDialog.getDialogTitle())
            .to.eq('managedAccessoriesSystemApp.actionLog.delete.question');
        await actionLogDeleteDialog.clickOnConfirmButton();

        expect(await actionLogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
