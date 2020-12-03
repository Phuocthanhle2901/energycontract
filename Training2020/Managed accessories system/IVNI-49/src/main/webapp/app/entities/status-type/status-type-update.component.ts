import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IStatusType, StatusType } from 'app/shared/model/status-type.model';
import { StatusTypeService } from './status-type.service';

@Component({
  selector: 'jhi-status-type-update',
  templateUrl: './status-type-update.component.html',
})
export class StatusTypeUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    statusTitle: [null, [Validators.required]],
    description: [null, [Validators.required]],
  });

  constructor(protected statusTypeService: StatusTypeService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statusType }) => {
      this.updateForm(statusType);
    });
  }

  updateForm(statusType: IStatusType): void {
    this.editForm.patchValue({
      id: statusType.id,
      statusTitle: statusType.statusTitle,
      description: statusType.description,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const statusType = this.createFromForm();
    if (statusType.id !== undefined) {
      this.subscribeToSaveResponse(this.statusTypeService.update(statusType));
    } else {
      this.subscribeToSaveResponse(this.statusTypeService.create(statusType));
    }
  }

  private createFromForm(): IStatusType {
    return {
      ...new StatusType(),
      id: this.editForm.get(['id'])!.value,
      statusTitle: this.editForm.get(['statusTitle'])!.value,
      description: this.editForm.get(['description'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStatusType>>): void {
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
