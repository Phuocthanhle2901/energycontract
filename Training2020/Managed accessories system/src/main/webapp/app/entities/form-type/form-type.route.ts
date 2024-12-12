import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IFormType, FormType } from 'app/shared/model/form-type.model';
import { FormTypeService } from './form-type.service';
import { FormTypeComponent } from './form-type.component';
import { FormTypeDetailComponent } from './form-type-detail.component';
import { FormTypeUpdateComponent } from './form-type-update.component';

@Injectable({ providedIn: 'root' })
export class FormTypeResolve implements Resolve<IFormType> {
  constructor(private service: FormTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IFormType> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((formType: HttpResponse<FormType>) => {
          if (formType.body) {
            return of(formType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new FormType());
  }
}

export const formTypeRoute: Routes = [
  {
    path: '',
    component: FormTypeComponent,
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'managedAccessoriesSystemApp.formType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormTypeDetailComponent,
    resolve: {
      formType: FormTypeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'managedAccessoriesSystemApp.formType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormTypeUpdateComponent,
    resolve: {
      formType: FormTypeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'managedAccessoriesSystemApp.formType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormTypeUpdateComponent,
    resolve: {
      formType: FormTypeResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'managedAccessoriesSystemApp.formType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
