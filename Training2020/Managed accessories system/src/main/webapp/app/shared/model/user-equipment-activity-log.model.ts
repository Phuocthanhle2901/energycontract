import { Moment } from 'moment';
import { IEmployee } from 'app/shared/model/employee.model';
import { IEquipment } from 'app/shared/model/equipment.model';

export interface IUserEquipmentActivityLog {
  id?: number;
  activity?: string;
  date?: Moment;
  user?: IEmployee;
  equipment?: IEquipment;
}

export class UserEquipmentActivityLog implements IUserEquipmentActivityLog {
  constructor(public id?: number, public activity?: string, public date?: Moment, public user?: IEmployee, public equipment?: IEquipment) {}
}
