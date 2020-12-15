import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IStatusType } from 'app/shared/model/status-type.model';
import { StatusTypeService } from './status-type.service';

@Component({
  templateUrl: './status-type-delete-dialog.component.html',
})
export class StatusTypeDeleteDialogComponent {
  statusType?: IStatusType;

  constructor(
    protected statusTypeService: StatusTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.statusTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('statusTypeListModification');
      this.activeModal.close();
    });
  }
}
