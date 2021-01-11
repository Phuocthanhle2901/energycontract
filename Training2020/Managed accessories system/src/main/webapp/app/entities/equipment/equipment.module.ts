import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { EquipmentComponent } from './equipment.component';
import { EquipmentDetailComponent } from './equipment-detail.component';
import { EquipmentUpdateComponent } from './equipment-update.component';
import { EquipmentDeleteDialogComponent } from './equipment-delete-dialog.component';
import { equipmentRoute } from './equipment.route';
import { EquipmentImportDialogComponent } from './equipment-import-dialog.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(equipmentRoute), NgxDropzoneModule],
  declarations: [EquipmentComponent, EquipmentDetailComponent, EquipmentUpdateComponent, EquipmentDeleteDialogComponent, EquipmentImportDialogComponent],
  entryComponents: [EquipmentDeleteDialogComponent, EquipmentImportDialogComponent],
})
export class ManagedAccessoriesSystemEquipmentModule {}
