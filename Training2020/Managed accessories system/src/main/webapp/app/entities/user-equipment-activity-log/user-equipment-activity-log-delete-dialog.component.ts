import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IUserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';
import { UserEquipmentActivityLogService } from './user-equipment-activity-log.service';

@Component({
  templateUrl: './user-equipment-activity-log-delete-dialog.component.html',
})
export class UserEquipmentActivityLogDeleteDialogComponent {
  userEquipmentActivityLog?: IUserEquipmentActivityLog;

  constructor(
    protected userEquipmentActivityLogService: UserEquipmentActivityLogService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.userEquipmentActivityLogService.delete(id).subscribe(() => {
      this.eventManager.broadcast('userEquipmentActivityLogListModification');
      this.activeModal.close();
    });
  }
}
