import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEquipment } from 'app/shared/model/equipment.model';
import { EquipmentService } from './equipment.service';
import { EquipmentDeleteDialogComponent } from './equipment-delete-dialog.component';

// @ts-ignore
import * as fileSaver from 'file-saver';

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

  saveFile(data: any, filename?: string): void{
    const blob = new Blob([data], {type: 'text/csv; charset=utf-8'});
    fileSaver.saveAs(blob, filename);
  }

  selectFile(event: Event ): void {
    this.selectedFiles = (event.target as HTMLInputElement)!.files!;
  }

  upload(): void {
    this.progress = 0;

    this.currentFile = this.selectedFiles!.item(0);
    this.equipmentService.upload(this.currentFile!).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progress = Math.round(100 * event.loaded / event.total!);
        } else if (event instanceof HttpResponse) {
          this.message = event.body.message;
        }
      },
      err => {
        this.progress = 0;
        this.message = 'Could not upload the file!';
        this.currentFile = undefined;
      });
    this.selectedFiles = undefined;
  }
}
