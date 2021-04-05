import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { ActionTypeComponentsPage, ActionTypeDeleteDialog, ActionTypeUpdatePage } from './action-type.page-object';

const expect = chai.expect;

describe('ActionType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let actionTypeComponentsPage: ActionTypeComponentsPage;
  let actionTypeUpdatePage: ActionTypeUpdatePage;
  let actionTypeDeleteDialog: ActionTypeDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load ActionTypes', async () => {
    await navBarPage.goToEntity('action-type');
    actionTypeComponentsPage = new ActionTypeComponentsPage();
    await browser.wait(ec.visibilityOf(actionTypeComponentsPage.title), 5000);
    expect(await actionTypeComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.actionType.home.title');
    await browser.wait(ec.or(ec.visibilityOf(actionTypeComponentsPage.entities), ec.visibilityOf(actionTypeComponentsPage.noResult)), 1000);
  });

  it('should load create ActionType page', async () => {
    await actionTypeComponentsPage.clickOnCreateButton();
    actionTypeUpdatePage = new ActionTypeUpdatePage();
    expect(await actionTypeUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.actionType.home.createOrEditLabel');
    await actionTypeUpdatePage.cancel();
  });

  it('should create and save ActionTypes', async () => {
    const nbButtonsBeforeCreate = await actionTypeComponentsPage.countDeleteButtons();

    await actionTypeComponentsPage.clickOnCreateButton();

    await promise.all([actionTypeUpdatePage.setActionTitleInput('actionTitle'), actionTypeUpdatePage.setDescriptionInput('description')]);

    expect(await actionTypeUpdatePage.getActionTitleInput()).to.eq('actionTitle', 'Expected ActionTitle value to be equals to actionTitle');
    expect(await actionTypeUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');

    await actionTypeUpdatePage.save();
    expect(await actionTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await actionTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last ActionType', async () => {
    const nbButtonsBeforeDelete = await actionTypeComponentsPage.countDeleteButtons();
    await actionTypeComponentsPage.clickOnLastDeleteButton();

    actionTypeDeleteDialog = new ActionTypeDeleteDialog();
    expect(await actionTypeDeleteDialog.getDialogTitle()).to.eq('managedAccessoriesSystemApp.actionType.delete.question');
    await actionTypeDeleteDialog.clickOnConfirmButton();

    expect(await actionTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
