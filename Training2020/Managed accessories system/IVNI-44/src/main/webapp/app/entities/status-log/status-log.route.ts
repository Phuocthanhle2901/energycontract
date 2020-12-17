import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IStatusLog, StatusLog } from 'app/shared/model/status-log.model';
import { StatusLogService } from './status-log.service';
import { StatusLogComponent } from './status-log.component';
import { StatusLogDetailComponent } from './status-log-detail.component';
import { StatusLogUpdateComponent } from './status-log-update.component';

@Injectable({ providedIn: 'root' })
export class StatusLogResolve implements Resolve<IStatusLog> {
  constructor(private service: StatusLogService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStatusLog> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((statusLog: HttpResponse<StatusLog>) => {
          if (statusLog.body) {
            return of(statusLog.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StatusLog());
  }
}

export const statusLogRoute: Routes = [
  {
    path: '',
    component: StatusLogComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.statusLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StatusLogDetailComponent,
    resolve: {
      statusLog: StatusLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.statusLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StatusLogUpdateComponent,
    resolve: {
      statusLog: StatusLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.statusLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StatusLogUpdateComponent,
    resolve: {
      statusLog: StatusLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.statusLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
