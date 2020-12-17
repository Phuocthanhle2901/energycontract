import { IActionLog } from 'app/shared/model/action-log.model';

export interface IActionType {
  id?: number;
  actionTitle?: string;
  description?: string;
  actionLogs?: IActionLog[];
}

export class ActionType implements IActionType {
  constructor(public id?: number, public actionTitle?: string, public description?: string, public actionLogs?: IActionLog[]) {}
}
