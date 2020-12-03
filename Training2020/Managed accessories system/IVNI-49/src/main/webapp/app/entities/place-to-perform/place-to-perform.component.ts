import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlaceToPerform } from 'app/shared/model/place-to-perform.model';
import { PlaceToPerformService } from './place-to-perform.service';
import { PlaceToPerformDeleteDialogComponent } from './place-to-perform-delete-dialog.component';

@Component({
  selector: 'jhi-place-to-perform',
  templateUrl: './place-to-perform.component.html',
})
export class PlaceToPerformComponent implements OnInit, OnDestroy {
  placeToPerforms?: IPlaceToPerform[];
  eventSubscriber?: Subscription;

  constructor(
    protected placeToPerformService: PlaceToPerformService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.placeToPerformService.query().subscribe((res: HttpResponse<IPlaceToPerform[]>) => (this.placeToPerforms = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInPlaceToPerforms();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IPlaceToPerform): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInPlaceToPerforms(): void {
    this.eventSubscriber = this.eventManager.subscribe('placeToPerformListModification', () => this.loadAll());
  }

  delete(placeToPerform: IPlaceToPerform): void {
    const modalRef = this.modalService.open(PlaceToPerformDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.placeToPerform = placeToPerform;
  }
}
