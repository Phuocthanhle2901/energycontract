import { element, by, ElementFinder } from 'protractor';

export class AreaComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-area div table .btn-danger'));
  title = element.all(by.css('jhi-area div h2#page-heading span')).first();
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

export class AreaUpdatePage {
  pageTitle = element(by.id('jhi-area-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  areaNameInput = element(by.id('field_areaName'));

  leaderSelect = element(by.id('field_leader'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setAreaNameInput(areaName: string): Promise<void> {
    await this.areaNameInput.sendKeys(areaName);
  }

  async getAreaNameInput(): Promise<string> {
    return await this.areaNameInput.getAttribute('value');
  }

  async leaderSelectLastOption(): Promise<void> {
    await this.leaderSelect.all(by.tagName('option')).last().click();
  }

  async leaderSelectOption(option: string): Promise<void> {
    await this.leaderSelect.sendKeys(option);
  }

  getLeaderSelect(): ElementFinder {
    return this.leaderSelect;
  }

  async getLeaderSelectedOption(): Promise<string> {
    return await this.leaderSelect.element(by.css('option:checked')).getText();
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

export class AreaDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-area-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-area'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
