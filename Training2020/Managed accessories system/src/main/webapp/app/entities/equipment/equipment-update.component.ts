import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IEquipment, Equipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from './equipment.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { IEquipmentGroup } from 'app/shared/model/equipment-group.model';
import { EquipmentGroupService } from 'app/entities/equipment-group/equipment-group.service';
import { IEquipmentType } from 'app/shared/model/equipment-type.model';
import { EquipmentTypeService } from 'app/entities/equipment-type/equipment-type.service';
import { IArea } from 'app/shared/model/area.model';
import { AreaService } from 'app/entities/area/area.service';

type SelectableEntity = IEmployee | IEquipmentGroup | IEquipmentType | IArea;

@Component({
  selector: 'jhi-equipment-update',
  templateUrl: './equipment-update.component.html',
})
export class EquipmentUpdateComponent implements OnInit {
  isSaving = false;
  employees: IEmployee[] = [];
  equipmentgroups: IEquipmentGroup[] = [];
  equipmenttypes: IEquipmentType[] = [];
  areas: IArea[] = [];

  editForm = this.fb.group({
    id: [],
    purchaseDate: [],
    equipmentName: [null, [Validators.required, Validators.maxLength(255)]],
    technicalFeatures: [null, [Validators.required]],
    serialNumber: [null, [Validators.required]],
    note: [null, [Validators.required]],
    user: [null, Validators.required],
    equipmentGroup: [null, Validators.required],
    equipmentType: [null, Validators.required],
    area: [null, Validators.required],
  });

  constructor(
    protected equipmentService: EquipmentService,
    protected employeeService: EmployeeService,
    protected equipmentGroupService: EquipmentGroupService,
    protected equipmentTypeService: EquipmentTypeService,
    protected areaService: AreaService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipment }) => {
      if (!equipment.id) {
        const today = moment().startOf('day');
        equipment.purchaseDate = today;
      }

      this.updateForm(equipment);

      this.employeeService.query().subscribe((res: HttpResponse<IEmployee[]>) => (this.employees = res.body || []));

      this.equipmentGroupService.query().subscribe((res: HttpResponse<IEquipmentGroup[]>) => (this.equipmentgroups = res.body || []));

      this.equipmentTypeService.query().subscribe((res: HttpResponse<IEquipmentType[]>) => (this.equipmenttypes = res.body || []));

      this.areaService.query().subscribe((res: HttpResponse<IArea[]>) => (this.areas = res.body || []));
    });
  }

  updateForm(equipment: IEquipment): void {
    this.editForm.patchValue({
      id: equipment.id,
      purchaseDate: equipment.purchaseDate ? equipment.purchaseDate.format(DATE_TIME_FORMAT) : null,
      equipmentName: equipment.equipmentName,
      technicalFeatures: equipment.technicalFeatures,
      serialNumber: equipment.serialNumber,
      note: equipment.note,
      user: equipment.user,
      equipmentGroup: equipment.equipmentGroup,
      equipmentType: equipment.equipmentType,
      area: equipment.area,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const equipment = this.createFromForm();
    if (equipment.id !== undefined) {
      this.subscribeToSaveResponse(this.equipmentService.update(equipment));
    } else {
      this.subscribeToSaveResponse(this.equipmentService.create(equipment));
    }
  }

  private createFromForm(): IEquipment {
    return {
      ...new Equipment(),
      id: this.editForm.get(['id'])!.value,
      purchaseDate: this.editForm.get(['purchaseDate'])!.value
        ? moment(this.editForm.get(['purchaseDate'])!.value, DATE_TIME_FORMAT)
        : undefined,
      equipmentName: this.editForm.get(['equipmentName'])!.value,
      technicalFeatures: this.editForm.get(['technicalFeatures'])!.value,
      serialNumber: this.editForm.get(['serialNumber'])!.value,
      note: this.editForm.get(['note'])!.value,
      user: this.editForm.get(['user'])!.value,
      equipmentGroup: this.editForm.get(['equipmentGroup'])!.value,
      equipmentType: this.editForm.get(['equipmentType'])!.value,
      area: this.editForm.get(['area'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEquipment>>): void {
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
