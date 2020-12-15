import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { IEquipmentGroup, EquipmentGroup } from 'app/shared/model/equipment-group.model';
import { EquipmentGroupService } from './equipment-group.service';

@Component({
  selector: 'jhi-equipment-group-update',
  templateUrl: './equipment-group-update.component.html',
})
export class EquipmentGroupUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    equipmentGroupName: [null, [Validators.required]],
  });

  constructor(protected equipmentGroupService: EquipmentGroupService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ equipmentGroup }) => {
      this.updateForm(equipmentGroup);
    });
  }

  updateForm(equipmentGroup: IEquipmentGroup): void {
    this.editForm.patchValue({
      id: equipmentGroup.id,
      equipmentGroupName: equipmentGroup.equipmentGroupName,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const equipmentGroup = this.createFromForm();
    if (equipmentGroup.id !== undefined) {
      this.subscribeToSaveResponse(this.equipmentGroupService.update(equipmentGroup));
    } else {
      this.subscribeToSaveResponse(this.equipmentGroupService.create(equipmentGroup));
    }
  }

  private createFromForm(): IEquipmentGroup {
    return {
      ...new EquipmentGroup(),
      id: this.editForm.get(['id'])!.value,
      equipmentGroupName: this.editForm.get(['equipmentGroupName'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEquipmentGroup>>): void {
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
