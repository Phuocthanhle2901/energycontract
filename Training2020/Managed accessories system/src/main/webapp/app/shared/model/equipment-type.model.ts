import { IEquipment } from 'app/shared/model/equipment.model';

export interface IEquipmentType {
  id?: number;
  equipmentTypeName?: string;
  equipment?: IEquipment[];
}

export class EquipmentType implements IEquipmentType {
  constructor(public id?: number, public equipmentTypeName?: string, public equipment?: IEquipment[]) {}
}
