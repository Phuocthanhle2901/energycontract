import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IUserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';
import { UserEquipmentActivityLogService } from './user-equipment-activity-log.service';
import { UserEquipmentActivityLogDeleteDialogComponent } from './user-equipment-activity-log-delete-dialog.component';

@Component({
  selector: 'jhi-user-equipment-activity-log',
  templateUrl: './user-equipment-activity-log.component.html',
})
export class UserEquipmentActivityLogComponent implements OnInit, OnDestroy {
  userEquipmentActivityLogs?: IUserEquipmentActivityLog[];
  eventSubscriber?: Subscription;

  constructor(
    protected userEquipmentActivityLogService: UserEquipmentActivityLogService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.userEquipmentActivityLogService
      .query()
      .subscribe((res: HttpResponse<IUserEquipmentActivityLog[]>) => (this.userEquipmentActivityLogs = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInUserEquipmentActivityLogs();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IUserEquipmentActivityLog): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInUserEquipmentActivityLogs(): void {
    this.eventSubscriber = this.eventManager.subscribe('userEquipmentActivityLogListModification', () => this.loadAll());
  }

  delete(userEquipmentActivityLog: IUserEquipmentActivityLog): void {
    const modalRef = this.modalService.open(UserEquipmentActivityLogDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.userEquipmentActivityLog = userEquipmentActivityLog;
  }
}
