import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';

import {guaranteeDevicesRoute} from "./guarantee-devices.route";
import {GuaranteeDevicesComponent} from "./guarantee-devices.component";



@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(guaranteeDevicesRoute)],
  declarations: [GuaranteeDevicesComponent],
})
export class GuaranteeDevicesModule {

}
