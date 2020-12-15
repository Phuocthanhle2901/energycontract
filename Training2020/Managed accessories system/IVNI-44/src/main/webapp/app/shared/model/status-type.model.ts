import { IStatusLog } from 'app/shared/model/status-log.model';

export interface IStatusType {
  id?: number;
  statusTitle?: string;
  description?: string;
  statusLogs?: IStatusLog[];
}

export class StatusType implements IStatusType {
  constructor(public id?: number, public statusTitle?: string, public description?: string, public statusLogs?: IStatusLog[]) {}
}
