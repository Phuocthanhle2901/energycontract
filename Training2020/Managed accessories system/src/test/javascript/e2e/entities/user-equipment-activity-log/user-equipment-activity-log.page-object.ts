import { element, by, ElementFinder } from 'protractor';

export class UserEquipmentActivityLogComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-user-equipment-activity-log div table .btn-danger'));
  title = element.all(by.css('jhi-user-equipment-activity-log div h2#page-heading span')).first();
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

export class UserEquipmentActivityLogUpdatePage {
  pageTitle = element(by.id('jhi-user-equipment-activity-log-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  activityInput = element(by.id('field_activity'));
  dateInput = element(by.id('field_date'));

  userSelect = element(by.id('field_user'));
  equipmentSelect = element(by.id('field_equipment'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setActivityInput(activity: string): Promise<void> {
    await this.activityInput.sendKeys(activity);
  }

  async getActivityInput(): Promise<string> {
    return await this.activityInput.getAttribute('value');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
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

export class UserEquipmentActivityLogDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-userEquipmentActivityLog-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-userEquipmentActivityLog'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
