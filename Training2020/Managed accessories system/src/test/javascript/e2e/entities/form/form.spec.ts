import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { FormComponentsPage, FormDeleteDialog, FormUpdatePage } from './form.page-object';

const expect = chai.expect;

describe('Form e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let formComponentsPage: FormComponentsPage;
  let formUpdatePage: FormUpdatePage;
  let formDeleteDialog: FormDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Forms', async () => {
    await navBarPage.goToEntity('form');
    formComponentsPage = new FormComponentsPage();
    await browser.wait(ec.visibilityOf(formComponentsPage.title), 5000);
    expect(await formComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.form.home.title');
    await browser.wait(ec.or(ec.visibilityOf(formComponentsPage.entities), ec.visibilityOf(formComponentsPage.noResult)), 1000);
  });

  it('should load create Form page', async () => {
    await formComponentsPage.clickOnCreateButton();
    formUpdatePage = new FormUpdatePage();
    expect(await formUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.form.home.createOrEditLabel');
    await formUpdatePage.cancel();
  });

  it('should create and save Forms', async () => {
    const nbButtonsBeforeCreate = await formComponentsPage.countDeleteButtons();

    await formComponentsPage.clickOnCreateButton();

    await promise.all([
      formUpdatePage.setTitleInput('title'),
      formUpdatePage.setYourNameInput('yourName'),
      formUpdatePage.setAreaInput('area'),
      formUpdatePage.setReasonInput('reason'),
      formUpdatePage.statusSelectLastOption(),
      formUpdatePage.formTypeSelectLastOption(),
      formUpdatePage.employeeSelectLastOption(),
      formUpdatePage.equipmentSelectLastOption(),
    ]);

    expect(await formUpdatePage.getTitleInput()).to.eq('title', 'Expected Title value to be equals to title');
    expect(await formUpdatePage.getYourNameInput()).to.eq('yourName', 'Expected YourName value to be equals to yourName');
    expect(await formUpdatePage.getAreaInput()).to.eq('area', 'Expected Area value to be equals to area');
    expect(await formUpdatePage.getReasonInput()).to.eq('reason', 'Expected Reason value to be equals to reason');

    await formUpdatePage.save();
    expect(await formUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await formComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Form', async () => {
    const nbButtonsBeforeDelete = await formComponentsPage.countDeleteButtons();
    await formComponentsPage.clickOnLastDeleteButton();

    formDeleteDialog = new FormDeleteDialog();
    expect(await formDeleteDialog.getDialogTitle()).to.eq('managedAccessoriesSystemApp.form.delete.question');
    await formDeleteDialog.clickOnConfirmButton();

    expect(await formComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
