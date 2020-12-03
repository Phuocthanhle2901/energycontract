import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IPlaceToPerform, PlaceToPerform } from 'app/shared/model/place-to-perform.model';
import { PlaceToPerformService } from './place-to-perform.service';

@Component({
  selector: 'jhi-place-to-perform-update',
  templateUrl: './place-to-perform-update.component.html',
})
export class PlaceToPerformUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    placeName: [null, [Validators.required]],
    address: [null, [Validators.required]],
    phoneNumber: [null, [Validators.required]],
    email: [null, [Validators.required]],
    representativeName: [null, [Validators.required]],
  });

  constructor(protected placeToPerformService: PlaceToPerformService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ placeToPerform }) => {
      if (!placeToPerform.id) {
        const today = moment().startOf('day');
        placeToPerform.representativeName = today;
      }

      this.updateForm(placeToPerform);
    });
  }

  updateForm(placeToPerform: IPlaceToPerform): void {
    this.editForm.patchValue({
      id: placeToPerform.id,
      placeName: placeToPerform.placeName,
      address: placeToPerform.address,
      phoneNumber: placeToPerform.phoneNumber,
      email: placeToPerform.email,
      representativeName: placeToPerform.representativeName ? placeToPerform.representativeName.format(DATE_TIME_FORMAT) : null,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const placeToPerform = this.createFromForm();
    if (placeToPerform.id !== undefined) {
      this.subscribeToSaveResponse(this.placeToPerformService.update(placeToPerform));
    } else {
      this.subscribeToSaveResponse(this.placeToPerformService.create(placeToPerform));
    }
  }

  private createFromForm(): IPlaceToPerform {
    return {
      ...new PlaceToPerform(),
      id: this.editForm.get(['id'])!.value,
      placeName: this.editForm.get(['placeName'])!.value,
      address: this.editForm.get(['address'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      email: this.editForm.get(['email'])!.value,
      representativeName: this.editForm.get(['representativeName'])!.value
        ? moment(this.editForm.get(['representativeName'])!.value, DATE_TIME_FORMAT)
        : undefined,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlaceToPerform>>): void {
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
