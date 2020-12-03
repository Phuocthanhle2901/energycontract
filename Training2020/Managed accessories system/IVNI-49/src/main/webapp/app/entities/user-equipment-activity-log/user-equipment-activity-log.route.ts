import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IUserEquipmentActivityLog, UserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';
import { UserEquipmentActivityLogService } from './user-equipment-activity-log.service';
import { UserEquipmentActivityLogComponent } from './user-equipment-activity-log.component';
import { UserEquipmentActivityLogDetailComponent } from './user-equipment-activity-log-detail.component';
import { UserEquipmentActivityLogUpdateComponent } from './user-equipment-activity-log-update.component';

@Injectable({ providedIn: 'root' })
export class UserEquipmentActivityLogResolve implements Resolve<IUserEquipmentActivityLog> {
  constructor(private service: UserEquipmentActivityLogService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IUserEquipmentActivityLog> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((userEquipmentActivityLog: HttpResponse<UserEquipmentActivityLog>) => {
          if (userEquipmentActivityLog.body) {
            return of(userEquipmentActivityLog.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new UserEquipmentActivityLog());
  }
}

export const userEquipmentActivityLogRoute: Routes = [
  {
    path: '',
    component: UserEquipmentActivityLogComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.userEquipmentActivityLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: UserEquipmentActivityLogDetailComponent,
    resolve: {
      userEquipmentActivityLog: UserEquipmentActivityLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.userEquipmentActivityLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: UserEquipmentActivityLogUpdateComponent,
    resolve: {
      userEquipmentActivityLog: UserEquipmentActivityLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.userEquipmentActivityLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: UserEquipmentActivityLogUpdateComponent,
    resolve: {
      userEquipmentActivityLog: UserEquipmentActivityLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.userEquipmentActivityLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
