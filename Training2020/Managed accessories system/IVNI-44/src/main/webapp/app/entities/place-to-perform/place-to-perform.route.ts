import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IPlaceToPerform, PlaceToPerform } from 'app/shared/model/place-to-perform.model';
import { PlaceToPerformService } from './place-to-perform.service';
import { PlaceToPerformComponent } from './place-to-perform.component';
import { PlaceToPerformDetailComponent } from './place-to-perform-detail.component';
import { PlaceToPerformUpdateComponent } from './place-to-perform-update.component';

@Injectable({ providedIn: 'root' })
export class PlaceToPerformResolve implements Resolve<IPlaceToPerform> {
  constructor(private service: PlaceToPerformService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlaceToPerform> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((placeToPerform: HttpResponse<PlaceToPerform>) => {
          if (placeToPerform.body) {
            return of(placeToPerform.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PlaceToPerform());
  }
}

export const placeToPerformRoute: Routes = [
  {
    path: '',
    component: PlaceToPerformComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.placeToPerform.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlaceToPerformDetailComponent,
    resolve: {
      placeToPerform: PlaceToPerformResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.placeToPerform.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlaceToPerformUpdateComponent,
    resolve: {
      placeToPerform: PlaceToPerformResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.placeToPerform.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlaceToPerformUpdateComponent,
    resolve: {
      placeToPerform: PlaceToPerformResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.placeToPerform.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
