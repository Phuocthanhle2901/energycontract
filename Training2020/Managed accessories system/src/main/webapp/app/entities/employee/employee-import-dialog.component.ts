import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { HttpEventType, HttpResponse } from '@angular/common/http';

import { IEmployee } from "app/shared/model/employee.model";
import { EmployeeService } from './employee.service';

import * as fileSaver from 'file-saver';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';

@Component({
    templateUrl: './employee-import-dialog.component.html',
})
export class EmployeeImportDialogComponent {
    employee?: IEmployee;
    file: File | undefined | null;
    progress = 0;
    message = '';

    constructor(protected employeeService: EmployeeService, public activeModal: NgbActiveModal, protected eventManager: JhiEventManager) {}

    cancel(): void {
        this.activeModal.dismiss();
    }

    saveFile(data: any, filename?: string): void{
        const blob = new Blob([data], {type: 'text/csv; charset=utf-8'});
        fileSaver.saveAs(blob, filename);
    }
     
    selectFile(event: Event ): void {
        this.file = (event.target as HTMLInputElement)!.files!.item(0);
    }

    dropFile(event: NgxDropzoneChangeEvent ): void {
        this.file = event.addedFiles[0];
    }

    confirmImport(): void {
        this.progress = 0;
	
        this.employeeService.upload(this.file!).subscribe(
            event => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.progress = Math.round(100 * event.loaded / event.total!);
                } else if (event instanceof HttpResponse) {
                    this.message = event.body.message;
                }
                this.eventManager.broadcast('employeeListModification');
                this.activeModal.close();
            },
            () => {
                this.progress = 0;
                this.message = 'Could not upload the file!';
                this.file = undefined;
            });
        this.file = undefined;
    }
}