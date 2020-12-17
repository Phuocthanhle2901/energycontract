import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from './employee.service';
import { EmployeeDeleteDialogComponent } from './employee-delete-dialog.component';

import * as fileSaver from 'file-saver';

@Component({
  selector: 'jhi-employee',
  templateUrl: './employee.component.html',
})
export class EmployeeComponent implements OnInit, OnDestroy {
  employees?: IEmployee[];
  eventSubscriber?: Subscription;
  selectedFiles: FileList | undefined | null;
  currentFile: File | undefined | null;
  progress = 0;
  message = '';
	
  constructor(protected employeeService: EmployeeService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.employeeService.query().subscribe((res: HttpResponse<IEmployee[]>) => (this.employees = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInEmployees();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IEmployee): number {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInEmployees(): void {
    this.eventSubscriber = this.eventManager.subscribe('employeeListModification', () => this.loadAll());
  }

  delete(employee: IEmployee): void {
    const modalRef = this.modalService.open(EmployeeDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.employee = employee;
  }
  
  exportEmployee(employee: IEmployee): void{
  	this.employeeService.export(employee.id!).subscribe(response => {
  		const filename = response.headers.get('filename');
  		
  		this.saveFile(response.body, filename!);
  	});
  }
  
  exportAllEmployees(): void{
  	this.employeeService.exportAll().subscribe(response => {
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
	  this.employeeService.upload(this.currentFile!).subscribe(
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
