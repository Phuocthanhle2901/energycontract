import { IUser } from 'app/core/user/user.model';
import { IArea } from 'app/shared/model/area.model';

export interface IEmployee {
  id?: number;
  phoneNumber?: string;
  user?: IUser;
  areas?: IArea[];
  area?: IArea;
}

export class Employee implements IEmployee {
  constructor(public id?: number, public phoneNumber?: string, public user?: IUser, public areas?: IArea[], public area?: IArea) {}
}
