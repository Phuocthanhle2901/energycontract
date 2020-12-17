import { Moment } from 'moment';
import { IEmployee } from 'app/shared/model/employee.model';
import { IActionType } from 'app/shared/model/action-type.model';
import { IPlaceToPerform } from 'app/shared/model/place-to-perform.model';
import { IEquipment } from 'app/shared/model/equipment.model';

export interface IActionLog {
  id?: number;
  startDate?: Moment;
  expectedEndDate?: Moment;
  actualEndDate?: Moment;
  price?: number;
  note?: string;
  user?: IEmployee;
  actionType?: IActionType;
  placeToPerform?: IPlaceToPerform;
  equipment?: IEquipment;
}

export class ActionLog implements IActionLog {
  constructor(
    public id?: number,
    public startDate?: Moment,
    public expectedEndDate?: Moment,
    public actualEndDate?: Moment,
    public price?: number,
    public note?: string,
    public user?: IEmployee,
    public actionType?: IActionType,
    public placeToPerform?: IPlaceToPerform,
    public equipment?: IEquipment
  ) {}
}
