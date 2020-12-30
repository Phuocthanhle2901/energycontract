import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasSharedModule } from 'app/shared/shared.module';

import {guaranteeDevicesRoute} from "./guarantee-devices.route";
import {GuaranteeDevicesComponent} from "./guarantee-devices.component";



@NgModule({
  imports: [MasSharedModule, RouterModule.forChild(guaranteeDevicesRoute)],
  declarations: [GuaranteeDevicesComponent],
})
export class GuaranteeDevicesModule {

}
