import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { IForm } from 'app/shared/model/form.model';
import { FormService } from './form.service';

@Component({
  templateUrl: './form-delete-dialog.component.html',
})
export class FormDeleteDialogComponent {
  form?: IForm;

  constructor(protected formService: FormService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.formService.delete(id).subscribe(() => {
      this.eventManager.broadcast('formListModification');
      this.activeModal.close();
    });
  }
}
