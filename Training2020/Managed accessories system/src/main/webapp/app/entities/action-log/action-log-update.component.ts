import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IActionLog, ActionLog } from 'app/shared/model/action-log.model';
import { ActionLogService } from './action-log.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { IActionType } from 'app/shared/model/action-type.model';
import { ActionTypeService } from 'app/entities/action-type/action-type.service';
import { IPlaceToPerform } from 'app/shared/model/place-to-perform.model';
import { PlaceToPerformService } from 'app/entities/place-to-perform/place-to-perform.service';
import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from 'app/entities/equipment/equipment.service';

type SelectableEntity = IEmployee | IActionType | IPlaceToPerform | IEquipment;

@Component({
  selector: 'jhi-action-log-update',
  templateUrl: './action-log-update.component.html',
})
export class ActionLogUpdateComponent implements OnInit {
  isSaving = false;
  employees: IEmployee[] = [];
  actiontypes: IActionType[] = [];
  placetoperforms: IPlaceToPerform[] = [];
  equipment: IEquipment[] = [];

  editForm = this.fb.group({
    id: [],
    startDate: [null, [Validators.required]],
    expectedEndDate: [],
    actualEndDate: [],
    price: [null, [Validators.required]],
    note: [],
    user: [null, Validators.required],
    actionType: [null, Validators.required],
    placeToPerform: [null, Validators.required],
    equipment: [null, Validators.required],
  });

  constructor(
    protected actionLogService: ActionLogService,
    protected employeeService: EmployeeService,
    protected actionTypeService: ActionTypeService,
    protected placeToPerformService: PlaceToPerformService,
    protected equipmentService: EquipmentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ actionLog }) => {
      if (!actionLog.id) {
        const today = moment().startOf('day');
        actionLog.startDate = today;
        actionLog.expectedEndDate = today;
        actionLog.actualEndDate = today;
      }

      this.updateForm(actionLog);

      this.employeeService.query().subscribe((res: HttpResponse<IEmployee[]>) => (this.employees = res.body || []));

      this.actionTypeService.query().subscribe((res: HttpResponse<IActionType[]>) => (this.actiontypes = res.body || []));

      this.placeToPerformService.query().subscribe((res: HttpResponse<IPlaceToPerform[]>) => (this.placetoperforms = res.body || []));

      this.equipmentService.query().subscribe((res: HttpResponse<IEquipment[]>) => (this.equipment = res.body || []));
    });
  }

  updateForm(actionLog: IActionLog): void {
    this.editForm.patchValue({
      id: actionLog.id,
      startDate: actionLog.startDate ? actionLog.startDate.format(DATE_TIME_FORMAT) : null,
      expectedEndDate: actionLog.expectedEndDate ? actionLog.expectedEndDate.format(DATE_TIME_FORMAT) : null,
      actualEndDate: actionLog.actualEndDate ? actionLog.actualEndDate.format(DATE_TIME_FORMAT) : null,
      price: actionLog.price,
      note: actionLog.note,
      user: actionLog.user,
      actionType: actionLog.actionType,
      placeToPerform: actionLog.placeToPerform,
      equipment: actionLog.equipment,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const actionLog = this.createFromForm();
    if (actionLog.id !== undefined) {
      this.subscribeToSaveResponse(this.actionLogService.update(actionLog));
    } else {
      this.subscribeToSaveResponse(this.actionLogService.create(actionLog));
    }
  }

  private createFromForm(): IActionLog {
    return {
      ...new ActionLog(),
      id: this.editForm.get(['id'])!.value,
      startDate: this.editForm.get(['startDate'])!.value ? moment(this.editForm.get(['startDate'])!.value, DATE_TIME_FORMAT) : undefined,
      expectedEndDate: this.editForm.get(['expectedEndDate'])!.value
        ? moment(this.editForm.get(['expectedEndDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      actualEndDate: this.editForm.get(['actualEndDate'])!.value
        ? moment(this.editForm.get(['actualEndDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      price: this.editForm.get(['price'])!.value,
      note: this.editForm.get(['note'])!.value,
      user: this.editForm.get(['user'])!.value,
      actionType: this.editForm.get(['actionType'])!.value,
      placeToPerform: this.editForm.get(['placeToPerform'])!.value,
      equipment: this.editForm.get(['equipment'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IActionLog>>): void {
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
