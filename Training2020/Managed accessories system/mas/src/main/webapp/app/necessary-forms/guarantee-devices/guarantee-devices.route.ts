import { Routes } from '@angular/router';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import {GuaranteeDevicesComponent} from "./guarantee-devices.component";

export const guaranteeDevicesRoute: Routes = [
  {
    path: '',
    component: GuaranteeDevicesComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'masApp.guaranteeDevices.tit',
    },
    canActivate: [UserRouteAccessService],
  },

];
