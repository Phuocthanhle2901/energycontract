import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { FormTypeComponentsPage, FormTypeDeleteDialog, FormTypeUpdatePage } from './form-type.page-object';

const expect = chai.expect;

describe('FormType e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let formTypeComponentsPage: FormTypeComponentsPage;
  let formTypeUpdatePage: FormTypeUpdatePage;
  let formTypeDeleteDialog: FormTypeDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load FormTypes', async () => {
    await navBarPage.goToEntity('form-type');
    formTypeComponentsPage = new FormTypeComponentsPage();
    await browser.wait(ec.visibilityOf(formTypeComponentsPage.title), 5000);
    expect(await formTypeComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.formType.home.title');
    await browser.wait(ec.or(ec.visibilityOf(formTypeComponentsPage.entities), ec.visibilityOf(formTypeComponentsPage.noResult)), 1000);
  });

  it('should load create FormType page', async () => {
    await formTypeComponentsPage.clickOnCreateButton();
    formTypeUpdatePage = new FormTypeUpdatePage();
    expect(await formTypeUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.formType.home.createOrEditLabel');
    await formTypeUpdatePage.cancel();
  });

  it('should create and save FormTypes', async () => {
    const nbButtonsBeforeCreate = await formTypeComponentsPage.countDeleteButtons();

    await formTypeComponentsPage.clickOnCreateButton();

    await promise.all([formTypeUpdatePage.setNameInput('name')]);

    expect(await formTypeUpdatePage.getNameInput()).to.eq('name', 'Expected Name value to be equals to name');

    await formTypeUpdatePage.save();
    expect(await formTypeUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await formTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last FormType', async () => {
    const nbButtonsBeforeDelete = await formTypeComponentsPage.countDeleteButtons();
    await formTypeComponentsPage.clickOnLastDeleteButton();

    formTypeDeleteDialog = new FormTypeDeleteDialog();
    expect(await formTypeDeleteDialog.getDialogTitle()).to.eq('managedAccessoriesSystemApp.formType.delete.question');
    await formTypeDeleteDialog.clickOnConfirmButton();

    expect(await formTypeComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
