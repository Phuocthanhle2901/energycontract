import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEmployee } from 'app/shared/model/employee.model';
import { EmployeeService } from './employee.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'jhi-employee-detail',
  templateUrl: './employee-detail.component.html',
})
export class EmployeeDetailComponent implements OnInit {
  employee: IEmployee | null = null;

  constructor(protected activatedRoute: ActivatedRoute, 
  			  protected employeeService: EmployeeService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ employee }) => (this.employee = employee));
  }

  previousState(): void {
    window.history.back();
  }
  
  exportEmployee(employee: IEmployee): void{
  	this.employeeService.export(employee.id!).subscribe(file => {
  		FileSaver.saveAs(file, "user");
  	});
  }
}
