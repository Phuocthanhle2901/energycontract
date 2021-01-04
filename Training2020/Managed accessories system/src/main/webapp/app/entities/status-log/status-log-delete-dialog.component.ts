import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IStatusLog } from 'app/shared/model/status-log.model';
import { StatusLogService } from './status-log.service';

@Component({
  templateUrl: './status-log-delete-dialog.component.html',
})
export class StatusLogDeleteDialogComponent {
  statusLog?: IStatusLog;

  constructor(protected statusLogService: StatusLogService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.statusLogService.delete(id).subscribe(() => {
      this.eventManager.broadcast('statusLogListModification');
      this.activeModal.close();
    });
  }
}
