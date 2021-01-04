import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import {IEquipmentLiquidation} from "../../shared/model/equipment-liquidation.model";
import {IArea} from "../../shared/model/area.model";
import {IActionType} from "../../shared/model/action-type.model";

type EntityResponseType = HttpResponse<IEquipmentLiquidation>;
type EntityArrayResponseType = HttpResponse<IEquipmentLiquidation[]>;

@Injectable({ providedIn: 'root' })
export class EquipmentLiquidationService {
  public resourceUrl = SERVER_API_URL + 'api/equipment-liquidations';

  constructor(protected http: HttpClient) {}

  create(equipmentLiquidation: IEquipmentLiquidation): Observable<EntityResponseType> {
    return this.http.post<IEquipmentLiquidation>(this.resourceUrl, equipmentLiquidation, { observe: 'response' });
  }

  update(equipmentLiquidation: IEquipmentLiquidation): Observable<EntityResponseType> {
    return this.http.put<IEquipmentLiquidation>(this.resourceUrl, equipmentLiquidation, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEquipmentLiquidation>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEquipmentLiquidation[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
