import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IActionType } from 'app/shared/model/action-type.model';

type EntityResponseType = HttpResponse<IActionType>;
type EntityArrayResponseType = HttpResponse<IActionType[]>;

@Injectable({ providedIn: 'root' })
export class ActionTypeService {
  public resourceUrl = SERVER_API_URL + 'api/action-types';

  constructor(protected http: HttpClient) {}

  create(actionType: IActionType): Observable<EntityResponseType> {
    return this.http.post<IActionType>(this.resourceUrl, actionType, { observe: 'response' });
  }

  update(actionType: IActionType): Observable<EntityResponseType> {
    return this.http.put<IActionType>(this.resourceUrl, actionType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IActionType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IActionType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
