import { Routes } from '@angular/router';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import {ProposingBuyEquipmentComponent} from "./proposing-buy-equipment.component";

export const proposingBuyEquipmentRoute: Routes = [
  {
    path: '',
    component: ProposingBuyEquipmentComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'masApp.proposingBuyEquipment.tit',
    },
    canActivate: [UserRouteAccessService],
  },

];
