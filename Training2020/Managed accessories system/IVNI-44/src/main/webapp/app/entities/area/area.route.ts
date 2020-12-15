import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IArea, Area } from 'app/shared/model/area.model';
import { AreaService } from './area.service';
import { AreaComponent } from './area.component';
import { AreaDetailComponent } from './area-detail.component';
import { AreaUpdateComponent } from './area-update.component';

@Injectable({ providedIn: 'root' })
export class AreaResolve implements Resolve<IArea> {
  constructor(private service: AreaService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IArea> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((area: HttpResponse<Area>) => {
          if (area.body) {
            return of(area.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Area());
  }
}

export const areaRoute: Routes = [
  {
    path: '',
    component: AreaComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.area.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AreaDetailComponent,
    resolve: {
      area: AreaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.area.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AreaUpdateComponent,
    resolve: {
      area: AreaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.area.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AreaUpdateComponent,
    resolve: {
      area: AreaResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.area.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
