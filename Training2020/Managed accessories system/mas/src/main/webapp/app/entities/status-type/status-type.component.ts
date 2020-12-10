import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStatusType } from 'app/shared/model/status-type.model';
import { StatusTypeService } from './status-type.service';
import { StatusTypeDeleteDialogComponent } from './status-type-delete-dialog.component';

@Component({
  selector: 'jhi-status-type',
  templateUrl: './status-type.component.html',
})
export class StatusTypeComponent implements OnInit, OnDestroy {
  statusTypes?: IStatusType[];
  eventSubscriber?: Subscription;

  constructor(protected statusTypeService: StatusTypeService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.statusTypeService.query().subscribe((res: HttpResponse<IStatusType[]>) => (this.statusTypes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInStatusTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IStatusType): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInStatusTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('statusTypeListModification', () => this.loadAll());
  }

  delete(statusType: IStatusType): void {
    const modalRef = this.modalService.open(StatusTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.statusType = statusType;
  }
}
