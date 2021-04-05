import { IEquipment } from 'app/shared/model/equipment.model';
import { IEmployee } from 'app/shared/model/employee.model';

export interface IArea {
  id?: number;
  areaName?: string;
  equipment?: IEquipment[];
  employees?: IEmployee[];
  leader?: IEmployee;
}

export class Area implements IArea {
  constructor(
    public id?: number,
    public areaName?: string,
    public equipment?: IEquipment[],
    public employees?: IEmployee[],
    public leader?: IEmployee
  ) {}
}
