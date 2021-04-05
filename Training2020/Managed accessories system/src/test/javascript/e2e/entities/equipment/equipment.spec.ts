import { browser, ExpectedConditions as ec /* , protractor, promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  EquipmentComponentsPage,
  /* EquipmentDeleteDialog, */
  EquipmentUpdatePage,
} from './equipment.page-object';

const expect = chai.expect;

describe('Equipment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let equipmentComponentsPage: EquipmentComponentsPage;
  let equipmentUpdatePage: EquipmentUpdatePage;
  /* let equipmentDeleteDialog: EquipmentDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Equipment', async () => {
    await navBarPage.goToEntity('equipment');
    equipmentComponentsPage = new EquipmentComponentsPage();
    await browser.wait(ec.visibilityOf(equipmentComponentsPage.title), 5000);
    expect(await equipmentComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.equipment.home.title');
    await browser.wait(ec.or(ec.visibilityOf(equipmentComponentsPage.entities), ec.visibilityOf(equipmentComponentsPage.noResult)), 1000);
  });

  it('should load create Equipment page', async () => {
    await equipmentComponentsPage.clickOnCreateButton();
    equipmentUpdatePage = new EquipmentUpdatePage();
    expect(await equipmentUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.equipment.home.createOrEditLabel');
    await equipmentUpdatePage.cancel();
  });

  /* it('should create and save Equipment', async () => {
        const nbButtonsBeforeCreate = await equipmentComponentsPage.countDeleteButtons();

        await equipmentComponentsPage.clickOnCreateButton();

        await promise.all([
            equipmentUpdatePage.setPurchaseDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            equipmentUpdatePage.setEquipmentNameInput('equipmentName'),
            equipmentUpdatePage.setTechnicalFeaturesInput('technicalFeatures'),
            equipmentUpdatePage.setSerialNumberInput('serialNumber'),
            equipmentUpdatePage.setNoteInput('note'),
            equipmentUpdatePage.userSelectLastOption(),
            equipmentUpdatePage.equipmentGroupSelectLastOption(),
            equipmentUpdatePage.equipmentTypeSelectLastOption(),
            equipmentUpdatePage.areaSelectLastOption(),
        ]);

        expect(await equipmentUpdatePage.getPurchaseDateInput()).to.contain('2001-01-01T02:30', 'Expected purchaseDate value to be equals to 2000-12-31');
        expect(await equipmentUpdatePage.getEquipmentNameInput()).to.eq('equipmentName', 'Expected EquipmentName value to be equals to equipmentName');
        expect(await equipmentUpdatePage.getTechnicalFeaturesInput()).to.eq('technicalFeatures', 'Expected TechnicalFeatures value to be equals to technicalFeatures');
        expect(await equipmentUpdatePage.getSerialNumberInput()).to.eq('serialNumber', 'Expected SerialNumber value to be equals to serialNumber');
        expect(await equipmentUpdatePage.getNoteInput()).to.eq('note', 'Expected Note value to be equals to note');

        await equipmentUpdatePage.save();
        expect(await equipmentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await equipmentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last Equipment', async () => {
        const nbButtonsBeforeDelete = await equipmentComponentsPage.countDeleteButtons();
        await equipmentComponentsPage.clickOnLastDeleteButton();

        equipmentDeleteDialog = new EquipmentDeleteDialog();
        expect(await equipmentDeleteDialog.getDialogTitle())
            .to.eq('managedAccessoriesSystemApp.equipment.delete.question');
        await equipmentDeleteDialog.clickOnConfirmButton();

        expect(await equipmentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
