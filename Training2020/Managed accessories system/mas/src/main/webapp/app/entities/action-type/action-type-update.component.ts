import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IActionType, ActionType } from 'app/shared/model/action-type.model';
import { ActionTypeService } from './action-type.service';

@Component({
  selector: 'jhi-action-type-update',
  templateUrl: './action-type-update.component.html',
})
export class ActionTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    actionTitle: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  constructor(protected actionTypeService: ActionTypeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionType }) => {
      this.updateForm(actionType);
    });
  }

  updateForm(actionType: IActionType): void {
    this.editForm.patchValue({
      id: actionType.id,
      actionTitle: actionType.actionTitle,
      description: actionType.description,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actionType = this.createFromForm();
    if (actionType.id !== undefined) {
      this.subscribeToSaveResponse(this.actionTypeService.update(actionType));
    } else {
      this.subscribeToSaveResponse(this.actionTypeService.create(actionType));
    }
  }

  private createFromForm(): IActionType {
    return {
      ...new ActionType(),
      id: this.editForm.get(['id'])!.value,
      actionTitle: this.editForm.get(['actionTitle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActionType>>): void {
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
