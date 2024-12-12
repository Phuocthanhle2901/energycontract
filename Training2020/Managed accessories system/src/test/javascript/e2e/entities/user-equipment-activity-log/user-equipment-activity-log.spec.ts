import { browser, ExpectedConditions as ec /* , protractor, promise */ } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import {
  UserEquipmentActivityLogComponentsPage,
  /* UserEquipmentActivityLogDeleteDialog, */
  UserEquipmentActivityLogUpdatePage,
} from './user-equipment-activity-log.page-object';

const expect = chai.expect;

describe('UserEquipmentActivityLog e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let userEquipmentActivityLogComponentsPage: UserEquipmentActivityLogComponentsPage;
  let userEquipmentActivityLogUpdatePage: UserEquipmentActivityLogUpdatePage;
  /* let userEquipmentActivityLogDeleteDialog: UserEquipmentActivityLogDeleteDialog; */

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load UserEquipmentActivityLogs', async () => {
    await navBarPage.goToEntity('user-equipment-activity-log');
    userEquipmentActivityLogComponentsPage = new UserEquipmentActivityLogComponentsPage();
    await browser.wait(ec.visibilityOf(userEquipmentActivityLogComponentsPage.title), 5000);
    expect(await userEquipmentActivityLogComponentsPage.getTitle()).to.eq(
      'managedAccessoriesSystemApp.userEquipmentActivityLog.home.title'
    );
    await browser.wait(
      ec.or(
        ec.visibilityOf(userEquipmentActivityLogComponentsPage.entities),
        ec.visibilityOf(userEquipmentActivityLogComponentsPage.noResult)
      ),
      1000
    );
  });

  it('should load create UserEquipmentActivityLog page', async () => {
    await userEquipmentActivityLogComponentsPage.clickOnCreateButton();
    userEquipmentActivityLogUpdatePage = new UserEquipmentActivityLogUpdatePage();
    expect(await userEquipmentActivityLogUpdatePage.getPageTitle()).to.eq(
      'managedAccessoriesSystemApp.userEquipmentActivityLog.home.createOrEditLabel'
    );
    await userEquipmentActivityLogUpdatePage.cancel();
  });

  /* it('should create and save UserEquipmentActivityLogs', async () => {
        const nbButtonsBeforeCreate = await userEquipmentActivityLogComponentsPage.countDeleteButtons();

        await userEquipmentActivityLogComponentsPage.clickOnCreateButton();

        await promise.all([
            userEquipmentActivityLogUpdatePage.setActivityInput('activity'),
            userEquipmentActivityLogUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
            userEquipmentActivityLogUpdatePage.userSelectLastOption(),
            userEquipmentActivityLogUpdatePage.equipmentSelectLastOption(),
        ]);

        expect(await userEquipmentActivityLogUpdatePage.getActivityInput()).to.eq('activity', 'Expected Activity value to be equals to activity');
        expect(await userEquipmentActivityLogUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');

        await userEquipmentActivityLogUpdatePage.save();
        expect(await userEquipmentActivityLogUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

        expect(await userEquipmentActivityLogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
    }); */

  /* it('should delete last UserEquipmentActivityLog', async () => {
        const nbButtonsBeforeDelete = await userEquipmentActivityLogComponentsPage.countDeleteButtons();
        await userEquipmentActivityLogComponentsPage.clickOnLastDeleteButton();

        userEquipmentActivityLogDeleteDialog = new UserEquipmentActivityLogDeleteDialog();
        expect(await userEquipmentActivityLogDeleteDialog.getDialogTitle())
            .to.eq('managedAccessoriesSystemApp.userEquipmentActivityLog.delete.question');
        await userEquipmentActivityLogDeleteDialog.clickOnConfirmButton();

        expect(await userEquipmentActivityLogComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
    }); */

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
