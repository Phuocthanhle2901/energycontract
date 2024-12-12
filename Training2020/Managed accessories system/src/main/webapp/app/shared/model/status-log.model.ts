import { Moment } from 'moment';
import { IStatusType } from 'app/shared/model/status-type.model';
import { IEquipment } from 'app/shared/model/equipment.model';

export interface IStatusLog {
  id?: number;
  statusDateTime?: Moment;
  note?: string;
  statusType?: IStatusType;
  equipment?: IEquipment;
}

export class StatusLog implements IStatusLog {
  constructor(
    public id?: number,
    public statusDateTime?: Moment,
    public note?: string,
    public statusType?: IStatusType,
    public equipment?: IEquipment
  ) {}
}
