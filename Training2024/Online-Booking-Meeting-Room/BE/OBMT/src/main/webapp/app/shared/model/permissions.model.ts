import { IRoles } from 'app/shared/model/roles.model';

export interface IPermissions {
  id?: number;
  permissionName?: string;
  roles?: IRoles[] | null;
}

export const defaultValue: Readonly<IPermissions> = {};
