import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IUserEquipmentActivityLog, UserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';
import { UserEquipmentActivityLogService } from './user-equipment-activity-log.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from 'app/entities/equipment/equipment.service';

type SelectableEntity = IEmployee | IEquipment;

@Component({
  selector: 'jhi-user-equipment-activity-log-update',
  templateUrl: './user-equipment-activity-log-update.component.html',
})
export class UserEquipmentActivityLogUpdateComponent implements OnInit {
  isSaving = false;
  employees: IEmployee[] = [];
  equipment: IEquipment[] = [];

  editForm = this.fb.group({
    id: [],
    activity: [null, [Validators.required]],
    date: [],
    user: [null, Validators.required],
    equipment: [null, Validators.required],
  });

  constructor(
    protected userEquipmentActivityLogService: UserEquipmentActivityLogService,
    protected employeeService: EmployeeService,
    protected equipmentService: EquipmentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ userEquipmentActivityLog }) => {
      if (!userEquipmentActivityLog.id) {
        const today = moment().startOf('day');
        userEquipmentActivityLog.date = today;
      }

      this.updateForm(userEquipmentActivityLog);

      this.employeeService.query().subscribe((res: HttpResponse<IEmployee[]>) => (this.employees = res.body || []));

      this.equipmentService.query().subscribe((res: HttpResponse<IEquipment[]>) => (this.equipment = res.body || []));
    });
  }

  updateForm(userEquipmentActivityLog: IUserEquipmentActivityLog): void {
    this.editForm.patchValue({
      id: userEquipmentActivityLog.id,
      activity: userEquipmentActivityLog.activity,
      date: userEquipmentActivityLog.date ? userEquipmentActivityLog.date.format(DATE_TIME_FORMAT) : null,
      user: userEquipmentActivityLog.user,
      equipment: userEquipmentActivityLog.equipment,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const userEquipmentActivityLog = this.createFromForm();
    if (userEquipmentActivityLog.id !== undefined) {
      this.subscribeToSaveResponse(this.userEquipmentActivityLogService.update(userEquipmentActivityLog));
    } else {
      this.subscribeToSaveResponse(this.userEquipmentActivityLogService.create(userEquipmentActivityLog));
    }
  }

  private createFromForm(): IUserEquipmentActivityLog {
    return {
      ...new UserEquipmentActivityLog(),
      id: this.editForm.get(['id'])!.value,
      activity: this.editForm.get(['activity'])!.value,
      date: this.editForm.get(['date'])!.value ? moment(this.editForm.get(['date'])!.value, DATE_TIME_FORMAT) : undefined,
      user: this.editForm.get(['user'])!.value,
      equipment: this.editForm.get(['equipment'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUserEquipmentActivityLog>>): void {
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
