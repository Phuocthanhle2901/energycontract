import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { UserManagementComponent } from './user-management.component';
import { UserManagementDetailComponent } from './user-management-detail.component';
import { UserManagementUpdateComponent } from './user-management-update.component';
import { UserManagementDeleteDialogComponent } from './user-management-delete-dialog.component';
import { userManagementRoute } from './user-management.route';
import { UserImportDialogComponent } from './user-import-dialog.component';

import { NgxDropzoneModule } from "ngx-dropzone";

@NgModule({ 
  imports: [
    ManagedAccessoriesSystemSharedModule,
    RouterModule.forChild(userManagementRoute),
    NgxDropzoneModule],
  declarations: [
    UserManagementComponent,
    UserManagementDetailComponent,
    UserManagementUpdateComponent,
    UserManagementDeleteDialogComponent,
    UserImportDialogComponent
  ],
  entryComponents: [UserManagementDeleteDialogComponent,UserImportDialogComponent],
})
export class UserManagementModule {}
