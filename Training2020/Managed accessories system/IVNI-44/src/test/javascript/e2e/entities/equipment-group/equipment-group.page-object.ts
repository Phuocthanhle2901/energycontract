import { element, by, ElementFinder } from 'protractor';

export class EquipmentGroupComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-equipment-group div table .btn-danger'));
  title = element.all(by.css('jhi-equipment-group div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class EquipmentGroupUpdatePage {
  pageTitle = element(by.id('jhi-equipment-group-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  equipmentGroupNameInput = element(by.id('field_equipmentGroupName'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setEquipmentGroupNameInput(equipmentGroupName: string): Promise<void> {
    await this.equipmentGroupNameInput.sendKeys(equipmentGroupName);
  }

  async getEquipmentGroupNameInput(): Promise<string> {
    return await this.equipmentGroupNameInput.getAttribute('value');
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class EquipmentGroupDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-equipmentGroup-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-equipmentGroup'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
