import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IActionLog } from 'app/shared/model/action-log.model';

type EntityResponseType = HttpResponse<IActionLog>;
type EntityArrayResponseType = HttpResponse<IActionLog[]>;

@Injectable({ providedIn: 'root' })
export class ActionLogService {
  public resourceUrl = SERVER_API_URL + 'api/action-logs';

  constructor(protected http: HttpClient) {}

  create(actionLog: IActionLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actionLog);
    return this.http
      .post<IActionLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(actionLog: IActionLog): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(actionLog);
    return this.http
      .put<IActionLog>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IActionLog>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IActionLog[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(actionLog: IActionLog): IActionLog {
    const copy: IActionLog = Object.assign({}, actionLog, {
      startDate: actionLog.startDate && actionLog.startDate.isValid() ? actionLog.startDate.toJSON() : undefined,
      expectedEndDate: actionLog.expectedEndDate && actionLog.expectedEndDate.isValid() ? actionLog.expectedEndDate.toJSON() : undefined,
      actualEndDate: actionLog.actualEndDate && actionLog.actualEndDate.isValid() ? actionLog.actualEndDate.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.startDate = res.body.startDate ? moment(res.body.startDate) : undefined;
      res.body.expectedEndDate = res.body.expectedEndDate ? moment(res.body.expectedEndDate) : undefined;
      res.body.actualEndDate = res.body.actualEndDate ? moment(res.body.actualEndDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((actionLog: IActionLog) => {
        actionLog.startDate = actionLog.startDate ? moment(actionLog.startDate) : undefined;
        actionLog.expectedEndDate = actionLog.expectedEndDate ? moment(actionLog.expectedEndDate) : undefined;
        actionLog.actualEndDate = actionLog.actualEndDate ? moment(actionLog.actualEndDate) : undefined;
      });
    }
    return res;
  }
}
