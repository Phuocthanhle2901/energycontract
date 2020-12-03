import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JhipsterSharedModule } from 'app/shared/shared.module';
import { ActionTypeComponent } from './action-type.component';
import { ActionTypeDetailComponent } from './action-type-detail.component';
import { ActionTypeUpdateComponent } from './action-type-update.component';
import { ActionTypeDeleteDialogComponent } from './action-type-delete-dialog.component';
import { actionTypeRoute } from './action-type.route';

@NgModule({
  imports: [JhipsterSharedModule, RouterModule.forChild(actionTypeRoute)],
  declarations: [ActionTypeComponent, ActionTypeDetailComponent, ActionTypeUpdateComponent, ActionTypeDeleteDialogComponent],
  entryComponents: [ActionTypeDeleteDialogComponent],
})
export class JhipsterActionTypeModule {}
