import { Moment } from 'moment';
import { IActionLog } from 'app/shared/model/action-log.model';

export interface IPlaceToPerform {
  id?: number;
  placeName?: string;
  address?: string;
  phoneNumber?: string;
  email?: string;
  representativeName?: Moment;
  actionLogs?: IActionLog[];
}

export class PlaceToPerform implements IPlaceToPerform {
  constructor(
    public id?: number,
    public placeName?: string,
    public address?: string,
    public phoneNumber?: string,
    public email?: string,
    public representativeName?: Moment,
    public actionLogs?: IActionLog[]
  ) {}
}
