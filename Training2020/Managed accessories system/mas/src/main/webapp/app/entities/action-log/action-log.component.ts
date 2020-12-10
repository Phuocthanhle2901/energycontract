import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IActionLog } from 'app/shared/model/action-log.model';
import { ActionLogService } from './action-log.service';
import { ActionLogDeleteDialogComponent } from './action-log-delete-dialog.component';

@Component({
  selector: 'jhi-action-log',
  templateUrl: './action-log.component.html',
})
export class ActionLogComponent implements OnInit, OnDestroy {
  actionLogs?: IActionLog[];
  eventSubscriber?: Subscription;

  constructor(protected actionLogService: ActionLogService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.actionLogService.query().subscribe((res: HttpResponse<IActionLog[]>) => (this.actionLogs = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInActionLogs();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IActionLog): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInActionLogs(): void {
    this.eventSubscriber = this.eventManager.subscribe('actionLogListModification', () => this.loadAll());
  }

  delete(actionLog: IActionLog): void {
    const modalRef = this.modalService.open(ActionLogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.actionLog = actionLog;
  }
}
