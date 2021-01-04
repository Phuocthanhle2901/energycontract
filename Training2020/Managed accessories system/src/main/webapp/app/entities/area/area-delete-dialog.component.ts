import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IArea } from 'app/shared/model/area.model';
import { AreaService } from './area.service';

@Component({
  templateUrl: './area-delete-dialog.component.html',
})
export class AreaDeleteDialogComponent {
  area?: IArea;

  constructor(protected areaService: AreaService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.areaService.delete(id).subscribe(() => {
      this.eventManager.broadcast('areaListModification');
      this.activeModal.close();
    });
  }
}
