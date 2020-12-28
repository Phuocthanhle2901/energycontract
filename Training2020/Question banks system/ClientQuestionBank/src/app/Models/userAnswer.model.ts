import { ListQuestion } from "./listQuestion.model";

export class UserAnswer{
    id:string;
    email:string;
    theme:string;
    listQuestion:ListQuestion[];
    summary:number;
    date:Date;
}