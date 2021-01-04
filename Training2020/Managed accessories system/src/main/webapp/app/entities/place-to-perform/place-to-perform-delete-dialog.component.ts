import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IPlaceToPerform } from 'app/shared/model/place-to-perform.model';
import { PlaceToPerformService } from './place-to-perform.service';

@Component({
  templateUrl: './place-to-perform-delete-dialog.component.html',
})
export class PlaceToPerformDeleteDialogComponent {
  placeToPerform?: IPlaceToPerform;

  constructor(
    protected placeToPerformService: PlaceToPerformService,
    public activeModal: NgbActiveModal,
    protected eventManager: JhiEventManager
  ) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.placeToPerformService.delete(id).subscribe(() => {
      this.eventManager.broadcast('placeToPerformListModification');
      this.activeModal.close();
    });
  }
}
