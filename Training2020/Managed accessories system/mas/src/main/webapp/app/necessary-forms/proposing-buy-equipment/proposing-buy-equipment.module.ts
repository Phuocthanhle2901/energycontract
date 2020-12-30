import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasSharedModule } from 'app/shared/shared.module';

import {ProposingBuyEquipmentComponent} from "./proposing-buy-equipment.component";
import {proposingBuyEquipmentRoute} from "./proposing-buy-equipment.route";



@NgModule({
  imports: [MasSharedModule, RouterModule.forChild(proposingBuyEquipmentRoute)],
  declarations: [ProposingBuyEquipmentComponent],
})
export class ProposingBuyEquipmentModule {

}
