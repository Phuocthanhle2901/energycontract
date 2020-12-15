import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEquipmentGroup } from 'app/shared/model/equipment-group.model';
import { EquipmentGroupService } from './equipment-group.service';

@Component({
  templateUrl: './equipment-group-delete-dialog.component.html',
})
export class EquipmentGroupDeleteDialogComponent {
  equipmentGroup?: IEquipmentGroup;

  constructor(
    protected equipmentGroupService: EquipmentGroupService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.equipmentGroupService.delete(id).subscribe(() => {
      this.eventManager.broadcast('equipmentGroupListModification');
      this.activeModal.close();
    });
  }
}
