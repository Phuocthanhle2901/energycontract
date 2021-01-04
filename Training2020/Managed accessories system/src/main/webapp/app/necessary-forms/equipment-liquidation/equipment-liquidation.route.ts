import { Routes } from '@angular/router';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import {EquipmentLiquidationComponent} from "./equipment-liquidation.component";

export const equipmentLiquidationRoute: Routes = [
  {
    path: '',
    component: EquipmentLiquidationComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'masApp.equipmentLiquidation.tit',
    },
    canActivate: [UserRouteAccessService],
  },

];
