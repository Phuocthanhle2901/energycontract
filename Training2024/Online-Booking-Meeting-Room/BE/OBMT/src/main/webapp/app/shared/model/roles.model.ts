import { IPermissions } from 'app/shared/model/permissions.model';
import { IAppUsers } from 'app/shared/model/app-users.model';

export interface IRoles {
  id?: number;
  roleName?: string;
  permissions?: IPermissions[] | null;
  appusers?: IAppUsers[] | null;
}

export const defaultValue: Readonly<IRoles> = {};
