import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEmployee } from 'app/shared/model/employee.model';

type EntityResponseType = HttpResponse<IEmployee>;
type EntityArrayResponseType = HttpResponse<IEmployee[]>;

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  public resourceUrl = SERVER_API_URL + 'api/employees';

  constructor(protected http: HttpClient) {}

  create(employee: IEmployee): Observable<EntityResponseType> {
    return this.http.post<IEmployee>(this.resourceUrl, employee, { observe: 'response' });
  }

  update(employee: IEmployee): Observable<EntityResponseType> {
    return this.http.put<IEmployee>(this.resourceUrl, employee, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEmployee>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEmployee[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
  
  export(id: number): Observable<HttpResponse<string>> {
  	let headers = new HttpHeaders();
  	headers = headers.append('Accept', 'text/csv; charset=utf-8');
  	
  	return this.http.get('/api/employees-export/' + id, {
      headers,
      observe: 'response',
      responseType: 'text'
    });
  }
  
  exportAll(): Observable<HttpResponse<string>> {
  	let headers = new HttpHeaders();
  	headers = headers.append('Accept', 'text/csv; charset=utf-8');
  	
  	return this.http.get('/api/employees-export/', {
      headers,
      observe: 'response',
      responseType: 'text'
    });
  }
  
  upload(file: File): Observable<HttpEvent<any>>{
  	const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', '/api/employees-import/', formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
