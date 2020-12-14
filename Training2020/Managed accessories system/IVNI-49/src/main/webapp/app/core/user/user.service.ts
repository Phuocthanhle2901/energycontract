import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption, Pagination } from 'app/shared/util/request-util';
import { IUser } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  public resourceUrl = SERVER_API_URL + 'api/users';

  constructor(private http: HttpClient) {}

  create(user: IUser): Observable<IUser> {
    return this.http.post<IUser>(this.resourceUrl, user);
  }

  update(user: IUser): Observable<IUser> {
    return this.http.put<IUser>(this.resourceUrl, user);
  }

  find(login: string): Observable<IUser> {
    return this.http.get<IUser>(`${this.resourceUrl}/${login}`);
  }

  query(req?: Pagination): Observable<HttpResponse<IUser[]>> {
    const options = createRequestOption(req);
    return this.http.get<IUser[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(login: string): Observable<{}> {
    return this.http.delete(`${this.resourceUrl}/${login}`);
  }

  authorities(): Observable<string[]> {
    return this.http.get<string[]>(SERVER_API_URL + 'api/users/authorities');
  }
  
  export(id: number): Observable<HttpResponse<string>> {
  	let headers = new HttpHeaders();
  	headers = headers.append('Accept', 'text/csv; charset=utf-8');
  	
  	return this.http.get('/api/users-export/' + id, {
      headers,
      observe: 'response',
      responseType: 'text'
    });
  }
  
  exportAll(): Observable<HttpResponse<string>> {
  	let headers = new HttpHeaders();
  	headers = headers.append('Accept', 'text/csv; charset=utf-8');
  	
  	return this.http.get('/api/users-export/', {
      headers,
      observe: 'response',
      responseType: 'text'
    });
  }
  
  upload(file: File): Observable<HttpEvent<any>>{
  	const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', '/api/users-import/', formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }
}
