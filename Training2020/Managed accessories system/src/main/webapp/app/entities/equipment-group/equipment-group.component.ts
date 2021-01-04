import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEquipmentGroup } from 'app/shared/model/equipment-group.model';
import { EquipmentGroupService } from './equipment-group.service';
import { EquipmentGroupDeleteDialogComponent } from './equipment-group-delete-dialog.component';

@Component({
  selector: 'jhi-equipment-group',
  templateUrl: './equipment-group.component.html',
})
export class EquipmentGroupComponent implements OnInit, OnDestroy {
  equipmentGroups?: IEquipmentGroup[];
  eventSubscriber?: Subscription;

  constructor(
    protected equipmentGroupService: EquipmentGroupService,
    protected eventManager: JhiEventManager,
    protected modalService: NgbModal
  ) {}

  loadAll(): void {
    this.equipmentGroupService.query().subscribe((res: HttpResponse<IEquipmentGroup[]>) => (this.equipmentGroups = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEquipmentGroups();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEquipmentGroup): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInEquipmentGroups(): void {
    this.eventSubscriber = this.eventManager.subscribe('equipmentGroupListModification', () => this.loadAll());
  }

  delete(equipmentGroup: IEquipmentGroup): void {
    const modalRef = this.modalService.open(EquipmentGroupDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.equipmentGroup = equipmentGroup;
  }
}
