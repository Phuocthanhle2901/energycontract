import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { FormComponent } from './form.component';
import { FormDetailComponent } from './form-detail.component';
import { FormUpdateComponent } from './form-update.component';
import { FormDeleteDialogComponent } from './form-delete-dialog.component';
import { formRoute } from './form.route';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(formRoute)],
  declarations: [FormComponent, FormDetailComponent, FormUpdateComponent, FormDeleteDialogComponent],
  entryComponents: [FormDeleteDialogComponent],
})
export class ManagedAccessoriesSystemFormModule {}
