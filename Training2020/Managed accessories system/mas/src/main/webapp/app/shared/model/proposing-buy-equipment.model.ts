import { IArea } from 'app/shared/model/area.model';

export interface IProposingBuyEquipment {
  title?: string;
  yourname?: string;
  area?: IArea[];
  devicename?: string;
  quantity?: number;
  reason?: string;
}

export class ProposingBuyEquipment implements IProposingBuyEquipment {
  constructor(
    public title?: string,
    public yourname?: string,
    public area?: IArea[],
    public devicename?: string,
    public quantity?: number,
    public reason?: string
  ) {}
}
