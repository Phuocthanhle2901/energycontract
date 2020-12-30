import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MasSharedModule } from 'app/shared/shared.module';


import {EquipmentLiquidationComponent} from "./equipment-liquidation.component";

import {equipmentLiquidationRoute} from "./equipment-liquidation.route";



@NgModule({
  imports: [MasSharedModule, RouterModule.forChild(equipmentLiquidationRoute)],
  declarations: [EquipmentLiquidationComponent],
})
export class EquipmentLiquidationModule {

}
