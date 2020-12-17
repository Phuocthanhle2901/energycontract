import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { StatusTypeComponentsPage, StatusTypeDeleteDialog, StatusTypeUpdatePage } from './status-type.page-object';

const expect = chai.expect;

describe('StatusType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let statusTypeComponentsPage: StatusTypeComponentsPage;
  let statusTypeUpdatePage: StatusTypeUpdatePage;
  let statusTypeDeleteDialog: StatusTypeDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load StatusTypes', async () => {
    await navBarPage.goToEntity('status-type');
    statusTypeComponentsPage = new StatusTypeComponentsPage();
    await browser.wait(ec.visibilityOf(statusTypeComponentsPage.title), 5000);
    expect(await statusTypeComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.statusType.home.title');
    await browser.wait(ec.or(ec.visibilityOf(statusTypeComponentsPage.entities), ec.visibilityOf(statusTypeComponentsPage.noResult)), 1000);
  });

  it('should load create StatusType page', async () => {
    await statusTypeComponentsPage.clickOnCreateButton();
    statusTypeUpdatePage = new StatusTypeUpdatePage();
    expect(await statusTypeUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.statusType.home.createOrEditLabel');
    await statusTypeUpdatePage.cancel();
  });

  it('should create and save StatusTypes', async () => {
    const nbButtonsBeforeCreate = await statusTypeComponentsPage.countDeleteButtons();

    await statusTypeComponentsPage.clickOnCreateButton();

    await promise.all([statusTypeUpdatePage.setStatusTitleInput('statusTitle'), statusTypeUpdatePage.setDescriptionInput('description')]);

    expect(await statusTypeUpdatePage.getStatusTitleInput()).to.eq('statusTitle', 'Expected StatusTitle value to be equals to statusTitle');
    expect(await statusTypeUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');

    await statusTypeUpdatePage.save();
    expect(await statusTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await statusTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last StatusType', async () => {
    const nbButtonsBeforeDelete = await statusTypeComponentsPage.countDeleteButtons();
    await statusTypeComponentsPage.clickOnLastDeleteButton();

    statusTypeDeleteDialog = new StatusTypeDeleteDialog();
    expect(await statusTypeDeleteDialog.getDialogTitle()).to.eq('managedAccessoriesSystemApp.statusType.delete.question');
    await statusTypeDeleteDialog.clickOnConfirmButton();

    expect(await statusTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
