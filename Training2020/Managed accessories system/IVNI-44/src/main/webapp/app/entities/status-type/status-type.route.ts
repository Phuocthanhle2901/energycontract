import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IStatusType, StatusType } from 'app/shared/model/status-type.model';
import { StatusTypeService } from './status-type.service';
import { StatusTypeComponent } from './status-type.component';
import { StatusTypeDetailComponent } from './status-type-detail.component';
import { StatusTypeUpdateComponent } from './status-type-update.component';

@Injectable({ providedIn: 'root' })
export class StatusTypeResolve implements Resolve<IStatusType> {
  constructor(private service: StatusTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStatusType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((statusType: HttpResponse<StatusType>) => {
          if (statusType.body) {
            return of(statusType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new StatusType());
  }
}

export const statusTypeRoute: Routes = [
  {
    path: '',
    component: StatusTypeComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.statusType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StatusTypeDetailComponent,
    resolve: {
      statusType: StatusTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.statusType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StatusTypeUpdateComponent,
    resolve: {
      statusType: StatusTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.statusType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StatusTypeUpdateComponent,
    resolve: {
      statusType: StatusTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.statusType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
