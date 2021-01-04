import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IEquipmentType, EquipmentType } from 'app/shared/model/equipment-type.model';
import { EquipmentTypeService } from './equipment-type.service';
import { EquipmentTypeComponent } from './equipment-type.component';
import { EquipmentTypeDetailComponent } from './equipment-type-detail.component';
import { EquipmentTypeUpdateComponent } from './equipment-type-update.component';

@Injectable({ providedIn: 'root' })
export class EquipmentTypeResolve implements Resolve<IEquipmentType> {
  constructor(private service: EquipmentTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEquipmentType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((equipmentType: HttpResponse<EquipmentType>) => {
          if (equipmentType.body) {
            return of(equipmentType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new EquipmentType());
  }
}

export const equipmentTypeRoute: Routes = [
  {
    path: '',
    component: EquipmentTypeComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.equipmentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EquipmentTypeDetailComponent,
    resolve: {
      equipmentType: EquipmentTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.equipmentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EquipmentTypeUpdateComponent,
    resolve: {
      equipmentType: EquipmentTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.equipmentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EquipmentTypeUpdateComponent,
    resolve: {
      equipmentType: EquipmentTypeResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.equipmentType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
