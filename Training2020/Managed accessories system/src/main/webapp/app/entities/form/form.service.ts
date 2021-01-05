import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IForm } from 'app/shared/model/form.model';

type EntityResponseType = HttpResponse<IForm>;
type EntityArrayResponseType = HttpResponse<IForm[]>;

@Injectable({ providedIn: 'root' })
export class FormService {
  public resourceUrl = SERVER_API_URL + 'api/forms';

  constructor(protected http: HttpClient) {}

  create(form: IForm): Observable<EntityResponseType> {
    return this.http.post<IForm>(this.resourceUrl, form, { observe: 'response' });
  }

  update(form: IForm): Observable<EntityResponseType> {
    return this.http.put<IForm>(this.resourceUrl, form, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IForm>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IForm[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
