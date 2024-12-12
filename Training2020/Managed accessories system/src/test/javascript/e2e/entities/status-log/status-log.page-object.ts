import { element, by, ElementFinder } from 'protractor';

export class StatusLogComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-status-log div table .btn-danger'));
  title = element.all(by.css('jhi-status-log div h2#page-heading span')).first();
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

export class StatusLogUpdatePage {
  pageTitle = element(by.id('jhi-status-log-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  statusDateTimeInput = element(by.id('field_statusDateTime'));
  noteInput = element(by.id('field_note'));

  statusTypeSelect = element(by.id('field_statusType'));
  equipmentSelect = element(by.id('field_equipment'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setStatusDateTimeInput(statusDateTime: string): Promise<void> {
    await this.statusDateTimeInput.sendKeys(statusDateTime);
  }

  async getStatusDateTimeInput(): Promise<string> {
    return await this.statusDateTimeInput.getAttribute('value');
  }

  async setNoteInput(note: string): Promise<void> {
    await this.noteInput.sendKeys(note);
  }

  async getNoteInput(): Promise<string> {
    return await this.noteInput.getAttribute('value');
  }

  async statusTypeSelectLastOption(): Promise<void> {
    await this.statusTypeSelect.all(by.tagName('option')).last().click();
  }

  async statusTypeSelectOption(option: string): Promise<void> {
    await this.statusTypeSelect.sendKeys(option);
  }

  getStatusTypeSelect(): ElementFinder {
    return this.statusTypeSelect;
  }

  async getStatusTypeSelectedOption(): Promise<string> {
    return await this.statusTypeSelect.element(by.css('option:checked')).getText();
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

export class StatusLogDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-statusLog-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-statusLog'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
