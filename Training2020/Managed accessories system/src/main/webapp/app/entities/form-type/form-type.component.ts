import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IFormType } from 'app/shared/model/form-type.model';
import { FormTypeService } from './form-type.service';
import { FormTypeDeleteDialogComponent } from './form-type-delete-dialog.component';

@Component({
  selector: 'jhi-form-type',
  templateUrl: './form-type.component.html',
})
export class FormTypeComponent implements OnInit, OnDestroy {
  formTypes?: IFormType[];
  eventSubscriber?: Subscription;

  constructor(protected formTypeService: FormTypeService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.formTypeService.query().subscribe((res: HttpResponse<IFormType[]>) => (this.formTypes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInFormTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IFormType): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInFormTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('formTypeListModification', () => this.loadAll());
  }

  delete(formType: IFormType): void {
    const modalRef = this.modalService.open(FormTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.formType = formType;
  }
}
