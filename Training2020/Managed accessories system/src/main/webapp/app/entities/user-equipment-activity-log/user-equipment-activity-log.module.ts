import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { UserEquipmentActivityLogComponent } from './user-equipment-activity-log.component';
import { UserEquipmentActivityLogDetailComponent } from './user-equipment-activity-log-detail.component';
import { UserEquipmentActivityLogUpdateComponent } from './user-equipment-activity-log-update.component';
import { UserEquipmentActivityLogDeleteDialogComponent } from './user-equipment-activity-log-delete-dialog.component';
import { userEquipmentActivityLogRoute } from './user-equipment-activity-log.route';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(userEquipmentActivityLogRoute)],
  declarations: [
    UserEquipmentActivityLogComponent,
    UserEquipmentActivityLogDetailComponent,
    UserEquipmentActivityLogUpdateComponent,
    UserEquipmentActivityLogDeleteDialogComponent,
  ],
  entryComponents: [UserEquipmentActivityLogDeleteDialogComponent],
})
export class ManagedAccessoriesSystemUserEquipmentActivityLogModule {}
