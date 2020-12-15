import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IActionLog, ActionLog } from 'app/shared/model/action-log.model';
import { ActionLogService } from './action-log.service';
import { ActionLogComponent } from './action-log.component';
import { ActionLogDetailComponent } from './action-log-detail.component';
import { ActionLogUpdateComponent } from './action-log-update.component';

@Injectable({ providedIn: 'root' })
export class ActionLogResolve implements Resolve<IActionLog> {
  constructor(private service: ActionLogService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActionLog> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((actionLog: HttpResponse<ActionLog>) => {
          if (actionLog.body) {
            return of(actionLog.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ActionLog());
  }
}

export const actionLogRoute: Routes = [
  {
    path: '',
    component: ActionLogComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.actionLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActionLogDetailComponent,
    resolve: {
      actionLog: ActionLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.actionLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActionLogUpdateComponent,
    resolve: {
      actionLog: ActionLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.actionLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActionLogUpdateComponent,
    resolve: {
      actionLog: ActionLogResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.actionLog.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
