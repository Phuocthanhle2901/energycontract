import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import {IArea} from "../../shared/model/area.model";
import {IActionType} from "../../shared/model/action-type.model";
import {IGuaranteeDevices} from "../../shared/model/guarantee-devices.model";

type EntityResponseType = HttpResponse<IGuaranteeDevices>;
type EntityArrayResponseType = HttpResponse<IGuaranteeDevices[]>;

@Injectable({ providedIn: 'root' })
export class GuaranteeDevicesService {
  public resourceUrl = SERVER_API_URL + 'api/guarantee-devicess';

  constructor(protected http: HttpClient) {}

  create(guaranteeDevices: IGuaranteeDevices): Observable<EntityResponseType> {
    return this.http.post<IGuaranteeDevices>(this.resourceUrl, guaranteeDevices, { observe: 'response' });
  }

  update(guaranteeDevices: IGuaranteeDevices): Observable<EntityResponseType> {
    return this.http.put<IGuaranteeDevices>(this.resourceUrl, guaranteeDevices, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGuaranteeDevices>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGuaranteeDevices[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
