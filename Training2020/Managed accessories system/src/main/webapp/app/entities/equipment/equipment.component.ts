import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from './equipment.service';
import { EquipmentDeleteDialogComponent } from './equipment-delete-dialog.component';

import * as fileSaver from 'file-saver';
import { EquipmentImportDialogComponent } from './equipment-import-dialog.component';

@Component({
  selector: 'jhi-equipment',
  templateUrl: './equipment.component.html',
})
export class EquipmentComponent implements OnInit, OnDestroy {
  equipment?: IEquipment[];
  eventSubscriber?: Subscription;
  selectedFiles: FileList | undefined | null;
  currentFile: File | undefined | null;
  progress = 0;
  message = '';

  constructor(protected equipmentService: EquipmentService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.equipmentService.query().subscribe((res: HttpResponse<IEquipment[]>) => (this.equipment = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEquipment();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEquipment): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInEquipment(): void {
    this.eventSubscriber = this.eventManager.subscribe('equipmentListModification', () => this.loadAll());
  }

  delete(equipment: IEquipment): void {
    const modalRef = this.modalService.open(EquipmentDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.equipment = equipment;
  }
  
  exportEquipment(equipment: IEquipment): void{
    this.equipmentService.export(equipment.id!).subscribe(response => {
      const filename = response.headers.get('filename');

      this.saveFile(response.body, filename!);
    });
  }

  exportAllEquipments(): void{
    this.equipmentService.exportAll().subscribe(response => {
      const filename = response.headers.get('filename');

      this.saveFile(response.body, filename!);
    });
  }

  import(): void {
    this.modalService.open(EquipmentImportDialogComponent, { size: 'lg', backdrop: 'static' });
  }

  saveFile(data: any, filename?: string): void{
    const blob = new Blob([data], {type: 'text/csv; charset=utf-8'});
    fileSaver.saveAs(blob, filename);
  }
}
