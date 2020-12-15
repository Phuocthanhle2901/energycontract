import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IStatusLog, StatusLog } from 'app/shared/model/status-log.model';
import { StatusLogService } from './status-log.service';
import { IStatusType } from 'app/shared/model/status-type.model';
import { StatusTypeService } from 'app/entities/status-type/status-type.service';
import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from 'app/entities/equipment/equipment.service';

type SelectableEntity = IStatusType | IEquipment;

@Component({
  selector: 'jhi-status-log-update',
  templateUrl: './status-log-update.component.html',
})
export class StatusLogUpdateComponent implements OnInit {
  isSaving = false;
  statustypes: IStatusType[] = [];
  equipment: IEquipment[] = [];

  editForm = this.fb.group({
    id: [],
    statusDateTime: [],
    note: [null, [Validators.required]],
    statusType: [null, Validators.required],
    equipment: [null, Validators.required],
  });

  constructor(
    protected statusLogService: StatusLogService,
    protected statusTypeService: StatusTypeService,
    protected equipmentService: EquipmentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ statusLog }) => {
      if (!statusLog.id) {
        const today = moment().startOf('day');
        statusLog.statusDateTime = today;
      }

      this.updateForm(statusLog);

      this.statusTypeService.query().subscribe((res: HttpResponse<IStatusType[]>) => (this.statustypes = res.body || []));

      this.equipmentService.query().subscribe((res: HttpResponse<IEquipment[]>) => (this.equipment = res.body || []));
    });
  }

  updateForm(statusLog: IStatusLog): void {
    this.editForm.patchValue({
      id: statusLog.id,
      statusDateTime: statusLog.statusDateTime ? statusLog.statusDateTime.format(DATE_TIME_FORMAT) : null,
      note: statusLog.note,
      statusType: statusLog.statusType,
      equipment: statusLog.equipment,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const statusLog = this.createFromForm();
    if (statusLog.id !== undefined) {
      this.subscribeToSaveResponse(this.statusLogService.update(statusLog));
    } else {
      this.subscribeToSaveResponse(this.statusLogService.create(statusLog));
    }
  }

  private createFromForm(): IStatusLog {
    return {
      ...new StatusLog(),
      id: this.editForm.get(['id'])!.value,
      statusDateTime: this.editForm.get(['statusDateTime'])!.value
        ? moment(this.editForm.get(['statusDateTime'])!.value, DATE_TIME_FORMAT)
        : undefined,
      note: this.editForm.get(['note'])!.value,
      statusType: this.editForm.get(['statusType'])!.value,
      equipment: this.editForm.get(['equipment'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IStatusLog>>): void {
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

  trackById(index: number, item: SelectableEntity): any {
    return item.id;
  }
}
