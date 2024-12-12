import { element, by, ElementFinder } from 'protractor';

export class EquipmentTypeComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-equipment-type div table .btn-danger'));
  title = element.all(by.css('jhi-equipment-type div h2#page-heading span')).first();
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

export class EquipmentTypeUpdatePage {
  pageTitle = element(by.id('jhi-equipment-type-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  equipmentTypeNameInput = element(by.id('field_equipmentTypeName'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setEquipmentTypeNameInput(equipmentTypeName: string): Promise<void> {
    await this.equipmentTypeNameInput.sendKeys(equipmentTypeName);
  }

  async getEquipmentTypeNameInput(): Promise<string> {
    return await this.equipmentTypeNameInput.getAttribute('value');
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

export class EquipmentTypeDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-equipmentType-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-equipmentType'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
