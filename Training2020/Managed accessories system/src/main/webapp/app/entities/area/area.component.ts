import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IArea } from 'app/shared/model/area.model';
import { AreaService } from './area.service';
import { AreaDeleteDialogComponent } from './area-delete-dialog.component';

@Component({
  selector: 'jhi-area',
  templateUrl: './area.component.html',
})
export class AreaComponent implements OnInit, OnDestroy {
  areas?: IArea[];
  eventSubscriber?: Subscription;

  constructor(protected areaService: AreaService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.areaService.query().subscribe((res: HttpResponse<IArea[]>) => (this.areas = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInAreas();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IArea): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInAreas(): void {
    this.eventSubscriber = this.eventManager.subscribe('areaListModification', () => this.loadAll());
  }

  delete(area: IArea): void {
    const modalRef = this.modalService.open(AreaDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.area = area;
  }
}
