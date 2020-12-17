import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IUserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';

type EntityResponseType = HttpResponse<IUserEquipmentActivityLog>;
type EntityArrayResponseType = HttpResponse<IUserEquipmentActivityLog[]>;

@Injectable({ providedIn: 'root' })
export class UserEquipmentActivityLogService {
  public resourceUrl = SERVER_API_URL + 'api/user-equipment-activity-logs';

  constructor(protected http: HttpClient) {}

  create(userEquipmentActivityLog: IUserEquipmentActivityLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userEquipmentActivityLog);
    return this.http
      .post<IUserEquipmentActivityLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(userEquipmentActivityLog: IUserEquipmentActivityLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(userEquipmentActivityLog);
    return this.http
      .put<IUserEquipmentActivityLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUserEquipmentActivityLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUserEquipmentActivityLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(userEquipmentActivityLog: IUserEquipmentActivityLog): IUserEquipmentActivityLog {
    const copy: IUserEquipmentActivityLog = Object.assign({}, userEquipmentActivityLog, {
      date: userEquipmentActivityLog.date && userEquipmentActivityLog.date.isValid() ? userEquipmentActivityLog.date.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.date = res.body.date ? moment(res.body.date) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((userEquipmentActivityLog: IUserEquipmentActivityLog) => {
        userEquipmentActivityLog.date = userEquipmentActivityLog.date ? moment(userEquipmentActivityLog.date) : undefined;
      });
    }
    return res;
  }
}
