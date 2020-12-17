import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MasSharedModule } from 'app/shared/shared.module';
import { AreaComponent } from './area.component';
import { AreaDetailComponent } from './area-detail.component';
import { AreaUpdateComponent } from './area-update.component';
import { AreaDeleteDialogComponent } from './area-delete-dialog.component';
import { areaRoute } from './area.route';

@NgModule({
  imports: [MasSharedModule, RouterModule.forChild(areaRoute)],
  declarations: [AreaComponent, AreaDetailComponent, AreaUpdateComponent, AreaDeleteDialogComponent],
  entryComponents: [AreaDeleteDialogComponent],
})
export class MasAreaModule {}
