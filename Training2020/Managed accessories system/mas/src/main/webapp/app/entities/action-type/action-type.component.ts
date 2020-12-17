import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IActionType } from 'app/shared/model/action-type.model';
import { ActionTypeService } from './action-type.service';
import { ActionTypeDeleteDialogComponent } from './action-type-delete-dialog.component';

@Component({
  selector: 'jhi-action-type',
  templateUrl: './action-type.component.html',
})
export class ActionTypeComponent implements OnInit, OnDestroy {
  actionTypes?: IActionType[];
  eventSubscriber?: Subscription;

  constructor(protected actionTypeService: ActionTypeService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.actionTypeService.query().subscribe((res: HttpResponse<IActionType[]>) => (this.actionTypes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInActionTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IActionType): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInActionTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('actionTypeListModification', () => this.loadAll());
  }

  delete(actionType: IActionType): void {
    const modalRef = this.modalService.open(ActionTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.actionType = actionType;
  }
}
