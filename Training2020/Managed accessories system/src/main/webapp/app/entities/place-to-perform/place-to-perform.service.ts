import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IPlaceToPerform } from 'app/shared/model/place-to-perform.model';

type EntityResponseType = HttpResponse<IPlaceToPerform>;
type EntityArrayResponseType = HttpResponse<IPlaceToPerform[]>;

@Injectable({ providedIn: 'root' })
export class PlaceToPerformService {
  public resourceUrl = SERVER_API_URL + 'api/place-to-performs';

  constructor(protected http: HttpClient) {}

  create(placeToPerform: IPlaceToPerform): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(placeToPerform);
    return this.http
      .post<IPlaceToPerform>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(placeToPerform: IPlaceToPerform): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(placeToPerform);
    return this.http
      .put<IPlaceToPerform>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IPlaceToPerform>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IPlaceToPerform[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(placeToPerform: IPlaceToPerform): IPlaceToPerform {
    const copy: IPlaceToPerform = Object.assign({}, placeToPerform, {
      representativeName:
        placeToPerform.representativeName && placeToPerform.representativeName.isValid()
          ? placeToPerform.representativeName.toJSON()
          : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.representativeName = res.body.representativeName ? moment(res.body.representativeName) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((placeToPerform: IPlaceToPerform) => {
        placeToPerform.representativeName = placeToPerform.representativeName ? moment(placeToPerform.representativeName) : undefined;
      });
    }
    return res;
  }
}
