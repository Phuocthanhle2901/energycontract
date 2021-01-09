import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IForm, Form } from 'app/shared/model/form.model';
import { FormService } from './form.service';
import { FormComponent } from './form.component';
import { FormDetailComponent } from './form-detail.component';
import { FormUpdateComponent } from './form-update.component';

@Injectable({ providedIn: 'root' })
export class FormResolve implements Resolve<IForm> {
  constructor(private service: FormService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IForm> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((form: HttpResponse<Form>) => {
          if (form.body) {
            return of(form.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Form());
  }
}

export const formRoute: Routes = [
  {
    path: '',
    component: FormComponent,
    data: {
      authorities: [Authority.USER,Authority.ADMIN],
      pageTitle: 'managedAccessoriesSystemApp.form.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: FormDetailComponent,
    resolve: {
      form: FormResolve,
    },
    data: {
      authorities: [Authority.USER,Authority.ADMIN],
      pageTitle: 'managedAccessoriesSystemApp.form.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: FormUpdateComponent,
    resolve: {
      form: FormResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'managedAccessoriesSystemApp.form.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: FormUpdateComponent,
    resolve: {
      form: FormResolve,
    },
    data: {
      authorities: [Authority.ADMIN],
      pageTitle: 'managedAccessoriesSystemApp.form.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
