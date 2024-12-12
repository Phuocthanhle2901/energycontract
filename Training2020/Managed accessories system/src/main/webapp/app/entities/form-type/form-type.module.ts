import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { FormTypeComponent } from './form-type.component';
import { FormTypeDetailComponent } from './form-type-detail.component';
import { FormTypeUpdateComponent } from './form-type-update.component';
import { FormTypeDeleteDialogComponent } from './form-type-delete-dialog.component';
import { formTypeRoute } from './form-type.route';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(formTypeRoute)],
  declarations: [FormTypeComponent, FormTypeDetailComponent, FormTypeUpdateComponent, FormTypeDeleteDialogComponent],
  entryComponents: [FormTypeDeleteDialogComponent],
})
export class ManagedAccessoriesSystemFormTypeModule {}
