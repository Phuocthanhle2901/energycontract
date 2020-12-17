import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IActionType } from 'app/shared/model/action-type.model';
import { ActionTypeService } from './action-type.service';

@Component({
  templateUrl: './action-type-delete-dialog.component.html',
})
export class ActionTypeDeleteDialogComponent {
  actionType?: IActionType;

  constructor(
    protected actionTypeService: ActionTypeService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.actionTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('actionTypeListModification');
      this.activeModal.close();
    });
  }
}
