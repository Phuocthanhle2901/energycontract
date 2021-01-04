import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IStatusType } from 'app/shared/model/status-type.model';

type EntityResponseType = HttpResponse<IStatusType>;
type EntityArrayResponseType = HttpResponse<IStatusType[]>;

@Injectable({ providedIn: 'root' })
export class StatusTypeService {
  public resourceUrl = SERVER_API_URL + 'api/status-types';

  constructor(protected http: HttpClient) {}

  create(statusType: IStatusType): Observable<EntityResponseType> {
    return this.http.post<IStatusType>(this.resourceUrl, statusType, { observe: 'response' });
  }

  update(statusType: IStatusType): Observable<EntityResponseType> {
    return this.http.put<IStatusType>(this.resourceUrl, statusType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IStatusType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IStatusType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
