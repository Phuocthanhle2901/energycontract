import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IForm } from 'app/shared/model/form.model';
import { FormService } from './form.service';
import { FormDeleteDialogComponent } from './form-delete-dialog.component';
import { formStatus } from 'app/shared/model/enumerations/form-status.model';

@Component({
  selector: 'jhi-form',
  templateUrl: './form.component.html',
})
export class FormComponent implements OnInit, OnDestroy {
  forms?: IForm[];
  eventSubscriber?: Subscription;
  status?: formStatus;

  constructor(protected formService: FormService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.formService.query().subscribe((res: HttpResponse<IForm[]>) => (this.forms = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInForms();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IForm): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInForms(): void {
    this.eventSubscriber = this.eventManager.subscribe('formListModification', () => this.loadAll());
  }

  delete(form: IForm): void {
    const modalRef = this.modalService.open(FormDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.form = form;
  }

  checkStatus(form: IForm): string {
    switch(form.status){
      case formStatus.ACCEPT:
        return "text-success";
      case formStatus.REFUSE:
        return "text-danger";
      case formStatus.WAITING:
        return "text-warning"

      default:
        return "";
    }
  }

  disableAcceprOrRefuse(form: IForm): boolean {
    return form.status === formStatus.ACCEPT || form.status === formStatus.REFUSE;
  }

  accept(id: number): void {
    this.formService.changeStatus(id, formStatus.ACCEPT)
    .subscribe(() => {
        this.ngOnInit();
      }),(err: any) => {
        console.error(err);
      };
  }

  refuse(id: number): void {
    this.formService.changeStatus(id, formStatus.REFUSE)
    .subscribe(() => {
        this.ngOnInit();
      }),(err: any) => {
        console.error(err);
      };
  }
}
