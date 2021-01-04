import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IActionType, ActionType } from 'app/shared/model/action-type.model';
import { ActionTypeService } from './action-type.service';
import { ActionTypeComponent } from './action-type.component';
import { ActionTypeDetailComponent } from './action-type-detail.component';
import { ActionTypeUpdateComponent } from './action-type-update.component';

@Injectable({ providedIn: 'root' })
export class ActionTypeResolve implements Resolve<IActionType> {
  constructor(private service: ActionTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IActionType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((actionType: HttpResponse<ActionType>) => {
          if (actionType.body) {
            return of(actionType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new ActionType());
  }
}

export const actionTypeRoute: Routes = [
  {
    path: '',
    component: ActionTypeComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.actionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ActionTypeDetailComponent,
    resolve: {
      actionType: ActionTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.actionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ActionTypeUpdateComponent,
    resolve: {
      actionType: ActionTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.actionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ActionTypeUpdateComponent,
    resolve: {
      actionType: ActionTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.actionType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
