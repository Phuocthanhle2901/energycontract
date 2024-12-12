import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { EquipmentGroupComponent } from './equipment-group.component';
import { EquipmentGroupDetailComponent } from './equipment-group-detail.component';
import { EquipmentGroupUpdateComponent } from './equipment-group-update.component';
import { EquipmentGroupDeleteDialogComponent } from './equipment-group-delete-dialog.component';
import { equipmentGroupRoute } from './equipment-group.route';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(equipmentGroupRoute)],
  declarations: [
    EquipmentGroupComponent,
    EquipmentGroupDetailComponent,
    EquipmentGroupUpdateComponent,
    EquipmentGroupDeleteDialogComponent,
  ],
  entryComponents: [EquipmentGroupDeleteDialogComponent],
})
export class ManagedAccessoriesSystemEquipmentGroupModule {}
