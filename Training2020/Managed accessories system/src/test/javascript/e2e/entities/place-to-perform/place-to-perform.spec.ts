import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PlaceToPerformComponentsPage, PlaceToPerformDeleteDialog, PlaceToPerformUpdatePage } from './place-to-perform.page-object';

const expect = chai.expect;

describe('PlaceToPerform e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let placeToPerformComponentsPage: PlaceToPerformComponentsPage;
  let placeToPerformUpdatePage: PlaceToPerformUpdatePage;
  let placeToPerformDeleteDialog: PlaceToPerformDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load PlaceToPerforms', async () => {
    await navBarPage.goToEntity('place-to-perform');
    placeToPerformComponentsPage = new PlaceToPerformComponentsPage();
    await browser.wait(ec.visibilityOf(placeToPerformComponentsPage.title), 5000);
    expect(await placeToPerformComponentsPage.getTitle()).to.eq('managedAccessoriesSystemApp.placeToPerform.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(placeToPerformComponentsPage.entities), ec.visibilityOf(placeToPerformComponentsPage.noResult)),
      1000
    );
  });

  it('should load create PlaceToPerform page', async () => {
    await placeToPerformComponentsPage.clickOnCreateButton();
    placeToPerformUpdatePage = new PlaceToPerformUpdatePage();
    expect(await placeToPerformUpdatePage.getPageTitle()).to.eq('managedAccessoriesSystemApp.placeToPerform.home.createOrEditLabel');
    await placeToPerformUpdatePage.cancel();
  });

  it('should create and save PlaceToPerforms', async () => {
    const nbButtonsBeforeCreate = await placeToPerformComponentsPage.countDeleteButtons();

    await placeToPerformComponentsPage.clickOnCreateButton();

    await promise.all([
      placeToPerformUpdatePage.setPlaceNameInput('placeName'),
      placeToPerformUpdatePage.setAddressInput('address'),
      placeToPerformUpdatePage.setPhoneNumberInput('phoneNumber'),
      placeToPerformUpdatePage.setEmailInput('email'),
      placeToPerformUpdatePage.setRepresentativeNameInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
    ]);

    expect(await placeToPerformUpdatePage.getPlaceNameInput()).to.eq('placeName', 'Expected PlaceName value to be equals to placeName');
    expect(await placeToPerformUpdatePage.getAddressInput()).to.eq('address', 'Expected Address value to be equals to address');
    expect(await placeToPerformUpdatePage.getPhoneNumberInput()).to.eq(
      'phoneNumber',
      'Expected PhoneNumber value to be equals to phoneNumber'
    );
    expect(await placeToPerformUpdatePage.getEmailInput()).to.eq('email', 'Expected Email value to be equals to email');
    expect(await placeToPerformUpdatePage.getRepresentativeNameInput()).to.contain(
      '2001-01-01T02:30',
      'Expected representativeName value to be equals to 2000-12-31'
    );

    await placeToPerformUpdatePage.save();
    expect(await placeToPerformUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await placeToPerformComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last PlaceToPerform', async () => {
    const nbButtonsBeforeDelete = await placeToPerformComponentsPage.countDeleteButtons();
    await placeToPerformComponentsPage.clickOnLastDeleteButton();

    placeToPerformDeleteDialog = new PlaceToPerformDeleteDialog();
    expect(await placeToPerformDeleteDialog.getDialogTitle()).to.eq('managedAccessoriesSystemApp.placeToPerform.delete.question');
    await placeToPerformDeleteDialog.clickOnConfirmButton();

    expect(await placeToPerformComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
