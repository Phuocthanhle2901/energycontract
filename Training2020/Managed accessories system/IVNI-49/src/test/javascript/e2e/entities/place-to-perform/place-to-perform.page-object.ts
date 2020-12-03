import { element, by, ElementFinder } from 'protractor';

export class PlaceToPerformComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-place-to-perform div table .btn-danger'));
  title = element.all(by.css('jhi-place-to-perform div h2#page-heading span')).first();
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

export class PlaceToPerformUpdatePage {
  pageTitle = element(by.id('jhi-place-to-perform-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  placeNameInput = element(by.id('field_placeName'));
  addressInput = element(by.id('field_address'));
  phoneNumberInput = element(by.id('field_phoneNumber'));
  emailInput = element(by.id('field_email'));
  representativeNameInput = element(by.id('field_representativeName'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setPlaceNameInput(placeName: string): Promise<void> {
    await this.placeNameInput.sendKeys(placeName);
  }

  async getPlaceNameInput(): Promise<string> {
    return await this.placeNameInput.getAttribute('value');
  }

  async setAddressInput(address: string): Promise<void> {
    await this.addressInput.sendKeys(address);
  }

  async getAddressInput(): Promise<string> {
    return await this.addressInput.getAttribute('value');
  }

  async setPhoneNumberInput(phoneNumber: string): Promise<void> {
    await this.phoneNumberInput.sendKeys(phoneNumber);
  }

  async getPhoneNumberInput(): Promise<string> {
    return await this.phoneNumberInput.getAttribute('value');
  }

  async setEmailInput(email: string): Promise<void> {
    await this.emailInput.sendKeys(email);
  }

  async getEmailInput(): Promise<string> {
    return await this.emailInput.getAttribute('value');
  }

  async setRepresentativeNameInput(representativeName: string): Promise<void> {
    await this.representativeNameInput.sendKeys(representativeName);
  }

  async getRepresentativeNameInput(): Promise<string> {
    return await this.representativeNameInput.getAttribute('value');
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

export class PlaceToPerformDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-placeToPerform-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-placeToPerform'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
