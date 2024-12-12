export interface IFormType {
  id?: number;
  name?: string;
}

export class FormType implements IFormType {
  constructor(public id?: number, public name?: string) {}
}
