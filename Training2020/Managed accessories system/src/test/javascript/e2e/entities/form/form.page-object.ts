import { element, by, ElementFinder } from 'protractor';

export class FormComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-form div table .btn-danger'));
  title = element.all(by.css('jhi-form div h2#page-heading span')).first();
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

export class FormUpdatePage {
  pageTitle = element(by.id('jhi-form-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  titleInput = element(by.id('field_title'));
  yourNameInput = element(by.id('field_yourName'));
  areaInput = element(by.id('field_area'));
  reasonInput = element(by.id('field_reason'));
  statusSelect = element(by.id('field_status'));

  formTypeSelect = element(by.id('field_formType'));
  employeeSelect = element(by.id('field_employee'));
  equipmentSelect = element(by.id('field_equipment'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setTitleInput(title: string): Promise<void> {
    await this.titleInput.sendKeys(title);
  }

  async getTitleInput(): Promise<string> {
    return await this.titleInput.getAttribute('value');
  }

  async setYourNameInput(yourName: string): Promise<void> {
    await this.yourNameInput.sendKeys(yourName);
  }

  async getYourNameInput(): Promise<string> {
    return await this.yourNameInput.getAttribute('value');
  }

  async setAreaInput(area: string): Promise<void> {
    await this.areaInput.sendKeys(area);
  }

  async getAreaInput(): Promise<string> {
    return await this.areaInput.getAttribute('value');
  }

  async setReasonInput(reason: string): Promise<void> {
    await this.reasonInput.sendKeys(reason);
  }

  async getReasonInput(): Promise<string> {
    return await this.reasonInput.getAttribute('value');
  }

  async setStatusSelect(status: string): Promise<void> {
    await this.statusSelect.sendKeys(status);
  }

  async getStatusSelect(): Promise<string> {
    return await this.statusSelect.element(by.css('option:checked')).getText();
  }

  async statusSelectLastOption(): Promise<void> {
    await this.statusSelect.all(by.tagName('option')).last().click();
  }

  async formTypeSelectLastOption(): Promise<void> {
    await this.formTypeSelect.all(by.tagName('option')).last().click();
  }

  async formTypeSelectOption(option: string): Promise<void> {
    await this.formTypeSelect.sendKeys(option);
  }

  getFormTypeSelect(): ElementFinder {
    return this.formTypeSelect;
  }

  async getFormTypeSelectedOption(): Promise<string> {
    return await this.formTypeSelect.element(by.css('option:checked')).getText();
  }

  async employeeSelectLastOption(): Promise<void> {
    await this.employeeSelect.all(by.tagName('option')).last().click();
  }

  async employeeSelectOption(option: string): Promise<void> {
    await this.employeeSelect.sendKeys(option);
  }

  getEmployeeSelect(): ElementFinder {
    return this.employeeSelect;
  }

  async getEmployeeSelectedOption(): Promise<string> {
    return await this.employeeSelect.element(by.css('option:checked')).getText();
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

export class FormDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-form-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-form'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
