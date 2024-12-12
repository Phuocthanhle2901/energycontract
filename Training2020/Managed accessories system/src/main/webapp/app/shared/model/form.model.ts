import { IFormType } from 'app/shared/model/form-type.model';
import { IEmployee } from 'app/shared/model/employee.model';
import { IEquipment } from 'app/shared/model/equipment.model';
import { formStatus } from 'app/shared/model/enumerations/form-status.model';

export interface IForm {
  id?: number;
  title?: string;
  yourName?: string;
  area?: string;
  reason?: string;
  status?: formStatus;
  formType?: IFormType;
  employee?: IEmployee;
  equipment?: IEquipment;
}

export class Form implements IForm {
  constructor(
    public id?: number,
    public title?: string,
    public yourName?: string,
    public area?: string,
    public reason?: string,
    public status?: formStatus,
    public formType?: IFormType,
    public employee?: IEmployee,
    public equipment?: IEquipment
  ) {}
}
