import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IFormType } from 'app/shared/model/form-type.model';

@Component({
  selector: 'jhi-form-type-detail',
  templateUrl: './form-type-detail.component.html',
})
export class FormTypeDetailComponent implements OnInit {
  formType: IFormType | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formType }) => (this.formType = formType));
  }

  previousState(): void {
    window.history.back();
  }
}
