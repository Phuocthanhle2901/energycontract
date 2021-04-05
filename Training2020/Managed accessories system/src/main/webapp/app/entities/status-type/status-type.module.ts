import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { StatusTypeComponent } from './status-type.component';
import { StatusTypeDetailComponent } from './status-type-detail.component';
import { StatusTypeUpdateComponent } from './status-type-update.component';
import { StatusTypeDeleteDialogComponent } from './status-type-delete-dialog.component';
import { statusTypeRoute } from './status-type.route';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(statusTypeRoute)],
  declarations: [StatusTypeComponent, StatusTypeDetailComponent, StatusTypeUpdateComponent, StatusTypeDeleteDialogComponent],
  entryComponents: [StatusTypeDeleteDialogComponent],
})
export class ManagedAccessoriesSystemStatusTypeModule {}
