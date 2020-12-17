import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { ActionLogComponent } from './action-log.component';
import { ActionLogDetailComponent } from './action-log-detail.component';
import { ActionLogUpdateComponent } from './action-log-update.component';
import { ActionLogDeleteDialogComponent } from './action-log-delete-dialog.component';
import { actionLogRoute } from './action-log.route';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(actionLogRoute)],
  declarations: [ActionLogComponent, ActionLogDetailComponent, ActionLogUpdateComponent, ActionLogDeleteDialogComponent],
  entryComponents: [ActionLogDeleteDialogComponent],
})
export class ManagedAccessoriesSystemActionLogModule {}
