import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { StatusLogComponent } from './status-log.component';
import { StatusLogDetailComponent } from './status-log-detail.component';
import { StatusLogUpdateComponent } from './status-log-update.component';
import { StatusLogDeleteDialogComponent } from './status-log-delete-dialog.component';
import { statusLogRoute } from './status-log.route';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(statusLogRoute)],
  declarations: [StatusLogComponent, StatusLogDetailComponent, StatusLogUpdateComponent, StatusLogDeleteDialogComponent],
  entryComponents: [StatusLogDeleteDialogComponent],
})
export class ManagedAccessoriesSystemStatusLogModule {}
