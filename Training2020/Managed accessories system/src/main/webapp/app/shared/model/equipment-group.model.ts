import { IEquipment } from 'app/shared/model/equipment.model';

export interface IEquipmentGroup {
  id?: number;
  equipmentGroupName?: string;
  equipment?: IEquipment[];
}

export class EquipmentGroup implements IEquipmentGroup {
  constructor(public id?: number, public equipmentGroupName?: string, public equipment?: IEquipment[]) {}
}
