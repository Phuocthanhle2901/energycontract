import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IStatusLog } from 'app/shared/model/status-log.model';
import { StatusLogService } from './status-log.service';
import { StatusLogDeleteDialogComponent } from './status-log-delete-dialog.component';

@Component({
  selector: 'jhi-status-log',
  templateUrl: './status-log.component.html',
})
export class StatusLogComponent implements OnInit, OnDestroy {
  statusLogs?: IStatusLog[];
  eventSubscriber?: Subscription;

  constructor(protected statusLogService: StatusLogService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.statusLogService.query().subscribe((res: HttpResponse<IStatusLog[]>) => (this.statusLogs = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInStatusLogs();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IStatusLog): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInStatusLogs(): void {
    this.eventSubscriber = this.eventManager.subscribe('statusLogListModification', () => this.loadAll());
  }

  delete(statusLog: IStatusLog): void {
    const modalRef = this.modalService.open(StatusLogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.statusLog = statusLog;
  }
}
