import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEquipmentType } from 'app/shared/model/equipment-type.model';
import { EquipmentTypeService } from './equipment-type.service';
import { EquipmentTypeDeleteDialogComponent } from './equipment-type-delete-dialog.component';

@Component({
  selector: 'jhi-equipment-type',
  templateUrl: './equipment-type.component.html',
})
export class EquipmentTypeComponent implements OnInit, OnDestroy {
  equipmentTypes?: IEquipmentType[];
  eventSubscriber?: Subscription;

  constructor(
    protected equipmentTypeService: EquipmentTypeService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.equipmentTypeService.query().subscribe((res: HttpResponse<IEquipmentType[]>) => (this.equipmentTypes = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEquipmentTypes();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEquipmentType): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInEquipmentTypes(): void {
    this.eventSubscriber = this.eventManager.subscribe('equipmentTypeListModification', () => this.loadAll());
  }

  delete(equipmentType: IEquipmentType): void {
    const modalRef = this.modalService.open(EquipmentTypeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.equipmentType = equipmentType;
  }
}
