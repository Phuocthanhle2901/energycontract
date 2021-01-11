import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IForm, Form } from 'app/shared/model/form.model';
import { FormService } from './form.service';
import { IFormType } from 'app/shared/model/form-type.model';
import { FormTypeService } from 'app/entities/form-type/form-type.service';
import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from 'app/entities/employee/employee.service';
import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from 'app/entities/equipment/equipment.service';
import { formStatus } from 'app/shared/model/enumerations/form-status.model';
import { CustomValidators } from 'app/shared/custom-validators/validators';

type SelectableEntity = IFormType | IEmployee | IEquipment;

@Component({
  selector: 'jhi-form-update',
  templateUrl: './form-update.component.html',
})
export class FormUpdateComponent implements OnInit {
  isSaving = false;
  formtypes: IFormType[] = [];
  employees: IEmployee[] = [];
  equipment: IEquipment[] = [];
  employee!: IEmployee | null; 
  defaultStatus = formStatus.WAITING;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    yourName: [null, [
      Validators.required, 
      Validators.minLength(3), 
      Validators.maxLength(50),
      CustomValidators.numberFalse,
      CustomValidators.cannotContainsFirstWhiteSpace,
      CustomValidators.specialCharacterFalse
    ]],
    area: [null, [Validators.required]],
    reason: [null, [Validators.required, Validators.minLength(50), Validators.maxLength(400)]],
    status: [formStatus.WAITING, [Validators.required]],
    formType: [null, [Validators.required]],
    employee: [null, [Validators.required]],
    equipment: [null, [Validators.required]],
  });

  constructor(
    protected formService: FormService,
    protected formTypeService: FormTypeService,
    protected employeeService: EmployeeService,
    protected equipmentService: EquipmentService,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ form }) => {
      this.updateForm(form);

      this.employeeService.getCurrentUserEmployee().subscribe((res: HttpResponse<IEmployee>) => (this.employee = res.body));

      this.formTypeService.query().subscribe((res: HttpResponse<IFormType[]>) => (this.formtypes = res.body || []));

      this.employeeService.query().subscribe((res: HttpResponse<IEmployee[]>) => (this.employees = res.body || []));

      this.equipmentService.query().subscribe((res: HttpResponse<IEquipment[]>) => (this.equipment = res.body || []));
    
      this.editForm.controls['area'].setValue(this.employee?.area?.areaName);
    });
  }

  updateForm(form: IForm): void {
    this.editForm.patchValue({
      id: form.id,
      title: form.title,
      yourName: form.yourName,
      area: form.area,
      reason: form.reason,
      status: form.status,
      formType: form.formType,
      employee: form.employee,
      equipment: form.equipment,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const form = this.createFromForm();
    if (form.id !== undefined) {
      this.subscribeToSaveResponse(this.formService.update(form));
    } else {
      this.subscribeToSaveResponse(this.formService.create(form));
    }
  }

  private createFromForm(): IForm {
    return {
      ...new Form(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      yourName: this.editForm.get(['yourName'])!.value,
      area: this.editForm.get(['area'])!.value,
      reason: this.editForm.get(['reason'])!.value,
      status: this.editForm.get(['status'])!.value,
      formType: this.editForm.get(['formType'])!.value,
      employee: this.editForm.get(['employee'])!.value,
      equipment: this.editForm.get(['equipment'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IForm>>): void {
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
