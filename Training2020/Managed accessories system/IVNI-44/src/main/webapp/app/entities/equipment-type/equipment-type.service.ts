import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IEquipmentType } from 'app/shared/model/equipment-type.model';

type EntityResponseType = HttpResponse<IEquipmentType>;
type EntityArrayResponseType = HttpResponse<IEquipmentType[]>;

@Injectable({ providedIn: 'root' })
export class EquipmentTypeService {
  public resourceUrl = SERVER_API_URL + 'api/equipment-types';

  constructor(protected http: HttpClient) {}

  create(equipmentType: IEquipmentType): Observable<EntityResponseType> {
    return this.http.post<IEquipmentType>(this.resourceUrl, equipmentType, { observe: 'response' });
  }

  update(equipmentType: IEquipmentType): Observable<EntityResponseType> {
    return this.http.put<IEquipmentType>(this.resourceUrl, equipmentType, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEquipmentType>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEquipmentType[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }
}
