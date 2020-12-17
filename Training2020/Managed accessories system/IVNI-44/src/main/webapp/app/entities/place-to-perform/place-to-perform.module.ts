import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';
import { PlaceToPerformComponent } from './place-to-perform.component';
import { PlaceToPerformDetailComponent } from './place-to-perform-detail.component';
import { PlaceToPerformUpdateComponent } from './place-to-perform-update.component';
import { PlaceToPerformDeleteDialogComponent } from './place-to-perform-delete-dialog.component';
import { placeToPerformRoute } from './place-to-perform.route';

@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(placeToPerformRoute)],
  declarations: [
    PlaceToPerformComponent,
    PlaceToPerformDetailComponent,
    PlaceToPerformUpdateComponent,
    PlaceToPerformDeleteDialogComponent,
  ],
  entryComponents: [PlaceToPerformDeleteDialogComponent],
})
export class ManagedAccessoriesSystemPlaceToPerformModule {}
