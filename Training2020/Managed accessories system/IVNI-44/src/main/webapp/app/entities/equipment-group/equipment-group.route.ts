import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IEquipmentGroup, EquipmentGroup } from 'app/shared/model/equipment-group.model';
import { EquipmentGroupService } from './equipment-group.service';
import { EquipmentGroupComponent } from './equipment-group.component';
import { EquipmentGroupDetailComponent } from './equipment-group-detail.component';
import { EquipmentGroupUpdateComponent } from './equipment-group-update.component';

@Injectable({ providedIn: 'root' })
export class EquipmentGroupResolve implements Resolve<IEquipmentGroup> {
  constructor(private service: EquipmentGroupService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEquipmentGroup> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((equipmentGroup: HttpResponse<EquipmentGroup>) => {
          if (equipmentGroup.body) {
            return of(equipmentGroup.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EquipmentGroup());
  }
}

export const equipmentGroupRoute: Routes = [
  {
    path: '',
    component: EquipmentGroupComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.equipmentGroup.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EquipmentGroupDetailComponent,
    resolve: {
      equipmentGroup: EquipmentGroupResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.equipmentGroup.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EquipmentGroupUpdateComponent,
    resolve: {
      equipmentGroup: EquipmentGroupResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.equipmentGroup.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EquipmentGroupUpdateComponent,
    resolve: {
      equipmentGroup: EquipmentGroupResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.equipmentGroup.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
