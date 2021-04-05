import { element, by, ElementFinder } from 'protractor';

export class ActionLogComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-action-log div table .btn-danger'));
  title = element.all(by.css('jhi-action-log div h2#page-heading span')).first();
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

export class ActionLogUpdatePage {
  pageTitle = element(by.id('jhi-action-log-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  startDateInput = element(by.id('field_startDate'));
  expectedEndDateInput = element(by.id('field_expectedEndDate'));
  actualEndDateInput = element(by.id('field_actualEndDate'));
  priceInput = element(by.id('field_price'));
  noteInput = element(by.id('field_note'));

  userSelect = element(by.id('field_user'));
  actionTypeSelect = element(by.id('field_actionType'));
  placeToPerformSelect = element(by.id('field_placeToPerform'));
  equipmentSelect = element(by.id('field_equipment'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setStartDateInput(startDate: string): Promise<void> {
    await this.startDateInput.sendKeys(startDate);
  }

  async getStartDateInput(): Promise<string> {
    return await this.startDateInput.getAttribute('value');
  }

  async setExpectedEndDateInput(expectedEndDate: string): Promise<void> {
    await this.expectedEndDateInput.sendKeys(expectedEndDate);
  }

  async getExpectedEndDateInput(): Promise<string> {
    return await this.expectedEndDateInput.getAttribute('value');
  }

  async setActualEndDateInput(actualEndDate: string): Promise<void> {
    await this.actualEndDateInput.sendKeys(actualEndDate);
  }

  async getActualEndDateInput(): Promise<string> {
    return await this.actualEndDateInput.getAttribute('value');
  }

  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getAttribute('value');
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

  async actionTypeSelectLastOption(): Promise<void> {
    await this.actionTypeSelect.all(by.tagName('option')).last().click();
  }

  async actionTypeSelectOption(option: string): Promise<void> {
    await this.actionTypeSelect.sendKeys(option);
  }

  getActionTypeSelect(): ElementFinder {
    return this.actionTypeSelect;
  }

  async getActionTypeSelectedOption(): Promise<string> {
    return await this.actionTypeSelect.element(by.css('option:checked')).getText();
  }

  async placeToPerformSelectLastOption(): Promise<void> {
    await this.placeToPerformSelect.all(by.tagName('option')).last().click();
  }

  async placeToPerformSelectOption(option: string): Promise<void> {
    await this.placeToPerformSelect.sendKeys(option);
  }

  getPlaceToPerformSelect(): ElementFinder {
    return this.placeToPerformSelect;
  }

  async getPlaceToPerformSelectedOption(): Promise<string> {
    return await this.placeToPerformSelect.element(by.css('option:checked')).getText();
  }

  async equipmentSelectLastOption(): Promise<void> {
    await this.equipmentSelect.all(by.tagName('option')).last().click();
  }

  async equipmentSelectOption(option: string): Promise<void> {
    await this.equipmentSelect.sendKeys(option);
  }

  getEquipmentSelect(): ElementFinder {
    return this.equipmentSelect;
  }

  async getEquipmentSelectedOption(): Promise<string> {
    return await this.equipmentSelect.element(by.css('option:checked')).getText();
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

export class ActionLogDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-actionLog-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-actionLog'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
