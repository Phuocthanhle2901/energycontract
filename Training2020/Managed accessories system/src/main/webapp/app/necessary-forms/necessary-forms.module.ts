import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";

@NgModule({
  imports: [
    /* jhipster-needle-add-admin-module - JHipster will add admin modules here */
    RouterModule.forChild([
      {
        path: 'equipment-liquidation',
        loadChildren: () => import('./equipment-liquidation/equipment-liquidation.module').then(m => m.EquipmentLiquidationModule),
        data: {
          pageTitle: 'masApp.equipmentLiquidation.tit',
        },
      },

      {
        path: 'guarantee-devices',
        loadChildren: () => import('./guarantee-devices/guarantee-devices.module').then(m => m.GuaranteeDevicesModule),
        data: {
          pageTitle: 'masApp.proposingBuyEquipment.tit',
        },
      },

      {
        path: 'proposing-buy-equipment',
        loadChildren: () => import('./proposing-buy-equipment/proposing-buy-equipment.module').then(m => m.ProposingBuyEquipmentModule),
        data: {
          pageTitle: 'masApp.proposingBuyEquipment.tit',
        },
      },
      /* jhipster-needle-add-admin-route - JHipster will add admin routes here */
    ]),
  ],
})
export class NecessaryFormsModule {}
