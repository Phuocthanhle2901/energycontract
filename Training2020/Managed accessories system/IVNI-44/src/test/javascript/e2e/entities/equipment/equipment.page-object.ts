import { element, by, ElementFinder } from 'protractor';

export class EquipmentComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-equipment div table .btn-danger'));
  title = element.all(by.css('jhi-equipment div h2#page-heading span')).first();
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

export class EquipmentUpdatePage {
  pageTitle = element(by.id('jhi-equipment-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  purchaseDateInput = element(by.id('field_purchaseDate'));
  equipmentNameInput = element(by.id('field_equipmentName'));
  technicalFeaturesInput = element(by.id('field_technicalFeatures'));
  serialNumberInput = element(by.id('field_serialNumber'));
  noteInput = element(by.id('field_note'));

  userSelect = element(by.id('field_user'));
  equipmentGroupSelect = element(by.id('field_equipmentGroup'));
  equipmentTypeSelect = element(by.id('field_equipmentType'));
  areaSelect = element(by.id('field_area'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setPurchaseDateInput(purchaseDate: string): Promise<void> {
    await this.purchaseDateInput.sendKeys(purchaseDate);
  }

  async getPurchaseDateInput(): Promise<string> {
    return await this.purchaseDateInput.getAttribute('value');
  }

  async setEquipmentNameInput(equipmentName: string): Promise<void> {
    await this.equipmentNameInput.sendKeys(equipmentName);
  }

  async getEquipmentNameInput(): Promise<string> {
    return await this.equipmentNameInput.getAttribute('value');
  }

  async setTechnicalFeaturesInput(technicalFeatures: string): Promise<void> {
    await this.technicalFeaturesInput.sendKeys(technicalFeatures);
  }

  async getTechnicalFeaturesInput(): Promise<string> {
    return await this.technicalFeaturesInput.getAttribute('value');
  }

  async setSerialNumberInput(serialNumber: string): Promise<void> {
    await this.serialNumberInput.sendKeys(serialNumber);
  }

  async getSerialNumberInput(): Promise<string> {
    return await this.serialNumberInput.getAttribute('value');
  }

  async setNoteInput(note: string): Promise<void> {
    await this.noteInput.sendKeys(note);
  }

  async getNoteInput(): Promise<string> {
    return await this.noteInput.getAttribute('value');
  }

  async userSelectLastOption(): Promise<void> {
    await this.userSelect.all(by.tagName('option')).last().click();
  }

  async userSelectOption(option: string): Promise<void> {
    await this.userSelect.sendKeys(option);
  }

  getUserSelect(): ElementFinder {
    return this.userSelect;
  }

  async getUserSelectedOption(): Promise<string> {
    return await this.userSelect.element(by.css('option:checked')).getText();
  }

  async equipmentGroupSelectLastOption(): Promise<void> {
    await this.equipmentGroupSelect.all(by.tagName('option')).last().click();
  }

  async equipmentGroupSelectOption(option: string): Promise<void> {
    await this.equipmentGroupSelect.sendKeys(option);
  }

  getEquipmentGroupSelect(): ElementFinder {
    return this.equipmentGroupSelect;
  }

  async getEquipmentGroupSelectedOption(): Promise<string> {
    return await this.equipmentGroupSelect.element(by.css('option:checked')).getText();
  }

  async equipmentTypeSelectLastOption(): Promise<void> {
    await this.equipmentTypeSelect.all(by.tagName('option')).last().click();
  }

  async equipmentTypeSelectOption(option: string): Promise<void> {
    await this.equipmentTypeSelect.sendKeys(option);
  }

  getEquipmentTypeSelect(): ElementFinder {
    return this.equipmentTypeSelect;
  }

  async getEquipmentTypeSelectedOption(): Promise<string> {
    return await this.equipmentTypeSelect.element(by.css('option:checked')).getText();
  }

  async areaSelectLastOption(): Promise<void> {
    await this.areaSelect.all(by.tagName('option')).last().click();
  }

  async areaSelectOption(option: string): Promise<void> {
    await this.areaSelect.sendKeys(option);
  }

  getAreaSelect(): ElementFinder {
    return this.areaSelect;
  }

  async getAreaSelectedOption(): Promise<string> {
    return await this.areaSelect.element(by.css('option:checked')).getText();
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

export class EquipmentDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-equipment-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-equipment'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
