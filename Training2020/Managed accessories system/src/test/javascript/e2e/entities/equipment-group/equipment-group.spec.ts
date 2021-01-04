import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { EquipmentGroupComponentsPage, EquipmentGroupDeleteDialog, EquipmentGroupUpdatePage } from './equipment-group.page-object';

const expect = chai.expect;

describe('EquipmentGroup e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let equipmentGroupComponentsPage: EquipmentGroupComponentsPage;
  let equipmentGroupUpdatePage: EquipmentGroupUpdatePage;
  let equipmentGroupDeleteDialog: EquipmentGroupDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load EquipmentGroups', async () => {
    await navBarPage.goToEntity('equipment-group');
    equipmentGroupComponentsPage = new EquipmentGroupComponentsPage();
    await browser.wait(ec.visibilityOf(equipmentGroupComponentsPage.title), 5000);
    expect(await equipmentGroupComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.equipmentGroup.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(equipmentGroupComponentsPage.entities), ec.visibilityOf(equipmentGroupComponentsPage.noResult)),
      1000
    );
  });

  it('should load create EquipmentGroup page', async () => {
    await equipmentGroupComponentsPage.clickOnCreateButton();
    equipmentGroupUpdatePage = new EquipmentGroupUpdatePage();
    expect(await equipmentGroupUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.equipmentGroup.home.createOrEditLabel');
    await equipmentGroupUpdatePage.cancel();
  });

  it('should create and save EquipmentGroups', async () => {
    const nbButtonsBeforeCreate = await equipmentGroupComponentsPage.countDeleteButtons();

    await equipmentGroupComponentsPage.clickOnCreateButton();

    await promise.all([equipmentGroupUpdatePage.setEquipmentGroupNameInput('equipmentGroupName')]);

    expect(await equipmentGroupUpdatePage.getEquipmentGroupNameInput()).to.eq(
      'equipmentGroupName',
      'Expected EquipmentGroupName value to be equals to equipmentGroupName'
    );

    await equipmentGroupUpdatePage.save();
    expect(await equipmentGroupUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await equipmentGroupComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last EquipmentGroup', async () => {
    const nbButtonsBeforeDelete = await equipmentGroupComponentsPage.countDeleteButtons();
    await equipmentGroupComponentsPage.clickOnLastDeleteButton();

    equipmentGroupDeleteDialog = new EquipmentGroupDeleteDialog();
    expect(await equipmentGroupDeleteDialog.getDialogTitle()).to.eq('managedAccessoriesSystemApp.equipmentGroup.delete.question');
    await equipmentGroupDeleteDialog.clickOnConfirmButton();

    expect(await equipmentGroupComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
