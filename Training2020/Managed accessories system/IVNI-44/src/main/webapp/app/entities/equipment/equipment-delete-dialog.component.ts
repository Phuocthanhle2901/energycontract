import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from './equipment.service';

@Component({
  templateUrl: './equipment-delete-dialog.component.html',
})
export class EquipmentDeleteDialogComponent {
  equipment?: IEquipment;

  constructor(protected equipmentService: EquipmentService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.equipmentService.delete(id).subscribe(() => {
      this.eventManager.broadcast('equipmentListModification');
      this.activeModal.close();
    });
  }
}
