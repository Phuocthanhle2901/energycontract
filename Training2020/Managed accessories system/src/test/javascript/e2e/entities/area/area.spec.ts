import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AreaComponentsPage, AreaDeleteDialog, AreaUpdatePage } from './area.page-object';

const expect = chai.expect;

describe('Area e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let areaComponentsPage: AreaComponentsPage;
  let areaUpdatePage: AreaUpdatePage;
  let areaDeleteDialog: AreaDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Areas', async () => {
    await navBarPage.goToEntity('area');
    areaComponentsPage = new AreaComponentsPage();
    await browser.wait(ec.visibilityOf(areaComponentsPage.title), 5000);
    expect(await areaComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.area.home.title');
    await browser.wait(ec.or(ec.visibilityOf(areaComponentsPage.entities), ec.visibilityOf(areaComponentsPage.noResult)), 1000);
  });

  it('should load create Area page', async () => {
    await areaComponentsPage.clickOnCreateButton();
    areaUpdatePage = new AreaUpdatePage();
    expect(await areaUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.area.home.createOrEditLabel');
    await areaUpdatePage.cancel();
  });

  it('should create and save Areas', async () => {
    const nbButtonsBeforeCreate = await areaComponentsPage.countDeleteButtons();

    await areaComponentsPage.clickOnCreateButton();

    await promise.all([areaUpdatePage.setAreaNameInput('areaName'), areaUpdatePage.leaderSelectLastOption()]);

    expect(await areaUpdatePage.getAreaNameInput()).to.eq('areaName', 'Expected AreaName value to be equals to areaName');

    await areaUpdatePage.save();
    expect(await areaUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await areaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Area', async () => {
    const nbButtonsBeforeDelete = await areaComponentsPage.countDeleteButtons();
    await areaComponentsPage.clickOnLastDeleteButton();

    areaDeleteDialog = new AreaDeleteDialog();
    expect(await areaDeleteDialog.getDialogTitle()).to.eq('managedAccessoriesSystemApp.area.delete.question');
    await areaDeleteDialog.clickOnConfirmButton();

    expect(await areaComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
