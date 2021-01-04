import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ManagedAccessoriesSystemSharedModule } from 'app/shared/shared.module';

import {ProposingBuyEquipmentComponent} from "./proposing-buy-equipment.component";
import {proposingBuyEquipmentRoute} from "./proposing-buy-equipment.route";



@NgModule({
  imports: [ManagedAccessoriesSystemSharedModule, RouterModule.forChild(proposingBuyEquipmentRoute)],
  declarations: [ProposingBuyEquipmentComponent],
})
export class ProposingBuyEquipmentModule {

}
