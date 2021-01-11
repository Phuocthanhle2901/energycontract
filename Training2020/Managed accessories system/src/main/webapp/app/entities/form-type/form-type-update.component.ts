import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IFormType, FormType } from 'app/shared/model/form-type.model';
import { FormTypeService } from './form-type.service';
import { CustomValidators } from 'app/shared/custom-validators/validators';

@Component({
  selector: 'jhi-form-type-update',
  templateUrl: './form-type-update.component.html',
})
export class FormTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    name: [null, [
      Validators.required, 
      Validators.maxLength(200),
      CustomValidators.cannotContainsFirstWhiteSpace,
      CustomValidators.numberFalse,
      CustomValidators.specialCharacterFalse
    ]],
  });

  constructor(protected formTypeService: FormTypeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ formType }) => {
      this.updateForm(formType);
    });
  }

  updateForm(formType: IFormType): void {
    this.editForm.patchValue({
      id: formType.id,
      name: formType.name,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const formType = this.createFromForm();
    if (formType.id !== undefined) {
      this.subscribeToSaveResponse(this.formTypeService.update(formType));
    } else {
      this.subscribeToSaveResponse(this.formTypeService.create(formType));
    }
  }

  private createFromForm(): IFormType {
    return {
      ...new FormType(),
      id: this.editForm.get(['id'])!.value,
      name: this.editForm.get(['name'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IFormType>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
