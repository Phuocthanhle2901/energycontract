import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IFormType } from 'app/shared/model/form-type.model';
import { FormTypeService } from './form-type.service';

@Component({
  templateUrl: './form-type-delete-dialog.component.html',
})
export class FormTypeDeleteDialogComponent {
  formType?: IFormType;

  constructor(protected formTypeService: FormTypeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.formTypeService.delete(id).subscribe(() => {
      this.eventManager.broadcast('formTypeListModification');
      this.activeModal.close();
    });
  }
}
