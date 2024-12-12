import { Moment } from 'moment';
import { IActionLog } from 'app/shared/model/action-log.model';
import { IStatusLog } from 'app/shared/model/status-log.model';
import { IUserEquipmentActivityLog } from 'app/shared/model/user-equipment-activity-log.model';
import { IEmployee } from 'app/shared/model/employee.model';
import { IEquipmentGroup } from 'app/shared/model/equipment-group.model';
import { IEquipmentType } from 'app/shared/model/equipment-type.model';
import { IArea } from 'app/shared/model/area.model';

export interface IEquipment {
  id?: number;
  purchaseDate?: Moment;
  equipmentName?: string;
  technicalFeatures?: string;
  serialNumber?: string;
  note?: string;
  actionLogs?: IActionLog[];
  statusLogs?: IStatusLog[];
  userEquipmentActivityLogs?: IUserEquipmentActivityLog[];
  user?: IEmployee;
  equipmentGroup?: IEquipmentGroup;
  equipmentType?: IEquipmentType;
  area?: IArea;
}

export class Equipment implements IEquipment {
  constructor(
    public id?: number,
    public purchaseDate?: Moment,
    public equipmentName?: string,
    public technicalFeatures?: string,
    public serialNumber?: string,
    public note?: string,
    public actionLogs?: IActionLog[],
    public statusLogs?: IStatusLog[],
    public userEquipmentActivityLogs?: IUserEquipmentActivityLog[],
    public user?: IEmployee,
    public equipmentGroup?: IEquipmentGroup,
    public equipmentType?: IEquipmentType,
    public area?: IArea
  ) {}
}
