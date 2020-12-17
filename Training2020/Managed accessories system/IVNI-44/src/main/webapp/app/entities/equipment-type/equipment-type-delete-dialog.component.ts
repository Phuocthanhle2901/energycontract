import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEquipmentType } from 'app/shared/model/equipment-type.model';
import { EquipmentTypeService } from './equipment-type.service';

@Component({
  templateUrl: './equipment-type-delete-dialog.component.html',
})
export class EquipmentTypeDeleteDialogComponent {
  equipmentType?: IEquipmentType;

  constructor(
    protected equipmentTypeService: EquipmentTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.equipmentTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('equipmentTypeListModification');
      this.activeModal.close();
    });
  }
}
