import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IFormType } from 'app/shared/model/form-type.model';

type EntityResponseType = HttpResponse<IFormType>;
type EntityArrayResponseType = HttpResponse<IFormType[]>;

@Injectable({ providedIn: 'root' })
export class FormTypeService {
  public resourceUrl = SERVER_API_URL + 'api/form-types';

  constructor(protected http: HttpClient) {}

  create(formType: IFormType): Observable<EntityResponseType> {
    return this.http.post<IFormType>(this.resourceUrl, formType, { observe: 'response' });
  }

  update(formType: IFormType): Observable<EntityResponseType> {
    return this.http.put<IFormType>(this.resourceUrl, formType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IFormType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IFormType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
