import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import {IArea} from "../../shared/model/area.model";
import {IActionType} from "../../shared/model/action-type.model";
import {IProposingBuyEquipment} from "../../shared/model/proposing-buy-equipment.model";

type EntityResponseType = HttpResponse<IProposingBuyEquipment>;
type EntityArrayResponseType = HttpResponse<IProposingBuyEquipment[]>;

@Injectable({ providedIn: 'root' })
export class EquipmentLiquidationService {
  public resourceUrl = SERVER_API_URL + 'api/proposing-buy-equipments';

  constructor(protected http: HttpClient) {}

  create(proposingBuyEquipment: IProposingBuyEquipment): Observable<EntityResponseType> {
    return this.http.post<IProposingBuyEquipment>(this.resourceUrl, proposingBuyEquipment, { observe: 'response' });
  }

  update(proposingBuyEquipment: IProposingBuyEquipment): Observable<EntityResponseType> {
    return this.http.put<IProposingBuyEquipment>(this.resourceUrl, proposingBuyEquipment, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IProposingBuyEquipment>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProposingBuyEquipment[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
